import { fromEvent } from 'rxjs';

import { easings, Tween } from '@smoovy/core';

import { DefaultContainer } from '../default.container';
import { Displacement } from '../extras/displacement.extra';
import { clamp } from '@/app/utils/math.util';
import { MotionBlur } from '../extras/motion-blur.extra';

export class MainCursorContainer extends DefaultContainer {
  private outerCircleCanvas!: HTMLCanvasElement;
  private outerCircleContext!: CanvasRenderingContext2D;
  private outerCircleTexture!: PIXI.Texture;
  private outerCircle!: PIXI.Sprite;
  private innerCircleCanvas!: HTMLCanvasElement;
  private innerCircleContext!: CanvasRenderingContext2D;
  private innerCircleTexture!: PIXI.Texture;
  private innerCircle!: PIXI.Sprite;
  private outerMoveTween?: Tween;
  private innerMoveTween?: Tween;
  private outerRotationTween?: Tween;
  private mouseMoveResetTimer = -1;
  private lastRotationDiff = 0;
  private outerVelocityTween?: Tween;
  private mousePosition = { x: 0, y: 0 };
  private trackedMousePosition = { x: 0, y: 0 };
  private velocityFrequency = 50;
  private cursorColor = '#ff0d00';
  private motionBlur?: MotionBlur;
  private cursorSize = 90;
  private cursorScale = .8;
  private strokeSize = 2;

  private outerPath = `
    m1,46c0,-24.86188
    20.13812,-45
    45,-45c24.86188,0
    45,20.13812
    45,45c0,24.86188
    -20.13812,45
    -45,45c-24.86188,0
    -45,-20.13812
    -45,-45z
  `;

  private innerPath = `
    m1,46c0,-24.861878
    20.138122,-45
    45,-45c24.861878,0
    45,20.138122
    45,45c0,24.861878
    -20.138122,45
    -45,45c-24.861878,0
    -45,-20.138122
    -45,-45z
  `;

  public constructor() {
    super(false, 100);
  }

  public init() {
    super.init();

    // Outer circle
    this.outerCircleCanvas = document.createElement('canvas');
    this.outerCircleCanvas.width = this.cursorSize + this.strokeSize;
    this.outerCircleCanvas.height = this.cursorSize + this.strokeSize;
    this.outerCircleContext = this.outerCircleCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.outerCircleTexture = PIXI.Texture.fromCanvas(this.outerCircleCanvas);
    this.outerCircle = new PIXI.Sprite(this.outerCircleTexture);
    this.outerCircle.cacheAsBitmap = true;

    // Inncer circle
    this.innerCircleCanvas = document.createElement('canvas');
    this.innerCircleCanvas.width = this.cursorSize + this.strokeSize;
    this.innerCircleCanvas.height = this.cursorSize + this.strokeSize;
    this.innerCircleContext = this.innerCircleCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.innerCircleTexture = PIXI.Texture.fromCanvas(this.innerCircleCanvas);
    this.innerCircle = new PIXI.Sprite(this.innerCircleTexture);
    this.innerCircle.cacheAsBitmap = true;

    this.context.addChild(this.innerCircle);
    this.context.addChild(this.outerCircle);

    this.drawCircles();

    setInterval(() => {
      this.trackedMousePosition.x = this.mousePosition.x;
      this.trackedMousePosition.y = this.mousePosition.y;

    }, this.velocityFrequency);

    fromEvent<MouseEvent>(window, 'mousemove').subscribe((event) => {
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
            this.outerCircle.rotation = props.rotation;
          },
        },
      );
    } else {
      this.outerCircle.rotation = rotation;
    }

    if (this.outerVelocityTween) {
      this.outerVelocityTween.stop();
    }

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
            this.outerCircle.width = size.width;
          });
        },
      },
    );
  }

  private drawCircles() {
    this.outerCircleContext.clearRect(
      0,
      0,
      this.outerCircleCanvas.width,
      this.outerCircleCanvas.height,
    );

    this.innerCircleContext.clearRect(
      0,
      0,
      this.innerCircleCanvas.width,
      this.innerCircleCanvas.height,
    );

    this.outerCircleContext.strokeStyle = this.cursorColor;
    this.outerCircleContext.lineWidth = this.strokeSize;
    this.outerCircleContext.stroke(new Path2D(this.outerPath));
    this.outerCircleTexture.update();

    this.outerCircle.height = this.cursorSize * this.cursorScale;
    this.outerCircle.width = this.cursorSize * this.cursorScale;

    this.innerCircleContext.fillStyle = this.cursorColor;
    this.innerCircleContext.fill(new Path2D(this.innerPath));
    this.innerCircleTexture.update();
    this.innerCircle.scale.set(.1);

    this.innerCircle.anchor.x = 0.5;
    this.innerCircle.anchor.y = 0.5;

    this.outerCircle.anchor.x = 0.5;
    this.outerCircle.anchor.y = 0.5;
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
