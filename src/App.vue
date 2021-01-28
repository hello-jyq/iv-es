<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view v-if="isRouterAlive" />
    </transition>
  </div>
</template>
<script>
import { logout } from '@/api/login.js'
import * as types from '@/store/mutation-type'

export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  watch: {
    '$store.state.loginStatus': function(newValue, oldValue) {

      console.log(this.$store.state.loginStatus)

      if (this.$store.state.loginStatus === 'no') {
        return
      }      
      let settiontimeoutMinSecond = 3600000 // 1小时

      const timerId = setInterval(() => {
        settiontimeoutMinSecond -= 60000
        if (settiontimeoutMinSecond < 1) {
          clearInterval(timerId)
          this.$confirm(this.$t('comm.e0011'), this.$t('comm.e0013'), {
            confirmButtonText: this.$t('comm.certain'),
            type: 'warning'
          }).then(async() => {
            const res = await logout()

            if (res && res.success) {
              this.$store.commit(types.SET_LOGIN_STATUS, 'no')
              this.$store.commit(types.SET_CSRF_TOKEN, '')
              this.$store.commit(types.SET_USER_INFO, {})
              this.$store.commit(types.SET_ORGLIST_INFO, []) // 添加用户的组织信息   
              window.sessionStorage.clear()
              this.$router.push('/login')
              this.$message({
                type: 'success',
                message: this.$t('home.msg4'),
                iconClass: 'iconfont iconqueren',
                customClass: 'light-el-message'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.message,
                iconClass: 'iconfont icongantanhao_icon',
                customClass: 'light-el-message'
              })
            }
          })
        }

        if (settiontimeoutMinSecond === 300000) {  // 5分钟前提示
          this.$alert('距离页面超时时间还有5分钟,请尽快提交数据!', this.$t('comm.e0013'), {
            confirmButtonText: this.$t('comm.certain'),
            callback: action => {}
          })
        }
      }, 60000)   
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
      var currentPath = window.location.hash.slice(1) // 获取输入的路由
      if (this.$router.path !== currentPath) {
        this.$router.push(currentPath) // 动态跳转
      }
    }, false)
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0px;
  padding: 0px;
  font-family: "微软雅黑";
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

#app {
  width: 100%;
  // min-height: 100vh;
  height: 100vh;
  // color: #ffffff;
}

// .el-submenu [class^=fa] {
// 	vertical-align: baseline;
// 	margin-right: 10px;
// }

// .el-menu-item [class^=fa] {
// 	vertical-align: baseline;
// 	margin-right: 10px;
// }

// .toolbar {
// 	background: #f2f2f2;
// 	padding: 10px;
// 	//border:1px solid #dfe6ec;
// 	margin: 10px 0px;
// 	.el-form-item {
// 		margin-bottom: 10px;
// 	}
// }

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
