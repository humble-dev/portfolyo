<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CanvasDelegatorService } from '~~/services/canvas-delegator.service';
import { WebfontService } from '~~/services/webfont.service';
import { CanvasDelegator } from '~~/interfaces/canvas-delegator.interface';
import { DefaultContainer } from '~~/canvas/default.container';
import { ViewportProvider } from '~~/providers/viewport.provider';
import { ScrollerService } from '~~/services/scroller.service';
import { ElementState } from '~~/providers/element-state.provider';

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

  @Prop({ default: true })
  public enabled!: boolean;

  @Prop({ default: 0 })
  public index!: number;

  @Prop()
  public name!: string;

  public mounted() {
    if ( ! this.name) {
      throw new Error(
        'You need to specify a name for the canvas delegator',
      );
    }

    this.elementState = new ElementState(this.$el as HTMLElement);

    if (process.browser && this.enabled) {
      this.delegator.register(this);
      this.webfont.loaded.then(() => {
        this.createPixiApp();

        this.scroller.scrollAnimation$.subscribe((state) => {
          if (this.scrollContainer.initialized) {
            this.scrollContainer.context.y = -state.position.y;
            this.scrollContainer.context.x = -state.position.x;

            for (let i = 0, len = this.containers.length; i < len; i++) {
              const container = this.containers[i];
              const visible = this.isContainerVisible(container);

              if (visible !== container.isVisibile()) {
                container.setVisibility(visible);
              }
            }
          }
        });
      });
    }
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
      autoResize: true,
      resolution: window.devicePixelRatio,
      view: this.$refs.stage as HTMLCanvasElement,
      width: this.elementState.bounds.width,
      height: this.elementState.bounds.height,
    });

    this.pixiApp.stage.addChild(
      this.scrollContainer.context = new PIXI.Container(),
    );

    this.pixiApp.ticker.add(
      (delta) => this.renderContainers(delta),
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

  public renderContainers(delta?: number) {
    for (let i = 0, len = this.containers.length; i < len; i++) {
      const container = this.containers[i];

      if ( ! container.initialized) {
        this.updateContainerViewport(container);
        this.initContainer(container);
      }

      if (container.isVisibile()) {
        container.render(delta);
      }
    }
  }

  private isContainerVisible(container: DefaultContainer) {
    if ( ! container.syncWithScrollPosition) {
      return true;
    }

    const absScrollX = Math.abs(this.scrollContainer.context.x);
    const absScrollY = Math.abs(this.scrollContainer.context.y);

    const padding = container.padding;

    const absPosX = container.context.x - absScrollX;
    const absPosY = container.context.y - absScrollY;

    const visibleX = absPosX - this.viewport.size.width - padding.left < 0 &&
                     absPosX + container.context.width + padding.top > 0;

    const visibleY = absPosY - this.viewport.size.height - padding.top < 0 &&
                     absPosY + container.context.height + padding.bottom > 0;

    return visibleX && visibleY;
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
  <div
    class="canvas-wrapper"
    :class="`canvas-wrapper--${name}`"
    :style="{ zIndex: index }"
  >
    <canvas ref="stage"></canvas>
  </div>
</template>

<style scoped lang="scss">
  .canvas-wrapper {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
</style>
