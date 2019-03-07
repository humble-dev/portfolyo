import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import * as Smoovy from '@smoovy/core';

import { ElementState } from '../providers/element-state.provider';
import { easings } from '@smoovy/core';

export enum ScrollStateTriggerType {
  USER = 'user',
  ANIMATION = 'animation',
}

export interface ScrollState {
  triggeredBy: ScrollStateTriggerType;
  position: Smoovy.Position;
  lastPosition: Smoovy.Position;
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
  private scroller!: Smoovy.Scroller;
  private initialized: boolean = false;
  private wrapperState!: ElementState;
  private containerState!: ElementState;
  private scrollSubject: BehaviorSubject<ScrollState> = new BehaviorSubject(initialState);
  public scroll$: Observable<ScrollState> = this.scrollSubject.asObservable().pipe(
    filter(() => this.initialized),
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

  public scrollVelocity$ = this.scrollUser$.pipe(
    map((state) => {
      const deltaY = state.position.y - state.lastPosition.y;
      const deltaX = state.position.x - state.lastPosition.x;
      const deltaTime = state.currentTime - state.lastTime;

      return {
        x: Math.round(deltaX / deltaTime),
        y: Math.round(deltaY / deltaTime),
      };
    }),
  );

  public setRootElement(
    element: HTMLElement,
  ) {
    this.rootElement = element;

    this.createScroller();
  }

  private createScroller() {
    if (this.scroller) {
      this.scroller.deactivate();
    }

    this.scroller = Smoovy.Scroller.init({
      container: this.rootElement,
      mobileNative: false,
      controllers: {
        output: {
          default: Smoovy.TweenSectionController,
        },
      },
      on: {
        scroll: (
          position: Smoovy.Position,
          lastPosition: Smoovy.Position,
        ) => {
          this.triggerScroll(
            ScrollStateTriggerType.USER,
            position,
            lastPosition,
          );
        },
      },
      input: {
        mouse: {
          multiplier: 0.6,
        },
        touch: {
          multiplier: 3,
        },
      },
      output: {
        default: {
          speed: 1500,
          selector: 'section,footer',
          on: {
            animation: (
              position: Smoovy.Position,
              lastPosition: Smoovy.Position,
            ) => {
              this.triggerScroll(
                ScrollStateTriggerType.ANIMATION,
                position,
                lastPosition,
              );
            },
          },
        },
      },
    });

    this.wrapperState = new ElementState(
      this.scroller.dom.getWrapper(),
      {
        includeBounds: true,
      },
    );

    this.containerState = new ElementState(
      this.scroller.dom.getContainer(),
      {
        includeBounds: true,
      },
    );

    this.initialized = true;
  }

  public get wrapper(): HTMLElement {
    return this.wrapperState.element;
  }

  public get container(): HTMLElement {
    return this.containerState.element;
  }

  public get wrapperHeight(): number {
    return this.wrapperState.bounds.height;
  }

  public get wrapperWidth(): number {
    return this.wrapperState.bounds.width;
  }

  public get containerHeight(): number {
    return this.containerState.bounds.height;
  }

  public scrollToY(
    y: number,
    duration: number = 0,
  ) {
    if (this.initialized) {
      this.scroller.scrollToY(y, duration);
    }
  }

  private triggerScroll(
    triggeredBy: ScrollStateTriggerType,
    position: Smoovy.Position,
    lastPosition: Smoovy.Position = position,
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
