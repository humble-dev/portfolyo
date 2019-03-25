import { ElementState } from '../providers/element-state.provider';
import { DefaultContainer } from './default.container';

export abstract class RelatedContainer extends DefaultContainer {
  protected position: { x: number, y: number } = { x: 0, y: 0 };
  protected size: { width: number, height: number } = { width: 0, height: 0 };
  protected elementState!: ElementState;

  public constructor(element: HTMLElement) {
    super(true);

    this.elementState = new ElementState(element);
  }

  public init() {
    super.init();

    this.updateBounds();
  }

  public render() {
    super.render();
  }

  public sync() {
    super.sync();

    this.updateBounds();
  }

  private updateBounds() {
    this.size.width = this.elementState.bounds.width;
    this.size.height = this.elementState.bounds.height;
    this.context.x = this.position.x = this.elementState.offset.x;
    this.context.y = this.position.y = this.elementState.offset.y;
  }
}
