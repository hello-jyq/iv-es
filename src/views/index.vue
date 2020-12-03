<template>
  <div class="wraper">
      <meau></meau>
      <div class="con">
        <div class="header">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">普通搜索</el-breadcrumb-item>
                <el-breadcrumb-item v-if="$route.name!='普通搜索'">{{$route.name}}</el-breadcrumb-item>
              </el-breadcrumb>
              <div class="info">          
                  <el-dropdown trigger="click" placement="top">                
                    <span class="el-dropdown-link">
                        <span class="btn_round_icon">
                          <i class="iconfont icon-touxiang"></i>
                        </span>
                          事业开发部：顾亦涵
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="logout()">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-dropdown trigger="click" class="lang">                
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
                  </el-dropdown>
              </div>
          </div>
              <router-view/>
      </div>
  </div>
</template>

<script>
import meau from '@/components/meau'
export default {
  data() {
    return {

    }
  },
  components: { meau },
  methods: {
    logout() {
      this.$router.push("/login");
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
</style>