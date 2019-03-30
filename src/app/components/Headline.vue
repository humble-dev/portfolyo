<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import visibleTrigger from '../directives/visible-trigger.directive';
import { ScrollerService } from '~~/services/scroller.service';
import { map, tap, takeUntil, takeWhile, filter } from 'rxjs/operators';
import { scrollTween } from '~~/utils/math.util';
import { ViewportProvider } from '~~/providers/viewport.provider';
import { ElementState } from '~~/providers/element-state.provider';

@Component<Headline>({
  directives: {
    visibleTrigger,
  },
  subscriptions(this) {
    const scroller = this.scrollerService;

    return {
      borderScaleProgress: scroller.scrollAnimation$.pipe(
        filter(() => !!this.borderTopState),
        map((state) => state.position.y),
        map((y) => {
          const viewportSize = this.viewportProvider.size;

          return scrollTween(
            y + viewportSize.height * .7,
            viewportSize.height,
            this.borderTopState.bounds.height,
            this.borderTopState.offset.y,
            0,
            1,
            0,
            0,
          );
        }),
        filter((scale) => scale > 0),
        tap((scale) => {
          this.borderTopState.element.style.transform = `scaleX(${scale})`;

          if (scale >= 1) {
            this.headlineVisible = true;
          }
        }),
        takeWhile((scale) => scale < 1),
      ),
    };
  },
})
export default class Headline extends Vue {
  private scrollerService = ScrollerService.getInstance();
  private viewportProvider = ViewportProvider.getInstance();
  private borderScaleProgress: number = 0;
  private headlineVisible: boolean = false;
  private borderTopState!: ElementState;

  @Prop()
  public title!: string;

  @Prop()
  public number!: number;

  public mounted() {
    this.borderTopState = new ElementState(this.borderTop);
  }

  public get titleLines(): string[] {
    return this.title.split('\n');
  }

  public get borderTop(): HTMLElement {
    return this.$refs.borderTop as HTMLElement;
  }
}
</script>

<template>
  <div class="headline">
    <div class="border-top" ref="borderTop"></div>
    <div class="text-content fx-layout fx-horizontal fx-justified">
      <p class="number size-md">N° {{number}}</p>
      <h2 :class="{ visible: headlineVisible }">
        <p
          v-for="(line, index) in titleLines"
          v-bind:key="index"
          class="title upper size-lg right"
        >
          <span>{{line}}</span>
        </p>
      </h2>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .headline {
    display: block;
    color: $color-black;
    position: relative;

    @include fluid-size(padding-top, 10px, 15px);
    @include fluid-size(margin-bottom, 50px, 220px);
  }

  .border-top {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    background-color: $color-black;
    transform: scaleX(0);
    transform-origin: 0 50%;

    @include responsive-width(0, $break-lg) {
      height: 2px;
    }

    @include responsive-width($break-lg) {
      height: 3px;
    }
  }

  .text-content > p {
    font-family: $font-neue-plak-extended-regular;
  }

  .number {
    line-height: 1.4;
  }

  h2 > p {
    overflow: hidden;
    line-height: 0.96;

    @include fluid-size(font-size, 24px, 44px);
  }

  h2 > p > span {
    opacity: 0;
    display: block;
    transform: translate3d(0, 80%, 0);
  }

  h2.visible > p > span{
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @for $i from 1 through 4 {
    h2 > p:nth-child(#{$i}) span {
      transition: opacity 1s, transform .5s + ($i * 0.5);
    }
  }
</style>
