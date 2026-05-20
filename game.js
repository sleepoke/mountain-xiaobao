const SIZE = 7;
const MAX_ENERGY = 48;
const MAX_LEVEL = 8;
const SAVE_KEY = "penguin-gym-save-v3";

const catalog = {
  fish: [
    "银闪小鱼干",
    "蓝背鱼干",
    "圆肚鱼干",
    "青斑鱼干",
    "粉鳞鱼干",
    "盐烤鱼干",
    "金鳍鱼干",
    "冠军鱼干",
  ],
  shrimp: [
    "迷你虾干",
    "卷卷虾干",
    "弯弯虾干",
    "赤尾虾干",
    "虎纹虾干",
    "钳钳虾干",
    "火山虾干",
    "巨钳虾干",
  ],
};

const rewards = [2, 5, 10, 20, 38, 72, 135, 250];
const members = ["北极上班族", "跳水新人", "银背会员", "破冰舞者", "鳍力教练", "雪地马拉松员"];

const moodImages = {
  idle: "penguin-01.png",
  wink: "penguin-02.png",
  cheer: "penguin-03.png",
  angry: "penguin-04.png",
  cry: "penguin-05.png",
  sleepy: "penguin-06.png",
  confused: "penguin-07.png",
  love: "penguin-08.png",
  shock: "penguin-09.png",
  sweat: "penguin-10.png",
  proud: "penguin-11.png",
  calm: "penguin-12.png",
  sit: "penguin-13.png",
  nap: "penguin-14.png",
  turn: "penguin-15.png",
  gift: "penguin-16.png",
};

const dialogueBank = {
  idle: [
    "今天的冰山风很温柔，适合收集小鱼。",
    "如果不知道下一步做什么，可以先看看订单板哦。",
    "小宝今天也很努力地没有睡懒觉！",
    "等 Mountain 小宝 建好了，我们要举办一场鱼虾派对！",
  ],
  spawn: [
    "看！这些就是冰山附近找到的小鱼和小虾！",
    "背包一抖，新的补给弹上了冰山。",
    "小宝保证只负责拿出来，不偷吃，大概吧。",
  ],
  firstMerge: [
    "哇！成功啦！小小鱼虾真的能变得更厉害！",
    "你看，小宝没有夸张吧？合成真的超有用！",
  ],
  merge: [
    "漂亮合成！小宝的翅膀都忍不住举起来了。",
    "等级越高，价值越高，也越能帮我们建设冰山！",
    "照这样下去，冰山很快就会热闹起来！",
  ],
  combo: [
    "好厉害！连续合成！小宝的眼睛都快跟不上啦！",
    "现在的你，就像真正的冰山合成大师。",
  ],
  mismatch: [
    "咦？这个不能这样合哦。",
    "鱼干和虾干各走各的合成链，要同类型同等级才可以。",
  ],
  maxed: [
    "这已经是传说级啦！再合下去小宝要吓一跳了。",
    "最高级食材要好好留着，重要订单一定会喜欢。",
  ],
  full: [
    "仓库快要塞满啦！要不要先合成一些小鱼小虾，腾出空间？",
    "冰山货架满满当当，小宝有一点点震惊。",
  ],
  tired: [
    "小宝有点累了，体力不够啦。",
    "休息一下，或者等能量恢复，我们就能继续干活！",
  ],
  tidy: [
    "冰山货架已经整理好，小宝看得很满意。",
    "整整齐齐的冰块，连风吹过来都更乖了。",
  ],
  orderReady: [
    "有新订单来啦！先看看棋盘上有没有客人需要的小鱼小虾吧。",
    "这份订单看起来很值得做，奖励闻起来也很香。",
  ],
  materialMissing: [
    "啾？好像还差一点材料。",
    "订单需要的小鱼小虾还没有收集齐哦。我们再合成一会儿，或者去棋盘上找找看吧！",
  ],
  orderComplete: [
    "订单完成啦！客人一定会满意的！",
    "奖励已经放进仓库啦，我们离建设目标又近了一步！",
  ],
  orderHigh: [
    "哇，这可是高级订单！你居然这么快就完成了，太厉害啦！",
    "小宝要在冰山日记里记下来：今天的伙伴超级可靠！",
  ],
  orderCombo: [
    "又完成一单！整座冰山都开始忙起来啦！",
    "我们现在就像真正的冰山经营大师！",
  ],
  refreshOrders: [
    "新的订单来啦！有要小鱼的，也有要小虾的。",
    "让小宝看看，哪一份最适合现在完成呢？",
  ],
  notEnoughCoins: [
    "金币好像不太够啦。我们可以完成订单来获得更多金币！",
  ],
  penguinTap: [
    "啾！你戳到小宝啦！",
    "小宝是圆的，但不是按钮哦。",
  ],
  penguinTapMany: [
    "啾啾啾！小宝要被戳成年糕啦！",
    "不过……再戳一下也不是不可以。",
  ],
};

const discoveryLines = {
  fish: [
    "这是一条小小鱼！虽然它很小，但可是建设冰山的第一步。",
    "小鱼变大了一点！脸也圆圆的，看起来更有精神了。",
    "这条鱼闪闪的！小宝觉得它可以放在仓库最显眼的位置。",
    "中等大小的鱼出现啦！订单客人看到它一定会点头满意。",
    "哇，这条鱼的颜色好漂亮！小宝要叫它彩彩鱼。",
    "高级鱼来啦！它看起来就很适合完成大订单。",
    "这条鱼好有气势！旁边的小鱼都变得乖乖的。",
    "传说级大鱼！小宝第一次见到这么厉害的鱼！",
  ],
  shrimp: [
    "小小虾干出现啦！它真的好小，差点被雪花挡住。",
    "小虾升级啦！弯弯的样子好可爱，像一个小月亮。",
    "这只虾看起来很温柔，小宝决定叫它甜甜虾。",
    "大虾出现！它的胡须好长，看起来很有经验。",
    "哇，是虎纹虾！身上的花纹好帅气。",
    "这只虾有大钳子！看起来可以夹住很多建设材料。",
    "好漂亮的龙虾！像海里的宝石一样亮晶晶。",
    "超级大龙虾出现啦！有了它，Mountain 小宝 一定会更豪华！",
  ],
};

