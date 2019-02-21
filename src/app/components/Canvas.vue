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

@Component
export default class Canvas extends Vue implements CanvasDelegator {
  private delegator = CanvasDelegatorService.getInstance();
  private webfont = WebfontService.getInstance();
  private viewport = ViewportProvider.getInstance();
  private pixiApp!: PIXI.Application;
  private containers: DefaultContainer[] = [];
  private destroySubject = new Subject<void>();
  private destroy$ = this.destroySubject.asObservable();

  @Prop()
  public name!: string;

  public mounted() {
    if ( !  this.name) {
      throw new Error(
        'You need to specify a name for the canvas delegator',
      );
    }

    this.delegator.register(this);
    this.webfont.loaded.then(() => this.createPixiApp());
  }

  public beforeDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.delegator.deregister(this);
  }

  protected get elementBounds(): ClientRect {
    return this.$el.getBoundingClientRect();
  }

  public containersUpdated(containers: DefaultContainer[]) {
    this.containers = containers;
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
      width: this.elementBounds.width,
      height: this.elementBounds.height,
    });

    this.pixiApp.ticker.add(
      () => this.renderContainers(),
    );

    this.viewport.changed(300)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        setTimeout(() => {
          const bounds = this.$el.getBoundingClientRect();

          this.pixiApp.renderer.resize(
            bounds.width,
            bounds.height,
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
    this.containers.forEach((container) => {
      if ( ! container.initialized) {
        this.updateContainerViewport(container);
        this.initContainer(container);
      }

      container.render();
    });
  }

  protected initContainer(container: DefaultContainer) {
    container.context = this.pixiApp.stage.addChild(
      new PIXI.Container(),
    );

    this.pixiApp.stage.children.sort((a, b) => {
      const cA = this.containers.find((c) => c.context === a);
      const cB = this.containers.find((c) => c.context === b);
      const iA = cA ? cA.index || 0 : 0;
      const iB = cB ? cB.index || 0 : 0;

      return iA - iB;
    });

    container.init();
    container.sync();
  }

  protected updateContainerViewport(container: DefaultContainer) {
    container.viewportSize.width = this.elementBounds.width;
    container.viewportSize.height = this.elementBounds.height;
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
