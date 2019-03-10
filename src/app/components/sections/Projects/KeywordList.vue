<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Ticker, TickerThread } from '@smoovy/core';
import { ElementState } from '@/app/providers/element-state.provider';
import { elementInViewport } from '@/app/helpers/element-viewport.helper';

interface KeywordData {
  x: number;
}

@Component
export default class KeywordList extends Vue {
  private wrapperState!: ElementState;
  private keywordStates: Array<ElementState<KeywordData>> = [];
  private visible: boolean = false;
  private lastThread?: TickerThread;

  @Prop({ default: [] })
  private keywords!: string[];

  public mounted() {
    this.wrapperState = new ElementState(this.$refs.wrapper as HTMLElement);
    this.keywordStates = (this.$refs.keywords as HTMLElement[]).map((word) => {
      const state = new ElementState(word);

      state.data.x = 0;

      return state;
    });

    elementInViewport(this.wrapperState, 50).subscribe((visible) => {
      this.visible = visible;

      if (this.visible && ! this.lastThread) {
        this.lastThread = Ticker.tick((delta) => this.animate(delta));
      } else if ( ! this.visible && this.lastThread) {
        this.lastThread.kill();
        this.lastThread = undefined;
      }
    });
  }

  private animate(delta: number = 1) {
    const wrapperWidth = this.wrapperState.bounds.width;
    const resetIndicies = [];
    const gutter = 15;
    const speed = 10;

    for (let i = 0, len = this.keywordStates.length; i < len; i++) {
      const keyword = this.keywordStates[i];
      const keywordData = keyword.data;
      const keywordWidth = keyword.bounds.width;
      const nextKeyword = this.keywordStates[i + 1];

      if (nextKeyword) {
        const nextKeywordData = nextKeyword.data;

        keywordData.x = nextKeywordData.x - keywordWidth - gutter;
      } else if (keywordData.x === 0) {
        keywordData.x += wrapperWidth - keywordWidth;
      }

      keywordData.x += speed / delta;

      if (keywordData.x + keyword.bounds.width > 0) {
        keyword.element.style.transform = `
          translate3d(${keywordData.x}px, 0, 0)
        `;
      } else {
        keyword.element.style.transform = `
          translate3d(-105%, 0, 0)
        `;
      }

      if (keywordData.x > wrapperWidth) {
        resetIndicies.push(i);
      }
    }

    for (let i = 0, len = resetIndicies.length; i < len; i++) {
      const index = resetIndicies[i];
      const item = this.keywordStates[index];

      this.keywordStates.splice(index, 1);
      this.keywordStates.unshift(item);
    }
  }

  private get concattedKeywords() {
    return this.keywords.slice().concat(
      this.keywords.slice(),
      this.keywords.slice(),
    );
  }
}
</script>

<template>
  <div class="keyword-list" ref="wrapper">
    <span
      ref="keywords"
      class="keyword"
      v-for="(keyword, index) of concattedKeywords"
      v-bind:key="index"
    >{{keyword}}</span>
  </div>
</template>

<style scoped lang="scss">
  .keyword-list {
    width: 100%;
    height: 20px;
    position: relative;
    overflow: hidden;
  }

  .keyword {
    color: $color-red;
    position: absolute;
    font-family: $font-neue-haas-regular;
    letter-spacing: 1px;
    left: 0;
    top: 0;

    @include fluid-size(
      font-size,
      14px,
      16px
    );
  }
</style>