const storyScripts = {
  intro: {
    title: "欢迎来到冰山",
    markSeen: "introSeen",
    mood: "confused",
    lines: [
      "啾……啾啾？",
      "你终于来啦！你好呀，我叫小宝，是住在这片冰山上的小企鹅。",
      "这里以前可热闹啦，有小鱼仓库、小虾厨房、冰桥、滑梯，还有好多亮晶晶的装饰。",
      "可是后来，冰山越来越安静，很多地方都空了下来。",
      "小宝一个人太小啦，搬不动木箱，也收集不到那么多小鱼小虾。",
      "所以……你可以帮帮小宝吗？",
    ],
    choices: [
      {
        label: "当然可以！",
        mood: "cheer",
        lines: [
          "真的吗？太好啦！小宝就知道你一定是很厉害的伙伴！",
          "那从今天开始，我们一起建设这座冰山吧！",
          "只要收集小鱼、小虾，再慢慢合成更高级的食材，我们就能把这里一点一点建起来！",
        ],
      },
      {
        label: "这里是哪里？",
        mood: "proud",
        lines: [
          "这里是小宝的家，也是一座还没有完全建好的冰山！",
          "你看，这里有空地、雪坡、冰湖，还有好多可以建造的地方。",
          "等我们收集到足够的小鱼和小虾，就能解锁新的建筑啦！",
        ],
      },
      {
        label: "小鱼小虾可以吃吗？",
        mood: "sweat",
        lines: [
          "可以……但是不可以全部吃掉！",
          "小鱼小虾是很重要的材料，可以用来完成订单，也可以帮助我们建设冰山。",
          "当然啦，偶尔给小宝留一小口，小宝也会非常开心的……啾！",
        ],
      },
    ],
  },
  tutorial: {
    title: "收集与合成",
    markSeen: "tutorialSeen",
    mood: "gift",
    lines: [
      "最小的小鱼可以合成更大的鱼，最小的小虾也可以合成更厉害的虾。",
      "来试试看，把一样的小鱼或小虾放在一起吧！",
    ],
  },
  orderIntro: {
    title: "第一份订单",
    markSeen: "orderIntroSeen",
    mood: "wink",
    lines: [
      "啾啾！有新订单来啦！",
      "冰山上的小伙伴想要一些小鱼和小虾。",
      "完成订单以后，我们可以获得金币和建设材料。",
      "准备好了吗？我们一起完成这份订单吧！",
    ],
  },
};

const shopScripts = {
  intro: {
    title: "小宝商店",
    mood: "gift",
    lines: [
      "啾啾！欢迎来到小宝的冰山商店！",
      "这里可以买到钓鱼竿、冲浪板、小背包、鱼篓，还有各种能帮助你收集小鱼小虾的工具！",
      "有了更好的工具，就能去更远的地方，钓到更大的鱼，找到更稀有的虾！",
      "准备好了吗？我们一起看看今天有什么好东西吧！",
    ],
  },
  rods: {
    title: "小宝鱼竿屋",
    mood: "wink",
    lines: [
      "好耶！钓鱼竿可是冰山生活最重要的工具之一！",
      "普通钓鱼竿可以钓到小鱼，厉害一点的钓鱼竿就能钓到更大的鱼。",
      "小宝最喜欢看鱼竿“咻”一下甩出去的样子了，感觉超帅！",
    ],
  },
  boards: {
    title: "冰山冲浪铺",
    mood: "cheer",
    lines: [
      "冲浪板也很重要哦！",
      "这片冰山周围有好多小岛和浮冰，有些地方必须用冲浪板才能过去。",
      "越高级的冲浪板，能去的地方越远，还能解锁新的鱼虾收集点！",
    ],
  },
  supplies: {
    title: "小鱼小虾物资站",
    mood: "proud",
    lines: [
      "除了钓鱼竿和冲浪板，还有很多小宝精心准备的物资。",
      "比如鱼篓可以装更多小鱼，小虾桶可以装更多虾虾。",
      "它们虽然不像工具那么显眼，但对建设冰山非常重要！",
    ],
  },
};

const shopCategories = {
  rods: {
    label: "钓鱼竿",
    items: [
      { id: "wood_rod", name: "新手木竿", desc: "最基础的钓鱼竿，适合在冰山岸边钓小鱼。", cost: 40, unlockLevel: 1 },
      { id: "bamboo_rod", name: "竹节鱼竿", desc: "比木竿更轻巧，可以提高普通鱼出现概率。", cost: 120, unlockLevel: 3 },
      { id: "shell_rod", name: "贝壳鱼竿", desc: "竿身装饰着小贝壳，偶尔能钓到闪光鱼。", cost: 260, unlockBuilding: "fish_storage" },
      { id: "crystal_rod", name: "冰晶鱼竿", desc: "由冰山深处的冰晶打造，可以钓到中型鱼。", cost: 520, unlockLevel: 5 },
      { id: "starlight_rod", name: "星光鱼竿", desc: "夜晚会微微发光，适合寻找稀有鱼。", cost: 900, unlockLevel: 10 },
      { id: "gold_rod", name: "黄金鱼竿", desc: "高级鱼竿，提升高级鱼上钩概率。", cost: 1600, unlockLevel: 20 },
      { id: "rainbow_rod", name: "彩虹鱼竿", desc: "传说中的可爱鱼竿，可以吸引多种稀有鱼。", cost: 2800, unlockLevel: 35 },
      { id: "master_rod", name: "小宝大师竿", desc: "小宝亲自认证的最强鱼竿，适合挑战巨大鱼王。", cost: 5200, unlockLevel: 80 },
    ],
  },
  boards: {
    label: "冲浪板",
    items: [
      { id: "wood_board", name: "小木板", desc: "最基础的冲浪板，可以到达近岸浮冰。", cost: 60, unlockLevel: 1 },
      { id: "shell_board", name: "贝壳冲浪板", desc: "轻巧又可爱，可以探索浅海区域。", cost: 160, unlockLevel: 4 },
      { id: "blue_board", name: "蓝冰冲浪板", desc: "在冰面和海面上都很稳定，适合中距离探索。", cost: 360, unlockLevel: 8 },
      { id: "star_board", name: "海星冲浪板", desc: "装饰着小海星，可以提高探索奖励。", cost: 720, unlockBuilding: "dock" },
      { id: "flying_fish_board", name: "飞鱼冲浪板", desc: "速度很快，可以快速到达远处收集点。", cost: 1400, unlockLevel: 20 },
      { id: "aurora_board", name: "极光冲浪板", desc: "划过海面会留下漂亮的光，能进入夜光海域。", cost: 2600, unlockBuilding: "night_bay" },
      { id: "rocket_board", name: "火箭冲浪板", desc: "超高速探索工具，适合限时活动。", cost: 4200, unlockLevel: 50 },
      { id: "champion_board", name: "小宝冠军板", desc: "小宝最喜欢的终极冲浪板，可以前往神秘远海。", cost: 8000, unlockLevel: 120 },
    ],
  },
  supplies: {
    label: "物资",
    items: [
      { id: "fish_basket", name: "小鱼篓", desc: "增加小鱼携带上限。", cost: 50, unlockLevel: 1 },
      { id: "shrimp_bucket", name: "小虾桶", desc: "增加小虾携带上限。", cost: 50, unlockLevel: 1 },
      { id: "ice_box", name: "保鲜冰盒", desc: "订单完成奖励小幅提升。", cost: 240, unlockLevel: 5 },
      { id: "lucky_shell", name: "幸运贝壳", desc: "提高稀有鱼虾出现概率。", cost: 500, unlockLevel: 6 },
      { id: "xiaobao_backpack", name: "小宝背包", desc: "增加所有材料携带上限。", cost: 860, unlockBuilding: "base_shelf" },
      { id: "ice_skates", name: "加速冰鞋", desc: "减少探索等待时间。", cost: 1400, unlockLevel: 15 },
      { id: "star_compass", name: "星星指南针", desc: "解锁特殊探索路线。", cost: 2600, unlockBuilding: "night_bay" },
      { id: "treasure_map", name: "神秘藏宝图", desc: "开启隐藏区域探索任务。", cost: 5200, unlockLevel: 80 },
    ],
  },
};

