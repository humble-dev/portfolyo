import { Container } from 'pixi.js';
import anime, { EasingOptions } from 'animejs';

import { ContainerExtraConfig, ContainerExtra } from '../default.container';

export interface DisplacementConfig extends ContainerExtraConfig {
  scaleX: number;
  scaleY: number;
  sprite: string;
  scaleDuration: number;
  rotationDuration: number;
}

export const displacementExtraName = 'displacement';

export class Displacement implements ContainerExtra {
  public name = displacementExtraName;
  private active: boolean = false;
  private sprite?: PIXI.Sprite;
  private filter?: PIXI.filters.DisplacementFilter;
  private animations: anime.AnimeInstance[] = [];
  private scaleAnimation?: anime.AnimeInstance;

  public constructor(
    protected target: Container,
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

      if ( ! this.sprite) {
        this.sprite = PIXI.Sprite.from(config.sprite || 'displacement.water');
        this.sprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.position.x = this.target.x + this.target.width / 2;
        this.sprite.position.y = this.target.y + this.target.height / 2;
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

      this.animations.push(
        anime({
          targets: this.sprite,
          duration: config.rotationDuration || 250000,
          rotation: 360 * (Math.PI / 180),
          easing: 'linear',
          loop: true,
        }),
      );

      this.target.addChild(this.sprite);
    }
  }

  public scaleFilter(
    scaleX: number,
    scaleY: number,
    duration: number = 500,
    easing: EasingOptions = 'easeOutCubic',
  ) {
    if (this.filter) {
      if (this.scaleAnimation) {
        this.scaleAnimation.pause();
      }

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
          complete: () => {
            if (this.sprite && this.target.filters) {
              this.target.removeChild(this.sprite);

              this.target.filters = this.target.filters.filter((filter) => {
                return filter !== this.filter;
              });

              this.sprite = undefined;
              this.filter = undefined;
            }
          },
        }),
      );
    }
  }
}
