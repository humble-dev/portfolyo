<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { map, tap, filter } from 'rxjs/operators';

import { NavigationService } from '@/app/services/navigation.service';
import { ScrollerService } from '@/app/services/scroller.service';

import Headline from './Headline.vue';

@Component<Section>({
  components: {
    Headline,
  },
  subscriptions(this) {
    return {
      navigationEnabled: this.scroller.scrollUser$.pipe(
        filter(() => this.initialized),
        map((state) => this.isNavigationEnbaled(state.position.y)),
      ),
      scrollIntoView: this.navigation.sectionScrollRequests$.pipe(
        filter((section) => section === this.name),
        map((section) => section === this.name),
      ),
    };
  },
})
export default class Section extends Vue {
  protected initialized: boolean = false;
  private scroller = ScrollerService.getInstance();
  private navigation = NavigationService.getInstance();
  private navigationEnabled: boolean = false;

  @Prop()
  private name!: string;

  @Prop({ default: '' })
  private title!: string;

  @Prop({ default: 1 })
  private number!: string;

  @Prop({ default: 'left' })
  private titleAlign!: 'left' | 'right';

  public mounted() {
    this.initialized = true;

    setTimeout(() => {
      this.navigationEnabled = this.isNavigationEnbaled();
    });

    this.$observables.scrollIntoView.subscribe(() => {
      this.scroller.scrollToY(this.elementBounds.top);
    });
  }

  @Watch('navigationEnabled')
  private onNavigationEnabled(
    enabled: boolean,
    oldValue: boolean,
  ) {
    if (enabled !== oldValue) {
      setTimeout(() => {
        this.navigation.enableSection(this.name, !!enabled);
      });
    }
  }

  protected isNavigationEnbaled(y: number = 0): boolean {
    const viewportHeight = this.scroller.containerHeight * .4;

    return y + viewportHeight > this.offsetY;
  }

  protected get offsetY(): number {
    return Math.ceil(this.elementBounds.top - this.scroller.wrapperTop);
  }

  protected get elementBounds(): ClientRect {
    return this.$el.getBoundingClientRect();
  }
}
</script>

<template>
  <section class="fg-container-fluid fg-wrapper-maxed">
    <div
      v-if="title"
      class="fg-row"
      :class="{
        'fg-end-xs': titleAlign === 'right',
        'fg-start-xs': titleAlign === 'left'
      }"
    >
      <div class="fg-col-xs-18 fg-col-md-12 fg-col-lg-8">
        <Headline :title="title" :number="number"></Headline>
      </div>
    </div>
    <slot></slot>
  </section>
</template>

<style scoped lang="scss">
  section {
    padding-top: 200px;
    padding-bottom: 200px;
    min-height: 100%;
  }
</style>
