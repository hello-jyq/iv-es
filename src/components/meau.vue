<template>
      <aside class="menu" :class="isCollapse ? 'collapse' : ''"> 
           
           <div class="collapse" :class="isCollapse ? 'iscollapse' : '' ">
                 <span class="btn_icon" @click="changeCollapse">
                     <i class="iconfont" :class="isCollapse ? 'icon-yousuojin' : 'icon-zuosuojin' " />
                 </span>
            </div>
            <div class="logo">
               <img :src="isCollapse?require('../assets/img/logo_menu_small.png'):require('../assets/img/logo_menu.png')"/>
           </div>
            <!-- <el-menu  :default-active="activeIndex" class="el-menu-vertical-demo" menu-trigger='click' @open="handleOpen" @close="handleClose" :default-openeds="openeds" :collapse="isCollapse" :router=true :collapse-transition='false' :unique-opened='false'>
            <el-submenu index="1">
                <template slot="title">
                    <div  @click="onOpen()">
                        <i class="iconfont icon-sousuo"></i>
                        <span slot="title">搜索方式</span>
                    </div>
                </template>
                <el-menu-item index="/general_search">普通搜索</el-menu-item>
                <el-menu-item index="/advanced_search">高级搜索</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                 <template slot="title">
                    <div  @click="onOpen()">
                    <i class="iconfont icon-guanli"></i>
                    <span slot="title">搜索管理</span>
                    </div>
                </template>
                <el-menu-item index="/personal_tag">个人标签管理</el-menu-item>
                <el-menu-item index="/search_history">搜索履历管理</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                 <template slot="title">
                    <div  @click="onOpen()">
                        <i class="iconfont icon-bangzhu"></i>
                        <span slot="title">搜索帮助</span>
                    </div>
                </template>
                <el-menu-item index="/search_help">搜索帮助</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                 <template slot="title">
                    <div  @click="onOpen()">
                        <i class="iconfont icon-shezhi"></i>
                        <span slot="title">系统管理</span>
                    </div>
                </template>
                <el-menu-item index="/user_management">用户管理</el-menu-item>
                <el-menu-item index="/role_management">角色管理</el-menu-item>
                <el-menu-item index="/access_management">访问权限管理</el-menu-item>
                <el-menu-item index="/search_history_management">搜索履历</el-menu-item>
                <el-menu-item index="/background_plan_config">后台计划配置</el-menu-item>
                <el-menu-item index="/query_result_analysis">查询结果分析</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
                 <template slot="title">
                    <div  @click="onOpen()">
                        <i class="iconfont icon-shezhi"></i>
                        <span slot="title">系统管理(旧)</span>
                    </div>
                </template>
                <el-menu-item index="/user_management">组织管理</el-menu-item>
                <el-menu-item index="/role_management">业务字典</el-menu-item>
                <el-menu-item index="/access_management">资源管理</el-menu-item>
                <el-menu-item index="/search_history_management">全文检索权限</el-menu-item>
                <el-menu-item index="/background_plan_config">角色管理</el-menu-item>
                <el-menu-item index="/query_result_analysis">国际化</el-menu-item>
                <el-menu-item index="/background_plan_config">数据权限管理</el-menu-item>
                <el-menu-item index="/query_result_analysis">在线用户查看</el-menu-item>
            </el-submenu> 
            </el-menu> -->
            <div class="meau">
             <el-menu   :default-active="reURL" class="el-menu-vertical-demo" menu-trigger='click'  @select="handleselect" @open="handleOpen" @close="handleClose" :default-openeds="openeds" :collapse="isCollapse"  :collapse-transition='false' :unique-opened='false'>
            <template  v-for="(menu,index) in menuList" >
              <el-submenu v-if="menu.children && menu.children.length >= 1" :index="'' + menu.seqNo"  :key="index">
                <template slot="title">
                  <div @click="onOpen()">
                       <i :class="menu.icon"></i>
                        <span slot="title">
                      <span slot="title">  {{menu.resName}}</span>
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
      reURL: '',
      // 默认选中菜单
      activeIndex: this.$route.path == '' ? '/search/general_search' : this.$route.path
    };
  },
  computed: {
    ...mapGetters([
      'menuList'
    ])
  },
  mounted() {
    const menuIndex = window.sessionStorage.getItem('activeMenu')
    if (menuIndex) {
      // this.activeIndex = menuIndex
      this.breadcrumbItems = []
      const seqNo = menuIndex.split(':')
      this.getSelectedMenus(this.menuList, seqNo)
      this.reURL = menuIndex
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
      this.isCollapse = !this.isCollapse;
      this.openeds = [];
      this.$store.state.falg = this.isCollapse
      console.log('meau', this.isCollapse)
    },
    onOpen() {
      this.isCollapse = false;
    },
    handleOpen(key, keyPath) {
      this.isCollapse = false;
    },
    handleClose(key, keyPath) {

      console.log(key, keyPath);
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
      // // console.log(9999999, menuIndex)
      saveActiveMenu(menuIndex)
      // this.activeIndex = menuIndex
      this.breadcrumbItems = []
      const seqNo = menuIndex.split(':')
      this.getSelectedMenus(this.menuList, seqNo)
    },
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