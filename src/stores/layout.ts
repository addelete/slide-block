/**
 * 布局store
 */

import { defineStore } from 'pinia';

export interface Size {
  width: number;
  height: number;
}

export const __DesignHeaderHeight__ = 30;
export const __DesignFooterHeight__ = 24;
export const __DesignToolsWidth__ = 40;
export const __GridWidth__ = 40;
export const __GridGapWidth__ = 4;

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    designSize: {
      width: 800,
      height: 600,
    }
  }),
  actions: {
    setup() {
      console.log('layoutStore setup');
    }
  },
});