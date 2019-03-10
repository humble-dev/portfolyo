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
    protected imageId: string,
    protected config: Partial<RelatedImageContainerConfig> = {},
  ) {
    super(element);
  }

  public get index() {
    return this.config.index !== undefined ? this.config.index : 5;
  }

  public init() {
    super.init();

    this.sprite = PIXI.Sprite.from(this.imageId);
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
      MotionBlur,
    );

    this.context.addChild(this.sprite);
  }

  public sync() {
    super.sync();

    const heightRatio = this.size.height / this.sprite.height;
    const widthRatio = this.size.width / this.sprite.width;
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
      this.sprite.x = this.size.width * .5;
      this.sprite.anchor.x = .5;
    } else {
      this.sprite.x = 0;
    }

    if (this.config.centerVertical) {
      this.sprite.y = this.size.height * .5;
      this.sprite.anchor.y = .5;
    } else {
      this.sprite.y = 0;
    }
  }
}
