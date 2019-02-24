<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { map, tap, filter } from 'rxjs/operators';

import { NavigationService } from '@/app/services/navigation.service';
import { ScrollerService } from '@/app/services/scroller.service';

import Headline from './Headline.vue';
import { ElementState } from '@/app/providers/element-state.provider';

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
  private elementState!: ElementState;
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
    this.elementState = new ElementState(this.$el as HTMLElement);

    setTimeout(() => {
      this.navigationEnabled = this.isNavigationEnbaled();
    });

    this.$observables.scrollIntoView.subscribe(() => {
      this.scroller.scrollToY(this.elementState.offset.y);
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

    return y + viewportHeight > this.elementState.offset.y;
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
      <div class="fg-col-xs-18 fg-col-md-12 fg-col-lg-10 fg-col-xl-8">
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
