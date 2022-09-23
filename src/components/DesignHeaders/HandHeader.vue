
<template>
  <div
    class="hand-header"
    v-if="designStore.usingTool === DesignToolsEnum.Hand"
  >
    <markdown
      :content="`画布**${designStore.canvasColsCount}**行**${designStore.canvasRowsCount}**列`"
    ></markdown>
  </div>
</template>

<script lang="ts" setup>
import { useDesignStore, DesignToolsEnum } from "@src/stores/design";

import Markdown from "@src/components/Markdown.vue";

const designStore = useDesignStore();
</script>

<style lang="scss">
</style>