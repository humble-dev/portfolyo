import { Container } from 'pixi.js';

import { ContainerExtra, ContainerExtraConfig } from '../default.container';
import { TweenLite } from 'gsap';

export interface VisibilityConfig extends ContainerExtraConfig {
  duration: number;
}

export const visibilityExtraName = 'visibility';

export class Visibility implements ContainerExtra {
  public name = visibilityExtraName;
  private visible: boolean = true;

  public constructor(
    protected target: Container,
  ) {}

  public activate(config: Partial<VisibilityConfig> = {}) {
    if ( ! this.visible) {
      this.visible = true;

      const duration = config.duration !== undefined ? config.duration : 1;

      TweenLite.to(this.target, duration, {
        alpha: 1,
      });
    }
  }

  public deactivate(config: Partial<VisibilityConfig> = {}) {
    if (this.visible) {
      this.visible = false;

      const duration = config.duration !== undefined ? config.duration : 1;

      TweenLite.to(this.target, duration, {
        alpha: 0,
      });
    }
  }
}
