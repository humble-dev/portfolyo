import { Container } from 'pixi.js';

import { mapRange } from '@/app/utils/math.util';
import { easings, Tween } from '@smoovy/core';

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
  private enabled = false;
  private startPosition!: { x: number, y: number };
  private globalStartPosition!: { x: number, y: number };
  private initialPosition!: { x: number, y: number };
  private moveListener!: (event: MouseEvent) => void;
  private moveTween?: Tween;
  private backTween?: Tween;

  public constructor(
    protected target: Container,
  ) {}

  public activate(config: Partial<MouseMotionConfig> = {}) {
    if ( ! this.enabled) {
      this.enabled = true;

      if ( ! this.initialPosition) {
        this.initialPosition = {
          x: this.target.x,
          y: this.target.y,
        };
      }

      this.startPosition = {
        x: this.target.x,
        y: this.target.y,
      };

      const globalPosition = this.target.getGlobalPosition();

      this.globalStartPosition = {
        x: globalPosition.x,
        y: globalPosition.y,
      };

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
        this.moveTween.stop();
      }

      this.backTween = Tween.to(
        {
          x: this.target.x,
          y: this.target.y,
        },
        {
          x: this.initialPosition.x,
          y: this.initialPosition.y,
        },
        config.duration || 2000,
        {
          update: (pos) => {
            this.target.x = pos.x;
            this.target.y = pos.y;
          },
        },
      );

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
    if (this.enabled) {
      const minX = config.minX !== undefined ? config.minX : -20;
      const maxX = config.maxX !== undefined ? config.maxX : 20;
      const minY = config.minY !== undefined ? config.minY : -20;
      const maxY = config.maxY !== undefined ? config.maxY : 20;

      const moveX = mapRange(
        event.clientX - this.globalStartPosition.x + this.target.width / 2,
        0,
        this.target.width,
        minX,
        maxX,
      );

      const moveY = mapRange(
        event.clientY - this.globalStartPosition.y + this.target.height / 2,
        0,
        this.target.height,
        minY,
        maxY,
      );

      if (this.backTween) {
        this.backTween.stop();
        this.backTween = undefined;
      }

      if (this.moveTween) {
        this.moveTween.stop();
      }

      this.moveTween = Tween.to(
        {
          x: this.target.x,
          y: this.target.y,
        },
        {
          x: this.startPosition.x + moveX,
          y: this.startPosition.y + moveY,
        },
        config.duration || 2000,
        {
          easing: easings.Expo.out,
          update: (pos) => {
            this.target.x = pos.x;
            this.target.y = pos.y;
          },
        },
      );
    }
  }
}
