export class Resolver<T = void, E = T> {
  public promise: Promise<T|void>;
  private _resolve!: (value: T|void) => void;
  private _reject!: (error: any) => void;
  private _completed!: boolean;

  public constructor() {
    this.promise = new Promise<T|void>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  public resolve(value?: T|void) {
    if (this._completed) {
      throw new Error('Can\'t resolve promise. Already completed');
    }

    this._completed = true;
    this._resolve(value);
  }

  public reject(value?: E|void) {
    if (this._completed) {
      throw new Error('Can\'t reject promise. Already completed');
    }

    this._completed = true;
    this._reject(value);
  }

  public get completed() {
    return this._completed;
  }
}
