import { Displacement } from '../extras/displacement.extra';
import { MouseMotion } from '../extras/mouse-motion.extra';
import { MouseTwist } from '../extras/mouse-twist.extra';
import { Parallax } from '../extras/parallax.extra';
import { Visibility } from '../extras/visibility.extra';
import { RelatedContainer } from '../related.container';
import { Resolver } from '@/app/utils/promise.util';

export enum RelatedVideoContainerStretch {
  NONE = 0,
  ASPECT_RATIO = 1,
  FIT_WIDTH = 2,
  FIT_HEIGHT = 3,
}

export interface RelatedVideoContainerConfig {
  hidden: boolean;
  scale: number;
  autoPlay: boolean;
  index: number;
  stretchMode: RelatedVideoContainerStretch;
  centerHorizontal: boolean;
  centerVertical: boolean;
}

export class RelatedVideoContainer extends RelatedContainer {
  protected canPlay: boolean = false;
  protected texture: PIXI.Texture;
  protected sprite: PIXI.Sprite;
  protected video: HTMLVideoElement;
  protected videoReady = new Resolver();
  protected originSize: { width: number, height: number } = {
    width: 0,
    height: 0,
  };

  public constructor(
    element: HTMLElement,
    protected videoUrl: string,
    protected config: Partial<RelatedVideoContainerConfig> = {},
  ) {
    super(element);

    this.texture = PIXI.Texture.fromVideo(
      this.videoUrl,
      undefined,
      undefined,
      config.autoPlay,
    );

    this.video = this.texture.baseTexture.source as HTMLVideoElement;
    this.sprite = new PIXI.Sprite(this.texture);

    this.video.muted = true;

    let canplayListener: any;
    this.video.addEventListener('canplay', canplayListener = () => {
      this.isInitialized().then(() => {
        this.canPlay = true;

        this.videoReady.resolve();
        this.setup();

        setTimeout(() => {
          this.video.removeEventListener('canply', canplayListener);
        });
      });
    });
  }

  public get index() {
    return this.config.index !== undefined ? this.config.index : 5;
  }

  private setup() {
    this.canPlay = true;
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
    this.sync();
  }

  public pause() {
    this.videoReady.promise.then(() => {
      this.video.pause();
    });
  }

  public play() {
    this.videoReady.promise.then(() => {
      this.video.play();
    });
  }

  public sync() {
    super.sync();

    if (this.canPlay) {
      const heightRatio = this.size.height / this.sprite.height;
      const widthRatio = this.size.width / this.sprite.width;
      let ratio = 1;

      if (this.config.stretchMode) {
        switch (this.config.stretchMode) {
          case RelatedVideoContainerStretch.ASPECT_RATIO:
            ratio = Math.min(heightRatio, widthRatio);
            break;

          case RelatedVideoContainerStretch.FIT_HEIGHT: {
            ratio = heightRatio;
            break;
          }

          case RelatedVideoContainerStretch.FIT_WIDTH: {
            ratio = widthRatio;
            break;
          }
        }
      }

      if (this.config.scale) {
        ratio *= this.config.scale;
      }

      setTimeout(() => {
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
      });
    }
  }
}
