import * as PIXI from 'pixi.js';

import { ResourceProvider } from '../providers/resource.provider';
import { Resolver } from '../utils/promise.util';
import { DisplacementConfig, displacementExtraName } from './extras/displacement.extra';
import { VisibilityConfig, visibilityExtraName } from './extras/visibility.extra';
import { MouseMotionConfig, mouseMotionExtraName } from './extras/mouse-motion.extra';
import { ParallaxConfig, parallaxExtraName } from './extras/parallax.extra';

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

  public enableMouseMotion(
    enabled: boolean,
    config?: Partial<MouseMotionConfig>,
  ) {
    this.extra(mouseMotionExtraName).then((extra) => {
      if (enabled) {
        extra.activate(config);
      } else {
        extra.deactivate(config);
      }
    });
  }

  public enableDisplacement(
    enabled: boolean,
    config?: Partial<DisplacementConfig>,
  ) {
    this.extra(displacementExtraName).then((extra) => {
      if (enabled) {
        extra.activate(config);
      } else {
        extra.deactivate(config);
      }
    });
  }

  public enableVisibility(
    enabled: boolean,
    config?: Partial<VisibilityConfig>,
  ) {
    this.extra(visibilityExtraName).then((extra) => {
      if (enabled) {
        extra.activate(config);
      } else {
        extra.deactivate(config);
      }
    });
  }

  public enableParallax(
    enabled: boolean,
    config?: Partial<ParallaxConfig>,
  ) {
    this.extra(parallaxExtraName).then((extra) => {
      if (enabled) {
        extra.activate(config);
      } else {
        extra.deactivate(config);
      }
    });
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
  public render() {}
  public destroy() {}
}
