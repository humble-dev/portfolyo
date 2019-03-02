<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Section from '../Section.vue';

@Component({
  components: {
    Section,
  },
})
export default class ContactSection extends Vue {}
</script>

<template>
  <Section name="contact" v-bind:title="`Wanna work \n with me?`" titleAlign="left" number="4">
    <div class="fg-row">
      <div class="fg-col-lg-offset-1 fg-col-xs-18 fg-col-lg-5">
        <p class="size-xl bold">Just send me an <a href="mailto:yo@davideperozzi.de">email</a></p>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
</style>
