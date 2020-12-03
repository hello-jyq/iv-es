<template>
  <div class="agent">
    <div class="search">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span slot="title" class="collapse-title">{{ $t('comm.queryCriteria') }}</span>
          <div class="mode input_box">
            <div class="flex3">
              <div class="title">
                {{ $t('admin.wfProxy.agentType') }}
              </div>
              <el-input v-model="searchParam.params.agentFrom" class="input" :placeholder="$t('admin.wfProxy.agentType')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 代理人： -->
                {{ $t('admin.wfProxy.agentToName') }}
              </div>
              <el-input v-model="searchParam.params.agentTo" class="input" :placeholder="$t('admin.wfProxy.agentToName')" clearable />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="btns">
        <div class="left">
          <el-button type="primary" class="el-icon-circle-plus-outline" @click="create">
            <!-- 新建 -->
            {{ $t('comm.newlyBuild') }}
          </el-button>
          <el-button type="danger" class="el-icon-delete" @click="batchDelete">
            <!-- 批量删除 -->
            {{ $t('comm.batchDeletion') }}
          </el-button>
        </div>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          :label="$t('comm.operation')"
          min-width="120"
          width="120"
        >
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="editDetail(scope.row, scope.$index)" />
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="remove(scope.row, scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          :label="$t('admin.wfProxy.proxyId')"
          width="100"
        />
        <el-table-column prop="agentType" :label="$t('admin.wfProxy.agentFromName')" width="100">
          <template slot-scope="scope">
            <dict-write dict-type-id="AgentType" :value="scope.row.agentType" />
          </template>
        </el-table-column>
        <el-table-column
          prop="agentFromName"
          :label="$t('admin.wfProxy.agentType')"
          min-width="100"
        />
        <el-table-column
          prop="agentToName"
          :label="$t('admin.wfProxy.agentToName')"
          min-width="100"
        />
        <el-table-column
          prop="startTime"
          :label="$t('admin.wfProxy.startTime')"
          min-width="160"
        />
        <el-table-column
          prop="endTime"
          :label="$t('admin.wfProxy.endTime')"
          min-width="160"
        />
        <el-table-column
          prop="agentReason"
          :label="$t('admin.wfProxy.agentReason')"
          show-overflow-tooltip
          min-width="100"
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
      :title="dialogType==='create'?$t('comm.newlyBuild'):$t('comm.edit')"
      :visible.sync="showDialog"
      width="60%"
    >
      <div class="create_box">
        <div class="input_box">
          <div v-show="dialogType === 'edit'" class="flex2">
            <div class="title">
              <!-- 代理ID -->
              {{ $t('admin.wfProxy.proxyId') }}
            </div>
            <el-input v-model="dialogObj.id" class="input" disabled="disabled" />
          </div>
          <div class="flex2">
            <div class="title">
              <!-- 代理类型 -->
              {{ $t('admin.wfProxy.agentFromName') }}
            </div>
            <div class="input">
              <dict-select v-model="dialogObj.agentType" class="input" dict-type-id="AgentType" @change="(value) => {validator('agentType', value)}" />
              <span ref="agentType" data-roles="required" :data-value="dialogObj.agentType" class="message" />
            </div>
          </div>
          <div class="flex2">
            <div class="title">
              <!-- 委托人 -->
              {{ $t('admin.wfProxy.agentType') }}
            </div>
            <div class="input">
              <el-input v-model="assignee.name" class="input" :placeholder="$t('admin.wfProxy.agentType')" @blur="validator('agentFrom')">
                <i slot="suffix" class="iconfont icon-zuzhijiagou" @click.stop="openSelect('assignee')" />
              </el-input>
              <span ref="agentFrom" data-roles="required" :data-value="assignee.name" class="message" />
            </div>
          </div>
          <div class="flex2">
            <div class="title">
              <!-- 代理人 -->
              {{ $t('admin.wfProxy.agentToName') }}
            </div>
            <div class="input">
              <el-input v-model="agent.name" class="input" :placeholder="$t('admin.wfProxy.agentToName')" @blur="validator('agentTo')">
                <i slot="suffix" class="iconfont icon-zuzhijiagou" @click.stop="openSelect('agent')" />
              </el-input>
              <span ref="agentTo" data-roles="required" :data-value="agent.name" class="message" />
            </div>
          </div>
          <div class="flex2">
            <div class="title">
              <!-- 开始时间 -->
              {{ $t('admin.wfProxy.startTime') }}
            </div>
            <div class="input">
              <el-date-picker
                v-model="dialogObj.startTime"
                class="input"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('admin.wfProxy.startTime')"
                @blur="validator('startTime')"
              />
              <span ref="startTime" data-roles="required" :data-value="dialogObj.startTime" class="message" />
            </div>
          </div>
          <div class="flex2">
            <div class="title">
              <!-- 结束时间 -->
              {{ $t('admin.wfProxy.endTime') }}
            </div>
            <div class="input">
              <el-date-picker
                v-model="dialogObj.endTime"
                class="input"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('admin.wfProxy.endTime')"
                @blur="validator('endTime')"
              />
              <span ref="endTime" data-roles="required" :data-value="dialogObj.endTime" class="message" />
            </div>
          </div>
          <div class="flex2">
            <div class="title">
              <!-- 代理理由 -->
              {{ $t('admin.wfProxy.agentReason') }}
            </div>
            <el-input
              v-model="dialogObj.agentReason"
              class="input"
              type="textarea"
              :rows="4"
              :placeholder="$t('admin.wfProxy.agentReason')"
            />
          </div>
        </div>
        <div v-show="dialogObj.agentType == 'PART'">
          <h5>
            {{ $t('admin.wfProxy.processDefinitionSelect') }}
            : <div class="add_row iconfont icon-jia" @click.stop="handleAddTableRows">
              <!-- 增加流程 -->
              {{ $t('admin.wfProxy.addProcess') }}
            </div>
          </h5>
          <div class="table">
            <el-table
              :data="processTable"
              border
              height="200"
              style="width: 100%"
            >
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="processChose(scope.$index)">
                    <!-- 流程选择 -->
                    {{ $t('admin.wfProxy.selcetProcess') }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column :label="$t('admin.wfProxy.processDefinitionKey')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.procDefKey" disabled="disabled" />
                </template>
              </el-table-column>
              <!-- <el-table-column v-if="dialogType === 'edit'" :label="$t('admin.wfProxy.proxyId')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.agentId" disabled="disabled" />
                </template>
              </el-table-column> -->
              <el-table-column :label="$t('comm.operation')">
                <template slot-scope="scope">
                  <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDeleteRow(scope.row, scope.$index)" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-dialog
          :title="$t('admin.wfProxy.selectUser')"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">{{ $t('comm.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave">{{ $t('comm.certain') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('admin.wfProxy.selcetProcess')"
      :visible.sync="processChoseDialog"
      width="60%"
    >
      <el-table
        ref="singleTable"
        :data="processChoseData"
        highlight-current-row
        style="width: 100%"
        @current-change="processChoseChange"
      >
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column
          property="key"
          :label="$t('admin.wfProxy.processDefinitionKey')"
        />
        <el-table-column
          property="name"
          :label="$t('admin.wfProxy.processDefinitionName')"
        />
        <el-table-column
          property="description"
          :label="$t('admin.wfProxy.desc')"
        />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { formValidator } from '@/mixins/form-validator.js'
import TissueTree from '@/components/TissueTree.vue'
import { search } from '@/mixins/search-params'
import DictSelect from '@/components/DictSelect'
import DictWrite from '@/components/DictWrite'
import { getProxyList, getFlowDef, getDefByAgentId, proxyAdd, proxySave, proxyDelete } from '@/api/admin/workflow-api.js'
export default {
  components: {
    TissueTree,
    DictSelect,
    DictWrite
  },
  mixins: [search, formValidator],
  data() {
    return {
      isLoading: true,
      activeNames: ['1'],
      dialogType: 'create',
      tableData: [],
      searchParam: {
        paging: true,
        pageNo: 1,
        pageSize: 10,
        totalRecord: null,
        params: {
          agentFrom: '',
          agentTo: ''
        }
      },
      assignee: {
        name: '',
        id: ''
      },
      agent: {
        name: '',
        id: ''
      },
      currentPage: 1,
      showDialog: false,
      dialogObj: {},
      selectUserDialog: false,
      activeInput: '',
      treeType: 'personnel',
      selectData: '',
      processChoseDialog: false,
      processChoseData: [],
      processTable: [],
      processCurrentRow: null,
      index: Number,
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData: async function() {
      const res = await getProxyList(this.searchParam)
      if (res && res.success) {
        const { results, pageNo, totalRecord } = res.datas.searchResult
        this.tableData = results
        this.searchParam.pageNo = pageNo
        this.searchParam.totalRecord = totalRecord
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    resetTable(params) {
      for (var i in params) {
        params[i] = ''
      }
    },
    create() {
      this.clearErrorMessage()
      this.resetTable(this.dialogObj)
      this.resetTable(this.assignee)
      this.resetTable(this.agent)
      this.dialogType = 'create'
      this.processTable = []
      this.showDialog = true
    },
    editDetail(data, index) {
      this.clearErrorMessage()
      // console.log(data)
      getDefByAgentId(data.id).then(res => {
        this.processTable = res.datas.result
        this.dialogObj = { ...data }
        this.assignee.id = data.agentFrom
        this.assignee.name = data.agentFromName
        this.agent.id = data.agentTo
        this.agent.name = data.agentToName
        this.dialogType = 'edit'
        this.showDialog = true
      })
    },
    handleSave() {
      if (!this.validatorAll()) {
        return false
      }
      this.dialogObj.agentFrom = this.assignee.id
      this.dialogObj.agentTo = this.agent.id
      this.dialogObj.actAgentItemList = this.processTable
      // console.log(this.dialogObj)
      if (this.dialogType === 'create') {
        proxyAdd(this.dialogObj).then(res => {
          if (res && res.success) {
            this.$message({
              type: 'success',
              message: this.$t('comm.success')
            })
            this.showDialog = false
            this.fetchData()
          }
        })
      }
      if (this.dialogType === 'edit') {
        proxySave(this.dialogObj).then(res => {
          if (res && res.success) {
            this.$message({
              type: 'success',
              message: this.$t('comm.success')
            })
            this.showDialog = false
            this.fetchData()
          }
        })
      }
    },
    remove(data, index) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        proxyDelete([{ id: data.id }]).then(res => {
          if (res && res.success) {
            this.$message({
              type: 'success',
              message: this.$t('comm.msg2')
            })
            this.fetchData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    batchDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm(this.$t('comm.tip2'), this.$t('comm.tips'), {
          confirmButtonText: this.$t('comm.certain'),
          cancelButtonText: this.$t('comm.cancel'),
          type: 'warning'
        }).then(() => {
          proxyDelete(this.multipleSelection).then(res => {
            if (res && res.success) {
              this.$message({
                type: 'success',
                message: this.$t('comm.msg2')
              })
              this.fetchData()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('comm.msg1')
          })
        })
      } else {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg3')
        })
      }
    },
    openSelect(activeInput) {
      this.activeInput = activeInput
      this.selectUserDialog = true
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
      const id = data.id
      const name = data.text || data.name
      this[this.activeInput].name = name
      this[this.activeInput].id = id
      this.selectUserDialog = false
    },
    handleAddTableRows() {
      const newRow = {
        procDefKey: '',
        agentId: ''
      }
      this.processTable = [...this.processTable, newRow]
    },
    handleDeleteRow(data, index) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        this.processTable.splice(index, 1)
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
    processChose(index) {
      getFlowDef().then(res => {
        this.index = index
        this.processChoseData = res.datas.result
        this.processChoseDialog = true
      })
    },
    processChoseChange(val) {
      if (val != null) {
        let flag = true
        this.processTable.forEach(data => {
          if (data.procDefKey === val.key) {
            flag = false
            return false
          }
        })
        if (flag) {
          this.processTable[this.index].procDefKey = val.key
          this.processTable[this.index].agentId = this.dialogObj.id
        }
        this.processChoseDialog = false
      }
      // this.processCurrentRow = val
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>
.agent {
  .create_box {
    .input {
      .iconfont {
        cursor: pointer;
        line-height: 40px;
        color: skyblue;
      }
    }
    .selectDialog {
      height: 400px;
      .select_box {
        height: 300px;
        overflow: auto;
      }
    }
  }
}
</style>
<style lang="scss">
.selectDialog {
  .el-dialog__body {
    height: 300px;
  }
}
</style>
