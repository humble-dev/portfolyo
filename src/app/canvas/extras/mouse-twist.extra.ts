import { fromEvent, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import * as _twistFilter from '@pixi/filter-twist';

import { ContainerExtra, ContainerExtraConfig } from '../default.container';

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
  private filter!: _twistFilter.TwistFilter;
  private moved: boolean = false;
  private moveSubscription?: Subscription;
  private lastTween?: smoovy.Tween;

  public constructor(
    protected target: PIXI.Container,
  ) {}

  public activate(config: Partial<MouseTwistConfig> = {}) {
    if ( ! this.enabled) {
      this.enabled = true;

      if (process.browser) {
        const twistFilter = require(
          '@pixi/filter-twist'
        ) as typeof _twistFilter;

        this.filter = new twistFilter.TwistFilter(
          config.radius,
          typeof config.angle === 'number'
            ? (config.angle * Math.PI / 180)
            : undefined,
          config.padding || 20,
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

      if (process.browser) {
        this.lastTween = smoovy.Tween.to(
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
            easing: smoovy.easings.Quint.out,
            update: (pos) => {
              this.filter.offset.x = pos.x;
              this.filter.offset.y = pos.y;
            },
          },
        );
      }
    }
  }
}
