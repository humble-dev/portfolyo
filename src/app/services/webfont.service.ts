import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import * as _WebFont from 'webfontloader';

export class WebfontService {
  private static instance: WebfontService;
  private loadedSubject = new BehaviorSubject<boolean>(false);
  public loaded$: Observable<boolean> = this.loadedSubject.asObservable();
  private customFonts: string[] = [
    'Neue Plak Extended Bold',
    'Neue Plak Extended ExtraBlack',
  ];

  public static getInstance(): WebfontService {
    if ( ! this.instance) {
      return this.instance = new WebfontService();
    }

    return this.instance;
  }

  public constructor() {
    if (process.browser) {
      const WebFont = require('webfontloader') as typeof _WebFont;

      WebFont.load({
        custom: {
          families: this.customFonts,
        },
        active: () => this.loadedSubject.next(true),
      });
    }
  }

  public get loaded(): Promise<any> {
    return this.loaded$.pipe(
      filter((loaded) => loaded),
      take(1),
    ).toPromise();
  }
}
