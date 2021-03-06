export const KEY_CODES = {
  UP: 87,     // w
  LEFT: 65,   // a
  RIGHT: 68,  // d
  DOWN: 83,   // s
  ACTION: 108  // l
};

export const ALL_GAME_KEYS = [
  87, 119,
  65, 97,
  68, 100,
  83, 115,
  76, 108
];

export const EVENT_TYPES = {
  KEYUP: 'keyup',
  KEYDOWN: 'keydown'
};

// player movement speed
export const PLAYER_SPEED = 5;
// enemy speed when chasing player - increase to make chases more exciting
export const ENEMY_SPEED = 3;
// enemy speed when patrolling
export const PATROL_SPEED = 3;

// orientation based on movement directions (in radians)
export const MOVEMENT_DIRECTION_ANGLES = {
  '1,0': 0,
  '1,1': Math.PI * 0.25,
  '0,1': Math.PI * 0.5,
  '-1,1': Math.PI * 0.75,
  '-1,0': Math.PI,
  '-1,-1': Math.PI * 1.25,
  '0,-1': Math.PI * 1.5,
  '1,-1': Math.PI * 1.75,
};

// time between 2 bullets (ms)
export const RELOAD_TIME = 400;

export const BULLET_SPEED = 25;

export const BULLET_RANGE = 500;

export const PATROL_UPPER_LIMIT = window.innerHeight * 0.2;
export const PATROL_LOWER_LIMIT = window.innerHeight * 0.8;

export const ENEMY_MIN_DISTANCE = 200;
