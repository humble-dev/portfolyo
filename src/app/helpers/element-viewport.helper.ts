import { Observable, Subject } from 'rxjs';
import {
  auditTime, distinctUntilChanged, map, takeWhile, finalize, tap, switchMap, startWith, takeUntil,
} from 'rxjs/operators';

import { ElementState } from '../providers/element-state.provider';
import { ViewportProvider } from '../providers/viewport.provider';
import { ScrollerService, ScrollState } from '../services/scroller.service';

let scroller: ScrollerService;
let viewport: ViewportProvider;
let scrollEmitter$: Observable<ScrollState>;

export function elementInViewport(
  elementState: ElementState,
  offset: number = 0,
  debounce: number = 0,
): Observable<boolean> {
  if ( ! scroller) {
    scroller = ScrollerService.getInstance();
    scrollEmitter$ = scroller.scrollAnimation$;
  }

  if ( ! viewport) {
    viewport = ViewportProvider.getInstance();
  }

  return scrollEmitter$.pipe(
    auditTime(debounce),
    map((scrollState) => {
      return elementState.inViewport(
        scrollState.position,
        viewport.size,
        offset,
      );
    }),
    distinctUntilChanged(),
  );
}

export function elementInViewportOnce(
  elementState: ElementState,
  offset: number = 0,
  debounce: number = 0,
): Observable<boolean> {
  const subject = new Subject<boolean>();
  const visible$ = subject.asObservable();

  return elementInViewport(elementState, offset, debounce).pipe(
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
