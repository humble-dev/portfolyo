<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';

import { RelatedImageContainer, RelatedImageContainerStretch } from '@/app/canvas/containers/related-image.container';
import { CanvasDelegatorService } from '@/app/services/canvas-delegator.service';
import {
  RelatedTextContainer,
  RelatedTextContainerStretch,
  RelatedTextContainerConfig,
} from '@/app/canvas/containers/related-text.container';
import { DisplacementConfig } from '@/app/canvas/extras/displacement.extra';
import { ScrollerService } from '@/app/services/scroller.service';

import Parallax from '../Parallax.vue';
import Section from '../Section.vue';
import KeywordList from './Projects/KeywordList.vue';
import { Resolver } from '@/app/utils/promise.util';

type Projects = Project[];
interface Project {
  id: string;
  name: string;
  url: string;
  keywords: string[];
  offset?: { [bp: string]: number };
  image?: string;
}

const projects: Projects = [
  {
    id: 'mackmedia',
    name: 'MackMedia',
    url: 'https://mackmedia.de/',
    image: 'projects.mackmedia.title',
    keywords: [ 'Angular', 'Animation', 'Backend', 'Greensock', 'Google Closure' ],
    offset: {
      xs: 0,
      lg: 1,
      xxl: 3,
    },
  },
  {
    id: 'ammolite',
    name: 'Ammolite',
    url: 'https://www.ammolite-restaurant.de/',
    image: 'projects.ammolite.title',
    keywords: [ 'Angular', 'Animation', 'Backend', 'Greensock', 'Google Closure' ],
    offset: {
      xs: 0,
      lg: 1,
    },
  },
  {
    id: 'grape-garage',
    name: 'Grape Garage',
    url: 'https://grapegarage.de/',
    keywords: [ 'Angular', 'Animation', 'Backend', 'Greensock', 'Google Closure' ],
    offset: {
      xs: 0,
      lg: 1,
      xxl: 2,
    },
  },
  {
    id: 'dorfjungs',
    name: 'Dorfjungs',
    url: 'https://dorfjungs.com/',
    image: 'projects.dorfjungs.title',
    keywords: [ 'Angular', 'Animation', 'Backend', 'Greensock', 'Google Closure' ],
    offset: {
      xs: 0,
      lg: 1,
      xl: 4,
    },
  },
  {
    id: 'bandevier',
    name: 'MUELLER',
    url: 'https://bandevier.de/',
    keywords: [ 'Angular', 'Animation', 'Backend', 'Greensock', 'Google Closure' ],
    offset: {
      xs: 0,
      lg: 1,
      xxl: 2,
    },
  },
];

@Component({
  components: {
    Section,
    Parallax,
    KeywordList,
  },
})
export default class ProjectsSection extends Vue {
  private projects: Projects = projects;
  private canvasDelegator = CanvasDelegatorService.getInstance();
  private scrollerService = ScrollerService.getInstance();
  private textContainers: { [id: string]: RelatedTextContainer } = {};
  private imageContainers: { [id: string]: RelatedImageContainer } = {};

  public mounted() {
    const wrappers = this.$refs.projectWrapper as HTMLElement[];

    wrappers.forEach((element, index) => {
      const id = element.getAttribute('data-id');
      const project = this.projects.find((p) => p.id === id);

      if (id && project && ! this.textContainers.hasOwnProperty(id)) {
        const textContainer = new RelatedTextContainer(
          element,
          project.name.toUpperCase(),
          {
            centerVertical: true,
            stretchMode: RelatedTextContainerStretch.FIT_WIDTH,
            fontFamily: 'Neue Plak Extended Bold',
            fontSize: 180,
            padding: 20,
            fill: 0x000000,
          },
        );

        this.textContainers[id] = textContainer;

        textContainer.enableParallax(
          true,
          {
            speed: index % 2 === 0 ? 100 : -100,
            direction: 'x',
          },
        );

        this.canvasDelegator.addContainer(
          'background',
          textContainer,
        );
      }

      if (project && id && project.image && ! this.imageContainers.hasOwnProperty(id)) {
        const imageContainer = new RelatedImageContainer(
          element,
          project.image,
          {
            scale: .7,
            index: 5,
            hidden: true,
            stretchMode: RelatedImageContainerStretch.FIT_WIDTH,
            centerHorizontal: true,
            centerVertical: true,
          },
        );

        this.imageContainers[id] = imageContainer;

        imageContainer.enableParallax(
          true,
          {
            speed: index % 2 === 0 ? 100 : -100,
            direction: 'x',
          },
        );

        this.canvasDelegator.addContainer(
          'background',
          imageContainer,
        );
      }
    });

    const headlineContainer = new RelatedTextContainer(
      this.workHeadline,
      this.workHeadline.innerHTML,
      {
        fontFamily: 'Neue Plak Extended ExtraBlack',
        stretchMode: RelatedTextContainerStretch.NONE,
        fill: 'transparent',
        stroke: 0x00000,
        strokeThickness: 1,
        padding: 4,
        fontSize: 200,
        rotation: -90,
        anchorX: 1,
        anchorY: -0.2,
        // Adjust the horizontal positioning due the rotation
        sync: (text, context, viewportSize) => {
          context.x = viewportSize.width - text.height;
        },
      },
    );

    headlineContainer.enableDisplacement(true, { scaleX: 5, scaleY: 5 });
    headlineContainer.enableParallax(true, { speed: 300, direction: 'y' });

    this.canvasDelegator.addContainer(
      'background',
      headlineContainer,
    );
  }

