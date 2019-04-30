<script lang="ts">
import { Component, Vue, Inject } from 'nuxt-property-decorator';

import Section from '../Section.vue';
import Parallax from '../Parallax.vue';
import PocketParagraph from '../atoms/PocketParagraph.vue';
import visibleTrigger from '~~/directives/visible-trigger.directive';

import { CanvasDelegatorService } from '~~/services/canvas-delegator.service';
import {
  RelatedTextContainer,
  RelatedTextContainerStretch
} from '~~/canvas/containers/related-text.container';

@Component({
  components: {
    Section,
    Parallax,
    PocketParagraph,
  },
  directives: {
    visibleTrigger,
  },
})
export default class SkillsSection extends Vue {
  private canvasDelegator = CanvasDelegatorService.getInstance();

  @Inject('glConfig')
  private glConfig!: { enabled: boolean };

  public mounted() {
    const awardsHeadline = this.$refs.awardsHeadline as HTMLElement;
    const awardsHeadlineContainer = new RelatedTextContainer(
      awardsHeadline,
      'AWARDS',
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

     awardsHeadlineContainer.enableMouseTwist(
      true,
      {
        radius: 150,
        angle: 20,
        padding: 500,
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
  <Section name="skills" v-bind:title="`Skills and \n Credentials`" titleAlign="right" number="3">
    <div class="fg-row">
      <div class="fg-col-xs-18 fg-col-lg-13 fg-col-xxl-10">
        <PocketParagraph class="bold size-lg description-wrapper">
          <span>
            <span>I'm a full stack developer with knowledge</span>
          </span>
          <span>
            <span>in a lot of different technologies. If I don't</span>
          </span>
          <span>
            <span>know something I always try to wrap my</span>
          </span>
          <span>
            <span>head around it quickly.</span>
          </span>
        </PocketParagraph>
      </div>
    </div>
    <div class="fg-row headline-row">
      <div class="fg-col-xs-18 fg-col-lg-14">
        <h2
          class="awards-headline"
          ref="awardsHeadline"
        >
          <span v-show="glConfig.enabled">AWARDS</span>
          <no-ssr>
            <Parallax
              v-bind="{ speed: 30, direction: 'x' }"
              v-show="!glConfig.enabled"
            >AWARDS</Parallax>
          </no-ssr>
        </h2>
      </div>
    </div>
    <div class="fg-row awards-entry-wrapper">
      <div class="fg-col-xs-18 fg-col-lg-4 fg-col-lg-offset-2 titles">
        <PocketParagraph class="bold upper size-md">
          <span>
            <span>AWWWARDS</span>
          </span>
        </PocketParagraph>
      </div>
      <div class="fg-col-xs-18 fg-col-lg-11 fg-col-lg-offset-1">
        <PocketParagraph class="bold size-md">
          <span>
            <span>Site Of The Day - This Portfolio</span>
          </span>
        </PocketParagraph>
        <PocketParagraph class="bold size-md">
          <span>
            <span>Developer Site - This Portfolio</span>
          </span>
        </PocketParagraph>
        <PocketParagraph class="bold size-md">
          <span>
            <span>Mobile Of The Week - This Portfolio</span>
          </span>
        </PocketParagraph>
        <PocketParagraph class="bold size-md">
          <span>
            <span>Mobile Excellence - This Portfolio</span>
          </span>
        </PocketParagraph>
        <PocketParagraph class="bold size-md">
          <span>
            <span>Honorable Mention - This Portfolio</span>
          </span>
        </PocketParagraph>
        <PocketParagraph class="bold size-md">
          <span>
            <span>Honorable Mention - Dorfjungs Jobs Microsite</span>
          </span>
        </PocketParagraph>
        <PocketParagraph class="bold size-md">
          <span>
            <span>Honorable Mention - MackMedia</span>
          </span>
        </PocketParagraph>
        <PocketParagraph class="bold size-md">
          <span>
            <span>Honorable Mention - Ammolite Restaurant</span>
          </span>
        </PocketParagraph>
      </div>
    </div>
    <div class="fg-row awards-entry-wrapper">
      <div class="fg-col-xs-18 fg-col-lg-4 fg-col-lg-offset-2 titles">
        <PocketParagraph class="bold upper size-md">
          <span>
            <span>CSS Design</span>
          </span>
          <span>
            <span>Awards</span>
          </span>
        </PocketParagraph>
      </div>
      <div class="fg-col-xs-18 fg-col-lg-11 fg-col-lg-offset-1">
        <PocketParagraph class="bold size-md">
          <span>
            <span>Site Of The Day - This Portfolio</span>
          </span>
        </PocketParagraph>
        <PocketParagraph class="bold size-md">
          <span>
            <span>Best UI, UX & Innovation - This Portfolio</span>
          </span>
        </PocketParagraph>
        <PocketParagraph class="bold size-md">
          <span>
            <span>Special Kudos - MackMedia</span>
          </span>
        </PocketParagraph>
        <PocketParagraph class="bold size-md">
          <span>
            <span>Special Kudos - Ammolite Restaurant</span>
          </span>
        </PocketParagraph>
      </div>
    </div>
    <div class="fg-row awards-entry-wrapper">
      <div class="fg-col-xs-18 fg-col-lg-4 fg-col-lg-offset-2 titles">
        <PocketParagraph class="bold upper size-md">
          <span>
            <span>Mindsparkle</span>
          </span>
        </PocketParagraph>
      </div>
      <div class="fg-col-xs-18 fg-col-lg-11 fg-col-lg-offset-1">
        <PocketParagraph class="bold size-md">
          <span>
            <span>Site Of The Day - This Portfolio</span>
          </span>
        </PocketParagraph>
      </div>
    </div>
    <div class="fg-row awards-entry-wrapper">
      <div class="fg-col-xs-18 fg-col-lg-4 fg-col-lg-offset-2 titles">
        <PocketParagraph class="bold upper size-md">
          <span>
            <span>CSS AWARDS</span>
          </span>
        </PocketParagraph>
      </div>
      <div class="fg-col-xs-18 fg-col-lg-11 fg-col-lg-offset-1">
        <PocketParagraph class="bold size-md">
          <span>
            <span>Site Of The Day - MUELLER by Bande Vier</span>
          </span>
        </PocketParagraph>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
  .awards-headline {
    html:not(.gl-disabled) & {
      visibility: hidden;

      @include fluid-size(font-size, 120px, 250px);
      @include fluid-size(margin-top, 50px, 120px);
    }

    html.gl-disabled & {
      -webkit-text-stroke: 1px;
      -webkit-text-stroke-color: black;
      color: transparent;
      font-family: $font-neue-plak-extended-bold;

      @include fluid-size(margin-top, 20px, 30px);
      @include fluid-size(font-size, 80px, 180px);
      @include fluid-size(margin-left, -30px, -20px);
    }
  }

  .headline-row + .fg-row {
    html:not(.gl-disabled) & {
      @include fluid-size(margin-top, -50px, -70px);
    }

    html.gl-disabled & {
      @include fluid-size(margin-top, -15px, -20px);
    }
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
