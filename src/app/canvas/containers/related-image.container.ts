// import { TweenMax } from 'gsap';

import { RelatedContainer } from '../related.container';

export enum RelatedImageContainerStretch {
  NONE = 0,
  ASPECT_RATIO = 1,
  FIT_WIDTH = 2,
  FIT_HEIGHT = 3,
}

export interface RelatedImageContainerConfig {
  hidden: boolean;
  scale: number;
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
    return 2;
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
      this.hide();
    }

    this.context.addChild(this.sprite);
  }

  public render() {
    super.render();
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

  public setPosition(
    x: number,
    y: number,
    duration: number = 0,
  ) {
    if (duration > 0) {
      // TweenMax.to(this.sprite, duration, {
      //   x, y
      // });
    } else {
      this.sprite.x = x;
      this.sprite.y = y;
    }
  }

  public hide(duration: number = 0) {
    if (duration > 0) {
      // TweenMax.to(this.sprite, duration, {
      //   alpha: 0
      // });
    } else {
      this.sprite.alpha = 0;
    }
  }

  public show(duration: number = 0) {
    if (duration > 0) {
      // TweenMax.to(this.sprite, duration, {
      //   alpha: 1
      // });
    } else {
      this.sprite.alpha = 1;
    }
  }
}
