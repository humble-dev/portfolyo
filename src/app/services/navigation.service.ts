import { BehaviorSubject, Observable, Subject } from 'rxjs';

export class NavigationService {
  private static instance: NavigationService;
  private activeSectionsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public activeSections$: Observable<string[]>;
  private sectionScrollRequestsSubject: Subject<string> = new Subject<string>();
  public sectionScrollRequests$: Observable<string>;

  public constructor() {
    this.activeSections$ = this.activeSectionsSubject.asObservable();
    this.sectionScrollRequests$ = this.sectionScrollRequestsSubject.asObservable();
  }

  public static getInstance(): NavigationService {
    if ( ! this.instance) {
      return this.instance = new NavigationService();
    }

    return this.instance;
  }

  public enableSection(
    name: string,
    enabled: boolean,
  ) {
    const value = this.activeSectionsSubject.value;
    const includes = value.includes(name);

    if (enabled && ! includes) {
      this.activeSectionsSubject.next(value.concat([ name ]));
    } else if ( ! enabled && includes) {
      const index = value.indexOf(name);

      value.splice(index, 1);

      this.activeSectionsSubject.next(value);
    }
  }

  public requestSectionScroll(name: string) {
    this.sectionScrollRequestsSubject.next(name);
  }
}
