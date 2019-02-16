<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {}
</script>

<template>
  <footer>
    <div class="footer-container fg-container-fluid fg-wrapper-maxed">
      <div class="footer-wrapper fg-row fg-between-xs fg-middle-xs">
        <p class="size-md bold">Website &copy; 2019</p>
        <p class="size-sm">Norman Dubois (design) and Davide Perozzi (dev)</p>
        <p class="size-sm">scroll up</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
  footer {
    display: block;
    padding-bottom: 80px;
  }

  .footer-wrapper {
    border-top: 3px solid $color-black;
    padding: 20px 0;
  }
</style>
