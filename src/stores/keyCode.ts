/**
 * 监听按键是否被按下
 */

import { defineStore } from 'pinia';

export const useKeyCodeStore = defineStore('keyCode', {
  state: () => ({
    altKeydown: false,
    shiftKeydown: false,
    ctrlKeydown: false,
    metaKeydown: false,
    spaceKeydown: false,
  }),
  actions: {
    setup() {
      console.log('keyCodeStore setup');
      this.startListenKeys();
    },
    keyListener(event: KeyboardEvent) {
      const isKeydown = event.type === 'keydown';
      if (event.key === 'Alt' && this.altKeydown !== isKeydown) {
        this.altKeydown = isKeydown;
      }
      if (event.key === 'Shift' && this.shiftKeydown !== isKeydown) {
        this.shiftKeydown = isKeydown;
      }
      if (event.key === 'Control' && this.ctrlKeydown !== isKeydown) {
        this.ctrlKeydown = isKeydown;
      }
      if (event.key === 'Meta' && this.metaKeydown !== isKeydown) {
        this.metaKeydown = isKeydown;
      }
      if (event.code === 'Space' && this.spaceKeydown !== isKeydown) {
        this.spaceKeydown = isKeydown;
      }
    },
    startListenKeys() {
      window.addEventListener('keydown', this.keyListener);
      window.addEventListener('keyup', this.keyListener);
    },
    stopListenKeys() {
      window.removeEventListener('keydown', this.keyListener);
      window.removeEventListener('keyup', this.keyListener);
    },
  },
});
