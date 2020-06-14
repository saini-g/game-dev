import { Application, Loader } from 'pixi.js';

import { velocityObs, shootingObs, mouseMoveObs, enemyShootingObs } from './game-observables';
import {
  getPlayerPosition,
  getPlayerRotation,
  spawnTank,
  getTankDirection,
  spawnCrosshair
} from './object-helpers/player';
import { spawnBullet, getBulletPosition } from './object-helpers/bullet';
import { startPatrol, chasePlayer } from './object-helpers/enemy';
import { getDistance } from './object-helpers/general-game';
import { PATROL_UPPER_LIMIT, PATROL_LOWER_LIMIT, BULLET_RANGE, ENEMY_MIN_DISTANCE } from './constants';

const bulletImg = require('../images/bullet.png');
const tankBodyImg = require('../images/tank-body.png');
const turretImg = require('../images/turret.png');
const crosshairImg = require('../images/crosshair.png');

let app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x123456,
  antialias: true,
  autoDensity: true,
  resolution: window.devicePixelRatio || 1
});
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
document.body.appendChild(app.view);

let tank;
let enemy;
let crosshair;
const interactionPlugin = app.renderer.plugins.interaction;

const GAME_STATE = {
  bullets: []
};

const resourceTextures = {};

const loader = new Loader();
loader
  .add('bullet', bulletImg)
  .add('tank', tankBodyImg)
  .add('turret', turretImg)
  .add('crosshair', crosshairImg)
  .load(function(_loader, resources) {

    resourceTextures.bullet = resources.bullet.texture;
    resourceTextures.tankBody = resources.tank.texture;
    resourceTextures.turret = resources.turret.texture;
    resourceTextures.crosshair = resources.crosshair.texture;

    tank = spawnTank(
      resourceTextures.tankBody,
      resourceTextures.turret,
      { x: app.view.width / 4, y: app.view.height / 2 }
    );
    app.stage.addChild(tank);

    enemy = spawnTank(
      resourceTextures.tankBody,
      resourceTextures.turret,
      { x: (3 * app.view.width) / 4, y: app.view.height / 2 }
    );
    startPatrol(enemy);
    app.stage.addChild(enemy);

    velocityObs.subscribe({ next: updatePlayerVelocity });

    shootingObs.subscribe({
      next: function(val) {
        const newBullet = spawnBullet(resourceTextures.bullet, {
          x: tank.position.x,
          y: tank.position.y,
          rotation: tank.getChildAt(1).rotation
        });
        newBullet.firedBy = 'player';
        app.stage.addChild(newBullet);
        GAME_STATE.bullets.push(newBullet);
      }
    });

    crosshair = spawnCrosshair(resourceTextures.crosshair);
    app.stage.addChild(crosshair);

    mouseMoveObs.subscribe({
      next: function(coords) {
        crosshair.x = coords.x;
        crosshair.y = coords.y;
      }
    });

    enemyShootingObs.subscribe({ next: fireEnemyBullet });

    app.ticker.add(gameLoop);
  });

function updatePlayerVelocity(velocity) {
  tank.velocity.vx = velocity.vx;
  tank.velocity.vy = velocity.vy;
}

function fireEnemyBullet(val) {
  console.log(val);

  if (enemy.isChasing) {
    const newBullet = spawnBullet(resourceTextures.bullet, {
      x: enemy.position.x,
      y: enemy.position.y,
      rotation: enemy.getChildAt(1).rotation
    });
    newBullet.firedBy = 'enemy';
    app.stage.addChild(newBullet);
    GAME_STATE.bullets.push(newBullet);
  }
}

// all changes on game screen should be done here
function gameLoop(delta) {

  if (GAME_STATE.bullets.length > 0) {

    for (const bullet of GAME_STATE.bullets) {
      const travelledDistance = getDistance(
        { x1: bullet.origin.x, y1: bullet.origin.y },
        { x2: bullet.x, y2: bullet.y }
      );

      if (travelledDistance < BULLET_RANGE) {
        const newPosition = getBulletPosition(
          { x: bullet.x, y: bullet.y },
          bullet.speed,
          bullet.rotation
        );
        bullet.x = newPosition.x;
        bullet.y = newPosition.y;
      } else {
        app.stage.removeChild(bullet);
      }
    }
  }

  const turret = tank.getChildAt(1);
  turret.rotation = getPlayerRotation({
    destX: interactionPlugin.mouse.global.x,
    destY: interactionPlugin.mouse.global.y,
    srcX: tank.x,
    srcY: tank.y
  });

  if (
    tank.velocity.vx !== 0
    || tank.velocity.vy !== 0
  ) {
    const newPosition = getPlayerPosition(tank);
    tank.x += newPosition.x;
    tank.y += newPosition.y;

    const tankRotation = getTankDirection(tank.velocity);
    tank.getChildAt(0).rotation = tankRotation;
  }

  const distanceFromPlayer = getDistance(
    { x1: tank.x, y1: tank.y },
    { x2: enemy.x, y2: enemy.y }
  );

  if (distanceFromPlayer <= window.innerWidth / 4) {
    const newVelocity = chasePlayer(enemy, tank);
    enemy.velocity = newVelocity;
    enemy.isChasing = true;

    if (distanceFromPlayer <= ENEMY_MIN_DISTANCE) {
      enemy.velocity = { vx: 0, vy: 0 };
    }
  } else {
    enemy.isChasing = false;

    if (enemy.y <= PATROL_UPPER_LIMIT) {
      enemy.velocity = { vx: 0, vy: 1 };
    }

    if (enemy.y >= PATROL_LOWER_LIMIT) {
      enemy.velocity = { vx: 0, vy: -1 };
    }
  }

  const enemyPos = getPlayerPosition(enemy);
  enemy.x += enemyPos.x;
  enemy.y += enemyPos.y;

  const enemyRotation = getTankDirection(enemy.velocity);
  enemy.getChildAt(0).rotation = enemyRotation;

  if (enemy.isChasing) {
    enemy.getChildAt(1).rotation = getPlayerRotation({
      destX: tank.x,
      destY: tank.y,
      srcX: enemy.x,
      srcY: enemy.y
    });
  } else {
    enemy.getChildAt(1).rotation = enemyRotation;
  }
}
