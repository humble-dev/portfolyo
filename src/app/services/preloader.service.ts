import { Resolver } from '../utils/promise.util';

export class PreloaderService {
  private static instance: PreloaderService;
  private loadedResolver = new Resolver();

  public static getInstance(): PreloaderService {
    if ( ! this.instance) {
      return this.instance = new PreloaderService();
    }

    return this.instance;
  }

  public resolveLoaded() {
    this.loadedResolver.resolve();
  }

  public get loaded() {
    return this.loadedResolver.promise;
  }
}
