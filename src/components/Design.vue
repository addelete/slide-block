<template>
  <div
    class="design"
    :style="{
      width: `${layoutStore.designSize.width}px`,
      height: `${layoutStore.designSize.height}px`,
    }"
  >
    <div class="design__header">
      <design-header />
    </div>
    <div class="design__body">
      <design-tools />
      <div
        class="design-viewport"
        ref="viewportRef"
        :class="{
          move:
            designStore.usingTool === DesignToolsEnum.Hand ||
            keyCodeStore.spaceKeydown,
          'zoom-out':
            designStore.usingTool === DesignToolsEnum.ZoomLens &&
            keyCodeStore.altKeydown &&
            !keyCodeStore.spaceKeydown,
          'zoom-in':
            designStore.usingTool === DesignToolsEnum.ZoomLens &&
            !keyCodeStore.altKeydown &&
            !keyCodeStore.spaceKeydown,
        }"
        :style="{
          width: `${designStore.viewportSize.width}px`,
          height: `${designStore.viewportSize.height}px`,
        }"
        @mousedown="onViewportMouseDown"
        @wheel="onViewportWheel"
      >
        <div
          class="design-canvas-wrapper"
          ref="canvasWrapperRef"
          :style="{
            width: `${designStore.canvasWrapperSize.width}px`,
            height: `${designStore.canvasWrapperSize.height}px`,
            paddingTop: `${designStore.canvasWrapperPadding.top}px`,
            paddingLeft: `${designStore.canvasWrapperPadding.left}px`,
          }"
        >
          <div
            class="design-canvas-zoom"
            ref="canvasZoomRef"
            :style="{
              width: `${designStore.canvasSize.width}px`,
              height: `${designStore.canvasSize.height}px`,
              transform: `scale(${designStore.canvasScale})`,
            }"
          >
            <design-canvas />
          </div>
        </div>
      </div>
    </div>
    <div class="design__footer">
      <design-footer />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLayoutStore } from "@src/stores/layout";
import { DesignToolsEnum, useDesignStore } from "@src/stores/design";
import { useKeyCodeStore } from "@src/stores/keyCode";
import DesignTools from "./DesignTools.vue";
import DesignCanvas from "./DesignCanvas.vue";
import DesignHeader from "./DesignHeader.vue";
import DesignFooter from "./DesignFooter.vue";
import { onMounted, ref } from "vue";

const layoutStore = useLayoutStore();
const designStore = useDesignStore();
const keyCodeStore = useKeyCodeStore();

const viewportRef = ref<HTMLElement>();
const canvasWrapperRef = ref<HTMLElement>();
const canvasZoomRef = ref<HTMLElement>();

const canvasZoomOrigin = ref({ x: 0, y: 0 });
const canvasZoomTranslate = ref({ x: 0, y: 0 });

onMounted(() => {
  // 初始化Viewport的滚动条位置
  const initViewportScroll = () => {
    const viewportScroll = {
      left:
        (designStore.canvasWrapperSize.width - designStore.viewportSize.width) /
        2,
      top:
        (designStore.canvasWrapperSize.height -
          designStore.viewportSize.height) /
        2,
    };
    if (viewportRef.value) {
      viewportRef.value.scrollLeft = viewportScroll.left;
      viewportRef.value.scrollTop = viewportScroll.top;
    } else {
      initViewportScroll();
    }
  };
  initViewportScroll();
});

/**
 * 鼠标拖动canvas wapper效果
 * 通过鼠标拖动计算viewport的滚动条位置实现
 */
const moveCanvasWrapperByMouse = (e: MouseEvent) => {
  if (!viewportRef.value) {
    return;
  }
  if (
    designStore.usingTool !== DesignToolsEnum.Hand &&
    !keyCodeStore.spaceKeydown
  ) {
    return;
  }

  const newScrollLeft = Math.min(
    Math.max(0, viewportRef.value.scrollLeft - e.movementX),
    designStore.canvasWrapperSize.width
  );
  const newScrollTop = Math.min(
    Math.max(0, viewportRef.value.scrollTop - e.movementY),
    designStore.canvasWrapperSize.height
  );
  viewportRef.value.scrollTo(newScrollLeft, newScrollTop);
};

/**
 * 停止鼠标拖动canvas wrapper
 */
const stopMoveCanvasWrapperByMouse = () => {
  document.removeEventListener("mousemove", moveCanvasWrapperByMouse);
  document.removeEventListener("mouseup", stopMoveCanvasWrapperByMouse);
};

