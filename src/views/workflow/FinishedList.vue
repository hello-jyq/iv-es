<template>
  <div class="finished">
    <div class="search">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span slot="title" class="collapse-title">{{ $t('comm.queryCriteria') }}</span>
          <div class="input_box">
            <div class="flex3">
              <div class="title">
                <!-- 流程实例ID -->
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
            <div class="flex3">
              <div class="title">
                <!-- 流程启动者 -->
                {{ $t('workflow.startUserName') }}
              </div>
              <el-input v-model="searchParam.params.procStartUserName" class="input" :placeholder="$t('workflow.startUserName')" clearable />
            </div>
            <div class="flex3_1">
              <div class="title">
                <!-- 流程启动时间 -->
                {{ $t('workflow.processStartTime') }}
              </div>
              <div class="input">
                <el-date-picker v-model="searchParam.params.procStartTimeFrom" type="date" value-format="yyyy-MM-dd" />
                <span style="margin: 0 5px">{{ $t('dashboard.to') }}</span>
                <el-date-picker v-model="searchParam.params.procStartTimeTo" type="date" value-format="yyyy-MM-dd" />
              </div>
            </div>
            <div class="flex3_1">
              <div class="title">
                <!-- 流程完了时间  -->
                {{ $t('workflow.processEndTime') }}
              </div>
              <div class="input">
                <el-date-picker v-model="searchParam.params.procEndTimeFrom" type="date" value-format="yyyy-MM-dd" />
                <span style="margin: 0 5px">{{ $t('dashboard.to') }}</span>
                <el-date-picker v-model="searchParam.params.procEndTimeTo" type="date" value-format="yyyy-MM-dd" />
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="btns">
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
      <el-table ref="table" v-loading="isLoading" :data="finishedList" border style="width: 100%;" height="529">
        <el-table-column :label="$t('workflow.processId')">
          <template slot-scope="scope">
            <a class="link" @click.prevent="handleProcessInstClick(scope.row.id)">{{ scope.row.id }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="processDefinitionName" :label="$t('workflow.processDefinitionName')" />
        <el-table-column prop="name" :label="$t('workflow.processName')" />
        <el-table-column prop="startUserNickName" :label="$t('workflow.startUserNickName')" />
        <el-table-column prop="startTime" :label="$t('workflow.startTime')" />
        <el-table-column prop="endTime" :label="$t('workflow.endTime')" />
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
      <el-dialog id="processDialog" :title="$t('workflow.detailedProcess') + processInstId" :visible.sync="dialogTableVisible" width="80%">
        <process-detail :key="processInstId" :process-inst-id="processInstId" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { search } from '@/mixins/search-params'
import { getFinished } from '@/api/base'
import ProcessDetail from '@/components/ProcessDetail'

export default {
  name: 'FinishedList',
  components: {
    ProcessDetail
  },
  mixins: [search],
  data: function() {
    return {
      isLoading: true,
      activeNames: ['1'],
      finishedList: [],
      processInstId: '',
      dialogTableVisible: false,
      // 分页插件数据
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          procInstId: '',
          procDefName: '',
          procInstName: '',
          procStartUserName: '',
          procStartTimeFrom: '',
          procStartTimeTo: '',
          procEndTimeFrom: '',
          procEndTimeTo: ''
        }
      }
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getFinished(this.searchParam)
      if (res && res.success) {
        const { totalRecord, results } = res.datas.searchResult
        this.searchParam.totalRecord = totalRecord
        this.finishedList = results
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    handleProcessInstClick(processInstId) {
      this.processInstId = processInstId
      this.dialogTableVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
