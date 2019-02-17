import { DefaultContainer } from './default.container';

export abstract class RelatedContainer extends DefaultContainer {
  protected position: { x: number, y: number } = { x: 0, y: 0 };
  protected size: { width: number, height: number } = { width: 0, height: 0 };

  public constructor(
    private element: HTMLElement,
  ) {
    super();
  }

  public init() {
    super.init();

    this.updateBounds();
  }

  public render() {
    super.render();

    this.updateBounds();
  }

  public sync() {
    super.sync();

    this.updateBounds();
  }

  private updateBounds() {
    const bounds = this.element.getBoundingClientRect();

    this.size.width = bounds.width;
    this.size.height = bounds.height;
    this.context.x = this.position.x = bounds.left;
    this.context.y = this.position.y = bounds.top;
  }
}
