const CONFIG = {
    // 物理参数
    GRAVITY: 0.0005, // 月球重力，像素/帧^2
    THRUST_POWER: 0.001, // 推进器推力，像素/帧^2
    ROTATION_SPEED: 0.05, // 旋转速度，弧度/帧
    MAX_FUEL: 1500, // 最大燃料量
    FUEL_CONSUMPTION_THRUST: 1, // 每次推力消耗的燃料
    FUEL_CONSUMPTION_ROTATION: 0.1, // 每次旋转消耗的燃料

    // 登月舱参数
    LANDER_WIDTH: 20,
    LANDER_HEIGHT: 30,

    // 安全着陆参数
    MAX_SAFE_VERTICAL_VELOCITY: 0.1, // 最大安全垂直速度
    MAX_SAFE_HORIZONTAL_VELOCITY: 0.1, // 最大安全水平速度
    MAX_SAFE_ANGLE: 0.1, // 最大安全着陆角度 (弧度)

    // 月球地形参数
    TERRAIN_SEGMENTS: 20, // 地形分段数量
    TERRAIN_MIN_HEIGHT: 50, // 地形最小高度
    TERRAIN_MAX_HEIGHT: 150, // 地形最大高度
    FLAT_LANDING_ZONE_WIDTH: 80, // 平坦着陆区域宽度

    // UI参数
    FONT_SIZE: 10,
    TEXT_COLOR: '#0F0', // Green color for CRT effect
    UI_COLOR: '#0F0',

    // 游戏状态
    GAME_STATE_PLAYING: 'playing',
    GAME_STATE_LANDED: 'landed',
    GAME_STATE_CRASHED: 'crashed',
    GAME_STATE_OUT_OF_FUEL: 'out_of_fuel',
    GAME_STATE_START: 'start',
    GAME_STATE_ZOOMING: 'zooming',
    GAME_STATE_LANDED_SEQUENCE: 'landed_sequence',
    GAME_STATE_CRASHED_MCDONALDS: 'crashed_mcdonalds',
    GAME_STATE_LANDED_MCDONALDS: 'landed_mcdonalds',

    // Easter Egg
    MCDONALDS_SPAWN_CHANCE: 0.5, // 50% chance for testing, will be lower

    // 版本信息
    VERSION: "0.0.3",
};