const zoomCanvasWrapperByMouse = (e: MouseEvent) => {
  if (!canvasZoomRef.value) {
    return;
  }
  if (designStore.usingTool !== DesignToolsEnum.ZoomLens) {
    return;
  }
  if (keyCodeStore.spaceKeydown) {
    return;
  }

  const isZoomIn = !keyCodeStore.altKeydown;
  const currentCanvasScale = designStore.canvasScale;
  const newCanvasScale = Math.min(
    3,
    Math.max(0.1, currentCanvasScale + (isZoomIn ? 0.1 : -0.1))
  );
  if (newCanvasScale === currentCanvasScale) {
    return;
  }
  const canvasZoomEl = canvasZoomRef.value;
  const canvasZoomRect = canvasZoomEl.getBoundingClientRect();
  const viewport = viewportRef.value!;
  const viewportRect = viewport.getBoundingClientRect();
  const canvasWrapper = canvasWrapperRef.value!;
  const canvasWrapperRect = canvasWrapper.getBoundingClientRect();

  const newCanvasZoomSize = {
    width: designStore.canvasSize.width * newCanvasScale,
    height: designStore.canvasSize.height * newCanvasScale,
  };
  const mouseInOldCanvasCoords = {
    x: e.clientX - canvasZoomRect.left,
    y: e.clientY - canvasZoomRect.top,
  };
  const mouseInNewCanvasCoords = {
    x: (mouseInOldCanvasCoords.x / currentCanvasScale) * newCanvasScale,
    y: (mouseInOldCanvasCoords.y / currentCanvasScale) * newCanvasScale,
  };
  const mouseInCanvasCoordsDiff = {
    x: mouseInNewCanvasCoords.x - mouseInOldCanvasCoords.x,
    y: mouseInNewCanvasCoords.y - mouseInOldCanvasCoords.y,
  };
  const mouseInOldCanvasWrapperCoords = {
    x: e.clientX - canvasWrapperRect.left,
    y: e.clientY - canvasWrapperRect.top,
  };
  const mouseInNewCanvasWrapperCoords = {
    x: mouseInOldCanvasWrapperCoords.x + mouseInCanvasCoordsDiff.x,
    y: mouseInOldCanvasWrapperCoords.y + mouseInCanvasCoordsDiff.y,
  };
  const mouseInViewportCoords = {
    x: e.clientX - viewportRect.left,
    y: e.clientY - viewportRect.top,
  };
  const newCanvasWrapperSize = {
    width: designStore.canvasWrapperPadding.left * 2 + newCanvasZoomSize.width,
    height: designStore.canvasWrapperPadding.top * 2 + newCanvasZoomSize.height,
  };
  const newViewportScroll = {
    x: Math.max(
      0,
      Math.min(
        newCanvasWrapperSize.width - viewportRect.width,
        mouseInNewCanvasWrapperCoords.x - mouseInViewportCoords.x
      )
    ),
    y: Math.max(
      0,
      Math.min(
        newCanvasWrapperSize.height - viewportRect.height,
        mouseInNewCanvasWrapperCoords.y - mouseInViewportCoords.y
      )
    ),
  };
  designStore.canvasScale = newCanvasScale;
  viewport.scrollTo(newViewportScroll.x, newViewportScroll.y);
};

const onViewportMouseDown = (e: MouseEvent) => {
  // 鼠标拖动画布容器
  document.addEventListener("mousemove", moveCanvasWrapperByMouse);
  document.addEventListener("mouseup", stopMoveCanvasWrapperByMouse);
  // 缩放画布容器
  zoomCanvasWrapperByMouse(e);
  // 
  if(designStore.usingTool === DesignToolsEnum.Brash) {
    console.log('onViewportMouseDown')
    designStore.selectedBlockIndex = -1;
  }
};

const onViewportWheel = (e: WheelEvent) => {
  e.preventDefault(); // 清除默认行为，防止滚动鼠标触发滚动条改变
};
</script>

<style lang="scss" scoped>
.design {
  position: relative;
  display: flex;
  flex-direction: column;
  &__header {
    height: 30px;
    background-color: #f3f3f3;
    flex-shrink: 0;
    padding-left: 46px;
    font-size: 11px;
    display: flex;
    align-items: center;
  }
  &__body {
    flex: 1;
    display: flex;
    .design-tools {
      height: 100%;
      flex-shrink: 0;
    }
    .design-viewport {
      flex: 1;
      height: 100%;
      background-color: #999;
      overflow: scroll;
      user-select: none;
      &.move {
        cursor: grab;
      }
      &.zoom-in {
        cursor: zoom-in;
      }
      &.zoom-out {
        cursor: zoom-out;
      }
      .design-canvas-wrapper {
        .design-canvas-zoom {
          transform-origin: 0 0;
          background-color: #fff;
        }
      }
    }
  }
  &__footer {
    height: 24px;
    background-color: #f3f3f3;
    flex-shrink: 0;
    font-size: 11px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    color: #000;
  }
}
</style >