const buildNodes = [
  { id: "base_shelf", name: "冰山货架", desc: "最初的补给货架，所有建设从这里开始。", unlockLevel: 1, cost: 0, map: { x: 10, y: 75, w: 18, h: 16 } },
  { id: "fish_storage", name: "小鱼仓库", desc: "收纳更多鱼干，也解锁贝壳鱼竿。", unlockLevel: 5, cost: 180, map: { x: 21, y: 69, w: 16, h: 15 } },
  { id: "shrimp_kitchen", name: "虾虾厨房", desc: "处理虾干订单，未来会开放料理玩法。", unlockLevel: 10, cost: 320, map: { x: 43, y: 61, w: 19, h: 17 } },
  { id: "ice_bridge", name: "冰桥", desc: "连接更远的浮冰，让商队更容易抵达。", unlockLevel: 15, cost: 540, map: { x: 59, y: 63, w: 16, h: 14 } },
  { id: "snow_slope", name: "雪坡", desc: "小宝很想滑下去，但现在先用于运输材料。", unlockLevel: 20, cost: 860, map: { x: 8, y: 52, w: 16, h: 17 } },
  { id: "dock", name: "小宝码头", desc: "开放更多冲浪板和远海探索路线。", unlockLevel: 28, cost: 1300, map: { x: 86, y: 70, w: 18, h: 16 } },
  { id: "ice_lake", name: "冰湖", desc: "湖面下可能藏着新的鱼虾与古老宝物。", unlockLevel: 36, cost: 1900, map: { x: 48, y: 84, w: 20, h: 15 } },
  { id: "lighthouse", name: "远海灯塔", desc: "照亮远海订单，吸引更远的小伙伴。", unlockLevel: 45, cost: 2800, map: { x: 63, y: 86, w: 13, h: 15 } },
  { id: "night_bay", name: "夜光海湾", desc: "夜晚发光的海域，未来会产出稀有材料。", unlockLevel: 55, cost: 4200, map: { x: 17, y: 39, w: 20, h: 19 } },
  { id: "festival_square", name: "节日广场", desc: "举行鱼虾派对和限时活动的地方。", unlockLevel: 65, cost: 6200, map: { x: 43, y: 25, w: 20, h: 18 } },
  { id: "lobster_diner", name: "龙虾餐厅", desc: "小宝梦中的大餐厅，订单奖励会更丰厚。", unlockLevel: 75, cost: 9000, map: { x: 77, y: 51, w: 18, h: 17 } },
  { id: "aurora_port", name: "极光港", desc: "连接神秘远海，长期目标的重要节点。", unlockLevel: 85, cost: 12800, map: { x: 83, y: 23, w: 22, h: 18 } },
  { id: "star_observatory", name: "星光观景台", desc: "能看到整座冰山最闪亮的样子。", unlockLevel: 93, cost: 17600, map: { x: 18, y: 9, w: 17, h: 17 } },
  { id: "summit", name: "Mountain 小宝峰顶", desc: "100级全图目标，未来会继续扩展到1000级长线。", unlockLevel: 100, cost: 24000, map: { x: 55, y: 8, w: 17, h: 19 } },
];

let state = loadState();
let selectedIndex = null;
let toastTimer = null;
let moodTimer = null;
let idleTimer = null;
let dialogueState = null;

const boardEl = document.querySelector("#board");
const coinsEl = document.querySelector("#coins");
const energyEl = document.querySelector("#energy");
const levelEl = document.querySelector("#level");
const ordersEl = document.querySelector("#orders");
const fishCollectionEl = document.querySelector("#fishCollection");
const shrimpCollectionEl = document.querySelector("#shrimpCollection");
const fishCollectionCountEl = document.querySelector("#fishCollectionCount");
const shrimpCollectionCountEl = document.querySelector("#shrimpCollectionCount");
const coachLineEl = document.querySelector("#coachLine");
const toastEl = document.querySelector("#toast");
const spawnBtn = document.querySelector("#spawnBtn");
const tidyBtn = document.querySelector("#tidyBtn");
const resetBtn = document.querySelector("#resetBtn");
const newOrdersBtn = document.querySelector("#newOrdersBtn");
const storyBtn = document.querySelector("#storyBtn");
const tipBtn = document.querySelector("#tipBtn");
const shopBtn = document.querySelector("#shopBtn");
const buildBtn = document.querySelector("#buildBtn");
const heroPenguinEl = document.querySelector("#heroPenguin");
const backpackEl = document.querySelector("#backpack");
const dialogueLayerEl = document.querySelector("#dialogueLayer");
const dialoguePenguinEl = document.querySelector("#dialoguePenguin");
const dialogueTitleEl = document.querySelector("#dialogueTitle");
const dialogueTextEl = document.querySelector("#dialogueText");
const dialogueChoicesEl = document.querySelector("#dialogueChoices");
const dialogueNextBtn = document.querySelector("#dialogueNextBtn");
const dialogueSkipBtn = document.querySelector("#dialogueSkipBtn");
const shopLayerEl = document.querySelector("#shopLayer");
const shopItemsEl = document.querySelector("#shopItems");
const shopCloseBtn = document.querySelector("#shopCloseBtn");
const shopTabButtons = document.querySelectorAll("[data-shop-tab]");
const buildLayerEl = document.querySelector("#buildLayer");
const buildMapEl = document.querySelector("#buildMap");
const buildLevelEl = document.querySelector("#buildLevel");
const buildProgressEl = document.querySelector("#buildProgress");
const buildCloseBtn = document.querySelector("#buildCloseBtn");
const selectedTileNameEl = document.querySelector("#selectedTileName");
const selectedTileDescEl = document.querySelector("#selectedTileDesc");
const sellBtn = document.querySelector("#sellBtn");
const boardBackBtn = document.querySelector("#boardBackBtn");

