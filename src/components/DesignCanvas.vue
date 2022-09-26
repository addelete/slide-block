<template>
  <v-stage
    :width="designStore.canvasSize.width"
    :height="designStore.canvasSize.height"
  >
    <v-layer>
      <v-rect
        v-for="(grid, gi) in background"
        :key="gi"
        :x="grid.render.x"
        :y="grid.render.y"
        :width="grid.render.width"
        :height="grid.render.height"
        :fill="emptyGridFill"
        @mousedown="onGridMousedown(grid, $event)"
      >
      </v-rect>
    </v-layer>
    <v-layer>
      <v-group
        v-for="(block, bi) in blocks"
        :key="bi"
        @mousedown="onBlockMousedown(bi, $event)"
      >
        <v-rect
          v-for="(rect, ri) in block.rects"
          :key="ri"
          :x="rect.render.x"
          :y="rect.render.y"
          :width="rect.render.width"
          :height="rect.render.height"
          :fill="block.rectFill"
        ></v-rect>
        <v-ring
          v-for="(ring, ri) in block.rings"
          :key="ri"
          :x="ring.x"
          :y="ring.y"
          :innerRadius="ring.innerRadius"
          :outerRadius="ring.outerRadius"
          :fill="block.ringFill"
        >
        </v-ring>
        <v-circle
          v-for="(circle, ci) in block.circles"
          :key="ci"
          :x="circle.x"
          :y="circle.y"
          :radius="circle.radius"
          :fill="block.circleFill"
        >
        </v-circle>

        <v-line
          v-for="(line, li) in block.lines"
          :key="li"
          :points="line.points"
          :stroke="block.lineFill"
          :strokeWidth="1"
        ></v-line>
      </v-group>
    </v-layer>
  </v-stage>
</template>

<script lang="ts" setup>
import { DesignToolsEnum, useDesignStore } from "@src/stores/design";
import { computed } from "vue";
import { KonvaEventObject } from "konva/lib/Node";
import { Coord, CoordUtil, Rect, RectTypeEnum } from "@src/utils/coord";
import { __GridGapWidth__, __GridWidth__ } from "@src/utils/constant";

const designStore = useDesignStore();

const emptyGridFill = "#ddd";

const background = computed(() => {
  return Array.from({
    length: designStore.canvasRowsCount * designStore.canvasColsCount,
  }).map((_, i) => {
    const x = i % designStore.canvasColsCount;
    const y = Math.floor(i / designStore.canvasColsCount);
    return CoordUtil.coord2Rect({ x, y }, RectTypeEnum.Grid);
  });
});

const blocks = computed(() => {
  return designStore.blocks.map((block, blockIndex) => {
    const isSelected = blockIndex === designStore.selectedBlockIndex;
    let minX = designStore.canvasColsCount;
    let minY = designStore.canvasRowsCount;
    let maxX = 0;
    let maxY = 0;
    const rects: Rect[] = [];
    const circles: {
      x: number;
      y: number;
      radius: number;
    }[] = [];
    const lines: {
      points: number[];
    }[] = [];

    const rings: {
      x: number;
      y: number;
      outerRadius: number;
      innerRadius: number;
    }[] = [];

    if (isSelected) {
      block.shapeCoords.forEach((coord) => {
        const circle = CoordUtil.coord2CenterCircle(coord);
        rings.push({
          x: circle.x,
          y: circle.y,
          innerRadius: circle.radius,
          outerRadius: circle.radius + __GridGapWidth__,
        });
      });
    }

    const circleSet = new Set<string>();
    const tryPushCircle = (coord: Coord) => {
      const centerCircle = CoordUtil.coord2CenterCircle(coord);
      const centerKey = CoordUtil.coord2HashCode(coord);
      if (!circleSet.has(centerKey)) {
        circles.push(centerCircle);
        circleSet.add(centerKey);
      }
    };
    const lineSet = new Set<string>();
    const tryPushLine = (coord1: Coord, coord2: Coord) => {
      const lineKey = CoordUtil.coords2HashCode([coord1, coord2]);
      if (!lineSet.has(lineKey)) {
        const center1 = CoordUtil.coord2CenterCircle(coord1);
        const center2 = CoordUtil.coord2CenterCircle(coord2);
        lines.push({
          points: [center1.x, center1.y, center2.x, center2.y],
        });
        lineSet.add(lineKey);
      }
    };

    for (const coord of block.shapeCoords) {
      if (coord.x < minX) minX = coord.x;
      if (coord.y < minY) minY = coord.y;
      if (coord.x > maxX) maxX = coord.x;
      if (coord.y > maxY) maxY = coord.y;
      rects.push(CoordUtil.coord2Rect(coord, RectTypeEnum.Grid));
    }
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const grid0 = block.shapeCoords.find((coord) =>
          CoordUtil.isEqual(coord, { x, y })
        );
        const grid1 = block.shapeCoords.find((coord) =>
          CoordUtil.isEqual(coord, { x, y: y - 1 })
        );
        const grid2 = block.shapeCoords.find((coord) =>
          CoordUtil.isEqual(coord, { x: x - 1, y: y - 1 })
        );
        const grid3 = block.shapeCoords.find((coord) =>
          CoordUtil.isEqual(coord, { x: x - 1, y })
        );
        if (grid0 && grid1) {
          rects.push(
            CoordUtil.coord2Rect({ x, y }, RectTypeEnum.HorizontalGap)
          );
        }
        if (grid0 && grid3) {
          rects.push(CoordUtil.coord2Rect({ x, y }, RectTypeEnum.VerticalGap));
        }

        if (grid0 && grid1 && grid2 && grid3) {
          rects.push(CoordUtil.coord2Rect({ x, y }, RectTypeEnum.PointGap));
        }

        if (grid0 && grid2 && !grid1 && !grid3) {
          tryPushCircle(grid0);
          tryPushCircle(grid2);
          tryPushLine(grid0, grid2);
        }
        if (!grid0 && !grid2 && grid1 && grid3) {
          tryPushCircle(grid1);
          tryPushCircle(grid3);
          tryPushLine(grid1, grid3);
        }
      }
    }

    return {
      isSelected,
      rectFill: block.fill.toString(),
      circleFill: block.fill.darken(20).toString(),
      ringFill: block.fill.darken(10).toString(),
      lineFill: block.fill.darken(20).toString(),
      rects,
      circles,
      rings,
      lines,
    };
  });
});

const onGridMousedown = (grid: Rect, event: KonvaEventObject<PointerEvent>) => {
  if (grid.type !== RectTypeEnum.Grid) {
    return;
  }
  if (designStore.usingTool === DesignToolsEnum.Brash) {
    event.cancelBubble = true; // 阻止冒泡
    event.evt.stopPropagation(); // 阻止默认事件
    designStore.createOrExtendBlock(grid.coord);
  }
};

const onBlockMousedown = (
  blockIndex: number,
  event: KonvaEventObject<PointerEvent>
) => {
  console.log("onBlockMousedown", blockIndex);

  if (
    designStore.usingTool === DesignToolsEnum.Selector ||
    designStore.usingTool === DesignToolsEnum.Brash
  ) {
    event.cancelBubble = true; // 阻止冒泡
    event.evt.stopPropagation(); // 阻止默认事件
    designStore.selectedBlockIndex = blockIndex;
  }
};
</script>

<style lang="scss">
.design-canvas {
  background: #fff;
}
</style>