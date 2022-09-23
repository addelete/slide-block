<template>
  <div class="design-tools">
    <div
      class="design-tools__tool"
      v-for="tool in tools"
      :key="tool.name"
      :class="{
        active: tool.name === designStore.usingTool,
      }"
      @click="designStore.usingTool = tool.name"
      :title="tool.title"
    >
      <icon-font
        :type="`${tool.icon}-${
          tool.name === designStore.usingTool ? 'fill' : 'line'
        }`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDesignStore, DesignToolsEnum } from "@src/stores/design";
import IconFont from "./IconFont.vue";

const designStore = useDesignStore();
const tools = [
  { title: "移动", name: DesignToolsEnum.Hand, icon: "hand" },
  { title: "选择器", name: DesignToolsEnum.Selector, icon: "cursor" },
  { title: "裁切", name: DesignToolsEnum.Croper, icon: "crop" },
  { title: "缩放", name: DesignToolsEnum.ZoomLens, icon: "zoom-in" },
  { title: "建墙", name: DesignToolsEnum.Wall, icon: "wall" },
  { title: "刷子", name: DesignToolsEnum.Brash, icon: "brush" },
  { title: "橡皮", name: DesignToolsEnum.Erase, icon: "eraser" },
  { title: "模板", name: DesignToolsEnum.Template, icon: "clothes" },
  
];
</script>


<style lang="scss" scoped>
.design-tools {
  width: 40px;
  background-color: #f3f3f3;
  left: 12px;
  top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;

  &__tool {
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: #666;
    & + & {
      margin-top: 8px;
    }
    &.active {
      background: #ccc;
      color: #000;
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>

<style lang="scss">
.design-tools {
  cursor: default !important;
  * {
    cursor: default !important;
  }
}
</style>