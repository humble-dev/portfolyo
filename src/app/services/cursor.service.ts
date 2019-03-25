import { BehaviorSubject, Subject } from 'rxjs';

import { Resolver } from '../utils/promise.util';

interface CursorPosition {
  x: number;
  y: number;
  locked: boolean;
}

export enum CursorState {
  DEFAULT = 'default',
  SMALL = 'small',
}

export class CursorService {
  private static instance: CursorService;
  private readyResolver = new Resolver();
  private positionSubject = new Subject<CursorPosition>();
  private visiblitySubject = new Subject<boolean>();
  private stateSubject = new BehaviorSubject<CursorState>(CursorState.DEFAULT);

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

  public updateState(state: CursorState) {
    this.stateSubject.next(state);
  }

  public get state$() {
    return this.stateSubject.asObservable();
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