function defaultState() {
  const board = Array(SIZE * SIZE).fill(null);
  [
    [0, "fish", 1],
    [1, "fish", 1],
    [7, "shrimp", 1],
    [8, "fish", 2],
    [15, "shrimp", 2],
    [22, "fish", 1],
    [23, "shrimp", 1],
    [31, "fish", 2],
    [32, "shrimp", 1],
    [40, "fish", 1],
  ].forEach(([index, type, level]) => {
    board[index] = { type, level };
  });

  return {
    board,
    coins: 120,
    energy: 34,
    level: 1,
    xp: 0,
    discovered: { fish: [1, 2], shrimp: [1, 2] },
    orders: buildOrders(1, board),
    lastEnergyAt: Date.now(),
    story: {
      introSeen: false,
      tutorialSeen: false,
      orderIntroSeen: false,
      firstMergeDone: false,
      completedOrders: 0,
      penguinClicks: 0,
      lastMergeAt: 0,
      comboCount: 0,
    },
    shop: {
      seen: false,
      owned: [],
      activeTab: "rods",
    },
    buildings: {
      built: ["base_shelf"],
    },
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (saved && Array.isArray(saved.board) && saved.board.length === SIZE * SIZE) {
      saved.lastEnergyAt = saved.lastEnergyAt || Date.now();
      saved.discovered = normalizeDiscovered(saved.discovered);
      saved.orders = Array.isArray(saved.orders) && saved.orders.length ? saved.orders : buildOrders(saved.level || 1, saved.board);
      saved.story = normalizeStory(saved.story);
      saved.shop = normalizeShop(saved.shop);
      saved.buildings = normalizeBuildings(saved.buildings);
      return saved;
    }
  } catch (error) {
    console.warn("Save could not be read.", error);
  }
  return defaultState();
}

function normalizeShop(shop) {
  return {
    seen: Boolean(shop?.seen),
    owned: Array.isArray(shop?.owned) ? shop.owned : [],
    activeTab: shop?.activeTab && shopCategories[shop.activeTab] ? shop.activeTab : "rods",
  };
}

function normalizeBuildings(buildings) {
  const built = Array.isArray(buildings?.built) ? buildings.built : ["base_shelf"];
  return {
    built: built.includes("base_shelf") ? built : ["base_shelf", ...built],
  };
}

function normalizeDiscovered(discovered) {
  return {
    fish: Array.isArray(discovered?.fish) ? discovered.fish : [1, 2],
    shrimp: Array.isArray(discovered?.shrimp) ? discovered.shrimp : [1, 2],
  };
}

function normalizeStory(story) {
  return {
    introSeen: Boolean(story?.introSeen),
    tutorialSeen: Boolean(story?.tutorialSeen),
    orderIntroSeen: Boolean(story?.orderIntroSeen),
    firstMergeDone: Boolean(story?.firstMergeDone),
    completedOrders: Number(story?.completedOrders || 0),
    penguinClicks: Number(story?.penguinClicks || 0),
    lastMergeAt: Number(story?.lastMergeAt || 0),
    comboCount: Number(story?.comboCount || 0),
  };
}

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function itemName(tile) {
  return catalog[tile.type][tile.level - 1];
}

function assetFor(tile) {
  return `assets/${tile.type}-${String(tile.level).padStart(2, "0")}.png`;
}

function rewardFor(tile) {
  return rewards[tile.level - 1];
}

function sameTile(a, b) {
  return a && b && a.type === b.type && a.level === b.level;
}

function render() {
  coinsEl.textContent = state.coins;
  energyEl.textContent = `${state.energy}/${MAX_ENERGY}`;
  levelEl.textContent = `${state.level}`;
  spawnBtn.disabled = state.energy <= 0 || freeCells().length === 0;
  newOrdersBtn.disabled = state.coins < 30;

  boardEl.innerHTML = "";
  state.board.forEach((tile, index) => {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.type = "button";
    cell.dataset.index = index;
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", tile ? `${itemName(tile)}，等级 ${tile.level}` : "空冰块");
    if (selectedIndex === index) cell.classList.add("selected");

    if (tile) {
      cell.innerHTML = `
        <div class="tile ${tile.type}" draggable="true" data-index="${index}">
          <img src="${assetFor(tile)}" alt="" />
          <span class="tile-name">${itemName(tile)}</span>
          <span class="level-badge">${tile.level}</span>
        </div>
      `;
    }
    boardEl.appendChild(cell);
  });

  renderOrders();
  renderCollection("fish", fishCollectionEl, fishCollectionCountEl);
  renderCollection("shrimp", shrimpCollectionEl, shrimpCollectionCountEl);
  renderSelectedInfo();
  if (shopLayerEl?.classList.contains("open")) renderShop();
  if (buildLayerEl?.classList.contains("open")) renderBuildMap();
  saveState();
}

function renderOrders() {
  ordersEl.innerHTML = "";
  state.orders.forEach((order, orderIndex) => {
    const orderEl = document.createElement("article");
    orderEl.className = "order";
    const ready = canFulfill(order);
    const needs = order.needs.map((tile) => {
      const has = boardHas(tile);
      return `<span class="need ${has ? "done" : ""}" title="${itemName(tile)}">
        <img src="${assetFor(tile)}" alt="" />
        <span class="need-level">${tile.level}</span>
      </span>`;
    }).join("");

    orderEl.innerHTML = `
      <div class="order-top">
        <span class="order-title">${order.member}</span>
        <span class="order-reward">+${order.reward} 金币</span>
      </div>
      <div class="needs">${needs}</div>
      <button class="fulfill ${ready ? "primary" : "not-ready"}" type="button" data-order="${orderIndex}" aria-disabled="${ready ? "false" : "true"}">${ready ? "交付" : "收集中"}</button>
    `;
    ordersEl.appendChild(orderEl);
  });
}

function renderCollection(type, element, countElement) {
  const unlocked = new Set(state.discovered[type]);
  countElement.textContent = `${unlocked.size}/${MAX_LEVEL}`;
  element.innerHTML = Array.from({ length: MAX_LEVEL }, (_, i) => {
    const level = i + 1;
    const tile = { type, level };
    return `
      <div class="collection-item ${unlocked.has(level) ? "unlocked" : ""}" title="${itemName(tile)}">
        ${unlocked.has(level) ? `<img src="${assetFor(tile)}" alt="" />` : "?"}
        <span>${unlocked.has(level) ? itemName(tile) : "未发现"}</span>
      </div>
    `;
  }).join("");
}

