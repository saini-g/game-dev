import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { BULLET_TIME_DIFF } from '../constants';

const shootingObs = fromEvent(document, 'mousedown').pipe(throttleTime(BULLET_TIME_DIFF));
export default shootingObs;
