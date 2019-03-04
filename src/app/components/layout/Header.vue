<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { map, tap, startWith } from 'rxjs/operators';
import anime from 'animejs';

import { NavigationService } from '@/app/services/navigation.service';
import { ScrollerService } from '@/app/services/scroller.service';

import detectSize from '@/app/directives/detect-size.directive';
import Parallax from '@/app/components/Parallax.vue';
import { ElementState } from '@/app/providers/element-state.provider';

interface NavigationLink {
  section: string;
  label: string;
}

const navigationLinks: NavigationLink[] = [
  { section: 'intro', label: 'Intro' },
  { section: 'projects', label: 'Projects' },
  { section: 'skills', label: 'Skillz' },
  { section: 'contact', label: 'Contact' },
];

interface LinkRefState {
  ref: HTMLElement;
  section: string;
  state: ElementState;
}

@Component<Header>({
  directives: {
    detectSize,
  },
  components: {
    Parallax,
  },
  subscriptions(this) {
    return {
      navMinimized: this.scroller.scrollUser$.pipe(
        map((state) => state.position.y > 200),
      ),
      activeSection: this.navigation.activeSections$.pipe(
        map((sections) => {
          const available = navigationLinks.map((l) => l.section);
          const filtered = sections.filter((s) => available.includes(s));
          const refLinks = this.linkRefStates;
          const activeSection = filtered[filtered.length - 1];
          let moveTop = 0;

          for (let i = 0, len = refLinks.length; i < len; i++) {
            const link = refLinks[i];

            if (link.section === activeSection) {
              break;
            }

            moveTop += link.state.bounds.height;
          }

          if (this.$refs.navLinksWrapper) {
            (this.$refs.navLinksWrapper as HTMLElement).style.transform = `
              translate3d(0, ${-moveTop}px, 0)
            `;
          }

          return activeSection;
        }),
      ),
    };
  },
})
export default class Header extends Vue {
  private scroller = ScrollerService.getInstance();
  private navigation = NavigationService.getInstance();
  private navigationLinks = navigationLinks;
  private navMinimized: boolean = false;
  private activeSection: string = '';
  private linkRefStates: LinkRefState[] = [];

  private handleLinkClick(
    link: NavigationLink,
    event: MouseEvent,
  ) {
    event.preventDefault();

    this.navigation.requestSectionScroll(link.section);
  }

  public mounted() {
    this.linkRefStates = (this.$refs.navLink as HTMLElement[] || []).map(
      (ref) => {
       return {
         ref,
         section: ref.getAttribute('data-section') || '',
         state: new ElementState(ref.firstElementChild as HTMLElement),
       };
      },
    );
  }
}
</script>

<template>
  <header>
    <div class="fg-container-fluid fg-wrapper-maxed">
      <div class="fg-row fg-between-xs">
        <h1>DavidePerozzi</h1>
        <div class="designation">
          <span>Interactive developer</span>
        </div>
        <nav v-detectSize.ignoreWidth :class="{ minimized: navMinimized }">
          <div class="nav-links-wrapper fx-layout fx-vertical fx-self-end" ref="navLinksWrapper">
            <a
              v-for="link in navigationLinks"
              ref="navLink"
              class="nav-link"
              v-bind:data-section="link.section"
              :href="'#' + link.section"
              :key="link.section"
              :class="{ active: activeSection === link.section }"
              @click="handleLinkClick(link, $event)"
            >
              <span ref="link">
                <span>
                  <span class="label-top"><span>{{link.label}}</span></span>
                  <span class="label-base">{{link.label}}</span>
                  <span class="label-bottom"><span>{{link.label}}</span></span>
                </span>
              </span>
            </a>
          </div>
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

  $nav-link-height: 40px;

  nav {
    pointer-events: all;
    counter-reset: navigation;
    overflow: hidden;
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
    transition: height .5s;

    &.minimized:not(:hover) {
      height: $nav-link-height !important;
    }

    .nav-links-wrapper {
      transition: transform .5s;
    }

    &:hover .nav-links-wrapper {
      transform: translate3d(0, 0, 0) !important;
    }

    /** Nav link */
    .nav-link {
      counter-increment: navigation;
      text-transform: uppercase;
      font-family: $font-neue-haas-regular;
      font-size: rem(30px);
      height: $nav-link-height;
      text-align: right;
      position: relative;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      will-change: height;
      overflow: hidden;
      backface-visibility: hidden;
      transform: translate3d(0, 0, 0);
    }

    .nav-link:after {
      content: "0" counter(navigation);
      display: block;
      position: absolute;
      font-family: inherit;
      font-size: rem(12px);
      right: 0;
      top: 6px;
      transform-origin: 0 0;
      transform: translate3d(0, -50%, 0);
    }

    .nav-link > span {
      position: relative;
      display: inline-block;
      height: 100%;
      padding: 5px 10px 5px 15px;
      transform: translate3d(0, 0, 0);

      > span {
        position: relative;
      }

      > span:after {
        content: "";
        position: absolute;
        display: block;
        top: 50%;
        left: -10px;
        width: 8px;
        height: 2px;
        backface-visibility: hidden;
        transform: translate3d(0, -50%, 0);
        background-color: $color-red;
        opacity: 0;
        transition:
          right .5s,
          left .5s,
          opacity .3s,
          height .3s,
          width .3s;
      }
    }

    .nav-link > span .label {
      &-top,
      &-bottom {
        position: absolute;
        overflow: hidden;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: transform .3s;
      }

      &-top {
        clip: rect(0 auto 20px 0);
        transform-origin: 50% 100%;
      }

      &-bottom {
        clip: rect(20px auto auto 0);
        transform-origin: 50% 0;
      }

      &-base {
        visibility: hidden;
      }
    }

    .nav-link:hover > span > span:after,
    &.minimized:not(:hover) .nav-link.active > span > span:after {
      left: -15px;
      opacity: 1;
    }

    &:not(.minimized) .nav-link.active > span > span,
    &:hover .nav-link.active > span > span {
      &:after {
        opacity: 1;
        width: calc(100% + 10px);
        left: -5px;
      }

      .label-top {
        transform: translate3d(-2px, -2px, 0);
      }

      .label-bottom {
        transform: translate3d(2px, -1px, 0);
      }
    }
  }
</style>
