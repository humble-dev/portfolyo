<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class Link extends Vue {
  @Prop({ default: '' })
  private label!: string;

  @Prop({ default: '' })
  private to!: string;

  @Prop({ default: '_self' })
  private target!: string;

  private get letters() {
    return this.label.split('');
  }
}
</script>

<template>
  <a class="link-wrapper" :href="to" :target="target">
    <span class="letter-wrapper">
      <span class="letter" v-for="(letter, index) in letters" :key="index">
        <span :style="{ transitionDelay: `${20 * (letters.length - index)}ms` }">{{letter}}</span>
      </span>
    </span>
    <span class="letter-wrapper">
      <span class="letter" v-for="(letter, index) in letters" :key="index">
        <span :style="{ transitionDelay: `${20 * (letters.length - index)}ms` }">{{letter}}</span>
      </span>
    </span>
  </a>
</template>

<style scoped lang="scss">
.link-wrapper {
  position: relative;
  display: inline-block;
}

.letter {
  padding-bottom: 5%;
  margin-bottom: -9%;
  overflow: hidden;
  display: inline-block;

  > span {
    transition: transform 1s $ease-out-smooth;
    display: inline-block;
  }
}

.link-wrapper:hover .letter > span {
  transition: transform 1s $ease-in-out-circ, color .5s;
}

.link-wrapper:not(:hover) .letter > span {
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

.link-wrapper:hover .letter-wrapper:nth-child(1) .letter > span {
  color: $color-red;
  transform: translate3d(120%, 0, 0);
}

.link-wrapper:hover .letter-wrapper:nth-child(2) .letter > span {
  transform: translate3d(0, 0, 0);
}
</style>
