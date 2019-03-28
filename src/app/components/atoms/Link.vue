<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { ElementState } from '~~/providers/element-state.provider';

@Component
export default class Link extends Vue {
  private lettersDefault!: ElementState;
  private lettersActive!: ElementState;
  private activeScale = 1;

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
      const defaultWidth = this.lettersDefault.bounds.width;

      this.activeScale = this.lettersActive.bounds.width / defaultWidth;
    });
  }
}
</script>

<template>
  <span class="link-wrapper">
    <a class="link-container" :href="to" :target="target" :style="{
      '--active-scale': activeScale
    }">
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
}

.link-container {
  $padding-r: "(var(--active-scale) - 1) * 100%";

  position: relative;
  top: .5ch;
  margin-top: -.5ch;
  display: inline-block;
  white-space: nowrap;
  padding-right: calc(#{$padding-r});

  &:after {
    content: "";
    display: block;
    width: calc(100% - #{$padding-r} + 1%);
    background-color: $color-black;
    position: absolute;
    bottom: 0.5ch;
    left: 0;
    transform-origin: 0% 50%;
    transition: transform 1s $ease-out-smooth;

    @include responsive-width(0, $break-md) {
      height: 2px;
    }

    @include responsive-width($break-md) {
      height: 4px;
    }
  }

  &:hover:after {
    transform: scaleX(var(--active-scale));
    transition: transform 1s $ease-in-out-circ;
  }
}

.letter {
  overflow: hidden;
  padding-bottom: 0.25ch;
  display: inline-block;

  > span {
    transition: transform 1s $ease-out-smooth;
    display: inline-block;
  }
}

.link-container:hover .letter > span {
  transition: transform 1s $ease-in-out-circ, color .5s;
}

.link-container:not(:hover) .letter > span {
  transition-delay: none !important;
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
  color: $color-red;
  transform: translate3d(120%, 0, 0);
}

.link-container:hover .letter-wrapper:nth-child(2) .letter > span {
  transform: translate3d(0, 0, 0);
}
</style>
