import { BehaviorSubject } from 'rxjs';
import xhr from 'xhr';

import resourceData from '@/assets/resources.json';

enum ResourceType {
  IMAGE = 'image',
}

interface ResourceData<T extends ResourceType = ResourceType.IMAGE> {
  type: T;
  name: string;
  path: string;
  extras: [ 'pixi' ];
}

export interface Resource {
  url: string;
}

export class ResourceProvider {
  private static instance: ResourceProvider;
  private resourceData: ResourceData[] = resourceData;
  private loadedResources: { [name: string]: Resource } = {};
  private loadedSubject = new BehaviorSubject<boolean>(false);
  public loaded$ = this.loadedSubject.asObservable();
  private progressSubject = new BehaviorSubject<number>(0);
  public progress$ = this.progressSubject.asObservable();

  public static getInstance(): ResourceProvider {
    if ( ! this.instance) {
      return this.instance = new ResourceProvider();
    }

    return this.instance;
  }

  public get(name: string): Resource {
    return this.loadedResources[name];
  }

  public get loaded(): Promise<boolean> {
    return this.loaded$.toPromise();
  }

  public load(): Promise<Resource[]> {
    if (this.loadedSubject.value === true) {
      return Promise.resolve(Object.values(this.loadedResources));
    }

    return new Promise((resolve, reject) => {
      const promises: Array<Promise<Resource>> = [];

      this.resourceData.forEach((data) => {
        if (data.type === ResourceType.IMAGE) {
          const promise = this.loadImageResource(data);

          promise.then((resource) => {
            this.loadedResources[data.name] = resource;

            const loadedSize = Object.keys(this.loadedResources);

            this.progressSubject.next(
              loadedSize.length / this.resourceData.length,
            );
          });

          promises.push(promise);
        }
      });

      Promise.all(promises).then(
        () => {
          resolve();

          this.loadedSubject.next(true);
          this.loadedSubject.complete();
        },
        reject,
      );
    });
  }

  private loadImageResource(data: ResourceData): Promise<Resource> {
    const pixiLoader = new PIXI.loaders.Loader();

    return new Promise((resolve, reject) => {
      xhr.get(data.path, { responseType: 'blob' }, (error, response) => {
        if (response.statusCode === 200 && ! error) {
          const resource = {
            url: URL.createObjectURL(response.body as Blob),
          };

          if (data.extras && data.extras.includes('pixi')) {
            pixiLoader.add(data.name, data.path);
            pixiLoader.load(() => resolve(resource));
          } else {
            resolve(resource);
          }
        } else {
          reject(error);
        }
      });
    });
  }
}
