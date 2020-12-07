<template>
  <div class="login">
    <!--左边登录-->
    <div class="login-info">
      <div class="language-in">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link" style="color:#202B5C">
            中文
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown" class="login-down">
            <el-dropdown-item>
              <img src="@/assets/img/cn.png" class="lanIcon" />
              <span>中文</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <img src="@/assets/img/en.png" class="lanIcon" />
              <span>English</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <img src="@/assets/img/jp.png" class="lanIcon" />
              <span>にほんご</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

           
      </div>
      <el-form label-position="left" label-width="0px" @submit.native.prevent :model="ruleForm"  :rules="rules" ref="ruleForm">
        <h1 class="logo">
          <router-link to>
            <img src="@/assets/img/logo_login.png" />
          </router-link>
        </h1>
       <el-form-item prop="userName">
          <el-input  type="text" v-model="ruleForm.userName" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input v-if="!isOpen" v-model="ruleForm.userPassword" type="password" placeholder="密码">
            <i slot="suffix" class="iconfont icon-yanjing" @click.prevent="onOpen" />
          </el-input>
          <el-input v-else v-model="ruleForm.userPassword" type="text" placeholder="密码">
            <i slot="suffix" class="iconfont icon-yanjing" @click.prevent="onOpen" />
          </el-input>
        </el-form-item>
        <div class="retrieve">
          <span @click="retrieveDialog = true">找回密码</span>
        </div>
        <el-form-item style="width:100%;margin-bottom:0 !important">
          <el-button type="primary" style="width:100%;"   @click.native="login">登&nbsp;&nbsp;录</el-button>
        </el-form-item>
      </el-form>
      <div class="copyright">©Copyright 2009-2020 iVision Shanghai Co., Ltd. All Rights Reserved. 沪ICP备xxxxxxxx号</div>
    </div>
    <!--右边banner-->
    <div class="login-banner">
      <el-carousel arrow="never" :autoplay="true" trigger="click">
        <el-carousel-item v-for="item in itemTxt" :key="item.index">
          <h2>{{item.title}}</h2>
          <div class="txt">{{item.content}}</div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 忘记密码弹窗 -->
    <el-dialog
      top="0"
      custom-class="retrieve_password dialog-drag"
      title="找回密码"
      :visible.sync="retrieveDialog"
      center
    >
      <div class="context">
        <p class="retrieve-tips">为了确定是您本人，系统将发送一条邮件到您的邮箱，请按邮件提示操作!</p>
        <el-form ref="retrieveForm" :model="retrieveForm" class="retrieve-form">
          <el-form-item
            prop="userName"        
          >
            <el-input v-model="retrieveForm.userName" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="sendEmail"
            >发&nbsp;&nbsp;送</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!--  发送结果弹窗-->
    <el-dialog
      top="0"
      custom-class="dialog-drag retrieve_password send-box"
      :title="title"
      :visible.sync="resultDialog"
      center
    >
      <div class="context">
        <p class="retrieve-tips">{{ isSucccess ? successText : failText }}</p>
        <div class="retrieve-form">
          <el-button
            type="primary"
            @click="submitResult"
          >{{ isSucccess ? ' 完&nbsp;&nbsp;成' : ' 重新填写' }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formValidator } from '@/mixins/form-validator'
