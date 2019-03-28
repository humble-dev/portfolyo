<script lang="ts">
import { Component, Vue, Provide } from 'nuxt-property-decorator';

import { ScrollerService } from '~~/services/scroller.service';
import { CursorService, CursorState } from '~~/services/cursor.service';
import { CanvasDelegatorService } from '~~/services/canvas-delegator.service';

import { MainBackgroundContainer } from '~~/canvas/containers/main-background.container';
import { MainCursorContainer } from '~~/canvas/containers/main-cursor.container';

import { ElementStateProvider } from '~~/providers/element-state.provider';
import { ViewportProvider } from '~~/providers/viewport.provider';

import Section from '~~/components/Section.vue';
import Canvas from '~~/components/Canvas.vue';
import Preloader from '~~/components/Preloader.vue';
import Scrollbar from '~~/components/layout/Scrollbar.vue';
import Parallax from '~~/components/Parallax.vue';

import Header from '~~/components/layout/Header.vue';
import Footer from '~~/components/layout/Footer.vue';

@Component({
  components: {
    /** Main */
    Scrollbar,
    Canvas,
    Section,
    Preloader,
    Parallax,

    /** Layout */
    Footer,
    Header,
  },
})
export default class App extends Vue {
  private scrollerService = ScrollerService.getInstance();
  private canvasDelegator = CanvasDelegatorService.getInstance();
  private viewport = ViewportProvider.getInstance();
  private scroller = ScrollerService.getInstance();
  private cursor = CursorService.getInstance();

  @Provide()
  private glConfig = { enabled: false };

  private isGlEnabled() {
    if (process.browser) {
      return ! smoovy.BrowserSupport.IS_MOBILE_OR_TABLET &&
        this.viewport.size.width > 768;
    } else {
      return false;
    }
  }

  public created() {
    this.glConfig.enabled = this.isGlEnabled();

    if ( ! this.glConfig.enabled) {
      if (process.browser) {
        document.documentElement.classList.add('gl-disabled');
      }
    }
  }

  public mounted() {
    if (process.browser) {
      PIXI.utils.skipHello();

      smoovy.Ticker.override = true;
      PIXI.ticker.shared.add((delta) => {
        if (smoovy) {
          smoovy.Ticker.tick(delta);
        }
      });

      // Prevent from tab scrolling
      document.addEventListener('keydown', (event) => {
        if (event.keyCode === 9) {
          event.preventDefault();
        }
      });
    }

    // Enable scroller
    this.scrollerService.setRootElement(
      this.$refs.contentWrapper as HTMLElement,
    );

    // Add custom cursoir
    this.canvasDelegator.addContainer(
      'foreground',
      new MainCursorContainer()
    );

    // Manage element states
    ElementStateProvider.update();
    setTimeout(() => ElementStateProvider.update());

    this.viewport.changed(200).subscribe(() => {
      ElementStateProvider.update();
    });

    // Update scroller once
    setTimeout(() => this.scrollerService.update(), 100);

    // Link hover controlling
    if (process.browser) {
      Array.from(document.querySelectorAll('a')).forEach((node) => {
        node.addEventListener('mouseenter', () => {
          let leaveListener: any;

          this.cursor.updateState(CursorState.SMALL);

          node.addEventListener(
            'mouseleave',
            leaveListener = () => {
              this.cursor.updateState(CursorState.DEFAULT);

              node.removeEventListener('mouseleave', leaveListener);
            },
            false,
          );
        }, false);
      });
    }
  }
}
</script>

<template>
  <div class="page-wrapper">
    <Scrollbar></Scrollbar>
    <Header></Header>
    <no-ssr>
      <Canvas
        :enabled="glConfig.enabled"
        :index="0"
        v-show="glConfig.enabled"
        name="background"
      />
      <Canvas
        :enabled="glConfig.enabled"
        v-show="glConfig.enabled"
        :index="200"
        name="foreground"
      />
    </no-ssr>
    <div class="content-wrapper" ref="contentWrapper">
      <nuxt />
      <Footer />
    </div>
    <Preloader />
  </div>
</template>

<style lang="scss">
  html:not(.gl-disabled).hide-cursor {
    cursor: none;

    * {
      cursor: none !important;
    }
  }

  html:not(.preloader-ready) .canvas-wrapper {
    visibility: hidden;
  }

  .page-wrapper {
    background-color: $color-beige;
  }

  .circle-wrapper {
    cursor: pointer;
  }

  .page-wrapper {
    display: block;
    height: 100%;
    width: 100%;
  }

  .content-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 1;
  }
</style>
