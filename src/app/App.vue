<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Scroller } from '@smoovy/core';

import { ScrollerService } from './services/scroller.service';

import Section from './components/Section.vue';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import Scrollbar from './components/layout/Scrollbar.vue';

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
    Scrollbar,

    /** Sections */
    IntroSection,
    SkillsSection,
    ContactSection,
    ProjectsSection,
    AboutSection,
  },
})
export default class App extends Vue {
  private scrollerService = ScrollerService.getInstance();

  public mounted() {
    this.scrollerService.setRootElement(this.contentWrapper);
  }

  private get contentWrapper(): HTMLElement {
    return this.$refs.contentWrapper as HTMLElement;
  }
}
</script>

<template>
  <div class="page-wrapper">
    <Scrollbar></Scrollbar>
    <Header></Header>
    <div class="content-wrapper" ref="contentWrapper">
      <IntroSection></IntroSection>
      <AboutSection></AboutSection>
      <ProjectsSection></ProjectsSection>
      <SkillsSection></SkillsSection>
      <ContactSection></ContactSection>
      <Footer></Footer>
    </div>
  </div>
</template>

<style lang="scss">
  @import "@/styles/application.scss";

  .page-wrapper {
    display: block;
    height: 100%;
    width: 100%;
  }

  .content-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 1;
  }
</style>
