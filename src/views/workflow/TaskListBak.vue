<template>
  <div class="taskList">
    <div class="search">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span slot="title" class="collapse-title">{{ $t('comm.queryCriteria') }}</span>
          <div class="input_box">
            <div class="flex3">
              <div class="title">
                {{ $t('workflow.processId') }}
              </div>
              <el-input v-model="searchParam.params.procInstId" class="input" :placeholder="$t('workflow.processId')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 流程定义名 -->
                {{ $t('workflow.processDefinitionName') }}
              </div>
              <el-input v-model="searchParam.params.procDefName" class="input" :placeholder="$t('workflow.processDefinitionName')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 流程实例名 -->
                {{ $t('workflow.processName') }}
              </div>
              <el-input v-model="searchParam.params.procInstName" class="input" :placeholder="$t('workflow.processName')" clearable />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="btns">
        <div class="left">
          <el-button type="primary" class="iconfont icon-pichuli" @click="batchAgree">
            <!-- 批量同意 -->
            {{ $t('comm.batchAgree') }}
          </el-button>
        </div>
        <div class="right">
          <el-button type="success" class="el-icon-search" @click="search">
            {{ $t('comm.query') }}
          </el-button>
          <el-button class="el-icon-refresh-left" type="info" @click="reset">
            {{ $t('comm.reset') }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table ref="table" v-loading="isLoading" :data="taskToView" border height="579" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45" />
        <el-table-column :label="$t('comm.operation')" width="80">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleBtnExec(scope.row)">
              <!-- 处理 -->
              {{ $t('workflow.handle') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('workflow.nodeName')" />
        <el-table-column :label="$t('workflow.processId')">
          <template slot-scope="scope">
            <a class="link" @click.prevent="handleProcessInstClick(scope.row.processInstId)">{{ scope.row.processInstId }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="processDefinitionName" :label="$t('workflow.processDefinitionName')" />
        <el-table-column prop="processName" :label="$t('workflow.processName')" />
        <el-table-column prop="startUserNickName" :label="$t('workflow.startUserNickName')" />
        <el-table-column prop="startTime" :label="$t('workflow.startTime')" />
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
    <el-dialog id="processDialog" :title="$t('workflow.detailedProcess') + processInstId" :visible.sync="dialogTableVisible" width="80%">
      <process-detail :key="processInstId" :process-inst-id="processInstId" />
    </el-dialog>
  </div>
</template>

<script>
import { getTasks, agreeTasks } from '@/api/base'
import ProcessDetail from '@/components/ProcessDetail'
import { mapGetters } from 'vuex'

export default {
  name: 'TaskList',
  components: {
    ProcessDetail
  },
  data: function() {
    return {
      isLoading: true,
      activeNames: ['1'],
      taskList: [],
      taskToView: [],
      processInstId: '',
      dialogTableVisible: false,
      multipleSelection: [],
      searchParam: {
        paging: false,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          procInstId: '',
          procDefName: '',
          procInstName: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'searchParams'
    ])
  },
  created: function() {
    if (this.searchParams.has(this.$route.path)) {
      this.searchParam = this.searchParams.get(this.$route.path)
    }
    this.fetchData()
  },
  methods: {
    reset() {
      for (const item in this.searchParam.params) {
        this.searchParam.params[item] = ''
      }
    },
    search() {
      this.searchParam.pageNo = 1
      this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      this.fetchData()
    },
    fetchData: async function() {
      const res = await getTasks(this.searchParam.params)
      if (res && res.success) {
        if (res.datas && res.datas.taskList) {
          const _this = this
          let ret = res.datas.taskList
          if (_this.searchParam.params.procInstId) {
            ret = ret.filter(item => {
              return item.processInstId.indexOf(_this.searchParam.params.procInstId) > -1
            })
          }
          if (_this.searchParam.params.procInstName) {
            ret = ret.filter(item => {
              return item.processName.indexOf(_this.searchParam.params.procInstName) > -1
            })
          }
          this.taskList = ret
          this.searchParam.totalRecord = ret.length
          const start = (this.searchParam.pageNo - 1) * this.searchParam.pageSize
          this.taskToView = this.taskList.slice(start, start + this.searchParam.pageSize)
        }
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    handleBtnExec(row) {
      this.$router.push({
        path: row.formKey,
        query: {
          taskId: row.id,
          processInstId: row.processInstId,
          id: row.businessKey,
          screenDiv: 'apply'
        }
      })
    },
    batchAgree() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        return
      }
      this.$confirm(this.$t('comm.tip13'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const tasks = this.multipleSelection.map(item => item.id)
        const res = await agreeTasks(tasks)
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleProcessInstClick: function(processInstId) {
      this.processInstId = processInstId
      this.dialogTableVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchParam.pageNo = 1
      this.searchParam.pageSize = pageSize
      this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      const start = (this.searchParam.pageNo - 1) * this.searchParam.pageSize
      this.taskToView = this.taskList.slice(start, start + this.searchParam.pageSize)
    },
    handleCurrentChange(currentPage) {
      this.searchParam.pageNo = currentPage
      this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      const start = (this.searchParam.pageNo - 1) * this.searchParam.pageSize
      this.taskToView = this.taskList.slice(start, start + this.searchParam.pageSize)
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

<style  lang="scss">

</style>
