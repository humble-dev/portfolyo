<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ScrollerService } from '@/app/services/scroller.service';
import { ElementState } from '@/app/providers/element-state.provider';
import { mapRange, clamp, parallax } from '@/app/utils/math.util';
import * as Smoovy from '@smoovy/core';

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

  public mounted() {
    this.elementState = new ElementState(this.$el as HTMLElement);

    setTimeout(() => this.updatePosition(), 100);

    this.scroller.scrollAnimation$.subscribe((state) => {
      this.updatePosition(
        this.input === 'y'
          ? state.position.y
          : state.position.x
      );
    });
  }

  private updatePosition(scrollPosition: number = 0) {
      const viewportHeight = this.scroller.containerHeight;
      const elementHeight = this.elementState.bounds.height;
      const elementY = this.elementState.offset.y;
      const speed = Math.abs(this.speed);

      // Just assign the speed we want to interpolate with the speed
      // given by the user. Negative values will be treated exceptionally
      const minSpeed = this.speed <= 0 ? speed : -speed;
      const maxSpeed = this.speed <= 0 ? -speed : speed;

      // If we are moving the element horizontally, we don't want to include
      // the offset for the vertical axis, since we're assuming the element
      // won't change its vertical position
      const minOffset = this.direction === 'x' ? 0 : minSpeed
      const maxOffset = this.direction === 'x' ? 0 : maxSpeed;

      // Use the parallax helper which will calculate the current
      // Position of the element. It's just a simplified function
      // that's using the `mapRange` function to move the position
      // into a new range of nubmers
      const translation = parallax(
        scrollPosition,
        viewportHeight,
        elementHeight,
        elementY,
        minSpeed,
        maxSpeed,
        minOffset,
        maxOffset,
      );

      this.translation.x = this.direction === 'x' ? translation : 0;
      this.translation.y = this.direction === 'y' ? translation : 0;

      this.updateTranslation();
  }

  private updateTranslation() {
    const translate3d = `translate3d(
      ${this.translation.x}px,
      ${this.translation.y}px,
      0
    )`;

    this.elementState.element.style.transform = translate3d;
  }
}
</script>

<template>
  <div class="parallax-wrapper">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss"></style>
