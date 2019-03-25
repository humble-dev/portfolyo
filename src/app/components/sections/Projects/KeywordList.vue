<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component
export default class KeywordList extends Vue {
  @Prop({ default: [] })
  private keywords!: string[];

  private get keywordsMixed() {
    return [
      ...this.keywords.slice(),
      ...this.keywords.slice(),
    ];
  }
}
</script>

<template>
  <div class="keyword-list" ref="wrapper">
    <div class="keyword-list-container">
      <div class="keyword-list-wrapper">
        <span
          class="keyword"
          v-for="(keyword, index) of keywordsMixed"
          :key="index"
        >{{keyword}}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .keyword-list {
    position: relative;
    white-space: nowrap;
    width: 100%;
    height: 20px;
    overflow: hidden;
  }

  .keyword-list-container {
    position: absolute;
    top: 50%;
    left: 0;
    animation: bounceLr 25s infinite linear;
  }

  @keyframes bounceLr {
    0% {
      transform: translate3d(-50%, -50%, 0);
    }

    100% {
      transform: translate3d(0, -50%, 0);
    }
  }

  .keyword {
    color: $color-red;
    display: inline-block;
    font-family: $font-neue-haas-regular;
    letter-spacing: 1px;
    margin: 0 10px;
    white-space: nowrap;

    @include fluid-size(
      font-size,
      14px,
      16px
    );
  }
</style>
