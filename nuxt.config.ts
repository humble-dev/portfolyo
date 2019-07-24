import * as path from 'path';

import NuxtConfiguration from '@nuxt/config';

import favicon from './favicon.config';

const url = 'https://davideperozzi.com';
const meta = {
  title: 'Davide Perozzi | Creative developer',
  description: 'I\'m Davide, a creative developer based in Karlsruhe. '
    + 'I create cool digital projects with a like minded team at Dorfjungs',
  image: url + '/resources/og-image.png'
};

export default {
  mode: 'universal',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  head: {
    title: meta.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'description', name: 'description', content: meta.description },
      { name: 'apple-mobile-web-app-title', content: meta.title },

      /** Item scope defs */
      { itemprop: 'name', content: meta.title },
      { itemprop: 'description', content: meta.description },
      { itemprop: 'image', content: meta.image },

      /** Open Graph */
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:site_name', content: meta.title },
      { property: 'og:title', content: meta.title },
      { property: 'og:description', content: meta.description },
      { property: 'og:image', content: meta.image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },

      /** Twitter */
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@davideperozzi1' },
      { name: 'twitter:creator', content: '@davideperozzi1' },
      { name: 'twitter:title', content: meta.title },
      { name: 'twitter:description', content: meta.description },
      { name: 'twitter:image', content: meta.image },
    ],
    link: [
      { rel: 'canonical', href: url },
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
  workbox: {
    cacheAssets: false,
    offline: false
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
