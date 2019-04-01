import { fromEvent, merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CursorService, CursorState } from '~~/services/cursor.service';
import { clamp } from '~~/utils/math.util';

import { DefaultContainer } from '../default.container';
import { Displacement } from '../extras/displacement.extra';
import { MotionBlur } from '../extras/motion-blur.extra';

export class MainCursorContainer extends DefaultContainer {
  private service = CursorService.getInstance();
  private outerCircle!: PIXI.Sprite;
  private innerCircle!: PIXI.Sprite;
  private outerMoveTween?: smoovy.Tween;
  private outerRotationTween?: smoovy.Tween;
  private mouseMoveResetTimer: any;
  private lastRotationDiff = 0;
  private outerVelocityTween?: smoovy.Tween;
  private mousePosition = { x: 0, y: 0 };
  private trackedMousePosition = { x: 0, y: 0 };
  private velocityFrequency = 50;
  private motionBlur?: MotionBlur;
  private cursorSize = 140;
  private innerPointSize = 16;
  private cursorScale = 0.5;
  private locked: boolean = false;
  private stateTweenOuter?: smoovy.Tween;
  private stateTweenInner?: smoovy.Tween;
  private currentState: CursorState = CursorState.DEFAULT;
  private currentStateSync: CursorState = CursorState.DEFAULT;
  private stateChangeTimeout: any;
  private mouseDown = false;
  private mouseDownInnerPrevSize = 0;
  private pointerUpDownTween?: smoovy.Tween;
  private innerCircleDisplacement?: Displacement;

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
    this.outerCircle.height = this.innerPointSize * this.cursorScale;
    this.outerCircle.width = this.innerPointSize * this.cursorScale;
    this.innerCircle.anchor.x = 0.5;
    this.innerCircle.anchor.y = 0.5;

    this.context.addChild(this.innerCircle);
    this.context.addChild(this.outerCircle);

    this.service.state$.subscribe((state) => this.handleStateChange(state));

    setInterval(() => {
      if ( ! this.locked) {
        this.trackedMousePosition.x = this.mousePosition.x;
        this.trackedMousePosition.y = this.mousePosition.y;
      }
    }, this.velocityFrequency);

    if (process.browser) {
      this.attachMouseEvents();
    }

    this.enableExtras(
      this.context,
      MotionBlur,
    );

    this.enableExtras(
      this.innerCircle,
      Displacement
    );

    this.enableDisplacement(true, {
      scaleX: 0,
      scaleY: 0,
      moveSpeedX: .15,
      moveSpeedY: .15,
      padding: 30,
    }).then(displacement => {
      this.innerCircleDisplacement = displacement;
    });

    this.enableMotionBlur(true).then((extra) => {
      this.motionBlur = extra;
    });

