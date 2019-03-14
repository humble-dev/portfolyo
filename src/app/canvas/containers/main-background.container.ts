import * as PIXI from 'pixi.js';

import { DefaultContainer } from '../default.container';

export class MainBackgroundContainer extends DefaultContainer {
  protected noiseFilter!: PIXI.filters.NoiseFilter;
  protected sprite!: PIXI.extras.TilingSprite;
  protected texture!: PIXI.Texture;

  public constructor() {
    super(false, 0);
  }

  public init() {
    super.init();

    this.texture = PIXI.Texture.from('main.background');
    this.sprite = new PIXI.extras.TilingSprite(
      this.texture,
      this.viewportSize.width,
      this.viewportSize.height,
    );

    // this.context.filters = [
    //   this.noiseFilter = new PIXI.filters.NoiseFilter(
    //     0.06,
    //     Math.random(),
    //   ),
    // ];

    // this.enableExtras(
    //   this.context,
    //   Parallax,
    // );

    this.context.addChild(this.sprite);
  }

  public render() {
    super.render();

    // this.noiseFilter.seed = Math.random();
  }

  public sync() {
    super.sync();

    this.sprite.width = this.viewportSize.width;
    this.sprite.height = this.viewportSize.height;
  }
}
