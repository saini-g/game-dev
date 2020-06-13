import { Sprite, Container } from 'pixi.js';

import { PLAYER_SPEED, MOVEMENT_DIRECTION_ANGLES } from '../constants';

export function getPlayerPosition(character) {
  const position = { x: character.x, y: character.y };
  const delPosition = { x: 0, y: 0 };

  if (
    (character.velocity.vx > 0 && position.x < window.innerWidth - character.width / 2)
    || (character.velocity.vx < 0 && position.x > character.width / 2)
  ) {
    position.x += character.velocity.vx * character.speed;
    delPosition.x = character.velocity.vx * character.speed;
  }

  if (
    (character.velocity.vy > 0 && position.y < window.innerHeight - character.height / 2)
    || (character.velocity.vy < 0 && position.y > character.height / 2)
  ) {
    position.y += character.velocity.vy * character.speed;
    delPosition.y = character.velocity.vy * character.speed;
  }
  return delPosition;
}

export function getPlayerRotation({ destX, destY, srcX, srcY }) {
  return Math.atan2(destY - srcY, destX - srcX);
}

export function spawnTank(bodyTex, turretTex, { x, y }) {
  const tank = new Container();
  tank.x = x;
  tank.y = y;
  tank.velocity = { vx: 0, vy: 0 };
  tank.speed = PLAYER_SPEED;
  const body = new Sprite(bodyTex);
  body.anchor.set(0.5);
  const turret = new Sprite(turretTex);
  turret.anchor.set(0.28, 0.5);
  tank.addChildAt(body, 0);
  tank.addChildAt(turret, 1);
  return tank;
}

export function getTankDirection(velocity) {
  const velocityStr = `${velocity.vx},${velocity.vy}`;
  return MOVEMENT_DIRECTION_ANGLES[velocityStr] || 0;
}

export function spawnCrosshair(crosshairTex) {
  const crosshair = new Sprite(crosshairTex);
  crosshair.anchor.set(0.5);
  return crosshair;
}
