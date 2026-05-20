const SIZE = 7;
const MAX_ENERGY = 48;
const REFRESH_ORDER_COST = 30;
const SAVE_KEY = "penguin-gym-save-v3";
const TYPE_UNLOCK_LEVEL = { fish: 1, shrimp: 1, shell: 6, squid: 12 };
const TYPE_LABELS = { fish: "小鱼干", shrimp: "小虾干", shell: "贝壳", squid: "鱿鱼" };
const TYPE_ORDER = { fish: 0, shrimp: 1, shell: 2, squid: 3 };

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
  shell: [
    "沙纹小贝",
    "蓝霜贝",
    "紫珍珠贝",
    "粉潮贝",
    "星海王冠贝",
    "微笑珍珠贝",
    "蓝珠珍贝",
    "月光珍珠贝",
    "珊瑚星贝",
    "皇家海心贝",
  ],
  squid: [
    "小白鱿",
    "粉鳍鱿",
    "点点鱿",
    "赤尾鱿",
    "红潮鱿",
    "紫梦鱿",
    "蓝晶鱿",
    "星砂鱿",
    "星夜鱿",
    "皇冠星鱿",
  ],
};

const rewards = [2, 5, 10, 20, 38, 72, 135, 250, 460, 820];
const members = [
  { id: "marathon", name: "雪地马拉松员", avatar: "member-01.png" },
  { id: "coach", name: "魅力教练", avatar: "member-02.png" },
  { id: "diver", name: "跳水新人", avatar: "member-03.png" },
  { id: "office", name: "北极上班族", avatar: "member-04.png" },
  { id: "collector", name: "海风收藏家", avatar: "member-05.png" },
  { id: "lighthouse", name: "灯塔守夜员", avatar: "member-06.png" },
  { id: "dockworker", name: "码头搬运员", avatar: "member-07.png" },
  { id: "angler", name: "冰湖钓手", avatar: "member-08.png" },
  { id: "chef", name: "虾虾厨师", avatar: "member-09.png" },
  { id: "host", name: "节日主持人", avatar: "member-10.png" },
  { id: "stargazer", name: "星光观测员", avatar: "member-11.png" },
  { id: "climber", name: "峰顶探险家", avatar: "member-12.png" },
];
const energyPacks = [
  { id: "sip", label: "小罐能量", amount: 10, cost: 60 },
  { id: "bottle", label: "双倍能量", amount: 24, cost: 130 },
  { id: "feast", label: "满满精神", amount: MAX_ENERGY, cost: 240, full: true },
];
const FISHING_ROWS = 5;
const FISHING_COLS = 5;
const FISHING_SEALS = 4;
const FISHING_ACTIONS = 9;
const FISHING_LIVES = 3;
const FISHING_GOALS = { fish: 4, shrimp: 3, shell: 2 };
const FISHING_REWARD_LABELS = {
  fish: "小鱼",
  shrimp: "小虾",
  shell: "贝壳",
  squid: "鱿鱼",
  gold: "金币",
  energy: "能量",
};
const SURFING_REWARD_LABELS = {
  fish: "小鱼",
  shrimp: "小虾",
  shell: "贝壳",
  coins: "金币",
  energy: "能量",
  plank: "雪花木板",
  star: "星星",
};
const surfingStages = [
  { id: "shore", name: "近岸练习", target: { fish: 5 }, duration: 26, unlockLevel: 1, recommendedBoard: "wood_board" },
  { id: "shell_shallows", name: "贝壳浅滩", target: { shell: 3, coins: 10 }, duration: 32, unlockLevel: 4, recommendedBoard: "shell_board" },
  { id: "shrimp_drift", name: "虾虾漂流带", target: { shrimp: 5 }, duration: 34, unlockLevel: 8, recommendedBoard: "star_board" },
];

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
  shell: [
    "发现小贝壳啦！海浪把它轻轻推到了冰山边。",
    "蓝色贝壳闪闪发亮，小宝想把它放进收藏盒。",
    "里面好像有珍珠！订单客人一定会喜欢。",
    "粉色贝壳像晚霞一样柔软，太漂亮啦。",
    "这枚贝壳有金色花纹，看起来很贵重。",
    "珍珠贝笑起来了，小宝也跟着开心。",
    "蓝珠珍贝出现！它像一小片冰湖。",
    "月光珍珠贝亮晶晶，是高级订单的好材料。",
    "珊瑚星贝带着海星和珊瑚，像一个小舞台。",
    "皇家海心贝出现！这一定是冰山收藏馆的镇馆之宝。",
  ],
  squid: [
    "小白鱿探头啦！它比雪花还轻。",
    "粉鳍鱿软乎乎的，游起来像小伞。",
    "点点鱿来了，身上有可爱的斑点。",
    "赤尾鱿长大了，触手也更灵活。",
    "红潮鱿出现，颜色像夕阳照在海面上。",
    "紫梦鱿闪着梦幻色，小宝看得入迷。",
    "蓝晶鱿像冰晶一样清透，适合高级订单。",
    "星砂鱿带着星星纹路，好像从夜空游来。",
    "星夜鱿出现！小宝觉得它会魔法。",
    "皇冠星鱿是传说级鱿鱼，整座冰山都亮起来啦！",
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
let inspectedBuildNodeId = null;
let pointerDrag = null;
let suppressBoardClickUntil = 0;
let fishingState = null;
let surfState = null;
let surfTimer = null;
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
const shellCollectionEl = document.querySelector("#shellCollection");
const squidCollectionEl = document.querySelector("#squidCollection");
const fishCollectionCountEl = document.querySelector("#fishCollectionCount");
const shrimpCollectionCountEl = document.querySelector("#shrimpCollectionCount");
const shellCollectionCountEl = document.querySelector("#shellCollectionCount");
const squidCollectionCountEl = document.querySelector("#squidCollectionCount");
const coachLineEl = document.querySelector("#coachLine");
const toastEl = document.querySelector("#toast");
const spawnBtn = document.querySelector("#spawnBtn");
const tidyBtn = document.querySelector("#tidyBtn");
const newOrdersBtn = document.querySelector("#newOrdersBtn");
const storyBtn = document.querySelector("#storyBtn");
const tipBtn = document.querySelector("#tipBtn");
const shopBtn = document.querySelector("#shopBtn");
const fishingBtn = document.querySelector("#fishingBtn");
const surfBtn = document.querySelector("#surfBtn");
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
const xpFillEl = document.querySelector("#xpFill");
const xpTextEl = document.querySelector("#xpText");
const energyStatBtn = document.querySelector("#energyStat");
const energyLayerEl = document.querySelector("#energyLayer");
const energyCloseBtn = document.querySelector("#energyCloseBtn");
const energyPacksEl = document.querySelector("#energyPacks");
const fishingLayerEl = document.querySelector("#fishingLayer");
const fishingCloseBtn = document.querySelector("#fishingCloseBtn");
const fishingGameEl = document.querySelector("#fishingGame");
const surfLayerEl = document.querySelector("#surfLayer");
const surfCloseBtn = document.querySelector("#surfCloseBtn");
const surfGameEl = document.querySelector("#surfGame");
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
    discovered: { fish: [1, 2], shrimp: [1, 2], shell: [], squid: [] },
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
      energyPurchases: 0,
      activeSurfStage: "shore",
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
    energyPurchases: Number.isFinite(shop?.energyPurchases) ? shop.energyPurchases : 0,
    activeSurfStage: surfingStages.some((stage) => stage.id === shop?.activeSurfStage) ? shop.activeSurfStage : "shore",
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
    shell: Array.isArray(discovered?.shell) ? discovered.shell : [],
    squid: Array.isArray(discovered?.squid) ? discovered.squid : [],
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

function maxLevelFor(type) {
  return catalog[type]?.length || 1;
}

function xpNeeded(level = state.level) {
  return level * 36;
}

function unlockedTypes(level = state.level) {
  return Object.keys(catalog).filter((type) => level >= TYPE_UNLOCK_LEVEL[type]);
}

function normalizeOrderMember(memberRef) {
  if (typeof memberRef === "object" && memberRef?.id) {
    return members.find((member) => member.id === memberRef.id) || memberRef;
  }
  return members.find((member) => member.id === memberRef || member.name === memberRef) || members[0];
}

function itemName(tile) {
  return catalog[tile.type]?.[tile.level - 1] || "未知素材";
}

function assetFor(tile) {
  return `assets/${tile.type}-${String(tile.level).padStart(2, "0")}.png`;
}

function rewardFor(tile) {
  return rewards[tile.level - 1] || rewards[rewards.length - 1];
}

function sameTile(a, b) {
  return a && b && a.type === b.type && a.level === b.level;
}

function render() {
  coinsEl.textContent = state.coins;
  energyEl.textContent = `${state.energy}/${MAX_ENERGY}`;
  levelEl.textContent = `${state.level}`;
  const xpRatio = Math.max(0, Math.min(1, state.xp / xpNeeded()));
  xpFillEl.style.width = `${Math.round(xpRatio * 100)}%`;
  xpTextEl.textContent = `${Math.round(xpRatio * 100)}%`;
  spawnBtn.disabled = state.energy <= 0 || freeCells().length === 0;
  newOrdersBtn.disabled = state.coins < REFRESH_ORDER_COST;
  newOrdersBtn.textContent = `换单 ${REFRESH_ORDER_COST}`;

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
  renderCollection("shell", shellCollectionEl, shellCollectionCountEl);
  renderCollection("squid", squidCollectionEl, squidCollectionCountEl);
  renderSelectedInfo();
  if (shopLayerEl?.classList.contains("open")) renderShop();
  if (buildLayerEl?.classList.contains("open")) renderBuildMap();
  if (energyLayerEl?.classList.contains("open")) renderEnergyPacks();
  if (fishingLayerEl?.classList.contains("open")) renderFishingGame();
  if (surfLayerEl?.classList.contains("open")) renderSurfGame();
  saveState();
}

function renderOrders() {
  ordersEl.innerHTML = "";
  state.orders.forEach((order, orderIndex) => {
    const orderEl = document.createElement("article");
    const ready = canFulfill(order);
    const status = ready ? "ready" : "missing";
    const statusText = ready ? "可交付" : "缺材料";
    orderEl.className = `order status-${status}`;
    const member = normalizeOrderMember(order.memberId || order.member);
    const needs = order.needs.map((tile) => {
      const has = boardHas(tile);
      return `<span class="need ${has ? "done" : ""}" title="${itemName(tile)}">
        <img src="${assetFor(tile)}" alt="" />
        <span class="need-level">${tile.level}</span>
      </span>`;
    }).join("");

    orderEl.innerHTML = `
      <div class="order-top">
        <span class="order-status">
          <img src="assets/fishing/order/order-${status}.png" alt="" />
          <strong>${statusText}</strong>
        </span>
        <span class="order-reward">+${order.reward} 金币 / +${orderXp(order)} XP</span>
      </div>
      <div class="order-body">
        <span class="member-chip">
          <img class="member-avatar" src="assets/${member.avatar}" alt="" />
          <span class="order-title">${member.name}</span>
        </span>
        <div class="needs">${needs}</div>
      </div>
      <button class="fulfill ${ready ? "primary" : "not-ready"}" type="button" data-order="${orderIndex}" aria-disabled="${ready ? "false" : "true"}">${ready ? "交付" : "收集中"}</button>
    `;
    ordersEl.appendChild(orderEl);
  });
}

function renderCollection(type, element, countElement) {
  if (!element || !countElement) return;
  const unlocked = new Set(state.discovered[type]);
  const maxLevel = maxLevelFor(type);
  countElement.textContent = `${unlocked.size}/${maxLevel}`;
  element.innerHTML = Array.from({ length: maxLevel }, (_, i) => {
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
  selectedTileDescEl.textContent = `${TYPE_LABELS[tile.type] || "素材"}链路棋子，合成奖励 ${reward} 金币，出售可获得 ${Math.max(1, Math.floor(reward / 2))} 金币。`;
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
  inspectedBuildNodeId = inspectedBuildNodeId || state.buildings.built[state.buildings.built.length - 1] || "base_shelf";
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
  const inspectedNode = buildNodes.find((node) => node.id === inspectedBuildNodeId);
  const detailNode = inspectedNode || nextNode || buildNodes[buildNodes.length - 1];
  const detailBuilt = isBuildingBuilt(detailNode.id);
  const detailUnlocked = state.level >= detailNode.unlockLevel;
  const detailAffordable = state.coins >= detailNode.cost;
  const detailTag = inspectedNode
    ? detailBuilt ? "已建设地点" : detailUnlocked ? "可建设地点" : "未解锁地点"
    : nextNode ? "下一处建设" : "全图已完成";
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
        class="map-node ${built ? "built" : unlocked ? "unlocked" : "locked"} ${unlocked && !built && affordable ? "ready" : ""} ${detailNode.id === node.id ? "active" : ""}"
        style="left:${node.map.x}%; top:${node.map.y}%;"
        data-build-node="${node.id}"
        aria-label="${node.name}，${built ? "已完成" : unlocked ? "可建设" : `${node.unlockLevel}级解锁`}"
      >
        <span>${index + 1}</span>
      </button>
    `;
  }).join("");
  const walkers = [
    ["route-a", "east"],
    ["route-b", "south"],
    ["route-c", "west"],
    ["route-d", "north"],
  ].map(([route, direction]) => `<span class="map-penguin ${route} walk-${direction}" aria-hidden="true"></span>`).join("");

  buildMapEl.innerHTML = `
    <div class="map-stage" aria-label="Mountain 小宝冰山建设大地图">
      <img class="map-base" src="assets/map-empty.png" alt="未建设的冰山大地图" />
      ${revealLayers}
      <div class="map-penguins" aria-hidden="true">${walkers}</div>
      ${markers}
    </div>
    <aside class="map-detail ${detailBuilt ? "built" : detailUnlocked ? "unlocked" : "locked"}">
      <span class="build-tag">${detailTag}</span>
      <div class="map-detail-top">
        <img src="assets/build-${detailNode.id}.png" alt="" />
        <div>
          <h3>${detailNode.name}</h3>
          <p>${detailNode.desc}</p>
        </div>
      </div>
      <div class="map-detail-meta">
        <span>解锁等级 ${detailNode.unlockLevel}</span>
        <span>${detailBuilt ? "已完成" : detailUnlocked ? `${detailNode.cost} 金币` : `还差 ${detailNode.unlockLevel - state.level} 级`}</span>
        <span>${detailBuilt ? "点击地图节点可查看地点" : detailUnlocked && detailAffordable ? "点击节点开始建设" : detailUnlocked ? "金币不足" : "升级后解锁"}</span>
      </div>
    </aside>
  `;
}

function buildNode(id) {
  const node = buildNodes.find((entry) => entry.id === id);
  if (!node) return;
  inspectedBuildNodeId = id;
  if (isBuildingBuilt(id)) {
    setHeroMood("proud", `${node.name} 已经建好了。小企鹅们正在这里忙来忙去呢。`);
    showToast(`${node.name}：${node.desc}`);
    renderBuildMap();
    return;
  }
  if (state.level < node.unlockLevel) {
    setHeroMood("confused", `这里需要 ${node.unlockLevel} 级才能解锁，我们慢慢来。`);
    showToast("等级不足。");
    renderBuildMap();
    return;
  }
  if (state.coins < node.cost) {
    setHeroMood("cry", "金币好像不太够啦。我们可以完成订单来获得更多金币！");
    showToast("金币不足。");
    renderBuildMap();
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

function hasFishingRod() {
  return state.shop.owned.some((id) => id.endsWith("_rod"));
}

function openFishingGame() {
  markAction();
  if (!hasFishingRod()) {
    setHeroMood("confused", "先买一根钓鱼竿，就能去冰湖玩探测钓鱼啦！");
    showToast("先在商店购买钓鱼竿。");
    openShop("rods");
    return;
  }
  if (!fishingState || fishingState.status === "settlement") fishingState = createFishingState();
  fishingLayerEl.classList.add("open");
  fishingLayerEl.setAttribute("aria-hidden", "false");
  renderFishingGame();
  setHeroMood("wink", "冰湖探测开始！小鱼越多，附近越可能有海豹哦。");
}

function closeFishingGame() {
  fishingLayerEl.classList.remove("open");
  fishingLayerEl.setAttribute("aria-hidden", "true");
}

function createFishingState() {
  const cells = Array.from({ length: FISHING_ROWS * FISHING_COLS }, (_, id) => ({
    id,
    row: Math.floor(id / FISHING_COLS),
    col: id % FISHING_COLS,
    isSeal: false,
    isOpen: false,
    isMarked: false,
    adjacentSealCount: 0,
    rewardType: null,
    rewardAmount: 1,
  }));
  shuffleIndexes(cells.length).slice(0, FISHING_SEALS).forEach((index) => {
    cells[index].isSeal = true;
  });
  cells.forEach((cell) => {
    if (!cell.isSeal) {
      const roll = Math.random();
      if (roll < 0.34) cell.rewardType = "fish";
      else if (roll < 0.57) cell.rewardType = "shrimp";
      else if (roll < 0.72) cell.rewardType = "shell";
      else if (roll < 0.88) {
        cell.rewardType = "gold";
        cell.rewardAmount = 12 + Math.floor(Math.random() * 16);
      } else {
        cell.rewardType = "energy";
        cell.rewardAmount = 1;
      }
    }
  });
  recalculateFishingHints(cells);
  return {
    cells,
    mode: "hook",
    actions: FISHING_ACTIONS,
    lives: FISHING_LIVES,
    scans: 2,
    hints: 1,
    combo: 0,
    maxCombo: 0,
    firstHook: true,
    scanArea: [],
    status: "playing",
    claimed: false,
    message: "选择下钩、标记、扫描或提示，避开海豹收集奖励。",
    rewards: { fish: 0, shrimp: 0, shell: 0, squid: 0, gold: 0, energy: 0 },
  };
}

function shuffleIndexes(length) {
  return Array.from({ length }, (_, index) => index)
    .sort(() => Math.random() - 0.5);
}

function recalculateFishingHints(cells = fishingState.cells) {
  cells.forEach((cell) => {
    cell.adjacentSealCount = getFishingNeighbors(cell.id, cells)
      .filter((neighbor) => neighbor.isSeal).length;
  });
}

function getFishingNeighbors(index, cells = fishingState.cells) {
  const row = Math.floor(index / FISHING_COLS);
  const col = index % FISHING_COLS;
  const neighbors = [];
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) continue;
      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      if (nextRow < 0 || nextCol < 0 || nextRow >= FISHING_ROWS || nextCol >= FISHING_COLS) continue;
      neighbors.push(cells[nextRow * FISHING_COLS + nextCol]);
    }
  }
  return neighbors;
}

function renderFishingGame() {
  if (!fishingGameEl || !fishingState) return;
  const rewards = Object.entries(fishingState.rewards)
    .filter(([, amount]) => amount > 0)
    .map(([type, amount]) => `<span><img src="${fishingRewardAsset(type)}" alt="" />${FISHING_REWARD_LABELS[type]} +${amount}</span>`)
    .join("") || "<span>还没有收获</span>";

  if (fishingState.status === "settlement") {
    fishingGameEl.innerHTML = `
      <section class="fishing-result">
        <img src="assets/fishing/panels/panel-result.png" alt="" />
        <h3>大丰收！</h3>
        <div class="fishing-rewards">${rewards}</div>
        <p>最大连击 ${fishingState.maxCombo}，剩余行动 ${Math.max(0, fishingState.actions)}。</p>
        <div class="fishing-result-actions">
          <button class="primary" type="button" data-fishing-action="restart">再来一局</button>
          <button type="button" data-fishing-action="return">返回冰山</button>
        </div>
      </section>
    `;
    return;
  }

  const cells = fishingState.cells.map((cell) => renderFishingCell(cell)).join("");
  fishingGameEl.innerHTML = `
    <div class="fishing-hud">
      <span><img src="assets/fishing/buttons/hud-energy.png" alt="" />行动 ${Math.max(0, fishingState.actions)}</span>
      <span><img src="assets/fishing/buttons/popup-seal-warning.png" alt="" />生命 ${Math.max(0, fishingState.lives)}</span>
      <span><img src="assets/fishing/buttons/hud-combo.png" alt="" />连击 ${fishingState.combo}</span>
    </div>
    <div class="fishing-objective">
      ${Object.entries(FISHING_GOALS).map(([type, goal]) => `
        <span>
          <img src="${fishingRewardAsset(type)}" alt="" />
          ${Math.min(fishingState.rewards[type], goal)}/${goal}
        </span>
      `).join("")}
    </div>
    <div class="fishing-message">${fishingState.message}</div>
    <div class="fishing-board" style="grid-template-columns: repeat(${FISHING_COLS}, 1fr);">
      ${cells}
    </div>
    <div class="fishing-controls">
      ${renderFishingModeButton("hook", "下钩", "btn-hook.png")}
      ${renderFishingModeButton("mark", "标记", "btn-mark.png")}
      ${renderFishingModeButton("scan", `扫描 ${fishingState.scans}`, "btn-scan.png", fishingState.scans <= 0)}
      <button type="button" data-fishing-action="hint" ${fishingState.hints <= 0 ? "disabled" : ""}>
        <img src="assets/fishing/buttons/btn-hint.png" alt="" />
        <span>提示 ${fishingState.hints}</span>
      </button>
    </div>
  `;
}

function renderFishingCell(cell) {
  const scanClass = fishingState.scanArea.includes(cell.id) ? "scan-highlight" : "";
  const tileImage = fishingTileImage(cell);
  const reward = cell.isOpen && !cell.isSeal && cell.rewardType
    ? `<img class="fishing-cell-reward" src="${fishingRewardAsset(cell.rewardType)}" alt="" />`
    : "";
  return `
    <button class="fishing-cell ${cell.isOpen ? "open" : ""} ${cell.isMarked ? "marked" : ""} ${scanClass}" type="button" data-fishing-cell="${cell.id}">
      <img src="${tileImage}" alt="" />
      ${reward}
    </button>
  `;
}

function renderFishingModeButton(mode, label, icon, disabled = false) {
  return `
    <button class="${fishingState.mode === mode ? "active" : ""}" type="button" data-fishing-mode="${mode}" ${disabled ? "disabled" : ""}>
      <img src="assets/fishing/buttons/${icon}" alt="" />
      <span>${label}</span>
    </button>
  `;
}

function fishingTileImage(cell) {
  if (cell.isMarked && !cell.isOpen) return "assets/fishing/tiles/tile-marked.png";
  if (!cell.isOpen) return "assets/fishing/tiles/tile-closed.png";
  if (cell.isSeal) return "assets/fishing/tiles/tile-seal.png";
  return `assets/fishing/tiles/tile-open-${Math.min(3, cell.adjacentSealCount)}.png`;
}

function fishingRewardAsset(type) {
  if (["fish", "shrimp", "shell", "energy"].includes(type)) return `assets/fishing/rewards/reward-${type}.png`;
  if (type === "gold") return "assets/resource-coins.png";
  return "assets/fishing/rewards/reward-fish.png";
}

function handleFishingCell(index) {
  if (!fishingState || fishingState.status !== "playing") return;
  const cell = fishingState.cells[index];
  if (!cell || cell.isOpen) return;
  if (fishingState.mode === "mark") {
    cell.isMarked = !cell.isMarked;
    fishingState.message = cell.isMarked ? "已标记疑似海豹冰洞。" : "标记已取消。";
    return renderFishingGame();
  }
  if (fishingState.mode === "scan") {
    scanFishingArea(index);
    return renderFishingGame();
  }
  hookFishingCell(index);
  renderFishingGame();
}

function hookFishingCell(index) {
  const cell = fishingState.cells[index];
  if (!cell || cell.isOpen) return;
  if (cell.isMarked) {
    fishingState.message = "这里已经标记了，先取消标记再下钩。";
    return;
  }
  if (fishingState.firstHook) {
    ensureFishingFirstHookSafe(index);
    fishingState.firstHook = false;
  }
  fishingState.actions -= 1;
  if (cell.isSeal) {
    cell.isOpen = true;
    fishingState.lives -= 1;
    fishingState.combo = 0;
    fishingState.message = "哎呀！海豹抢走了鱼饵，但游戏还能继续。";
    setHeroMood("shock", "这里有海豹！下次我们换个冰洞试试。");
  } else {
    revealFishingSafe(index);
    fishingState.message = cell.adjacentSealCount === 0
      ? "安全冰洞！附近没有海豹，周围也一起探开啦。"
      : `附近有 ${Math.min(3, cell.adjacentSealCount)} 条小鱼提示，说明海豹离这里不远。`;
  }
  checkFishingEnd();
}

function ensureFishingFirstHookSafe(index) {
  const firstCell = fishingState.cells[index];
  if (!firstCell?.isSeal) return;
  const swapCell = fishingState.cells.find((cell) => !cell.isSeal && cell.id !== index);
  if (!swapCell) return;
  firstCell.isSeal = false;
  swapCell.isSeal = true;
  firstCell.rewardType = firstCell.rewardType || "fish";
  recalculateFishingHints();
}

function revealFishingSafe(index) {
  const cell = fishingState.cells[index];
  if (!cell || cell.isOpen || cell.isMarked || cell.isSeal) return;
  cell.isOpen = true;
  collectFishingReward(cell);
  fishingState.combo += 1;
  fishingState.maxCombo = Math.max(fishingState.maxCombo, fishingState.combo);
  if (cell.adjacentSealCount === 0) {
    getFishingNeighbors(index).forEach((neighbor) => revealFishingSafe(neighbor.id));
  }
}

function collectFishingReward(cell) {
  if (!cell.rewardType) return;
  fishingState.rewards[cell.rewardType] += cell.rewardAmount;
  cell.rewardType = null;
}

function scanFishingArea(index) {
  if (fishingState.scans <= 0) {
    fishingState.mode = "hook";
    fishingState.message = "扫描次数用完啦。";
    return;
  }
  const center = fishingState.cells[index];
  const area = fishingState.cells.filter((cell) =>
    Math.abs(cell.row - center.row) <= 1 && Math.abs(cell.col - center.col) <= 1
  );
  const seals = area.filter((cell) => cell.isSeal && !cell.isOpen).length;
  fishingState.scanArea = area.map((cell) => cell.id);
  fishingState.scans -= 1;
  fishingState.actions = Math.max(0, fishingState.actions - 1);
  fishingState.message = `扫描完成：这片 3×3 冰面里可能有 ${seals} 只海豹。`;
  fishingState.mode = "hook";
  checkFishingEnd();
}

function useFishingHint() {
  if (!fishingState || fishingState.status !== "playing" || fishingState.hints <= 0) return;
  const safeCells = fishingState.cells.filter((cell) => !cell.isOpen && !cell.isMarked && !cell.isSeal);
  const sealCells = fishingState.cells.filter((cell) => !cell.isOpen && !cell.isMarked && cell.isSeal);
  fishingState.hints -= 1;
  if (safeCells.length) {
    const cell = randomOf(safeCells);
    revealFishingSafe(cell.id);
    fishingState.scanArea = [cell.id];
    fishingState.message = "小宝帮你找到一个安全冰洞！";
  } else if (sealCells.length) {
    const cell = randomOf(sealCells);
    cell.isMarked = true;
    fishingState.scanArea = [cell.id];
    fishingState.message = "小宝标出一个疑似海豹冰洞。";
  }
  checkFishingEnd();
  renderFishingGame();
}

function checkFishingEnd() {
  const closedSafeCells = fishingState.cells.some((cell) => !cell.isSeal && !cell.isOpen);
  const goalsDone = Object.entries(FISHING_GOALS)
    .every(([type, goal]) => fishingState.rewards[type] >= goal);
  if (fishingState.lives <= 0 || fishingState.actions <= 0 || !closedSafeCells || goalsDone) {
    finishFishingGame(goalsDone || !closedSafeCells ? "catch" : "tired");
  }
}

function finishFishingGame(reason) {
  if (!fishingState || fishingState.status === "settlement") return;
  fishingState.status = "settlement";
  fishingState.message = reason === "catch" ? "目标完成，收获带回冰山！" : "行动结束，先把收获带回去。";
  applyFishingRewards();
  setHeroMood("cheer", "钓鱼收获装进背包啦！可以拿去合成和交订单。");
  showToast("冰湖钓鱼结算完成。");
  render();
}

function applyFishingRewards() {
  if (fishingState.claimed) return;
  fishingState.claimed = true;
  state.coins += fishingState.rewards.gold;
  state.energy = Math.min(MAX_ENERGY, state.energy + fishingState.rewards.energy);
  ["fish", "shrimp", "shell", "squid"].forEach((type) => {
    for (let count = 0; count < fishingState.rewards[type]; count += 1) {
      const emptyIndex = freeCells()[0];
      if (emptyIndex === undefined) {
        state.coins += 3;
      } else {
        const tile = { type, level: 1 };
        state.board[emptyIndex] = tile;
        addDiscovered(tile);
      }
    }
  });
}

function hasSurfboard() {
  return state.shop.owned.some((id) => id.endsWith("_board"));
}

function ownedSurfboards() {
  const owned = state.shop.owned.filter((id) => id.endsWith("_board"));
  return shopCategories.boards.items.filter((item) => owned.includes(item.id));
}

function openSurfGame() {
  markAction();
  if (!hasSurfboard()) {
    setHeroMood("confused", "先买一块冲浪板，就能和花生一起去远海探索啦！");
    showToast("先在商店购买冲浪板。");
    openShop("boards");
    return;
  }
  if (!surfState || surfState.status === "finished") {
    surfState = createSurfSelectState();
  }
  surfLayerEl.classList.add("open");
  surfLayerEl.setAttribute("aria-hidden", "false");
  renderSurfGame();
  if (surfState.status === "playing") startSurfTimer();
  setHeroMood("cheer", "远海冲浪入口开启！左右滑动切换海路，收集漂来的宝贝。");
}

function closeSurfGame() {
  stopSurfTimer();
  surfLayerEl.classList.remove("open");
  surfLayerEl.setAttribute("aria-hidden", "true");
}

function createSurfSelectState() {
  return {
    status: "select",
    stageId: state.shop.activeSurfStage || "shore",
    boardId: ownedSurfboards()[0]?.id || "wood_board",
    lane: 1,
    progress: 0,
    objects: [],
    durability: 3,
    combo: 0,
    maxCombo: 0,
    shield: 0,
    magnet: 0,
    claimed: false,
    rewards: { fish: 0, shrimp: 0, shell: 0, coins: 0, energy: 0, plank: 0, star: 0 },
    message: "选择海域和冲浪板，准备出发。",
  };
}

function startSurfRun() {
  const stage = currentSurfStage();
  if (state.energy < 1) {
    setHeroMood("sleepy", randomOf(dialogueBank.tired));
    return showToast("开始冲浪需要 1 点能量。");
  }
  state.energy -= 1;
  surfState.status = "playing";
  surfState.lane = 1;
  surfState.progress = 0;
  surfState.objects = [];
  surfState.durability = 3 + (surfState.boardId === "blue_board" || surfState.boardId === "champion_board" ? 1 : 0);
  surfState.combo = 0;
  surfState.maxCombo = 0;
  surfState.shield = surfState.boardId === "champion_board" ? 1 : 0;
  surfState.magnet = surfState.boardId === "star_board" ? 3 : 0;
  surfState.claimed = false;
  surfState.rewards = { fish: 0, shrimp: 0, shell: 0, coins: 0, energy: 0, plank: 0, star: 0 };
  surfState.message = `${stage.name} 出发！左右切换海路，避开障碍。`;
  setHeroMood("cheer", "小宝站稳啦，花生也准备好了！");
  render();
  startSurfTimer();
}

function currentSurfStage() {
  return surfingStages.find((stage) => stage.id === surfState?.stageId) || surfingStages[0];
}

function currentSurfBoard() {
  return shopCategories.boards.items.find((board) => board.id === surfState?.boardId) || ownedSurfboards()[0] || shopCategories.boards.items[0];
}

function startSurfTimer() {
  stopSurfTimer();
  surfTimer = setInterval(tickSurfRun, 760);
}

function stopSurfTimer() {
  if (surfTimer) clearInterval(surfTimer);
  surfTimer = null;
}

function tickSurfRun() {
  if (!surfState || surfState.status !== "playing") return;
  const stage = currentSurfStage();
  surfState.progress += 1;
  surfState.objects.forEach((object) => {
    object.row += 1;
  });
  resolveSurfCollisions();
  surfState.objects = surfState.objects.filter((object) => object.row < 5 && !object.collected);
  if (Math.random() < 0.86) surfState.objects.push(createSurfObject(stage));
  if (surfState.progress >= stage.duration || surfState.durability <= 0) finishSurfRun();
  renderSurfGame();
}

function createSurfObject(stage) {
  const lane = Math.floor(Math.random() * 3);
  const roll = Math.random();
  const rewardPool = stage.id === "shell_shallows"
    ? ["shell", "coins", "shell", "fish", "energy"]
    : stage.id === "shrimp_drift"
      ? ["shrimp", "shrimp", "fish", "plank", "coins"]
      : ["fish", "fish", "shrimp", "coins", "energy"];
  if (roll < 0.68) {
    const type = randomOf(rewardPool);
    return { id: `${Date.now()}-${Math.random()}`, kind: "reward", type, lane, row: 0 };
  }
  const obstaclePool = ["ice", "seal", "wave", "driftwood"];
  return { id: `${Date.now()}-${Math.random()}`, kind: "obstacle", type: randomOf(obstaclePool), lane, row: 0 };
}

function resolveSurfCollisions() {
  surfState.objects.forEach((object) => {
    if (object.row < 4 || object.collected) return;
    if (object.kind === "reward" && (object.lane === surfState.lane || surfState.magnet > 0)) {
      collectSurfReward(object.type);
      object.collected = true;
      surfState.combo += 1;
      surfState.maxCombo = Math.max(surfState.maxCombo, surfState.combo);
      if (surfState.combo === 5) surfState.rewards.coins += 5;
      if (surfState.combo === 10) surfState.rewards.fish += 1;
      surfState.message = `收集到${SURFING_REWARD_LABELS[object.type]}，连击 ${surfState.combo}！`;
    } else if (object.kind === "obstacle" && object.lane === surfState.lane) {
      object.collected = true;
      hitSurfObstacle(object.type);
    }
  });
  if (surfState.magnet > 0) surfState.magnet -= 1;
}

function collectSurfReward(type) {
  const gain = type === "coins" ? 6 + Math.floor(Math.random() * 8) : 1;
  surfState.rewards[type] += gain;
}

function hitSurfObstacle(type) {
  if (type === "wave") {
    surfState.lane = Math.max(0, Math.min(2, surfState.lane + (Math.random() > 0.5 ? 1 : -1)));
    surfState.message = "浪花把小宝推到旁边海路啦！";
  }
  if (type !== "ice" && type !== "wave") {
    if (surfState.shield > 0) {
      surfState.shield -= 1;
      surfState.message = "护盾挡住了一次碰撞！";
    } else {
      surfState.durability -= 1;
      surfState.message = type === "seal" ? "海豹探头吓了小宝一跳，耐久 -1。" : "撞到漂流木，耐久 -1。";
    }
  }
  surfState.combo = 0;
  setHeroMood("sweat", surfState.message);
}

function finishSurfRun() {
  if (!surfState || surfState.status === "finished") return;
  surfState.status = "finished";
  surfState.message = surfState.durability <= 0 ? "小宝被浪花送回岸边啦，先结算收获。" : "到达终点！远海宝贝带回冰山。";
  stopSurfTimer();
  applySurfRewards();
  render();
}

function applySurfRewards() {
  if (surfState.claimed) return;
  surfState.claimed = true;
  state.coins += surfState.rewards.coins + surfState.rewards.plank * 8 + surfState.rewards.star * 20;
  state.energy = Math.min(MAX_ENERGY, state.energy + surfState.rewards.energy);
  ["fish", "shrimp", "shell"].forEach((type) => {
    for (let count = 0; count < surfState.rewards[type]; count += 1) {
      const emptyIndex = freeCells()[0];
      if (emptyIndex === undefined) {
        state.coins += 3;
      } else {
        const tile = { type, level: 1 };
        state.board[emptyIndex] = tile;
        addDiscovered(tile);
      }
    }
  });
  setHeroMood("cheer", "远海收获已装进仓库啦！");
}

function moveSurfLane(direction) {
  if (!surfState || surfState.status !== "playing") return;
  surfState.lane = Math.max(0, Math.min(2, surfState.lane + direction));
  renderSurfGame();
}

function renderSurfGame() {
  if (!surfGameEl || !surfState) return;
  if (surfState.status === "select") {
    renderSurfSelect();
    return;
  }
  if (surfState.status === "finished") {
    renderSurfResult();
    return;
  }
  const stage = currentSurfStage();
  const cells = Array.from({ length: 15 }, (_, index) => {
    const row = Math.floor(index / 3);
    const lane = index % 3;
    const object = surfState.objects.find((entry) => entry.row === row && entry.lane === lane && !entry.collected);
    return `
      <div class="surf-lane-cell ${lane === surfState.lane && row === 4 ? "player-cell" : ""}">
        ${object ? `<img class="surf-object ${object.kind}" src="${surfObjectAsset(object)}" alt="" />` : ""}
        ${lane === surfState.lane && row === 4 ? `<img class="surf-player" src="assets/penguin-13.png" alt="" />` : ""}
      </div>
    `;
  }).join("");
  surfGameEl.innerHTML = `
    <div class="surf-hud">
      <span>${stage.name}</span>
      <span>进度 ${Math.min(stage.duration, surfState.progress)}/${stage.duration}</span>
      <span>耐久 ${Math.max(0, surfState.durability)}</span>
      <span>连击 ${surfState.combo}</span>
    </div>
    <div class="surf-message">${surfState.message}</div>
    <div class="surf-track">${cells}</div>
    <div class="surf-controls">
      <button type="button" data-surf-action="left">左</button>
      <button class="primary" type="button" data-surf-action="pause">暂停</button>
      <button type="button" data-surf-action="right">右</button>
    </div>
  `;
}

function renderSurfSelect() {
  const ownedBoards = ownedSurfboards();
  const stages = surfingStages.map((stage) => {
    const locked = state.level < stage.unlockLevel;
    const selected = surfState.stageId === stage.id;
    return `
      <button class="surf-stage-card ${selected ? "active" : ""}" type="button" data-surf-stage="${stage.id}" ${locked ? "disabled" : ""}>
        <strong>${stage.name}</strong>
        <span>${locked ? `${stage.unlockLevel} 级解锁` : `目标：${surfTargetText(stage.target)}`}</span>
      </button>
    `;
  }).join("");
  const boards = ownedBoards.map((board) => `
    <button class="surf-board-choice ${surfState.boardId === board.id ? "active" : ""}" type="button" data-surf-board="${board.id}">
      <img src="assets/shop-${board.id}.png" alt="" />
      <span>${board.name}</span>
    </button>
  `).join("");
  surfGameEl.innerHTML = `
    <div class="surf-select">
      <div class="surf-hero">
        <img src="assets/surfing/char-peanut-surf.png" alt="" />
        <div>
          <h3>花生在海边等你</h3>
          <p>左右滑动切换三条海路，收集目标奖励，避开海豹、浪花和漂流木。</p>
        </div>
      </div>
      <div class="surf-stage-list">${stages}</div>
      <div class="surf-board-list">${boards}</div>
      <button class="primary surf-start" type="button" data-surf-action="start">开始冲浪 1 能量</button>
    </div>
  `;
}

function renderSurfResult() {
  const rewards = Object.entries(surfState.rewards)
    .filter(([, amount]) => amount > 0)
    .map(([type, amount]) => `<span><img src="${surfRewardAsset(type)}" alt="" />${SURFING_REWARD_LABELS[type]} +${amount}</span>`)
    .join("") || "<span>这次主要练习了平衡感</span>";
  surfGameEl.innerHTML = `
    <section class="surf-result">
      <img src="assets/surfing/char-peanut-cheer.png" alt="" />
      <h3>Great Surf!</h3>
      <div class="surf-rewards">${rewards}</div>
      <p>最大连击 ${surfState.maxCombo}，${surfState.message}</p>
      <div class="surf-result-actions">
        <button class="primary" type="button" data-surf-action="again">再来一次</button>
        <button type="button" data-surf-action="return">返回冰山</button>
      </div>
    </section>
  `;
}

function surfTargetText(target) {
  return Object.entries(target)
    .map(([type, amount]) => `${SURFING_REWARD_LABELS[type]} x${amount}`)
    .join("、");
}

function surfObjectAsset(object) {
  if (object.kind === "reward") return surfRewardAsset(object.type);
  if (object.type === "seal") return "assets/surfing/obstacle-seal.png";
  if (object.type === "wave") return "assets/surfing/obstacle-wave.png";
  if (object.type === "driftwood") return "assets/surfing/obstacle-driftwood.png";
  return "assets/fishing/tiles/tile-cracked.png";
}

function surfRewardAsset(type) {
  if (type === "fish") return "assets/fishing/rewards/reward-fish.png";
  if (type === "shrimp") return "assets/fishing/rewards/reward-shrimp.png";
  if (type === "shell") return "assets/fishing/rewards/reward-shell.png";
  if (type === "energy") return "assets/resource-energy.png";
  if (type === "plank") return "assets/resource-snow_planks.png";
  if (type === "star") return "assets/resource-stars.png";
  return "assets/resource-coins.png";
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
    setHeroMood(tile.type === "fish" || tile.type === "shell" ? "proud" : "love", line);
    addXp(10 + tile.level * 5);
    showToast(`发现新食材：${itemName(tile)}`);
    return true;
  }
  return false;
}

function addXp(amount) {
  state.xp += amount;
  const needed = xpNeeded();
  if (state.xp >= needed) {
    state.xp -= needed;
    state.level = Math.min(1000, state.level + 1);
    state.energy = Math.min(MAX_ENERGY, state.energy + 10);
    showToast(`Mountain 小宝升到 ${state.level} 级，能量补充了！`);
  }
}

function randomSpawnTile() {
  const available = unlockedTypes();
  const type = randomOf(available);
  const roll = Math.random();
  const typeMax = Math.min(3, maxLevelFor(type));
  const level = Math.min(typeMax, roll > 0.9 && state.level >= 3 ? 3 : roll > 0.5 ? 2 : 1);
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
    if (source.level >= maxLevelFor(source.type)) {
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
  const occupied = state.board
    .filter(Boolean)
    .sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type] || a.level - b.level);
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

function beginTilePointerDrag(event) {
  const tileEl = event.target.closest(".tile");
  if (!tileEl || (event.button !== undefined && event.button !== 0)) return;
  event.preventDefault();
  const from = Number(tileEl.dataset.index);
  if (!state.board[from]) return;
  pointerDrag = {
    pointerId: event.pointerId,
    from,
    startX: event.clientX,
    startY: event.clientY,
    x: event.clientX,
    y: event.clientY,
    dragging: false,
    ghost: null,
  };
  boardEl.setPointerCapture?.(event.pointerId);
}

function moveTilePointerDrag(event) {
  if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
  pointerDrag.x = event.clientX;
  pointerDrag.y = event.clientY;
  const distance = Math.hypot(event.clientX - pointerDrag.startX, event.clientY - pointerDrag.startY);
  if (!pointerDrag.dragging && distance > 8) {
    pointerDrag.dragging = true;
    suppressBoardClickUntil = Date.now() + 700;
    selectedIndex = null;
    const tile = state.board[pointerDrag.from];
    const sourceCell = boardEl.querySelector(`.cell[data-index="${pointerDrag.from}"]`);
    sourceCell?.classList.add("drag-source");
    pointerDrag.ghost = document.createElement("img");
    pointerDrag.ghost.className = "touch-drag-ghost";
    pointerDrag.ghost.src = assetFor(tile);
    pointerDrag.ghost.alt = "";
    document.body.appendChild(pointerDrag.ghost);
  }
  if (pointerDrag.dragging) {
    event.preventDefault();
    positionPointerGhost();
  }
}

function finishTilePointerDrag(event) {
  if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
  const drag = pointerDrag;
  const wasDragging = drag.dragging;
  if (wasDragging) {
    event.preventDefault();
    suppressBoardClickUntil = Date.now() + 700;
  }
  const targetCell = wasDragging
    ? document.elementFromPoint(event.clientX, event.clientY)?.closest(".cell")
    : null;
  cleanupPointerDrag(event.pointerId);
  if (!wasDragging || !targetCell) return;
  const to = Number(targetCell.dataset.index);
  if (Number.isInteger(to)) moveOrMerge(drag.from, to);
}

function cancelTilePointerDrag(event) {
  if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
  cleanupPointerDrag(event.pointerId);
}

function positionPointerGhost() {
  if (!pointerDrag?.ghost) return;
  pointerDrag.ghost.style.left = `${pointerDrag.x}px`;
  pointerDrag.ghost.style.top = `${pointerDrag.y}px`;
}

function cleanupPointerDrag(pointerId) {
  boardEl.releasePointerCapture?.(pointerId);
  document.querySelectorAll(".drag-source").forEach((node) => node.classList.remove("drag-source"));
  pointerDrag?.ghost?.remove();
  pointerDrag = null;
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

  const xpReward = orderXp(order);
  state.coins += order.reward;
  addXp(xpReward);
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

  showToast(`订单完成，获得 ${order.reward} 金币，经验 +${xpReward}。`);
  render();
  animateReward(ordersEl.getBoundingClientRect(), `+${order.reward} 金币 / +${xpReward} XP`);
}

function buildOrders(level, board) {
  return [buildOrder(level, board), buildOrder(level + 1, board), buildOrder(level + 2, board)];
}

function buildOrder(level, board, targetDifficulty = null) {
  const available = unlockedTypes(level);
  const needsCount = targetDifficulty
    ? Math.max(1, Math.min(3, Math.round(targetDifficulty / Math.max(2, level + 1))))
    : Math.random() > 0.68 ? 2 : 1;
  const existing = board.filter((tile) => tile && available.includes(tile.type));
  const needs = [];

  for (let i = 0; i < needsCount; i += 1) {
    const useExisting = existing.length && Math.random() > 0.55;
    const type = useExisting ? null : randomOf(available);
    const nearbyLevel = targetDifficulty
      ? Math.max(1, Math.round(targetDifficulty / needsCount) - Math.floor(level / 3))
      : null;
    const highest = type
      ? Math.min(maxLevelFor(type), Math.max(2, Math.ceil(level / 2) + 2, nearbyLevel || 1))
      : null;
    const need = useExisting
      ? { ...randomOf(existing) }
      : { type, level: 1 + Math.floor(Math.random() * highest) };
    const levelJitter = targetDifficulty && !useExisting ? Math.max(1, need.level + Math.floor(Math.random() * 3) - 1) : need.level;
    needs.push({ type: need.type, level: Math.min(maxLevelFor(need.type), levelJitter) });
  }

  const reward = needs.reduce((sum, need) => sum + rewardFor(need) * 7, 20 + level * 8);
  const member = randomOf(members);
  const xpReward = orderXpFromNeeds(needs);
  return {
    member: member.name,
    memberId: member.id,
    needs,
    reward,
    xpReward,
  };
}

function orderDifficulty(order) {
  return order.needs.reduce((sum, need) => sum + need.level * (TYPE_ORDER[need.type] + 1), 0);
}

function orderXpFromNeeds(needs) {
  return needs.reduce((sum, need) => sum + 8 + need.level * 5 + TYPE_ORDER[need.type] * 4, 0);
}

function orderXp(order) {
  return order.xpReward || orderXpFromNeeds(order.needs);
}

function refreshOrders() {
  markAction();
  if (state.coins < REFRESH_ORDER_COST) {
    setHeroMood("cry", randomOf(dialogueBank.notEnoughCoins));
    return showToast(`换单需要 ${REFRESH_ORDER_COST} 金币。`);
  }
  state.coins -= REFRESH_ORDER_COST;
  state.orders = state.orders.map((order, index) => {
    const target = Math.max(2, orderDifficulty(order) + Math.floor(Math.random() * 3) - 1);
    return buildOrder(state.level + index, state.board, target);
  });
  setHeroMood("wink", `${randomOf(dialogueBank.refreshOrders)} 换单消耗 ${REFRESH_ORDER_COST} 金币。`);
  render();
}

function openEnergyMenu() {
  markAction();
  energyLayerEl.classList.add("open");
  energyLayerEl.setAttribute("aria-hidden", "false");
  renderEnergyPacks();
  setHeroMood("confused", "小黑豆来了！它说金币可以换成一点点继续努力的能量。");
}

function closeEnergyMenu() {
  energyLayerEl.classList.remove("open");
  energyLayerEl.setAttribute("aria-hidden", "true");
}

function renderEnergyPacks() {
  const remaining = Math.max(0, MAX_ENERGY - state.energy);
  energyPacksEl.innerHTML = energyPacks.map((pack) => {
    const amount = pack.full ? remaining : Math.min(pack.amount, remaining);
    const cost = energyPackCost(pack);
    const disabled = amount <= 0 || state.coins < cost;
    const status = amount <= 0 ? "能量已满" : state.coins < cost ? "金币不足" : `+${amount} 能量`;
    return `
      <button class="energy-pack" type="button" data-energy-pack="${pack.id}" ${disabled ? "disabled" : ""}>
        <img src="assets/resource-energy.png" alt="" />
        <span>${pack.label}</span>
        <strong>${status}</strong>
        <em>${cost} 金币</em>
      </button>
    `;
  }).join("");
}

function energyPackCost(pack) {
  const multiplier = 1 + Math.max(0, state.shop.energyPurchases || 0) * 0.35;
  return Math.ceil((pack.cost * multiplier) / 10) * 10;
}

function buyEnergyPack(id) {
  const pack = energyPacks.find((entry) => entry.id === id);
  if (!pack) return;
  const remaining = Math.max(0, MAX_ENERGY - state.energy);
  const amount = pack.full ? remaining : Math.min(pack.amount, remaining);
  const cost = energyPackCost(pack);
  if (amount <= 0) {
    setHeroMood("proud", "能量已经满啦，小黑豆把罐子先收起来。");
    return showToast("能量已经满了。");
  }
  if (state.coins < cost) {
    setHeroMood("cry", "金币不够，小黑豆的小罐子暂时打不开。");
    return showToast("金币不足。");
  }
  state.coins -= cost;
  state.shop.energyPurchases += 1;
  state.energy = Math.min(MAX_ENERGY, state.energy + amount);
  state.lastEnergyAt = Date.now();
  setHeroMood("cheer", `小黑豆帮忙补充了 ${amount} 点能量！`);
  showToast(`能量 +${amount}`);
  render();
  animateReward(energyLayerEl.getBoundingClientRect(), `+${amount} 能量 / -${cost} 金币`);
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
  if (Date.now() < suppressBoardClickUntil) return;
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

boardEl.addEventListener("pointerdown", beginTilePointerDrag);
boardEl.addEventListener("pointermove", moveTilePointerDrag);
boardEl.addEventListener("pointerup", finishTilePointerDrag);
boardEl.addEventListener("pointercancel", cancelTilePointerDrag);

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
fishingBtn.addEventListener("click", openFishingGame);
surfBtn.addEventListener("click", openSurfGame);
buildBtn.addEventListener("click", openBuildMap);
energyStatBtn.addEventListener("click", openEnergyMenu);
shopCloseBtn.addEventListener("click", closeShop);
fishingCloseBtn.addEventListener("click", closeFishingGame);
surfCloseBtn.addEventListener("click", closeSurfGame);
buildCloseBtn.addEventListener("click", closeBuildMap);
energyCloseBtn.addEventListener("click", closeEnergyMenu);
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
fishingGameEl.addEventListener("click", (event) => {
  const modeButton = event.target.closest("[data-fishing-mode]");
  if (modeButton) {
    fishingState.mode = modeButton.dataset.fishingMode;
    fishingState.message = fishingState.mode === "scan"
      ? "选择一个中心冰洞，扫描周围 3×3 区域。"
      : `已切换到${modeButton.textContent.trim()}模式。`;
    renderFishingGame();
    return;
  }
  const actionButton = event.target.closest("[data-fishing-action]");
  if (actionButton) {
    const action = actionButton.dataset.fishingAction;
    if (action === "hint") useFishingHint();
    if (action === "restart") {
      fishingState = createFishingState();
      renderFishingGame();
    }
    if (action === "return") closeFishingGame();
    return;
  }
  const cell = event.target.closest("[data-fishing-cell]");
  if (!cell) return;
  handleFishingCell(Number(cell.dataset.fishingCell));
});
surfGameEl.addEventListener("click", (event) => {
  const stageButton = event.target.closest("[data-surf-stage]");
  if (stageButton) {
    surfState.stageId = stageButton.dataset.surfStage;
    state.shop.activeSurfStage = surfState.stageId;
    renderSurfGame();
    saveState();
    return;
  }
  const boardButton = event.target.closest("[data-surf-board]");
  if (boardButton) {
    surfState.boardId = boardButton.dataset.surfBoard;
    renderSurfGame();
    return;
  }
  const actionButton = event.target.closest("[data-surf-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.surfAction;
  if (action === "start" || action === "again") {
    if (action === "again") surfState = createSurfSelectState();
    startSurfRun();
  }
  if (action === "left") moveSurfLane(-1);
  if (action === "right") moveSurfLane(1);
  if (action === "pause") {
    if (surfTimer) {
      stopSurfTimer();
      surfState.message = "冲浪暂停中。";
    } else {
      startSurfTimer();
      surfState.message = "继续冲浪！";
    }
    renderSurfGame();
  }
  if (action === "return") closeSurfGame();
});
let surfTouchStartX = null;
surfGameEl.addEventListener("pointerdown", (event) => {
  surfTouchStartX = event.clientX;
});
surfGameEl.addEventListener("pointerup", (event) => {
  if (surfTouchStartX === null) return;
  const dx = event.clientX - surfTouchStartX;
  surfTouchStartX = null;
  if (Math.abs(dx) < 24) return;
  moveSurfLane(dx > 0 ? 1 : -1);
});
energyPacksEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-energy-pack]");
  if (!button) return;
  buyEnergyPack(button.dataset.energyPack);
});
newOrdersBtn.addEventListener("click", refreshOrders);
dialogueNextBtn.addEventListener("click", nextDialogue);
dialogueSkipBtn.addEventListener("click", closeDialogue);

setInterval(regenerateEnergy, 10000);
regenerateEnergy();
setHeroMood("idle", "欢迎来到 Mountain 小宝！收集小鱼小虾，建设我们的冰山吧。", true);
render();
markAction();
if (!state.story.introSeen) {
  setTimeout(() => startDialogue(storyScripts.intro), 420);
}
