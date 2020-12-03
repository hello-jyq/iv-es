<template>
  <!-- 目前为止二级菜单 -->
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="'' + menu.seqNo" class="blueMenu">
    <template slot="title">
      <div class=" menu-icon" style="background: none;box-shadow: none" @click="onOpen(menu.seqNo)">
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
  name: 'MenuTreeBlue',
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

<style  lang="scss">
.blueMenu {
  .menu-icon i {
    font-size: 20px !important;
  }

  i {
    color: #ffffff !important;
  }
  .el-submenu__title {
    span {
      color: #ffffff !important;
    }
  }
  .el-menu-item {
    span {
      color: #ffffff !important;
    }
  }
  .el-submenu__icon-arrow {
    display: block !important;
  }
  .menu-icon {
    margin-right: 12px !important;
  }
  &.is-opened .menu-icon {
    margin-right: 16px !important;
  }
  .el-submenu__icon-arrow {
    font-size: 12px;
    transform: rotateZ(-90deg);
  }
}
.el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
  transform: rotateZ(0deg) !important;
}

#app[data-theme="Light"] .blueMenu {
  .iconiconfontpaixingbang {
    font-size: 16px !important;
  }
  .iconsuanshu {
    font-size: 16px !important;
  }
  .iconshenpi {
    font-size: 22px !important;
  }
  .iconresume-s {
    font-size: 24px !important;
  }
}
</style>
