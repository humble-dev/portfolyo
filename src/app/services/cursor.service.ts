import { Subject } from 'rxjs';
import { Resolver } from '../utils/promise.util';

interface CursorPosition {
  x: number;
  y: number;
  locked: boolean;
}

export class CursorService {
  private readyResolver = new Resolver();
  private positionSubject = new Subject<CursorPosition>();
  private visiblitySubject = new Subject<boolean>();
  private static instance: CursorService;

  public static getInstance(): CursorService {
    if ( ! this.instance) {
      return this.instance = new CursorService();
    }

    return this.instance;
  }

  public setPosition(
    x: number,
    y: number,
    locked: boolean = false,
  ) {
    this.positionSubject.next({ x, y, locked });
  }

  public hide() {
    this.visiblitySubject.next(false);
  }

  public show() {
    this.visiblitySubject.next(true);
  }

  public resolveReady() {
    this.readyResolver.resolve();
  }

  public get position$() {
    return this.positionSubject.asObservable();
  }

  public get ready() {
    return this.readyResolver.promise;
  }

  public get visibility$() {
    return this.visiblitySubject.asObservable();
  }
}
