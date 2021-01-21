<template>
  <div ref="apply" class="apply" :class="theme=='Light' ? 'apply-light' : 'apply'">
    <div class="search-left-box search-left-box-light">
      <div class="search-title">
        {{ $t('comm.queryCriteria') }}
      </div>
      <el-scrollbar>
        <el-form ref="form" class="search-form default-input" label-position="left" :model="searchParam.params">
          <el-form-item prop="itemName">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                <!-- 年度 -->
                {{ $t('admin.org.validYear') }}
              </el-col>
              <el-col :span="16">
                <el-input v-model="searchParam.params.validYear" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="search-btn-box">
        <div class="reset-box" @click="resetForm('form')">
          <p>{{ $t('comm.reset') }}</p>
          <span class="circle-larger-btn btn-default-color"><i class="iconfont icon-refresh" /></span>
        </div>
        <div class="search-box" @click="searchOrgYear(searchParam.params.validYear)">
          <p>{{ $t('comm.query') }}</p>
          <span class="circle-larger-btn btn-light-color bluebg"><i class="iconfont icon-sousuo" /></span>
        </div>
      </div>
    </div>

    <div class="content content-light">
      <ul class="operation-box">
        <li class="operation-item" @click="handleEdit(multipleSelection)">
          <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont icon-wendang" /></span>
          <span class="operation-text">编&nbsp;辑</span>
        </li>
        <li class="operation-item" @click="handleActive(multipleSelection)">
          <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont icon-refresh" /></span>
          <span class="operation-text">激&nbsp;活</span>
        </li>
      </ul>
      <div class="table-bg-box search-list-table">
        <div ref="tables" style="height: 100%;">
          <el-table
            ref="table"
            v-loading="isLoading"
            :data="orgYearList"
            stripe
            border
            height="579"
            class="scroll-table-box"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              :label="$t('admin.org.validYear')"
              min-width="150"
              prop="validYear"
              align="center"
            />
            <!-- <el-table-column prop="activeFlag" :label="$t('admin.org.activeFlag')" min-width="80">
              <template slot-scope="scope">
                <dict-write dict-type-id="ActiveFlag" :value="scope.row.activeFlag" />
              </template>
            </el-table-column> -->
            <!-- <el-table-column prop="isAssociateTemplate" :label="$t('admin.org.isAssociateTemplate')" min-width="80">
              <template slot-scope="scope">
                <dict-write dict-type-id="IsNo" :value="scope.row.isAssociateTemplate" />
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>

      <div class="pagination-box">
        <el-pagination
          class="page-left"
          :current-page.sync="searchParam.pageNo"
          :page-size="searchParam.pageSize"
          layout="total,sizes"
          :total="searchParam.totalRecord"
          :popper-class="theme=='Light' ? 'blueDL' : ''"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

        <el-pagination
          :class="theme=='Light' ? 'page-right blueDR' : 'page-right'"
          :current-page.sync="searchParam.pageNo"
          :page-size="searchParam.pageSize"
          layout="prev,pager,next,slot,jumper"
          :total="searchParam.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="iconfont icon-Group-1 page-last-page" @click="toLastPage" />
        </el-pagination>
        <el-pagination class="page-right  page-first" layout="slot">
          <span class="iconfont icon-zuiqian page-first-page" @click="toFirstPage" />
        </el-pagination>
      </div>
    </div>

    <!-- v-dialogDrag -->
    <el-dialog id="drag1" ref="dragBox" class="content-dialog-box search-light" :close-on-click-modal="false" custom-class="dialog-drag" top="0" title="报价" :visible.sync="dialogSearchVisible">
      <search-dailog
        :data="dacList"
        :radio="radioNumner"
        @onClose="dialogSearchVisible = false; radioNumner = -1"
        @onConfirm="onConfirm"
        @onScroll="onScroll"
      />
    </el-dialog>
    <el-dialog id="drag2" ref="dragBox" class="content-dialog-box search-check-light" :close-on-click-modal="false" custom-class="dialog-drag" top="0" title="报价" :visible.sync="dialogSearchCheckVisible">
      <search-check-dailog :data="dacList" @onClose="dialogSearchCheckVisible = false" @onConfirm="onConfirmCheck" />
    </el-dialog>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'

