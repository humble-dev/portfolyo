import { Container } from 'pixi.js';

import { TwistFilter } from '@pixi/filter-twist';
import { Tween, easings } from '@smoovy/core';

import { ContainerExtra, ContainerExtraConfig } from '../default.container';
import { fromEvent, Subscription } from 'rxjs';
import { pluck, map, first, skip, tap, startWith, filter, debounceTime } from 'rxjs/operators';

export interface MouseTwistConfig extends ContainerExtraConfig {
  radius: number;
  angle: number;
  duration: number;
  padding: number;
}

export const mouseTwistExtraName = 'mouse-twist';

export class MouseTwist implements ContainerExtra {
  public name = mouseTwistExtraName;
  private enabled = false;
  private filter!: TwistFilter;
  private moved: boolean = false;
  private moveSubscription?: Subscription;
  private lastTween?: Tween;

  public constructor(
    protected target: Container,
  ) {}

  public activate(config: Partial<MouseTwistConfig> = {}) {
    if ( ! this.enabled) {
      this.enabled = true;

      this.filter = new TwistFilter(
        config.radius,
        typeof config.angle === 'number'
          ? (config.angle * Math.PI / 180)
          : undefined,
        config.padding,
      );

      this.target.filters = [
        this.filter,
        ...(this.target.filters || []),
      ];

      fromEvent(window, 'blur')
        .subscribe(() => {
          if (this.lastTween) {
            this.lastTween.stop();
          }

          this.filter.offset.x = -99999;
          this.filter.offset.y = -99999;

          this.moved = false;
        });

      this.moveSubscription = fromEvent<MouseEvent>(window, 'mousemove')
        .pipe(
          tap((position) => {
            if ( ! this.moved) {
              this.filter.offset.x = position.x;
              this.filter.offset.y = position.y;
            }
          }),
          map((event) => {
            this.moved = true;

            return {
              x: event.clientX,
              y: event.clientY,
            };
          }),
        )
        .subscribe(
          (position) => this.handleMouseMove(position, config),
        );
    }
  }

  public deactivate(config: Partial<MouseTwistConfig> = {}) {
    if (this.enabled) {
      this.enabled = false;

      if (this.lastTween) {
        this.lastTween.stop();
      }

      if (this.moveSubscription) {
        this.moveSubscription.unsubscribe();
      }

      this.moved = false;

      if (this.target.filters) {
        this.target.filters = this.target.filters.filter((f) => {
          return f !== this.filter;
        });
      }
    }
  }

  private handleMouseMove(
    position: { x: number, y: number },
    config: Partial<MouseTwistConfig>,
  ) {
    if (this.enabled) {
      if (this.lastTween) {
        this.lastTween.stop();
      }

      this.lastTween = Tween.to(
        {
          x: this.filter.offset.x || 0,
          y: this.filter.offset.y || 0,
        },
        {
          x: position.x,
          y: position.y,
        },
        typeof config.duration === 'number'
          ? config.duration
          : 3000,
        {
          mutate: false,
          easing: easings.Quint.out,
          update: (pos) => {
            this.filter.offset.x = pos.x;
            this.filter.offset.y = pos.y;
          },
        },
      );
    }
  }
}
