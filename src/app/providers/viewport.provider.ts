import { BehaviorSubject, Observable } from 'rxjs';
import { auditTime } from 'rxjs/operators';

export interface ViewportSize {
  width: number;
  height: number;
}

export class ViewportProvider {
  private static instance: ViewportProvider;
  private changeSubject = new BehaviorSubject<ViewportSize>({
    width: process.browser ? window.innerWidth : 0,
    height: process.browser ? window.innerHeight : 0,
  });
  private change$ = this.changeSubject.asObservable();

  public constructor() {
    if (process.browser) {
      window.addEventListener('resize', () => {
        this.changeSubject.next({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      });
    }
  }

  public static getInstance(): ViewportProvider {
    if ( ! this.instance) {
      return this.instance = new ViewportProvider();
    }

    return this.instance;
  }

  public changed(time: number = 0): Observable<ViewportSize> {
    return this.change$.pipe(auditTime(time));
  }

  public get size(): ViewportSize {
    return this.changeSubject
      ? this.changeSubject.value
      : {
        width: process.browser ? window.innerWidth : 0,
        height: process.browser ? window.innerHeight : 0,
      };
  }
}
