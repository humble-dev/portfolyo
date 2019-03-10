import * as PIXI from 'pixi.js';

import { ResourceProvider } from '../providers/resource.provider';
import { Resolver } from '../utils/promise.util';
import { DisplacementConfig, displacementExtraName, Displacement } from './extras/displacement.extra';
import { VisibilityConfig, visibilityExtraName, Visibility } from './extras/visibility.extra';
import { MouseMotionConfig, mouseMotionExtraName, MouseMotion } from './extras/mouse-motion.extra';
import { ParallaxConfig, parallaxExtraName, Parallax } from './extras/parallax.extra';
import { MotionBlurConfig, MotionBlur, motionBlurExtraName } from './extras/motion-blur.extra';
import { MouseTwistConfig, mouseTwistExtraName, MouseTwist } from './extras/mouse-twist.extra';

export interface ContainerExtraConfig {}

export interface ContainerExtra {
  name: string;
  activate(config?: Partial<ContainerExtraConfig>): void;
  deactivate(config?: Partial<ContainerExtraConfig>): void;
}

export type ContainerExtraCtor = new (
  target: PIXI.Container,
) => ContainerExtra;

export class DefaultContainer {
  protected resources = ResourceProvider.getInstance();
  private readyResolver: Resolver = new Resolver();
  private extraResolvers: { [name: string]: Resolver<ContainerExtra> } = {};
  public context!: PIXI.Container;
  public viewportSize = { width: 0, height: 0 };

  public constructor(
    public syncWithScrollPosition: boolean = false,
    protected zIndex: number = -1,
  ) {

  }

  public get initialized() {
    return !!this.context;
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

  protected enableExtras(
    target: PIXI.Container,
    ...ctors: ContainerExtraCtor[]
  ) {
    ctors.forEach((ctor) => {
      const extra = new ctor(target);

      if ( ! this.extraResolvers.hasOwnProperty(extra.name)) {
        this.extraResolvers[extra.name] = new Resolver();
      }

      this.extraResolvers[extra.name].resolve(extra);
    });
  }

  public sync() {}
  public render(delta?: number) {}
  public destroy() {}
}
