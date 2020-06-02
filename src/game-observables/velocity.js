import { fromEvent, merge } from 'rxjs';
import { filter, pluck, scan, map } from 'rxjs/operators';

import { KEY_CODES, ALL_GAME_KEYS, EVENT_TYPES } from '../constants';

const velocityObs = merge(
  fromEvent(document, 'keydown')
    .pipe(
      pluck('keyCode'),
      filter((code) => ALL_GAME_KEYS.includes(code)),
      map((code) => {
        return { code, type: EVENT_TYPES.KEYDOWN };
      })
    ),
  fromEvent(document, 'keyup')
    .pipe(
      pluck('keyCode'),
      filter((code) => ALL_GAME_KEYS.includes(code)),
      map((code) => {
        return { code, type: EVENT_TYPES.KEYUP };
      })
    )
).pipe(
  scan((velocity, { code, type }) => {

    if (code === KEY_CODES.UP && type === EVENT_TYPES.KEYDOWN) {
      velocity.vy = -1;
    } else if (code === KEY_CODES.UP && type === EVENT_TYPES.KEYUP) {
      velocity.vy = 0;
    }

    if (code === KEY_CODES.DOWN && type === EVENT_TYPES.KEYDOWN) {
      velocity.vy = 1;
    } else if (code === KEY_CODES.DOWN && type === EVENT_TYPES.KEYUP) {
      velocity.vy = 0;
    }

    if (code === KEY_CODES.LEFT && type === EVENT_TYPES.KEYDOWN) {
      velocity.vx = -1;
    } else if (code === KEY_CODES.LEFT && type === EVENT_TYPES.KEYUP) {
      velocity.vx = 0;
    }

    if (code === KEY_CODES.RIGHT && type === EVENT_TYPES.KEYDOWN) {
      velocity.vx = 1;
    } else if (code === KEY_CODES.RIGHT && type === EVENT_TYPES.KEYUP) {
      velocity.vx = 0;
    }
    return velocity;
  }, { vx: 0, vy: 0 })
);

export default velocityObs;
