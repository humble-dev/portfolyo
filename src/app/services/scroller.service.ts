import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Scroller, smoothScroll } from '@smoovy/scroller';
import { Coordinate, Browser } from '@smoovy/utils';

import { ElementState } from '../providers/element-state.provider';
import { Ticker } from '@smoovy/ticker';

export enum ScrollStateTriggerType {
  USER = 'user',
  ANIMATION = 'animation',
}

export interface ScrollState {
  triggeredBy: ScrollStateTriggerType;
  position: Coordinate;
  lastPosition: Coordinate;
  currentTime: number;
  lastTime: number;
}

const initialState: ScrollState = {
  triggeredBy: ScrollStateTriggerType.USER,
  position: { x: 0, y: 0 },
  lastPosition: { x: 0, y: 0 },
  currentTime: Date.now(),
  lastTime: Date.now(),
};

export class ScrollerService {
  private static instance: ScrollerService;
  private rootElement!: HTMLElement;
  private scroller?: Scroller;
  private initialized: boolean = false;
  private wrapperState!: ElementState;
  private containerState!: ElementState;
  private scrollSubject = new BehaviorSubject(initialState);
  public scroll$ = this.scrollSubject.asObservable().pipe(
    filter(() => this.initialized),
  );

  public scrollVelocity$ = this.scrollUser$.pipe(
    map((state) => {
      const deltaY = state.position.y - state.lastPosition.y;
      const deltaX = state.position.x - state.lastPosition.x;
      const deltaTime = state.currentTime - state.lastTime;

      if (deltaTime === 0 && deltaY === 0) {
        return { x: 0, y: 0 };
      }

      return {
        x: Math.floor(deltaX),
        y: Math.floor(deltaY),
      };
    }),
  );

  public static getInstance(): ScrollerService {
    if ( ! this.instance) {
      return this.instance = new ScrollerService();
    }

    return this.instance;
  }

  public get scrollAnimation$(): Observable<ScrollState> {
    return this.scroll$.pipe(
      filter((state) => {
        return state.triggeredBy === ScrollStateTriggerType.ANIMATION;
      }),
    );
  }

  public get scrollUser$(): Observable<ScrollState> {
    return this.scroll$.pipe(
      filter((state) => {
        return state.triggeredBy === ScrollStateTriggerType.USER;
      }),
    );
  }

  public setRootElement(
    element: HTMLElement,
  ) {
    this.rootElement = element;

    this.createScroller();
  }

  private createScroller() {
    if (Browser.client) {
      const ticker = new Ticker();
      ticker.override = true;

      this.scroller = smoothScroll({ element: this.rootElement }, {
        lerp: {
          ticker,
        },
        mouse: {
          multiplier: 0.8,
          multiplierFirefox: 50
        }
      });

      PIXI.ticker.shared.add((delta) => ticker.tick(delta));

      this.scroller.onVirtual((position) => {
        this.triggerScroll(ScrollStateTriggerType.USER, position);
      });

      this.scroller.onScroll((position) => {
        this.triggerScroll(
          ScrollStateTriggerType.ANIMATION,
          position
        );
      });

      this.initialized = true;
    }
  }

  public update() {
    if (this.scroller) {
      this.scroller.recalc();
    }
  }

  public get wrapper() {
    return this.scroller && this.scroller.dom.wrapper.element;
  }

  public get container() {
    return this.scroller && this.scroller.dom.container.element;
  }

  public get wrapperHeight(): number {
    return this.scroller
      ? this.scroller.dom.wrapper.size.height
      : 0;
  }

  public get wrapperWidth() {
    return this.scroller
      ? this.scroller.dom.wrapper.size.width
      : 0;
  }

  public get containerHeight(): number {
    return this.scroller
      ? this.scroller.dom.container.size.height
      : 0;
  }

  public scrollToY(y: number) {
    if (this.initialized && this.scroller) {
      this.scroller.scrollTo({ y });
    }
  }

  private triggerScroll(
    triggeredBy: ScrollStateTriggerType,
    position: Coordinate,
    lastPosition: Coordinate = position,
  ) {
    const last = this.scrollSubject.value;

    this.scrollSubject.next({
      triggeredBy,
      position,
      lastPosition,
      currentTime: Date.now(),
      lastTime: last.currentTime,
    });
  }
}
