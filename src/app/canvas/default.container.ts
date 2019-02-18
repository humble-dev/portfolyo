import * as PIXI from 'pixi.js';

import { Resolver } from '../utils/promise.util';

export abstract class DefaultContainer {
  private readyResolver: Resolver = new Resolver();
  public context!: PIXI.Container;
  public viewportSize: { width: number, height: number } = {
    width: 0,
    height: 0,
  };

  public get initialized() {
    return !!this.context;
  }

  public get index(): number {
    return -1;
  }

  public get ready(): Promise<void> {
    return this.readyResolver.promise;
  }

  public init() {
    this.readyResolver.resolve();
  }

  public sync() {}
  public render() {}
  public destroy() {}
}
