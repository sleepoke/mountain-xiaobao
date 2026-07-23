export type GameMode = "level" | "endless";
export type BubbleKind =
  | "fish"
  | "shrimp"
  | "squid"
  | "crab"
  | "lobster"
  | "kelp"
  | "shell"
  | "leopard";
export type AmmoKind = "normal" | "rainbow" | "bomb" | "torpedo";
export type GamePhase = "menu" | "playing" | "paused" | "won" | "lost";

export interface BubbleCell {
  id: number;
  row: number;
  col: number;
  kind: BubbleKind;
  leopardTimer?: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  rows: number;
  kinds: BubbleKind[];
  leopardCount: number;
  missLimit: number;
  score2: number;
  score3: number;
  pearlReward: number;
  seed: number;
}

export interface PlayerProgress {
  unlockedLevel: number;
  stars: number[];
  pearls: number;
  fireRateLevel: number;
  ammo: Record<Exclude<AmmoKind, "normal">, number>;
  endlessBest: number;
}

export interface SaveDataV1 {
  version: 1;
  muted: boolean;
  progress: PlayerProgress;
}

export const SAVE_KEY = "xiaobao-ocean-pop.save.v1";
export const FIRE_COOLDOWNS = [900, 700, 550, 450, 350] as const;
export const NORMAL_KINDS: BubbleKind[] = [
  "fish",
  "shrimp",
  "squid",
  "crab",
  "lobster",
  "kelp",
  "shell",
];

export const DEFAULT_SAVE: SaveDataV1 = {
  version: 1,
  muted: false,
  progress: {
    unlockedLevel: 1,
    stars: Array.from({ length: 12 }, () => 0),
    pearls: 36,
    fireRateLevel: 1,
    ammo: { rainbow: 3, bomb: 2, torpedo: 2 },
    endlessBest: 0,
  },
};

export const LEVELS: LevelConfig[] = Array.from({ length: 12 }, (_, index) => {
  const id = index + 1;
  const tier = Math.floor(index / 4);
  return {
    id,
    name: ["珊瑚浅湾", "水母花园", "沉船航道"][tier],
    rows: 4 + tier + (index % 4 === 3 ? 1 : 0),
    kinds: NORMAL_KINDS.slice(0, 4 + tier + (index > 9 ? 1 : 0)),
    leopardCount: index < 2 ? 0 : Math.min(4, 1 + tier + (index % 3 === 0 ? 1 : 0)),
    missLimit: Math.max(3, 6 - tier),
    score2: 700 + index * 180,
    score3: 1100 + index * 260,
    pearlReward: 8 + id * 2,
    seed: 7283 + id * 977,
  };
});

export function cellKey(row: number, col: number) {
  return `${row}:${col}`;
}

export function columnsForRow(row: number) {
  void row;
  return 9;
}

export function isValidCell(row: number, col: number) {
  return row >= 0 && col >= 0 && col < columnsForRow(row);
}

export function neighborCoords(row: number, col: number) {
  const offsets =
    row % 2 === 0
      ? [
          [0, -1],
          [0, 1],
          [-1, -1],
          [-1, 0],
          [1, -1],
          [1, 0],
        ]
      : [
          [0, -1],
          [0, 1],
          [-1, 0],
          [-1, 1],
          [1, 0],
          [1, 1],
        ];
  return offsets
    .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
    .filter((cell) => isValidCell(cell.row, cell.col));
}

export function findCluster(
  grid: Map<string, BubbleCell>,
  start: BubbleCell,
  matchKind = start.kind,
) {
  if (matchKind === "leopard") return [];
  const found: BubbleCell[] = [];
  const queue = [start];
  const seen = new Set<string>();
  while (queue.length) {
    const current = queue.shift()!;
    const key = cellKey(current.row, current.col);
    if (seen.has(key) || current.kind !== matchKind) continue;
    seen.add(key);
    found.push(current);
    for (const coord of neighborCoords(current.row, current.col)) {
      const next = grid.get(cellKey(coord.row, coord.col));
      if (next && !seen.has(cellKey(next.row, next.col))) queue.push(next);
    }
  }
  return found;
}

