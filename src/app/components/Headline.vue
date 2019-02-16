<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Headline extends Vue {
  @Prop()
  public title!: string;

  @Prop()
  public number!: number;
}
</script>

<template>
  <div class="headline">
    <div class="text-content fx-layout fx-horizontal fx-justified">
      <p class="number size-md">N° {{number}}</p>
      <h2><p class="title upper size-lg right">{{title}}</p></h2>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .headline {
    display: block;
    border-top: 3px solid $color-black;
    color: $color-black;
    padding: 20px 0;
    margin-bottom: 200px;
  }

  .text-content > p {
    font-family: $font-neue-plak-extended-regular;
  }

  h2 {
    width: 37.5%;
  }
</style>
