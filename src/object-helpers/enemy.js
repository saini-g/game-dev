import { ENEMY_SPEED, PATROL_SPEED } from '../constants';

export function startPatrol(character) {
  character.speed = PATROL_SPEED;
  character.velocity = { vx: 0, vy: 1 };
}

export function chasePlayer(enemy, tank) {
  enemy.speed = ENEMY_SPEED;
  const enemyVelocity = {};
  const tempThreshold = 0;

  if (enemy.x > tank.x) {
    enemyVelocity.vx = -1;
  } else if (enemy.x < tank.x) {
    enemyVelocity.vx = 1;
  } else if (enemy.x === tank.x) {
    enemyVelocity.vx = 0;
  }

  if (enemy.y > tank.y) {
    enemyVelocity.vy = -1;
  } else if (enemy.y < tank.y) {
    enemyVelocity.vy = 1;
  } else if (enemy.y === tank.y) {
    enemyVelocity.vy = 0;
  }
  return enemyVelocity;
}

export function getDistance(char1, char2) {
  return Math.hypot(char1.x - char2.x, char1.y - char2.y);
}
