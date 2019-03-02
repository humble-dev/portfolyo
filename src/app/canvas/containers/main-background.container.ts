import * as PIXI from 'pixi.js';

import { Parallax } from '../extras/parallax.extra';
import { RelatedContainer } from '../related.container';
import { Displacement } from '../extras/displacement.extra';
import { MotionBlur } from '../extras/motion-blur.extra';

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

    this.context.filters = [
      this.noiseFilter = new PIXI.filters.NoiseFilter(
        0.06,
        Math.random(),
      ),
    ];

    this.enableExtras(
      this.sprite,
      MotionBlur,
      Displacement,
    );

    this.enableExtras(
      this.context,
      Parallax,
    );

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
