<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import { ElementState } from '~~/providers/element-state.provider';
import { elementInViewport, elementInViewportOnce } from '~~/helpers/element-viewport.helper';
import { CanvasDelegatorService } from '~~/services/canvas-delegator.service';
import { RelatedImageContainer, RelatedImageContainerStretch } from '~~/canvas/containers/related-image.container';

import Section from '../Section.vue';
import Parallax from '../Parallax.vue';
import { Displacement } from '~~/canvas/extras/displacement.extra';

@Component({
  components: {
    Section,
    Parallax,
  },
})
export default class AboutSection extends Vue {
  private canvasDelegator = CanvasDelegatorService.getInstance();
  private myselfEnabled: boolean = false;
  private displacement!: Displacement;
  private image!: RelatedImageContainer;

  public mounted() {
    this.image = new RelatedImageContainer(
      this.$refs.name as HTMLElement,
      'about.me',
      {
        scale: 1.15,
        stretchMode: RelatedImageContainerStretch.FIT_WIDTH,
        centerHorizontal: true,
        centerVertical: true,
      },
    );

    this.image.enableParallax(true, { speed: 25 });
    this.image.enableVisibility(false);
    this.image.enableDisplacement(
      true,
      {
        scaleX: 30,
        scaleY: 30,
      },
    ).then((extra) => this.displacement = extra);

    this.canvasDelegator.addContainer('background', this.image);
  }

  private enableMyself(enabled: boolean) {
    if (enabled !== this.myselfEnabled) {
      this.myselfEnabled = enabled;

      this.image.enableMouseTwist(enabled, { angle: 15, radius: 130 });
      this.image.enableVisibility(enabled);

      if (this.displacement) {
        if (enabled) {
          setTimeout(() => this.displacement.scaleFilter(0, 0, 1500));
        } else {
          setTimeout(() => this.displacement.scaleFilter(50, 50, 1500));
        }
      }
    }
  }

  private handleNameTranslation(position: { x: number, y: number }) {
    this.enableMyself(position.y >= -0.5);
  }
}
</script>

<template>
  <Section name="about" v-bind:title="`Guy behind \n these pixels`" number="1" titleAlign="right">
    <div class="fg-row">
      <div class="fg-col-xs-18 fg-col-md-16">
        <p class="bold size-xl" ref="text">
          Hello. I am
          <span class="name" :class="{ active: myselfEnabled }" ref="name">
            <no-ssr>
              <Parallax
                @translate="handleNameTranslation"
                v-bind="{ speed: 45, minValue: 0 }"
              >Davide</Parallax>
            </no-ssr>
          </span>, a creative developer based
          in Karlsruhe where I create awesome digital
          projects together with a cool team at <a href="https://dorfjungs.com/" target="_blank">Dorfjungs</a>
        </p>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
.name {
  html.gl-disabled & {
    display: inline;

    > div {
      display: inline;
      transform: translate3d(0, 0, 0) !important;
    }
  }

  html:not(.gl-disabled) & {
    display: inline-block;
    color: $color-black;
    transition: color .8s, -webkit-text-stroke-color .8s;
    -webkit-text-stroke: 1px transparent;

    &.active {
      color: transparent;
      -webkit-text-stroke-color: $color-white;
    }
  }
}
</style>
