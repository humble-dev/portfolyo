import * as _filterMotionBlur from '@pixi/filter-motion-blur';
import { easings, Tween } from '@smoovy/tween';

import { ContainerExtra, ContainerExtraConfig } from '../default.container';

export interface MotionBlurConfig extends ContainerExtraConfig {}

export const motionBlurExtraName = 'motion-blur';

export class MotionBlur implements ContainerExtra {
  public name = motionBlurExtraName;
  private enabled: boolean = false;
  private filter?: _filterMotionBlur.MotionBlurFilter;
  private velocityTween?: Tween;

  public constructor(
    protected target: PIXI.Container,
  ) {}

  public activate(config: Partial<MotionBlurConfig> = {}) {
    if ( ! this.enabled) {
      this.enabled = true;

      if ( ! this.target.filters) {
        this.target.filters = [];
      }

      if (this.target.filters) {
        if (process.browser) {
          const filterMotionBlur = require(
            '@pixi/filter-motion-blur'
          ) as typeof _filterMotionBlur;

          this.filter = new filterMotionBlur.MotionBlurFilter([0, 0], 5),
          this.filter.padding = 50;
          this.target.filters = [ this.filter ];
        }
      }
    }
  }

  public setVelocity(
    x: number,
    y: number,
    duration: number = 500,
  ) {
    if (this.filter) {
      if (this.velocityTween) {
        this.velocityTween.stop();
      }

      if (process.browser) {
        this.velocityTween = Tween.fromTo(
          {
            x: this.filter.velocity.x,
            y: this.filter.velocity.y,
          },
          {
            x,
            y,
          },
          {
            duration,
            easing: easings.Sine.out,
            on: {
              update: (velocity) => {
                if (this.filter) {
                  this.filter.velocity.x = velocity.x;
                  this.filter.velocity.y = velocity.y;
                }
              },
            }
          }
        );
      }
    }
  }

  public deactivate(config: Partial<MotionBlurConfig> = {}) {
    if (this.enabled) {
      this.enabled = false;

      if (this.target.filters && this.filter) {
        const index = this.target.filters.indexOf(this.filter);

        if (index > -1) {
          this.target.filters.splice(index, 1);
        }
      }
    }
  }
}
