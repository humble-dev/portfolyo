<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';

import Section from '../Section.vue';
import Parallax from '../Parallax.vue';
import visibleTrigger from '@/app/directives/visible-trigger.directive';

import { CanvasDelegatorService } from '@/app/services/canvas-delegator.service';
import { RelatedTextContainer, RelatedTextContainerStretch } from '@/app/canvas/containers/related-text.container';

@Component({
  components: {
    Section,
    Parallax,
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
        <p
          class="bold size-lg description-wrapper"
          v-visibleTrigger="{ offset: -100 }"
        >
          <span class="line-wrapper">
            <span>I am a full stack interactive developer with knowledge</span>
          </span>
          <span class="line-wrapper">
            <span>in a lot of technologies. If i don‘t know something</span>
          </span>
          <span class="line-wrapper">
            <span>I am really fast in learning it.</span>
          </span>
          <br /><br />
          <span class="line-wrapper">
            <span>My work got featured on several platforms</span>
          </span>
          <span class="line-wrapper">
            <span>like awwwards, cssdesignawards and more.</span>
          </span>
        </p>
      </div>
    </div>
    <div class="fg-row headline-row">
      <div class="fg-col-xs-18 fg-col-lg-14">
        <h2
          class="awards-headline"
          ref="awardsHeadline"
        >
          <span v-if="glConfig.enabled">AWARDS</span>
          <Parallax
            v-bind="{ speed: 30, direction: 'x' }"
            v-if="!glConfig.enabled"
          >AWARDS</Parallax>
        </h2>
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
  @include responsive-width($break-md) {
    .description-wrapper {
      .line-wrapper {
        display: inline-block;
        overflow: hidden;
      }

      .line-wrapper > span {
        white-space: nowrap;
        display: inline-block;
        transform: translate3d(0, 105%, 0);
        transition: transform 1s $ease-out-smooth;
      }

      @for $i from 1 through 10 {
        .line-wrapper:nth-child(#{$i}) > span {
          transition-delay: 50ms * $i;
        }
      }

      &.visible-trigger--visible .line-wrapper > span {
        transform: translate3d(0, 0, 0);
      }
    }
  }

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
