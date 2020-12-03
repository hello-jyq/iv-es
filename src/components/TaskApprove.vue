<template>
  <div>
    <div class="table-bg-box approval-box">
      <el-collapse value="1">
        <el-collapse-item name="1" disabled>
          <span slot="title" class="collapse-title">{{ $t('component.taskApprove.approval') }}</span>
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
        </el-collapse-item>
      </el-collapse>
    </div>
    <ul class="operation-box dialog-btn-box fixed-btn-box end-content-flex" style="justify-content: flex-start;">
      <!-- 暂存
      <li class="operation-small-item" @click="handleAgreeClick">
        <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconbaocun" /></span>
        <span class="operation-text">暂&nbsp;存</span>
      </li>-->
      <!-- 提交
      <li class="operation-small-item" @click="handleRejectClick">
        <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont icontijiao" /></span>
        <span class="operation-text">提&nbsp;交</span>
      </li>-->
      <!-- 同意 -->
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
      <!-- 返回 -->
      <li class="operation-small-item" @click="handleReturnClick">
        <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconwithdraw-fill" /></span>
        <span class="operation-text">{{ $t('bud.quo.return') }}</span>
      </li>
    </ul>

    <process-detail
      :key="processInstId"
      :process-inst-id="processInstId"
      :is-show="dialogTableVisible"
      @onClose="dialogTableVisible = false"
    />
  </div>
</template>

<script>
import ProcessDetail from '@/components/ProcessDetailNew'
import { agreeTask, rejectTask, getBackActivity } from '@/api/base'

export default {
  name: 'TaskApprove',
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
    }
  },
  data: function() {
    return {
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',
      dialogTableVisible: false,
      destActivityId: '',
      comment: '',
      destActivityList: []
    }
  },
  watch: {
    taskId: 'fetchData'
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    fetchData: async function() {
      const params = { taskId: this.taskId }
      const res = await getBackActivity(params)
      if (res && res.success) {
        this.destActivityList = res.datas.backToList
      }
    },
    handleApproveHisClick: function() {
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
    handleReturnClick: function() {
      this.$router.push('/workflow/tasks')
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
    }
  }
}
</script>

<style scoped>
.el-collapse {
  border: 0;
}
/deep/ .el-collapse-item__wrap {
  background: transparent;
  border: 0;
}
/deep/ .el-collapse-item__header {
  border-bottom: 0;
}
.input_box,
/deep/ .el-collapse-item__header {
  background: transparent;
}
/deep/ .el-collapse-item__header,
/deep/ .el-collapse-item__content {
  color: #ffffff;
}
/deep/ .input_box .el-input__inner,
/deep/ .input_box .el-textarea__inner {
  color: #ffffff;
  background-color: #17191d;
  border: 0;
}
.input_box {
  padding: 0 !important;
}
.input_box > div.flex1 {
  width: 100%;
  align-items: flex-start;
}
.input_box > div {
  padding: 5px 0px 20px 0px;
}
.input_box > div .title {
  width: 80px;
}
/deep/ .el-collapse-item.is-disabled .el-collapse-item__header {
  cursor: default;
}
.collapse-title {
  font-family: "微软雅黑";
  font-size: 16px;
}
/deep/ .el-collapse-item__header i {
  display: none;
}
.approval-box {
  border-radius: 16px !important;
  padding-bottom: 0px;
  padding-top: 0px;
}
.approval-box .flex1 {
  padding-bottom: 0px;
}
</style>
