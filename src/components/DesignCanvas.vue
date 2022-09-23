<template>
  <div
    class="design-canvas"
    :style="{
      width: `${designStore.canvasSize.width}px`,
      height: `${designStore.canvasSize.height}px`,
    }"
  >
    <div v-for="(row, ri) in grids" :key="ri">
      <div
        v-for="(grid, ci) in row"
        :key="ci"
        :style="{
          position: 'absolute',
          left: `${grid.x}px`,
          top: `${grid.y}px`,
          width: `${grid.width}px`,
          height: `${grid.height}px`,
          backgroundColor: '#efefef',
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDesignStore } from "@src/stores/design";
import { __GridGapWidth__, __GridWidth__ } from "@src/stores/layout";
import { computed } from "vue";

const designStore = useDesignStore();

const grids = computed(() => {
  return Array.from({ length: designStore.canvasRowsCount }).map((_, i) => {
    return Array.from({ length: designStore.canvasColsCount }).map((_, j) => {
      return {
        x: j * __GridWidth__ + __GridGapWidth__,
        y: i * __GridWidth__ + __GridGapWidth__,
        width: __GridWidth__ - __GridGapWidth__,
        height: __GridWidth__ - __GridGapWidth__,
      };
    });
  });
});
</script>

<style lang="scss">
.design-canvas {
  background: #fff;
}
</style>