function renderSelectedInfo() {
  const tile = selectedIndex === null ? null : state.board[selectedIndex];
  if (!tile) {
    selectedTileNameEl.textContent = "选择一个棋子";
    selectedTileDescEl.textContent = "点击棋盘上的鱼干或虾干，相同等级可以合成。";
    sellBtn.disabled = true;
    return;
  }

  const reward = rewardFor(tile);
  selectedTileNameEl.textContent = `${itemName(tile)} · ${tile.level}级`;
  selectedTileDescEl.textContent = `${tile.type === "fish" ? "小鱼干" : "小虾干"}链路棋子，合成奖励 ${reward} 金币，出售可获得 ${Math.max(1, Math.floor(reward / 2))} 金币。`;
  sellBtn.disabled = false;
}

function isBuildingBuilt(id) {
  return state.buildings.built.includes(id);
}

function itemUnlocked(item) {
  const levelOk = !item.unlockLevel || state.level >= item.unlockLevel;
  const buildingOk = !item.unlockBuilding || isBuildingBuilt(item.unlockBuilding);
  return levelOk && buildingOk;
}

function unlockText(item) {
  if (item.unlockBuilding && !isBuildingBuilt(item.unlockBuilding)) {
    const building = buildNodes.find((node) => node.id === item.unlockBuilding);
    return `需要建设：${building?.name || "对应建筑"}`;
  }
  if (item.unlockLevel && state.level < item.unlockLevel) {
    return `需要等级 ${item.unlockLevel}`;
  }
  return "已解锁";
}

function openShop(tab = state.shop.activeTab || "rods") {
  markAction();
  state.shop.activeTab = tab;
  shopLayerEl.classList.add("open");
  shopLayerEl.setAttribute("aria-hidden", "false");
  renderShop();
  if (!state.shop.seen) {
    state.shop.seen = true;
    startDialogue(shopScripts.intro);
  } else {
    setHeroMood("gift", "欢迎光临！看看今天的好东西吧！");
  }
  saveState();
}

function closeShop() {
  shopLayerEl.classList.remove("open");
  shopLayerEl.setAttribute("aria-hidden", "true");
  setHeroMood("wink", "谢谢光临小宝商店！下次回来时，说不定会有新商品哦！");
}

function renderShop() {
  const category = shopCategories[state.shop.activeTab];
shopTabButtons.forEach((button) => {
  const selected = button.dataset.shopTab === state.shop.activeTab;
  button.classList.toggle("primary", selected);
});

  shopItemsEl.innerHTML = category.items.map((item) => {
    const owned = state.shop.owned.includes(item.id);
    const unlocked = itemUnlocked(item);
    return `
      <article class="shop-item ${owned ? "owned" : ""} ${unlocked ? "" : "locked"}">
        <div class="shop-icon" aria-hidden="true"><img src="assets/shop-${item.id}.png" alt="" /></div>
        <div class="shop-copy">
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <div class="shop-meta">${owned ? "已拥有" : `${item.cost} 金币`} · ${unlockText(item)}</div>
        </div>
        <button type="button" data-buy-item="${item.id}" ${owned ? "disabled" : ""}>${owned ? "已拥有" : "购买"}</button>
      </article>
    `;
  }).join("");
}

function findShopItem(id) {
  for (const category of Object.values(shopCategories)) {
    const item = category.items.find((entry) => entry.id === id);
    if (item) return item;
  }
  return null;
}

function buyShopItem(id) {
  const item = findShopItem(id);
  if (!item || state.shop.owned.includes(id)) return;

  if (!itemUnlocked(item)) {
    setHeroMood("confused", "这个还没解锁哦。我们先一步一步来，等冰山建设得更好，就能买更厉害的工具啦！");
    showToast("尚未解锁。");
    startDialogue({
      title: "尚未解锁",
      mood: "confused",
      lines: [
        "这件东西还不能买哦。",
        "它需要先完成对应的解锁条件。",
        "我们先一步一步来，等冰山建设得更好，就能解锁更厉害的工具啦！",
      ],
    });
    return;
  }

  if (state.coins < item.cost) {
    setHeroMood("cry", "金币还差一点点哦。去完成一个订单，或者合成几次小鱼小虾，很快就能买到啦！");
    showToast("金币不足。");
    startDialogue({
      title: "金币不足",
      mood: "cry",
      lines: [
        "哎呀，你的金币好像还不够呢……",
        "没关系！我们可以先去完成几个订单，或者合成更多小鱼小虾来赚金币！",
        "小宝会在这里等你，不会偷偷把商品卖掉的！",
      ],
    });
    return;
  }

  state.coins -= item.cost;
  state.shop.owned.push(id);
  setHeroMood("cheer", `买到啦，啾！${item.name} 已经放进你的背包啦！`);
  showToast(`购买成功：${item.name}`);
  render();
  renderShop();
  animateReward(shopLayerEl.getBoundingClientRect(), `-${item.cost} 金币`);
  startDialogue({
    title: "购买成功",
    mood: "cheer",
    lines: [
      "成交！啾啾！",
      `新的${item.name}已经放进你的背包啦！`,
      "快去试试看吧，说不定下一次就能找到更厉害的鱼虾！",
    ],
  });
}

function openBuildMap() {
  markAction();
  buildLayerEl.classList.add("open");
  buildLayerEl.setAttribute("aria-hidden", "false");
  renderBuildMap();
  setHeroMood("proud", "这里就是 Mountain 小宝 的建设地图！我们先从小小一片冰山开始，目标是 1000 级峰顶。");
}

function closeBuildMap() {
  buildLayerEl.classList.remove("open");
  buildLayerEl.setAttribute("aria-hidden", "true");
}

function renderBuildMap() {
  const builtCount = state.buildings.built.length;
  buildLevelEl.textContent = state.level;
  buildProgressEl.textContent = `${builtCount}/${buildNodes.length}`;
  const nextNode = buildNodes.find((node) => !isBuildingBuilt(node.id));
  const detailNode = nextNode || buildNodes[buildNodes.length - 1];
  const revealLayers = buildNodes
    .filter((node) => isBuildingBuilt(node.id))
    .map((node) => `
      <img
        class="map-built-layer"
        src="assets/map-built.png"
        alt=""
        style="clip-path: ellipse(${node.map.w}% ${node.map.h}% at ${node.map.x}% ${node.map.y}%);"
      />
    `).join("");
  const markers = buildNodes.map((node, index) => {
    const unlocked = state.level >= node.unlockLevel;
    const built = isBuildingBuilt(node.id);
    const affordable = state.coins >= node.cost;
    return `
      <button
        type="button"
        class="map-node ${built ? "built" : unlocked ? "unlocked" : "locked"} ${unlocked && !built && affordable ? "ready" : ""}"
        style="left:${node.map.x}%; top:${node.map.y}%;"
        data-build-node="${node.id}"
        aria-label="${node.name}，${built ? "已完成" : unlocked ? "可建设" : `${node.unlockLevel}级解锁`}"
      >
        <span>${index + 1}</span>
      </button>
    `;
  }).join("");

  buildMapEl.innerHTML = `
    <div class="map-stage" aria-label="Mountain 小宝冰山建设大地图">
      <img class="map-base" src="assets/map-empty.png" alt="未建设的冰山大地图" />
      ${revealLayers}
      ${markers}
    </div>
    <aside class="map-detail">
      <span class="build-tag">${nextNode ? "下一处建设" : "全图已完成"}</span>
      <h3>${detailNode.name}</h3>
      <p>${detailNode.desc}</p>
      <div class="map-detail-meta">
        <span>解锁等级 ${detailNode.unlockLevel}</span>
        <span>${isBuildingBuilt(detailNode.id) ? "已完成" : `${detailNode.cost} 金币`}</span>
      </div>
    </aside>
  `;
}

