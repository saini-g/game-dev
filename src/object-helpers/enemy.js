import { PATROL_SPEED } from '../constants';

export function startPatrol(character) {
  character.speed = PATROL_SPEED;
  character.velocity = { vx: 0, vy: 1 };
}