export default {
  data() {
    return {
      isOpen: false,
      resultDialog: false,
      isSucccess: false,
      successText: "系统已将邮件发送至您的邮箱，请注意查收！",
      failText: "邮箱发送失败，请重新填写邮箱地址！",
      title: "发送成功",
      retrieveDialog: false,
      retrieveForm: {
        userName: ''
      },
      ruleForm: {
        userName: "",
        userPassword: ""
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: 'blur'
          }
        ],
        userPassword: [
          {
            required: true,
            message: "请输入密码",
            trigger: 'blur'
          }
        ]
      },
      itemTxt: [{
        title: '嘿，欢迎回来！',
        content: '从现在开始，Huge Vision ESE 系统将快速、高效、精准帮助您搜索到您想要的内容'
      }, {
        title: 'Hey there, Welcome back！',
        content: 'From now on, Huge Vision ESE system will help you search for the content you want quickly, efficiently and accurately.'
      }, {
        title: 'こんにちは、おかえりなさい！',
        content: '今後、Huge Vision ESEシステムは、必要なコンテンツを迅速、効率的、正確に検索するのに役立ちます。'
      }]

    };
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    login() {

      // this.$refs.ruleForm.validate(
      //   async valid => {
      //     if (valid) {
      //       let redirect = this.$router.history.current.query.redirect
      //       redirect = redirect === '/login' ? '' : redirect
      //       const path = redirect || '/'
      //       // // console.log(path)
      //       this.$router.push(path)
      //     }
      //   })
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const params = this.ruleForm
          const res = await this.loginAction(params)
          // // console.log(res)
          if (res && res.success) {
            // this.initLang(this.userInfo.locale)
            // this.$message({
            //   type: 'success',
            //   message: this.$t('comm.welcome') + this.userInfo.nickName,
            //   customClass: localStorage.getItem('theme') === 'Dark' ? 'dark-message-box' : 'light-message-box'
            // })
            // if (res.datas.userInfo.isNeedChangePassword) {
            //   this.$router.push('/changePassword')
            //   return
            // }
            let redirect = this.$router.history.current.query.redirect
            redirect = redirect === '/login' ? '' : redirect
            const path = redirect || '/'
            // // console.log(path)
            this.$router.push(path)
          }
        } else {
          return false
        }
      })
    },
    ...mapActions(['loginAction']),


    onOpen() {
      this.isOpen = !this.isOpen;
    },
    sendEmail() {
      if (this.retrieveForm.userName != '') {
        this.isSucccess = true;
        this.retrieveDialog = false
        this.resultDialog = true
      }
    },
    submitResult() {
      if (this.isSucccess = true) {
        this.$router.push("/login");
      }
    },

  }
};
</script>

<style scoped>
.login {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #ffffff;
}
.login-info {
  float: left;
  width: 45%;
  height: 100%;
  position: relative;
}
.login-info form {
  position: absolute;
  top: calc(50% - 270px);
  left: calc(50% - 215px);
  width: 430px;
}

.el-form-item {
  margin-bottom: 40px;
}
.icon-yanjing {
  font-size: 20px;
  color: #666666;
}

.logo {
  width: 260px;
  height: 104px;
  margin: 0 auto 66px auto;
}
.logo img {
  width: 100%;
  height: 100%;
}

.login-banner {
  float: left;
  width: 55%;
  height: 100%;
  position: relative;
}
.login-banner .el-carousel__container {
  height: 100vh;
}
.login-banner .el-carousel {
  height: 100%;
}
.login-banner .el-carousel__item {
  width: 100%;
  height: 100vh;
  background-image: url("../assets/img/loginbg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.login-banner h2 {
  position: absolute;
  bottom: 25%;
  left: calc(50% - 220px);
  width: 440px;
  height: 42px;
  text-align: center;
  font-family: "微软雅黑";
  font-size: 30px;
  color: #ffffff;
}
.login-banner .txt {
  position: absolute;
  bottom: 18%;
  left: calc(50% - 354px);
  width: 708px;
  height: 56px;
  text-align: center;
  font-family: "微软雅黑";
  font-size: 18px;
  color: #ffffff;
}

.retrieve {
  line-height: 19px;
  margin-top: -20px;
  margin-bottom: 24px;
  font-family: "微软雅黑";
  color: #2fa5bb;
  text-align: right;
  cursor: pointer;
}
.retrieve span {
  font-size: 14px;
}

.copyright {
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  font-size: 12px;
  text-align: center;
  color: #666666;
}

.el-icon-close {
  font-size: 16px;
  color: #333 !important;
}

.iconai-arrow-down {
  margin-left: 15px;
  color: #1c1d54;
}

.language-in {
  height: 34px;
}
.language-in .el-dropdown {
  margin-top: 50px;
  margin-left: 60px;
}
.retrieve-tips {
  font-size: 16px;
  color: #333333;
  text-align: center;
}
</style>
