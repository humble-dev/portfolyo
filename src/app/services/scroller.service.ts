import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import * as Smoovy from '@smoovy/core';
import { ElementState } from '../providers/element-state.provider';

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
          multiplier: 1,
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
    position: Smoovy.Position,
    triggeredBy: ScrollStateTriggerType,
  ) {
    this.scrollSubject.next({
      triggeredBy,
      position,
    });
  }
}
