import { DefaultContainer } from '../canvas/default.container';

export interface CanvasDelegator {
  name: string;

  containersUpdated(containers: DefaultContainer[]): void;
  syncContainers(updateViewport: boolean): void;
  renderContainers(): void;
}
