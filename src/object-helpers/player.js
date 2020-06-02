import { Sprite, Container } from 'pixi.js';

import { PLAYER_SPEED, MOVEMENT_DIRECTION_ANGLES } from '../constants';

export function spawnPlayer(box, { x, y }) {
  const myPlayer = new Sprite(box.texture);
  myPlayer.anchor.set(0.5);
  myPlayer.position.x = x;
  myPlayer.position.y = y;
  return myPlayer;
}

export function getPlayerPosition(oldPosition, velocity, offsetX, offsetY) {
  const newPosition = { ...oldPosition };

  if (
    (velocity.vx > 0 && oldPosition.x < window.innerWidth - offsetX) ||
    (velocity.vx < 0 && oldPosition.x > offsetX)
  ) {
    newPosition.x += velocity.vx * PLAYER_SPEED;
  }

  if (
    (velocity.vy > 0 && oldPosition.y < window.innerHeight - offsetY) ||
    (velocity.vy < 0 && oldPosition.y > offsetY)
  ) {
    newPosition.y += velocity.vy * PLAYER_SPEED;
  }
  return newPosition;
}

export function getPlayerRotation({ mx, my, px, py }) {
  return Math.atan2(my - py, mx - px);
}

export function spawnTank(bodySpr, turretSpr, { x, y }) {
  const tank = new Container();
  tank.x = x;
  tank.y = y;
  const body = new Sprite(bodySpr.texture);
  body.anchor.set(0.5);
  const turret = new Sprite(turretSpr.texture);
  turret.anchor.set(0.28, 0.5);
  tank.addChildAt(body, 0);
  tank.addChildAt(turret, 1);
  return tank;
}

export function getTankDirection(velocity) {
  const velocityStr = `${velocity.vx},${velocity.vy}`;
  return MOVEMENT_DIRECTION_ANGLES[velocityStr] || 0;
}
