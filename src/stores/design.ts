import { defineStore } from 'pinia';
import {
  __DesignFooterHeight__,
  __DesignHeaderHeight__,
  __DesignToolsWidth__,
  __GridWidth__,
  useLayoutStore,
  __GridGapWidth__,
} from './layout';

/**
 * 设计工具
 */
export enum DesignToolsEnum {
  Hand = 'hand', // 手
  Selector = 'selector', // 选择
  Wall = 'wall', // 墙
  Brash = 'brash', // 刷子
  Erase = 'erase', // 橡皮
  ZoomLens = 'zoomLens', // 缩放
  Croper = 'croper', // 裁切
  Template = 'template', // 模板
}

export type Coord = {
  x: number;
  y: number;
};

function viewportSize2canvasWrapperPadding(viewportSize: { height: number; width: number }) {
  return {
    top: viewportSize.height * 0.8,
    left: viewportSize.width * 0.8,
  };
}

export const useDesignStore = defineStore('design', {
  state: () => ({
    usingTool: DesignToolsEnum.ZoomLens, // 当前使用的工具
    canvasColsCount: 10, // 画布列数
    canvasRowsCount: 10, // 画布行数
    canvasScale: 1, // 画布缩放比例
    canvasOffset: { x: 0, y: 0 }, // 画布偏移量
    // canvasWrapperSize: { width: 0, height: 0 }, // 画布容器大小
    viewportSize: { width: 0, height: 0 }, // 画布容器大小
  }),
  getters: {
    canvasSize: ({ canvasColsCount, canvasRowsCount }) => {
      return {
        width: canvasColsCount * __GridWidth__ + __GridGapWidth__,
        height: canvasRowsCount * __GridWidth__ + __GridGapWidth__,
      };
    },
    canvasWrapperPadding: ({ viewportSize }) => {
      return viewportSize2canvasWrapperPadding(viewportSize);
    },
    canvasWrapperSize(): {
      width: number;
      height: number;
    } {
      return {
        width: this.canvasSize.width * this.canvasScale + this.canvasWrapperPadding.left * 2,
        height: this.canvasSize.height * this.canvasScale + this.canvasWrapperPadding.top * 2,
      };
    },
  },
  actions: {
    setup() {
      console.log('designStore setup');
      this.calcCanvasOffset();
    },

    // 初始化时计算画布偏移量，使画布居中
    calcCanvasOffset() {
      const layoutStore = useLayoutStore();
      // 先计算视口尺寸
      const viewportSize = {
        width: layoutStore.designSize.width - __DesignToolsWidth__,
        height: layoutStore.designSize.height - __DesignHeaderHeight__ - __DesignFooterHeight__,
      };
      this.viewportSize = viewportSize;
      // 计算画布是否需要缩放，画布初始化时至少留出20px边距
      const canvasScale = Math.min(
        1,
        (viewportSize.width - 40) / this.canvasSize.width,
        (viewportSize.height - 40) / this.canvasSize.height
      );
      this.canvasScale = canvasScale;

      const canvasWrapperPadding = viewportSize2canvasWrapperPadding(viewportSize);
      // 计算画布容器尺寸, 等于画布尺寸*画布缩放 + 画布容器内边距(每边边距为画布容器视口尺寸*0.8)
      const canvasWrapperSize = {
        width: this.canvasSize.width * canvasScale + canvasWrapperPadding.left * 2,
        height: this.canvasSize.height * canvasScale + canvasWrapperPadding.top * 2,
      };

      // 计算画布偏移量
      this.canvasOffset = {
        x: (canvasWrapperSize.width - this.canvasSize.width) / 2,
        y: (canvasWrapperSize.height - this.canvasSize.height) / 2,
      };
    },
  },
});
