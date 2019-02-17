import * as PIXI from 'pixi.js';

import { RelatedContainer } from '../related.container';

export class MainBackgroundContainer extends RelatedContainer {
  // protected crtFilter: PIXI.filters.CRTFilter;
  protected sprite!: PIXI.extras.TilingSprite;
  protected texture!: PIXI.Texture;

  public get index() {
    return 0;
  }

  public init() {
    super.init();

    this.texture = PIXI.Texture.fromImage(
      './images/main-background.jpg',
    );

    this.sprite = new PIXI.extras.TilingSprite(
      this.texture,
      this.size.width,
      this.size.height,
    );

    // this.crtFilter = new PIXI.filters.CRTFilter({
    //   curvature: 0.2,
    //   vignetting: 0.2,
    //   vignettingAlpha: 0.3,
    //   verticalLine: 1,
    //   lineWidth: 0.1,
    //   lineContrast: 0.05,
    // });

    this.context.addChild(this.sprite);
  }

  public sync() {
    super.sync();

    this.sprite.width = this.size.width;
    this.sprite.height = this.size.height;
  }
}
