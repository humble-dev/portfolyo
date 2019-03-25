<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

import IntroSection from '~~/components/sections/IntroSection.vue';
import SkillsSection from '~~/components/sections/SkillsSection.vue';
import ContactSection from '~~/components/sections/ContactSection.vue';
import AboutSection from '~~/components/sections/AboutSection.vue';
import ProjectsSection from '~~/components/sections/ProjectsSection.vue';

@Component({
  components: {
    IntroSection,
    SkillsSection,
    ContactSection,
    AboutSection,
    ProjectsSection
  }
})
export default class Index extends Vue {}
</script>

<template>
  <div class="index-page-wrapper">
    <IntroSection></IntroSection>
    <AboutSection></AboutSection>
    <ProjectsSection></ProjectsSection>
    <SkillsSection></SkillsSection>
    <ContactSection></ContactSection>
  </div>
</template>

<style lang="scss" scoped>
</style>
