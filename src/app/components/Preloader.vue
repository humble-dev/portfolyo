<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { map, delay, tap, filter } from "rxjs/operators";

import { ResourceProvider } from "@/app/providers/resource.provider";
import { Tween, easings, Ticker } from "@smoovy/core";
import { clamp } from "@/app/utils/math.util";
import { CursorService } from '@/app/services/cursor.service';
import { ViewportProvider } from '@/app/providers/viewport.provider';
import { PreloaderService } from '@/app/services/preloader.service';

const loadingLines = [
  ["Hey!", "Yo!", "Welcome!", "Hi!"],
  ["Whazzup!"],
  "Thanks for visiting",
  ["Ready in a minute!", "Random line here"],
  "Almost ready",
  ["FUCK NAZIS!", "FUCK AFD!", "FUCK RACISM!"],
  "Oh Yeah!!"
];

@Component<Preloader>({
  subscriptions(this) {
    return {
      loadingProgress: this.resources.progress$.pipe(
        tap(progress => {
          setTimeout(() => {
            this.updateTotalProgresss(progress, progress > 0.8 ? 2000 : 4000);
          }, 100);
        })
      )
    };
  }
})
export default class Preloader extends Vue {
  private preloader = PreloaderService.getInstance();
  private cursor = CursorService.getInstance();
  private viewport = ViewportProvider.getInstance();
  private resources = ResourceProvider.getInstance();
  private loadingProgress: number = 0;
  private totalProgress: number = 0;
  private clicked: boolean = false;
  private progressTween?: Tween;
  private ready: boolean = false;
  private loaded: boolean = false;

  public mounted() {
    setTimeout(() => (this.ready = true));

    this.cursor.ready.then(() => {
      this.cursor.setPosition(
        this.viewport.size.width / 2,
        this.viewport.size.height / 2,
        true,
      );

      this.cursor.hide();
    });

    this.viewport.changed(200)
      .pipe(
        filter(() => ! this.clicked),
      )
      .subscribe((size) => {
        this.cursor.setPosition(size.width / 2, size.height / 2, false);
      })

    this.resources.load();
  }

  private updateTotalProgresss(
    progress: number,
    duration: number = 4000,
  ) {
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
      duration,
      {
        easing: easings.Quad.out,
        update: progress => {
          this.totalProgress = clamp(progress.value, 0, 1);
          this.loaded = this.totalProgress === 1;

          if (this.loaded) {
            document.documentElement.classList.add('preloader-ready');
          }
        }
      }
    );
  }

  private handleCircleClick() {
    if (this.loaded) {
      this.clicked = true;

      document.documentElement.classList.add('hide-cursor');

      setTimeout(() => {
        this.preloader.resolveLoaded();
        document.documentElement.classList.add('preloader-loaded');
      }, 100);

      setTimeout(() => {
        this.cursor.show();
        this.cursor.setPosition(
          this.viewport.size.width / 2,
          this.viewport.size.height / 2,
          false,
        );
      }, 498);
    }
  }
}
</script>

<template>
  <div :class="{ loaded, clicked }" class="preloader-wrapper fx-layout fx-vertical fx-center-center">
    <div class="circle-wrapper" @click="handleCircleClick">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 80 80"
        width="70"
        height="70"
      >
        <defs>
          <path
            d="M80 40C80 62.08 62.08 80 40 80C17.92 80 0 62.08 0 40C0 17.92 17.92 0 40 0C62.08 0 80 17.92 80 40Z"
            id="j1tAiwRU5Y"
          ></path>
          <clipPath id="clipaRMILI0sk">
            <use xlink:href="#j1tAiwRU5Y" opacity="1"></use>
          </clipPath>
        </defs>
        <g>
          <g>
            <g>
              <g clip-path="url(#clipaRMILI0sk)">
                <use
                  xlink:href="#j1tAiwRU5Y"
                  opacity="1"
                  fill-opacity="0"
                  :stroke-dasharray="`
                    ${ totalProgress * (2 * Math.PI * 40) },
                    ${2 * Math.PI * 40}
                  `"
                  stroke="#ff0d00"
                  stroke-width="4"
                  stroke-opacity="1"
                ></use>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <div class="point"></div>
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

  &.clicked {
    visibility: hidden;
    transition: visibility 0s .5s;
  }

  .circle-wrapper {
    transition: transform .5s $ease-in-out-circ;
  }

  &:not(.clicked) .circle-wrapper {
    transform: scale(.8);
  }

  @keyframes rotate360 {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  &:not(.loaded) .circle-wrapper svg {
    animation: rotate360 3s forwards linear infinite;
  }

  .point {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $color-red;
    transform: translate(-50%, -50%) scale(0);
    transition: transform .8s $ease-in-out-circ;
  }

  &.loaded .point {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
