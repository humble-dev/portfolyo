<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import { clamp } from '@/app/utils/math.util';
import { ViewportProvider } from '@/app/providers/viewport.provider';
import { ScrollerService } from '@/app/services/scroller.service';
import { PreloaderService } from '@/app/services/preloader.service';
import { CanvasDelegatorService } from '@/app/services/canvas-delegator.service';
import {
  RelatedTextContainer,
  RelatedTextContainerConfig,
  RelatedTextContainerStretch,
} from '@/app/canvas/containers/related-text.container';

import Section from '../Section.vue';
import Parallax from '../Parallax.vue';
import { Tween, easings } from '@smoovy/core';

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

    const moveSpeed = 1;
    const minDisplacement = 12;
    const maxDisplacement = 50;

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

    this.preloader.loaded.then(() => {
      setTimeout(() => {
        const moveX1 = this.viewport.size.width * 0.15;
        const moveX2 = this.viewport.size.width * 0.15;
        const textX1 = text1.context.x;
        const textX2 = text2.context.x;

        text1.context.x += moveX1;
        text2.context.x -= moveX2;

        text1.enableVisibility(true, { duration: 1800 });

        Tween.to({ x: 0 }, { x: moveX1 }, 3000, {
          easing: easings.Expo.out,
          update: (pos) => {
            text1.context.x = textX1 + moveX1 - pos.x;
          },
        });

        setTimeout(() => {
          text2.enableVisibility(true, { duration: 1800 });

          Tween.to({ x: 0 }, { x: moveX2 }, 3000, {
            easing: easings.Expo.out,
            update: (pos) => {
              text2.context.x = textX2 - moveX2 + pos.x;
            },
          });
        }, 200);
      }, 800);
    });

    // this.canvasDelegator.addContainer('background', text1, text2);
  }
}
</script>

<template>
  <Section name="intro" class="intro-wrapper">
    <div class="fg-row">
      <p class="teaser-text upper fg-col-xs-18 fg-col-lg-3 fg-col-lg-offset-1">
        <Parallax v-bind:speed="glConfig.enabled ? -100 : -50">
          <span class="line">
            <span>Available for</span>
          </span>
          <span class="line">
            <span>AWESOME</span>
          </span>
          <span class="line">
            <span>Freelance</span>
          </span>
          <span class="line">
            <span>projects</span>
          </span>
        </Parallax>
      </p>
      <div
        ref="desLine1"
        class="desline desline-1 fg-col-xs-18 fg-col-lg-13 fg-col-lg-offset-1"
      >
        <Parallax
          v-if="!glConfig.enabled"
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
          v-if="!glConfig.enabled"
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
  .teaser-text {
    @include responsive-width($break-lg) {
      text-align: right;
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
        @include responsive-width($break-md) {
          @include fluid-size(margin-left, 130px, 30px);
        }
      }

      .desline-2 {
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
