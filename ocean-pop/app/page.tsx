"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_SAVE,
  FIRE_COOLDOWNS,
  LEVELS,
  NORMAL_KINDS,
  SAVE_KEY,
  safeSave,
  starsForScore,
  type AmmoKind,
  type BubbleKind,
  type GameMode,
  type LevelConfig,
  type SaveDataV1,
} from "./game-core";
import { OceanPopEngine, type EngineSnapshot } from "./game-engine";

const KIND_LABELS: Record<BubbleKind, string> = {
  fish: "小鱼",
  shrimp: "小虾",
  squid: "鱿鱼",
  crab: "螃蟹",
  lobster: "龙虾",
  kelp: "海带",
  shell: "贝壳",
  leopard: "小豹",
};

const AMMO: {
  id: AmmoKind;
  label: string;
  short: string;
  description: string;
}[] = [
  { id: "normal", label: "普通弹", short: "●", description: "三颗同类即可消除" },
  { id: "rainbow", label: "彩虹弹", short: "◎", description: "自动变成接触的海洋伙伴" },
  { id: "bomb", label: "爆破弹", short: "✦", description: "清除命中泡泡及一圈邻居" },
  { id: "torpedo", label: "鱼雷", short: "➤", description: "连续穿透两个泡泡" },
];

const AMMO_ART: Partial<Record<AmmoKind, string>> = {
  rainbow: "/game-assets/ammo-rainbow-v1.png",
  bomb: "/game-assets/ammo-bomb-v1.png",
  torpedo: "/game-assets/ammo-torpedo-v1.png",
};

const EMPTY_SNAPSHOT: EngineSnapshot = {
  score: 0,
  combo: 0,
  misses: 0,
  missLimit: 5,
  nextKind: "fish",
  currentKind: "fish",
  selectedAmmo: "normal",
  cooldownProgress: 1,
  phase: "playing",
  penguinFrame: 1,
  bubbleCount: 0,
};

const ENDLESS_CONFIG: LevelConfig = {
  id: 0,
  name: "无尽深潜",
  rows: 5,
  kinds: NORMAL_KINDS,
  leopardCount: 1,
  missLimit: 5,
  score2: 0,
  score3: 0,
  pearlReward: 0,
  seed: 20260723,
};

type View = "home" | "levels" | "game";
type BasePanel = "shop" | "backpack" | null;
type PeanutPose = "idle" | "hit" | "shell" | "shrimp";

const KIND_ART: Partial<Record<BubbleKind, string>> = {
  fish: "/game-assets/bubble-fish-v2.png",
  shrimp: "/game-assets/bubble-shrimp-v2.png",
  squid: "/game-assets/bubble-squid-v2.png",
  crab: "/game-assets/bubble-crab-v2.png",
  shell: "/game-assets/bubble-shell-v2.png",
};

interface ShopOffer {
  id: Exclude<AmmoKind, "normal">;
  label: string;
  description: string;
  amount: number;
  cost: number;
  image: string;
  peanutPose: PeanutPose;
}

const SHOP_OFFERS: ShopOffer[] = [
  {
    id: "rainbow",
    label: "彩虹珍珠弹",
    description: "自动匹配接触到的海洋伙伴",
    amount: 2,
    cost: 12,
    image: "/game-assets/ammo-rainbow-v1.png",
    peanutPose: "shell",
  },
  {
    id: "bomb",
    label: "珊瑚爆破弹",
    description: "命中后清除周围一圈泡泡",
    amount: 1,
    cost: 14,
    image: "/game-assets/ammo-bomb-v1.png",
    peanutPose: "shrimp",
  },
  {
    id: "torpedo",
    label: "穿透鱼雷",
    description: "连续穿透并清除两个泡泡",
    amount: 1,
    cost: 16,
    image: "/game-assets/ammo-torpedo-v1.png",
    peanutPose: "idle",
  },
];

interface ResultState {
  won: boolean;
  score: number;
  stars: number;
  reward: number;
  best: number;
}

function writeSave(next: SaveDataV1) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable in private browsing. The current session still works.
  }
}

function StarRow({ value, small = false }: { value: number; small?: boolean }) {
  return (
    <span className={`star-row${small ? " star-row--small" : ""}`} aria-label={`${value} 星`}>
      {[1, 2, 3].map((star) => (
        <span key={star} className={star <= value ? "star star--on" : "star"}>
          ★
        </span>
      ))}
    </span>
  );
}

