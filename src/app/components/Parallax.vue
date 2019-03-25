<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import { ScrollerService } from '~~/services/scroller.service';
import { ElementState } from '~~/providers/element-state.provider';
import { mapRange, clamp } from '~~/utils/math.util';
import { parallaxHelper } from '~~/helpers/parallax.helper';

@Component
export default class Parallax extends Vue {
  private scroller = ScrollerService.getInstance();
  private translation = { x: 0, y: 0 };
  private lastTranslation = { x: 0, y: 0 };
  private elementState!: ElementState;

  @Prop({ default: 50 })
  private speed!: number;

  @Prop({ default: 'y' })
  private input!: 'x' | 'y';

  @Prop({ default: 'y' })
  private direction!: 'x' | 'y';

  @Prop()
  private minValue!: number;

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
      reflectFrom || this.$el as HTMLElement,
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

    if (typeof this.minValue === 'number') {
      this.translation.x = Math.min(this.translation.x, this.minValue);
      this.translation.y = Math.min(this.translation.y, this.minValue);
    }

    const changed = this.translation.x !== this.lastTranslation.x ||
                    this.translation.y !== this.lastTranslation.y;

    if (changed) {
      this.$emit('translate', this.translation);
      this.updateTranslation();
    }

    this.lastTranslation.y = this.translation.y;
    this.lastTranslation.x = this.translation.x;
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
