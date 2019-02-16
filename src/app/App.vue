<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Section from './components/Section.vue';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';

import IntroSection from './components/sections/IntroSection.vue';
import SkillsSection from './components/sections/SkillsSection.vue';
import ContactSection from './components/sections/ContactSection.vue';
import AboutSection from './components/sections/AboutSection.vue';
import ProjectsSection from './components/sections/ProjectsSection.vue';

@Component({
  components: {
    /** Layout */
    Section,
    Footer,
    Header,

    /** Sections */
    IntroSection,
    SkillsSection,
    ContactSection,
    ProjectsSection,
    AboutSection,
  },
})
export default class App extends Vue {

}
</script>

<template>
  <div class="page-wrapper">
    <Header></Header>
    <IntroSection></IntroSection>
    <AboutSection></AboutSection>
    <ProjectsSection></ProjectsSection>
    <SkillsSection></SkillsSection>
    <ContactSection></ContactSection>
    <Footer></Footer>
  </div>
</template>

<style lang="scss">
  @import "@/styles/application.scss";
</style>
