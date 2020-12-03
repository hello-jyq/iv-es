<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view v-if="isRouterAlive" />
    </transition>
  </div>
</template>
<script>
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
      this.$nextTick(function () {
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
