<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as PIXI from 'pixi.js';

import { CanvasDelegatorService } from '@/app/services/canvas-delegator.service';
import { WebfontService } from '@/app/services/webfont.service';
import { CanvasDelegator } from '@/app/interfaces/canvas-delegator.interface';
import { DefaultContainer } from '@/app/canvas/default.container';
import { ViewportProvider } from '@/app/providers/viewport.provider';
import { ScrollerService } from '@/app/services/scroller.service';
import { RelatedContainer } from '@/app/canvas/related.container';
import { ElementState } from '@/app/providers/element-state.provider';

@Component
export default class Canvas extends Vue implements CanvasDelegator {
  private delegator = CanvasDelegatorService.getInstance();
  private scroller = ScrollerService.getInstance();
  private webfont = WebfontService.getInstance();
  private viewport = ViewportProvider.getInstance();
  private pixiApp!: PIXI.Application;
  private containers: DefaultContainer[] = [];
  private destroySubject = new Subject<void>();
  private elementState!: ElementState;
  private destroy$ = this.destroySubject.asObservable();
  private scrollContainer: DefaultContainer = new DefaultContainer(false, 10);

  @Prop()
  public name!: string;

  public mounted() {
    if ( !  this.name) {
      throw new Error(
        'You need to specify a name for the canvas delegator',
      );
    }

    this.elementState = new ElementState(this.$el as HTMLElement);

    this.delegator.register(this);
    this.webfont.loaded.then(() => this.createPixiApp());

    this.scroller.scrollAnimation$.subscribe((state) => {
      this.scrollContainer.context.y = -state.position.y;
      this.scrollContainer.context.x = -state.position.x;

      this.pixiApp.render();
    });
  }

  public beforeDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.delegator.deregister(this);
  }

  public containersUpdated(containers: DefaultContainer[]) {
    this.containers = containers.concat([ this.scrollContainer ]);
  }

  public syncContainers(updateViewport: boolean) {
    this.containers.forEach((container) => {
      if (updateViewport) {
        this.updateContainerViewport(container);
      }

      if (container.initialized) {
        container.sync();
      }
    });
  }

  private createPixiApp() {
    this.pixiApp = new PIXI.Application({
      transparent: true,
      forceFXAA: true,
      autoResize: true,
      powerPreference: 'high-performance',
      view: this.$refs.stage as HTMLCanvasElement,
      width: this.elementState.bounds.width,
      height: this.elementState.bounds.height,
    });

    this.pixiApp.stage.addChild(
      this.scrollContainer.context = new PIXI.Container(),
    );

    this.pixiApp.ticker.add(
      () => this.renderContainers(),
    );

    this.viewport.changed(300)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        setTimeout(() => {
          this.elementState.update();

          this.pixiApp.renderer.resize(
            this.elementState.bounds.width,
            this.elementState.bounds.height,
          );

          this.syncContainers(true);
          setTimeout(() => this.syncContainers(true), 50);
        });
      });
  }

  public renderSync() {
    if (this.pixiApp) {
      this.renderContainers();
      this.pixiApp.render();
    }
  }

  public renderContainers() {
    for (let i = 0, len = this.containers.length; i < len; i++) {
      const container = this.containers[i];

      if ( ! container.initialized) {
        this.updateContainerViewport(container);
        this.initContainer(container);
      }

      container.render();
    }
  }

  protected initContainer(container: DefaultContainer) {
    const parent = container.syncWithScrollPosition
      ? this.scrollContainer
      : { context: this.pixiApp.stage };

    container.context = parent.context.addChild(new PIXI.Container());

    this.sortContainersByIndex(this.pixiApp.stage);
    this.sortContainersByIndex(this.scrollContainer.context);

    container.init();
    container.sync();
  }

  protected sortContainersByIndex(parent: PIXI.Container) {
    parent.children.sort((a, b) => {
      const cA = this.containers.find((c) => c.context === a);
      const cB = this.containers.find((c) => c.context === b);
      const iA = cA ? cA.index || 0 : 0;
      const iB = cB ? cB.index || 0 : 0;

      return iA - iB;
    });
  }

  protected updateContainerViewport(container: DefaultContainer) {
    container.viewportSize.width = this.elementState.bounds.width;
    container.viewportSize.height = this.elementState.bounds.height;
  }
}
</script>

<template>
  <div class="canvas-wrapper" :class="`canvas-wrapper--${name}`">
    <canvas ref="stage"></canvas>
  </div>
</template>

<style scoped lang="scss">
  .canvas-wrapper {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 0;
    right: 0;
    bottom: 0;
  }
</style>
