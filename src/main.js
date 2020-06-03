import { Application, Loader } from 'pixi.js';

import { velocityObs, shootingObs } from './game-observables';
import { getPlayerPosition, getPlayerRotation, spawnTank, getTankDirection } from './object-helpers/player';
import { spawnBullet, getBulletPosition } from './object-helpers/bullet';

const boxImg = require('../images/box.png');
const bulletImg = require('../images/bullet.png');
const tankBodyImg = require('../images/tank-body.png');
const turretImg = require('../images/turret.png');

let app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x123456,
  antialias: true,
  resolution: window.devicePixelRatio || 1
});
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
document.body.appendChild(app.view);

//
// game vars
//
let tank;
// TODO: change game state to behaviour subject
const GAME_STATE = {
  playerBullets: []
};
//

const loader = new Loader();
loader
  .add('box', boxImg)
  .add('bullet', bulletImg)
  .add('tank', tankBodyImg)
  .add('turret', turretImg)
  .load(function(_loader, resources) {

    tank = spawnTank(
      resources.tank,
      resources.turret,
      { x: app.view.width / 2, y: app.view.height / 2 }
    );
    app.stage.addChild(tank);

    velocityObs.subscribe({ next: updatePlayerVelocity });

    shootingObs.subscribe({
      next: function(val) {
        const newBullet = spawnBullet(resources.bullet, {
          x: tank.position.x,
          y: tank.position.y,
          rotation: tank.getChildAt(1).rotation
        });
        app.stage.addChild(newBullet);
        GAME_STATE.playerBullets.push(newBullet);
      }
    });

    app.ticker.add(gameLoop);
  });

function updatePlayerVelocity(velocity) {
  tank.velocity.vx = velocity.vx;
  tank.velocity.vy = velocity.vy;
}

// all changes on game screen should be done here
function gameLoop(delta) {

  if (GAME_STATE.playerBullets.length > 0) {

    for (const bullet of GAME_STATE.playerBullets) {
      const newPosition = getBulletPosition(
        { x: bullet.x, y: bullet.y },
        bullet.speed,
        bullet.rotation
      );
      bullet.x = newPosition.x;
      bullet.y = newPosition.y;
    }
  }

  const turret = tank.getChildAt(1);
  turret.rotation = getPlayerRotation({
    destX: app.renderer.plugins.interaction.mouse.global.x,
    destY: app.renderer.plugins.interaction.mouse.global.y,
    srcX: tank.x,
    srcY: tank.y
  });

  if (
    tank.velocity.vx !== 0
    || tank.velocity.vy !== 0
  ) {
    const newPosition = getPlayerPosition(tank);
    tank.x = newPosition.x;
    tank.y = newPosition.y;

    const tankRotation = getTankDirection(tank.velocity);
    tank.getChildAt(0).rotation = tankRotation;
  }
}
