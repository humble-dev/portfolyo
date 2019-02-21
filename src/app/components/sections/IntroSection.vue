<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { CanvasDelegatorService } from '@/app/services/canvas-delegator.service';
import {
  RelatedTextContainer,
  RelatedTextContainerConfig,
  RelatedTextContainerStretch,
} from '@/app/canvas/containers/related-text.container';

import Section from '../Section.vue';
import Parallax from '../Parallax.vue';

@Component({
  components: {
    Section,
    Parallax,
  },
})
export default class IntroSection extends Vue {
  private canvasDelegator = CanvasDelegatorService.getInstance();

  public mounted() {
    const headlineConfig: Partial<RelatedTextContainerConfig> = {
      fontSize: 378,
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

    text1.enableDisplacement(true, { scaleX: 5, scaleY: 5 });
    text2.enableDisplacement(true, { scaleX: 5, scaleY: 5 });

    this.canvasDelegator.addContainer('background', text1, text2);
  }
}
</script>

<template>
  <Section name="intro">
    <div class="fg-row">
      <p class="upper right fg-col-xs-2 fg-col-xs-offset-1">
        <span>Available for AWESOME Freelance projects</span>
      </p>
      <div ref="desLine1" class="designation-line designation-line-1 fg-col-xs-14 fg-col-xs-offset-1"></div>
    </div>
    <div class="fg-row">
      <div ref="desLine2" class="designation-line designation-line-2 fg-col-xs-18"></div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
  section {
    height: 100vh;
    position: relative;
  }

  .designation-line-2 {
    margin-left: -50vw;
  }

  .designation-line-1 {
    margin-top: 10px;
  }

  .designation-line {
    height: 40vh;
  }
</style>
