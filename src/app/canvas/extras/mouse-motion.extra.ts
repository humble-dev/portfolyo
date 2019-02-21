import { TweenLite } from 'gsap';
import { Container } from 'pixi.js';

import { ViewportProvider } from '@/app/providers/viewport.provider';
import { mapRange } from '@/app/utils/math.util';

import { ContainerExtra, ContainerExtraConfig } from '../default.container';

export interface MouseMotionConfig extends ContainerExtraConfig {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  duration: number;
}

export const mouseMotionExtraName = 'mouse-motion';

export class MouseMotion implements ContainerExtra {
  public name = mouseMotionExtraName;
  private viewport = ViewportProvider.getInstance();
  private enabled = false;
  private startPosition!: { x: number, y: number };
  private allowPositionReset: boolean = true;
  private moveListener!: (event: MouseEvent) => void;
  private moveTween!: TweenLite;

  public constructor(
    protected target: Container,
  ) {}

  public activate(config: Partial<MouseMotionConfig> = {}) {
    if ( ! this.enabled) {
      this.enabled = true;

      if (this.moveTween) {
        this.moveTween.kill();
      }

      if ( ! this.startPosition || this.allowPositionReset) {
        this.startPosition = {
          x: this.target.x,
          y: this.target.y,
        };
      }

      window.addEventListener(
        'mousemove',
        this.moveListener = (event) => {
          this.handleMouseMove(event, config);
        },
        false,
      );
    }
  }

  public deactivate(config: Partial<MouseMotionConfig> = {}) {
    if (this.enabled) {
      this.enabled = false;

      if (this.moveTween) {
        this.moveTween.kill();
      }

      this.allowPositionReset = false;

      TweenLite.to(this.target, config.duration || 1, {
        x: this.startPosition.x,
        y: this.startPosition.y,
        onComplete: () => {
          this.allowPositionReset = true;
        },
      });

      if (this.moveListener) {
        window.removeEventListener(
          'mousemove',
          this.moveListener,
        );
      }
    }
  }

  private handleMouseMove(
    event: MouseEvent,
    config: Partial<MouseMotionConfig>,
  ) {
    const viewportSize = this.viewport.size;
    const minX = config.minX !== undefined ? config.minX : -20;
    const maxX = config.maxX !== undefined ? config.maxX : 20;
    const minY = config.minY !== undefined ? config.minY : -20;
    const maxY = config.maxY !== undefined ? config.maxY : 20;

    const moveX = mapRange(
      event.clientX,
      0,
      viewportSize.width,
      minX,
      maxX,
    );

    const moveY = mapRange(
      event.clientY,
      0,
      viewportSize.height,
      minY,
      maxY,
    );

    if (this.enabled) {
      this.moveTween = TweenLite.to(this.target, config.duration || 1, {
        x: this.startPosition.x + moveX,
        y: this.startPosition.y + moveY,
      });
    }
  }
}
