<script lang="ts">
import { Component, Vue, Provide } from 'nuxt-property-decorator';

import { ScrollerService } from '~~/services/scroller.service';
import { CursorService, CursorState } from '~~/services/cursor.service';
import { CanvasDelegatorService } from '~~/services/canvas-delegator.service';

import { MainBackgroundContainer } from '~~/canvas/containers/main-background.container';
import { MainCursorContainer } from '~~/canvas/containers/main-cursor.container';

import { ElementStateProvider } from '~~/providers/element-state.provider';
import { ViewportProvider } from '~~/providers/viewport.provider';

import { Browser } from '~~/utils/browser.util';

import Section from '~~/components/Section.vue';
import Canvas from '~~/components/Canvas.vue';
import Preloader from '~~/components/Preloader.vue';
import Scrollbar from '~~/components/layout/Scrollbar.vue';
import Parallax from '~~/components/Parallax.vue';
import Imprint from '~~/components/Imprint.vue';

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
    Imprint,

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
  private imprintEnabled = false;

  @Provide()
  private glConfig = { enabled: false, partially: false };

  private isGlEnabled() {
    if (process.browser) {
      return ! smoovy.BrowserSupport.IS_MOBILE_OR_TABLET &&
        ! smoovy.BrowserSupport.IS_FIREFOX &&
        ! Browser.IS_EDGE &&
        this.viewport.size.width > 768;
    } else {
      return false;
    }
  }

  public created() {
    if (process.browser) {
      this.glConfig.enabled = this.isGlEnabled();
      this.glConfig.partially = smoovy.BrowserSupport.IS_FIREFOX ||
        Browser.IS_EDGE;

      if ( ! this.glConfig.enabled) {
        document.documentElement.classList.add('gl-disabled');
      }

      if (this.glConfig.partially) {
        document.documentElement.classList.add('gl-disabled-partially');
      }

      if (smoovy.BrowserSupport.IS_MOBILE_OR_TABLET) {
        document.documentElement.classList.add('is-mobile');
      }

      if (smoovy.BrowserSupport.IS_TOUCH_DEVICE) {
        document.documentElement.classList.add('is-touch');
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

  private enableImprint(enabled: boolean) {
    this.imprintEnabled = enabled;
  }

  private handleImprintCloseClick(event: Event) {
    event.preventDefault();

    this.enableImprint(false);
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
      <Footer @clickImprint="enableImprint(true)" />
    </div>
    <Preloader />
    <div class="imprint-overlay" :class="{ active: imprintEnabled }">
      <a class="imprint-close" href="#" @click="handleImprintCloseClick">CLOSE</a>
      <div class="imprint-overlay-content">
        <Imprint />
      </div>
    </div>
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

  .imprint-overlay,
  .imprint-overlay * {
    cursor: default !important;
  }

  .imprint-overlay {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 199;
    background-color: rgba($color-black, .5);
    opacity: 0;
    transition: opacity .8s, visibility 0s .8s;
    visibility: hidden;

    &.active {
      visibility: visible;
      opacity: 1;
      transition: opacity .5s;
    }

    .imprint-close {
      position: absolute;
      color: $color-red;
      font-family: $font-neue-haas-medium;
      text-decoration: none;
      right: calc(15% + 15px);
      top: calc(15vh + 15px);
      z-index: 2;
      transform: translate3d(0, -50px, 0);
      opacity: 0;
      transition: opacity .5s .2s, transform .5s .2s;

      @include fluid-size(font-size, 20px, 30px);
    }

    &.active .imprint-close {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    .imprint-overlay-content {
      position: absolute;
      height: 70vh;
      top: 15vh;
      overflow: auto;
      left: 50%;
      max-width: 70%;
      width: 100%;
      background-color: $color-beige;
      opacity: 0;
      transition: transform .5s, opacity .5s;
      transform: translate3d(-50%, 50px, 0);

      @include fluid-size(padding, 30px, 50px);
    }

    &.active .imprint-overlay-content {
      opacity: 1;
      transform: translate3d(-50%, 0, 0);
    }
  }
</style>
