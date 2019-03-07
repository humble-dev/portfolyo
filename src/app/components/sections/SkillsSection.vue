<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Section from '../Section.vue';

import { CanvasDelegatorService } from '@/app/services/canvas-delegator.service';
import { RelatedTextContainer, RelatedTextContainerStretch } from '@/app/canvas/containers/related-text.container';

@Component({
  components: {
    Section,
  },
})
export default class SkillsSection extends Vue {
  private canvasDelegator = CanvasDelegatorService.getInstance();

  public mounted() {
    const awardsHeadline = this.$refs.awardsHeadline as HTMLElement;
    const awardsHeadlineContainer = new RelatedTextContainer(
      awardsHeadline,
      awardsHeadline.innerHTML,
      {
        fontFamily: 'Neue Plak Extended ExtraBlack',
        stretchMode: RelatedTextContainerStretch.FIT_HEIGHT,
        fill: 'transparent',
        padding: 4,
        stroke: 0x00000,
        strokeThickness: 1,
        fontSize: 200,
      },
    );

    awardsHeadlineContainer.enableParallax(true, { speed: 50, direction: 'x' });
    awardsHeadlineContainer.enableDisplacement(
      true,
      {
        scaleX: 5,
        scaleY: 0,
      },
    );

    this.canvasDelegator.addContainer(
      'background',
      awardsHeadlineContainer,
    );
  }
}
</script>

<template>
  <Section name="skills" v-bind:title="`Skillz & \n Awards!`" titleAlign="right" number="3">
    <div class="fg-row">
      <div class="fg-col-xs-18 fg-col-lg-13 fg-col-xxl-10">
        <p class="bold size-lg">
          I am a full stack interactive developer with knowledge
          in a lot of technologies. If i don‘t know something
          I am really fast in learning it.
          <br /><br />
          My work got featured on several platforms
          like awwwards, cssdesignawards and more.
        </p>
      </div>
    </div>
    <div class="fg-row headline-row">
      <div class="fg-col-xs-18 fg-col-lg-14">
        <h2 class="awards-headline" ref="awardsHeadline">AWARDS</h2>
      </div>
    </div>
    <div class="fg-row awards-entry-wrapper">
      <div class="fg-col-xs-18 fg-col-lg-4 fg-col-lg-offset-2 titles">
        <p class="bold upper size-md">AWWWARDS</p>
      </div>
      <div class="fg-col-xs-18 fg-col-lg-11 fg-col-lg-offset-1">
        <p class="bold size-md">Honorable Mention - MackMedia</p>
        <p class="bold size-md">Honorable Mention - Ammolite Restaurant</p>
      </div>
    </div>
    <div class="fg-row awards-entry-wrapper">
      <div class="fg-col-xs-18 fg-col-lg-4 fg-col-lg-offset-2 titles">
        <p class="bold upper size-md">CSS Design Awards</p>
      </div>
      <div class="fg-col-xs-18 fg-col-lg-11 fg-col-lg-offset-1">
        <p class="bold size-md">Special Kudos - MackMedia</p>
        <p class="bold size-md">Special Kudos - Ammolite Restaurant</p>
      </div>
    </div>
    <div class="fg-row awards-entry-wrapper">
      <div class="fg-col-xs-18 fg-col-lg-4 fg-col-lg-offset-2 titles">
        <p class="bold upper size-md">CSS AWARDS</p>
      </div>
      <div class="fg-col-xs-18 fg-col-lg-11 fg-col-lg-offset-1">
        <p class="bold size-md">Site of the Day - MUELLER by Bande Vier</p>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
  .awards-headline {
    visibility: hidden;

    @include fluid-size(font-size, 120px, 250px);
    @include fluid-size(margin-top, 50px, 120px);
  }

  .headline-row + .fg-row {
    @include fluid-size(margin-top, -50px, -70px);
  }

  .awards-entry-wrapper {
    &:not(:last-child) {
      @include fluid-size(margin-bottom, 30px, 70px);
    }

    .titles > p {
      font-family: $font-neue-plak-extended-bold;
    }
  }
</style>
