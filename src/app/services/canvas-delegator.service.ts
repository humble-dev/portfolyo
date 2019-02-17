import { BehaviorSubject, Subscription } from 'rxjs';

import { DefaultContainer } from '../canvas/default.container';
import { CanvasDelegator } from '../interfaces/canvas-delegator.interface';

export class CanvasDelegatorService {
  private static instance: CanvasDelegatorService;
  private delegators: CanvasDelegator[] = [];
  private containerSubscriptions: {
    [name: string]: Subscription,
  } = {};

  private containerSubjects: {
    [name: string]: BehaviorSubject<DefaultContainer[]>,
  } = {};

  public static getInstance(): CanvasDelegatorService {
    if ( ! this.instance) {
      return this.instance = new CanvasDelegatorService();
    }

    return this.instance;
  }

  public addContainer(
    name: string,
    ...containers: DefaultContainer[]
  ) {
    const subject = this.containerSubjects[name];

    subject.next(subject.value.concat(containers));
  }

  public removeContainer(
    name: string,
    container: DefaultContainer,
  ) {
    const subject = this.containerSubjects[name];
    const containers = subject.value;
    const index = containers.indexOf(container);

    if (index > -1) {
      subject.next(containers.splice(index, 1));
    }
  }

  public register(delegator: CanvasDelegator) {
    if (this.containerSubjects.hasOwnProperty(delegator.name)) {
      throw new Error(
        `Delegator with name ${delegator.name} does already exists`,
      );
    }

    const subject = new BehaviorSubject<DefaultContainer[]>([]);

    this.delegators.push(delegator);

    this.containerSubjects[delegator.name] = subject;
    this.containerSubscriptions[delegator.name] = subject.subscribe(
      (containers) => delegator.containersUpdated(containers),
    );
  }

  public deregister(retainer: CanvasDelegator) {
    if (this.containerSubjects.hasOwnProperty(retainer.name)) {
      this.containerSubscriptions[retainer.name].unsubscribe();

      delete this.containerSubscriptions[retainer.name];
      delete this.containerSubjects[retainer.name];
    }

    const index = this.delegators.indexOf(retainer);

    if (index > -1) {
      this.delegators = this.delegators.splice(index, 1);
    }
  }
}
