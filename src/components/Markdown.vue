<template>
  <div class="markdown" v-html="html"></div>
</template>

<script lang="ts" setup>
import MarkdownIt from "markdown-it";
import { computed } from "vue";

const md = new MarkdownIt({
  html: false,
  breaks: true,
});

const props = defineProps<{
  content: string;
}>();

const html = computed(() => {
  return md.render(props.content);
});
</script>

<style lang="scss">
.markdown {
  font-family: "Courier New", Courier, monospace;
  strong {
    margin: 0 2px;
  }
}
</style>