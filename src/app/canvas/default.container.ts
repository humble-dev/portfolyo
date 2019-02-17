import * as PIXI from 'pixi.js';

export abstract class DefaultContainer {
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

  public init() {}
  public sync() {}
  public render() {}
  public destroy() {}
}
