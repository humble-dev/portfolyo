<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Section from '../Section.vue';
import Parallax from '../Parallax.vue';

@Component({
  components: {
    Section,
    Parallax,
  },
})
export default class AboutSection extends Vue {}
</script>

<template>
  <Section name="about" title="Guy behind these pixels" number="1" titleAlign="right">
    <div class="fg-row">
      <div class="fg-col-xs-18 fg-col-md-16">
        <!-- <Parallax v-bind:speed="-100"> -->
          <p class=" bold size-xl">
            Hello. I am Davide, a creative developer based
            in Karlsruhe where I create awesome digital
            projects together with a cool team at <a href="https://dorfjungs.com/" target="_blank">Dorfjungs.</a>
          </p>
        <!-- </Parallax> -->
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
</style>
