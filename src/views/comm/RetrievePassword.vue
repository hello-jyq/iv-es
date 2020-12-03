<template>
  <div class="index">
    <h3>{{ $t('comm.changePassword') }}</h3>
    <div v-show="retrieve" class="password">
      <div class="input_box">
        <div class="flex1">
          <div class="title must">
            <!-- 当前密码 -->
            {{ $t('comm.nowPassword') }}
          </div>
          <div class="input">
            <el-input v-model="oldPassword" :placeholder="$t('comm.nowPassword')" class="input" type="password" show-password @blur="validator('oldPassword')" />
            <span ref="oldPassword" data-roles="required" :data-value="oldPassword" class="message" />
          </div>
        </div>
        <div class="flex1">
          <div class="title must">
            <!-- 新密码 -->
            {{ $t('comm.newPassword') }}
          </div>
          <div class="input">
            <el-input v-model="newPassword" :placeholder="$t('comm.newPassword')" class="input" type="password" maxlength="20" show-password @blur="validator('newPassword')" />
            <span ref="newPassword" data-roles="required,password" :data-value="newPassword" class="message" />
          </div>
        </div>
        <div class="flex1">
          <div class="title must">
            <!-- 确认密码 -->
            {{ $t('comm.cPassword') }}
          </div>
          <div class="input">
            <el-input v-model="reNewPassword" :placeholder="$t('comm.cPassword')" class="input" type="password" maxlength="20" show-password @blur="validator('reNewPassword')" />
            <span ref="reNewPassword" data-roles="required,password" :data-value="reNewPassword" class="message" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!validatorState" @click="handleChangePasswordOkClick">{{ $t('comm.certain') }}</el-button>
      </span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { changePassword } from '@/api/login'
import { formValidator } from '@/mixins/form-validator.js'
export default {
  mixins: [formValidator],
  data() {
    return {
      retrieve: false,
      oldPassword: '',
      newPassword: '',
      reNewPassword: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created: async function() {
    const res = await this.loginByTokenAction({ userName: this.$route.query.userName, token: this.$route.query.token })
    if (res.success) {
      this.retrieve = true
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    async handleChangePasswordOkClick() {
      if (!this.validatorAll()) {
        return false
      }
      if (this.newPassword !== this.reNewPassword) {
        this.setValidatorMessage('reNewPassword', this.$t('msg.error.home.msg1'))
        this.validatorState = false
        return
      }
      if (this.newPassword === this.oldPassword) {
        this.setValidatorMessage('newPassword', this.$t('msg.error.home.msg2'))
        this.validatorState = false
        return
      }
      if (this.newPassword === this.userInfo.userName) {
        this.setValidatorMessage('newPassword', this.$t('msg.error.home.msg3'))
        this.validatorState = false
        return
      }
      const param = { oldPassword: this.oldPassword, newPassword: this.newPassword }
      const res = await changePassword(param)
      if (res.success) {
        this.$router.push('/')
      }
    },
    ...mapActions([
      'loginByTokenAction'
    ])
  }
}
</script>
<style lang="scss" scoped>
  .index {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 6px;
    h3 {
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      border-bottom: 1px dashed #ccc;
      margin-bottom: 15px;
      position: relative;
    }
    .password {
      width: 50%;
      margin-bottom: 15px;
      overflow: hidden;
    }
  }
</style>
