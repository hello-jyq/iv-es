<template>
  <div id="taskApproveDialog" :class="theme=='Light'?'apply-light':'apply'">
    <el-dialog
      title="审批"
      :visible.sync="isShow"
      custom-class="dialog-drag"
      class="content-dialog-box approve-dialog"
      :before-close="handleClose"
      :close-on-click-modal="false"
      top="0"
    >
      <div style="display: flex;flex-direction: column;height: 100%;">
        <div class="table-bg-box marigin-bottom">
          <!-- <el-form ref="itemInfo" :model="item" :rules="rules" label-width="110px" label-position="left" class="content-top- form-big-lable"> -->
          <!-- <el-form-item label="备 注" prop="remark" class="big-input">
            <el-input v-model="item.remark" type="textarea" class="textarea-height" />
          </el-form-item> -->
          <!-- <el-form ref="itemInfo" :model="item" :rules="rules" label-width="110px" label-position="left" class="content-top-form form-big-lable" />

        </el-form> -->
          <!-- </el-form> -->
          <div class="input_box">
            <div class="flex3">
              <div class="title">
                <!-- 驳回至 -->
                {{ $t('component.taskApprove.dismissTo') }}
              </div>
              <el-select
                v-model="destActivityId"
                clearable
                class="input"
                :popper-class="theme=='Light'?'blueSelect':''"
              >
                <el-option
                  v-for="item in destActivityList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div class="flex1">
              <div class="title">
                <!-- 备注 -->
                {{ $t('component.taskApprove.remarks') }}
              </div>
              <el-input
                v-model="comment"
                class="input"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 7}"
                :placeholder="$t('component.taskApprove.remarks')"
              />
            </div>
          </div>
        </div>
        <ul id="abc" class="operation-box dialog-btn-box fixed-btn-box end-content-flex" style="justify-content: flex-start;">
          <li class="operation-small-item" @click="handleAgreeClick">
            <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconqueren" /></span>
            <span class="operation-text">{{ $t('component.taskApprove.agree') }}</span>
          </li>
          <!-- 驳回 -->
          <li class="operation-small-item" @click="handleRejectClick">
            <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconquxiao" /></span>
            <span class="operation-text">{{ $t('component.taskApprove.reject') }}</span>
          </li>
          <!-- 审批履历 -->
          <li class="operation-small-item" @click="handleApproveHisClick">
            <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconyiban" /></span>
            <span class="operation-text">{{ $t('comm.applyHistory') }}</span>
          </li>
          <!-- 取消 -->
          <li class="operation-small-item" @click="handleReturnClick">
            <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconwithdraw-fill" /></span>
            <span class="operation-text">{{ $t('comm.cancel') }}</span>
          </li>
        </ul>
      </div>
    </el-dialog>

    <process-detail
      :key="processInstId"
      :process-inst-id="processInstId"
      :is-show="dialogTableVisible"
      @onClose="dialogTableVisible = false"
    />
  </div>
</template>

<script>
import { agreeTask, rejectTask, getBackActivity } from '@/api/base'
import ProcessDetail from '@/components/ProcessDetailNew'

// var elementResizeDetectorMaker = require('element-resize-detector')
import $ from 'jquery'
import 'jquery.nicescroll'

export default {
  components: {
    ProcessDetail
  },
  props: {
    processInstId: {
      type: String,
      required: true
    },
    taskId: {
      type: String,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',
      scrollColr: localStorage.getItem('theme') !== 'Dark' ? '#D8E0E8' : '#5A5E63',
      ProcessDetailShow: false,
      isLoading: true,
      approveHis: [],
      activityInfos: [],
      canWithdraw: false,
      destActivityId: '',
      destActivityList: [],
      comment: '',
      dialogTableVisible: false

    }
  },
  mounted() {
    // this.getProcessDetailScrollBar()
    this.getScrollBar()
    // var erd = elementResizeDetectorMaker()
    // var that = this
    // erd.listenTo(that.$refs.table, function(element) {
    //   that.$nextTick(function() {
    //     this.getScrollBar()
    //     $('.el-table__body-wrapper').getNiceScroll().resize()
    //   })
    // })
  },
  created: function() {
    this.getDestActivityList()
  },
  wtach: {
    // dialogTableVisible: function() {
    //   this.$nextTick(function() {
    //     // this.getProcessDetailScrollBar()
    //     this.getScrollBar()
    //   })
    // }
  },
  methods: {
    // getProcessDetailScrollBar() {
    //   $('.el-dialog__body').niceScroll({
    //     cursorcolor: this.scrollColr,
    //     cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
    //     cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
    //     cursorwidth: '8px', // 滚动条的宽度，单位：便素
    //     cursorborder: `1px solid ${this.scrollColr}`, // CSS方式定义滚动条边框
    //     autohidemode: true, // 隐藏滚动条的方式, 可用的值:
    //     zindex: 0,
    //     railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
    //     boxzoom: false,
    //     iframeautoresize: false // 在加载事件时自动重置iframe大小
    //   })
    // },
    getScrollBar() {
      $('approve-dialog .el-table__body-wrapper').niceScroll({
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
    handleClose(done) {
      this.$emit('onClose')
    },
    getDestActivityList: async function() {
      const params = { taskId: this.taskId }
      console.log(params)
      const res = await getBackActivity(params)
      if (res && res.success) {
        this.destActivityList = res.datas.backToList
      }
    },
    handleApproveHisClick() {
      this.dialogTableVisible = true
    },
    handleAgreeClick: function() {
      this.$confirm(this.$t('comm.tip14'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const param = { taskId: this.taskId, comment: this.comment }
        const res = await agreeTask(param)
        if (res && res.success) {
          this.$router.push('/workflow/runnings')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleRejectClick: function() {
      if (!this.destActivityId) {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg30')
        })
        return
      }
      if (!this.comment) {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg31')
        })
        return
      }
      this.$confirm(this.$t('comm.tip15'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const param = { taskId: this.taskId, destActivityId: this.destActivityId, comment: this.comment }
        const res = await rejectTask(param)
        if (res && res.success) {
          this.$router.push('/workflow/runnings')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleReturnClick: function() {
      this.$emit('onClose')
    }
  }
}
</script>
<style lang="scss">
#taskApproveDialog {
  height:auto;
  .dialog-drag {
    width: 1000px;
  min-width: auto !important;
  // height: 620px;
  max-height: 400px;
  }
}
</style>
