<template>
  <div :class="theme=='Light'?'no-search-content-box advice-apply adaL-light flex-height-table':'no-search-content-box advice-apply  flex-height-table'">
    <div class="table-bg-box">
      <!-- <div ref="tables" style="height: 100%;"> -->
      <el-table
        ref="table"
        :data="taskToView"
        border
        stripe
        style="width: 100%"
        height="100%"
      >
        <el-table-column :label="$t('comm.operation')" width="80" align="center">
          <template slot-scope="scope">
            <div class="advice-operation-btn advice-apply-btn" @click="handleBtnExec(scope.row)">
              <i class="iconfont iconshenqing1" />{{ $t('workflow.handle') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="funcName"
          :label="$t('workflow.functionName')"
          width="80"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ $t('workflow.funcname.' + scope.row.funcName) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('workflow.identiferNum')"
          prop="identiferNum"
          width="120"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <a class="link" @click.prevent="handleProcessInstClick(scope.row.processId)">{{ scope.row.identiferNum }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="identiferName"
          :label="$t('workflow.identiferName')"
          min-width="350"
          align="left"
          header-align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="updateBy"
          :label="$t('workflow.lastUpdateBy')"
          width="150"
          align="left"
          header-align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="updateTime"
          :label="$t('workflow.lastUpdateTime')"
          width="150"
          align="center"
          show-overflow-tooltip
        />
      </el-table>
      <!-- </div> -->
    </div>

    <process-detail
      :key="processInstId"
      :process-inst-id="processInstId"
      :is-show="dialogTableVisible"
      @onClose="dialogTableVisible = false"
    />
  </div>
</template>
<script>

import { getMyTodoList } from '@/api/base'
import ProcessDetail from '@/components/ProcessDetailNew'
import { mapGetters } from 'vuex'
var elementResizeDetectorMaker = require('element-resize-detector')
import $ from 'jquery'
import 'jquery.nicescroll'
export default {
  name: 'TaskList',
  components: {
    ProcessDetail
  },
  data() {
    return {
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',
      dialogVisible: false,
      name: '',
      scrollColr: localStorage.getItem('theme') !== 'Dark' ? '#D8E0E8' : '#5A5E63',
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
  created() {
    this.fetchData()
  },
  mounted() {
    var erd = elementResizeDetectorMaker()
    var that = this
    erd.listenTo(that.$refs.table, function(element) {
      that.$nextTick(function() {
        this.getScrollBar()
        $('.el-table__body-wrapper').getNiceScroll().resize()
      })
    })
    this.getScrollBar()
  },
  wtach: {

  },
  Computed: {
    ...mapGetters([
      'searchParams'
    ])
  },
  methods: {
    onScroll() {
      // this.getScrollBar()
      $('.el-table__body-wrapper').getNiceScroll().resize()
    },
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
    fetchData: async function() {
      const res = await getMyTodoList(this.searchParam.params)
      if (res && res.success) {
        if (res.datas && res.datas.searchResult) {
          const _this = this
          let ret = res.datas.searchResult
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

          this.getScrollBar()
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
          processInstId: row.processId,
          id: row.businessKey,
          screenDiv: 'apply'
        }
      })
    },
    handleProcessInstClick: function(processInstId) {
      this.processInstId = processInstId
      this.dialogTableVisible = true
    },
    // 申请
    onApply(row) {
      // console.log('row', row)
      this.name = row.itemName
      this.dialogVisible = true
    },
    // 确认
    onConfirm() {
      this.dialogVisible = false
      this.$router.push({
        path: '/ada/edit',
        query: {
          name: this.form.template
        }
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
<style lang="scss">
// #processDialog .el-dialog {
//   width: 1000px;
//   height: 800px;
//   margin-top: 80px !important;
//   padding: 0;
//   border-radius: 16px;
// }
</style>

