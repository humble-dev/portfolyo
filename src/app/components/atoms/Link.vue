<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { ElementState } from '~~/providers/element-state.provider';
import { ViewportProvider } from '~~/providers/viewport.provider';

@Component
export default class Link extends Vue {
  private viewport = ViewportProvider.getInstance();
  private lettersDefault!: ElementState;
  private lettersActive!: ElementState;
  private activeScale = 1;
  private defaultScale = 1;
  private defaultWidth = 0;
  private activeWidth = 0;

  @Prop({ default: '' })
  private label!: string;

  @Prop({ default: true })
  private uppsercase!: boolean;

  @Prop({ default: '' })
  private to!: string;

  @Prop({ default: '_self' })
  private target!: string;

  private get letters() {
    return this.label.split('');
  }

  public mounted() {
    this.lettersDefault = new ElementState(
      this.$refs.lettersDefault as HTMLElement
    );

    this.lettersActive = new ElementState(
      this.$refs.lettersActive as HTMLElement
    );

    setTimeout(() => {
      this.defaultWidth = this.lettersDefault.bounds.width;
      this.activeWidth = this.lettersActive.bounds.width;
    });

    this.viewport.changed(100).subscribe(() => {
      this.defaultWidth = this.lettersDefault.bounds.width;
      this.activeWidth = this.lettersActive.bounds.width;
    });
  }
}
</script>

<template>
  <span
    class="link-wrapper"
    :style="{
      '--default-width': defaultWidth,
      '--active-width': activeWidth
    }"
  >
    <a class="link-container" :href="to" :target="target">
      <span class="letter-wrapper" ref="lettersDefault">
        <span class="letter" v-for="(letter, index) in letters" :key="index">
          <span :style="{ transitionDelay: `${20 * (letters.length - index)}ms` }">{{letter}}</span>
        </span>
      </span>
      <span class="letter-wrapper" ref="lettersActive">
        <span class="letter" v-for="(letter, index) in letters" :key="index">
          <span :style="{ transitionDelay: `${20 * (letters.length - index)}ms` }">
            {{uppsercase ? letter.toUpperCase() : letter}}
          </span>
        </span>
      </span>
    </a>
  </span>
</template>

<style scoped lang="scss">
.link-wrapper {
  display: inline-block;

  html:not(.is-mobile) & {
    width: calc(var(--active-width) * 1px);
  }
}

.link-container {
  display: inline-block;
  position: relative;
  width: 100%;
  white-space: nowrap;

  &:after {
    content: "";
    display: block;
    width: 100%;
    background-color: $color-black;
    position: absolute;
    left: 0;
    transform-origin: 0% 50%;
    transition: transform 1s $ease-out-smooth;
    bottom: 5%;

    html:not(.is-mobile) & {
      transform: scaleX(calc(var(--default-width) / var(--active-width)));
    }

    @include responsive-width(0, $break-md) {
      height: 2px;
    }

    @include responsive-width($break-md) {
      height: 4px;
    }
  }

  &:hover:after {
    html:not(.is-mobile) & {
      transform: scaleX(1);
      transition: transform 1s $ease-in-out-circ;
    }
  }
}

.letter {
  padding-bottom: 0.25ch;
  overflow: hidden;
  display: inline-block;

  > span {
    transition: transform 1s $ease-out-smooth;
    display: inline-block;
  }
}

.link-container:hover .letter > span {
  html:not(.is-mobile) & {
    transition: transform 1s $ease-in-out-circ, color .5s;
  }
}

.link-container:not(:hover) .letter > span {
  html:not(.is-mobile) & {
    transition-delay: 0s !important;
  }
}

.letter-wrapper {
  display: inline-flex;
}

.letter-wrapper:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;

  .letter > span {
    transform: translate3d(-120%, 0, 0);
  }
}

.link-container:hover .letter-wrapper:nth-child(1) .letter > span {
  html:not(.is-mobile) & {
    color: $color-red;
    transform: translate3d(120%, 0, 0);
  }
}

.link-container:hover .letter-wrapper:nth-child(2) .letter > span {
  html:not(.is-mobile) & {
    transform: translate3d(0, 0, 0);
  }
}
</style>
