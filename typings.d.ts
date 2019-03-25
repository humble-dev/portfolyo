declare module "pixi.js/dist/pixi.js" {
  import * as PIXI from 'pixi.js';

  export = PIXI;
}

// declare global 'smoovy' {
//   export * from '@smoovy/core';
// }

// declare module Window {
//   smoovy: 'test'
// }
// declare global {

  // export = smoovy;

  // export namespace smoovy {
  //   type test = boolean;
  //   // _smoovy
  // }
// }

// declare module "@pixi/filter-simple-lightmap/lib/filter-simple-lightmap.js" {
//   import * as FilterSimpleLightmap from '@pixi/filter-simple-lightmap';

//   export = FilterSimpleLightmap;
// }

declare module "*.json" {
  const value: any;
  export default value;
}

declare module NodeJS  {
  interface process {
    browser: boolean;
  }
}