import { formValidator } from '@/mixins/form-validator.js'
import { permission } from '@/mixins/permission-mixin'
import { getAllOrgYear, activeOrgYear } from '@/api/admin/org-api.js'
import DictWrite from '@/components/DictWrite'

var elementResizeDetectorMaker = require('element-resize-detector')
import $ from 'jquery'
import 'jquery.nicescroll'

export default {
  components: {
    DictWrite

  },
  mixins: [search, formValidator, permission],
  data() {
    return {
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',
      scrollColr: localStorage.getItem('theme') !== 'Dark' ? '#D8E0E8' : '#5A5E63',
      isLoading: true,
      activeNames: ['1'],
      dialogType: 'create',
      showDialog: false,
      orgYearList: [],
      uploadDialog: false,
      validYear: '',
      itemList: [],
      dialogKey: 0,
      item: {
        itemName: '',
        itemNum: '',
        itemType: '01',
        status: '01',
        parentItemName: '',
        remark: ''
      },
      identiferNumFlag: false,
      itemTypeIsEnabale: false,
      statusIsEnabale: false,
      otherMessageFlag: false,
      itemGroups: [{
        id: '',
        itemName: ''
      }],
      // 分页插件数据
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          itemName: '',
          identiferNum: '',
          itemNum: '',
          status: '',
          parentItemName: '',
          validYear: ''
        }
      },

      radioNumner: -1,
      searchPopover: false,
      orgChoseDilog: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      expandedKeys: [],
      cities: [],
      dialogSearchVisible: false,
      dialogSearchCheckVisible: false,
      dialogUpdateHistoryVisible: false,
      funcNo: '',
      dacList: [],
      multipleSelection: [],
      activeName: 'basic',
      levelList: [],
      accessUrlData: [],
      createObjectDialog: false,
      objectRadio: 'COL',
      objectInp: '',
      objectData: {
        header: [],
        table: []
      },
      visitorRadio: 'USER',
      createVisitorDialog: false,
      visitorData: {
        header: [],
        table: []
      },
      id: '',
      options: [],
      tableHeight: null,
      selectData: '',
      orgAddOrEdit: ''
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    var erd = elementResizeDetectorMaker()
    var that = this
    erd.listenTo(that.$refs.apply, (element) => {
      that.$nextTick(() => {
        this.getScrollBar()
        this.getDragBar()
        this.changeTableHeight()
        $('.el-table__body-wrapper').getNiceScroll().resize()
      })
    })

    erd.listenTo(document.getElementsByClassName('dialog-drag')[0], (element) => {
      that.$nextTick(
        () => {
          // console.log('a')
          this.getScrollBar()
          this.getDragBar()
          $('.el-table__body-wrapper').getNiceScroll().resize()
          $('.el-dialog__body').getNiceScroll().resize()
        })
    })
    erd.listenTo(document.getElementsByClassName('dialog-drag')[1], (element) => {
      that.$nextTick(() => {
        this.getScrollBar()
        this.getDragBar()
        $('.el-table__body-wrapper').getNiceScroll().resize()
        $('.el-dialog__body').getNiceScroll().resize()
      })
    })

    this.getScrollBar()
    this.getDragBar()
    // 拖拽
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
    // 缩放
    $('#drag1 .dialog-drag').resizable({
      aspectRatio: false,
      minHeight: 150,
      containment: '#drag1'
    })
    $('#drag2 .dialog-drag').resizable({
      aspectRatio: false,
      minHeight: 150,
      containment: '#drag2'
    })
  },
  methods: {
    selectP(data) {
      // console.log('data', data)
      this.selectData = data
    },
    onScroll() {
      this.getScrollBar()
      $('.el-table__body-wrapper').getNiceScroll().resize()
    },
    onConfirm(item) {
      this.radioNumner = -1
      this.dialogSearchVisible = false
      this.dacList.push(item)
    },
    onCheck() {
      this.dialogSearchVisible = false
      this.dialogSearchCheckVisible = true
    },
    onConfirmCheck(arr) {
      this.dialogSearchCheckVisible = false
      arr.map(item => {
        // console.log('item', item)
        this.dacList.push(item)
      })
    },
    changeTableHeight() {
      var tableStyleObject = getComputedStyle(this.$refs.tables, null)
      this.tableHeight = parseInt(tableStyleObject.height)
    },
    getScrollBar() {
      $('.el-table__body-wrapper').niceScroll({
        cursorcolor: this.scrollColr,
        cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
        cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
        cursorwidth: '8px', // 滚动条的宽度，单位：便素
        cursorborder: `1px solid ${this.scrollColr}`, // CSS方式定义滚动条边框
        autohidemode: true, // 隐藏滚动条的方式, 可用的值:
        zindex: 99,
        railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
        boxzoom: false,
        iframeautoresize: true // 在加载事件时自动重置iframe大小
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
        zindex: 1,
        railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
        boxzoom: false,
        iframeautoresize: true // 在加载事件时自动重置iframe大小
      })
    },
    openDialog() {
      this.dialogSearchVisible = true
    },
    getChecked(data, node, ischeck) {
      if (node.isLeaf) {
        // console.log('node', node)
        this.searchParam.params.sales = node.data.name
        this.searchPopover = false
        // console.log('data', data)
        // console.log('node', node.data)
        // console.log('ischeck', ischeck)
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row)
        })
      } else {
        this.$refs.table.clearSelection()
      }
    },
    async fetchData() {
      const res = await getAllOrgYear(this.validYear)

      if (res && res.success) {
        const results = res.datas.result
        this.orgYearList = results
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    handleSelectionChange(val) {
      // console.log('val', val)
      this.multipleSelection = val
    },
    handleEdit(val) {
      // 所选项目大于1个时，不可编辑
      if (val.length === 0 || val.length > 1) {
        this.$message({
          type: 'message',
          message: this.$t('comm.msg3'),
          iconClass: 'iconfont icongantanhao_icon',
          customClass: localStorage.getItem('theme') === 'Dark' ? 'dark-el-message' : 'light-el-message'
        })
        return
      }
      let selectYear = ''
      if (val && val.length > 0) {
        val.forEach(obj => {
          selectYear = obj.validYear
        })
      }
      const myYear = new Date().getFullYear()
      // console.log(myYear)
      // 所选择项目为历史年度时不可编辑
      if (parseInt(selectYear) < parseInt(myYear)) {
        this.$message({
          type: 'warning',
          message: this.$t('admin.e0023'),
          iconClass: 'iconfont icongantanhao_icon',
          customClass: localStorage.getItem('theme') === 'Dark' ? 'dark-el-message' : ' '
        })
        return
      }
      this.$router.push({
        path: '/admin/orgUser/org', query: {
          validYear: selectYear
        }
      })
    },
    async handleActive(val) {
      // 所选项目大于1个时，不可编辑
      if (val.length === 0 || val.length > 1) {
        this.$message({
          type: 'message',
          message: this.$t('comm.msg3'),
          iconClass: 'iconfont icongantanhao_icon',
          customClass: localStorage.getItem('theme') === 'Dark' ? 'dark-el-message' : 'light-el-message'
        })
        return
      }
      let selectYear = ''
      if (val && val.length > 0) {
        val.forEach(obj => {
          selectYear = obj.validYear
        })
      }
      // 所选项目为历史年度时，不可编辑
      const res = await activeOrgYear(selectYear)
      if (res && res.success) {
        this.$message({
          type: 'message',
          message: this.$t('comm.msg37'),
          iconClass: 'iconfont icongantanhao_icon',
          customClass: localStorage.getItem('theme') === 'Dark' ? 'dark-el-message' : 'light-el-message'
        })
        this.fetchData()
      } else {
        // this.$message({
        //   type: 'message',
        //   message: this.$t('comm.msg38')
        // })
        return
      }
    },
    async searchOrgYear(validYear) {
      const res = await getAllOrgYear(validYear)

      if (res && res.success) {
        const results = res.datas.result
        this.orgYearList = results
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    }

  }
}
</script>

