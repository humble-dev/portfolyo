<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
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

          return 100 * y / maxScrollY;
        }),
      ),
    };
  },
})
export default class Scrollbar extends Vue {
  private scrollerService = ScrollerService.getInstance();
  private progressY: number = 0;
}
</script>

<template>
  <div class="scrollbar-wrapper">
    <div class="indicator" :style="{ height: `${progressY}%` }"></div>
  </div>
</template>

<style scoped lang="scss">
  .scrollbar-wrapper {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    z-index: 0;
  }

  .indicator {
    width: 5px;
    background-color: $color-red;
  }
</style>
