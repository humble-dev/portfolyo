<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  public navigationLinks = [
    { section: 'intro', label: 'Intro' },
    { section: 'projects', label: 'Projects' },
    { section: 'skills', label: 'Skillz' },
    { section: 'contact', label: 'Contact' },
  ];
}
</script>

<template>
  <header>
    <div class="fg-container-fluid fg-wrapper-maxed">
      <div class="fg-row fg-between-xs">
        <h1>DavidePerozzi</h1>
        <div class="designation">Interactive developer</div>
        <nav class="fx-layout fx-vertical fx-self-end">
          <a
            v-for="link in navigationLinks"
            :key="link.section"
            class="nav-link" :href="link.section"
          >
            <span>{{link.label}}</span>
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
  header {
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    z-index: 110;
    padding: 80px 0;
    pointer-events: none;
  }

  h1 {
    color: $color-black;
    pointer-events: all;
    font-family: $font-neue-plak-extended-light;
    text-transform: uppercase;
    font-size: rem(40px);

    span {
      color: $color-red;
    }
  }

  .designation {
    padding-top: 5px;
    text-transform: uppercase;
    font-family: $font-neue-haas-regular;
    font-size: rem(30px);

    @include responsive-width(0, $break-md) {
      display: none;
    }
  }

  nav {
    pointer-events: all;
    padding-top: 6px;
    counter-reset: navigation;

    /** Nav link */
    .nav-link {
      counter-increment: navigation;
      text-transform: uppercase;
      font-family: $font-neue-haas-regular;
      font-size: rem(30px);
      text-align: right;
      position: relative;
      text-decoration: none;
      color: inherit;
      transition: height .5s;
      will-change: height;
      overflow: hidden;
    }

    &.minimized:not(:hover) .nav-link:not(.active) {
      height: 0 !important;
    }

    .nav-link:after {
      content: "0" counter(navigation);
      display: block;
      position: absolute;
      font-family: inherit;
      font-size: rem(12px);
      right: 0;
      top: 3px;
      transform-origin: 0 0;
      transform: translate3d(0, -50%, 0);
    }

    .nav-link span {
      position: relative;
      display: inline-block;
      padding: 5px 10px;

      &:after {
        content: "";
        position: absolute;
        display: block;
        top: 50%;
        border-radius: 50%;
        left: -10px;
        width: 5px;
        height: 5px;
        transform: translate3d(0, -50%, 0);
        background-color: $color-red;
        opacity: 0;
        transition:
          right .5s,
          left .5s,
          opacity .3s,
          height .3s,
          width .3s,
          border-radius .3s;
      }
    }

    .nav-link:not(:last-child) span {
      margin-bottom: 10px;
    }

    .nav-link:hover span:after,
    &.minimized:not(:hover) .nav-link.active span:after {
      left: 0;
      opacity: 1;
    }

    &:not(.minimized) .nav-link.active span:after,
    &:hover .nav-link.active span:after {
      opacity: 1;
      width: calc(100% - 20px);
      border-radius: 0;
      left: 10px;
      height: 3px;
    }
  }
</style>
