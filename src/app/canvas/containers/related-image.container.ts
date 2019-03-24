import { Displacement } from '../extras/displacement.extra';
import { MouseMotion } from '../extras/mouse-motion.extra';
import { Visibility } from '../extras/visibility.extra';
import { RelatedContainer } from '../related.container';
import { Parallax } from '../extras/parallax.extra';
import { MotionBlur } from '../extras/motion-blur.extra';
import { MouseTwist } from '../extras/mouse-twist.extra';

export enum RelatedImageContainerStretch {
  NONE = 0,
  ASPECT_RATIO = 1,
  FIT_WIDTH = 2,
  FIT_HEIGHT = 3,
}

export interface RelatedImageContainerConfig {
  hidden: boolean;
  scale: number;
  index: number;
  stretchMode: RelatedImageContainerStretch;
  centerHorizontal: boolean;
  centerVertical: boolean;
}

export class RelatedImageContainer extends RelatedContainer {
  protected sprite!: PIXI.Sprite;
  protected originSize: { width: number, height: number } = {
    width: 0,
    height: 0,
  };

  public constructor(
    element: HTMLElement,
    protected texture: string|PIXI.Texture,
    protected config: Partial<RelatedImageContainerConfig> = {},
  ) {
    super(element);
  }

  public get index() {
    return this.config.index !== undefined ? this.config.index : 5;
  }

  public init() {
    super.init();

    if (this.texture instanceof PIXI.Texture) {
      this.sprite = new PIXI.Sprite(this.texture);
    } else {
      this.sprite = PIXI.Sprite.from(this.texture);
    }

    this.originSize.width = this.sprite.width;
    this.originSize.height = this.sprite.height;

    this.sprite.anchor = new PIXI.ObservablePoint(
      () => {},
      this,
      0.5,
      0.5,
    );

    if (this.config.hidden) {
      this.enableVisibility(false, { duration: 0 });
    }

    this.enableExtras(
      this.sprite,
      Displacement,
      Visibility,
      MouseTwist,
      MouseMotion,
    );

    this.enableExtras(
      this.context,
      Parallax,
    );

    this.context.addChild(this.sprite);
  }

  public sync() {
    super.sync();

    this.updateSize();
  }

  private updateSize() {
    const heightRatio = this.size.height / this.originSize.height;
    const widthRatio = this.size.width / this.originSize.width;
    let ratio = 1;

    if (this.config.stretchMode) {
      switch (this.config.stretchMode) {
        case RelatedImageContainerStretch.ASPECT_RATIO:
          ratio = Math.min(heightRatio, widthRatio);
          break;

        case RelatedImageContainerStretch.FIT_HEIGHT: {
          ratio = heightRatio;
          break;
        }

        case RelatedImageContainerStretch.FIT_WIDTH: {
          ratio = widthRatio;
          break;
        }
      }
    }

    if (this.config.scale) {
      ratio *= this.config.scale;
    }

    this.sprite.width = this.originSize.width * ratio;
    this.sprite.height = this.originSize.height * ratio;

    if (this.config.centerHorizontal) {
      this.context.x -= this.sprite.width * .5 - this.size.width * .5;
      this.sprite.x = 0;
      this.sprite.anchor.x = 0;
    } else {
      this.sprite.x = 0;
      this.sprite.anchor.x = 0;
    }

    if (this.config.centerVertical) {
      this.context.y -= this.sprite.height * .5 - this.size.height * .5;
      this.sprite.y = 0;
      this.sprite.anchor.y = 0;
    } else {
      this.sprite.y = 0;
      this.sprite.anchor.y = 0;
    }
  }
}
