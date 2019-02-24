import { Displacement } from '../extras/displacement.extra';
import { Visibility } from '../extras/visibility.extra';
import { RelatedContainer } from '../related.container';
import { MouseMotion } from '../extras/mouse-motion.extra';
import { Parallax } from '../extras/parallax.extra';
import { DefaultContainer } from '../default.container';

export enum RelatedTextContainerStretch {
  NONE = 0,
  ASPECT_RATIO = 1,
  FIT_WIDTH = 2,
  FIT_HEIGHT = 3,
}

export interface RelatedTextContainerConfig extends PIXI.TextStyleOptions {
  stretchMode: RelatedTextContainerStretch;
  centerVertical: boolean;
  centerHorizontal: boolean;
  anchorX: number;
  anchorY: number;
  rotation: number;
  index: number;
  created: (
    text: PIXI.Text,
    context: PIXI.Container,
    viewportSize: DefaultContainer['viewportSize'],
  ) => void;
  sync: (
    text: PIXI.Text,
    context: PIXI.Container,
    viewportSize: DefaultContainer['viewportSize'],
  ) => void;
}

export class RelatedTextContainer extends RelatedContainer {
  protected text!: PIXI.Text;

  public constructor(
    element: HTMLElement,
    protected content: string,
    protected config: Partial<RelatedTextContainerConfig> = {},
  ) {
    super(element);
  }

  public get index() {
    return this.config.index !== undefined ? this.config.index : 5;
  }

  public init() {
    super.init();

    this.text = new PIXI.Text(
      this.content,
      {
        ...this.config,
      },
    );

    this.text.anchor = new PIXI.ObservablePoint(
      () => {},
      this,
      this.config.anchorX || 0,
      this.config.anchorY || 0,
    );

    if (this.config.rotation) {
      this.text.rotation = this.config.rotation * (Math.PI / 180);
    }

    this.enableExtras(
      this.text,
      Visibility,
      Displacement,
      MouseMotion,
    );

    this.enableExtras(
      this.context,
      Parallax,
    );

    this.context.addChild(this.text);

    if (this.config.created) {
      this.config.created.call(
        this,
        this.text,
        this.context,
        this.viewportSize,
      );
    }
  }

  public sync() {
    super.sync();

    const heightRatio = this.size.height / this.text.height;
    const widthRatio = this.size.width / this.text.width;
    let ratio = 1;

    if (this.config.stretchMode) {
      switch (this.config.stretchMode) {
        case RelatedTextContainerStretch.ASPECT_RATIO:
          ratio = Math.min(heightRatio, widthRatio);
          break;
        case RelatedTextContainerStretch.FIT_HEIGHT: {
          ratio = heightRatio;
          break;
        }

        case RelatedTextContainerStretch.FIT_WIDTH: {
          ratio = widthRatio;
          break;
        }
      }
    }

    if (this.config.centerHorizontal) {
      this.text.x = this.size.width * .5;
      this.text.anchor.x = .5;
    } else {
      this.text.x = 0;
    }

    if (this.config.centerVertical) {
      this.text.y = this.size.height * .5;
      this.text.anchor.y = .5;
    } else {
      this.text.y = 0;
    }

    this.text.width *= ratio;
    this.text.height *= ratio;

    if (this.config.sync) {
      this.config.sync.call(
        this,
        this.text,
        this.context,
        this.viewportSize,
      );
    }
  }
}