function BubbleBadge({
  kind,
  label = true,
}: {
  kind: BubbleKind;
  label?: boolean;
}) {
  const hasCharacterArt = Boolean(KIND_ART[kind]);
  return (
    <span
      className={`bubble-badge bubble-badge--${kind}${hasCharacterArt ? " bubble-badge--art" : ""}`}
      title={KIND_LABELS[kind]}
    >
      {hasCharacterArt ? (
        <img className="bubble-badge__image" src={KIND_ART[kind]} alt="" />
      ) : (
        <span className="bubble-badge__mark">{KIND_LABELS[kind].slice(0, 1)}</span>
      )}
      {label && <span>{KIND_LABELS[kind]}</span>}
    </span>
  );
}

function ShopContent({
  pearls,
  peanutPose,
  fireRateLevel,
  upgradeCost,
  notice,
  onBuy,
  onUpgrade,
}: {
  pearls: number;
  peanutPose: PeanutPose;
  fireRateLevel: number;
  upgradeCost: number;
  notice: string;
  onBuy: (offer: ShopOffer) => void;
  onUpgrade: () => void;
}) {
  return (
    <>
      <header className="shop-header">
        <img src="/game-assets/shop-board.png" alt="小宝的冰雪补给商店" />
        <div>
          <p className="eyebrow">OCEAN SUPPLY</p>
          <h2>小宝补给商店</h2>
          <span className="shop-balance">珍珠 {pearls}</span>
        </div>
      </header>
      <div className="shop-guide">
        <img src={`/game-assets/peanut-${peanutPose}.png`} alt="商店助手花生" />
        <p>{notice || (peanutPose === "hit" ? "花生提醒你：珍珠还不够。" : "特殊炮弹和炮台道具都会自动放进背包。")}</p>
      </div>
      <div className="shop-list">
        {SHOP_OFFERS.map((offer) => (
          <article className="shop-item" key={offer.id}>
            <img src={offer.image} alt="" />
            <div>
              <strong>{offer.label}</strong>
              <small>{offer.description}</small>
            </div>
            <button onClick={() => onBuy(offer)} disabled={pearls < offer.cost}>
              <span>{offer.cost}</span>
              <small>+{offer.amount}</small>
            </button>
          </article>
        ))}
        <article className="shop-item shop-item--power">
          <span className="power-chip-art" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <div>
            <strong>炮台动力芯片</strong>
            <small>同时提升炮弹飞行速度与连续发射速度</small>
          </div>
          <button
            onClick={onUpgrade}
            disabled={fireRateLevel >= 5 || pearls < upgradeCost}
          >
            <span>{fireRateLevel >= 5 ? "满级" : upgradeCost}</span>
            <small>{fireRateLevel >= 5 ? "L5" : `L${fireRateLevel + 1}`}</small>
          </button>
        </article>
      </div>
    </>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [mode, setMode] = useState<GameMode>("level");
  const [levelIndex, setLevelIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const [save, setSave] = useState<SaveDataV1>(DEFAULT_SAVE);
  const [hydrated, setHydrated] = useState(false);
  const [snapshot, setSnapshot] = useState<EngineSnapshot>(EMPTY_SNAPSHOT);
  const [result, setResult] = useState<ResultState | null>(null);
  const [activeRate, setActiveRate] = useState(1);
  const [basePanel, setBasePanel] = useState<BasePanel>(null);
  const [peanutPose, setPeanutPose] = useState<PeanutPose>("idle");
  const [baseNotice, setBaseNotice] = useState("");
  const [chatter, setChatter] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<OceanPopEngine | null>(null);
  const saveRef = useRef(save);
  const aimRef = useRef({ x: 195, y: 180 });
  const chatterTimerRef = useRef<number | null>(null);
  const chatterStateRef = useRef({ combo: 0, misses: 0, ammo: "normal" as AmmoKind });
  const shopResumeRef = useRef(false);

  const config = mode === "level" ? LEVELS[levelIndex] : ENDLESS_CONFIG;
  const totalStars = save.progress.stars.reduce((sum, stars) => sum + stars, 0);
  const upgradeCost =
    save.progress.fireRateLevel >= 5 ? 0 : save.progress.fireRateLevel * 20;

  const commitSave = useCallback(
    (updater: (previous: SaveDataV1) => SaveDataV1) => {
      setSave((previous) => {
        const next = updater(previous);
        saveRef.current = next;
        writeSave(next);
        return next;
      });
    },
    [],
  );

  const say = useCallback((message: string) => {
    if (chatterTimerRef.current) window.clearTimeout(chatterTimerRef.current);
    setChatter(message);
    chatterTimerRef.current = window.setTimeout(() => {
      setChatter("");
      chatterTimerRef.current = null;
    }, 2300);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVE_KEY);
      const loaded = stored ? safeSave(JSON.parse(stored)) : structuredClone(DEFAULT_SAVE);
      setSave(loaded);
      saveRef.current = loaded;
      setActiveRate(loaded.progress.fireRateLevel);
    } catch {
      const fallback = structuredClone(DEFAULT_SAVE);
      setSave(fallback);
      saveRef.current = fallback;
    }
    setHydrated(true);

    const isLocalPreview =
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1" ||
      location.hostname === "::1";
    if ("serviceWorker" in navigator && isLocalPreview) {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister())),
        );
      if ("caches" in window) {
        void caches.delete("xiaobao-ocean-pop-v1");
        void caches.delete("xiaobao-ocean-pop-v2");
        void caches.delete("xiaobao-ocean-pop-v3");
        void caches.delete("xiaobao-ocean-pop-v4");
      }
    } else if ("serviceWorker" in navigator) {
      const register = () => void navigator.serviceWorker.register("/sw.js");
      window.addEventListener("load", register, { once: true });
      if (document.readyState === "complete") register();
      return () => window.removeEventListener("load", register);
    }
  }, []);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  useEffect(
    () => () => {
      if (chatterTimerRef.current) window.clearTimeout(chatterTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (view !== "game") return;
    chatterStateRef.current = { combo: 0, misses: 0, ammo: "normal" };
    say(mode === "level" ? "小宝准备好啦，瞄准再发射！" : "越往深海越要稳稳地打哦～");
  }, [mode, runId, say, view]);

  useEffect(() => {
    if (view !== "game" || snapshot.phase !== "playing") return;
    const previous = chatterStateRef.current;
    if (snapshot.combo > previous.combo && snapshot.combo >= 2) {
      say(snapshot.combo >= 4 ? "哇！这串连击闪闪发光！" : "连起来啦，再来一发～");
    } else if (snapshot.misses > previous.misses) {
      say(
        snapshot.misses >= snapshot.missLimit - 1
          ? "先别急，小豹行动变慢了，找准角度！"
          : "这一发没消掉，换个角度试试看？",
      );
    } else if (snapshot.selectedAmmo !== previous.ammo && snapshot.selectedAmmo !== "normal") {
      const lines: Record<Exclude<AmmoKind, "normal">, string> = {
        rainbow: "彩虹珍珠会认出碰到的伙伴！",
        bomb: "爆破弹来啦，离小豹近一点打！",
        torpedo: "鱼雷能一口气穿过两个泡泡！",
      };
      say(lines[snapshot.selectedAmmo]);
    }
    chatterStateRef.current = {
      combo: snapshot.combo,
      misses: snapshot.misses,
      ammo: snapshot.selectedAmmo,
    };
  }, [say, snapshot, view]);

  useEffect(() => {
    const closePanel = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBasePanel(null);
    };
    window.addEventListener("keydown", closePanel);
    return () => window.removeEventListener("keydown", closePanel);
  }, []);

  const consumeAmmo = useCallback(
    (ammo: AmmoKind) => {
      if (ammo === "normal") return true;
      const available = saveRef.current.progress.ammo[ammo];
      if (available <= 0) return false;
      commitSave((previous) => ({
        ...previous,
        progress: {
          ...previous.progress,
          ammo: {
            ...previous.progress.ammo,
            [ammo]: Math.max(0, previous.progress.ammo[ammo] - 1),
          },
        },
      }));
      return true;
    },
    [commitSave],
  );

  const rewardAmmo = useCallback(
    (ammo: Exclude<AmmoKind, "normal">, amount: number) => {
      commitSave((previous) => ({
        ...previous,
        progress: {
          ...previous.progress,
          ammo: {
            ...previous.progress.ammo,
            [ammo]: Math.min(99, previous.progress.ammo[ammo] + amount),
          },
        },
      }));
    },
    [commitSave],
  );

  const handleFinish = useCallback(
    ({ won, score }: { won: boolean; score: number }) => {
      const currentSave = saveRef.current;
      let stars = 0;
      let reward = 0;
      let best = currentSave.progress.endlessBest;
      if (mode === "level") {
        stars = won ? starsForScore(score, LEVELS[levelIndex]) : 0;
        reward = won ? LEVELS[levelIndex].pearlReward + stars * 3 : 0;
        commitSave((previous) => {
          const nextStars = [...previous.progress.stars];
          nextStars[levelIndex] = Math.max(nextStars[levelIndex], stars);
          return {
            ...previous,
            progress: {
              ...previous.progress,
              stars: nextStars,
              unlockedLevel: won
                ? Math.max(previous.progress.unlockedLevel, Math.min(12, levelIndex + 2))
                : previous.progress.unlockedLevel,
              pearls: previous.progress.pearls + reward,
              ammo: {
                ...previous.progress.ammo,
                rainbow: previous.progress.ammo.rainbow + (won ? 1 : 0),
                bomb: previous.progress.ammo.bomb + (stars === 3 ? 1 : 0),
              },
            },
          };
        });
      } else {
        reward = Math.floor(score / 350);
        best = Math.max(best, score);
        commitSave((previous) => ({
          ...previous,
          progress: {
            ...previous.progress,
            endlessBest: Math.max(previous.progress.endlessBest, score),
            pearls: previous.progress.pearls + reward,
            ammo: {
              ...previous.progress.ammo,
              torpedo: previous.progress.ammo.torpedo + Math.floor(score / 1800),
            },
          },
        }));
      }
      setResult({ won, score, stars, reward, best });
    },
    [commitSave, levelIndex, mode],
  );

  useEffect(() => {
    if (view !== "game" || !canvasRef.current) return;
    const currentConfig =
      mode === "level"
        ? LEVELS[levelIndex]
        : { ...ENDLESS_CONFIG, seed: ENDLESS_CONFIG.seed + saveRef.current.progress.endlessBest };
    const engine = new OceanPopEngine(canvasRef.current, {
      mode,
      config: currentConfig,
      fireRateLevel: activeRate,
      muted: saveRef.current.muted,
      onSnapshot: setSnapshot,
      onFinish: handleFinish,
      consumeAmmo,
      rewardAmmo,
    });
    engineRef.current = engine;
    setSnapshot(EMPTY_SNAPSHOT);
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [runId, view, mode, levelIndex, consumeAmmo, rewardAmmo, handleFinish]);

  useEffect(() => {
    engineRef.current?.setFireRate(activeRate);
  }, [activeRate]);

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (view !== "game" || snapshot.phase !== "playing") return;
      if (event.key === "ArrowLeft") {
        aimRef.current.x = Math.max(18, aimRef.current.x - 18);
        engineRef.current?.aim(aimRef.current.x, aimRef.current.y);
      } else if (event.key === "ArrowRight") {
        aimRef.current.x = Math.min(372, aimRef.current.x + 18);
        engineRef.current?.aim(aimRef.current.x, aimRef.current.y);
      } else if (event.code === "Space" && !event.repeat) {
        event.preventDefault();
        engineRef.current?.press(aimRef.current.x, aimRef.current.y);
      } else if (event.key.toLowerCase() === "p") {
        engineRef.current?.pause();
      }
    };
    const keyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") engineRef.current?.release();
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [snapshot.phase, view]);

  const startGame = (nextMode: GameMode, nextLevel = 0) => {
    setMode(nextMode);
    setLevelIndex(nextLevel);
    setResult(null);
    setSnapshot(EMPTY_SNAPSHOT);
    setView("game");
    setRunId((value) => value + 1);
  };

  const restart = () => {
    setResult(null);
    setSnapshot(EMPTY_SNAPSHOT);
    setRunId((value) => value + 1);
  };

  const goHome = () => {
    engineRef.current?.release();
    setResult(null);
    setView("home");
  };

  const toggleMute = () => {
    const muted = !save.muted;
    commitSave((previous) => ({ ...previous, muted }));
    engineRef.current?.setMuted(muted);
  };

  const showBaseNotice = (message: string) => {
    setBaseNotice(message);
    window.setTimeout(() => setBaseNotice(""), 2200);
  };

  const manualSave = () => {
    writeSave(saveRef.current);
    showBaseNotice("进度已安全存到本机");
  };

  const buyOffer = (offer: (typeof SHOP_OFFERS)[number]) => {
    const current = saveRef.current;
    if (current.progress.pearls < offer.cost) {
      setPeanutPose("hit");
      showBaseNotice(`还差 ${offer.cost - current.progress.pearls} 枚珍珠`);
      window.setTimeout(() => setPeanutPose("idle"), 1800);
      return;
    }
    commitSave((previous) => ({
      ...previous,
      progress: {
        ...previous.progress,
        pearls: previous.progress.pearls - offer.cost,
        ammo: {
          ...previous.progress.ammo,
          [offer.id]: Math.min(99, previous.progress.ammo[offer.id] + offer.amount),
        },
      },
    }));
    setPeanutPose(offer.peanutPose);
    showBaseNotice(`${offer.label} +${offer.amount}，已放入背包`);
    window.setTimeout(() => setPeanutPose("idle"), 2400);
  };

  const upgradeRate = () => {
    const current = saveRef.current;
    const level = current.progress.fireRateLevel;
    const cost = level * 20;
    if (level >= 5 || current.progress.pearls < cost) return;
    const nextLevel = level + 1;
    commitSave((previous) => ({
      ...previous,
      progress: {
        ...previous.progress,
        fireRateLevel: nextLevel,
        pearls: previous.progress.pearls - cost,
      },
    }));
    setActiveRate(nextLevel);
    showBaseNotice(`炮台动力升到 L${nextLevel}`);
    if (view === "game") say("动力变强啦，炮弹会飞得更快！");
  };

  const chooseRate = (level: number) => {
    if (level <= save.progress.fireRateLevel) {
      setActiveRate(level);
    } else if (level === save.progress.fireRateLevel + 1) {
      upgradeRate();
    }
  };

  const selectAmmo = (ammo: AmmoKind) => {
    if (ammo !== "normal" && save.progress.ammo[ammo] <= 0) return;
    engineRef.current?.selectAmmo(ammo);
  };

  const openGameShop = () => {
    shopResumeRef.current = snapshot.phase === "playing";
    if (shopResumeRef.current) engineRef.current?.pause();
    setBasePanel("shop");
  };

  const closeGameShop = () => {
    setBasePanel(null);
    if (shopResumeRef.current && !result) engineRef.current?.resume();
    shopResumeRef.current = false;
  };

  const pointerPosition = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 390,
      y: ((event.clientY - rect.top) / rect.height) * 730,
    };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (snapshot.phase !== "playing") return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointerPosition(event);
    aimRef.current = point;
    engineRef.current?.press(point.x, point.y);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = pointerPosition(event);
    aimRef.current = point;
    engineRef.current?.aim(point.x, point.y);
  };

  const releasePointer = () => engineRef.current?.release();

  const currentAmmoDescription = useMemo(
    () => AMMO.find((ammo) => ammo.id === snapshot.selectedAmmo)?.description,
    [snapshot.selectedAmmo],
  );

  if (!hydrated) {
    return (
      <main className="loading-screen">
        <img src="/penguins/penguin-06.png" alt="" />
        <p>小宝正在潜入深海…</p>
      </main>
    );
  }

  return (
    <main className="ocean-page">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />
      <section className={`game-phone${view === "game" ? " game-phone--playing" : ""}`}>
        {view !== "game" ? (
          <div className="menu-shell">
            <header className="menu-topbar">
              <span className="brand-dot" />
              <span>小宝海洋研究所</span>
              <button className="icon-button" onClick={toggleMute} aria-label={save.muted ? "打开声音" : "静音"}>
                {save.muted ? "静" : "声"}
              </button>
            </header>

            {view === "home" ? (
              <>
                <div className="base-tools" aria-label="基地功能">
                  <button className="base-tool" onClick={() => setBasePanel("shop")}>
                    <img src="/game-assets/shop-board.png" alt="" />
                    <span>商店</span>
                  </button>
                  <button className="base-tool" onClick={() => setBasePanel("backpack")}>
                    <img src="/game-assets/backpack.png" alt="" />
                    <span>背包</span>
                  </button>
                  <button className="base-tool" onClick={manualSave}>
                    <img src="/game-assets/save.png" alt="" />
                    <span>存档</span>
                  </button>
                  <span className={`base-notice${baseNotice ? " base-notice--visible" : ""}`} role="status">
                    {baseNotice}
                  </span>
                </div>
                <div className="hero-copy">
                  <p className="eyebrow">PENGUIN OCEAN POP</p>
                  <h1>
                    小宝
                    <span>深海泡泡战</span>
                  </h1>
                  <p>瞄准、反弹、连击！和小宝一起把海洋伙伴送回珊瑚湾。</p>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="hero-orbit hero-orbit--one"><BubbleBadge kind="fish" label={false} /></div>
                  <div className="hero-orbit hero-orbit--two"><BubbleBadge kind="shell" label={false} /></div>
                  <div className="hero-orbit hero-orbit--three"><BubbleBadge kind="leopard" label={false} /></div>
                  <div className="peanut-helper">
                    <img src={`/game-assets/peanut-${peanutPose}.png`} alt="" />
                    <span>{peanutPose === "hit" ? "珍珠不够啦！" : "花生帮你看背包"}</span>
                  </div>
                  <div className="hero-glow" />
                  <img src="/penguins/penguin-02.png" alt="挥手的小宝企鹅" />
                </div>
                <div className="menu-actions">
                  <button className="primary-action" onClick={() => setView("levels")}>
                    <span>
                      <strong>开始闯关</strong>
                      <small>12 个海底区域</small>
                    </span>
                    <b>→</b>
                  </button>
                  <button className="secondary-action" onClick={() => startGame("endless")}>
                    <span className="action-icon">∞</span>
                    <span>
                      <strong>无尽深潜</strong>
                      <small>本机纪录 {save.progress.endlessBest.toLocaleString()}</small>
                    </span>
                  </button>
                </div>
                <div className="progress-strip">
                  <div>
                    <small>探险进度</small>
                    <strong>{save.progress.unlockedLevel}<span>/12 关</span></strong>
                  </div>
                  <div>
                    <small>收集星星</small>
                    <strong>{totalStars}<span>/36 ★</span></strong>
                  </div>
                  <div>
                    <small>珍珠</small>
                    <strong>{save.progress.pearls}<span> 枚</span></strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="level-view">
                <button className="back-button" onClick={() => setView("home")}>← 返回基地</button>
                <div className="level-heading">
                  <div>
                    <p className="eyebrow">STORY VOYAGE</p>
                    <h2>选择海域</h2>
                  </div>
                  <img src="/penguins/penguin-07.png" alt="正在思考路线的小宝" />
                </div>
                <div className="level-map">
                  {LEVELS.map((level, index) => {
                    const unlocked = level.id <= save.progress.unlockedLevel;
                    const stars = save.progress.stars[index];
                    return (
                      <button
                        key={level.id}
                        className={`level-node${unlocked ? "" : " level-node--locked"}${stars ? " level-node--cleared" : ""}`}
                        disabled={!unlocked}
                        onClick={() => startGame("level", index)}
                        aria-label={`${level.id} 关 ${level.name}${unlocked ? "" : "，未解锁"}`}
                      >
                        <span className="level-number">{unlocked ? level.id : "•"}</span>
                        <span className="level-name">{level.name}</span>
                        <StarRow value={stars} small />
                      </button>
                    );
                  })}
                </div>
                <div className="map-tip">
                  <BubbleBadge kind="leopard" label={false} />
                  <img className="map-tip__seal" src="/game-assets/obstacle-seal.png" alt="浮冰上的海豹" />
                  <p><strong>小心小豹泡泡！</strong>累计 6 次未消除射击后，它才会感染身边的泡泡。</p>
                </div>
              </div>
            )}

            {basePanel && (
              <div className="base-modal-backdrop" role="presentation" onPointerDown={() => setBasePanel(null)}>
                <section
                  className={`base-modal base-modal--${basePanel}`}
                  role="dialog"
                  aria-modal="true"
                  aria-label={basePanel === "shop" ? "小宝补给商店" : "小宝的道具背包"}
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <button className="base-modal__close" onClick={() => setBasePanel(null)} aria-label="关闭">
                    ×
                  </button>
                  {basePanel === "shop" ? (
                    <ShopContent
                      pearls={save.progress.pearls}
                      peanutPose={peanutPose}
                      fireRateLevel={save.progress.fireRateLevel}
                      upgradeCost={upgradeCost}
                      notice={baseNotice}
                      onBuy={buyOffer}
                      onUpgrade={upgradeRate}
                    />
                  ) : (
                    <>
                      <header className="backpack-header">
                        <img src="/game-assets/backpack.png" alt="小宝的蓝色企鹅背包" />
                        <div>
                          <p className="eyebrow">ITEM CASE</p>
                          <h2>小宝的道具背包</h2>
                          <p>进入关卡后，可以在炮台下方切换炮弹。</p>
                        </div>
                      </header>
                      <div className="inventory-grid">
                        {SHOP_OFFERS.map((offer) => (
                          <article className="inventory-item" key={offer.id}>
                            <img src={offer.image} alt="" />
                            <span>{offer.label}</span>
                            <strong>{save.progress.ammo[offer.id]}</strong>
                          </article>
                        ))}
                        <article className="inventory-item inventory-item--pearl">
                          <span className="inventory-pearl" />
                          <span>深海珍珠</span>
                          <strong>{save.progress.pearls}</strong>
                        </article>
                      </div>
                      <div className="backpack-footer">
                        <img src="/game-assets/obstacle-seal.png" alt="" />
                        <p>海豹检查完毕：道具会自动保存在这台设备上。</p>
                        <button onClick={manualSave}>
                          <img src="/game-assets/save.png" alt="" />
                          立即存档
                        </button>
                      </div>
                    </>
                  )}
                </section>
              </div>
            )}
          </div>
        ) : (
          <div className="play-shell">
            <header className="game-hud">
              <div className="hud-score">
                <small>分数</small>
                <strong>{snapshot.score.toLocaleString()}</strong>
              </div>
              <div className="hud-mission">
                <span>{mode === "level" ? `第 ${levelIndex + 1} 关` : "无尽深潜"}</span>
                <strong>{config.name}</strong>
              </div>
              <div className="hud-actions">
                <span className="pearl-count"><i />{save.progress.pearls}</span>
                <button className="hud-button" onClick={toggleMute} aria-label={save.muted ? "打开声音" : "静音"}>
                  {save.muted ? "静" : "声"}
                </button>
                <button className="hud-button" onClick={() => engineRef.current?.pause()} aria-label="暂停游戏">Ⅱ</button>
              </div>
            </header>

            <div className="canvas-wrap">
              <canvas
                ref={canvasRef}
                className="game-canvas"
                aria-label="泡泡射击游戏区域。拖动瞄准，按住可以连续发射。"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={releasePointer}
                onPointerCancel={releasePointer}
                onPointerLeave={releasePointer}
              />
              <div className="canvas-status">
                <span className="combo-chip">{snapshot.combo > 1 ? `连击 ×${snapshot.combo}` : "寻找三连"}</span>
                <span className={`miss-chip${snapshot.misses >= snapshot.missLimit - 1 ? " miss-chip--danger" : ""}`}>
                  下压 {snapshot.misses}/{snapshot.missLimit}
                </span>
              </div>
              <div className={`xiaobao-chatter${chatter ? " xiaobao-chatter--visible" : ""}`} role="status">
                {chatter}
              </div>
              <div className="next-shot next-shot--float" aria-label={`下一发：${KIND_LABELS[snapshot.nextKind]}`}>
                <small>下一发</small>
                <BubbleBadge kind={snapshot.nextKind} label={false} />
              </div>
              <div
                className="power-console"
                aria-label="炮台动力调节"
                onPointerDown={(event) => event.stopPropagation()}
              >
                <div className="power-console__track">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const unlocked = level <= save.progress.fireRateLevel;
                    const next = level === save.progress.fireRateLevel + 1;
                    return (
                      <button
                        key={level}
                        className={`${level <= activeRate ? "power-segment power-segment--filled" : "power-segment"}${unlocked ? "" : " power-segment--locked"}${next ? " power-segment--next" : ""}`}
                        onClick={() => chooseRate(level)}
                        aria-label={unlocked ? `使用 ${level} 级炮台动力` : next ? `用 ${upgradeCost} 珍珠解锁 ${level} 级炮台动力` : `${level} 级炮台动力未解锁`}
                      >
                        <span aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
                <div className="power-console__meta">
                  <strong>威力 L{activeRate}</strong>
                  <small>
                    飞行 +{(activeRate - 1) * 8}% · {FIRE_COOLDOWNS[activeRate - 1]}ms
                  </small>
                </div>
              </div>
              {snapshot.phase === "paused" && !result && (
                <div className="game-overlay">
                  <img src="/penguins/penguin-06.png" alt="睡着的小宝" />
                  <p className="eyebrow">PAUSED</p>
                  <h2>先喘口气</h2>
                  <p>海流已经暂停，小豹也不会偷偷移动。</p>
                  <button className="primary-action primary-action--compact" onClick={() => engineRef.current?.resume()}>
                    继续游戏
                  </button>
                  <button className="text-button" onClick={goHome}>返回基地</button>
                </div>
              )}
              {result && (
                <div className="game-overlay result-overlay">
                  <div className="result-burst" />
                  <img
                    src={`/penguins/penguin-${result.won ? "08" : "05"}.png`}
                    alt={result.won ? "庆祝胜利的小宝" : "难过的小宝"}
                  />
                  <p className="eyebrow">{result.won ? "AREA CLEARED" : "TRY AGAIN"}</p>
                  <h2>{result.won ? "海域净化成功！" : "泡泡越过警戒线"}</h2>
                  {mode === "level" && result.won && <StarRow value={result.stars} />}
                  <div className="result-score">
                    <span><small>本局分数</small><strong>{result.score.toLocaleString()}</strong></span>
                    <span><small>{mode === "level" ? "珍珠奖励" : "最高纪录"}</small><strong>{mode === "level" ? `+${result.reward}` : result.best.toLocaleString()}</strong></span>
                  </div>
                  <button
                    className="primary-action primary-action--compact"
                    onClick={() => {
                      if (mode === "level" && result.won && levelIndex < 11) {
                        startGame("level", levelIndex + 1);
                      } else {
                        restart();
                      }
                    }}
                  >
                    {mode === "level" && result.won && levelIndex < 11 ? "下一片海域" : "再来一次"}
                  </button>
                  <button className="text-button" onClick={goHome}>返回基地</button>
                </div>
              )}
            </div>

            <div className="control-deck">
              <div className="action-row" aria-label="炮台快捷菜单">
                {AMMO.map((ammo) => {
                  const count = ammo.id === "normal" ? "∞" : save.progress.ammo[ammo.id];
                  const empty = ammo.id !== "normal" && count === 0;
                  return (
                    <button
                      key={ammo.id}
                      className={`ammo-button ammo-button--${ammo.id}${snapshot.selectedAmmo === ammo.id ? " ammo-button--active" : ""}`}
                      disabled={empty}
                      onClick={() => selectAmmo(ammo.id)}
                      title={ammo.description}
                    >
                      {AMMO_ART[ammo.id] ? (
                        <img className="ammo-icon" src={AMMO_ART[ammo.id]} alt="" />
                      ) : (
                        <span className="ammo-symbol">{ammo.short}</span>
                      )}
                      <span>{ammo.label}</span>
                      <b>{count}</b>
                    </button>
                  );
                })}
                <button className="ammo-button shop-quick-button" onClick={openGameShop}>
                  <img className="ammo-icon" src="/game-assets/shop-board.png" alt="" />
                  <span>商店</span>
                  <b>{save.progress.pearls}</b>
                </button>
              </div>
              <p className="control-hint">{currentAmmoDescription} · 动力等级越高，炮弹飞得更快、连射等待更短</p>
            </div>
            {basePanel === "shop" && (
              <div className="base-modal-backdrop game-shop-backdrop" role="presentation" onPointerDown={closeGameShop}>
                <section
                  className="base-modal base-modal--shop"
                  role="dialog"
                  aria-modal="true"
                  aria-label="小宝补给商店"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <button className="base-modal__close" onClick={closeGameShop} aria-label="关闭">×</button>
                  <ShopContent
                    pearls={save.progress.pearls}
                    peanutPose={peanutPose}
                    fireRateLevel={save.progress.fireRateLevel}
                    upgradeCost={upgradeCost}
                    notice={baseNotice}
                    onBuy={buyOffer}
                    onUpgrade={upgradeRate}
                  />
                </section>
              </div>
            )}
          </div>
        )}
      </section>
      <aside className="desktop-note">
        <img src="/penguins/penguin-11.png" alt="" />
        <strong>小宝深海泡泡战</strong>
        <span>竖屏体验更精彩</span>
      </aside>
      <div className="rotate-overlay">
        <img src="/penguins/penguin-07.png" alt="" />
        <strong>请把设备转回竖屏</strong>
        <span>小宝已经准备好继续瞄准啦</span>
      </div>
    </main>
  );
}
