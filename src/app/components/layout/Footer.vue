<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ScrollerService } from '@/app/services/scroller.service';

@Component
export default class Footer extends Vue {
  private scroller = ScrollerService.getInstance();

  private scrollUp(event: Event) {
    event.preventDefault();

    this.scroller.scrollToY(0);
  }
}
</script>

<template>
  <footer>
    <div class="footer-container fg-container-fluid fg-wrapper-maxed">
      <div class="footer-wrapper fg-row fg-between-lg fg-middle-lg">
        <p class="size-md bold">Website &copy; 2019</p>
        <p class="size-sm">des. Norman Dubois, dev. Davide Perozzi</p>
        <p class="size-sm">
          <a href="#" @click="scrollUp" class="no-underline">scroll up</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
  footer {
    display: block;
  }

  .footer-wrapper {
    border-top: 3px solid $color-black;

    @include fluid-size(padding-top padding-bottom, 15px, 20px);
    @include responsive-width(0, $break-lg) {
      flex-direction: column;

      > p {
        @include fluid-size(margin-top margin-bottom, 5px, 10px);
      }
    }
  }
</style>
