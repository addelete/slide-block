<template>
  <my-icon-font :type="`icon-${type}`" />
</template>

<script lang="ts" setup>
import { createFromIconfontCN } from "@ant-design/icons-vue";

const MyIconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_3468257_pilkurj41u8.js",
});

defineProps<{
  type: string;
}>();
</script>


