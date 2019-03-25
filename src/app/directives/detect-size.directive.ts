import { DirectiveOptions } from 'vue';

export default {
  inserted(el, node) {
    if ( ! el.children[0]) {
      throw new Error('[v-detectSize] You need at least one child');
    }

    (el as any).__detecSize_updateBounds__ = () => {
      setTimeout(() => {
        const childBounds = el.children[0].getBoundingClientRect();

        if ( ! node.modifiers.ignoreWidth) {
          el.style.width = childBounds.width + 'px';
        }

        if ( ! node.modifiers.ignoreHeight) {
          el.style.height = childBounds.height + 'px';
        }
      });
    };

    (el as any).__detecSize_updateBounds__();

    window.addEventListener(
      'resize',
      (el as any).__detecSize_updateBounds__,
      false,
    );
  },
  unbind(el) {
    window.removeEventListener(
      'resize',
      (el as any).__detecSize_updateBounds__,
    );
  },
} as DirectiveOptions;
