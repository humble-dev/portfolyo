import * as _smoovy from '@smoovy/core';

declare global {
  export namespace smoovy {
    export class Tween extends _smoovy.Tween {}
    export class Scroller extends _smoovy.Scroller {}
    export class TweenSectionController extends _smoovy.TweenSectionController {}
    export class Ticker extends _smoovy.Ticker {}
    export type Position = _smoovy.Position;
    export const BrowserSupport: typeof _smoovy.BrowserSupport;
    export const easings: typeof _smoovy.easings;
  }
}
