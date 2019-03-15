<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { map, delay, tap } from 'rxjs/operators';

import { ResourceProvider } from '@/app/providers/resource.provider';
import { Tween, easings, Ticker } from '@smoovy/core';
import { clamp } from '@/app/utils/math.util';

const loadingLines = [
  [ 'Hey!', 'Yo!', 'Welcome!', 'Hi!' ],
  [ 'Whazzup!' ],
  'Thanks for visiting',
  [ 'Ready in a minute!', 'Random line here' ],
  'Almost ready',
  ['FUCK NAZIS!', 'FUCK AFD!', 'FUCK RACISM!'],
  'Oh Yeah!!'
];

@Component<Preloader>({
  subscriptions(this) {
    return {
      loadingProgress: this.resources.progress$.pipe(
        tap((progress) => {
          setTimeout(() => {
            this.updateTotalProgresss(progress);
          }, 100);
        }),
      ),
    };
  },
})
export default class Preloader extends Vue {
  private resources = ResourceProvider.getInstance();
  private loadingProgress: number = 0;
  private totalProgress: number = 0;
  private progressTween?: Tween;
  private ready: boolean = false;
  private loaded: boolean = false;

  public mounted() {
    setTimeout(() => this.ready = true);

    this.resources.load();
  }

  private updateTotalProgresss(progress: number) {
    if (this.progressTween) {
      this.progressTween.stop();
    }

    this.progressTween = Tween.to(
      {
        value: this.totalProgress
      },
      {
        value: progress
      },
      4000,
      {
        easing: easings.Linear.none,
        update: (progress) => {
          this.totalProgress = clamp(
            progress.value,
            0,
            1
          );

          const loaded = this.totalProgress === 1;

          setTimeout(() => {
            this.loaded = loaded;

            if (this.loaded) {
              document.documentElement.classList.add('loaded');
            }
          }, loaded ? 500 : 0);
        },
      }
    );
  }
}
</script>

<template>
  <div :class="{ loaded }" class="preloader-wrapper fx-layout fx-vertical fx-center-center">
    <div class="half-wrapper half-wrapper-top">
      <div class="progress-bar-wrapper">
        <div
          class="progress-bar"
          :style="{ transform: `scaleX(${totalProgress})` }"
        ></div>
      </div>
      <div class="text-container">
        <span>
          <span :style="{
            transform: `translate3d(${-5 * totalProgress}px, 0, 0)`
          }">YOOOOOO!</span>
        </span>
      </div>
    </div>
    <div class="half-wrapper half-wrapper-bottom">
      <div class="progress-bar-wrapper">
        <div
          class="progress-bar"
          :style="{ transform: `scaleX(${totalProgress})` }"
        ></div>
      </div>
      <div class="text-container">
        <span>
          <span :style="{
            transform: `translate3d(${5 * totalProgress}px, 0, 0)`
          }">YOOOOOO!</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .preloader-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    transition: bottom 1s;
    overflow: hidden;
    background-color: transparent;

    &.loaded {
      visibility: hidden;
      transition: visibility 0s 1.7s;
    }

    .text-container {
      font-family: $font-neue-plak-extended-regular;
      user-select: none;
      position: absolute;
      overflow: hidden;
      z-index: 2;
      transition: opacity .5s;
      text-transform: uppercase;
      left: 0;
      width: 100%;
      text-align: center;
      white-space: nowrap;

      @include fluid-size(letter-spacing, 1px, 3px);
      @include fluid-size(font-size, 30px, 70px);
    }

    .half-wrapper-top .text-container {
      bottom: (50vh * 0.002);

      > span {
        display: block;
        transform: translate(0px, 40%);
      }

      > span > span {
        display: block;
      }
    }

    .half-wrapper-bottom .text-container {
      top: (50vh * 0.003);

      > span {
        display: block;
        transform: translate(0px, -60%);
      }

      > span > span {
        display: block;
      }
    }

    .half-wrapper {
      position: absolute;
      background-color: $color-beige;
      height: 50%;
      left: 0;
      right: 0;
      transition: transform 1.2s .5s;

      &:after {
        content: "";
        position: absolute;
        background-color: $color-black;
        left: 0;
        right: 0;
        z-index: 6;
        bottom: -1px;
        top: -1px;
        transform: scaleY(0);
        transition: transform 1.2s .1s $ease-in-out-circ;
      }
    }

    &.loaded .half-wrapper {
      transform: scaleY(0);
    }

    &.loaded .half-wrapper:after {
      transform: scaleY(1);
    }

    .half-wrapper-bottom {
      bottom: 0;
      transform-origin: 50% 100%;

      .progress-bar-wrapper,
      &:after {
        transform-origin: 50% 0;
      }
    }

    .half-wrapper-top {
      top: 0;
      transform-origin: 50% 0;

      .progress-bar-wrapper,
      &:after {
        transform-origin: 50% 100%;
      }
    }

    &.loaded .progress-bar-wrapper {
      height: 100%;
    }

    &.loaded .progress-bar-wrapper {
      transform: scaleY(1) translate3d(-50%, 0, 0);
    }

    .progress-bar-wrapper {
      overflow: hidden;
      position: absolute;
      transform: translate3d(-50%, 0, 0) scaleY(.002);
      left: 50%;
      z-index: 5;
      width: 100vw;
      height: 100%;
      transition: transform 1.2s $ease-in-out-circ;

      .progress-bar {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        will-change: transform;
        background-color: $color-red;
      }
    }
  }
</style>
