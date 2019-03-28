import { Observable, Subject } from 'rxjs';
import {
  auditTime, distinctUntilChanged, map, takeUntil, tap,
} from 'rxjs/operators';

import { ElementState } from '../providers/element-state.provider';
import { ViewportProvider } from '../providers/viewport.provider';
import { ScrollerService } from '~~/services/scroller.service';

const scroller = ScrollerService.getInstance();
const viewport = ViewportProvider.getInstance();

export function elementInViewport(
  element: ElementState | HTMLElement,
  offsetX: number = 0,
  offsetY: number = 0,
  debounce: number = 0,
): Observable<boolean> {
  if ( ! (element instanceof ElementState)) {
    element = ElementState.create(element);
  }

  return scroller.scrollAnimation$.pipe(
    auditTime(debounce),
    map((state) => state.position),
    map((position) => {
      return (element as ElementState).inViewport(
        position,
        viewport.size,
        {
          x: offsetX * viewport.size.width,
          y: offsetY * viewport.size.height,
        },
      );
    }),
    distinctUntilChanged(),
  );
}

export function elementInViewportOnce(
  element: ElementState | HTMLElement,
  offsetX: number = 0,
  offsetY: number = 0,
  debounce: number = 0,
): Observable<boolean> {
  const subject = new Subject<boolean>();
  const visible$ = subject.asObservable();

  return elementInViewport(element, offsetX, offsetY, debounce).pipe(
    takeUntil(visible$),
    tap((visible) => {
      if (true === visible) {
        setTimeout(() => {
          subject.next(visible);
        });
      }
    }),
  );
}
