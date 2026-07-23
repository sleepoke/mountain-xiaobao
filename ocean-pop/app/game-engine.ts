import {
  FIRE_COOLDOWNS,
  type AmmoKind,
  type BubbleCell,
  type BubbleKind,
  type GameMode,
  type LevelConfig,
  cellKey,
  columnsForRow,
  advanceLeopards,
  findCluster,
  findFloating,
  makeSeededRandom,
  neighborCoords,
  reflectHorizontal,
  scoreForRemoval,
} from "./game-core";

const WIDTH = 390;
const HEIGHT = 560;
const RADIUS = 19;
const DIAMETER = 40;
const ROW_STEP = 34;
const BOARD_TOP = 22;
const DANGER_Y = 445;
const SHOOTER_X = WIDTH / 2;
const SHOOTER_Y = 514;
const PROJECTILE_SPEED = 530;

const KIND_COLORS: Record<BubbleKind, [string, string, string]> = {
  fish: ["#56d8ff", "#118bd4", "#075b9f"],
  shrimp: ["#ffb08f", "#f36d78", "#b93663"],
  squid: ["#c9a7ff", "#8d62e9", "#50309d"],
  crab: ["#ff8279", "#e6484c", "#9f2636"],
  lobster: ["#ff9e55", "#f05a32", "#a42a27"],
  kelp: ["#8de28d", "#39ad73", "#167061"],
  shell: ["#ffe1a1", "#eaa75c", "#ad663e"],
  leopard: ["#ffd77a", "#d88b37", "#6e422c"],
};

export interface EngineSnapshot {
  score: number;
  combo: number;
  misses: number;
  missLimit: number;
  nextKind: BubbleKind;
  currentKind: BubbleKind;
  selectedAmmo: AmmoKind;
  cooldownProgress: number;
  phase: "playing" | "paused" | "won" | "lost";
  penguinFrame: number;
  bubbleCount: number;
}

interface EngineOptions {
  mode: GameMode;
  config: LevelConfig;
  fireRateLevel: number;
  muted: boolean;
  onSnapshot: (snapshot: EngineSnapshot) => void;
  onFinish: (result: { won: boolean; score: number }) => void;
  consumeAmmo: (ammo: AmmoKind) => boolean;
  rewardAmmo: (ammo: Exclude<AmmoKind, "normal">, amount: number) => void;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ammo: AmmoKind;
  kind: BubbleKind;
  pierced: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

class TinyAudio {
  private context: AudioContext | null = null;
  muted = false;

  constructor(muted: boolean) {
    this.muted = muted;
  }

  unlock() {
    if (this.muted) return;
    if (!this.context) {
      this.context = new AudioContext();
    }
    if (this.context.state === "suspended") void this.context.resume();
  }

  tone(frequency: number, duration: number, type: OscillatorType = "sine") {
    if (this.muted) return;
    this.unlock();
    if (!this.context) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(80, frequency * 0.72),
      now + duration,
    );
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.13, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }
}

