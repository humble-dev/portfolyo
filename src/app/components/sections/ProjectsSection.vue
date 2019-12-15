<script lang="ts">
import { Component, Watch, Vue, Inject } from 'nuxt-property-decorator';

import { DefaultContainer } from '~~/canvas/default.container';
import { MouseTwist } from '~~/canvas/extras/mouse-twist.extra';
import { RelatedContainer } from '~~/canvas/related.container';
import {
  RelatedImageContainer,
  RelatedImageContainerStretch,
} from '~~/canvas/containers/related-image.container';
import {
  CanvasDelegatorService,
} from '~~/services/canvas-delegator.service';
import {
  RelatedTextContainer,
  RelatedTextContainerStretch,
  RelatedTextContainerConfig,
} from '~~/canvas/containers/related-text.container';
import { DisplacementConfig, Displacement } from '~~/canvas/extras/displacement.extra';
import { ScrollerService } from '~~/services/scroller.service';
import { Resolver } from '~~/utils/promise.util';

import Parallax from '../Parallax.vue';
import Section from '../Section.vue';
import KeywordList from './Projects/KeywordList.vue';

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
    id: 'roots',
    name: 'roots',
    url: 'https://rootsandfriends.com/',
    image: 'projects.roots.title',
    keywords: [
      'Docker',
      'Swarm',
      'Headless',
      'Scrolling',
      'Parallax',
      'Restaurant',
      'React',
      'Nextjs',
      'smoovy',
      'Directus'
    ],
    offset: {
      xs: 0,
      lg: 0,
      xxl: 2,
    },
  },
  {
    id: 'mackmedia',
    name: 'Mack&shy;Media',
    url: 'https://mackmedia.de/',
    image: 'projects.mackmedia.title',
    keywords: [
      'Google Closure',
      'JavaScript',
      'PHP',
      'SCSS',
      'Parallax',
      'Page-Transitions',
      'Twig',
      'Animations',
      'Wordpress',
      'GreenSock',
    ],
    offset: {
      xs: 0,
      lg: 0,
      xxl: 3,
    },
  },
  {
    id: 'ammolite',
    name: 'Ammolite',
    url: 'https://www.ammolite-restaurant.de/',
    image: 'projects.ammolite.title',
    keywords: [
      'Wordpress',
      'Animations',
      'JavaScript',
      'Twig',
      'Parallax',
      'Google Closure',
      'PHP',
      'GreenSock',
      'SCSS',
    ],
    offset: {
      xs: 0,
      lg: 3,
    },
  },
  {
    id: 'grape-garage',
    name: 'Grape Garage',
    url: 'https://grapegarage.de/',
    image: 'projects.grape-garage.title',
    keywords: [
      'Animations',
      'JavaScript',
      'Google Closure',
      'Twig',
      'Blockhain',
      'Parallax',
      'Fancy forms',
      'PHP',
      'GreenSock',
      'SCSS',
    ],
    offset: {
      xs: 0,
      lg: 0,
      xxl: 2,
    },
  },
  {
    id: 'dorfjungs',
    name: 'Dorfjungs',
    url: 'https://dorfjungs.com/',
    image: 'projects.dorfjungs.title',
    keywords: [
      'Laravel',
      'Google Closure',
      'PHP',
      'Blade',
      'Animations',
      'What\'s better than cat videos!?',
      'JavaScript',
      'GreenSock',
      'Made in 2 days',
      'SCSS',
    ],
    offset: {
      xs: 0,
      lg: 2,
      xl: 4,
    },
  },
  {
    id: 'bandevier',
    name: 'MUELLER',
    url: 'https://bandevier.de/',
    image: 'projects.bandevier.title',
    keywords: [
      'Google Closure',
      'Animations',
      'Parallax',
      'Soy',
      'JavaScript',
      'GreenSock',
      'Version 3',
      'SCSS',
    ],
    offset: {
      xs: 0,
      lg: 0,
      xxl: 2,
    },
  },
  {
    id: 'portfolio',
    name: 'My portfolio',
    url: 'https://davideperozzi.de/',
    image: 'projects.portfolio.title',
    keywords: [
      'Vue',
      'WebGL',
      'Animations',
      'Parallax',
      'Random buzzword',
      'Smooth scrolling',
      'Displacement',
      'Developer',
      'JavaScript',
      'aminejs',
      'SCSS',
    ],
    offset: {
      xs: 0,
      lg: 2,
      xxl: 4,
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
  private spriteContainers: {
    [id: string]: {
      container: RelatedImageContainer,
      displacement: Displacement
    },
  } = {};

  @Inject('glConfig')
  protected glConfig!: { enabled: boolean, partially: boolean };

  public mounted() {
    const wrappers = this.$refs.projectWrapper as HTMLElement[];

    wrappers.forEach((element, index) => {
      const id = element.getAttribute('data-id');
      const project = this.projects.find((p) => p.id === id);

      if (id && project && ! this.textContainers.hasOwnProperty(id)) {
        const textContainer = new RelatedTextContainer(
          element,
          project.name.toUpperCase().replace(/&shy;/gi, ''),
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

      if (project && id && ! this.spriteContainers.hasOwnProperty(id)) {
        let spriteContainer: RelatedImageContainer | undefined;

        if (project.image) {
          spriteContainer = new RelatedImageContainer(
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
        }

        if (spriteContainer) {
          this.canvasDelegator.addContainer(
            'foreground',
            spriteContainer,
          );

          spriteContainer.enableParallax(
            true,
            {
              speed: index % 2 === 0 ? 100 : -100,
              direction: 'x',
            },
          );

          spriteContainer.enableDisplacement(
            true,
            {
              scaleX: 100,
              scaleY: 100,
            }
          ).then((displacement) => {
            if (spriteContainer) {
              this.spriteContainers[id] = {
                container: spriteContainer,
                displacement
              };
            }
          });
        }
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
        fontSize: 210,
        rotation: -90,
        anchorX: 1,
        anchorY: -0.2,
        sync: (text, context, viewportSize) => {
          // Adjust the horizontal positioning due the rotation
          context.x = viewportSize.width - text.height;
        },
      },
    );

    // headlineContainer.enableDisplacement(true, { scaleX: 5, scaleY: 5 });
    headlineContainer.enableParallax(true, { speed: 300, direction: 'y' });

    this.canvasDelegator.addContainer(
      'background',
      headlineContainer,
    );
  }

  private getSpriteContainer(
    id: string,
  ): RelatedImageContainer|undefined {
    return (this.spriteContainers[id] || {}).container;
  }

  private getSpriteDisplacement(id: string): Displacement|undefined {
    return (this.spriteContainers[id] || {}).displacement;
  }

  private getTextContainer(id: string): RelatedTextContainer|undefined {
    return this.textContainers[id];
  }

  private enableDisplacement(
    project: Project,
    enabled: boolean = true,
  ) {
    const sprite = this.getSpriteContainer(project.id);
    const spriteDisplacement = this.getSpriteDisplacement(project.id);
    const text = this.getTextContainer(project.id);

    if (sprite) {
      sprite.enableMouseTwist(enabled, {
        radius: 200,
        angle: 10,
        padding: 500,
      });

      if (spriteDisplacement) {
        if (enabled) {
          spriteDisplacement.scaleFilter(0, 0, 1000);
        } else {

          spriteDisplacement.scaleFilter(100, 100, 1000);
        }
      }

      sprite.enableVisibility(enabled);
      sprite.enableMouseMotion(
        enabled,
        {
          minX: -20,
          maxX: 20,
          minY: -20,
          maxY: 20,
        },
      );
    }

    if (text) {
      text.enableMouseMotion(
        enabled,
        {
          minX: -10,
          maxX: 10,
          minY: 0,
          maxY: 0,
        },
      );

      text.enableDisplacement(
        enabled,
        {
          scaleX: 15,
          scaleY: 15,
          moveSpeedX: .4,
          moveSpeedY: .4,
          scaleDuration: 1500,
        },
      );
    }
  }

  private offsetClasslist(project: Project): string {
    const classlist: string[] = [];

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
  <Section name="projects" v-bind:title="`Stuff I did`" number="2">
    <div class="project-section-wrapper">
      <h2 class="work-headline" ref="workHeadline">WORK</h2>
      <div class="project-row fg-row" v-for="(project, index) in projects" :key="project.id">
        <component
          :is="glConfig.partially ? 'Parallax' : 'div'"
          class="project-wrapper"
          :speed="index % 2 === 0 ? 100 : -100"
          :direction="'x'"
          @mouseenter="enableDisplacement(project, true)"
          @mouseleave="enableDisplacement(project, false)"
          :class="offsetClasslist(project)"
        >
          <a target="_blank" rel="noopener" :href="project.url"></a>
          <div
            ref="projectWrapper"
            :data-id="project.id"
            class="project-label"
            v-html="project.name"
          ></div>
          <Parallax class="keyword-container" v-bind="{
            reflectFrom: [ $refs, 'projectWrapper', index ],
            speed: index % 2 === 0 ? 100 : -100,
            direction: 'x'
          }">
            <KeywordList :keywords="project.keywords" />
          </Parallax>
        </component>
      </div>
    </div>
  </Section>
</template>

<style scoped lang="scss">
  .project-section-wrapper {
    position: relative;
  }

  .keyword-list {
    position: absolute;
    left: 0;
    right: 0;
  }

  .keyword-container {
    position: relative;
    width: 100%;

    html:not(.gl-disabled) & {
      @include fluid-size(margin-top, -2px, -7px);
    }

    .gl-disabled & {
      transform: translate3d(0, 0, 0) !important;

      @include fluid-size(margin-top, 8px, 5px);
    }
  }

  .project-wrapper {
    text-decoration: none;
    display: block;
    position: relative;
    text-transform: uppercase;

    @include fluid-size(padding-top padding-bottom, 20px, 40px);

    @include responsive-width(0, $break-lg) {
      transform: none !important;
    }

    .gl-disabled & {
      @include responsive-width(0, $break-md) {
        width: 100%;
      }
    }

    .project-label {
      font-family: $font-neue-plak-extended-bold;
      color: $color-black;

      @include fluid-size(font-size, 40px, 130px);

      html.gl-disabled.gl-disabled-partially & {
        transition: color .8s, -webkit-text-stroke-color .8s;
        -webkit-text-stroke: 1px $color-black;
      }

      html:not(.gl-disabled) & {
        white-space: nowrap;
        visibility: hidden;
      }
    }

    > a {
      position: absolute;
      top: 0;
      bottom: 0;
      left: -100px;
      right: -100px;
    }

    > a:hover + .project-label {
      color: transparent;
      -webkit-text-stroke-color: $color-black;
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