function buildNode(id) {
  const node = buildNodes.find((entry) => entry.id === id);
  if (!node || isBuildingBuilt(id)) return;
  if (state.level < node.unlockLevel) {
    setHeroMood("confused", `这里需要 ${node.unlockLevel} 级才能解锁，我们慢慢来。`);
    showToast("等级不足。");
    return;
  }
  if (state.coins < node.cost) {
    setHeroMood("cry", "金币好像不太够啦。我们可以完成订单来获得更多金币！");
    showToast("金币不足。");
    return;
  }

  state.coins -= node.cost;
  state.buildings.built.push(id);
  setHeroMood("cheer", `${node.name} 完成啦！Mountain 小宝 又变漂亮了一点！`);
  showToast(`建设完成：${node.name}`);
  render();
  renderBuildMap();
  animateReward(buildLayerEl.getBoundingClientRect(), `-${node.cost} 金币`);
}

function freeCells() {
  return state.board.map((tile, index) => tile ? null : index).filter((index) => index !== null);
}

function boardHas(tile) {
  return state.board.some((slot) => sameTile(slot, tile));
}

function addDiscovered(tile) {
  const list = state.discovered[tile.type];
  if (!list.includes(tile.level)) {
    list.push(tile.level);
    const line = discoveryLines[tile.type][tile.level - 1];
    setHeroMood(tile.type === "fish" ? "proud" : "love", line);
    showToast(`发现新食材：${itemName(tile)}`);
    return true;
  }
  return false;
}

function addXp(amount) {
  state.xp += amount;
  const needed = state.level * 36;
  if (state.xp >= needed) {
    state.xp -= needed;
    state.level = Math.min(1000, state.level + 1);
    state.energy = Math.min(MAX_ENERGY, state.energy + 10);
    showToast(`Mountain 小宝升到 ${state.level} 级，能量补充了！`);
  }
}

function randomSpawnTile() {
  const type = Math.random() > 0.42 ? "fish" : "shrimp";
  const roll = Math.random();
  const level = roll > 0.9 && state.level >= 3 ? 3 : roll > 0.5 ? 2 : 1;
  return { type, level };
}

function spawnItem() {
  markAction();
  const slots = freeCells();
  if (!slots.length) {
    setHeroMood("shock", randomOf(dialogueBank.full));
    return showToast("冰山货架满了，先合成或整理一下。");
  }
  if (state.energy <= 0) {
    setHeroMood("sleepy", randomOf(dialogueBank.tired));
    return showToast("能量不够，稍后会自动恢复。");
  }

  const index = slots[Math.floor(Math.random() * slots.length)];
  const tile = randomSpawnTile();
  state.board[index] = tile;
  state.energy -= 1;
  const discovered = addDiscovered(tile);
  if (!discovered) setHeroMood("gift", randomOf(dialogueBank.spawn));
  if (!state.story.tutorialSeen) {
    state.story.tutorialSeen = true;
    setTimeout(() => startDialogue(storyScripts.tutorial), 760);
  }
  render();
  animateSpawn(index, tile);
}

function moveOrMerge(from, to) {
  markAction();
  if (from === to || state.board[from] === null) return;
  const source = state.board[from];
  const target = state.board[to];

  if (target === null) {
    state.board[to] = source;
    state.board[from] = null;
    selectedIndex = null;
    return render();
  }

  if (sameTile(source, target)) {
    if (source.level >= MAX_LEVEL) {
      selectedIndex = null;
      setHeroMood("shock", randomOf(dialogueBank.maxed));
      showToast(`${itemName(source)} 已经是最高级了。`);
      render();
      animateFail([from, to]);
      return;
    }

    const now = Date.now();
    state.story.comboCount = now - state.story.lastMergeAt < 4200 ? state.story.comboCount + 1 : 1;
    state.story.lastMergeAt = now;

    const nextTile = { type: source.type, level: source.level + 1 };
    state.board[to] = nextTile;
    state.board[from] = null;
    selectedIndex = null;
    state.coins += rewardFor(nextTile);
    addXp(8 + source.level * 3);
    const discovered = addDiscovered(nextTile);

    if (!state.story.firstMergeDone) {
      state.story.firstMergeDone = true;
      setHeroMood("cheer", randomOf(dialogueBank.firstMerge));
    } else if (state.story.comboCount >= 3) {
      setHeroMood("cheer", randomOf(dialogueBank.combo));
    } else if (!discovered) {
      setHeroMood("cheer", randomOf(dialogueBank.merge));
    }

    showToast(`合成 ${itemName(nextTile)}，金币 +${rewardFor(nextTile)}。`);
    render();
    animateMerge(to, nextTile, rewardFor(nextTile));
    return;
  }

  selectedIndex = to;
  setHeroMood("angry", randomOf(dialogueBank.mismatch));
  showToast("只有同类型同等级的食材才能合成。");
  render();
  animateFail([from, to]);
}

function tidyBoard() {
  markAction();
  const typeOrder = { fish: 0, shrimp: 1 };
  const occupied = state.board
    .filter(Boolean)
    .sort((a, b) => typeOrder[a.type] - typeOrder[b.type] || a.level - b.level);
  state.board = occupied.concat(Array(SIZE * SIZE - occupied.length).fill(null));
  selectedIndex = null;
  setHeroMood("proud", randomOf(dialogueBank.tidy));
  showToast("冰山货架已经整理好。");
  render();
}

function sellSelectedTile() {
  markAction();
  if (selectedIndex === null || !state.board[selectedIndex]) return;

  const tile = state.board[selectedIndex];
  const reward = Math.max(1, Math.floor(rewardFor(tile) / 2));
  const cell = boardEl.querySelector(`.cell[data-index="${selectedIndex}"]`);
  state.board[selectedIndex] = null;
  selectedIndex = null;
  state.coins += reward;
  setHeroMood("wink", `${itemName(tile)} 已经出售啦，补给箱又轻了一点。`);
  showToast(`出售 ${itemName(tile)}，金币 +${reward}`);
  render();
  animateReward((cell || boardEl).getBoundingClientRect(), `+${reward}`);
}

