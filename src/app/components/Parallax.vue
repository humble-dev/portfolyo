<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ViewportProvider } from '@/app/providers/viewport.provider';
import { ScrollerService } from '@/app/services/scroller.service';
import { getElementOffset } from '@/app/utils/element.util';
import { map, filter, tap } from 'rxjs/operators';
import { TweenMax, Expo } from 'gsap';

enum ScrollDirection {
  X = 'x',
  Y = 'y',
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DetaultStateProgress {
  element: Coordinate;
  viewport: Coordinate;
}

interface DirectionalSpeed extends Coordinate { }

@Component<Parallax>({
  subscriptions(this) {
    return {
      viewportSize: this.viewport.changed(200),
    };
  },
})
export default class Parallax extends Vue {
  private viewport = ViewportProvider.getInstance();
  private scroller = ScrollerService.getInstance();
  private firstTween: boolean = true;
  private elementOffset: Coordinate = { x: 0, y: 0};
  private scrollPosition: Coordinate = { x: 0, y: 0 };
  private contentSize: Size = { width: 0, height: 0 };
  private currentTranslation: Coordinate = { x: 0, y: 0 };
  private currentSpeed: DirectionalSpeed = { x: 0, y: 0 };
  private currentDirection: ScrollDirection = ScrollDirection.Y;
  private viewportSize: Size = { width: 0, height: 0 };
  private elementRect: ClientRect = {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  };
  private defaultState: DetaultStateProgress = {
    element: { x: 0.5, y: 0.5 },
    viewport: { x: 0.5, y: 0.5 },
  };

  @Prop()
  private speedX!: number;

  @Prop()
  private speedY!: number;

  @Prop()
  private speed!: number;

  @Prop()
  private fillGapsContainer!: HTMLElement;

  @Prop({ default: 1 })
  private animationSpeed!: number;

  @Prop({ default: false })
  public clampToEndState!: boolean;

  @Prop({ default: false })
  public inverseTranslation!: boolean;

  @Watch('viewportSize')
  private onViewportSizeChange(size?: Size) {
    if (size) {
      this.updateElementOffset();
      this.updateElementTranslation();
      this.contentSize = {
        width: this.scroller.wrapperWidth,
        height: this.scroller.wrapperHeight,
      };
    }
  }

  public mounted() {
    if (this.speedX) {
      this.currentSpeed.x = this.speedX;
    }

    if (this.speedY) {
      this.currentSpeed.y = this.speedY;
    }

    if (this.speed) {
      this.currentSpeed.x = this.currentSpeed.y = this.speed;
    }

    setTimeout(() => {
      this.updateElementOffset();
      this.updateElementTranslation();
    });

    this.scroller.scrollAnimation$.pipe(
      map((state) => state.position),
    ).subscribe((position) => {
      this.scrollPosition.x = position.x;
      this.scrollPosition.y = position.y;

      this.updateElementTranslation();
    });
  }

  public updateElementOffset() {
    this.elementOffset = getElementOffset(this.targetElement);
    this.elementRect = this.getElementRect();
  }

  public getElementRect(): ClientRect {
    return this.targetElement.getBoundingClientRect();
  }

  private get targetElement(): HTMLElement {
    return this.$el as HTMLElement;
  }

