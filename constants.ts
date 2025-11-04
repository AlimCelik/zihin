  import { AdminSettings } from './types';

  export const SCREEN_WIDTH = 400;
  export const SCREEN_HEIGHT = 700;

  // Player Pot
  export const POT_WIDTH = 100;
  export const POT_HEIGHT = 100;
  export const POT_Y_OFFSET = 30;
  export const INITIAL_LIVES = 3;
  export const PLAYER_HIT_DURATION = 500; // ms for flash effect

  // Projectiles
  export const PROJECTILE_SIZE = 20;
  export const PROJECTILE_SPEED = 8;
  export const BASE_FIRE_RATE = 500; // ms between shots
  export const FIRE_RATE_REDUCTION_PER_LEVEL = 35; // ms reduction per level

  // Enemy Projectiles (Darts)
  export const DART_SIZE = 27;
  export const DART_SPEED = 4;

  // Flowers
  export const FLOWER_SIZE = 50;
  export const FLOWER_MIN_SPEED = 1;
  export const FLOWER_MAX_SPEED = 3;
  export const FLOWER_SPAWN_INTERVAL = 2000; // ms
  export const BASE_SCORE_PER_FLOWER = 1;
  export const BASE_FLOWER_HEALTH = 1;
  export const MAX_FLOWERS_ON_SCREEN = 12;
  export const FLOWER_MAX_STOP_Y = SCREEN_HEIGHT / 2;
  export const GENERAL_FLOWER_FIRE_RATE = 5000; // ms for non-sniper enemies

  // Sniper Cactus
  export const CACTUS_FIRE_RATE = 4000; // ms

  // Dasher Rose
  export const DASHER_SPEED_MULTIPLIER = 1.8;
  export const DASHER_HEALTH_MULTIPLIER = 0.7;

  // Tank Tree
  export const TANK_SPEED_MULTIPLIER = 0.6;
  export const TANK_HEALTH_MULTIPLIER = 3;

  // Game
  export const GAME_DURATION = 60; // seconds
  export const COMBO_TIMEOUT = 2000; // ms to reset combo

  // Power-ups
  export const POWERUP_SIZE = 40;
  export const POWERUP_SPAWN_INTERVAL = 20000; // ms, every 20 seconds
  export const POWERUP_SPEED = 2;
  export const POWERUP_DURATION = 5000; // 5 seconds
  export const SLOW_MOTION_FACTOR = 0.5; // Flowers move at half speed
  export const RAPID_FIRE_RATE = 100; // ms between shots

  // Rewards
  export const GOLD_PER_POINT = 2;
  export const DP_PER_POINT = 1;
  export const PLAYER_STATS_KEY = 'mindGardenPlayerStats';
  export const GARDEN_STATE_KEY = 'mindGardenGardenState';

  // Garden & Shop
  export const GARDEN_ROWS = 5;
  export const GARDEN_COLS = 4;
  export const INVENTORY_SLOTS = 4;
  export const PLANT_COST = 50;
  export const FIRE_RATE_UPGRADE_BASE_COST = 150;
  export const FIRE_RATE_UPGRADE_LEVEL_MULTIPLIER = 200;
  export const GOLD_PER_LEVEL_PER_SECOND = 0.05;

// food2 (Level 21-30)
export const sniperTypes = [19, 20, 21, 22, 23, 24, 25, 26, 27];
// food3 (Level 31-40)
export const tankTypes = [28, 29, 30, 31, 32, 33, 34, 35, 36];
// food4 (Level 41-50)
export const dasherTypes = [37, 38, 39, 40, 41, 42, 43, 44, 45];

// Bu dizi 'else' bloğunda kullanılıyor (Level 1-20 ve 51+)
export const standardEnemyGroups: number[][] = [
  // 0: Level 1-10 (food0)
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  // 1: Level 11-20 (food1)
  [10, 11, 12, 13, 14, 15, 16, 17, 18],
  
  // Bu gruplar GameScreen'deki if'ler tarafından (şimdilik) es geçiliyor,
  // ama yine de doğru veriyi tutmalarında fayda var.
  // 2: Level 21-30 (food2)
  [19, 20, 21, 22, 23, 24, 25, 26, 27],
  // 3: Level 31-40 (food3)
  [28, 29, 30, 31, 32, 33, 34, 35, 36],
  // 4: Level 41-50 (food4)
  [37, 38, 39, 40, 41, 42, 43, 44, 45],

  // 5: Level 51-60 (food5)
  [46, 47, 48, 49, 50, 51, 52, 53, 54],
  
  // DİKKAT: 60'tan sonrası için (food6, food7) ikon importunuz yok.
  // Şimdilik 51-60 ikonlarını (food5) tekrar kullanalım:
  // 6: Level 61-70
  [46, 47, 48, 49, 50, 51, 52, 53, 54],
  // 7: Level 71-80
  [46, 47, 48, 49, 50, 51, 52, 53, 54],
];


  export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
    gameDuration: GAME_DURATION,
    fireRate: BASE_FIRE_RATE,
    flowerSpeedMultiplier: 1,
    flowerSpawnInterval: FLOWER_SPAWN_INTERVAL,
    powerUpSpawnInterval: POWERUP_SPAWN_INTERVAL,
    baseScorePerFlower: BASE_SCORE_PER_FLOWER,
    baseFlowerHealth: BASE_FLOWER_HEALTH,
    projectileDamage: 1, 
  };