export function findFloating(grid: Map<string, BubbleCell>) {
  const anchored = new Set<string>();
  const queue = [...grid.values()].filter((cell) => cell.row === 0);
  while (queue.length) {
    const current = queue.shift()!;
    const key = cellKey(current.row, current.col);
    if (anchored.has(key)) continue;
    anchored.add(key);
    for (const coord of neighborCoords(current.row, current.col)) {
      const nextKey = cellKey(coord.row, coord.col);
      if (grid.has(nextKey) && !anchored.has(nextKey)) {
        queue.push(grid.get(nextKey)!);
      }
    }
  }
  return [...grid.values()].filter(
    (cell) => !anchored.has(cellKey(cell.row, cell.col)),
  );
}

export function makeSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function starsForScore(score: number, config: LevelConfig) {
  if (score >= config.score3) return 3;
  if (score >= config.score2) return 2;
  return 1;
}

export function scoreForRemoval(
  matched: number,
  floating: number,
  combo: number,
) {
  const multiplier = 1 + Math.min(combo, 5) * 0.25;
  return Math.round((matched * 20 + floating * 45) * multiplier);
}

export function reflectHorizontal(
  x: number,
  velocityX: number,
  minimum: number,
  maximum: number,
) {
  if (x <= minimum && velocityX < 0) {
    return { x: minimum, velocityX: -velocityX };
  }
  if (x >= maximum && velocityX > 0) {
    return { x: maximum, velocityX: -velocityX };
  }
  return { x, velocityX };
}

export function advanceLeopards(grid: Map<string, BubbleCell>) {
  const infected: BubbleCell[] = [];
  const leopards = [...grid.values()]
    .filter((bubble) => bubble.kind === "leopard")
    .sort((a, b) => a.row - b.row || a.col - b.col);
  for (const leopard of leopards) {
    leopard.leopardTimer = (leopard.leopardTimer ?? 3) - 1;
    if (leopard.leopardTimer > 0) continue;
    const target = neighborCoords(leopard.row, leopard.col)
      .map((coord) => grid.get(cellKey(coord.row, coord.col)))
      .filter((cell): cell is BubbleCell => Boolean(cell && cell.kind !== "leopard"))
      .sort((a, b) => b.row - a.row || a.col - b.col)[0];
    if (target) {
      target.kind = "leopard";
      target.leopardTimer = 3;
      infected.push(target);
    }
    leopard.leopardTimer = 3;
  }
  return infected;
}

export function safeSave(value: unknown): SaveDataV1 {
  if (!value || typeof value !== "object") return structuredClone(DEFAULT_SAVE);
  const candidate = value as Partial<SaveDataV1>;
  if (candidate.version !== 1 || !candidate.progress) {
    return structuredClone(DEFAULT_SAVE);
  }
  const progress = candidate.progress as Partial<PlayerProgress>;
  return {
    version: 1,
    muted: Boolean(candidate.muted),
    progress: {
      unlockedLevel: Math.min(
        12,
        Math.max(1, Number(progress.unlockedLevel) || 1),
      ),
      stars: Array.from({ length: 12 }, (_, index) =>
        Math.min(3, Math.max(0, Number(progress.stars?.[index]) || 0)),
      ),
      pearls: Math.max(0, Number(progress.pearls) || 0),
      fireRateLevel: Math.min(
        5,
        Math.max(1, Number(progress.fireRateLevel) || 1),
      ),
      ammo: {
        rainbow: Math.max(0, Number(progress.ammo?.rainbow) || 0),
        bomb: Math.max(0, Number(progress.ammo?.bomb) || 0),
        torpedo: Math.max(0, Number(progress.ammo?.torpedo) || 0),
      },
      endlessBest: Math.max(0, Number(progress.endlessBest) || 0),
    },
  };
}
