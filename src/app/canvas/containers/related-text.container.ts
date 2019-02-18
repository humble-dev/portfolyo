import { RelatedContainer } from '../related.container';
import { TweenLite } from 'gsap';

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
}

export class RelatedTextContainer extends RelatedContainer {
  protected text!: PIXI.Text;
  protected displacementSprite?: PIXI.Sprite;
  protected displacementFilter?: PIXI.filters.DisplacementFilter;
  protected displacementTween!: TweenLite;

  public constructor(
    element: HTMLElement,
    protected content: string,
    protected config: Partial<RelatedTextContainerConfig> = {},
  ) {
    super(element);
  }

  public get index() {
    return 5;
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

    this.context.addChild(this.text);
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

    if (this.displacementSprite) {
      this.displacementSprite.position.x = this.text.x + this.text.width / 2;
      this.displacementSprite.position.y = this.text.y + this.text.height / 2;
    }
  }

  public enableDisplacement(enabled: boolean) {
    this.ready.then(() => {
      if (enabled && ! this.displacementSprite) {
        this.displacementSprite = PIXI.Sprite.fromImage('/images/displacement/paper.jpg');
        this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite, 0);

        this.text.filters = [ this.displacementFilter ];

        this.displacementSprite.anchor.x = 0.5;
        this.displacementSprite.anchor.y = 0.5;
        this.displacementSprite.position.x = this.text.x + this.text.width / 2;
        this.displacementSprite.position.y = this.text.y + this.text.height / 2;

        TweenLite.to(this.displacementFilter.scale, .5, {
          x: 15,
          y: 15,
        });

        this.displacementTween = TweenLite.to(this.displacementSprite, 250, {
          repeat: -1,
          rotation: 360 * (Math.PI / 180),
        });

        this.context.addChild(this.displacementSprite);
      } else if ( ! enabled && this.displacementSprite && this.displacementFilter) {
        this.displacementTween.kill();

        TweenLite.to(this.displacementFilter.scale, .5, {
          x: 0,
          y: 0,
          onComplete: () => {
            if (this.displacementSprite && this.text.filters) {
              this.context.removeChild(this.displacementSprite);

              this.text.filters = this.text.filters.filter((filter) => {
                return filter !== this.displacementFilter;
              });

              this.displacementSprite = undefined;
              this.displacementFilter = undefined;
            }
          },
        });
      }
    });
  }
}
