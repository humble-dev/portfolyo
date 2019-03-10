<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { map, tap } from 'rxjs/operators';

import { ScrollerService } from '@/app/services/scroller.service';

@Component<Scrollbar>({
  subscriptions(this) {
    const scroller = this.scrollerService;

    return {
      progressY: scroller.scrollAnimation$.pipe(
        map((state) => state.position.y),
        map((y) => {
          const maxScrollY = scroller.wrapperHeight - scroller.containerHeight;

          return y / maxScrollY;
        }),
        tap((progress) => {
          this.indicator.style.transform = `scaleY(${progress})`;
        }),
      ),
    };
  },
})
export default class Scrollbar extends Vue {
  private scrollerService = ScrollerService.getInstance();
  private progressY: number = 0;

  private get indicator(): HTMLElement {
    return this.$refs.indicator as HTMLElement;
  }
}
</script>

<template>
  <div class="scrollbar-wrapper">
    <div class="indicator" ref="indicator"></div>
  </div>
</template>

<style scoped lang="scss">
  .scrollbar-wrapper {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;

    @include responsive-width(0, $break-lg) {
      width: 2px;
    }

    @include responsive-width($break-lg) {
      width: 4px;
    }
  }

  .indicator {
    width: 100%;
    height: 100%;
    background-color: $color-red;
    transform: scaleY(0);
  }
</style>
