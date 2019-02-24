import { ScrollerService } from '@/app/services/scroller.service';
import { parallax } from '@/app/utils/math.util';

import { ContainerExtra, ContainerExtraConfig } from '../default.container';

export interface ParallaxConfig extends ContainerExtraConfig {
  speed: number;
  direction: 'x' | 'y';
}

export const parallaxExtraName = 'parallax';

export class Parallax implements ContainerExtra {
  public name = parallaxExtraName;
  private scroller = ScrollerService.getInstance();
  private container = new PIXI.Container();
  private enabled: boolean = false;

  public constructor(
    protected target: PIXI.Container,
  ) {}

  public activate(config: Partial<ParallaxConfig> = {}) {
    if ( ! this.enabled) {
      this.target.addChild(this.container);
      this.target.children.forEach((child) => {
        this.container.addChild(child);
      });

      this.scroller.scrollAnimation$.subscribe((state) => {
        const viewportHeight = this.scroller.containerHeight;
        const elementHeight = this.container.height;
        const elementY = this.target.y;
        const realSpeed = config.speed || 0;
        const speed = Math.abs(realSpeed);
        const minSpeed = realSpeed <= 0 ? speed : -speed;
        const maxSpeed = realSpeed <= 0 ? -speed : speed;
        const minOffset = config.direction === 'x' ? 0 : minSpeed;
        const maxOffset = config.direction === 'x' ? 0 : maxSpeed;

        const translation = parallax(
          state.position.y,
          viewportHeight,
          elementHeight,
          elementY,
          minSpeed,
          maxSpeed,
          minOffset,
          maxOffset,
        );

        this.container.x = config.direction === 'x' ?  translation : 0;
        this.container.y = config.direction === 'y' ? translation : 0;
      });
    }
  }

  public deactivate(config: Partial<ParallaxConfig> = {}) {
    if (this.enabled) {
      this.container.children.forEach((child) => {
        this.target.addChild(child);
      });

      this.target.removeChild(this.container);
    }
  }
}
