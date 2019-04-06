declare module "pixi.js/dist/pixi.js" {
  import * as PIXI from 'pixi.js';

  export = PIXI;
}

declare module "*.json" {
  const value: any;
  export default value;
}

declare module NodeJS  {
  interface process {
    browser: boolean;
  }
}
