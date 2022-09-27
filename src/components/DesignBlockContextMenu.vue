<template>
  <div
    class="context-menu-mask"
    v-if="designStore.showBlockContextMenu"
    @click.stop="hideContextMenu"
    @contextmenu.prevent=""
  ></div>
  <div
    class="block-context-menu"
    v-if="designStore.showBlockContextMenu"
    :style="{
      left: designStore.blockContextMenuPosition.x + 'px',
      top: designStore.blockContextMenuPosition.y + 'px',
    }"
    @click.stop="hideContextMenu"
  >
    <div class="menu-item">
      <div class="menu-item-content lv1" @click="designStore.toggleSelectBlock()">
        <icon-font type="ok" class="icon" v-if="isSelectedBlock"></icon-font>
        <span>选择滑块</span>
      </div>
    </div>
    <div class="menu-item">
      <div class="menu-item-content lv1" @click.stop="">
        <span>角色规则</span>
        <icon-font type="arrow-right" class="arrow"></icon-font>
      </div>
      <div class="block-context-menu lv2">
        <div class="menu-item" v-for="role in roles" :key="role">
          <div
            class="menu-item-content"
            @click="designStore.toggleBlockRole(role)"
          >
            <icon-font
              type="ok"
              class="icon"
              v-if="currentBlock?.roles[role]"
            ></icon-font>
            <span>{{ roleNameMap[role] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconFont from "@src/components/IconFont.vue";
import { useDesignStore, BlockRoleEnum } from "@src/stores/design";
import { computed } from "vue";
const designStore = useDesignStore();

const roles = [
  BlockRoleEnum.King,
  BlockRoleEnum.Assassin,
  BlockRoleEnum.EdgePawn,
  BlockRoleEnum.Horizontal,
  BlockRoleEnum.Vertical,
];

const roleNameMap = {
  [BlockRoleEnum.King]: "王",
  [BlockRoleEnum.Assassin]: "刺客",
  [BlockRoleEnum.EdgePawn]: "边兵",
  [BlockRoleEnum.Horizontal]: "水平",
  [BlockRoleEnum.Vertical]: "垂直",
};

const isSelectedBlock = computed(() => {
  return designStore.selectedBlockIndex === designStore.mouseOnBlockIndex;
});

const currentBlock = computed(() => {
  if (designStore.mouseOnBlockIndex === -1) {
    return null;
  }
  return designStore.blocks[designStore.mouseOnBlockIndex];
});

/**
 * 隐藏右键菜单
 */
const hideContextMenu = () => {
  designStore.showBlockContextMenu = false;
};
</script>

<style lang="scss">
.context-menu-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.block-context-menu {
  position: absolute;
  z-index: 100;
  background-color: #eeeeeeaa;
  backdrop-filter: blur(40px);
  border: 1px solid #b9b9b9;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 5px;
  width: 160px;

  .menu-item {
    .menu-item-content {
      padding: 2px 9px;
      cursor: pointer;
      font-size: 13px;
      color: #222;
      font-weight: 500;
      border-radius: 4px;
      display: flex;
      align-items: center;
      .icon {
        margin-right: 5px;
      }
      .arrow {
        margin-left: auto;
      }
      &:hover {
        background-color: #3b7cff !important;
        color: #fff !important;
      }
    }
    &:hover .menu-item-content.lv1 {
      background-color: rgba(0, 0, 0, 0.1);
      color: #222;
    }

    .block-context-menu.lv2 {
      align-self: flex-start;
      left: 153px;
      transform: translateY(-32px);
      display: none;
    }
    &:hover .block-context-menu.lv2 {
      display: block;
    }
  }
}
</style>