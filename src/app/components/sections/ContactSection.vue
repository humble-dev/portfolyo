<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import Section from '../Section.vue';
import PocketParagraph from '../atoms/PocketParagraph.vue';
import Link from '../atoms/Link.vue';
import { CanvasDelegatorService } from '~~/services/canvas-delegator.service';
import {
  RelatedTextContainerStretch,
  RelatedTextContainer,
} from '~~/canvas/containers/related-text.container';

const randomLinks = [
  'https://fakten-gegen-rechts.de/',
  'https://dorfjungs.com/',
  'http://trumpdonald.org/',
  'https://jakartarecords-label.bandcamp.com/album/durch-die-wolkendecke',
];

@Component({
  components: {
    Section,
    PocketParagraph,
    Link,
  },
})
export default class ContactSection extends Vue {
  private canvasDelegator = CanvasDelegatorService.getInstance();
  private randomLink: string = '';

  public mounted() {
    this.updateRandomLink();

    const backgroundText = this.$refs.backgroundText as HTMLElement;
    const textConfig = {
      fontFamily: 'Neue Plak Extended ExtraBlack',
      stretchMode: RelatedTextContainerStretch.FIT_HEIGHT,
      fill: 'transparent',
      padding: 4,
      stroke: 0x00000,
      strokeThickness: 1,
      fontSize: 200,
    };

    const contactTextContainer = new RelatedTextContainer(
      backgroundText,
      backgroundText.innerHTML,
      { ...textConfig },
    );

    contactTextContainer.enableMouseTwist(
      true,
      {
        radius: 150,
        angle: 20,
        padding: 500,
      },
    );

    contactTextContainer.enableParallax(
      true,
      {
        speed: 30,
        direction: 'x',
      },
    );

    this.canvasDelegator.addContainer(
      'background',
      contactTextContainer,
    );
  }

  private updateRandomLink() {
    this.randomLink = randomLinks[
      Math.round(randomLinks.length * Math.random())
    ];
  }
}
</script>

<template>
  <Section name="contact" v-bind:title="`Wanna work \n together?`" titleAlign="left" number="4">
    <div class="fg-row fx-layout fx-horoizontal fx-center-center">
      <div class="fg-col-xs-18 fg-col-lg-7 fg-col-xl-5 fg-col-xl-offset-1">
        <PocketParagraph class="size-xl bold">
          <span>
            <span>Just send me</span>
          </span>
          <span>
            <span>an <Link label="email" to="mailto:yo@davideperozzi.com" /></span>
          </span>
        </PocketParagraph>
      </div>
      <div class="fg-col-xs-18 fg-col-lg-9 fg-col-lg-offset-2">
        <div class="background-text-warpper">
          <span ref="backgroundText">CONTACT</span>
        </div>
      </div>
    </div>
    <div class="fg-row">
      <div class="fg-col-xs-18 fg-col-lg-6 fg-col-lg-offset-10">
        <div class="fg-row">
          <PocketParagraph class="fg-col-xs-9 bold size-lg link-list-wrapper fx-layout fx-vertical fx-start">
            <span>
              <span>
                <Link target="_blank" rel="noopener" to="https://github.com/davideperozzi" label="GitHub" />
              </span>
            </span>
            <span>
              <span>
                <Link target="_blank" rel="noopener" to="https://www.linkedin.com/in/davide-perozzi-146a39172/" label="LinkedIn" />
              </span>
            </span>
            <span>
              <span>
                <Link target="_blank" rel="noopener" to="https://www.xing.com/profile/Davide_Perozzi" label="Xing" />
              </span>
            </span>
          </PocketParagraph>
          <PocketParagraph class="fg-col-xs-9 bold size-lg link-list-wrapper fx-layout fx-vertical fx-start">
            <span>
              <span>
                <Link target="_blank" rel="noopener" to="https://dribbble.com/davideperozzi" label="Dribbble" />
              </span>
            </span>
            <span>
              <span>
                <Link target="_blank" rel="noopener" to="https://www.behance.net/davideperozzi" label="Behance" />
              </span>
            </span>
            <span>
              <span>
                <Link target="_blank" rel="noopener" @click="updateRandomLink()" :href="randomLink" label="Something" />
              </span>
            </span>
          </PocketParagraph>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
  .background-text-warpper {
    font-family: $font-neue-plak-extended-extra-black;
    visibility: hidden;

    @include fluid-size(font-size, 100px, 250px);

    .gl-disabled & {
      display: none;
    }

    span {
      white-space: nowrap;
      display: block;
    }

    html:not(.gl-disabled) & {
      span:not(:first-child) {
        @include fluid-size(margin-top, -20px, -50px);
      }
    }
  }

  .link-list-wrapper {
    html:not(.gl-disabled) & {
      @include fluid-size(margin-top, -40px, -133px);
    }

    html.gl-disabled & {
      @include fluid-size(margin-top, 20px, 30px);
    }

    a {
      white-space: nowrap;
    }
  }
</style>
