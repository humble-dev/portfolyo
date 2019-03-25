import anime, { EasingOptions } from 'animejs';

import { ContainerExtraConfig, ContainerExtra } from '../default.container';

export interface DisplacementConfig extends ContainerExtraConfig {
  scaleX: number;
  scaleY: number;
  sprite: string;
  scaleDuration: number;
  rotationSpeed: number;
  moveSpeedX: number;
  moveSpeedY: number;
}

export const displacementExtraName = 'displacement';

export class Displacement implements ContainerExtra {
  public name = displacementExtraName;
  private config!: Partial<DisplacementConfig>;
  private active: boolean = false;
  private renderable: boolean = false;
  private sprite?: PIXI.Sprite;
  private filter?: PIXI.filters.DisplacementFilter;
  private animations: anime.AnimeInstance[] = [];
  private scaleAnimation?: anime.AnimeInstance;

  public constructor(
    protected target: PIXI.Container,
  ) {}

  private killTweens() {
    if (this.scaleAnimation) {
      this.scaleAnimation.pause();
    }

    this.animations.forEach((anim) => anim.pause());

    this.animations = [];
  }

  public activate(config: Partial<DisplacementConfig> = {}) {
    if ( ! this.active) {
      this.killTweens();

      this.active = true;
      this.renderable = true;
      this.config = config;

      if ( ! this.sprite) {
        this.sprite = PIXI.Sprite.from(config.sprite || 'displacement.clouds');
        this.sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.sprite.cacheAsBitmap = true;
        this.sprite.anchor.set(1, 1);
      }

      if ( ! this.filter) {
        this.filter = new PIXI.filters.DisplacementFilter(this.sprite, 0);

        this.target.filters = [
          this.filter,
          ...(this.target.filters || []),
        ];
      }

      this.animations.push(
        anime({
          targets: this.filter.scale,
          easing: 'easeOutCubic',
          duration: typeof config.scaleDuration === 'number'
            ? config.scaleDuration
            : 500,
          x: typeof config.scaleX === 'number'
            ? config.scaleX
            : 15,
          y: typeof config.scaleY === 'number'
            ? config.scaleY
            : 15,
        }),
      );

      this.target.addChild(this.sprite);
    }
  }

  public render(delta: number = 1) {
    if (this.sprite && this.renderable) {
      if (this.config.rotationSpeed) {
        this.sprite.rotation += this.config.rotationSpeed * delta;
        this.sprite.rotation %= 6.283185307179586; // = 360deg
      }

      if (this.config.moveSpeedX) {
        this.sprite.x += this.config.moveSpeedX * delta;
        this.sprite.x %= this.sprite.width;
      }

      if (this.config.moveSpeedY) {
        this.sprite.y += this.config.moveSpeedY * delta;
        this.sprite.y %= this.sprite.height;
      }
    }
  }

  public scaleFilter(
    scaleX: number,
    scaleY: number,
    duration: number = 500,
    easing: EasingOptions = 'easeOutCubic',
  ) {
    if (this.filter) {
      this.killTweens();

      this.scaleAnimation = anime({
        targets: this.filter.scale,
        duration,
        x: scaleX,
        y: scaleY,
        easing,
      });
    }
  }

  public deactivate(config: Partial<DisplacementConfig> = {}) {
    if (this.filter && this.active) {
      this.killTweens();

      this.active = false;

      this.animations.push(
        anime({
          targets: this.filter.scale,
          easing: 'easeOutCubic',
          duration: config.scaleDuration || 500,
          x: 0,
          y: 0,
        }),
      );
    }
  }
}
