<template>
  <aside class="menu" :class="isCollapse ? 'collapse' : ''">
    <div class="collapse" :class="isCollapse ? 'iscollapse' : '' ">
      <span class="btn_icon" @click="changeCollapse">
        <i class="iconfont" :class="isCollapse ? 'icon-yousuojin' : 'icon-zuosuojin' " />
      </span>
    </div>
    <div class="logo">
      <router-link to="/">
        <img :src="isCollapse?require('../assets/img/logo_menu_small.png'):require('../assets/img/logo_menu.png')">
      </router-link>
    </div>
    <div class="meau">
      <el-menu :default-active="reURL" class="el-menu-vertical-demo" menu-trigger="click" :default-openeds="openeds" :collapse="isCollapse" :collapse-transition="false" :unique-opened="false" @select="handleselect" @open="handleOpen" @close="handleClose">
        <template v-for="(menu,index) in menuList">
          <el-submenu v-if="menu.children && menu.children.length >= 1" :key="index" :index="'' + menu.seqNo">
            <template slot="title">
              <div @click="onOpen()">
                <i :class="menu.icon" />
                <span slot="title">
                  <span slot="title">  {{ menu.resName }}</span>
                </span>
              </div>
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
      </el-menu>
    </div>
  </aside>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { saveActiveMenu } from '@/utils/storage'
export default {
  data() {
    return {
      // 菜单折起状态
      isCollapse: false,
      openeds: [],
      breadcrumbItems: [],
      reURL: '',
      // 默认选中菜单
      activeIndex: ''
    }
  },
  computed: {
    ...mapGetters([
      'menuList'
    ])
  },
  watch: {
    $route(newValue, oldValue) {
      if (newValue) {
        const menuIndex = window.sessionStorage.getItem('activeMenu')
        if (menuIndex) {
          this.activeIndex = menuIndex
          this.breadcrumbItems = []
          const seqNo = menuIndex.split(':')
          this.getSelectedMenus(this.menuList, seqNo)
          console.log(11111111, this.menuList)
        } else {
          this.reURL = 'menu-search:menu-search-general-search'
        }
        if (newValue.name === '普通检索') {
          // const menuIndex = 'menu-search:menu-search-general-search'
          // this.activeIndex = menuIndex
          // this.breadcrumbItems = []
          // const seqNo = menuIndex.split(':')
          // this.getSelectedMenus(this.menuList, seqNo)
        }
      }
    }
  },
  mounted() {
    const menuIndex = window.sessionStorage.getItem('activeMenu')
    if (menuIndex) {
      this.reURL = menuIndex
    } else {
      this.reURL = 'menu-search:menu-search-general-search'
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
    changeCollapse() {
      this.isCollapse = !this.isCollapse
      this.openeds = []
      this.$store.state.falg = this.isCollapse
      // console.log('meau', this.isCollapse)
    },
    onOpen() {
      this.isCollapse = false
    },
    handleOpen(key, keyPath) {
      this.isCollapse = false
    },
    handleClose(key, keyPath) {
      this.openeds = keyPath
      console.log(key, keyPath)
    },

    getSelectedMenus(menuList, seqNo) {
      const id = seqNo.shift()
      if (!id || id === 'null') {
        return
      }
      const menu = menuList.filter(menu => menu.id === id)
      this.breadcrumbItems.push(menu[0])
      this.getSelectedMenus(menu[0].children, seqNo)
    },
    handleselect(menuIndex) {
      saveActiveMenu(menuIndex)
      this.activeIndex = menuIndex
      this.breadcrumbItems = []
      const seqNo = menuIndex.split(':')
      this.getSelectedMenus(this.menuList, seqNo)
    }
  }
}
</script>
<style scoped>
aside {
  width: 280px;
  height: 100%;
  background-image: url("../assets/img/menubg.png");
  background-size: 100% 100%;
  position: relative;
  padding-top: 30px;
  border-radius: 0 30px 30px 0;
  transition: all .3s linear;
}
aside .logo,aside .logo img {
    -webkit-transition: all .2s linear;
    transition: all .3s linear;
}
.logo {
  width: 158px;
  height: 65px;
  margin: 10px auto 30px;
}
.collapse {
  width: 100%;
  height: 20px;
  line-height: 1;
  background-size: cover;
  text-align: right;
  padding-right: 20px;
  cursor: pointer;
}
.meau {
  height: calc(100% - 155px);
  overflow: auto;
}
aside.collapse {
  width: 60px;
  height: 100%;
  overflow: hidden;
  padding-right: 0px;
}
aside.collapse .logo {
  width: 50px;
  height: 30px;
  margin: 30px auto 30px;
}
aside .iscollapse {
  padding-right: 0;
  text-align: center;
}
</style>
