<template>
  <div class="login">
    <!--左边登录-->
    <div class="login-info">
      <div class="language-in">
        <!-- 20200704 By Zhang 本系统第一版暂时不支持国际化 , 未来系统需要多语言配置时，可以恢复这个功能。但是，需要完整的测试
        <el-dropdown trigger="click">
          <span class="el-dropdown-link" style="color:#202B5C">
            中文<i class="iconfont iconai-arrow-down" />
          </span>
          <el-dropdown-menu slot="dropdown" class="login-down">
            <el-dropdown-item><img src="@/assets/images/language/cn.png" class="lanIcon"><span>中文</span></el-dropdown-item>
            <el-dropdown-item><img src="@/assets/images/language/en.png" class="lanIcon"><span>English</span></el-dropdown-item>
            <el-dropdown-item><img src="@/assets/images/language/jp.png" class="lanIcon"><span>にほんご</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        -->
      </div>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-position="left"
        label-width="0px"
        @submit.native.prevent
      >
        <h1 class="logo">
          <router-link to="">
            <img src="@/assets/images/login/elastic-logo.svg">
          </router-link>
        </h1>
        <el-form-item prop="userName">
          <el-input
            v-model="ruleForm.userName"
            type="text"
            :placeholder="$t('comm.userName')"
          />
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            v-if="!isOpen"
            v-model="ruleForm.userPassword"
            type="password"
            :placeholder="$t('comm.password')"
          >
            <i
              slot="suffix"
              class="iconfont iconyanjing"
              @click.prevent="onOpen()"
            />
          </el-input>
          <el-input
            v-else
            v-model="ruleForm.userPassword"
            type="text"
            :placeholder="$t('comm.password')"
          >
            <i
              slot="suffix"
              class="iconfont iconyanjing"
              @click.prevent="onOpen"
            />
          </el-input>
        </el-form-item>
        <div class="retrieve" style="height: 10px;">
          <!--  20200704 by Zhang 第一版暂时不支持找回密码功能。 此功能需要时，请进行完整的测试。
          <span @click="retrieveDialog = true">{{ $t('password.retrievePassword') }}</span>
          -->
        </div>
        <el-form-item style="width:100%;margin-bottom:0 !important">
          <el-button
            type="primary"
            style="width:100%;"
            native-type="handleSubmit"
            :loading="logining"
            @click="handleSubmit"
          >
            登&nbsp;&nbsp;录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="copyright">
        ©Copyright 2009-2021 iVision Shanghai Co., Ltd. All Rights Reserved. 沪ICP备xxxxxxxx号
      </div>
    </div>
    <!--右边banner-->
    <div class="login-banner">
      <el-carousel arrow="never" :autoplay="true" trigger="click">
        <el-carousel-item v-for="item in 3" :key="item">
          <h2>Hey there, Welcome back！</h2>

          <div class="txt">
            Start Now, IV FULL-TEXT-SEARCH system will help you easy to find your files in a smart way.
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 忘记密码弹窗 -->
    <el-dialog
      top="0"
      custom-class="retrieve_password dialog-drag"
      :title="$t('password.retrievePassword')"
      :visible.sync="retrieveDialog"
      center
    >
      <div class="context">
        <p class="retrieve-tips">
          为了确定是您本人，系统将发送一条邮件到您的邮箱，请按邮件提示操作!
        </p>
        <el-form ref="retrieveForm" :model="retrieveForm" class="retrieve-form">
          <el-form-item
            prop="userName"
            :rules="[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
            ]"
          >
            <el-input v-model="retrieveForm.userName" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="btnLoading"
              :disabled="!validatorState"
              @click="submitForm('retrieveForm')"
            >
              发&nbsp;&nbsp;送
            </el-button>
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
        <p class="retrieve-tips">
          {{ isSucccess ? successText : failText }}
        </p>
        <div class="retrieve-form">
          <el-button
            type="primary"
            :loading="btnLoading"
            :disabled="!validatorState"
            @click="submitResult"
          >
            {{ isSucccess ? ' 完&nbsp;&nbsp;成' : ' 重新填写' }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { setLang } from '@/utils/storage'
import { lang } from '@/mixins/lang'
import { formValidator } from '@/mixins/form-validator'
import { getLanguageType } from '@/utils/lang'
// import { sendMail } from '@/api/login.js'

export default {
  mixins: [lang, formValidator],
  data() {
    return {
      isOpen: false,
      resultDialog: false,
      isSucccess: false,
      successText: '系统已将邮件发送至您的邮箱，请注意查收！',
      failText: '邮箱发送失败，请重新填写邮箱地址！',
      title: '发送成功',
      language: [
        {
          'dictTypeId': 'Language',
          'dictId': 'zh_CN',
          'dictName': '中文',
          'status': 1,
          'sortNo': 1,
          'rankNo': null,
          'parentId': null,
          'seqNo': '.Language.zh_CN.',
          'filter1': null,
          'filter2': null,
          'description': null
        },
        {
          'dictTypeId': 'Language',
          'dictId': 'ja_JP',
          'dictName': '日本語',
          'status': 1,
          'sortNo': 2,
          'rankNo': null,
          'parentId': null,
          'seqNo': '.Language.ja_JP.',
          'filter1': null,
          'filter2': null,
          'description': null
        },
        {
          'dictTypeId': 'Language',
          'dictId': 'en_US',
          'dictName': 'English',
          'status': 1,
          'sortNo': 3,
          'rankNo': null,
          'parentId': null,
          'seqNo': '.Language.en_US.',
          'filter1': null,
          'filter2': null,
          'description': null
        }
      ],
      retrieveDialog: false,
      active: 1,
      btnLoading: false,
      retrieveForm: {
        userName: ''
      },
      userName: '',
      langIcon: '',
      logining: false,
      ruleForm: {
        userName: '',
        userPassword: ''
      },
      rules: {
        userName: [
          {
            required: true,
            message: this.$t('comm.msg32', { para0: this.$t('comm.userName') }),
            trigger: 'blur'
          }
        ],
        userPassword: [
          {
            required: true,
            message: this.$t('comm.msg32', { para0: this.$t('comm.password') }),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.title = this.isSucccess ? '发送成功' : '发送失败'
    window.localStorage.getItem('lang')
  },
  methods: {
    submitResult() {
      this.resultDialog = false
      if (!this.isSucccess) {
        this.retrieveDialog = true
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // // console.log('submit!')
          // const res = await sendMail(this.retrieveForm.userName)
          const res = {
            success: true
          }

          if (res && res.success) {
            this.btnLoading = false
            this.title = '发送成功'
            this.isSucccess = true
            this.retrieveDialog = false
          } else {
            this.title = '发送失败'
            this.isSucccess = false
          }
          this.resultDialog = true
        } else {
          // // console.log('error submit!!')
          return false
        }
      })
    },
    initLang(langStr) {
      const lang = getLanguageType(langStr)
      // // console.log('lang', lang)
      setLang(lang)
      this.$i18n.locale = lang
    },
    onOpen() {
      this.isOpen = !this.isOpen
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
    },
    handleSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const params = this.ruleForm
          const res = await this.loginAction(params)
          // // console.log(res)
          if (res && res.success) {
            this.initLang(this.userInfo.locale)
            this.$message({
              type: 'success',
              message: this.$t('comm.welcome') + this.userInfo.nickName,
              customClass: localStorage.getItem('theme') === 'Dark' ? 'dark-message-box' : 'light-message-box'
            })
            if (res.datas.userInfo.isNeedChangePassword) {
              this.$router.push('/changePassword')
              return
            }
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

    ...mapActions(['loginAction'])
  }
}
</script>

<style lang="scss">
.login {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #ffffff;

  .login-info {
    float: left;
    width: 45%;
    height: 100%;
    position: relative;
    form {
      position: absolute;
      top: calc(50% - 270px);
      left: calc(50% - 215px);
      width: 430px;
      // margin: calc(50% - 211px) auto 0 auto;
      .el-input__inner {
        height: 50px;
        padding: 0 15px;
        font-size: 16px;
        font-family: "微软雅黑";
        color: #333333;
        line-height: 21px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(153, 153, 153, 1);
      }
      .el-form-item {
        margin-bottom: 40px;
      }
      .iconyanjing {
        font-size: 20px;
        color: #666666;
      }
    }
    .logo {
      width: 260px;
      height: 107px;
      margin: 0 auto 66px auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .login-banner {
    float: left;
    width: 55%;
    height: 100%;
    position: relative;
    .el-carousel__container {
      height: 100vh;
    }
    .el-carousel__item {
      width: 100%;
      height: 100vh;
      background-image: url("./../assets/images/login/loginbg.png");
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      h2 {
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
      .txt {
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
    }

    .el-carousel__button {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-bottom: 71px;
    }
    .is-active {
      .el-carousel__button {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-bottom: 70px;
      }
    }
  }
  .retrieve {
    line-height: 19px;
    margin-top: -20px;
    margin-bottom: 24px;
    font-family: "微软雅黑";
    color: #2fa5bb;
    text-align: right;
    cursor: pointer;
    span {
      font-size: 14px;
    }
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
  .el-input__inner {
    height: 50px;
    padding: 0 15px;
    font-size: 16px;
    font-family: "\5FAE\8F6F\96C5\9ED1";
    color: #333333 !important;
    line-height: 21px;
    background: rgba(255, 255, 255, 1) !important;
    border-radius: 4px;
    border: 1px solid rgba(153, 153, 153, 1) !important;
  }
  .el-icon-close {
    font-size: 16px;
    color: #333 !important;
  }

  .iconai-arrow-down {
    margin-left: 15px;
    color: #1c1d54;
  }
}
.dialog-drag {
  background: #ffffff;
}
.retrieve_password {
  box-shadow: none !important;
}
.language-in {
  height: 34px;
  .el-dropdown {
    margin-top: 50px;
    margin-left: 60px;
  }
}
body {
  .login-down {
    width: 120px !important;
    margin-top: 30px !important;
    margin-left: 30px;
    box-shadow: none !important;
    border: none !important;
    background: none;
    background: linear-gradient(
      180deg,
      rgba(71, 91, 160, 1) 0%,
      rgba(47, 165, 187, 1) 100%
    ) !important;
    .el-dropdown-menu__item {
      border: none;
      text-align: left;
      padding-left: 25px;
      height: 40px;
      img {
        width: 15px;
        height: 15px;
        margin-bottom: -3px;
        margin-right: 5px;
      }
    }
    .popper__arrow {
      left: 55px !important;
      border-bottom-color: rgba(71, 91, 160, 1) !important;
      border-top-color: rgba(71, 91, 160, 1) !important;
    }

    .popper__arrow::after {
      border-bottom-color: rgba(71, 91, 160, 1) !important;
      border-top-color: rgba(71, 91, 160, 1) !important;
    }
    .el-dropdown-menu__item:not(.is-disabled):hover {
      border: none !important;
      border-radius: 0px;
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
