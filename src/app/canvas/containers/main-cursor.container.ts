import { fromEvent } from 'rxjs';

import { CursorService, CursorState } from '@/app/services/cursor.service';
import { clamp } from '@/app/utils/math.util';
import { easings, Tween } from '@smoovy/core';

import { DefaultContainer } from '../default.container';
import { MotionBlur } from '../extras/motion-blur.extra';
import { filter } from 'rxjs/operators';

export class MainCursorContainer extends DefaultContainer {
  private service = CursorService.getInstance();
  private outerCircle!: PIXI.Sprite;
  private innerCircle!: PIXI.Sprite;
  private outerMoveTween?: Tween;
  private outerRotationTween?: Tween;
  private mouseMoveResetTimer = -1;
  private lastRotationDiff = 0;
  private outerVelocityTween?: Tween;
  private mousePosition = { x: 0, y: 0 };
  private trackedMousePosition = { x: 0, y: 0 };
  private velocityFrequency = 50;
  private motionBlur?: MotionBlur;
  private cursorSize = 140;
  private innerPointSize = 16;
  private cursorScale = 0.5;
  private locked: boolean = false;
  private stateTweenOuter?: Tween;
  private stateTweenInner?: Tween;
  private currentState: CursorState = CursorState.DEFAULT;
  private stateChangeTimeout = -1;

  public constructor() {
    super(false, 100);
  }

  public init() {
    super.init();

    this.service.position$.subscribe((position) => {
      this.mousePosition.x = position.x;
      this.mousePosition.y = position.y;
      this.trackedMousePosition.x = position.x;
      this.trackedMousePosition.y = position.y;
      this.locked = position.locked;
    });

    this.service.visibility$.subscribe((visible) => {
      this.outerCircle.visible = visible;
      this.innerCircle.visible = visible;
    });

    this.outerCircle = PIXI.Sprite.from('cursor.outer');
    this.outerCircle.cacheAsBitmap = true;
    this.outerCircle.height = this.cursorSize * this.cursorScale;
    this.outerCircle.width = this.cursorSize * this.cursorScale;
    this.outerCircle.anchor.x = 0.5;
    this.outerCircle.anchor.y = 0.5;

    this.innerCircle = PIXI.Sprite.from('cursor.inner');
    this.innerCircle.cacheAsBitmap = true;
    this.outerCircle.height = this.innerPointSize * this.cursorScale;
    this.outerCircle.width = this.innerPointSize * this.cursorScale;
    this.innerCircle.anchor.x = 0.5;
    this.innerCircle.anchor.y = 0.5;

    this.context.addChild(this.innerCircle);
    this.context.addChild(this.outerCircle);

    this.service.state$.subscribe((state) => {
      clearTimeout(this.stateChangeTimeout);
      this.stateChangeTimeout = setTimeout(() => {
        switch (state) {
          case CursorState.DEFAULT:
            if (this.stateTweenOuter) {
              this.stateTweenOuter.stop();
            }

            this.stateTweenOuter = Tween.to(
              {
                width: this.outerCircle.width,
                height: this.outerCircle.width,
                alpha: this.outerCircle.alpha,
              },
              {
                width: this.cursorSize * this.cursorScale,
                height: this.cursorSize * this.cursorScale,
                alpha: 1,
              },
              500,
              {
                update: ({ width, height, alpha }) => {
                  this.outerCircle.width = width;
                  this.outerCircle.height = height;
                  this.outerCircle.alpha = alpha;
                },
                complete: () => {
                  this.currentState = state;
                },
              },
            );

            if (this.stateTweenInner) {
              this.stateTweenInner.stop();
            }

            this.stateTweenInner = Tween.to(
              {
                width: this.innerCircle.width,
                height: this.innerCircle.height,
              },
              {
                width: this.innerPointSize * this.cursorScale,
                height: this.innerPointSize * this.cursorScale,
              },
              500,
              {
                update: ({ width, height }) => {
                  this.innerCircle.width = width;
                  this.innerCircle.height = height;
                },
              },
            );
            break;

          case CursorState.SMALL:
            this.currentState = state;

            if (this.stateTweenOuter) {
              this.stateTweenOuter.stop();
            }

            this.stateTweenOuter = Tween.to(
              {
                width: this.outerCircle.width,
                height: this.outerCircle.width,
                alpha: this.outerCircle.alpha,
              },
              {
                width: this.cursorSize * this.cursorScale * 0.8,
                height: this.cursorSize * this.cursorScale * 0.8,
                alpha: 0,
              },
              500,
              {
                update: ({ width, height, alpha }) => {
                  this.outerCircle.width = width;
                  this.outerCircle.height = height;
                  this.outerCircle.alpha = alpha;
                },
              },
            );

            if (this.stateTweenInner) {
              this.stateTweenInner.stop();
            }

            this.stateTweenInner = Tween.to(
              {
                width: this.innerCircle.width,
                height: this.innerCircle.height,
              },
              {
                width: this.innerPointSize * this.cursorScale * 2,
                height: this.innerPointSize * this.cursorScale * 2,
              },
              500,
              {
                update: ({ width, height }) => {
                  this.innerCircle.width = width;
                  this.innerCircle.height = height;
                },
              },
            );
            break;
        }
      }, 100);
    });

    setInterval(() => {
      if ( ! this.locked) {
        this.trackedMousePosition.x = this.mousePosition.x;
        this.trackedMousePosition.y = this.mousePosition.y;
      }

    }, this.velocityFrequency);

    fromEvent<MouseEvent>(window, 'mousemove')
      .pipe(
        filter(() => !this.locked),
      )
      .subscribe((event) => {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;

        this.updateVelocityScale();

        clearTimeout(this.mouseMoveResetTimer);

        this.mouseMoveResetTimer = setTimeout(
          () => this.updateVelocityScale(),
          this.velocityFrequency,
        );
      });

    this.enableExtras(
      this.context,
      MotionBlur,
    );

    this.enableMotionBlur(true).then((extra) => {
      this.motionBlur = extra;
    });

    this.service.resolveReady();
  }

