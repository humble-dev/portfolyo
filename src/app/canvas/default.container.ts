import { ResourceProvider } from '../providers/resource.provider';
import { Resolver } from '../utils/promise.util';
import {
  Displacement, DisplacementConfig, displacementExtraName,
} from './extras/displacement.extra';
import {
  MotionBlur, MotionBlurConfig, motionBlurExtraName,
} from './extras/motion-blur.extra';
import {
  MouseMotion, MouseMotionConfig, mouseMotionExtraName,
} from './extras/mouse-motion.extra';
import {
  MouseTwist, MouseTwistConfig, mouseTwistExtraName,
} from './extras/mouse-twist.extra';
import {
  Parallax, ParallaxConfig, parallaxExtraName,
} from './extras/parallax.extra';
import {
  Visibility, VisibilityConfig, visibilityExtraName,
} from './extras/visibility.extra';

export interface ContainerExtraConfig {}

export interface ContainerExtra {
  name: string;
  activate(config?: Partial<ContainerExtraConfig>): void;
  deactivate(config?: Partial<ContainerExtraConfig>): void;
  render?(delta: number): void;
}

export type ContainerExtraCtor = new (
  target: PIXI.Container,
) => ContainerExtra;

export class DefaultContainer {
  protected resources = ResourceProvider.getInstance();
  protected visibility: boolean = true;
  private readyResolver: Resolver = new Resolver();
  private extraResolvers: { [name: string]: Resolver<ContainerExtra> } = {};
  private resolvedExtras: ContainerExtra[] = [];
  private _context!: PIXI.Container;
  private initializedResolver = new Resolver();
  public padding = { top: 0, bottom: 0, left: 0, right: 0 };
  public viewportSize = { width: 0, height: 0 };

  public constructor(
    public syncWithScrollPosition: boolean = false,
    protected zIndex: number = -1,
  ) {}

  public isInitialized() {
    return this.initializedResolver.promise;
  }

  public get initialized() {
    return !!this.context;
  }

  public set context(context: PIXI.Container) {
    this._context = context;

    this.initializedResolver.resolve();
  }

  public get context() {
    return this._context;
  }

  public get index(): number {
    return this.zIndex;
  }

  public get ready(): Promise<void> {
    return this.readyResolver.promise;
  }

  public init() {
    this.readyResolver.resolve();
  }

  public async enableMotionBlur(
    enabled: boolean,
    config?: Partial<MotionBlurConfig>,
  ) {
    const extra = await this.extra(motionBlurExtraName);

    if (enabled) {
      extra.activate(config);
    } else {
      extra.deactivate(config);
    }

    return extra as MotionBlur;
  }

  public async enableMouseMotion(
    enabled: boolean,
    config?: Partial<MouseMotionConfig>,
  ) {
    const extra = await this.extra(mouseMotionExtraName);

    if (enabled) {
      extra.activate(config);
    } else {
      extra.deactivate(config);
    }

    return extra as MouseMotion;
  }

  public async enableDisplacement(
    enabled: boolean,
    config?: Partial<DisplacementConfig>,
  ) {
    const extra = await this.extra(displacementExtraName);

    if (enabled) {
      extra.activate(config);
    } else {
      extra.deactivate(config);
    }

    return extra as Displacement;
  }

  public async enableVisibility(
    enabled: boolean,
    config?: Partial<VisibilityConfig>,
  ) {
    const extra = await this.extra(visibilityExtraName);

    if (enabled) {
      extra.activate(config);
    } else {
      extra.deactivate(config);
    }

    return extra as Visibility;
  }

  public async enableParallax(
    enabled: boolean,
    config?: Partial<ParallaxConfig>,
  ) {
    const extra = await this.extra(parallaxExtraName);

    if (config && config.speed) {
      if (config.direction && config.direction === 'x') {
        this.padding.left = config.speed;
        this.padding.right = config.speed;
      } else {
        this.padding.top = config.speed;
        this.padding.bottom = config.speed;
      }
    }

    if (enabled) {
      extra.activate(config);
    } else {
      extra.deactivate(config);
    }

    return extra as Parallax;
  }

  public async enableMouseTwist(
    enabled: boolean,
    config?: Partial<MouseTwistConfig>,
  ) {
    const extra = await this.extra(mouseTwistExtraName);

    if (enabled) {
      extra.activate(config);
    } else {
      extra.deactivate(config);
    }

    return extra as MouseTwist;
  }

  public extra(name: string): Promise<ContainerExtra> {
    let resolver = this.extraResolvers[name];

    if ( ! resolver) {
      this.extraResolvers[name] = resolver = new Resolver();
    }

    return resolver.promise;
  }

  public enableExtras(
    target: PIXI.Container,
    ...ctors: ContainerExtraCtor[]
  ) {
    ctors.forEach((ctor) => {
      const extra = new ctor(target);

      if ( ! this.extraResolvers.hasOwnProperty(extra.name)) {
        this.extraResolvers[extra.name] = new Resolver();
      }

      this.extraResolvers[extra.name].resolve(extra);
      this.resolvedExtras.push(extra);
    });
  }

  public setVisibility(visible: boolean) {
    this.visibility = visible;
    this.context.visible = visible;
  }

  public isVisibile() {
    return this.visibility;
  }

  public render(delta: number = 1) {
    for (let i = 0, len = this.resolvedExtras.length; i < len; i++) {
      const extra = this.resolvedExtras[i];
      if (typeof extra.render === 'function') {
        extra.render(delta);
      }
    }
  }

  public sync() {}
  public destroy() {}
}
