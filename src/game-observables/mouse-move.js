import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

const mouseMoveObs = fromEvent(document, 'mousemove').pipe(
  map((ev) => {
    return { x: ev.clientX, y: ev.clientY };
  })
);
export default mouseMoveObs;
