<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Headline from './Headline.vue';

@Component({
  components: {
    Headline,
  },
})
export default class Section extends Vue {
  @Prop({ default: '' })
  private title!: string;

  @Prop({ default: 1 })
  private number!: string;

  @Prop({ default: 'left' })
  private titleAlign!: 'left' | 'right';
}
</script>

<template>
  <section class="fg-container-fluid fg-wrapper-maxed">
    <div
      v-if="title"
      class="fg-row"
      :class="{
        'fg-end-xs': titleAlign === 'right',
        'fg-start-xs': titleAlign === 'left'
      }"
    >
      <div class="fg-col-xs-8">
        <Headline :title="title" :number="number"></Headline>
      </div>
    </div>
    <slot></slot>
  </section>
</template>

<style scoped lang="scss">
  section {
    padding-top: 200px;
    padding-bottom: 200px;
    min-height: 100%;
  }
</style>
