<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ScrollerService } from '@/app/services/scroller.service';
import { ElementState } from '@/app/providers/element-state.provider';
import { mapRange, clamp } from '@/app/utils/math.util';
import * as Smoovy from '@smoovy/core';
import { parallaxHelper } from '@/app/helpers/parallax.helper';

@Component
export default class Parallax extends Vue {
  private scroller = ScrollerService.getInstance();
  private translation = { x: 0, y: 0 };
  private elementState!: ElementState;

  @Prop({ default: 50 })
  private speed!: number;

  @Prop({ default: 'y' })
  private input!: 'x' | 'y';

  @Prop({ default: 'y' })
  private direction!: 'x' | 'y';

  @Prop()
  private reflectFrom!: [
    { [id: string]: HTMLElement[] },
    string,
    number
  ];

  public mounted() {
    let reflectFrom;

    if (this.reflectFrom) {
      const refs = this.reflectFrom[0];
      const name = this.reflectFrom[1];
      const index = this.reflectFrom[2];

      reflectFrom = refs[name][index];
    }

    this.elementState = new ElementState(
      reflectFrom || this.$el as HTMLElement
    );

    setTimeout(() => this.updatePosition(), 100);

    this.scroller.scrollAnimation$.subscribe((state) => {
      this.updatePosition(
        this.input === 'y'
          ? state.position.y
          : state.position.x,
      );
    });
  }

  private updatePosition(scrollPosition: number = 0) {
      const viewportHeight = this.scroller.containerHeight;
      const elementHeight = this.elementState.bounds.height;
      const elementPositionY = this.elementState.offset.y;
      const translation = parallaxHelper(
        scrollPosition,
        viewportHeight,
        elementHeight,
        elementPositionY,
        this.speed,
        this.direction,
      );

      this.translation.x = translation.x;
      this.translation.y = translation.y;

      this.updateTranslation();
  }

  private updateTranslation() {
    const translate3d = `translate3d(
      ${this.translation.x}px,
      ${this.translation.y}px,
      0
    )`;

    (this.$el as HTMLElement).style.transform = translate3d;
  }
}
</script>

<template>
  <div class="parallax-wrapper">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss"></style>
