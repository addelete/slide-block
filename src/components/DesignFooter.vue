<template>
  <markdown :content="footerText" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { useDesignStore, DesignToolsEnum } from "@src/stores/design";
import { useLayoutStore } from "@src/stores/layout";
import { keyCodeName } from "@src/utils/keyCodeName";

import Markdown from "./Markdown.vue";

const designStore = useDesignStore();
const layoutStore = useLayoutStore();
const footerText = computed(() => {
  return (
    {
      [DesignToolsEnum.Hand]: "**拖动**平移视图。",
      [DesignToolsEnum.Selector]: "**单击**选中对象。",
      [DesignToolsEnum.Croper]:
        "**拖动**手柄设置裁切大小。在画布内部拖动裁切画布，在画布外部拖动扩充画布。",
      [DesignToolsEnum.ZoomLens]: `**单击**以点为中心放大。**单击+${keyCodeName(
        "Alt"
      )}**以点为中心缩小。向右**拖动**以放大。向左**拖动**以缩小。`,
      [DesignToolsEnum.Wall]: `**单击**格子缝隙建墙。在墙上**单击+${keyCodeName(
        "Alt"
      )}**删除墙。`,
      [DesignToolsEnum.Brash]: `**单击**格子建滑块。在滑块上**单击+${keyCodeName(
        "Alt"
      )}**删除已填充的格子。`,
      [DesignToolsEnum.Erase]: "在滑块上**单击**删除已填充的格子。",
      [DesignToolsEnum.Template]: "选择模板创建常见滑块游戏。",
    }[designStore.usingTool] || ""
  );
});
</script>

<style lang="scss">
</style>