export class OceanPopEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private options: EngineOptions;
  private grid = new Map<string, BubbleCell>();
  private projectiles: Projectile[] = [];
  private particles: Particle[] = [];
  private images: HTMLImageElement[] = [];
  private rng: () => number;
  private animationId = 0;
  private lastTime = 0;
  private accumulator = 0;
  private lastSnapshot = 0;
  private lastFire = -1000;
  private nextId = 1;
  private activeKinds: BubbleKind[];
  private currentKind: BubbleKind;
  private nextKind: BubbleKind;
  private selectedAmmo: AmmoKind = "normal";
  private aimX = SHOOTER_X;
  private aimY = 160;
  private holding = false;
  private score = 0;
  private combo = 0;
  private misses = 0;
  private shotCount = 0;
  private phase: EngineSnapshot["phase"] = "playing";
  private penguinFrame = 1;
  private penguinUntil = 0;
  private audio: TinyAudio;

  constructor(canvas: HTMLCanvasElement, options: EngineOptions) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable");
    this.ctx = context;
    this.options = options;
    this.rng = makeSeededRandom(options.config.seed);
    this.activeKinds = [...options.config.kinds];
    this.currentKind = this.randomKind();
    this.nextKind = this.randomKind();
    this.audio = new TinyAudio(options.muted);
    this.prepareCanvas();
    this.loadPenguins();
    this.createBoard();
    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame(this.frame);
  }

  private prepareCanvas() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = WIDTH * dpr;
    this.canvas.height = HEIGHT * dpr;
    this.canvas.style.aspectRatio = `${WIDTH} / ${HEIGHT}`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private loadPenguins() {
    this.images = Array.from({ length: 16 }, (_, index) => {
      const image = new Image();
      image.src = `/penguins/penguin-${String(index + 1).padStart(2, "0")}.png`;
      return image;
    });
  }

  private createBoard() {
    const candidates: BubbleCell[] = [];
    for (let row = 0; row < this.options.config.rows; row += 1) {
      for (let col = 0; col < columnsForRow(row); col += 1) {
        let kind = this.randomKind();
        const previous = candidates.filter(
          (cell) => cell.row === row && (cell.col === col - 1 || cell.col === col - 2),
        );
        if (previous.length === 2 && previous.every((cell) => cell.kind === kind)) {
          kind = this.activeKinds[(this.activeKinds.indexOf(kind) + 1) % this.activeKinds.length];
        }
        candidates.push({ id: this.nextId++, row, col, kind });
      }
    }
    const replaceable = candidates.filter((cell) => cell.row > 0);
    for (let i = 0; i < this.options.config.leopardCount && replaceable.length; i += 1) {
      const index = Math.floor(this.rng() * replaceable.length);
      const chosen = replaceable.splice(index, 1)[0];
      chosen.kind = "leopard";
      chosen.leopardTimer = 3;
    }
    for (const cell of candidates) this.grid.set(cellKey(cell.row, cell.col), cell);
  }

  private randomKind() {
    return this.activeKinds[Math.floor(this.rng() * this.activeKinds.length)];
  }

  private center(row: number, col: number) {
    return {
      x: 25 + col * DIAMETER + (row % 2 ? RADIUS : 0),
      y: BOARD_TOP + row * ROW_STEP,
    };
  }

  private frame = (time: number) => {
    const elapsed = Math.min(50, time - this.lastTime);
    this.lastTime = time;
    this.accumulator += elapsed / 1000;
    while (this.accumulator >= 1 / 120) {
      this.update(1 / 120, time);
      this.accumulator -= 1 / 120;
    }
    this.draw(time);
    if (time - this.lastSnapshot > 75) {
      this.emitSnapshot(time);
      this.lastSnapshot = time;
    }
    this.animationId = requestAnimationFrame(this.frame);
  };

  private update(dt: number, time: number) {
    if (this.phase !== "playing") return;
    if (this.holding && time - this.lastFire >= this.cooldown) this.shoot(time);
    if (this.penguinUntil && time > this.penguinUntil) {
      this.penguinFrame = this.nearDanger ? 4 : 1;
      this.penguinUntil = 0;
    }

    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;

      const reflected = reflectHorizontal(
        projectile.x,
        projectile.vx,
        RADIUS,
        WIDTH - RADIUS,
      );
      if (reflected.velocityX !== projectile.vx) {
        projectile.x = reflected.x;
        projectile.vx = reflected.velocityX;
        this.audio.tone(260, 0.04);
      }

      let collision: BubbleCell | undefined;
      for (const bubble of this.grid.values()) {
        const center = this.center(bubble.row, bubble.col);
        if (Math.hypot(center.x - projectile.x, center.y - projectile.y) < DIAMETER - 3) {
          collision = bubble;
          break;
        }
      }

      if (collision) {
        if (projectile.ammo === "torpedo") {
          this.removeCells([collision], true);
          projectile.pierced += 1;
          this.audio.tone(170 + projectile.pierced * 90, 0.11, "sawtooth");
          if (projectile.pierced >= 2) {
            this.projectiles.splice(index, 1);
            this.resolveSpecial(projectile.pierced);
          }
        } else if (projectile.ammo === "bomb") {
          this.projectiles.splice(index, 1);
          const targets = [
            collision,
            ...neighborCoords(collision.row, collision.col)
              .map((coord) => this.grid.get(cellKey(coord.row, coord.col)))
              .filter(Boolean),
          ] as BubbleCell[];
          const removed = this.removeCells(targets, true);
          this.audio.tone(90, 0.28, "square");
          this.resolveSpecial(removed);
        } else {
          this.projectiles.splice(index, 1);
          this.attachProjectile(projectile, collision);
        }
      } else if (projectile.y <= BOARD_TOP - RADIUS) {
        this.projectiles.splice(index, 1);
        if (projectile.ammo === "torpedo") {
          this.resolveSpecial(projectile.pierced);
        } else if (projectile.ammo === "bomb") {
          const top = [...this.grid.values()]
            .filter((bubble) => bubble.row === 0)
            .sort(
              (a, b) =>
                Math.abs(this.center(a.row, a.col).x - projectile.x) -
                Math.abs(this.center(b.row, b.col).x - projectile.x),
            )[0];
          if (top) {
            const targets = [
              top,
              ...neighborCoords(top.row, top.col)
                .map((coord) => this.grid.get(cellKey(coord.row, coord.col)))
                .filter(Boolean),
            ] as BubbleCell[];
            const removed = this.removeCells(targets, true);
            this.resolveSpecial(removed);
          } else {
            this.resolveShot(0, 0);
          }
        } else {
          this.attachProjectile(projectile);
        }
      }
    }

    for (let index = this.particles.length - 1; index >= 0; index -= 1) {
      const particle = this.particles[index];
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 80 * dt;
      if (particle.life <= 0) this.particles.splice(index, 1);
    }
  }

  private get cooldown() {
    return FIRE_COOLDOWNS[this.options.fireRateLevel - 1];
  }

  private get nearDanger() {
    return [...this.grid.values()].some(
      (bubble) => this.center(bubble.row, bubble.col).y > DANGER_Y - 75,
    );
  }

  private attachProjectile(projectile: Projectile, hit?: BubbleCell) {
    let candidates: { row: number; col: number }[] = [];
    if (hit) {
      candidates = neighborCoords(hit.row, hit.col).filter(
        (coord) => !this.grid.has(cellKey(coord.row, coord.col)),
      );
    } else {
      candidates = Array.from({ length: columnsForRow(0) }, (_, col) => ({ row: 0, col })).filter(
        (coord) => !this.grid.has(cellKey(coord.row, coord.col)),
      );
    }
    if (!candidates.length) {
      for (let row = 0; row < 14; row += 1) {
        for (let col = 0; col < columnsForRow(row); col += 1) {
          if (!this.grid.has(cellKey(row, col))) candidates.push({ row, col });
        }
      }
    }
    candidates.sort((a, b) => {
      const ca = this.center(a.row, a.col);
      const cb = this.center(b.row, b.col);
      return (
        Math.hypot(ca.x - projectile.x, ca.y - projectile.y) -
        Math.hypot(cb.x - projectile.x, cb.y - projectile.y)
      );
    });
    const target = candidates[0];
    if (!target) {
      this.finish(false);
      return;
    }
    let kind = projectile.kind;
    if (projectile.ammo === "rainbow") {
      if (hit && hit.kind !== "leopard") {
        kind = hit.kind;
      } else {
        const neighbors = neighborCoords(target.row, target.col)
          .map((coord) => this.grid.get(cellKey(coord.row, coord.col)))
          .filter((cell): cell is BubbleCell => Boolean(cell && cell.kind !== "leopard"));
        kind = neighbors[0]?.kind ?? this.randomKind();
      }
    }
    const bubble: BubbleCell = {
      id: this.nextId++,
      row: target.row,
      col: target.col,
      kind,
    };
    this.grid.set(cellKey(target.row, target.col), bubble);
    this.audio.tone(330, 0.07);
    const cluster = findCluster(this.grid, bubble);
    if (cluster.length >= 3) {
      this.removeCells(cluster);
      const floating = findFloating(this.grid);
      this.removeCells(floating, true);
      this.resolveShot(cluster.length, floating.length);
    } else {
      this.resolveShot(0, 0);
    }
  }

  private removeCells(cells: BubbleCell[], falling = false) {
    const unique = new Map(cells.map((cell) => [cell.id, cell]));
    let removed = 0;
    for (const cell of unique.values()) {
      const key = cellKey(cell.row, cell.col);
      if (!this.grid.delete(key)) continue;
      removed += 1;
      const center = this.center(cell.row, cell.col);
      const color = KIND_COLORS[cell.kind][1];
      for (let index = 0; index < (falling ? 3 : 7); index += 1) {
        this.particles.push({
          x: center.x,
          y: center.y,
          vx: (this.rng() - 0.5) * 130,
          vy: falling ? 40 + this.rng() * 80 : (this.rng() - 0.8) * 120,
          life: 0.45 + this.rng() * 0.4,
          maxLife: 0.85,
          color,
          size: 2 + this.rng() * 5,
        });
      }
    }
    return removed;
  }

  private resolveSpecial(removed: number) {
    const floating = removed > 0 ? findFloating(this.grid) : [];
    const dropped = this.removeCells(floating, true);
    const total = removed + dropped;
    if (total > 0) {
      this.score += total * 42;
      this.setPenguin(16, 650);
      this.resolveShot(total, dropped, true);
    } else {
      this.resolveShot(0, 0);
    }
  }

  private resolveShot(matched: number, floating: number, scoreAlreadyAdded = false) {
    this.shotCount += 1;
    if (matched > 0) {
      if (!scoreAlreadyAdded) {
        this.score += scoreForRemoval(matched, floating, this.combo);
      }
      this.combo += 1;
      this.misses = 0;
      this.audio.tone(520 + Math.min(this.combo, 5) * 80, 0.14);
      this.setPenguin(this.combo > 2 ? 11 : 3, 720);
      if (this.combo > 0 && this.combo % 4 === 0) {
        this.options.rewardAmmo("rainbow", 1);
      }
    } else {
      this.combo = 0;
      this.misses += 1;
      this.tickLeopards();
      if (this.misses >= this.options.config.missLimit) {
        this.addPressureRow();
        this.misses = 0;
      }
    }

    if (this.options.mode === "endless" && this.shotCount % 12 === 0) {
      const desiredKinds = Math.min(7, 5 + Math.floor(this.shotCount / 24));
      this.activeKinds = this.options.config.kinds.slice(0, desiredKinds);
    }

    if (this.grid.size === 0) {
      if (this.options.mode === "level") {
        this.finish(true);
      } else {
        this.score += 1000;
        this.createEndlessWave();
      }
      return;
    }
    if (this.nearDanger) {
      this.setPenguin(4, 520);
      const crossed = [...this.grid.values()].some(
        (bubble) => this.center(bubble.row, bubble.col).y + RADIUS >= DANGER_Y,
      );
      if (crossed) this.finish(false);
    }
  }

  private tickLeopards() {
    const infected = advanceLeopards(this.grid);
    if (infected.length) {
      this.audio.tone(130, 0.32, "sawtooth");
      this.setPenguin(9, 900);
    }
  }

  private addPressureRow() {
    const shifted = [...this.grid.values()].sort((a, b) => b.row - a.row);
    this.grid.clear();
    for (const bubble of shifted) {
      bubble.row += 1;
      this.grid.set(cellKey(bubble.row, bubble.col), bubble);
    }
    for (let col = 0; col < columnsForRow(0); col += 1) {
      const leopardChance =
        this.options.mode === "endless" ? Math.min(0.17, this.shotCount / 500) : 0.04;
      const kind: BubbleKind = this.rng() < leopardChance ? "leopard" : this.randomKind();
      const bubble: BubbleCell = {
        id: this.nextId++,
        row: 0,
        col,
        kind,
        leopardTimer: kind === "leopard" ? 3 : undefined,
      };
      this.grid.set(cellKey(0, col), bubble);
    }
    this.audio.tone(105, 0.28, "triangle");
    this.setPenguin(10, 750);
  }

  private createEndlessWave() {
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < columnsForRow(row); col += 1) {
        const kind: BubbleKind =
          row > 0 && this.rng() < 0.06 ? "leopard" : this.randomKind();
        this.grid.set(cellKey(row, col), {
          id: this.nextId++,
          row,
          col,
          kind,
          leopardTimer: kind === "leopard" ? 3 : undefined,
        });
      }
    }
  }

  private setPenguin(frame: number, duration: number) {
    this.penguinFrame = frame;
    this.penguinUntil = performance.now() + duration;
  }

  private finish(won: boolean) {
    if (this.phase === "won" || this.phase === "lost") return;
    this.phase = won ? "won" : "lost";
    this.holding = false;
    this.setPenguin(won ? 8 : 5, 100000);
    this.audio.tone(won ? 720 : 120, won ? 0.4 : 0.55, won ? "sine" : "sawtooth");
    this.emitSnapshot(performance.now());
    this.options.onFinish({ won, score: this.score });
  }

  private shoot(time: number) {
    if (this.phase !== "playing" || time - this.lastFire < this.cooldown) return;
    const ammo = this.selectedAmmo;
    if (ammo !== "normal" && !this.options.consumeAmmo(ammo)) {
      this.selectedAmmo = "normal";
      this.emitSnapshot(time);
      return;
    }
    this.audio.unlock();
    const dx = this.aimX - SHOOTER_X;
    const dy = Math.min(-35, this.aimY - SHOOTER_Y);
    const length = Math.max(1, Math.hypot(dx, dy));
    const clampedX = Math.max(-0.94, Math.min(0.94, dx / length));
    const clampedY = -Math.sqrt(1 - clampedX * clampedX);
    this.projectiles.push({
      x: SHOOTER_X,
      y: SHOOTER_Y - 20,
      vx: clampedX * PROJECTILE_SPEED,
      vy: clampedY * PROJECTILE_SPEED,
      ammo,
      kind: this.currentKind,
      pierced: 0,
    });
    this.lastFire = time;
    this.setPenguin(2, 260);
    this.audio.tone(ammo === "normal" ? 420 : 610, 0.09, "triangle");
    this.currentKind = this.nextKind;
    this.nextKind = this.randomKind();
  }

  aim(x: number, y: number) {
    this.aimX = Math.max(8, Math.min(WIDTH - 8, x));
    this.aimY = Math.max(40, Math.min(SHOOTER_Y - 50, y));
  }

  press(x: number, y: number) {
    this.aim(x, y);
    this.holding = true;
    this.shoot(performance.now());
  }

  release() {
    this.holding = false;
  }

  selectAmmo(ammo: AmmoKind) {
    this.selectedAmmo = ammo;
    this.setPenguin(ammo === "normal" ? 7 : 16, 520);
    this.emitSnapshot(performance.now());
  }

  setFireRate(level: number) {
    this.options.fireRateLevel = Math.min(5, Math.max(1, level));
  }

  setMuted(muted: boolean) {
    this.audio.muted = muted;
  }

  pause() {
    if (this.phase !== "playing") return;
    this.phase = "paused";
    this.holding = false;
    this.setPenguin(6, 100000);
    this.emitSnapshot(performance.now());
  }

  resume() {
    if (this.phase !== "paused") return;
    this.phase = "playing";
    this.penguinUntil = 0;
    this.penguinFrame = 1;
    this.lastTime = performance.now();
    this.emitSnapshot(this.lastTime);
  }

  private emitSnapshot(time: number) {
    this.options.onSnapshot({
      score: this.score,
      combo: this.combo,
      misses: this.misses,
      missLimit: this.options.config.missLimit,
      nextKind: this.nextKind,
      currentKind: this.currentKind,
      selectedAmmo: this.selectedAmmo,
      cooldownProgress: Math.min(1, Math.max(0, (time - this.lastFire) / this.cooldown)),
      phase: this.phase,
      penguinFrame: this.penguinFrame,
      bubbleCount: this.grid.size,
    });
  }

  private draw(time: number) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.drawBackground(time);
    this.drawAim();
    for (const bubble of this.grid.values()) this.drawBubble(bubble, time);
    this.drawDangerLine(time);
    for (const particle of this.particles) {
      ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.drawPenguin();
    this.drawCannon();
    for (const projectile of this.projectiles) {
      this.drawProjectile(projectile.x, projectile.y, projectile.kind, projectile.ammo);
    }
  }

  private drawBackground(time: number) {
    const ctx = this.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, "#074b87");
    gradient.addColorStop(0.48, "#0d78a8");
    gradient.addColorStop(1, "#062b59");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.globalAlpha = 0.13;
    ctx.fillStyle = "#b8f5ff";
    for (let index = 0; index < 14; index += 1) {
      const x = (index * 71 + 23) % WIDTH;
      const y = (HEIGHT - ((time * 0.014 + index * 53) % (HEIGHT + 80))) + 40;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (index % 4) * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#0a5e72";
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT);
    ctx.quadraticCurveTo(40, 500, 88, HEIGHT);
    ctx.quadraticCurveTo(145, 510, 205, HEIGHT);
    ctx.quadraticCurveTo(280, 506, WIDTH, HEIGHT);
    ctx.fill();

    ctx.strokeStyle = "rgba(114, 227, 181, .45)";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    for (const x of [18, 350, 372]) {
      ctx.beginPath();
      ctx.moveTo(x, HEIGHT);
      ctx.bezierCurveTo(x - 12, 520, x + 10, 498, x - 2, 468);
      ctx.stroke();
    }
  }

  private drawAim() {
    if (this.phase !== "playing") return;
    let dx = this.aimX - SHOOTER_X;
    const dy = Math.min(-35, this.aimY - SHOOTER_Y);
    const length = Math.max(1, Math.hypot(dx, dy));
    dx = Math.max(-0.94, Math.min(0.94, dx / length));
    let vx = dx;
    const vy = -Math.sqrt(1 - vx * vx);
    let x = SHOOTER_X;
    let y = SHOOTER_Y - 26;
    this.ctx.fillStyle = "rgba(222, 252, 255, .55)";
    for (let step = 0; step < 34; step += 1) {
      x += vx * 12;
      y += vy * 12;
      if (x <= RADIUS || x >= WIDTH - RADIUS) vx *= -1;
      if (y <= BOARD_TOP) break;
      if (step % 2 === 0) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2.1, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  private drawDangerLine(time: number) {
    const warning = this.nearDanger;
    const pulse = warning ? 0.42 + Math.sin(time / 130) * 0.16 : 0.23;
    this.ctx.save();
    this.ctx.strokeStyle = `rgba(255, ${warning ? 112 : 196}, 126, ${pulse})`;
    this.ctx.setLineDash([7, 7]);
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(15, DANGER_Y);
    this.ctx.lineTo(WIDTH - 15, DANGER_Y);
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawPenguin() {
    const image = this.images[this.penguinFrame - 1] ?? this.images[0];
    if (image?.complete && image.naturalWidth) {
      this.ctx.save();
      this.ctx.shadowColor = "rgba(0, 18, 50, .32)";
      this.ctx.shadowBlur = 12;
      this.ctx.drawImage(image, 135, 435, 120, 120);
      this.ctx.restore();
    } else {
      this.ctx.fillStyle = "#eefaff";
      this.ctx.beginPath();
      this.ctx.ellipse(SHOOTER_X, 500, 42, 49, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawCannon() {
    const ctx = this.ctx;
    const angle = Math.atan2(this.aimY - SHOOTER_Y, this.aimX - SHOOTER_X);
    ctx.save();
    ctx.translate(SHOOTER_X, SHOOTER_Y);
    ctx.rotate(angle);
    const tube = ctx.createLinearGradient(0, -10, 58, 10);
    tube.addColorStop(0, "#c8fbff");
    tube.addColorStop(0.55, "#6bd6ed");
    tube.addColorStop(1, "#2e87bd");
    ctx.fillStyle = tube;
    ctx.beginPath();
    ctx.roundRect(4, -11, 56, 22, 9);
    ctx.fill();
    ctx.fillStyle = "#e8ffff";
    ctx.fillRect(48, -14, 12, 28);
    ctx.restore();
    ctx.fillStyle = "#2381b8";
    ctx.beginPath();
    ctx.arc(SHOOTER_X, SHOOTER_Y, 24, 0, Math.PI * 2);
    ctx.fill();
    this.drawProjectile(SHOOTER_X, SHOOTER_Y - 1, this.currentKind, this.selectedAmmo, 0.75);
  }

  private drawBubble(cell: BubbleCell, time: number) {
    const center = this.center(cell.row, cell.col);
    const dangerPulse =
      cell.kind === "leopard" && cell.leopardTimer === 1
        ? 1 + Math.sin(time / 95) * 0.08
        : 1;
    this.ctx.save();
    this.ctx.translate(center.x, center.y);
    this.ctx.scale(dangerPulse, dangerPulse);
    this.drawProjectile(0, 0, cell.kind, "normal");
    if (cell.kind === "leopard") {
      this.ctx.fillStyle = cell.leopardTimer === 1 ? "#ff4f68" : "#0b3154";
      this.ctx.beginPath();
      this.ctx.arc(13, -13, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = "#fff";
      this.ctx.font = "700 10px ui-rounded, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(String(cell.leopardTimer ?? 3), 13, -12.5);
    }
    this.ctx.restore();
  }

  private drawProjectile(
    x: number,
    y: number,
    kind: BubbleKind,
    ammo: AmmoKind,
    scale = 1,
  ) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.shadowColor = "rgba(0, 21, 55, .3)";
    ctx.shadowBlur = 6;
    const palette = KIND_COLORS[kind];
    const bubble = ctx.createRadialGradient(-7, -8, 2, 0, 0, RADIUS + 3);
    bubble.addColorStop(0, ammo === "rainbow" ? "#fff7b2" : palette[0]);
    bubble.addColorStop(0.55, ammo === "bomb" ? "#2a3f62" : palette[1]);
    bubble.addColorStop(1, ammo === "torpedo" ? "#087d9b" : ammo === "bomb" ? "#07182f" : palette[2]);
    ctx.fillStyle = bubble;
    ctx.beginPath();
    ctx.arc(0, 0, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,.58)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(-3, -3, RADIUS - 4, Math.PI * 1.05, Math.PI * 1.75);
    ctx.stroke();

    if (ammo === "rainbow") {
      const rainbow = ["#ff5f7d", "#ffb84e", "#fff477", "#63e6a5", "#5ac7ff", "#a98cff"];
      ctx.lineWidth = 3;
      rainbow.forEach((color, index) => {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(0, 2, 6 + index * 1.8, Math.PI, Math.PI * 2);
        ctx.stroke();
      });
    } else if (ammo === "bomb") {
      ctx.fillStyle = "#ffcf5a";
      ctx.beginPath();
      for (let point = 0; point < 10; point += 1) {
        const angle = -Math.PI / 2 + (point * Math.PI) / 5;
        const radius = point % 2 ? 5 : 10;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (!point) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else if (ammo === "torpedo") {
      ctx.fillStyle = "#d9fbff";
      ctx.beginPath();
      ctx.roundRect(-12, -5, 23, 10, 5);
      ctx.fill();
      ctx.fillStyle = "#54d9ef";
      ctx.beginPath();
      ctx.moveTo(8, -7);
      ctx.lineTo(15, 0);
      ctx.lineTo(8, 7);
      ctx.closePath();
      ctx.fill();
    } else {
      this.drawCreature(kind);
    }
    ctx.restore();
  }

  private drawCreature(kind: BubbleKind) {
    const ctx = this.ctx;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(3, 38, 70, .72)";
    ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.lineWidth = 1.7;

    if (kind === "fish") {
      ctx.beginPath();
      ctx.ellipse(-2, 1, 10, 6.5, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(7, 0);
      ctx.lineTo(15, -7);
      ctx.lineTo(14, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      this.eye(-7, -1);
    } else if (kind === "shrimp") {
      ctx.strokeStyle = "#fff3e8";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, 10, -1.15, 2.2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(85,35,62,.7)";
      ctx.lineWidth = 1.2;
      for (let index = 0; index < 4; index += 1) {
        ctx.beginPath();
        ctx.arc(-1, 1, 6 + index * 1.5, -0.25, 0.2);
        ctx.stroke();
      }
      this.eye(5, -7);
    } else if (kind === "squid") {
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(11, -4, 8, 6);
      ctx.quadraticCurveTo(0, 11, -8, 6);
      ctx.quadraticCurveTo(-11, -4, 0, -12);
      ctx.fill();
      ctx.stroke();
      for (const x of [-6, -2, 2, 6]) {
        ctx.beginPath();
        ctx.moveTo(x, 6);
        ctx.quadraticCurveTo(x + 2, 11, x - 1, 14);
        ctx.stroke();
      }
      this.eye(-3, 0);
      this.eye(3, 0);
    } else if (kind === "crab") {
      ctx.beginPath();
      ctx.ellipse(0, 3, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(side * 12, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(side * 8, 2);
        ctx.lineTo(side * 15, -1);
        ctx.stroke();
      }
      this.eye(-4, -2);
      this.eye(4, -2);
    } else if (kind === "lobster") {
      ctx.beginPath();
      ctx.ellipse(0, 2, 6, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, -7);
      ctx.quadraticCurveTo(-13, -15, -15, -6);
      ctx.moveTo(4, -7);
      ctx.quadraticCurveTo(13, -15, 15, -6);
      ctx.stroke();
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(side * 10, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      this.eye(-3, -4);
      this.eye(3, -4);
    } else if (kind === "kelp") {
      ctx.strokeStyle = "#e5ffe9";
      ctx.lineWidth = 5;
      for (const x of [-6, 0, 6]) {
        ctx.beginPath();
        ctx.moveTo(x, 12);
        ctx.bezierCurveTo(x - 8, 5, x + 8, -4, x, -13);
        ctx.stroke();
      }
    } else if (kind === "shell") {
      ctx.beginPath();
      ctx.moveTo(-13, 8);
      ctx.quadraticCurveTo(-9, -12, 0, -13);
      ctx.quadraticCurveTo(9, -12, 13, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      for (const x of [-8, -4, 0, 4, 8]) {
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(x, 7);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = "#f7c56b";
      ctx.beginPath();
      ctx.arc(0, 1, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-8, -8, 4, 0, Math.PI * 2);
      ctx.arc(8, -8, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#6c3c2b";
      for (const [x, y] of [
        [-6, -4],
        [6, -5],
        [-8, 5],
        [7, 6],
      ]) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      this.eye(-4, 0);
      this.eye(4, 0);
      ctx.beginPath();
      ctx.arc(0, 6, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private eye(x: number, y: number) {
    this.ctx.fillStyle = "#08263d";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 1.6, 0, Math.PI * 2);
    this.ctx.fill();
  }

  destroy() {
    cancelAnimationFrame(this.animationId);
  }
}
