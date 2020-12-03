<template>
  <div class="definition">
    <div class="search">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span slot="title" class="collapse-title">{{ $t('comm.queryCriteria') }}</span>
          <div class="mode input_box">
            <div class="flex3">
              <div class="title">
                {{ $t('admin.wfInst.processDefinitionId') }}
              </div>
              <el-input v-model="searchParam.params.instId" class="input" :placeholder="$t('admin.wfInst.processDefinitionId')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 流程定义名称： -->
                {{ $t('admin.wfInst.processDefinitionName') }}
              </div>
              <el-input v-model="searchParam.params.def" class="input" :placeholder="$t('admin.wfInst.processDefinitionName')" clearable />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="btns">
        <div class="left" />
        <div class="right">
          <el-button type="success" class="el-icon-search" @click="search">
            <!-- 查询 -->
            {{ $t('comm.query') }}
          </el-button>
          <el-button class="el-icon-refresh-left" type="info" @click="reset">
            <!-- 重置 -->
            {{ $t('comm.reset') }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="table"
        v-loading="isLoading"
        :data="tableData"
        border
        style="width: 100%"
        height="579"
      >
        <el-table-column
          align="center"
          :label="$t('comm.operation')"
          width="70"
        >
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="editDetail(scope.row, scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('admin.wfInst.processInstanceId')" width="120">
          <template slot-scope="scope">
            <a class="link" @click.prevent="handleProcessInstClick(scope.row.id)">{{ scope.row.id }}</a>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('admin.wfInst.businessKey')"
          min-width="100"
        >
          <template slot-scope="scope">
            <a
              class="link"
              @click.prevent="handleBusinessKeyClick(scope.row.businessKey, scope.row.processDefinitionId)"
            >{{ scope.row.businessKey }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="processDefinitionId"
          :label="$t('admin.wfInst.processDefinitionId')"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="processDefinitionName"
          :label="$t('admin.wfInst.processDefinitionName')"
          min-width="120"
        />
        <el-table-column
          prop="name"
          :label="$t('admin.wfInst.exampleName')"
          min-width="120"
        />
        <el-table-column
          prop="startTime"
          :label="$t('admin.wfInst.startTime')"
          min-width="140"
        />
        <el-table-column
          prop="endTime"
          min-width="140"
          :label="$t('admin.wfInst.endTime')"
        />
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, ->"
          :page-size="searchParam.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="searchParam.pageNo"
          :total="searchParam.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      title="详情修改"
      :visible.sync="aditDialog"
      width="80%"
      class="edit_dialog"
    >
      <div class="adit_content">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('admin.wfInst.taskDetails')" name="first">
            <el-table
              :data="detailData"
              height="320"
              style="width: 100%"
            >
              <el-table-column
                prop="id"
                :label="$t('admin.wfInst.taskId')"
              />
              <el-table-column
                prop="name"
                :label="$t('admin.wfInst.taskName')"
              />
              <el-table-column
                prop="assignee"
                :label="$t('admin.wfInst.assignee')"
              />
              <el-table-column
                prop="processInstId"
                :label="$t('admin.wfInst.processInstanceId')"
              />
              <el-table-column
                prop="executionId"
                :label="$t('admin.wfInst.implementId')"
              />
              <el-table-column
                prop="processDefinitionId"
                :label="$t('admin.wfInst.processDefinitionId')"
              />
              <el-table-column
                prop="endTime"
                :label="$t('admin.wfInst.endTime')"
              />
              <el-table-column
                align="center"
                :label="$t('comm.operation')"
                width="300"
              >
                <template slot-scope="scope">
                  <div v-show="scope.row.endTime == null">
                    <el-button size="mini" type="success" @click="taskComplete(scope.row, scope.$index)">
                      <!-- 完成 -->
                      {{ $t('admin.wfInst.complete') }}
                    </el-button>
                    <el-button size="mini" type="danger" @click="taskReject(scope.row, scope.$index)">
                      <!-- 驳回 -->
                      {{ $t('admin.wfInst.reject') }}
                    </el-button>
                    <el-button size="mini" type="primary" @click="changeDeliver(scope.row, scope.$index)">
                      <!-- 改派 -->
                      {{ $t('admin.wfInst.reform') }}
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane v-if="isEnd" :label="$t('admin.wfInst.processVariable')" name="second">
            <el-table
              :data="hisVarList"
              height="320"
              style="width: 100%"
            >
              <el-table-column
                :label="$t('admin.wfInst.processInstanceId')"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.processInstanceId" disabled="disabled" />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('admin.wfInst.variableName')"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.variableName" disabled="disabled" />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('admin.wfInst.variableValue')"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value" disabled="disabled" />
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane v-else :label="$t('admin.wfInst.processVariable')" name="second">
            <h4>
              <el-button type="primary" size="mini" class="el-icon-circle-plus-outline" @click="addVariable">
                <!-- 增加变量 -->
                {{ $t('admin.wfInst.addVariable') }}
              </el-button>
            </h4>
            <el-table
              :data="varList"
              height="320"
              style="width: 100%"
            >
              <el-table-column
                :label="$t('admin.wfInst.processInstanceId')"
              >
                <el-input v-model="instId" disabled="disabled" />
              </el-table-column>
              <el-table-column
                :label="$t('admin.wfInst.variableName')"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.key" :disabled="scope.$index < length" />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('admin.wfInst.variableValue')"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$t('comm.operation')"
                min-width="70"
                width="70"
              >
                <template slot-scope="scope">
                  <el-button v-show="scope.$index >= length" size="mini" type="danger" @click="deleteVarRow(scope.row, scope.$index)">
                    <!-- 删除 -->
                    {{ $t('comm.delete') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="aditDialog = false">{{ $t('comm.cancel') }}</el-button>
        <el-button v-if="!isEnd" type="primary" @click="addVars">{{ $t('comm.certain') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('admin.wfInst.reject')"
      :visible.sync="rejectDialog"
      width="50%"
    >
      <div class="input_box">
        <div class="title">
          <!-- 驳回理由： -->
          {{ $t('admin.wfInst.rejectReason') }}
        </div>
        <div class="flex1">
          <div class="input">
            <el-input v-model="taskBackData.comment" :placeholder="$t('admin.wfInst.rejectReason')" class="input" />
          </div>
        </div>
      </div>
      <el-table
        :data="activityList"
        highlight-current-row
        @current-change="rejectCurrentChange"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column
          property="id"
          :label="$t('admin.wfInst.nodeId')"
        />
        <el-table-column
          property="name"
          :label="$t('admin.wfInst.nodeName')"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toTaskBack">{{ $t('admin.wfInst.reject') }}</el-button>
        <el-button @click="rejectDialog = false">{{ $t('admin.wfInst.close') }}</el-button>
      </span>
    </el-dialog>

    <!-- 审批履历 -->
    <process-detail
      :key="processInstId"
      :process-inst-id="processInstId"
      :is-show="dialogTableVisible"
      @onClose="dialogTableVisible = false"
    />

    <el-dialog
      :title="$t('admin.wfInst.reform')"
      :visible.sync="selectUserDialog"
      append-to-body
      class="selectDialog"
      width="25%"
    >
      <div class="select_box">
        <tissue-tree :tree-type="treeType" @select="selectNode" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectUserDialog = false">{{ $t('comm.cancel') }}</el-button>
        <el-button type="primary" @click="addNode">{{ $t('comm.certain') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TissueTree from '@/components/TissueTree.vue'
import { search } from '@/mixins/search-params'
import { formValidator } from '@/mixins/form-validator.js'
import { getInstList, getTaskList, getVarsList, getActivityList, taskBack, taskFinish, taskChange, saveVariables } from '@/api/admin/workflow-api.js'
import ProcessDetail from '@/components/ProcessDetailNew'
export default {
  components: {
    ProcessDetail,
    TissueTree
  },
  filters: {
    dateTimeFormat(val) {
      // yyyy-MM-dd HH:mm:ss 转为 yyyy-MM-dd
      return val ? val.substring(0, 10) : val
    }
  },
  mixins: [search, formValidator],
  data() {
    return {
      isLoading: true,
      activeNames: ['1'],
      processInstId: '',
      dialogTableVisible: false,
      tableData: [],
      searchParam: {
        paging: true,
        pageNo: 1,
        pageSize: 10,
        totalRecord: null,
        params: {
          instId: '',
          def: ''
        }
      },
      aditDialog: false,
      activeName: 'first',
      detailData: [],
      instId: String,
      isEnd: Boolean,
      varList: [],
      hisVarList: [],
      length: Number,
      rejectDialog: false,
      rejectCurrentRow: null,
      activityList: [],
      taskBackData: {
        taskId: '',
        backId: '',
        comment: ''
      },
      orgChoseDialog: false,
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      orgChoseData: [],
      taskChangeParam: {
        taskId: '',
        changeTo: ''
      },
      treeType: 'personnel',
      selectUserDialog: false,
      selectData: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getInstList(this.searchParam)
      if (res && res.success) {
        const { results, pageNo, totalRecord } = res.datas.result
        this.tableData = results
        this.searchParam.pageNo = pageNo
        this.searchParam.totalRecord = totalRecord
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    editDetail(data, index) {
      getTaskList(data.id).then(res => {
        if (res && res.success) {
          this.detailData = res.datas.result
        }
        getVarsList(data.id).then(res => {
          if (res && res.success) {
            this.instId = data.id
            this.isEnd = res.datas.isEnd
            this.varList = res.datas.varList
            this.hisVarList = res.datas.hisVarList
            this.length = res.datas.varList.length
            this.aditDialog = true
          }
        })
      })
    },
    resetTable(params) {
      for (var i in params) {
        params[i] = ''
      }
    },
    taskComplete(data, index) {
      this.$confirm(this.$t('admin.wfInst.finishTask'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        taskFinish(data.id).then(res => {
          if (res && res.success) {
            this.$message({
              type: 'success',
              message: this.$t('comm.success')
            })
            this.aditDialog = false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    taskReject(data, index) {
      this.resetTable(this.taskBackData)
      getActivityList(data.id).then(res => {
        this.activityList = res.datas.activityList
        this.taskBackData.taskId = data.id
        this.rejectDialog = true
      })
    },
    toTaskBack() {
      if (this.rejectCurrentRow != null) {
        this.taskBackData.backId = this.rejectCurrentRow.id
      }
      taskBack(this.taskBackData).then(res => {
        if (res && res.success) {
          this.$message({
            type: 'success',
            message: this.$t('comm.msg26')
          })
          this.rejectDialog = false
          this.aditDialog = false
          // this.editDetail({ id: this.instId }, '')
        }
      })
    },
    addVariable() {
      const newVariable = {
        key: '',
        value: ''
      }
      this.varList = [...this.varList, newVariable]
    },
    deleteVarRow(data, index) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        this.varList.splice(index, 1)
        this.$message({
          type: 'success',
          message: this.$t('comm.msg2')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    selectNode(data) {
      this.selectData = data
    },
    addNode() {
      const data = this.selectData
      if (data.id === '_1') {
        this.$message({
          type: 'error',
          message: this.$t('comm.msg4')
        })
        return false
      }
      if (this.treeType === 'personnel') {
        // 只要人员，排除部门
        if (data.type !== 'user') {
          this.$message({
            type: 'error',
            message: this.$t('comm.msg4')
          })
          return false
        }
      }
      this.taskChangeParam.changeTo = data.id
      taskChange(this.taskChangeParam).then(res => {
        if (res && res.success) {
          this.$message({
            type: 'success',
            message: this.$t('comm.msg27')
          })
          this.orgChoseDialog = false
          this.aditDialog = false
        }
      })
      this.selectUserDialog = false
    },
    changeDeliver(data, index) {
      this.resetTable(this.taskChangeParam)
      this.taskChangeParam.taskId = data.id
      this.selectUserDialog = true
    },
    handleNodeClick(data) {
      if (data.type === 'user') {
        this.taskChangeParam.changeTo = data.id
        taskChange(this.taskChangeParam).then(res => {
          if (res && res.success) {
            this.$message({
              type: 'success',
              message: this.$t('comm.msg27')
            })
            this.orgChoseDialog = false
            this.aditDialog = false
          }
        })
      }
    },
    addVars() {
      // console.log(this.instId)
      // console.log(this.varList)
      saveVariables({ instId: this.instId, variables: this.varList }).then(res => {
        if (res && res.success) {
          this.$message({
            type: 'success',
            message: this.$t('comm.success')
          })
        }
      })
    },
    handleProcessInstClick: function(processInstId) {
      this.processInstId = processInstId
      this.dialogTableVisible = true
    },
    rejectCurrentChange(val) {
      this.rejectCurrentRow = val
    },
    handleBusinessKeyClick: function(id, processDefinitionId) {
      if (processDefinitionId.indexOf('Bdm') > -1) {
        this.$router.push({ path: '/bdm/detail', query: {
          id: id,
          screenDiv: 'admin'
        }})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.definition {
  .edit_dialog {
    .adit_content {
      height: 400px;
      h4 {
        text-align: right;
        border-bottom: 1px dashed #ccc;
        padding: 5px 20px;
      }
    }
  }
}
</style>
