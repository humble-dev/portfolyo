<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Scroller } from '@smoovy/core';

import * as PIXI from 'pixi.js';

import { ScrollerService } from './services/scroller.service';
import { CanvasDelegatorService } from './services/canvas-delegator.service';

import { MainBackgroundContainer } from './canvas/containers/main-background.container';

import { ElementStateProvider } from '@/app/providers/element-state.provider';
import { ViewportProvider } from '@/app/providers/viewport.provider';

import Section from './components/Section.vue';
import Canvas from './components/Canvas.vue';
import Preloader from './components/Preloader.vue';
import Scrollbar from './components/layout/Scrollbar.vue';
import Parallax from './components/Parallax.vue';

import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';

import IntroSection from './components/sections/IntroSection.vue';
import SkillsSection from './components/sections/SkillsSection.vue';
import ContactSection from './components/sections/ContactSection.vue';
import AboutSection from './components/sections/AboutSection.vue';
import ProjectsSection from './components/sections/ProjectsSection.vue';

@Component({
  components: {
    /** Main */
    Scrollbar,
    Canvas,
    Section,
    Preloader,
    Parallax,

    /** Layout */
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
  private scrollerService = ScrollerService.getInstance();
  private canvasDelegator = CanvasDelegatorService.getInstance();
  private elementState = ElementStateProvider.getInstance();
  private viewport = ViewportProvider.getInstance();
  private scroller = ScrollerService.getInstance();

  public mounted() {
    PIXI.utils.skipHello();

    // Enable scroller
    this.scrollerService.setRootElement(this.contentWrapper);

    // Add main background
    this.canvasDelegator.addContainer(
      'background',
      new MainBackgroundContainer(),
    );

    // Manage element states
    setTimeout(() => this.elementState.update());

    this.viewport.changed(200).subscribe(() => {
      this.elementState.update();
    });
  }

  private get backgroundCanvas(): Canvas {
    return this.$refs.backgroundCanvas as Canvas;
  }

  private get contentWrapper(): HTMLElement {
    return this.$refs.contentWrapper as HTMLElement;
  }
}
</script>

<template>
  <div class="page-wrapper">
    <!-- <Scrollbar></Scrollbar> -->
    <Header></Header>
    <Canvas ref="backgroundCanvas" name="background"></Canvas>
    <div class="content-wrapper" ref="contentWrapper">
      <IntroSection></IntroSection>
      <AboutSection></AboutSection>
      <ProjectsSection></ProjectsSection>
      <SkillsSection></SkillsSection>
      <ContactSection></ContactSection>
      <Footer></Footer>
    </div>
    <Preloader></Preloader>
  </div>
</template>

<style lang="scss">
  @import "@/styles/application.scss";

  .canvas-wrapper--background {
    z-index: 0;
  }

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
