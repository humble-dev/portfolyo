<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Section from '../Section.vue';

@Component({
  components: {
    Section,
  },
})
export default class SkillsSection extends Vue {}
</script>

<template>
  <Section name="skills" title="Skillz & Awards!" titleAlign="right" number="3">
    <div class="fg-row">
      <div class="fg-col-xs-18 fg-col-lg-9">
        <p class="bold size-lg">
          I am a full stack interactive developer with knowledge
          in a lot of technologies. If i don‘t know something
          I am really fast in learning it.
          <br /><br />
          My work got featured on several platforms
          like awwwards, cssdesignawards and more.
        </p>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss"></style>
