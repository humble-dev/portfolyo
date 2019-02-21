import { getElementOffset } from '../utils/element.util';

export class ElementStateProvider {
  private static instance: ElementStateProvider;
  private states: ElementState[] = [];

   public static getInstance(): ElementStateProvider {
    if ( ! this.instance) {
      return this.instance = new ElementStateProvider();
    }

    return this.instance;
  }

  public add(state: ElementState) {
    if ( ! this.states.includes(state)) {
      this.states.push(state);
    }
  }

  public remove(state: ElementState) {
    const index = this.states.indexOf(state);

    if (index > -1) {
      this.states = this.states.splice(index, 1);
    }
  }

  public update() {
    this.states.forEach((state) => state.update());
  }
}

export interface ElementStateConfig {
  includeOffset: boolean;
  includeBounds: boolean;
}

export class ElementState {
  private stateProvider = ElementStateProvider.getInstance();
  private _bounds?: { x: number, y: number, width: number, height: number };
  private _offset?: { x: number, y: number };

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
    this.stateProvider.add(this);
  }

  public detach() {
    this.stateProvider.remove(this);
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
}
