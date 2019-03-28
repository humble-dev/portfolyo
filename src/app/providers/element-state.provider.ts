import { getElementOffset } from '../utils/element.util';

interface Position {
  x: number;
  y: number;
}

export class ElementStateProvider {
  private static states: ElementState[] = [];

  public static add(state: ElementState) {
    if ( ! this.states.includes(state)) {
      this.states.push(state);
    }
  }

  public static remove(state: ElementState) {
    const index = this.states.indexOf(state);

    if (index > -1) {
      this.states.splice(index, 1);
    }
  }

  public static contains(element: HTMLElement) {
    return !!this.states.find((state) => state.element === element);
  }

  public static getByElement(element: HTMLElement) {
    return this.states.find((state) => state.element === element);
  }

  public static pruneUpdate(parent?: HTMLElement) {
    const states: ElementState[] = [];

    if ( ! parent && typeof document !== 'undefined') {
      parent = document.body;
    }

    this.states.forEach((state) => {
      if (parent) {
        if ( ! parent.contains(state.element)) {
          states.push(state);
        }
      }
    });

    states.forEach((state) => this.remove(state));
  }

  public static update() {
    this.states.forEach((state) => state.update());
  }
}

export interface ElementStateConfig {
  includeOffset: boolean;
  includeBounds: boolean;
}

export class ElementState<D extends object = any> {
  private _bounds?: { x: number, y: number, width: number, height: number };
  private _offset?: Position;
  public data: D = {} as D;

  public static create<D extends object = any>(
    element: HTMLElement
  ): ElementState<D> {
    return ElementStateProvider.getByElement(element) || new this(element);
  }

  public constructor(
    public element: HTMLElement,
    private config: Partial<ElementStateConfig> = {
      includeOffset: true,
      includeBounds: true,
    },
  ) {
    this.attach();
  }

  public attach() {
    ElementStateProvider.add(this);
    setTimeout(() => this.update());
  }

  public detach() {
    ElementStateProvider.remove(this);
  }

  public get bounds() {
    return this._bounds || {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  public get offset() {
    return this._offset || {
      x: 0,
      y: 0,
    };
  }

  public update() {
    if (this.config.includeBounds) {
      const bounds = this.element.getBoundingClientRect();

      this._bounds = {
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height,
      };
    }

    if (this.config.includeOffset) {
      this._offset = getElementOffset(this.element);
    }
  }

  public inViewport(
    scrollPosition: Position,
    viewportSize: { width: number, height: number },
    offset: number|Position = 0,
  ): boolean {
    offset = typeof offset === 'number' ? { x: offset, y: offset } : offset;

    const belowViewport = (
      this.offset.y - offset.y > scrollPosition.y + viewportSize.height
    );

    const aboveViewport = (
      this.offset.y + offset.y + this.bounds.height < scrollPosition.y
    );

    const rightOfViewport = (
      this.offset.x - offset.x > scrollPosition.x + viewportSize.width
    );

    const leftOfViewport = (
      this.offset.x + offset.x + this.bounds.width < scrollPosition.x
    );

    return !belowViewport && !aboveViewport &&
           !rightOfViewport && !leftOfViewport;
  }
}
