<script lang="ts">
import { Component, Vue, Inject } from 'nuxt-property-decorator';

import { clamp } from '~~/utils/math.util';
import { ViewportProvider } from '~~/providers/viewport.provider';
import { ScrollerService } from '~~/services/scroller.service';
import { PreloaderService } from '~~/services/preloader.service';
import { CanvasDelegatorService } from '~~/services/canvas-delegator.service';
import {
  RelatedTextContainer,
  RelatedTextContainerConfig,
  RelatedTextContainerStretch,
} from '~~/canvas/containers/related-text.container';

import Section from '../Section.vue';
import Parallax from '../Parallax.vue';

@Component({
  components: {
    Section,
    Parallax,
  },
})
export default class IntroSection extends Vue {
  private preloader = PreloaderService.getInstance();
  private viewport = ViewportProvider.getInstance();
  private canvasDelegator = CanvasDelegatorService.getInstance();
  private scroller = ScrollerService.getInstance();

  @Inject('glConfig')
  private glConfig!: { enabled: boolean };

  public mounted() {
    const headlineConfig: Partial<RelatedTextContainerConfig> = {
      fontSize: 300,
      fill: 0x00000,
      fontFamily: 'Neue Plak Extended ExtraBlack',
      stretchMode: RelatedTextContainerStretch.FIT_HEIGHT,
    };

    const text1 = new RelatedTextContainer(
      this.$refs.desLine1 as HTMLElement,
      'INTERACTIVE',
      {
        ...headlineConfig,
      },
    );

    const text2 = new RelatedTextContainer(
      this.$refs.desLine2 as HTMLElement,
      'DEVELOPER',
      {
        ...headlineConfig,
      },
    );

    const moveSpeed = .5;
    const minDisplacement = 6;
    const maxDisplacement = 20;

    text1.enableParallax(true, { speed: -100, direction: 'x' });
    text1.enableDisplacement(
      true,
      {
        scaleX: minDisplacement,
        scaleY: minDisplacement,
        moveSpeedX: moveSpeed,
        moveSpeedY: moveSpeed,
      },
    ).then((extra) => {
      this.scroller.scrollAnimation$.subscribe((state) => {
        const scaleValue = clamp(
          state.position.y / 5,
          minDisplacement,
          maxDisplacement,
        );

        extra.scaleFilter(
          scaleValue,
          scaleValue,
          0,
        );
      });
    });

    text2.enableParallax(true, { speed: 150, direction: 'x' });
    text2.enableDisplacement(
      true,
      {
        scaleX: minDisplacement,
        scaleY: minDisplacement,
        moveSpeedX: moveSpeed,
        moveSpeedY: moveSpeed,
      },
    ).then((extra) => {
      this.scroller.scrollAnimation$.subscribe((state) => {
        const scaleValue = clamp(
          state.position.y / 5,
          minDisplacement,
          maxDisplacement,
        );

        extra.scaleFilter(
          scaleValue,
          scaleValue,
          0,
        );
      });
    });

    text1.enableVisibility(false);
    text2.enableVisibility(false);

    if (this.glConfig.enabled) {
      this.preloader.loaded.then(() => {
        setTimeout(() => {
          const moveX1 = this.viewport.size.width * 0.15;
          const moveX2 = this.viewport.size.width * 0.15;
          const textX1 = text1.context.x;
          const textX2 = text2.context.x;

          text1.context.x += moveX1;
          text2.context.x -= moveX2;

          text1.enableVisibility(true, { duration: 1800 });

          if (process.browser) {
            smoovy.Tween.to({ x: 0 }, { x: moveX1 }, 3000, {
              easing: smoovy.easings.Expo.out,
              update: (pos) => {
                text1.context.x = textX1 + moveX1 - pos.x;
              },
            });
          }

          setTimeout(() => {
            text2.enableVisibility(true, { duration: 1800 });

            if (process.browser) {
              smoovy.Tween.to({ x: 0 }, { x: moveX2 }, 3000, {
                easing: smoovy.easings.Expo.out,
                update: (pos) => {
                  text2.context.x = textX2 - moveX2 + pos.x;
                },
              });
            }
          }, 200);
        }, 500);
      });
    }

    this.canvasDelegator.addContainer('background', text1, text2);
  }
}
</script>

<template>
  <Section name="intro" class="intro-wrapper">
    <div class="fg-row">
      <p class="teaser-text upper fg-col-xs-18 fg-col-lg-3 fg-col-lg-offset-1">
        <no-ssr>
          <Parallax v-bind:speed="glConfig.enabled ? -100 : -50" class="line">
            <span>Available</span>
          </Parallax>
          <Parallax v-bind:speed="glConfig.enabled ? -100 : -50" class="line">
            <span>for exciting</span>
          </Parallax>
          <Parallax v-bind:speed="glConfig.enabled ? -100 : -50" class="line">
            <span>Freelance</span>
          </Parallax>
          <Parallax v-bind:speed="glConfig.enabled ? -100 : -50" class="line">
            <span>projects</span>
          </Parallax>
        </no-ssr>
      </p>
      <div
        ref="desLine1"
        class="desline desline-1 fg-col-xs-18 fg-col-lg-13"
      >
        <Parallax
          v-show="!glConfig.enabled"
          v-bind="{
            speed: -150,
            direction: 'x'
          }"
        >Interactive</Parallax>
      </div>
    </div>
    <div class="fg-row">
      <div
        ref="desLine2"
        class="desline desline-2 fg-col-xs-18"
      >
        <Parallax
          v-show="!glConfig.enabled"
          v-bind="{
            speed: 100,
            direction: 'x'
          }"
        >Developer</Parallax>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
  .desline {
    .gl-disabled & {
      opacity: 0;
      transition:
        transform 1.2s .5s $ease-out-smooth,
        opacity .8s .5s;
    }

    &-1.desline,
    &-2.desline {
      .gl-disabled.preloader-loaded & {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
  }

  .teaser-text {
    @include responsive-width($break-lg) {
      text-align: right;
      display: block;
      padding-right: 10px;
    }

    .line {
      display: block;
      overflow: hidden;

      @for $i from 1 through 8 {
        &:nth-child(#{$i}) span {
          transition-delay: 100ms * $i;
        }
      }
    }

    .line span {
      display: block;
      opacity: 0;
      transform: translate3d(0, 100%, 0);
      transition:
        transform 1.5s $ease-out-smooth,
        opacity .8s;

      .preloader-loaded & {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
  }

  .intro-wrapper {
    @include fluid-size(padding-top, 80px, 200px);

    html:not(.gl-disabled) & {
      min-height: 100vh;
      position: relative;

      .desline-2 {
        margin-left: -50vw;
        margin-top: -10vh;
      }

      .desline-1 {
        margin-top: 10px;
      }

      .desline {
        height: 40vh;
      }

      .desline > span {
        display: none;
      }
    }

    html.gl-disabled & {
      .desline {
        text-transform: uppercase;
        font-family: $font-neue-plak-extended-extra-black;

        @include fluid-size(font-size, 80px, 200px);
        @include fluid-size(margin, 20px, 30px);
      }

      .desline-1 {
        transform: translate3d(15vw, 0, 0);

        @include responsive-width($break-md) {
          @include fluid-size(margin-left, 130px, 30px);
        }
      }

      .desline-2 {
        transform: translate3d(-15vw, 0, 0);

        @include responsive-width(0, $break-md) {
          @include fluid-size(margin-left, -200px, -100px);
        }

        @include responsive-width($break-md) {
          @include fluid-size(margin-left, -100px, -30px);
        }
      }
    }
  }
</style>