function canFulfill(order) {
  const boardCopy = state.board.map((tile) => tile ? { ...tile } : null);
  return order.needs.every((need) => {
    const index = boardCopy.findIndex((tile) => sameTile(tile, need));
    if (index === -1) return false;
    boardCopy[index] = null;
    return true;
  });
}

function fulfillOrder(index) {
  markAction();
  const order = state.orders[index];
  if (!order) return;
  if (!canFulfill(order)) {
    setHeroMood("cry", randomOf(dialogueBank.materialMissing));
    showToast("材料还没有收集齐。");
    animateFail(order.needs
      .map((need) => state.board.findIndex((tile) => tile && tile.type !== need.type))
      .filter((slotIndex) => slotIndex >= 0)
      .slice(0, 2));
    return;
  }

  order.needs.forEach((need) => {
    const boardIndex = state.board.findIndex((tile) => sameTile(tile, need));
    if (boardIndex !== -1) state.board[boardIndex] = null;
  });

  state.coins += order.reward;
  addXp(order.reward / 2);
  state.story.completedOrders += 1;
  const completedOrder = order;
  state.orders[index] = buildOrder(state.level, state.board);

  const highestNeed = Math.max(...completedOrder.needs.map((need) => need.level));
  if (state.story.completedOrders >= 3) {
    setHeroMood("love", randomOf(dialogueBank.orderCombo));
  } else if (highestNeed >= 5) {
    setHeroMood("proud", randomOf(dialogueBank.orderHigh));
  } else {
    setHeroMood("love", randomOf(dialogueBank.orderComplete));
  }

  showToast(`订单完成，获得 ${order.reward} 金币。`);
  render();
  animateReward(ordersEl.getBoundingClientRect(), `+${order.reward} 金币`);
}

function buildOrders(level, board) {
  return [buildOrder(level, board), buildOrder(level + 1, board), buildOrder(level + 2, board)];
}

function buildOrder(level, board) {
  const highest = Math.min(MAX_LEVEL, Math.max(2, Math.ceil(level / 2) + 2));
  const needsCount = Math.random() > 0.68 ? 2 : 1;
  const existing = board.filter(Boolean);
  const needs = [];

  for (let i = 0; i < needsCount; i += 1) {
    const useExisting = existing.length && Math.random() > 0.55;
    const need = useExisting
      ? { ...randomOf(existing) }
      : { type: Math.random() > 0.48 ? "fish" : "shrimp", level: 1 + Math.floor(Math.random() * highest) };
    needs.push({ type: need.type, level: Math.min(MAX_LEVEL, need.level) });
  }

  const reward = needs.reduce((sum, need) => sum + rewardFor(need) * 7, 20 + level * 8);
  return {
    member: randomOf(members),
    needs,
    reward,
  };
}

function refreshOrders() {
  markAction();
  if (state.coins < 30) {
    setHeroMood("cry", randomOf(dialogueBank.notEnoughCoins));
    return showToast("换单需要 30 金币。");
  }
  state.coins -= 30;
  state.orders = buildOrders(state.level, state.board);
  setHeroMood("wink", randomOf(dialogueBank.refreshOrders));
  render();
}

function randomOf(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function regenerateEnergy() {
  const now = Date.now();
  const elapsed = now - state.lastEnergyAt;
  const gained = Math.floor(elapsed / 45000);
  if (gained > 0) {
    state.energy = Math.min(MAX_ENERGY, state.energy + gained);
    state.lastEnergyAt = now - (elapsed % 45000);
    render();
  }
}

function setHeroMood(mood, customLine, persist = false) {
  const image = moodImages[mood] || moodImages.idle;
  heroPenguinEl.src = `assets/${image}`;
  coachLineEl.textContent = customLine || randomOf(dialogueBank.idle);
  heroPenguinEl.classList.remove("bounce");
  requestAnimationFrame(() => heroPenguinEl.classList.add("bounce"));
  clearTimeout(moodTimer);
  if (!persist && mood !== "idle") {
    moodTimer = setTimeout(() => {
      heroPenguinEl.src = `assets/${moodImages.idle}`;
      coachLineEl.textContent = randomOf(dialogueBank.idle);
    }, 3600);
  }
}

function startDialogue(script) {
  dialogueState = {
    title: script.title,
    markSeen: script.markSeen,
    mood: script.mood || "idle",
    lines: [...script.lines],
    choices: script.choices || [],
    index: 0,
  };
  dialogueLayerEl.classList.add("open");
  dialogueLayerEl.setAttribute("aria-hidden", "false");
  renderDialogue();
}

function renderDialogue() {
  if (!dialogueState) return;
  dialogueTitleEl.textContent = dialogueState.title;
  dialogueTextEl.textContent = dialogueState.lines[dialogueState.index] || "";
  dialoguePenguinEl.src = `assets/${moodImages[dialogueState.mood] || moodImages.idle}`;
  dialogueChoicesEl.innerHTML = "";

  const atEnd = dialogueState.index >= dialogueState.lines.length - 1;
  dialogueNextBtn.textContent = atEnd && dialogueState.choices.length ? "选择" : "继续";
  dialogueNextBtn.disabled = atEnd && dialogueState.choices.length > 0;

  if (atEnd && dialogueState.choices.length) {
    dialogueState.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = choice.label;
      button.addEventListener("click", () => {
        const markSeen = dialogueState.markSeen;
        dialogueState = {
          title: "小宝的回答",
          markSeen,
          mood: choice.mood || "cheer",
          lines: [...choice.lines],
          choices: [],
          index: 0,
        };
        renderDialogue();
      });
      dialogueChoicesEl.appendChild(button);
    });
  }
}

function nextDialogue() {
  if (!dialogueState) return;
  if (dialogueState.index < dialogueState.lines.length - 1) {
    dialogueState.index += 1;
    renderDialogue();
    return;
  }
  closeDialogue();
}

function closeDialogue() {
  if (dialogueState?.markSeen) {
    state.story[dialogueState.markSeen] = true;
  }
  dialogueState = null;
  dialogueLayerEl.classList.remove("open");
  dialogueLayerEl.setAttribute("aria-hidden", "true");
  saveState();
}

