import { Container } from 'pixi.js';
import anime from 'animejs';

import { ContainerExtra, ContainerExtraConfig } from '../default.container';

export interface VisibilityConfig extends ContainerExtraConfig {
  duration: number;
}

export const visibilityExtraName = 'visibility';

export class Visibility implements ContainerExtra {
  public name = visibilityExtraName;
  private visible: boolean = true;
  private visibleAnimation!: anime.AnimeInstance;

  public constructor(
    protected target: Container,
  ) {}

  public activate(config: Partial<VisibilityConfig> = {}) {
    if ( ! this.visible) {
      this.visible = true;

      const duration = config.duration !== undefined ? config.duration : 1500;

      if (this.visibleAnimation) {
        this.visibleAnimation.pause();
      }

      this.visibleAnimation = anime({
        targets: this.target,
        duration,
        alpha: 1,
        easing: 'easeOutCirc',
      });
    }
  }

  public deactivate(config: Partial<VisibilityConfig> = {}) {
    if (this.visible) {
      this.visible = false;

      const duration = config.duration !== undefined ? config.duration : 1500;

      if (this.visibleAnimation) {
        this.visibleAnimation.pause();
      }

      this.visibleAnimation = anime({
        targets: this.target,
        duration,
        alpha: 0,
        easing: 'easeOutCirc',
      });
    }
  }
}
