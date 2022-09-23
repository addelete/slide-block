<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { useKeyCodeStore } from "@src/stores/keyCode";
import { useLayoutStore } from "@src/stores/layout";
import { useDesignStore } from "@src/stores/design";
import { onMounted } from "vue";

const keyCodeStore = useKeyCodeStore();
const layoutStore = useLayoutStore();
const designStore = useDesignStore();

onMounted(() => {
  keyCodeStore.setup();
  layoutStore.setup();
  designStore.setup();
});
</script>
