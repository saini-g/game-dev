import { Sprite } from 'pixi.js';

import { BULLET_SPEED } from '../constants';

export function spawnBullet(bulletSpr, { x, y, rotation }) {
  const newBullet = new Sprite(bulletSpr.texture);
  newBullet.anchor.set(0.5);
  newBullet.x = x + Math.cos(rotation) * 40;
  newBullet.y = y + Math.sin(rotation) * 40;
  newBullet.speed = BULLET_SPEED;
  newBullet.rotation = rotation;
  newBullet.origin = {
    x: x + Math.cos(rotation) * 40,
    y: y + Math.sin(rotation) * 40
  };
  return newBullet;
}

export function getBulletPosition(oldPosition, speed, rotation) {
  const newPosition = {};
  newPosition.x = oldPosition.x + Math.cos(rotation) * speed;
  newPosition.y = oldPosition.y + Math.sin(rotation) * speed;
  return newPosition;
}
