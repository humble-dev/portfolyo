import * as path from 'path';

import NuxtConfiguration from '@nuxt/config';

import favicon from './favicon.config';

export default {
  mode: 'universal',
  head: {
    title: 'Davide Perozzi | Interactive developer',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'I\'m Davide, an interactive developer from Karlsruhe'
      }
    ],
    link: [
      ...favicon
    ]
  },
  srcDir: 'src',
  css: [
    '~/assets/styles/application.scss'
  ],
  styleResources: {
    scss: ['~/assets/styles/_base.scss']
  },
  dir: {
    layouts: 'app/layouts',
    store: 'app/store',
    middleware: 'app/middleware',
    pages: 'app/pages',
    assets: 'assets',
    static: 'public'
  },
  plugins: [
    '~plugins/vue-rx.plugin',
    { src: '~/plugins/smoovy.plugin', mode: 'client' },
    { src: '~/plugins/pixi.plugin', mode: 'client' }
  ],
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources'
  ],
  build: {
    transpile: ['@smoovy/core'],
    extend(config) {
      if (config.resolve && config.resolve.alias) {
        config.resolve.alias['~~'] = path.resolve(__dirname, 'src', 'app');
      }
    }
  }
} as NuxtConfiguration;