function animateSpawn(index, tile) {
  const cell = boardEl.querySelector(`.cell[data-index="${index}"]`);
  if (!cell || !backpackEl) return;
  const start = backpackEl.getBoundingClientRect();
  const end = cell.getBoundingClientRect();
  const img = document.createElement("img");
  img.className = "spawn-fly";
  img.src = assetFor(tile);
  img.alt = "";
  img.style.left = `${start.left + start.width * 0.62}px`;
  img.style.top = `${start.top + start.height * 0.2}px`;
  document.body.appendChild(img);

  const dx = end.left + end.width / 2 - (start.left + start.width * 0.62);
  const dy = end.top + end.height / 2 - (start.top + start.height * 0.2);
  const animation = img.animate([
    { transform: "translate(-50%, -50%) scale(0.28) rotate(-12deg)", opacity: 0 },
    { transform: `translate(calc(-50% + ${dx * 0.38}px), calc(-50% + ${dy * 0.38 - 78}px)) scale(1.12) rotate(10deg)`, opacity: 1, offset: 0.42 },
    { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.78) rotate(0deg)`, opacity: 0.05 },
  ], {
    duration: 620,
    easing: "cubic-bezier(.2,.78,.2,1)",
  });
  animation.addEventListener("finish", () => img.remove());
}

function animateMerge(index, tile, reward) {
  const cell = boardEl.querySelector(`.cell[data-index="${index}"]`);
  if (!cell) return;
  const rect = cell.getBoundingClientRect();
  cell.classList.add("merge-pop");
  setTimeout(() => cell.classList.remove("merge-pop"), 520);

  const burst = document.createElement("div");
  burst.className = "merge-burst";
  burst.style.left = `${rect.left + rect.width / 2 - 45}px`;
  burst.style.top = `${rect.top + rect.height / 2 - 45}px`;
  document.body.appendChild(burst);
  burst.animate([
    { transform: "scale(0.2)", opacity: 0 },
    { transform: "scale(1.2)", opacity: 1, offset: 0.35 },
    { transform: "scale(1.75)", opacity: 0 },
  ], { duration: 560, easing: "ease-out" }).addEventListener("finish", () => burst.remove());

  for (let i = 0; i < 12; i += 1) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    particle.style.background = tile.type === "fish" ? "#f3b64c" : "#ff7b54";
    document.body.appendChild(particle);
    const angle = (Math.PI * 2 * i) / 12;
    const distance = 32 + Math.random() * 28;
    particle.animate([
      { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0.2)`, opacity: 0 },
    ], { duration: 520 + Math.random() * 180, easing: "ease-out" }).addEventListener("finish", () => particle.remove());
  }

  animateReward(rect, `+${reward}`);
}

function animateFail(indexes) {
  indexes.forEach((index) => {
    const cell = boardEl.querySelector(`.cell[data-index="${index}"]`);
    if (!cell) return;
    cell.classList.add("fail-shake");
    setTimeout(() => cell.classList.remove("fail-shake"), 420);
  });
}

function animateReward(rect, label) {
  const reward = document.createElement("div");
  reward.className = "reward-float";
  reward.textContent = label;
  reward.style.left = `${rect.left + rect.width / 2}px`;
  reward.style.top = `${rect.top + rect.height / 2}px`;
  document.body.appendChild(reward);
  reward.animate([
    { transform: "translate(-50%, -50%) scale(0.86)", opacity: 0 },
    { transform: "translate(-50%, -78%) scale(1)", opacity: 1, offset: 0.22 },
    { transform: "translate(-50%, -150%) scale(1)", opacity: 0 },
  ], { duration: 900, easing: "ease-out" }).addEventListener("finish", () => reward.remove());
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

function markAction() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    setHeroMood("confused", "啾？是不是在观察棋盘呀？没关系，慢慢来，小宝会在旁边陪着你。");
  }, 30000);
}

boardEl.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  const index = Number(cell.dataset.index);

  if (selectedIndex === null) {
    if (state.board[index] !== null) selectedIndex = index;
    markAction();
    return render();
  }

  moveOrMerge(selectedIndex, index);
});

boardEl.addEventListener("dragstart", (event) => {
  const tile = event.target.closest(".tile");
  if (!tile) return;
  event.dataTransfer.setData("text/plain", tile.dataset.index);
  event.dataTransfer.effectAllowed = "move";
});

boardEl.addEventListener("dragover", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  event.preventDefault();
  cell.classList.add("drop-ok");
});

boardEl.addEventListener("dragleave", (event) => {
  const cell = event.target.closest(".cell");
  if (cell) cell.classList.remove("drop-ok");
});

boardEl.addEventListener("drop", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  event.preventDefault();
  document.querySelectorAll(".drop-ok").forEach((node) => node.classList.remove("drop-ok"));
  const from = Number(event.dataTransfer.getData("text/plain"));
  const to = Number(cell.dataset.index);
  moveOrMerge(from, to);
});

ordersEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-order]");
  if (!button) return;
  fulfillOrder(Number(button.dataset.order));
});

heroPenguinEl.addEventListener("click", () => {
  markAction();
  state.story.penguinClicks += 1;
  const many = state.story.penguinClicks >= 4;
  setHeroMood(many ? "shock" : "confused", randomOf(many ? dialogueBank.penguinTapMany : dialogueBank.penguinTap));
  saveState();
});

spawnBtn.addEventListener("click", spawnItem);
tidyBtn.addEventListener("click", tidyBoard);
sellBtn.addEventListener("click", sellSelectedTile);
boardBackBtn.addEventListener("click", () => {
  selectedIndex = null;
  setHeroMood("idle", "先退回来看全局，下一步再慢慢摆。");
  render();
});
storyBtn.addEventListener("click", () => startDialogue(storyScripts.intro));
tipBtn.addEventListener("click", () => {
  markAction();
  setHeroMood("wink", randomOf(dialogueBank.idle));
});
shopBtn.addEventListener("click", () => openShop());
buildBtn.addEventListener("click", openBuildMap);
shopCloseBtn.addEventListener("click", closeShop);
buildCloseBtn.addEventListener("click", closeBuildMap);
shopTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.shop.activeTab = button.dataset.shopTab;
    renderShop();
    startDialogue(shopScripts[state.shop.activeTab]);
    saveState();
  });
});
shopItemsEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-buy-item]");
  if (!button) return;
  buyShopItem(button.dataset.buyItem);
});
buildMapEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-build-node]");
  if (!button) return;
  buildNode(button.dataset.buildNode);
});
newOrdersBtn.addEventListener("click", refreshOrders);
dialogueNextBtn.addEventListener("click", nextDialogue);
dialogueSkipBtn.addEventListener("click", closeDialogue);
resetBtn.addEventListener("click", () => {
  localStorage.removeItem(SAVE_KEY);
  state = defaultState();
  selectedIndex = null;
  setHeroMood("idle", "新的 Mountain 小宝 开张了。");
  showToast("新的 Mountain 小宝 开张了。");
  render();
  startDialogue(storyScripts.intro);
});

setInterval(regenerateEnergy, 10000);
regenerateEnergy();
setHeroMood("idle", "欢迎来到 Mountain 小宝！收集小鱼小虾，建设我们的冰山吧。", true);
render();
markAction();
if (!state.story.introSeen) {
  setTimeout(() => startDialogue(storyScripts.intro), 420);
}
