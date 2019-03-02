import { DirectiveOptions } from 'vue';

import { elementInViewportOnce } from '../helpers/element-viewport.helper';
import { ElementState } from '../providers/element-state.provider';

export default {
  inserted(el, node) {
    const elementState = new ElementState(el);

    (el as any).__scroll_subscription__ = elementInViewportOnce(
      elementState,
      100,
    ).subscribe(
        (visible) => {
          if (visible) {
            elementState.element.classList.add('visible-trigger--visible');
          } else {
            elementState.element.classList.remove('visible-trigger--visible');
          }
        },
      );
  },
  unbind(el) {
    if ((el as any).__scroll_subscription__) {
      (el as any).__scroll_subscription__.unsubscribe();
    }
  },
} as DirectiveOptions;
