import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ElementState } from '../providers/element-state.provider';

export enum ScrollStateTriggerType {
  USER = 'user',
  ANIMATION = 'animation',
}

export interface ScrollState {
  triggeredBy: ScrollStateTriggerType;
  position: smoovy.Position;
  lastPosition: smoovy.Position;
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
  private smoovyEnabled: boolean = (process as any).browser;
  private rootElement!: HTMLElement;
  private scroller?: smoovy.Scroller;
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
    if (this.smoovyEnabled) {
      if (this.scroller) {
        this.scroller.deactivate();
      }

      this.scroller = smoovy.Scroller.init({
        container: this.rootElement,
        mobileNative: false,
        controllers: {
          output: {
            default: smoovy.TweenSectionController,
          },
        },
        on: {
          scroll: (
            position: smoovy.Position,
            lastPosition: smoovy.Position,
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
            multiplier: 0.5,
            firefoxMultiplier: 20
          },
          touch: {
            multiplier: 2.5,
          },
        },
        output: {
          default: {
            easing: smoovy.easings.Expo.out,
            speed: 1500,
            selector: 'section,footer',
            on: {
              animation: (
                position: smoovy.Position,
              ) => {
                this.triggerScroll(
                  ScrollStateTriggerType.ANIMATION,
                  position,
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
  }

  public update() {
    if (this.scroller) {
      this.scroller.update();
    }
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
    if (this.initialized && this.scroller) {
      this.scroller.scrollToY(y, duration);
    }
  }

  private triggerScroll(
    triggeredBy: ScrollStateTriggerType,
    position: smoovy.Position,
    lastPosition: smoovy.Position = position,
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
