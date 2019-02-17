<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Section from '../Section.vue';

@Component({
  components: {
    Section,
  },
})
export default class IntroSection extends Vue {}
</script>

<template>
  <Section name="intro">
    <div class="fg-row">
      <p class="upper right fg-col-xs-2 fg-col-xs-offset-1">
        Available for AWESOME Freelance projects
      </p>
      <div class="designation-line designation-line-1 fg-col-xs-14 fg-col-xs-offset-1"></div>
    </div>
    <div class="fg-row">
      <div class="designation-line designation-line-2 fg-col-xs-18"></div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
  section {
    height: 100vh;
    position: relative;
  }

  .designation-line-1 {
    margin-top: 10px;
  }

  .designation-line {
    height: 40vh;
  }
</style>
