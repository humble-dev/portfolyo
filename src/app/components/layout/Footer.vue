<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { ScrollerService } from '~~/services/scroller.service';

@Component
export default class Footer extends Vue {
  private scroller = ScrollerService.getInstance();

  private scrollUp(event: Event) {
    event.preventDefault();

    this.scroller.scrollToY(0);
  }

  private handleImprintClick(event: Event) {
    event.preventDefault();

    this.$emit('clickImprint');
  }
}
</script>

<template>
  <footer>
    <div class="footer-container fg-container-fluid fg-wrapper-maxed">
      <div class="footer-wrapper fg-row fg-between-lg fg-middle-lg">
        <p class="size-md bold">Website &copy; 2019</p>
        <p class="size-sm">
          <a href="//norman-dubois.de/" target="_blank" rel="noopener">des. Norman Dubois</a>, dev. Davide Perozzi
        </p>
        <p class="size-sm">
          <a href="#imprint" @click="handleImprintClick" class="no-underline">imprint</a>
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
