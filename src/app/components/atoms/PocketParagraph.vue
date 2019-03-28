<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

import visibleTrigger from '~~/directives/visible-trigger.directive';

@Component({
  directives: {
    visibleTrigger
  }
})
export default class PocketParagraph extends Vue {
  public mounted() {

  }
}
</script>

<template>
  <p v-visibleTrigger="{ offset: -0.2 }">
    <slot />
  </p>
</template>

<style scoped lang="scss">
  @include responsive-width($break-md) {
    p > span {
      display: inline-block;
      overflow: hidden;
    }

    p > span > span {
      display: inline-block;
      white-space: nowrap;
      transform: translate3d(0, 100%, 0);
      transition: transform 1.3s cubic-bezier(.23,1,.32,1);
    }

    @for $i from 1 through 10 {
      p > span:nth-child(#{$i}) > span {
        transition-delay: 80ms * $i;
      }
    }

    p.visible-trigger--visible > span > span {
      transform: translate3d(0, 0, 0);
    }
  }
</style>