  private updateVelocityScale() {
    const dX = this.trackedMousePosition.x - this.mousePosition.x;
    const dY = this.trackedMousePosition.y - this.mousePosition.y;
    const velX = clamp(dX * 1.1 / this.velocityFrequency, -10, 10);
    const velY = clamp(dY * 1.1 / this.velocityFrequency, -10, 10);
    const scaleX = clamp(Math.abs(velX), 1, 2);
    const scaleY = clamp(Math.abs(velY), 1, 2);
    const scale = Math.max(scaleX, scaleY);

    if (this.motionBlur) {
      this.motionBlur.setVelocity(
        Math.min(Math.pow(velX, 3) * (velX < 0 ? -1 : 1), 50),
        Math.min(Math.pow(velY, 3) * (velY < 0 ? -1 : 1), 50),
        100,
      );
    }

    const rotation = Math.atan2(dY, dX);
    const lastRotation = this.outerCircle.rotation;
    const rotationDiff = Math.abs(rotation - lastRotation);
    const rotationDelta = Math.abs(rotationDiff - this.lastRotationDiff);

    this.lastRotationDiff = rotationDiff;

    if (this.outerRotationTween) {
      this.outerRotationTween.stop();
    }

    if (this.currentState === CursorState.DEFAULT) {
      if (rotationDelta < 90 * Math.PI / 180) {
        this.outerRotationTween = Tween.to(
          {
            rotation: this.outerCircle.rotation,
          },
          {
            rotation,
          },
          150,
          {
            update: (props) => {
              if (this.currentState === CursorState.DEFAULT) {
                this.outerCircle.rotation = props.rotation;
              }
            },
          },
        );
      } else {
        this.outerCircle.rotation = rotation;
      }
    }

    if (this.outerVelocityTween) {
      this.outerVelocityTween.stop();
    }

    if (this.currentState === CursorState.DEFAULT) {
      this.outerVelocityTween = Tween.to(
        {
          width: this.outerCircle.width,
        },
        {
          width: this.cursorSize * this.cursorScale * scale,
        },
        300,
        {
          update: (size) => {
            setTimeout(() => {
              if (this.currentState === CursorState.DEFAULT) {
                this.outerCircle.width = size.width;
              }
            });
          },
        },
      );
    }
  }

  public render(delta?: number) {
    super.render();

    this.innerCircle.x = this.mousePosition.x;
    this.innerCircle.y = this.mousePosition.y;

    if (this.outerMoveTween) {
      this.outerMoveTween.stop();
    }

    this.outerMoveTween = Tween.to(
      {
        x: this.outerCircle.x,
        y: this.outerCircle.y,
      },
      {
        x: this.mousePosition.x,
        y: this.mousePosition.y,
      },
      200,
      {
        easing: easings.Sine.out,
        update: (position) => {
          this.outerCircle.x = position.x;
          this.outerCircle.y = position.y;
        },
      },
    );
  }

  public sync() {
    super.sync();
  }
}
