
<template>
  <div class="png-icon">
    <img :src="url" class="img" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  name: string; // 名称
}>();
const url = computed(
  () => new URL(`../assets/icons/${props.name}.png`, import.meta.url).href
);
</script>


<style scoped lang="scss">
.png-icon {
  display: inline-flex;
  .img {
    width: 1em;
    height: 1em;
  }
}
</style>