<template>
  <div class="home">
    <aside :class="isCollapse ? 'collapse' : ''">
      <div class="collapse" :class="isCollapse ? 'iscollapse' : '' ">
        <span
          class="circle-btn btn-default-color"
          @click="changeCollapse"
        >
          <i class="iconfont" :class="isCollapse ? 'iconyousuojin' : 'iconzuosuojin' " />
        </span>
      </div>
      <div class="logo" @click="$router.push('/');handleHomeClick()">
        <img :src="isCollapse ? logo2 : logo">
      </div>

      <el-scrollbar class="menu-scrollLeft">
        <div class="menu">
          <el-menu
            class="menu-box"
            unique-opened
            :default-openeds="openeds"
            :default-active="reURL"
            @open="handleopen"
            @select="handleselect"
          >
            <!-- 导航菜单树组件，动态加载菜单 -->
            <div v-if="theme==='Light'">
              <Menu-Tree-Blue
                v-for="item in menuList"
                :key="item.id"
                :menu="item"
                :collapse="isCollapse"
                @show="handOpen"
              />
            </div>
            <div v-else>
              <Menu-Tree
                v-for="item in menuList"
                :key="item.id"
                :menu="item"
                :collapse="isCollapse"
                @show="handOpen"
              />
            </div>
          </el-menu>
        </div>
      </el-scrollbar>
    </aside>
    <div class="header">
      <div class="path">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">
            <span class="circle-btn home-icon btn-light-color">
              <i v-if="theme === 'Light'" class="iconfont icontianchongxing-" />
              <i v-else class="iconfont iconshouye" />
            </span> {{ $t('comm.home') }}
          </el-breadcrumb-item>
          <template v-for="item in breadcrumbItems">
            <el-breadcrumb-item v-if="item.resUrl" :key="item.id" :to="{path:'/'+item.resUrl}">
              {{ item.resName!=''?item.resName:'' }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else :key="item.id">
              {{ item.resName!=''?item.resName:'' }}
            </el-breadcrumb-item>
          </template>
        </el-breadcrumb>
      </div>
      <div class="userInfo">
        <el-dropdown trigger="click" placement="bottom">
          <span class="el-dropdown-link userinfo-inner">
            <span class="circle-btn avatar-icon btn-light-color">
              <i class="iconfont icontouxiang" />
            </span>
            <span class="roles">{{ userInfo.orgFullName }}：</span>
            <span class="name">{{ userInfo.nickName }}</span>
            <span class="down-icon">
              <i class="iconfont iconai-arrow-down" />
            </span>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            class="userDropDwon"
            :class="theme=='Light'? 'blueDwon':' '"
          >
            <el-dropdown-item @click.native="handleChangePasswordOpenClick">
              <i class="iconfont iconxiugaimima" />
              <span>{{ $t('comm.changePassword') }}</span>
            </el-dropdown-item>

            <el-dropdown-item v-if="showChangeOrgMenu == true" @click.native="handleChangeOrgOpenClickTest">
              <i class="iconfont iconB" />
              <span>{{ $t('comm.changeOrg') }}</span>
            </el-dropdown-item>
            <el-dropdown-item class="logout" @click.native="logout">
              <i class="iconfont icontuichu4" />
              <span>{{ $t('comm.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 20200704 by Zhang 第一版暂不支持国际化
      <div class="language-info">
        <el-dropdown trigger="click" placement="bottom">
          <span class="el-dropdown-link circle-btn btn-light-color language-icon">
            <span class="language-text"> {{ language }}</span>
          </span>
          <el-dropdown-menu slot="dropdown" class="languageDropDwon" :class="theme=='Light'? 'blueDwon':' '">
            <el-dropdown-item @click.native="onchangeLanguage('Cn')">
              <img src="@/assets/images/language/cn.png"><span>中文</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="onchangeLanguage('En')">
              <img src="@/assets/images/language/en.png"><span>English</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="onchangeLanguage('Jp')">
              <img src="@/assets/images/language/jp.png"><span>にほんご</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      -->
      <div class="theme-info">
        <el-dropdown trigger="click" placement="bottom">
          <span class="el-dropdown-link circle-btn btn-light-color theme-icon">
            <i class="iconfont iconyanse" />
          </span>
          <el-dropdown-menu slot="dropdown" class="themeDropDwon" :class="theme=='Light'? 'blueDwon':' '">
            <el-dropdown-item @click.native="onchangeTheme('Light')">
              白底
            </el-dropdown-item>
            <el-dropdown-item @click.native="onchangeTheme('Dark')">
              黑底
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="main">
      <transition name="fade" mode="out-in">
        <el-scrollbar class="scroll-left" style="height:100%">
          <router-view />
        </el-scrollbar>
      </transition>
    </div>
    <el-backtop target=".scroll-left .el-scrollbar__wrap" :bottom="140" :right="30">
      <div
        class="circle-big-btn btn-light-color"
      >
        <i class="iconfont iconicon3" />
      </div>
    </el-backtop>
    <!-- 变更密码 -->
    <change-user-password
      :is-show="resetDialog"
      @onClose="resetDialog = false;"
    />

    <!-- 切换组织 20200221 add -->
    <change-org
      :is-show="dialogChangeOrgVisible"
      @onClose="dialogChangeOrgVisible = false;"
      @onChangeOrgSuccess="onChangeOrgSuccess"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { saveActiveMenu } from '@/utils/storage'
import MenuTree from '@/components/MenuTree'
import MenuTreeBlue from '@/components/MenuTreeBlue'
import ChangeOrg from '@/views/comm/ChangeOrg'
import ChangeUserPassword from '@/views/comm/ChangeUserPassword'
import { formValidator } from '@/mixins/form-validator.js'

export default {
  name: 'Home',
  inject: ['reload'],
  components: {
    MenuTree,
    MenuTreeBlue,
    ChangeOrg,
    ChangeUserPassword
  },
  mixins: [formValidator],
  data() {
    return {
      theme: 'Light',
      logo: require('@/assets/images/logo.png'),
      logo2: require('@/assets/images/logo2.png'),
      language: 'Cn',
      openeds: [],
      resetDialog: false,
      // 菜单折起状态
      isCollapse: false,
      breadcrumbItems: [],
      // 默认选中菜单
      activeIndex: '',

      // 组织切换用的变量
      resetOrg: false,
      selectOrgId: '',
      reURL: '',
      dialogChangeOrgVisible: false,

      showChangeOrgMenu: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'userOrgList',
      'menuList'
    ])

  },
  watch: {
    $route(newValue, oldValue) {
      // // console.log('newValue', newValue)
      // // console.log('oldValue', oldValue)
      // // console.log(444, this.breadcrumbItems)
      if (newValue) {
        const routeNew = { 'resName': newValue.name, 'resUrl': newValue.path }
        // const routeOld = { 'resName': oldValue.name, 'resUrl': oldValue.path }
        this.routeNew = routeNew
        if (newValue.path === '/') {
          this.breadcrumbItems = []
          // // console.log(1111)
        } else {
          // this.breadcrumbItems.push(routeNew)
          // let aaa = Array.from(this.breadcrumbItems)
          // var arr = [];
          // for (var i = 0, len = aaa.length; i < len; i++) {
          //   arr[i] = aaa[i];
          // }
          // arr.splice(1, 1)
          // this.breadcrumbItems = arr
          // // console.log(9999, arr)

          // if (this.breadcrumbItems.length >= 2 && localbreadcrumbItems.length === 3) {
          //   let newbreadcrumbItems = this.breadcrumbItems.slice(0, 2)
          //   // newbreadcrumbItems.push(routeNew)
          //   this.breadcrumbItems = newbreadcrumbItems
          //   // console.log(22222, this.breadcrumbItems)
          // } else {
          //   this.breadcrumbItems.push(routeNew)
          //   // // console.log(333, newbreadcrumbItems)
          // }
        }
      }
    }
  },
  created() {
  },
  mounted() {
    // // console.log('this.$route.router', this.$route)
    this.theme = localStorage.getItem('theme') || 'Light'
    const menuIndex = window.sessionStorage.getItem('activeMenu')
    document.getElementById('app').setAttribute('data-theme', this.theme)

    if (menuIndex) {
      this.activeIndex = menuIndex
      this.breadcrumbItems = []
      const seqNo = menuIndex.split(':')
      this.getSelectedMenus(this.menuList, seqNo)
      this.reURL = menuIndex
    }

    // 表示变更组织的菜单
    if (this.userOrgList !== undefined && this.userOrgList.length) {
      this.showChangeOrgMenu = true
    }
  },
  methods: {
    // 切换主题
    onchangeTheme(item) {
      document.getElementById('app').setAttribute('data-theme', item)
      localStorage.setItem('theme', item)
      this.reload()
    },
    onchangeLanguage(item) {
      this.language = item
    },
    // 改变菜单状态
    changeCollapse() {
      this.isCollapse = !this.isCollapse
      this.openeds = []
      // this.activeIndex = null
      // this.$nextTick(() => {
      //   this.setCollapse(this.isCollapse)
      // })
    },
    handOpen() {
      this.isCollapse = false
    },
    handleopen() {
      // // console.log('a')
      this.isCollapse = false
    },
    handleselect(menuIndex) {
      // // console.log(9999999, menuIndex)
      saveActiveMenu(menuIndex)
      this.activeIndex = menuIndex
      this.breadcrumbItems = []
      const seqNo = menuIndex.split(':')
      this.getSelectedMenus(this.menuList, seqNo)
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
    handleHomeClick() {
      this.breadcrumbItems = []
    },
    handleChangeOrgOpenClick() {
      this.$nextTick(function() {
        this.clearErrorMessage()
      })

      if (this.userOrgList !== undefined && this.userOrgList.length) {
        this.selectOrgId = this.userOrgList[0].id
      }
      this.resetOrg = true
    },
    handleChangeOrgOpenClickTest() {
      this.$nextTick(function() {
        this.clearErrorMessage()
      })

      this.dialogChangeOrgVisible = true
    },
    onChangeOrgSuccess() {
      this.dialogChangeOrgVisible = false
      // this.$router.push('/')
      // this.loginInfoAction()
      // this.refreshDictAndClearStore()
      // this.breadcrumbItems = []

      this.$router.push('/')
      this.$router.go(0)
    },

    handleChangePasswordOpenClick() {
      this.oldPassword = ''
      this.newPassword = ''
      this.reNewPassword = ''
      this.$nextTick(function() {
        this.clearErrorMessage()
      })
      this.resetDialog = true
    },

    // 退出登录
    logout() {
      this.$confirm(this.$t('home.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning',
        iconClass: 'iconfont icongantanhao_icon',
        customClass: localStorage.getItem('theme') === 'Dark' ? 'dark-message-box' : 'light-message-box'
      }).then(async() => {
        const res = await this.logoutAction()
        if (res && res.success) {
          window.sessionStorage.clear()
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: this.$t('home.msg4'),
            iconClass: 'iconfont iconqueren',
            customClass:
                localStorage.getItem('theme') === 'Dark'
                  ? 'dark-el-message' : 'light-el-message'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message,
            iconClass: 'iconfont icongantanhao_icon',
            customClass:
                localStorage.getItem('theme') === 'Dark'
                  ? 'dark-el-message'
                  : 'light-el-message'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('home.msg5')
        })
      })
    },
    ...mapMutations({
      setCollapse: 'CHANGE_COLLAPSE'
    }),
    ...mapActions([
      'logoutAction',
      'loginInfoAction',
      'refreshDictAndClearStore'
    ])
  }
}
</script>
<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
}
.languageDropDwon {
  img {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
}

.home {
  width: 100%;
  height: 100%;
  aside {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    padding: 7px 0 30px 0;
    transition: all 0.2s linear;
    background: linear-gradient(
      180deg,
      rgba(52, 57, 63, 1) 0%,
      rgba(22, 23, 27, 1) 100%
    );
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.5);
    border-width: 1px 1px 1px 0;
    border-style: solid;
    border-color: #44474e;
    border-radius: 0 30px 30px 0;
    z-index: 999;
    &.collapse {
      width: 60px;
      overflow: hidden;
      .logo {
        width: 40px;
        height: 118px;
        padding: 46px 0;
        background: linear-gradient(
          129deg,
          rgba(47, 52, 58, 1) 0%,
          rgba(30, 34, 37, 1) 100%
        );
        box-shadow: 0px 0px 10px 7px rgba(112, 112, 112, 0.05),
          0px 0px 6px 1px rgba(0, 0, 0, 0.7);
        border-radius: 20px;
        img {
          height: 24px;
        }
      }
      .menu {
        padding-left: 0;
      }
    }
    .collapse {
      width: 100%;
      height: 64px;
      line-height: 64px;
      padding-right: 30px;
      text-align: right;
      cursor: pointer;
      span {
        .iconfont {
          color: #888888;
        }
      }
    }
    .iscollapse {
      padding-right: 0;
      text-align: center;
    }
    .logo {
      width: 200px;
      height: 118px;
      padding: 28px 0;
      margin: 0 auto 10px;
      text-align: center;
      background: linear-gradient(
        129deg,
        rgba(47, 52, 58, 1) 0%,
        rgba(30, 34, 37, 1) 100%
      );
      box-shadow: 0px 0px 10px 7px rgba(112, 112, 112, 0.05),
        0px 0px 6px 1px rgba(0, 0, 0, 0.7);
      border-radius: 20px;
      transition: all 0.2s linear;
      cursor: pointer;
      img {
        width: auto;
        height: 66px;
        vertical-align: top;
        transition: all 0.2s linear;
      }
    }
    .menu {
      width: 100%;
      height: 100%;
      padding-left: 10px;
      overflow: hidden;
      .el-menu {
        border: none;
        background-color: transparent;
      }
      .el-submenu .el-menu-item {
        min-width: 0 !important;
      }
    }
  }
  .header {
    position: fixed;
    right: 0;
    left: 280px;
    width: calc(100% - 280px);
    min-width: 800px;
    height: 74px;
    padding: 0 40px;
    background-color: transparent;
    display: flex;
    align-items: center;

    .home-icon {
      margin-right: 8px;
    }
    .collapse {
      box-sizing: border-box;
      padding: 4px 15px 0 10px;
      cursor: pointer;
      transition: all 0.2s linear;
      .iconfont {
        font-size: 26px;
      }
      &.iscollapse {
        transform: rotate(-90deg);
      }
    }
    .path {
      flex: 1;
    }
    .userInfo {
      // width: 200px;
      height: 60px;
      box-sizing: border-box;
      padding-right: 20px;
      line-height: 60px;
      cursor: pointer;

      .userinfo-inner {
        display: block;
        box-sizing: border-box;
        line-height: 60px;
        display: flex;
        align-items: center;
        height: 60px;
        img {
          display: block;
          height: 46px;
          width: 46px;
          cursor: pointer;
        }
        .avatar-icon {
          margin-right: 8px;
          .iconfont {
            font-size: 20px;
          }
        }
        span {
          display: block;
        }
        .name {
          margin-right: 10px;
        }
      }
    }
    .down-icon i {
      font-size: 12px;
    }

    .language-info {
      height: 60px;
      box-sizing: border-box;
      line-height: 60px;
      margin-right: 20px;
      cursor: pointer;
      align-items: center;
      .language-icon {
        align-items: center;
        font-size: 12px;
        font-family: "微软雅黑";
        color: #ffffff;
        span {
          margin: auto;
        }
      }
    }
    .theme-info {
      height: 60px;
      box-sizing: border-box;
      line-height: 60px;
      margin-right: 10px;
      align-items: center;
      .theme-icon {
        align-items: center;
        .iconfont {
          font-size: 16px;
          margin: auto;
        }
      }
    }
    // .iconB{
    //   font-size: 15px;
    // }
  }

  .main {
    display: flex;
    flex-direction: column;
    width: calc(100% - 280px);
    height: 100%;
    padding-top: 74px;
    margin-left: 280px;
    overflow: initial;
    transition: all 0.3s;
    box-sizing: border-box;

    section {
      flex: 1;
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      overflow: auto;
      & > div {
        height: 100%;
        width: 100%;
        border: 1px solid #eaeaea;
        overflow: hidden;
        .search .btns {
          padding: 10px 10px 0 0;
          box-sizing: border-box;
          width: 100%;
          display: flex;
          text-align: right;
          & > div {
            width: 50%;
          }
          .left {
            text-align: left;
          }
        }
      }
    }
  }
}
#app[data-theme="Light"] .home .header .language-info .language-icon {
  display: flex;
}
#app[data-theme="Light"] .home .header .theme-info .theme-icon {
  display: flex;
}
</style>
