<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import { ScrollerService } from '@/app/services/scroller.service';
import { CanvasDelegatorService } from '@/app/services/canvas-delegator.service';
import {
  RelatedTextContainer,
  RelatedTextContainerConfig,
  RelatedTextContainerStretch,
} from '@/app/canvas/containers/related-text.container';

import Section from '../Section.vue';
import Parallax from '../Parallax.vue';
import { clamp } from '@/app/utils/math.util';

@Component({
  components: {
    Section,
    Parallax,
  },
})
export default class IntroSection extends Vue {
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

    const minDisplacement = 10;
    const maxDisplacement = 80;

    text1.enableParallax(true, { speed: -100, direction: 'x' });
    text1.enableDisplacement(
      true,
      {
        scaleX: minDisplacement,
        scaleY: minDisplacement,
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

    this.canvasDelegator.addContainer('background', text1, text2);
  }
}
</script>

<template>
  <Section name="intro" class="intro-wrapper">
    <div class="fg-row">
      <p class="teaser-text upper fg-col-xs-3 fg-col-lg-2 fg-col-lg-offset-1">
        <Parallax v-bind:speed="glConfig.enabled ? -150 : -50">
          <span>Available for AWESOME Freelance projects</span>
        </Parallax>
      </p>
      <div
        ref="desLine1"
        class="desline desline-1 fg-col-xs-18 fg-col-lg-14 fg-col-lg-offset-1"
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
