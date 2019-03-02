import { ContainerExtra, ContainerExtraConfig } from '../default.container';
import { MotionBlurFilter } from '@pixi/filter-motion-blur';
import anime from 'animejs';

export interface MotionBlurConfig extends ContainerExtraConfig {}

export const motionBlurExtraName = 'motion-blur';

export class MotionBlur implements ContainerExtra {
  public name = motionBlurExtraName;
  private enabled: boolean = false;
  private filter?: MotionBlurFilter;
  private velocityAnimation?: anime.AnimeInstance;

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
        this.filter = new MotionBlurFilter([0, 0], 5),
        this.filter.padding = 50;

        this.target.filters = [ this.filter ];
      }
    }
  }

  public setVelocity(x: number, y: number) {
    if (this.filter) {
      if (this.velocityAnimation) {
        this.velocityAnimation.pause();
      }

      this.velocityAnimation = anime({
        targets: this.filter.velocity,
        duration: 500,
        x,
        y,
      });
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
