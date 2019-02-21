<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { map, delay, tap } from 'rxjs/operators';

import { ResourceProvider } from '@/app/providers/resource.provider';

@Component<Preloader>({
  subscriptions(this) {
    return {
      progress: this.resources.progress$.pipe(
        tap((progress) => {
          setTimeout(() => {
            this.loaded = progress === 1;
          }, 500);
        }),
        map((progress) => parseFloat((progress * 100).toFixed(0))),
      ),
    };
  },
})
export default class Preloader extends Vue {
  private resources = ResourceProvider.getInstance();
  private progress: number = 0;
  private ready: boolean = false;
  private loaded: boolean = false;

  public mounted() {
    setTimeout(() => {
      this.ready = true;
    });

    this.resources.load();
  }
}
</script>

<template>
  <div :class="{ loaded }" class="preloader-wrapper fx-layout fx-vertical fx-center-center">
    <p :class="{ visible: ready }" class="progress x-large" ref="progress">
      <span>{{progress}}%</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
  .preloader-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    z-index: 150;
    transition: bottom 1s;
    overflow: hidden;

    &.loaded {
      bottom: 100%;
      visibility: hidden;
      transition: bottom 1s, visibility 0s 1s;
    }

    .progress {
      transition: opacity .5s;
    }

    .progress:not(.visible) {
      opacity: 0;
    }
  }
</style>
