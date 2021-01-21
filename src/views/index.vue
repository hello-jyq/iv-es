<template>
  <div class="wraper">
    <meau />
    <div class="con">
      <div class="header">
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">
            <i class="iconfont icon-tianchongxing-" />&nbsp;普通查询
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="routeURL!='/search/general_search'||routeURL!='search/general_search'">
            {{ routeName }}
          </el-breadcrumb-item>
        </el-breadcrumb> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <!-- 首页注释不显示 -->
          <!-- <el-breadcrumb-item :to="{ path: '/' }">
            <i class="iconfont icon-tianchongxing-" />
            {{ $t('comm.home') }}
          </el-breadcrumb-item> -->
          <template v-for="item in breadcrumbItems">
            <el-breadcrumb-item v-if="item.resUrl" :key="item.id" :to="{path:'/'+item.resUrl}">
              {{ item.resName!=''?item.resName:'' }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else :key="item.id">
              {{ item.resName!=''?item.resName:'' }}
            </el-breadcrumb-item>
          </template>
        </el-breadcrumb>
        <div class="info">
          <el-dropdown trigger="click" placement="top">
            <span class="el-dropdown-link">
              <span class="btn_round_icon">
                <i class="iconfont icon-touxiang" />
              </span>
              {{ userInfo.orgFullName }}：{{ userInfo.nickName }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="showChangeOrgMenu == true" @click.native="handleChangeOrgOpenClickTest">
                  <i class="iconfont icon-qiehuan" />
                {{ $t('comm.changeOrg') }}
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout()">
                <i class="iconfont icon-tuichu" />
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--等待下次 -->
          <!-- <el-dropdown trigger="click" class="lang">
            <span class="el-dropdown-link">
              <span class="btn_round_icon">
                <i class="iconfont" style="font-size:12px">Cn</i>
              </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>中文</el-dropdown-item>
              <el-dropdown-item>英文</el-dropdown-item>
              <el-dropdown-item>日文</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
      </div>
      <router-view />
    </div>
    <!-- 切换组织 20200221 add -->
    <change-org
      :is-show="dialogChangeOrgVisible"
      @onClose="dialogChangeOrgVisible = false;"
      @onChangeOrgSuccess="onChangeOrgSuccess"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import meau from '@/components/meau'
import ChangeOrg from '@/views/comm/ChangeOrg'
import { formValidator } from '@/mixins/form-validator.js'

export default {
  components: {
    meau,
    ChangeOrg
  },
  mixins: [formValidator],
  data() {
    return {
      breadcrumbItems: [],
      dialogChangeOrgVisible: false,
      showChangeOrgMenu: false,
      selectOrgId: '',
      resetOrg: false
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
      if (newValue) {
        const menuIndex = window.sessionStorage.getItem('activeMenu')
        if (menuIndex) {
          this.breadcrumbItems = []
          const seqNo = menuIndex.split(':')
          this.getSelectedMenus(this.menuList, seqNo)
        }
        // console.log(22222222222, newValue)
        if (newValue.name === '普通搜索') {
          this.breadcrumbItems = []
          this.breadcrumbItems.push({ id: 'menu-search', resUrl: null, resName: '搜索方式' }, { id: 'menu-search-general-search', resUrl: 'search/general_search', resName: '普通搜索' })
          // document.querySelectorAll('li.el-menu-item')[0].click()
          const meauName = document.querySelectorAll('li.el-menu-item')
          for (let i = 0; i < meauName.length; i++) {
            if (meauName.item(i).innerText === '普通搜索') {
              document.querySelectorAll('li.el-menu-item')[i].click()
            }
          }
        }
      }
    }
  },
  mounted() {
    const menuIndex = window.sessionStorage.getItem('activeMenu')
    // console.log('-==============>>>>>>', menuIndex)
    if (menuIndex) {
      this.breadcrumbItems = []
      const seqNo = menuIndex.split(':')
      this.getSelectedMenus(this.menuList, seqNo)
    } else {
      this.breadcrumbItems.push({ id: 'menu-search', resUrl: null, resName: '搜索方式' }, { id: 'menu-search-general-search', resUrl: 'search/general_search', resName: '普通搜索' })
    }
    // 表示变更组织的菜单
    if (this.userOrgList !== undefined && this.userOrgList.length) {
      this.showChangeOrgMenu = true
    }
  },
  methods: {
    logout() {
      this.$confirm(this.$t('home.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async () => {
        const res = await this.logoutAction()
        if (res && res.success) {
          window.sessionStorage.clear()
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: this.$t('home.msg4')
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('home.msg5')
        })
      })
    },
    ...mapActions([
      'logoutAction',
      'loginInfoAction',
      'refreshDictAndClearStore'
    ]),
    getSelectedMenus(menuList, seqNo) {
      const id = seqNo.shift()
      if (!id || id === 'null') {
        return
      }
      const menu = menuList.filter(menu => menu.id === id)
      this.breadcrumbItems.push(menu[0])
      this.getSelectedMenus(menu[0].children, seqNo)
    },
    handleChangeOrgOpenClick() {
      this.$nextTick(function () {
        this.clearErrorMessage()
      })

      if (this.userOrgList !== undefined && this.userOrgList.length) {
        this.selectOrgId = this.userOrgList[0].id
      }
      this.resetOrg = true
    },
    handleChangeOrgOpenClickTest() {
      this.$nextTick(function () {
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
      // this.$router.push('/')
      // this.breadcrumbItems = []
      // this.breadcrumbItems.push({ id: 'menu-search', resUrl: null, resName: '搜索方式' }, { id: 'menu-search-general-search', resUrl: 'search/general_search', resName: '普通搜索' })
      this.$router.push('/')
      this.$router.go(0)
    }
  }
}
</script>
<style scoped>
.wraper {
  width: 100%;
  height: 100vh;
  display: flex;
}
.con {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.header {
  height: 64px;
  margin-left: 40px;
  margin-right: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info {
  width: auto;
  height: 22px;
  display: flex;
  justify-content: right;
}
.lang {
  margin-right: 0;
  margin-left: 30px;
}
.lang .btn_round_icon {
  margin-right: 0;
}
.main {
  margin-left: 40px;
  margin-right: 40px;
  flex: 1;
}
.icon-tuichu {
  font-size: 12px;
}
</style>