  public updateElementTranslation() {
    if (this.scrollPosition && (this.currentSpeed.x || this.currentSpeed.y)) {
      this.updateElementOffset();

      const currentSpeed = this.currentSpeed;
      const direction = this.currentDirection;
      const viewportSize = this.viewport.size;
      const inputPosition = this.scrollPosition;

      const viewportDefaultState = this.defaultState.viewport;
      const elementDefaultState = this.defaultState.element;

      let targetOffset = this.elementOffset;
      let targetBounds = this.elementRect;

      if (this.fillGapsContainer) {
        targetBounds = this.fillGapsContainer.getBoundingClientRect();
        targetOffset = getElementOffset(this.fillGapsContainer);
      }

      if (direction === ScrollDirection.X) {
        currentSpeed.y = 0;
      }

      if (direction === ScrollDirection.Y) {
        currentSpeed.x = 0;
      }

      // The real offset of the element, respecting speed and viewport
      const defaultOffset = {
        left: Math.max(
          viewportSize.width * viewportDefaultState.x
           - targetBounds.width * elementDefaultState.x
           - targetOffset.x,
          0,
        ),
        top: Math.max(
          viewportSize.height * viewportDefaultState.y
           - targetBounds.height * elementDefaultState.y
           - targetOffset.y,
          0,
        ),
      };

      // This will fake the end position. So if the scroll position reached the end of the content
      // all parallax elements will be tweened to its end positions, so it won't get suck if the
      // default state of the viewport or element is below 1
      const offsetCompensation = {
        left: Math.max(
          targetOffset.x - (
            this.contentSize.width
            - viewportSize.width * viewportDefaultState.x
            - targetBounds.width * elementDefaultState.x
          ),
          0,
        ),
        top: Math.max(
          targetOffset.y - (
            this.contentSize.height
            - viewportSize.height * viewportDefaultState.y
            - targetBounds.height * elementDefaultState.y
          ),
          0,
        ),
      };

      const translation = {
        x: (
          (inputPosition.x + offsetCompensation.left - targetOffset.x - defaultOffset.left)
            + viewportSize.width * viewportDefaultState.x
            - targetBounds.width * elementDefaultState.x
        ) * currentSpeed.x,
        y: (
          (inputPosition.y + offsetCompensation.top - targetOffset.y - defaultOffset.top)
            + viewportSize.height * viewportDefaultState.y
            - targetBounds.height * elementDefaultState.y
        ) * currentSpeed.y,
      };

      if (direction === ScrollDirection.X || this.contentSize.width === 0) {
        translation.y = 0;
      }

      if (direction === ScrollDirection.Y || this.contentSize.height === 0) {
        translation.x = 0;
      }

      if (this.inverseTranslation) {
        const translationX = translation.x;
        const translationY = translation.y;

        translation.y = translationX;
        translation.x = translationY;
      }

      if (this.fillGapsContainer) {
        if (direction === ScrollDirection.Y) {
          if (this.inverseTranslation) {
            const endScrollPosition = targetOffset.y
              - viewportSize.height * viewportDefaultState.y
              + targetBounds.height * elementDefaultState.y;

            const scrollInputPositionTop = Math.min(
              this.contentSize.height - viewportSize.height,
              endScrollPosition + targetBounds.height + Math.abs(targetOffset.y - endScrollPosition),
            );

            const scrollInputPositionBottom = Math.max(
              0,
              endScrollPosition - targetBounds.height - (
                (viewportSize.height - viewportSize.height * viewportDefaultState.y)
                - (targetBounds.height - targetBounds.height * elementDefaultState.y)
              ),
            );

            const gapSpaceLeft = Math.abs(
              Math.ceil(
                ((scrollInputPositionTop + offsetCompensation.top - targetOffset.y - defaultOffset.top)
                  + viewportSize.height * viewportDefaultState.y
                  - targetBounds.height * elementDefaultState.y
                ) * currentSpeed.y,
              ),
            );

            const gapSpaceRight = Math.abs(
              Math.ceil(
                ((scrollInputPositionBottom + offsetCompensation.top - targetOffset.y - defaultOffset.top)
                  + viewportSize.height * viewportDefaultState.y
                  - targetBounds.height * elementDefaultState.y
                ) * currentSpeed.y,
              ),
            );

            this.targetElement.style.width = (targetBounds.width + gapSpaceLeft + gapSpaceRight) + 'px';
            this.targetElement.style.marginLeft = -gapSpaceLeft + 'px';
          } else {
            const endScrollPosition = targetOffset.y
              - viewportSize.height * viewportDefaultState.y
              + targetBounds.height * elementDefaultState.y;

            const scrollInputPositionTop = Math.min(
              this.contentSize.height - viewportSize.height,
              endScrollPosition + Math.abs(targetOffset.y - endScrollPosition),
            );

            const scrollInputPositionBottom = Math.max(
              0,
              endScrollPosition - (
                (viewportSize.height - viewportSize.height * viewportDefaultState.y)
                - (targetBounds.height - targetBounds.height * elementDefaultState.y)
              ),
            );

            const gapSpaceTop = Math.abs(
              Math.ceil(
                ((scrollInputPositionTop + offsetCompensation.top - targetOffset.y - defaultOffset.top)
                    + viewportSize.height * viewportDefaultState.y
                    - targetBounds.height * elementDefaultState.y
                ) * currentSpeed.y,
              ),
            );

            const gapSpaceBottom = Math.abs(
              Math.ceil(
                ((scrollInputPositionBottom + offsetCompensation.top - targetOffset.y - defaultOffset.top)
                  + viewportSize.height * viewportDefaultState.y
                  - targetBounds.height * elementDefaultState.y
                ) * currentSpeed.y,
              ),
            );

            this.targetElement.style.height = (targetBounds.height + gapSpaceTop + gapSpaceBottom) + 'px';
            this.targetElement.style.marginTop = -gapSpaceTop + 'px';
          }
        }
      }

      if (this.clampToEndState) {
        translation.x = currentSpeed.x <= 0
          ? translation.x < 0 ? 0 : translation.x
          : translation.y > 0 ? 0 : translation.x;
        translation.y = currentSpeed.y <= 0
          ? translation.y < 0 ? 0 : translation.y
          : translation.y > 0 ? 0 : translation.y;
      }

      const elementTop = targetOffset.y + translation.y + offsetCompensation.top * currentSpeed.y;
      const elementLeft = targetOffset.x + translation.x + offsetCompensation.left * currentSpeed.x;

      const belowViewport = elementTop > inputPosition.y + viewportSize.height;
      const aboveViewport = elementTop + targetBounds.height < inputPosition.y;

      const rightOfViewport = elementLeft > inputPosition.x + viewportSize.width;
      const leftOfViewport = elementLeft + targetBounds.width < inputPosition.x;

      const elementInViewport = !belowViewport && !aboveViewport && !rightOfViewport && !leftOfViewport;

      if (elementInViewport) {
        TweenMax.to(this.targetElement, this.firstTween ? 0 : this.animationSpeed, {
          /* rotation: isFirefox() ? 0.001 : undefined, */
          x: translation.x,
          y: translation.y,
          onUpdate: () => {
            const gsTransform = (this.targetElement as any)._gsTransform;

            this.currentTranslation.x = gsTransform.x;
            this.currentTranslation.y = gsTransform.y;
          },
          ease: Expo.easeOut, // Power1.easeOut
        });

        this.firstTween = false;
      }
    }
  }
}
</script>

<template>
  <div class="parallax-wrapper">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">

</style>
