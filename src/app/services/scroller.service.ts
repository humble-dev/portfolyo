import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import * as Smoovy from '@smoovy/core';

export enum ScrollStateTriggerType {
  USER = 'user',
  ANIMATION = 'animation',
}

export interface ScrollState {
  triggeredBy: ScrollStateTriggerType;
  position: Smoovy.Position;
}

const initialState: ScrollState = {
  triggeredBy: ScrollStateTriggerType.USER,
  position: {
    x: 0,
    y: 0,
  },
};

export class ScrollerService {
  private static instance: ScrollerService;
  private rootElement!: HTMLElement;
  private scroller!: Smoovy.Scroller;
  private initialized: boolean = false;
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

  public get wrapper(): HTMLElement {
    return this.scroller
      ? this.scroller.dom.getWrapper()
      : this.rootElement;
  }

  public get container(): HTMLElement {
    return this.scroller
      ? this.scroller.dom.getContainer()
      : this.rootElement;
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
    if (this.scroller) {
      this.scroller.deactivate();
    }

    this.scroller = Smoovy.Scroller.init({
      container: this.rootElement,
      on: {
        scroll: (position) => {
          this.triggerScroll(
            position,
            ScrollStateTriggerType.USER,
          );
        },
      },
      input: {
        mouse: {
          multiplier: 0.85,
        },
      },
      output: {
        default: {
          speed: 2000,
          on: {
            animation: (position) => {
              this.triggerScroll(
                position,
                ScrollStateTriggerType.ANIMATION,
              );
            },
          },
        },
      },
    });

    this.initialized = true;
  }

  public get wrapperTop(): number {
    return this.wrapper.getBoundingClientRect().top;
  }

  public get wrapperHeight(): number {
    return this.wrapper.getBoundingClientRect().height;
  }

  public get containerHeight(): number {
    return this.container.getBoundingClientRect().height;
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
    position: Smoovy.Position,
    triggeredBy: ScrollStateTriggerType,
  ) {
    this.scrollSubject.next({
      triggeredBy,
      position,
    });
  }
}
