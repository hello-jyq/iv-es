<template>
  <div id="changePassword" :class="theme=='Light' ? 'apply-light' : 'apply'">
    <el-dialog
      ref="dragBox"
      class="content-dialog-box  search-light"
      :close-on-click-modal="false"
      custom-class="dialog-drag fixed-search-btn-box"
      top="0"
      :title="$t('comm.changePassword')"
      :visible.sync="isShow"
      :before-close="handleDialogClose"
      width="500px"
    >
      <div style="display: flex;flex-direction: column;height: 100%;">
        <div class="middle-box">
          <div class="dialog-search-box middle-input">
            <el-form ref="searchForm" label-width="80px" label-position="left">
              <el-row type="flex" justify="space-between">
                <el-col :span="24">
                  <el-form-item :label="$t('comm.nowPassword')">
                    <el-input
                      v-model="oldPassword"
                      :placeholder="$t('comm.nowPassword')"
                      class="input"
                      type="password"
                      show-password
                      @blur="validator('oldPassword')"
                    />
                    <span ref="oldPassword" data-roles="required" :data-value="oldPassword" class="message" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="space-between">
                <el-col :span="24">
                  <el-form-item :label="$t('comm.newPassword')">
                    <el-input
                      v-model="newPassword"
                      :placeholder="$t('comm.newPassword')"
                      class="input"
                      type="password"
                      maxlength="20"
                      show-password
                      @blur="validator('newPassword')"
                    />
                    <span ref="newPassword" data-roles="required,password" :data-value="newPassword" class="message" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="space-between">
                <el-col :span="24">
                  <el-form-item :label="$t('comm.cPassword')">
                    <el-input
                      v-model="reNewPassword"
                      :placeholder="$t('comm.cPassword')"
                      class="input"
                      type="password"
                      maxlength="20"
                      show-password
                      @blur="validator('reNewPassword')"
                    />
                    <span ref="reNewPassword" data-roles="required,password" :data-value="reNewPassword" class="message" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <ul class="operation-box dialog-btn-box fixed-btn-box end-content-flex">
          <li class="operation-item" @click="onClose()">
            <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconquxiao" /></span>
            <span class="operation-text">{{ $t('comm.cancel') }}</span>
          </li>
          <li class="operation-item" @click="handleChangePasswordOkClick">
            <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconqueren" /></span>
            <span class="operation-text">{{ $t('comm.certain') }}</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $ from 'jquery'
import 'jquery.nicescroll'

import { formValidator } from '@/mixins/form-validator.js'
import { changePassword } from '@/api/login'

export default {
  mixins: [formValidator],

  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      scrollColr: localStorage.getItem('theme') !== 'Dark' ? '#D8E0E8' : '#5A5E63',
      dacList: [],
      // 新增结束
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',
      Height: '',
      item: null,

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
  // 新增监听
  watch: {
    'isShow': function(newVal, oldVal) {
      if (newVal === true) {
        this.$nextTick(() => {
          this.getScrollBar()
          this.getDragBar()
          const dom = document.getElementsByClassName('el-dialog__body')[0]
          dom.addEventListener('scroll', this.scroll)
        })
      }
    }
  },
  mounted() {
    this.getScrollBar()
    this.getDragBar()
    this.draggable()
    this.resizable()

    if (this.userOrgList !== undefined && this.userOrgList.length) {
      this.selectOrgId = this.userOrgList[0].id
    }
  },
  methods: {

    getScrollBar() {
      $('.el-table__body-wrapper').niceScroll({
        cursorcolor: this.scrollColr,
        cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
        cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
        cursorwidth: '8px', // 滚动条的宽度，单位：便素
        cursorborder: `1px solid ${this.scrollColr}`, // CSS方式定义滚动条边框
        autohidemode: true, // 隐藏滚动条的方式, 可用的值:
        zindex: 0,
        railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
        boxzoom: false,
        iframeautoresize: false // 在加载事件时自动重置iframe大小
      })
    },
    getDragBar() {
      $('.el-dialog__body').niceScroll({
        cursorcolor: this.scrollColr,
        cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
        cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
        cursorwidth: '8px', // 滚动条的宽度，单位：便素
        cursorborder: `1px solid ${this.scrollColr}`, // CSS方式定义滚动条边框
        autohidemode: true, // 隐藏滚动条的方式, 可用的值:
        zindex: 0,
        railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
        boxzoom: false,
        iframeautoresize: true // 在加载事件时自动重置iframe大小
      })
    },
    draggable() {
      $('.dialog-drag').draggable({
        cursor: 'move',
        handle: '.el-dialog__header',
        refreshPositions: true,
        containment: 'parent',
        stop() {
          $('.el-table__body-wrapper').getNiceScroll().resize()
          $('.el-dialog__body').getNiceScroll().resize()
        }
      })
    },
    resizable() {
      $('.dialog-drag').resizable({
        aspectRatio: false,
        minHeight: 150,
        containment: 'parent',
        stop: function(event, ui) {
          $('.footer-box').addClass('drag-table-height')
          $('.el-dialog__body').getNiceScroll().resize()
        }
      })
    },
    scroll() {
      $('.el-table__body-wrapper').getNiceScroll().resize()
    },
    // 修改—— 新增关闭前事件
    handleDialogClose() {
      this.$emit('onClose')
    },
    async handleChangePasswordOkClick() {
      if (!this.validatorAll()) {
        return false
      }
      if (this.newPassword !== this.reNewPassword) {
        this.setValidatorMessage('reNewPassword', this.$t('home.msg1'))
        this.validatorState = false
        return
      }
      if (this.newPassword === this.oldPassword) {
        this.setValidatorMessage('newPassword', this.$t('home.msg2'))
        this.validatorState = false
        return
      }
      if (this.newPassword === this.userInfo.userName) {
        this.setValidatorMessage('newPassword', this.$t('home.msg3'))
        this.validatorState = false
        return
      }
      const param = { oldPassword: this.oldPassword, newPassword: this.newPassword }
      const res = await changePassword(param)
      if (res.success) {
        this.$emit('onClose')
      }
    },
    onClose() {
      this.$emit('onClose')
    }

  }
}
</script>
<style lang="scss">
#changePassword .content-dialog-box .dialog-drag {
    height: 400px;
}
</style>
