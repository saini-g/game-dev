import { Sprite } from 'pixi.js';

import { BULLET_SPEED } from '../constants';

export function spawnBullet(bullet, { x, y, rotation }) {
  const newBullet = new Sprite(bullet.texture);
  newBullet.anchor.set(0.5);
  newBullet.x = x + Math.cos(rotation) * 20;
  newBullet.y = y + Math.sin(rotation) * 20;
  newBullet.speed = BULLET_SPEED;
  newBullet.rotation = rotation;
  return newBullet;
}

export function getBulletPosition(oldPosition, speed, rotation) {
  const newPosition = {};
  newPosition.x = oldPosition.x + Math.cos(rotation) * speed;
  newPosition.y = oldPosition.y + Math.sin(rotation) * speed;
  return newPosition;
}
