<template>
  <!-- 目前为止二级菜单 -->
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="'' + menu.seqNo">
    <template slot="title">
      <div class="circle-big-btn menu-icon btn-default-color" @click="onOpen(menu.seqNo)">
        <el-badge v-if="menu.resName == '' && collapse == true" class="badge-icon" is-dot>
          <i :class="menu.icon" />
        </el-badge>
        <template v-else>
          <i :class="menu.icon" />
        </template>
      </div>
      <span slot="title">
        <el-badge v-if="menu.resName == ''" class="badge-icon" is-dot>{{ menu.resName }}</el-badge>
        <template v-else>{{ menu.resName }}</template>
      </span>
    </template>
    <template v-for="item in menu.children">
      <template v-if="item.children == 0">
        <el-menu-item v-if="item.isHidden!=false" :key="item.id" :index="'' + item.seqNo" @click="handleRoute(item)">
          <span slot="title">{{ item.resName }}</span>
        </el-menu-item>
      </template>
      <el-submenu v-else :key="item.id" :index="'' + item.seqNo">
        <span slot="title">{{ item.resName }}</span>
        <el-menu-item v-for="items in item.children" :key="items.id" :index="'' + items.seqNo" @click="handleRoute(items)">
          <span slot="title">{{ items.resName }}</span>
        </el-menu-item>
      </el-submenu>
    </template>
  </el-submenu>
</template>

<script>
export default {
  name: 'MenuTree',
  props: {
    menu: {
      type: Object,
      required: true
    },
    collapse: {
      type: Boolean
    }
  },
  methods: {
    handleRoute(menu) {
      // 通过菜单URL跳转至指定路由
      if (menu.resUrl.substring(0, 1) === '/') {
        this.$router.push(menu.resUrl)
      } else {
        this.$router.push('/' + menu.resUrl)
      }
    },
    onOpen(menu) {
      this.$emit('show')
    }
  }
}
</script>

<style scoped lang="scss">
i {
  margin-right: 5px;
}
</style>
