/**
 * 布局store
 */

import { defineStore } from 'pinia';

export interface Size {
  width: number;
  height: number;
}



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