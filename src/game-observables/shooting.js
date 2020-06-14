import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { RELOAD_TIME } from '../constants';

const shootingObs = fromEvent(document, 'mousedown').pipe(throttleTime(RELOAD_TIME));
export default shootingObs;
