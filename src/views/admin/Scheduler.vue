<template>
  <!-- class="scheduler" -->
  <div class="apply apply-left apply-light ">
    <div class="content  no-search-content content-light">
      <div class="search">
        <div class="search-title">
          {{ $t('comm.queryCriteria') }}
        </div>
        <el-form ref="searchForm" :model="form" label-width="80px" label-position="left">
          <el-row type="flex" justify="space-between">
            <el-col :span="7">
              <!-- 任务组名: -->
              <el-form-item class="big-input" :label="$t('admin.scheduler.jobGroupName')" prop="jobGroupName">
                <el-input v-model="searchParam.params.jobGroupName" :placeholder="$t('admin.scheduler.jobGroupName')" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <!-- 任务名: -->
              <el-form-item class="big-input" :label="$t('admin.scheduler.jobName')" prop="jobName">
                <el-input v-model="searchParam.params.jobName" :placeholder="$t('admin.scheduler.jobName')" />
              </el-form-item>
            </el-col>
            <el-col :span="7" />
          </el-row>

          <div class="btns" style="padding-top:0;padding-bottom:0">
            <div class=" left">
              <ul class="operation-box">
                <li class="operation-item" @click="handleCreateClick">
                  <span class="operation-circle circle-middle-btn btn-light-color"><i class="el-icon-circle-plus-outline" /></span>
                  <span class="operation-text">
                    <!-- 新建 -->
                    {{ $t('comm.newlyBuild') }}
                  </span>
                </li>
                <li class="operation-item" @click="handleBatchDeleteClick">
                  <span class="operation-circle circle-middle-btn btn-light-color"><i class="el-icon-delete" /></span>
                  <span class="operation-text">
                    <!-- 批量删除 -->
                    {{ $t('comm.batchDeletion') }}
                  </span>
                </li>
                <li class="operation-item" @click="handleBatchPauseClick">
                  <span class="operation-circle circle-middle-btn btn-light-color"><i class="el-icon-video-pause" /></span>
                  <span class="operation-text">
                    <!-- 暂停 -->
                    {{ $t('comm.suspend') }}
                  </span>
                </li>
                <li class="operation-item" @click="handleBatchResumeClick">
                  <span class="operation-circle circle-middle-btn btn-light-color"><i class="el-icon-refresh" /></span>
                  <span class="operation-text">
                    <!-- 恢复 -->
                    {{ $t('comm.recovery') }}
                  </span>
                </li>
              </ul>
            </div>
            <div class="dialog-btn-box">
              <div class="dialog-btn-right" @click="resetForm('searchForm')">
                <span class="circle-bigger-btn btn-light-color"><i class="el-icon-refresh" /></span>
                <span class="dialog-btn-text"> 重&nbsp;置</span>
              </div>
              <div>
                <span class="circle-bigger-btn btn-light-color"><i class="el-icon-search" /></span>
                <span class="dialog-btn-text">检&nbsp;索</span>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="table-bg-box search-list-table">
        <el-table
          ref="table"
          v-loading="isLoading"
          :data="schedulerList"
          border
          height="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column :label="$t('comm.operation')" min-width="120" width="120" align="center">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row, scope.$index)" />
              <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row, scope.$index)" />
            </template>
          </el-table-column>
          <el-table-column
            prop="jobGroupName"
            :label="$t('admin.scheduler.jobGroupName')"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jobName"
            :label="$t('admin.scheduler.jobName')"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="triggerState"
            :label="$t('admin.scheduler.triggerState')"
            width="100"
          />
          <el-table-column
            prop="triggerType"
            :label="$t('admin.scheduler.triggerType')"
            width="80"
          />
          <el-table-column
            prop="previousFire"
            :label="$t('admin.scheduler.previousFire')"
            width="180"
            :formatter="(row, column, cellValue, index)=>{return cellValue?cellValue.substring(0, 19):''}"
          />
          <el-table-column
            prop="nextFireTime"
            :label="$t('admin.scheduler.nextFireTime')"
            width="180"
            :formatter="(row, column, cellValue, index)=>{return cellValue?cellValue.substring(0, 19):''}"
          />
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination
          class="page-left"
          :current-page.sync="searchParam.pageNo"
          :page-size="searchParam.pageSize"
          layout="total,sizes"
          :total="searchParam.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

        <el-pagination
          class="page-right"
          :current-page.sync="searchParam.pageNo"
          :page-size="searchParam.pageSize"
          layout="prev,pager,next,slot,jumper"
          :total="searchParam.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="iconfont iconjiantou-youzhi page-last-page" @click="toLastPage" />
        </el-pagination>
        <el-pagination class="page-right  page-first" layout="slot">
          <span class="iconfont iconjiantou-zuozhi page-first-page" @click="toFirstPage" />
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :title="dialogType==='create'?$t('comm.newlyBuild'):$t('comm.edit')"
      :visible.sync="showDialog"
      width="70%"
      class="createDialog"
    >
      <div class="createBox">
        <div class="input_box">
          <div class="flex2">
            <div class="title must">
              <!-- 任务组名 -->
              {{ $t('admin.scheduler.jobGroupName') }}
            </div>
            <div class="input">
              <el-input v-model="schedulerInfo.jobGroupName" class="input" :placeholder="$t('admin.scheduler.jobGroupName')" @blur="validator('jobGroupName')" />
              <span ref="jobGroupName" data-roles="required" :data-value="schedulerInfo.jobGroupName" class="message" />
            </div>
          </div>
          <div class="flex2">
            <div class="title must">
              <!-- 任务名称 -->
              {{ $t('admin.scheduler.jobName') }}
            </div>
            <div class="input">
              <el-input v-model="schedulerInfo.jobName" class="input" :placeholder="$t('admin.scheduler.jobName')" @blur="validator('jobName')" />
              <span ref="jobName" data-roles="required" :data-value="schedulerInfo.jobName" class="message" />
            </div>
          </div>
          <div class="flex2">
            <div class="title must">
              <!-- Class全名 -->
              {{ $t('admin.scheduler.className') }}
            </div>
            <div class="input">
              <el-input v-model="schedulerInfo.className" class="input" :placeholder="$t('admin.scheduler.className')" @blur="validator('className')" />
              <span ref="className" data-roles="required" :data-value="schedulerInfo.className" class="message" />
            </div>
          </div>
          <div class="flex2">
            <div class="title">
              <el-button type="success" size="small" class="el-icon-video-play" @click.stop="handleExecClick">
                <!-- 手动执行 -->
                {{ $t('admin.scheduler.manualExecution') }}
              </el-button>
            </div>
            <div class="input" />
          </div>
        </div>
        <div class="input_box">
          <div class="flex2">
            <div class="title">
              <!-- 开始时间 -->
              {{ $t('admin.scheduler.startTime') }}
            </div>
            <el-date-picker
              v-model="schedulerInfo.startTime"
              class="input"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :placeholder="$t('admin.scheduler.startTime')"
            />
          </div>
          <div class="flex2">
            <div class="title">
              <!-- 结束时间 -->
              {{ $t('admin.scheduler.endTime') }}
            </div>
            <el-date-picker
              v-model="schedulerInfo.endTime"
              class="input"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :placeholder="$t('admin.scheduler.endTime')"
            />
          </div>
          <div class="flex2">
            <div class="title must">
              <!-- 触发模式 -->
              {{ $t('admin.scheduler.triggerMode') }}
            </div>
            <div class="input">
              <el-radio v-model="schedulerInfo.triggerType" label="Cron" @change="(value)=>{validator('triggerType',value)}">
                <!-- 日历周期触发 -->
                {{ $t('admin.scheduler.calendarCycle') }}
              </el-radio>
              <el-radio v-model="schedulerInfo.triggerType" label="Simple" @change="(value)=>{validator('triggerType',value)}">
                <!-- 固定间隔触发 -->
                {{ $t('admin.scheduler.fixedInterval') }}
              </el-radio>
              <span ref="triggerType" data-roles="required" :data-value="schedulerInfo.triggerType" class="message" />
            </div>
          </div>
          <div v-if="schedulerInfo.triggerType === 'Simple'" class="flex2">
            <div class="title">
              <!-- 间隔时刻(秒) -->
              {{ $t('admin.scheduler.interval') }}
            </div>
            <div>
              <el-input v-model="schedulerInfo.intervalSeconds" class="input" :placeholder="$t('admin.scheduler.interval')" />
              <span ref="intervalSeconds" data-roles="positiveInt" :data-value="schedulerInfo.intervalSeconds" class="message" />
            </div>
          </div>
          <div v-if="schedulerInfo.triggerType === 'Cron'" class="flex2">
            <div class="title">
              {{ $t('admin.scheduler.cronExpression') }}
              <el-tooltip placement="top" class="tip">
                <div slot="content">
                  Cron表示式 :秒 分 时 日 月 周 年(可选)<br>
                  示例:<br>
                  0 15 10 * * ? *
                  每天10:15运行。<br>
                  0 * 14 * * ?
                  每天14点到15点之间每分钟运行一次，开始于14:00，结束于14:59。<br>
                  0 0/5 14 * * ?
                  每天14点到15点每5分钟运行一次，开始于14:00，结束于14:55。<br>
                  0 0/5 14,18 * * ?
                  每天14点到15点每5分钟运行一次，此外每天18点到19点每5钟也运行一次。<br>
                  0 0-5 14 * * ?
                  每天14:00点到14:05，每分钟运行一次。<br>
                  0 10,44 14 ? 3 WED
                  每年三月的星期三的14:10和14:44分运行。<br>
                  0 15 10 ? * MON-FRI
                  每周一，二，三，四，五的10:15分运行。<br>
                  0 15 10 L * ?
                  每月最后一天10:15分运行。<br>
                  0 15 10 ? * 6L
                  每月最后一个星期五10:15分运行。<br>
                  0 15 10 ? * 6#3
                  每月第三个星期五的10:15分运行。
                </div>
                <i class="el-icon-info" />
              </el-tooltip>
            </div>
            <el-input v-model="schedulerInfo.cronExpression" class="input" placeholder="请输入Cron表示式" />
          </div>
        </div>
        <div class="input_box">
          <div class="flex1">
            <div class="title">
              <!-- 运行参数 -->
              {{ $t('admin.scheduler.operationParameters') }}
            </div>
            <div class="input">
              <el-button type="primary" size="small" class="el-icon-circle-plus-outline" @click.stop="handleAddVarClick">
                <!-- 增加 -->
                {{ $t('admin.scheduler.add') }}
              </el-button>
            </div>
          </div>
        </div>
        <div v-for="(value,key,index) in schedulerInfo.jobPara" :key="index" class="input_box">
          <div class="flex2">
            <div class="title">
              {{ $t('admin.scheduler.parameterName') }}
            </div>
            <el-input class="input" :value="key" disabled :placeholder="$t('admin.scheduler.parameterName')" />
          </div>
          <div class="flex2">
            <div class="title">
              {{ $t('admin.scheduler.parameterValue') }}
            </div>
            <div class="input">
              <el-input class="input" :value="value" disabled :placeholder="$t('admin.scheduler.parameterValue')" />
              <el-button size="mini" icon="el-icon-delete" style="margin-left:10px" type="danger" @click="handleDeleteVar(key)" />
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">{{ $t('comm.cancel') }}</el-button>
        <el-button type="primary" :disabled="!validatorState" @click="handleSaveClick">{{ $t('comm.certain') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="增加参数"
      :visible.sync="showAddVarDialog"
      width="50%"
      class="createDialog"
    >
      <div class="input_box">
        <div class="flex2">
          <div class="title">
            {{ $t('admin.scheduler.parameterName') }}
          </div>
          <div class="input">
            <el-input v-model="varObjct.key" :placeholder="$t('admin.scheduler.parameterName')" />
            <span ref="key" data-roles="required" :data-value="varObjct.key" class="message" />
          </div>
        </div>
        <div class="flex2">
          <div class="title">
            {{ $t('admin.scheduler.parameterValue') }}
          </div>
          <div class="input">
            <el-input v-model="varObjct.value" :placeholder="$t('admin.scheduler.parameterValue')" />
            <span ref="value" data-roles="required" :data-value="varObjct.value" class="message" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddVarDialog = false">{{ $t('comm.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddVarOKClick">{{ $t('comm.certain') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { formValidator } from '@/mixins/form-validator.js'
import { search } from '@/mixins/search-params'
import { getSchedulers, deleteScheduler, pauseScheduler, resumeScheduler, saveScheduler, execScheduler } from '@/api/admin/scheduler-api.js'
export default {
  mixins: [formValidator, search],
  data() {
    return {
      isLoading: true,
      activeNames: ['1'],
      dialogType: 'create',
      showDialog: false,
      showAddVarDialog: false,
      schedulerList: [],
      totalList: [],
      multipleSelection: [],
      schedulerInfo: {},
      varObjct: { key: '', value: '' },
      // 分页插件数据
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          jobGroupName: '',
          jobName: ''
        }
      }
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    search() {
      this.searchParam.pageNo = 1
      this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      this.fetchData()
    },
    reset() {
      for (const item in this.searchParam.params) {
        this.searchParam.params[item] = ''
      }
    },
    async fetchData() {
      const res = await getSchedulers(this.searchParam)
      if (res && res.success) {
        const { results, pageNo, totalRecord } = res.datas.searchResult
        this.totalList = results
        this.searchParam.pageNo = pageNo
        this.searchParam.totalRecord = totalRecord
        this.schedulerList = this.totalList.slice((pageNo - 1) * this.searchParam.pageSize, pageNo * this.searchParam.pageSize)
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    handleSizeChange(pageSize) {
      this.searchParam.pageNo = 1
      this.searchParam.pageSize = pageSize
      this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      const start = (this.searchParam.pageNo - 1) * this.searchParam.pageSize
      this.schedulerList = this.totalList.slice(start, start + this.searchParam.pageSize)
    },
    handleCurrentChange(currentPage) {
      this.searchParam.pageNo = currentPage
      this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      const start = (this.searchParam.pageNo - 1) * this.searchParam.pageSize
      this.schedulerList = this.totalList.slice(start, start + this.searchParam.pageSize)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleExecClick() {
      this.$confirm(this.$t('comm.tip9'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        await execScheduler(this.schedulerInfo)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    // 增加参数按钮
    handleAddVarClick() {
      this.varObjct.key = ''
      this.varObjct.value = ''
      this.showAddVarDialog = true
      this.$nextTick(function() {
        this.setValidatorMessage('key', '')
        this.setValidatorMessage('value', '')
      })
    },
    // 增加参数确定按钮
    handleAddVarOKClick() {
      let checkResult = true
      if (!this.varObjct.key) {
        this.setValidatorMessage('key', this.$t('comm.msg24'))
        checkResult = false
      }
      if (!this.varObjct.value) {
        this.setValidatorMessage('value', this.$t('comm.msg24'))
        checkResult = false
      }
      if (!checkResult) {
        return
      }
      this.$set(this.schedulerInfo.jobPara, this.varObjct.key, this.varObjct.value)
      this.showAddVarDialog = false
    },
    handleCreateClick() {
      this.schedulerInfo = { jobPara: {}}
      this.dialogType = 'create'
      this.validatorState = false
      this.showDialog = true
      this.$nextTick(function() {
        this.clearErrorMessage()
      })
    },
    handleDelete(val) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const res = await deleteScheduler([val])
        if (res && res.success) {
          this.fetchData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleDeleteVar(val) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        this.$delete(this.schedulerInfo.jobPara, val)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleEdit(val) {
      this.schedulerInfo = { ...val }
      this.dialogType = 'edit'
      this.validatorState = true
      this.showDialog = true
      this.$nextTick(function() {
        this.clearErrorMessage()
      })
    },
    handleSaveClick() {
      if (!this.validatorAll()) {
        return false
      }
      this.$confirm(this.$t('comm.tip10'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const res = await saveScheduler(this.schedulerInfo)
        if (res && res.success) {
          this.showDialog = false
          this.fetchData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleBatchDeleteClick() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        return
      }
      this.$confirm(this.$t('comm.tip2'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const res = await deleteScheduler(this.multipleSelection)
        if (res && res.success) {
          this.fetchData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleBatchPauseClick() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        return
      }
      this.$confirm(this.$t('comm.tip11'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const res = await pauseScheduler(this.multipleSelection)
        if (res && res.success) {
          this.fetchData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleBatchResumeClick() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        return
      }
      this.$confirm(this.$t('comm.tip12'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const res = await resumeScheduler(this.multipleSelection)
        if (res && res.success) {
          this.fetchData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    // 出现纵向滚动条时，防止表头行错位
    tableDolayout(refTable) {
      setTimeout(() => {
        if (refTable) refTable.doLayout()
      },
      1000)
    }
  }
}
</script>
<style lang="scss" >
.apply-left {
  .el-dialog__title {
    color: #303133;
  }
}
</style>
<style lang="scss" scoped>
.permissions {
  .createDialog {
    .createBox {
      h5 {
        font-size: 14px;
        padding-left: 10px;
        line-height: 26px;
        border-bottom: 1px solid #eee;
      }
    }
  }
}

.apply-left {
  padding-left: 70px;
  padding-right: 40px;
  .el-form-item__label {
    color: #ffffff;
  }
  .dialog-btn-box.left {
    justify-content: start;
  }
  .btns {
    display: flex;
    align-items: center;
  }
  .no-search-content {
    width: 100%;
    overflow: hidden;
    .table-bg-box {
      width: 100%;
    }
  }
}
@media (max-width: 1919px) {
  .apply-left {
    padding-left: 50px;
    padding-right: 28px;
    .search-title {
      font-size: 12px;
    }
    .content,
    .table-bg-box {
      width: 100% !important;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
    .no-search-content {
      display: flex;
    }
  }
}
</style>
