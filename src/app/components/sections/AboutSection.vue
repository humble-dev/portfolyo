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
    ['not batman', 'font-neue-plak-extended-regular outlined'],
    ['motivated', 'font-neue-haas-medium'],
    ['someone', 'font-neue-plak-regular outlined'],
    ['patient', 'font-neue-plak-extended-extra-black outlined'],
    ['never satisified', 'font-neue-haas-medium'],
    ['half italian', 'font-neue-plak-light outlined'],
    ['passionate', 'font-neue-haas-regular'],
    ['just a guy', 'font-neue-plak-extended-light outlined'],
    ['a hip hop head', 'font-neue-haas-medium'],
    ['not very tall', 'font-neue-plak-extended-regular outlined']
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
  <Section ref="section" name="about" v-bind:title="`Who's \n talking?`" number="1" titleAlign="right">
    <div class="fg-row">
      <div class="fg-col-xs-18 fg-col-xxl-14">
        <p
          class="bold size-xl description"
          :class="{ 'name-active': showDefault }"
          ref="text"
        >
          <span class="intro-wrapper">
            <span>
              <span class="visible">Hi I'm&nbsp;</span>
              <span class="name visible" :class="[
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
                      :class="personality[1]"
                    >{{personality[0]}}</span>
                    <span class="default-text">Davide</span>
                  </Parallax>
                </no-ssr>
              </span>
              <span>
                <span>, a</span>
              </span>
            </span>
            <span>
              <span>
                <span>creative</span>
              </span>
            </span>
            <span>
              <span>
                <span>developer</span>
              </span>
            </span>
            <span>
              <span>
                <span>based</span>
              </span>
            </span>
            <span>
              <span>
                <span>in</span>
              </span>
            </span>
            <span>
              <span>
                <span>Karlsruhe.</span>
              </span>
            </span>
            <span>
              <span>
                <span>I</span>
              </span>
            </span>
            <span>
              <span>
                <span>create</span>
              </span>
            </span>
            <span>
              <span>
                <span>cool</span>
              </span>
            </span>
            <span>
              <span>
                <span>digital</span>
              </span>
            </span>
            <span>
              <span>
                <span>projects</span>
              </span>
            </span>
            <span>
              <span>
                <span>with</span>
              </span>
            </span>
            <span>
              <span>
                <span>a</span>
              </span>
            </span>
            <span>
              <span>
                <span>like</span>
              </span>
            </span>
            <span>
              <span>
                <span>minded</span>
              </span>
            </span>
            <span>
              <span>
                <span>team</span>
              </span>
            </span>
            <span>
              <span>
                <span>at <Link target="_blank" to="https://dorfjungs.com/" label="Dorfjungs" /></span>
              </span>
            </span>
          </span>
        </p>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
.description {
  .intro-wrapper > span {
    display: inline-flex;
    white-space: nowrap;
  }

  @for $i from 1 through 25 {
    &.name-active .intro-wrapper > span:nth-child(#{$i}) > span > span {
      transition: transform 1.5s 30ms * $i cubic-bezier(.23,1,.32,1);
    }
  }

  .intro-wrapper > span > span {
    padding-bottom: .1ch;
  }

  .intro-wrapper > span > span:not(.visible) {
    display: inline-block;
    overflow: hidden;
  }

  .intro-wrapper > span > span > span {
    display: inline-block;
    transition: transform 1s $ease-out-smooth;
    transform: translate3d(0, 105%, 0);
  }

  &.name-active .intro-wrapper > span > span > span {
    transform: translate3d(0, 0, 0);
  }
}

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

      &.outlined {
        color: transparent;
        -webkit-text-stroke: 1px $color-black;
      }
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