    this.service.resolveReady();
  }

  private getStateInnerSize(state?: CursorState) {
    let size = 0;

    switch (state || this.currentStateSync) {
      case CursorState.DEFAULT:
        size = this.innerPointSize * this.cursorScale;
        break;

      case CursorState.SMALL:
        size = this.innerPointSize * this.cursorScale * 2;
        break;
    }

    return size;
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

    const newRotation = Math.atan2(dY, dX);
    const lastRotation = this.outerCircle.rotation;
    const rotationDiff = Math.abs(newRotation - lastRotation);
    const rotationDelta = Math.abs(rotationDiff - this.lastRotationDiff);

    this.lastRotationDiff = rotationDiff;

    if (this.outerRotationTween) {
      this.outerRotationTween.stop();
    }

    if (rotationDelta < 90 * Math.PI / 180) {
      if (smoovy) {
        this.outerRotationTween = smoovy.Tween.to(
          {
            rotation: this.outerCircle.rotation,
          },
          {
            rotation: newRotation,
          },
          150,
          {
            update: ({ rotation }) => {
              this.outerCircle.rotation = rotation;
            },
          },
        );
      }
    } else {
      this.outerCircle.rotation = newRotation;
    }

    if (this.outerVelocityTween) {
      this.outerVelocityTween.stop();
    }

    if (smoovy) {
      this.outerVelocityTween = smoovy.Tween.to(
        {
          width: this.outerCircle.width,
        },
        {
          width: this.cursorSize * this.cursorScale * scale,
        },
        300,
        {
          update: (size) => {
            if (this.currentState === CursorState.DEFAULT) {
              this.outerCircle.width = size.width;
            }
          },
        },
      );
    }
  }

  public render() {
    super.render();

    this.innerCircle.x = this.mousePosition.x;
    this.innerCircle.y = this.mousePosition.y;

    if (this.outerMoveTween) {
      this.outerMoveTween.stop();
    }

    if (smoovy) {
      this.outerMoveTween = smoovy.Tween.to(
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
          easing: smoovy.easings.Sine.out,
          update: (position) => {
            this.outerCircle.x = position.x;
            this.outerCircle.y = position.y;
          },
        },
      );
    }
  }

  private attachMouseEvents() {
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

    fromEvent<MouseEvent>(window, 'mousedown')
      .pipe(filter(() => this.innerCircle.visible))
      .subscribe(() => {
        this.mouseDown = true;
        this.mouseDownInnerPrevSize = this.getStateInnerSize();

        if (smoovy) {
          if (this.pointerUpDownTween) {
            this.pointerUpDownTween.stop();
          }

          if (this.innerCircleDisplacement) {
            this.innerCircleDisplacement.scaleFilter(20, 20, 150);
          }

          this.pointerUpDownTween = smoovy.Tween.to(
            {
              width: this.innerCircle.width,
              height: this.innerCircle.height
            },
            {
              width: this.innerPointSize * this.cursorScale * 2.4,
              height: this.innerPointSize * this.cursorScale * 2.4
            },
            300,
            {
              update: ({ width, height }) => {
                this.innerCircle.width = width;
                this.innerCircle.height = height;
              }
            }
          );
        }
      });

    merge(
      fromEvent<MouseEvent>(window, 'mouseup'),
      fromEvent<MouseEvent>(window, 'mousecancel'),
    )
    .pipe(filter(() => this.innerCircle.visible))
    .subscribe(() => {
        this.mouseDown = false;

        if (smoovy) {
          this.mouseDownInnerPrevSize = this.getStateInnerSize();

          if (this.pointerUpDownTween) {
            this.pointerUpDownTween.stop();
          }

          if (this.innerCircleDisplacement &&
              this.currentStateSync === CursorState.DEFAULT) {
            this.innerCircleDisplacement.scaleFilter(0, 0, 200);
          }

          this.pointerUpDownTween = smoovy.Tween.to(
            {
              width: this.innerCircle.width,
              height: this.innerCircle.height
            },
            {
              width: this.mouseDownInnerPrevSize,
              height: this.mouseDownInnerPrevSize
            },
            300,
            {
              update: ({ width, height }) => {
                this.innerCircle.width = width;
                this.innerCircle.height = height;
              },
            }
          );
        }
      });
  }

  private handleStateChange(state: CursorState) {
    this.currentStateSync = state;

    clearTimeout(this.stateChangeTimeout);
    this.stateChangeTimeout = setTimeout(() => {
      if (smoovy) {
        switch (state) {
          case CursorState.DEFAULT:
            if (this.stateTweenOuter) {
              this.stateTweenOuter.stop();
            }

            if (this.innerCircleDisplacement) {
              this.innerCircleDisplacement.scaleFilter(0, 0, 200);
            }

            this.stateTweenOuter = smoovy.Tween.to(
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

            if (this.pointerUpDownTween) {
              this.pointerUpDownTween.stop();
            }

            const innerSize = this.getStateInnerSize(state);

            if ( ! this.mouseDown) {
              this.stateTweenInner = smoovy.Tween.to(
                {
                  width: this.innerCircle.width,
                  height: this.innerCircle.height,
                },
                {
                  width: innerSize,
                  height: innerSize,
                },
                500,
                {
                  update: ({ width, height }) => {
                    this.innerCircle.width = width;
                    this.innerCircle.height = height;
                  },
                },
              );
            } else {
              this.mouseDownInnerPrevSize = innerSize;
            }
            break;

          case CursorState.SMALL:
            this.currentState = state;

            if (this.innerCircleDisplacement) {
              this.innerCircleDisplacement.scaleFilter(40, 40, 200);
            }

            if (this.stateTweenOuter) {
              this.stateTweenOuter.stop();
            }

            if (this.pointerUpDownTween) {
              this.pointerUpDownTween.stop();
            }

            this.stateTweenOuter = smoovy.Tween.to(
              {
                alpha: this.outerCircle.alpha,
              },
              {
                alpha: 0,
              },
              500,
              {
                update: ({ alpha }) => {
                  this.outerCircle.alpha = alpha;
                },
              },
            );

            if (this.stateTweenInner) {
              this.stateTweenInner.stop();
            }

            const innerSizeSmall = this.getStateInnerSize(state);

            if ( ! this.mouseDown) {
              this.stateTweenInner = smoovy.Tween.to(
                {
                  width: this.innerCircle.width,
                  height: this.innerCircle.height,
                },
                {
                  width: innerSizeSmall,
                  height: innerSizeSmall,
                },
                500,
                {
                  update: ({ width, height }) => {
                    this.innerCircle.width = width;
                    this.innerCircle.height = height;
                  },
                },
              );
            } else {
              this.mouseDownInnerPrevSize = innerSizeSmall;
            }
            break;
        }
      }
    }, 100);
  }
}