  private getImageContainer(id: string): RelatedImageContainer|undefined {
    return this.imageContainers[id];
  }

  private getTextContainer(id: string): RelatedTextContainer|undefined {
    return this.textContainers[id];
  }

  private enableDisplacement(
    project: Project,
    enabled: boolean = true,
  ) {
    const image = this.getImageContainer(project.id);
    const text = this.getTextContainer(project.id);

    if (image) {
      image.enableDisplacement(
        enabled,
        {
          scaleX: 50,
          scaleY: 50,
          scaleDuration: 0,
        }
      ).then((extra) => {
        extra.scaleFilter(
          5,
          5,
          800
        );
      });

      image.enableVisibility(enabled);
      image.enableMouseMotion(
        enabled,
        {
          minX: -40,
          maxX: 40,
          minY: -40,
          maxY: 40,
        }
      );
    }

    if (text) {
      text.enableDisplacement(
        enabled,
        {
          scaleX: 10,
          scaleY: 10,
          scaleDuration: 2000,
        }
      );
    }
  }

  private offsetClasslist(project: Project): string {
    const classlist = [];

    if (project.offset) {
      for (const bp in project.offset) {
        if (project.offset.hasOwnProperty(bp)) {
          classlist.push(`fg-col-${bp}-offset-${project.offset[bp]}`);
        }
      }
    }

    return classlist.join(' ');
  }

  private get workHeadline(): HTMLElement {
    return this.$refs.workHeadline as HTMLElement;
  }
}
</script>

<template>
  <Section name="projects" v-bind:title="`Some cool \n stuff I did`" number="2">
    <div class="project-section-wrapper">
      <h2 class="work-headline" ref="workHeadline">WORK</h2>
      <div class="project-row fg-row" v-for="(project, index) in projects" :key="project.id">
        <div
          class="project-wrapper"
          @mouseenter="enableDisplacement(project, true)"
          @mouseleave="enableDisplacement(project, false)"
          :class="offsetClasslist(project)"
        >
          <a target="_blank" rel="noopener" :href="project.url"></a>
          <div
            ref="projectWrapper"
            :data-id="project.id"
            class="project-label"
          >{{project.name}}</div>
          <Parallax class="keyword-container" v-bind="{
            reflectFrom: [ $refs, 'projectWrapper', index ],
            speed: index % 2 === 0 ? 100 : -100,
            direction: 'x'
          }">
            <KeywordList :keywords="project.keywords" />
          </Parallax>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
  .project-section-wrapper {
    position: relative;
  }

  .keyword-container {
    width: 100%;
  }

  .project-wrapper {
    text-decoration: none;
    display: block;
    position: relative;
    text-transform: uppercase;

    @include fluid-size(padding-top padding-bottom, 20px, 40px);

    .project-label {
      visibility: hidden;
      font-family: $font-neue-plak-extended-extra-black;
      color: $color-black;

      @include fluid-size(font-size, 50px, 130px);
    }

    > a {
      position: absolute;
      top: 0;
      bottom: 0;
      left: -100px;
      right: -100px;
    }
  }

  .project-row:not(:last-child) {
    @include fluid-size(margin-bottom, 40px, 200px);
  }

  .work-headline {
    position: absolute;
    visibility: hidden;
    right: 0;
    font-size: 200px;
    color: $color-black;
    top: 5%;
    font-family: $font-neue-plak-extended-extra-black;
    transform-origin: 100% 100%;
    transform: rotate(-90deg);

    @include fluid-size(
      margin-right,
      -$fx-grid-outer-margin-min,
      -$fx-grid-outer-margin-max
    );
  }
</style>
