<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Section from '../Section.vue';
import { CanvasDelegatorService } from '@/app/services/canvas-delegator.service';
import { RelatedTextContainerStretch, RelatedTextContainer } from '@/app/canvas/containers/related-text.container';

@Component({
  components: {
    Section,
  },
})
export default class ContactSection extends Vue {
  private canvasDelegator = CanvasDelegatorService.getInstance();

  public mounted() {
    const topCoords = this.$refs.coordsTop as HTMLElement;
    const bottomCoords = this.$refs.coordsBottom as HTMLElement;
    const textConfig = {
      fontFamily: 'Neue Plak Extended ExtraBlack',
      stretchMode: RelatedTextContainerStretch.FIT_HEIGHT,
      fill: 'transparent',
      padding: 4,
      stroke: 0x00000,
      strokeThickness: 1,
      fontSize: 200,
    };

    const topCoordsContainer = new RelatedTextContainer(
      topCoords,
      topCoords.innerHTML,
      { ...textConfig },
    );

    const bottomCoordsContainer = new RelatedTextContainer(
      bottomCoords,
      bottomCoords.innerHTML,
      { ...textConfig },
    );

    topCoordsContainer.enableParallax(true, { speed: 30, direction: 'x' });
    bottomCoordsContainer.enableParallax(true, { speed: -30, direction: 'x' });

    this.canvasDelegator.addContainer(
      'background',
      topCoordsContainer,
      bottomCoordsContainer,
    );
  }
}
</script>

<template>
  <Section name="contact" v-bind:title="`Wanna work \n with me?`" titleAlign="left" number="4">
    <div class="fg-row fx-layout fx-horoizontal fx-center-center">
      <div class="fg-col-xs-18 fg-col-lg-7 fg-col-xl-5 fg-col-xl-offset-1">
        <p class="size-xl bold">Just send me an <a href="mailto:yo@davideperozzi.de">email</a></p>
      </div>
      <div class="fg-col-xs-18 fg-col-lg-9 fg-col-lg-offset-2">
        <div class="coordinates-warpper">
          <span ref="coordsTop">49.00477</span>
          <span ref="coordsBottom">8.431911°</span>
        </div>
      </div>
    </div>
    <div class="fg-row">
      <div class="fg-col-xs-18 fg-col-lg-6 fg-col-lg-offset-10">
        <p class="bold size-lg link-wrapper fx-layout fx-horizontal">
          <a class="no-underline" target="_blank" rel="noopener" href="https://github.com/davideperozzi">GitHub</a>
          <a class="no-underline" target="_blank" rel="noopener" href="https://www.linkedin.com/in/davide-perozzi-146a39172/">LinkedIn</a>
          <a class="no-underline" target="_blank" rel="noopener" href="https://www.xing.com/profile/Davide_Perozzi">Xing</a>
        </p>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
  .coordinates-warpper {
    font-family: $font-neue-plak-extended-extra-black;
    visibility: hidden;

    @include fluid-size(font-size, 100px, 250px);

    span {
      display: block;
    }

    span:not(:first-child) {
      @include fluid-size(margin-top, -20px, -50px);
    }
  }

  .link-wrapper {
    @include fluid-size(margin-top, -40px, -60px);

    a {
      display: block;

      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
</style>
