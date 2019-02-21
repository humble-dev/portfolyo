import { TweenLite } from 'gsap';
import { Container } from 'pixi.js';

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
  private tweens: TweenLite[] = [];

  public constructor(
    protected target: Container,
  ) {}

  private killTweens() {
    this.tweens.forEach((tween) => tween.kill());

    this.tweens = [];
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

        this.target.filters = [ this.filter ];
      }

      this.tweens.push(
        TweenLite.to(this.filter.scale, config.scaleDuration || .5, {
          x: config.scaleX || 15,
          y: config.scaleY || 15,
        }),
      );

      this.tweens.push(
        TweenLite.to(this.sprite, config.rotationDuration || 250, {
          repeat: -1,
          rotation: 360 * (Math.PI / 180),
        }),
      );

      this.target.addChild(this.sprite);
    }
  }

  public deactivate(config: Partial<DisplacementConfig> = {}) {
    if (this.filter && this.active) {
      this.killTweens();

      this.active = false;
      this.tweens.push(
        TweenLite.to(this.filter.scale, config.scaleDuration || .5, {
            x: 0,
            y: 0,
            onComplete: () => {
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
