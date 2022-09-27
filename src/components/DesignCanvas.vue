<template>
  <div
    class="design-canvas"
    ref="designCanvasRef"
    @click.stop=""
    @contextmenu.stop=""
  >
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
          @click="onGridClick(grid, $event)"
        >
        </v-rect>
      </v-layer>
      <v-layer>
        <v-group
          v-for="(block, bi) in blocks"
          :key="bi"
          @click="onBlockClick(bi, $event)"
          @contextmenu="onBlockContextmenu(bi, $event)"
        >
          <v-line
            v-for="(line, li) in block.lines"
            :key="li"
            :points="line.points"
            :stroke="block.lineFill"
            :strokeWidth="line.strokeWidth"
          ></v-line>
          <v-rect
            v-for="(rect, ri) in block.rects"
            :key="ri"
            :x="rect.render.x"
            :y="rect.render.y"
            :width="rect.render.width"
            :height="rect.render.height"
            :fill="block.rectFill"
            @click="onBlockGridClick(rect, bi, $event)"
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
        </v-group>
      </v-layer>
    </v-stage>
    <design-block-context-menu />
  </div>
</template>

<script lang="ts" setup>
import {
  DesignToolsEnum,
  useDesignStore,
  BlockRoleEnum,
} from "@src/stores/design";
import { computed, ref } from "vue";
import { KonvaEventObject } from "konva/lib/Node";
import { Coord, CoordUtil, Rect, RectTypeEnum } from "@src/utils/coord";
import { __GridGapWidth__, __GridWidth__ } from "@src/utils/constant";
import DesignBlockContextMenu from "@src/components/DesignBlockContextMenu.vue";

const designStore = useDesignStore();

const emptyGridFill = "#ddd";

const designCanvasRef = ref<HTMLElement>();

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
      strokeWidth: number;
    }[] = [];

    const rings: {
      x: number;
      y: number;
      outerRadius: number;
      innerRadius: number;
    }[] = [];

    if (isSelected) {
      block.shapeCoords.forEach((coord) => {
        const circle = CoordUtil.coord2GridCenter(coord);
        rings.push({
          x: circle.x,
          y: circle.y,
          innerRadius: __GridWidth__ / 10,
          outerRadius: __GridWidth__ / 10 + __GridGapWidth__,
        });
      });
    }
    const lineSet = new Set<string>();
    const tryPushLine = (coord1: Coord, coord2: Coord) => {
      const lineKey = CoordUtil.coords2HashCode([coord1, coord2]);
      if (!lineSet.has(lineKey)) {
        const center1 = CoordUtil.coord2GridCenter(coord1);
        const center2 = CoordUtil.coord2GridCenter(coord2);
        lines.push({
          points: [center1.x, center1.y, center2.x, center2.y],
          strokeWidth: __GridGapWidth__,
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
          tryPushLine(grid0, grid2);
        }
        if (!grid0 && !grid2 && grid1 && grid3) {
          tryPushLine(grid1, grid3);
        }
      }
    }

    return {
      isSelected,
      rectFill: block.fill.toString(),
      circleFill: block.fill.darken(20).toString(),
      ringFill: block.fill.darken(10).toString(),
      lineFill: block.fill.toString(),
      rects,
      circles,
      rings,
      lines,
    };
  });
});

const onGridClick = (grid: Rect, event: KonvaEventObject<PointerEvent>) => {
  if (grid.type !== RectTypeEnum.Grid) {
    return;
  }
  if ([DesignToolsEnum.Brash].includes(designStore.usingTool)) {
    event.cancelBubble = true; // 阻止冒泡
    designStore.createOrExtendBlock(grid.coord);
  }
};

const onBlockClick = (
  blockIndex: number,
  event: KonvaEventObject<MouseEvent>
) => {
  designStore.mouseOnBlockIndex = blockIndex;
  if (
    [DesignToolsEnum.Selector, DesignToolsEnum.Brash].includes(
      designStore.usingTool
    )
  ) {
    event.cancelBubble = true; // 阻止冒泡
    designStore.toggleSelectBlock();
  }
};

/**
 * 在滑块的格子里点击事件
 * （当前工具是橡皮）或（当前工具是刷子且按下alt）
 * 点击滑块上的格子表示删除格子
 * 如果此滑块仅有一个格子则删除滑块
 * @param rect
 * @param blockIndex
 * @param event
 */
const onBlockGridClick = (
  rect: Rect,
  blockIndex: number,
  event: KonvaEventObject<MouseEvent>
) => {
  if (rect.type !== RectTypeEnum.Grid) {
    return;
  }
  if (
    designStore.usingTool === DesignToolsEnum.Erase ||
    (designStore.usingTool === DesignToolsEnum.Brash && event.evt.altKey)
  ) {
    event.cancelBubble = true; // 阻止冒泡
    designStore.removeOrCutBlock(rect.coord, blockIndex);
  }
};

/**
 * 滑块右键事件
 * 唤出滑块右键菜单
 * @param blockIndex
 * @param event
 */
const onBlockContextmenu = (
  blockIndex: number,
  event: KonvaEventObject<MouseEvent>
) => {
  designStore.mouseOnBlockIndex = blockIndex;
  if (
    [DesignToolsEnum.Selector, DesignToolsEnum.Brash].includes(
      designStore.usingTool
    )
  ) {
    event.cancelBubble = true; // 阻止冒泡
    event.evt.preventDefault(); // 阻止默认事件
    const designCanvasRect = designCanvasRef.value!.getBoundingClientRect();
    designStore.showBlockContextMenu = true;
    designStore.blockContextMenuPosition = {
      x: event.evt.clientX - designCanvasRect.left,
      y: event.evt.clientY - designCanvasRect.top,
    };
  }
};
</script>

<style lang="scss">
.design-canvas {
  
}
</style>