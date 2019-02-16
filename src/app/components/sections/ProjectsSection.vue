<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Section from '../Section.vue';

type Projects = Project[] ;
interface Project {
  id: string;
  name: string;
  url: string;
  offset?: number;
  image?: string;
}

const projects: Projects = [
  {
    id: 'mackmedia',
    name: 'MackMedia',
    url: 'https://mackmedia.de/',
    image: 'projects.mackmedia.title',
    offset: 3,
  },
  {
    id: 'ammolite',
    name: 'Ammolite',
    url: 'https://www.ammolite-restaurant.de/',
    image: 'projects.ammolite.title',
    offset: 1,
  },
  {
    id: 'dorfjungs',
    name: 'Dorfjungs',
    url: 'https://dorfjungs.com/',
    image: 'projects.dorfjungs.title',
    offset: 4,
  },
  {
    id: 'cheers-yummy-yeah',
    name: 'YummyStories',
    url: 'https://cheers-yummy-yeah.com/',
    offset: 2,
  },
];

@Component({
  components: {
    Section,
  },
})
export default class ProjectsSection extends Vue {
  private projects: Projects = projects;
}
</script>

<template>
  <Section title="Some cool stuff I did" number="2">
    <div class="project-row fg-row" v-for="project in projects" :key="project.id">
      <a
        class="project-wrapper"
        target="_blank"
        :data-id="project.id"
        :href="project.url"
        :class="`fg-col-xs-offset-${project.offset}`"
      >
        <span>{{project.name}}</span>
      </a>
    </div>
  </Section>
</template>

<style scoped lang="scss">
  .project-wrapper {
    font-size: rem(170px);
    padding-top: 40px;
    padding-bottom: 40px;
    margin-top: 50px;
    margin-bottom: 50px;
    font-family: $font-neue-plak-extended-extra-black;
  }

  .project-wrapper a {
    // visiblity: hidden;
  }

  .project-row:not(:last-child) {
    margin-bottom: 50px;
  }
</style>
