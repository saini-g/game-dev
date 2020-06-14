import { interval } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { RELOAD_TIME } from '../constants';

const enemyShootingObs = interval(RELOAD_TIME).pipe(mapTo(1));
export default enemyShootingObs;
