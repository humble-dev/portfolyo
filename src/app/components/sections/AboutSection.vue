<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import { ElementState } from '~~/providers/element-state.provider';
import { elementInViewport, elementInViewportOnce } from '~~/helpers/element-viewport.helper';
import { CanvasDelegatorService } from '~~/services/canvas-delegator.service';
import { Displacement } from '~~/canvas/extras/displacement.extra';
import { RelatedImageContainer, RelatedImageContainerStretch } from '~~/canvas/containers/related-image.container';

import Section from '../Section.vue';
import Parallax from '../Parallax.vue';
import Link from '../atoms/Link.vue';
import { ViewportProvider } from '~~/providers/viewport.provider';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

@Component({
  components: {
    Section,
    Parallax,
    Link
  },
})
export default class AboutSection extends Vue {
  private canvasDelegator = CanvasDelegatorService.getInstance();
  private viewport = ViewportProvider.getInstance();
  private myselfEnabled: boolean = false;
  private displacement!: Displacement;
  private image!: RelatedImageContainer;
  private activePersonality = 1;
  private showDefault = false;
  private nameSpeed = 0;
  private lastPersonSwitch = -1;
  private currentPersonPos = 0;
  private personalities = [
    'not batman',
    'motivated',
    'someone',
    'never satisified',
    'half italian',
    'passionated',
    'just a guy',
    'a hip hop head',
    'not very tall'
  ];

  public created() {
    shuffle(this.personalities);
  }

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

    this.image.isInitialized().then(() => {
      this.image.context.alpha = 0.8;
    });

    this.image.enableParallax(true, { speed: 25 });
    this.image.enableVisibility(false);
    this.image.enableDisplacement(
      true,
      {
        scaleX: 50,
        scaleY: 50,
      },
    ).then((extra) => this.displacement = extra);

    const text = new ElementState(this.$refs.text as HTMLElement);
    const section = new ElementState(
      (this.$refs.section as Section).$el as HTMLElement
    );

    setTimeout(() => {
      this.nameSpeed = Math.abs(text.offset.y - section.offset.y) - 50;
    });

    this.viewport.changed(100).subscribe(() => {
      this.nameSpeed = Math.abs(text.offset.y - section.offset.y) - 50;
    });

    this.canvasDelegator.addContainer('background', this.image);
  }

  private enableMyself(enabled: boolean) {
    if (enabled !== this.myselfEnabled) {
      this.myselfEnabled = enabled;

      this.image.enableVisibility(enabled);
      this.image.enableMouseTwist(enabled, {
        angle: 15,
        radius: 130,
        padding: 150,
      });

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
    this.showDefault = position.y >= -60;

    if (this.lastPersonSwitch === -1) {
      this.lastPersonSwitch = Math.abs(position.y);
    }

    this.currentPersonPos = Math.abs(
      this.lastPersonSwitch - Math.abs(position.y)
    );

    if (this.currentPersonPos >= this.nameSpeed / 9) {
      this.lastPersonSwitch = Math.abs(position.y);

      const nextPerso = this.activePersonality + 1;

      this.activePersonality = nextPerso < this.personalities.length
        ? nextPerso
        : 0;
    }
  }
}
</script>

<template>
  <Section ref="section" name="about" v-bind:title="`Guy behind \n these pixels`" number="1" titleAlign="right">
    <div class="fg-row">
      <div class="fg-col-xs-18 fg-col-md-16">
        <p class="bold size-xl" ref="text">
          Hello. I am
          <span class="name" :class="[
            { active: myselfEnabled, default: showDefault },
            `p${activePersonality + 1}`
          ]" ref="name">
            <no-ssr>
              <Parallax
                @translate="handleNameTranslation"
                v-bind="{ speed: nameSpeed, minValue: 0 }"
              >
                <span
                  class="personality"
                  v-for="(personality, index) in personalities"
                  :key="index"
                >{{personality}}</span>
                <span class="default-text">Davide</span>
              </Parallax>
            </no-ssr>
          </span>, a creative developer based
          in Karlsruhe where I create awesome digital
          projects together with a cool team at <Link target="_blank" to="https://dorfjungs.com/" label="Dorfjungs" />
        </p>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
.name {
  html.gl-disabled & {
    display: inline;

    .personality {
      display: none;
    }

    > div {
      display: inline;
      transform: translate3d(0, 0, 0) !important;
    }
  }

  html:not(.gl-disabled) & {
    position: relative;
    display: inline-block;
    color: $color-black;
    transition: color .8s, -webkit-text-stroke-color .8s;
    -webkit-text-stroke: 1px transparent;

    .personality {
      display: none;
      position: absolute;
      left: 0;
      top: 50%;
      white-space: nowrap;
      display: none;
      transform: translate3d(0, -50%, 0);
    }

    &:not(.default) .default-text {
      visibility: hidden;
    }

    @for $i from 1 through 10 {
      &:not(.default).p#{$i} .personality:nth-child(#{$i}) {
        display: block;
      }
    }

    &.active {
      color: transparent;
      -webkit-text-stroke-color: $color-black;
    }
  }
}
</style>
