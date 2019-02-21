import * as PIXI from 'pixi.js';

import { RelatedContainer } from '../related.container';

export class MainBackgroundContainer extends RelatedContainer {
  protected noiseFilter!: PIXI.filters.NoiseFilter;
  protected sprite!: PIXI.extras.TilingSprite;
  protected texture!: PIXI.Texture;

  public get index() {
    return 0;
  }

  public init() {
    super.init();

    this.texture = PIXI.Texture.from('main.background');

    this.sprite = new PIXI.extras.TilingSprite(
      this.texture,
      this.size.width,
      this.size.height,
    );

    this.sprite.filters = [
      this.noiseFilter = new PIXI.filters.NoiseFilter(
        0.06,
        Math.random(),
      ),
    ];

    this.context.addChild(this.sprite);
  }

  public render() {
    super.render();

    this.noiseFilter.seed = Math.random();
  }

  public sync() {
    super.sync();

    this.sprite.width = this.size.width;
    this.sprite.height = this.size.height;
  }
}
