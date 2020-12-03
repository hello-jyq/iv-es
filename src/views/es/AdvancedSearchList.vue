<template>
  <div ref="apply" class="apply" :class="theme=='Light' ? 'apply-light' : 'apply'">
    <div class="search-left-box search-left-box-light">
      <div class="search-title">
        {{ $t('comm.queryCriteria') }}
      </div>
      <el-scrollbar>
        <el-form ref="form" class="search-form default-input" label-position="left" :model="searchParam.params">
          <el-form-item prop="language">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                语言
              </el-col>
              <el-col :span="16">
                <dict-radio v-model="searchParam.params.language" dict-type-id="ESAnalyzeLanguage" class="light-select" theme="theme" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="fuzzySearchDiv">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                检索区分
              </el-col>
              <el-col :span="16">
                <dict-radio v-model="searchParam.params.fuzzySearchDiv" dict-type-id="ESFuzzySearch" class="light-select" theme="theme" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="searchWord">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                全文检索
              </el-col>
              <el-col :span="16">
                <el-autocomplete
                  v-model="searchParam.params.searchWord"
                  class="inline-input"
                  :fetch-suggestions="queryTerm"
                  placeholder="请输入内容"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="searchTarget">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                搜索对象
              </el-col>
              <el-col :span="16">
                <dict-checkbox v-model="searchParam.params.searchTarget" dict-type-id="ESSearchTarget" class="light-select" theme="theme" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="fileNameBoost">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                文件名称相关度
              </el-col>
              <el-col :span="16">
                <dict-select v-model="searchParam.params.fileNameBoost" class="input" dict-type-id="ESSearchBoost" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="fileContentBoost">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                文件内容相关度
              </el-col>
              <el-col :span="16">
                <dict-select v-model="searchParam.params.fileContentBoost" class="input" dict-type-id="ESSearchBoost" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="fileExtent">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                文件类型
              </el-col>
              <el-col v-if="loadingFlag" :span="16">
                <dict-checkbox v-model="searchParam.params.fileExtent" dict-type-id="ESFilterExtent" class="light-select" theme="theme" />
              </el-col>
              <el-col :span="16">
                <file-type-checkbox v-model="searchParam.params.fileExtent" :file-type-agg="fileTypeAggResults" theme="theme" @selectFileType="selectFileType" @class="light-select" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="fileSize">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                文件大小
              </el-col>
              <el-col v-if="loadingFlag" :span="16">
                <dict-checkbox v-model="searchParam.params.fileSize" dict-type-id="ESFileSizeRange" class="light-select" theme="theme" />
              </el-col>
              <el-col v-if="!loadingFlag" :span="16">
                <file-size-checkbox v-model="searchParam.params.fileSize" :file-size-agg="fileSizeAggResults" class="light-select" theme="theme" @selectFileSize="selectFileSize" />
              </el-col>
            </el-row>
          </el-form-item>
          <!-- <el-form-item prop="fileSizeFrom">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                文件大小From
              </el-col>
              <el-col :span="16">
                <el-input v-model="searchParam.params.fileSizeFrom" clearable />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="fileSizeTo">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                文件大小To
              </el-col>
              <el-col :span="16">
                <el-input v-model="searchParam.params.fileSizeTo" clearable />
              </el-col>
            </el-row>
          </el-form-item> -->
          <el-form-item prop="fileUpdateTime">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                文件更新时间
              </el-col>
              <el-col v-if="loadingFlag" :span="16">
                <dict-checkbox v-model="searchParam.params.fileUpdateTime" dict-type-id="ESModifyedTime" class="light-select" theme="theme" />
              </el-col>
              <el-col v-if="!loadingFlag" :span="16">
                <file-updatetime-checkbox v-model="searchParam.params.fileUpdateTime" :file-updatetime-agg="fileUpdateTimeAggResults" class="light-select" theme="theme" @selectUpdateTime="selectUpdateTime" />
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item prop="sortItem">
            <el-row type="flex" :gutter="5" justify="space-between">
              <el-col :span="8">
                排序
              </el-col>
              <el-col :span="16">
                <dict-radio v-model="searchParam.params.sortItem" dict-type-id="ESSortItem" class="light-select" theme="theme" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="search-btn-box">
        <div class="reset-box" @click="resetForm()">
          <p>{{ $t('comm.reset') }}</p>
          <span class="circle-larger-btn btn-default-color"><i class="iconfont iconrefresh" /></span>
        </div>
        <div class="search-box" @click="search">
          <p>{{ $t('comm.query') }}</p>
          <span class="circle-larger-btn btn-light-color bluebg"><i class="iconfont iconsousuo" /></span>
        </div>
      </div>
    </div>

    <div class="content content-light">
      <ul class="operation-box">
        <span>耗时: {{ timeTaken }}</span>
        <!--   <li v-if="hasPermission('itmNewButton')" class="operation-item" @click="handleCreate">
          <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconxinjian" /></span>
          <span class="operation-text">{{ $t('comm.newlyBuild') }}</span>
        </li>
        <li v-if="hasPermission('itmEditButton')" class="operation-item" @click="handleEdit(multipleSelection)">
          <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconbianji" /></span>
          <span class="operation-text">{{ $t('comm.edit') }}</span>
        </li> -->
      </ul>
      <div class="table-bg-box search-list-table">
        <div ref="tables" style="height: 100%;">
          <el-table ref="table" v-loading="isLoading" class="scroll-table-box" :data="itemList" height="100%" stripe border @selection-change="handleSelectionChange">
            <el-table-column
              :resizable="false"
              type="selection"
              width="40"
              fixed
            />
            <el-table-column prop="fileName" label="文件名称" min-width="150" header-align="center" align="left" fixed>
              <template slot-scope="scope">
                <!--<a class="link" @click.prevent="viewItem(scope.row.id)">{{ scope.row.fileName }}</a>-->
                <p>{{scope.row.fileName}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="docScore" label="文档得分" min-width="100" header-align="center" align="left" fixed />
            <el-table-column prop="dataSource" label="数据源" min-width="150" header-align="center" align="left" fixed />
            <el-table-column prop="filePath" label="文件路径" min-width="150" header-align="center" align="left" fixed />
            <el-table-column prop="fileType" label="文件类型" min-width="90" header-align="center" align="center" />
            <el-table-column prop="fileSize" label="文件大小" min-width="90" show-overflow-tooltip header-align="center" align="right" />
            <el-table-column prop="fileContentOutline" label="文件内容" min-width="400" header-align="center" align="left">
              <template slot-scope="scope">
         
                 <p>{{scope.row.fileContentOutline}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" min-width="160" header-align="center" align="left" />
            <el-table-column label="操作" min-width="50" show-overflow-tooltip header-align="center" align="left">
              <template slot-scope="scope">
                <p class="advice-operation-left">
                  <span class="advice-operation-btn" @click="download(scope.row.fileUrl, scope.row.fileName)">
                    <i class="iconfont iconxiazai" />下载
                  </span>
                </p>
                <p class="advice-operation-left">
                  <span class="advice-operation-btn" @click="preview(scope.row.fileUrl)">
                    <i class="iconfont iconchakan" />预览
                  </span>
                </p>
              </template>
            </el-table-column>
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
          <span class="iconfont iconjiantou-youzhi page-last-page" @click="toLastPage" />
        </el-pagination>
        <el-pagination class="page-right  page-first" layout="slot">
          <span class="iconfont iconjiantou-zuozhi page-first-page" @click="toFirstPage" />
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import { advancedSearch, downloadFile, getTerms } from '@/api/es/es-api'
import { permission } from '@/mixins/permission-mixin'
import DictCheckbox from '@/components/DictCheckbox'
import FileTypeCheckbox from '@/components/FileTypeCheckbox'
import FileSizeCheckbox from '@/components/FileSizeCheckbox'
import FileUpdatetimeCheckbox from '@/components/FileUpdatetimeCheckbox'
import DictRadio from '@/components/DictRadio'
import DictSelect from '@/components/DictSelect'
var elementResizeDetectorMaker = require('element-resize-detector')
import $ from 'jquery'
import 'jquery.nicescroll'

export default {
  components: {

    DictRadio,
    DictCheckbox,
    DictSelect,
    FileTypeCheckbox,
    FileSizeCheckbox,
    FileUpdatetimeCheckbox
  },

  mixins: [search, permission],
  data() {
    return {
      beforeUrl: '',
      isLoading: false,
      itemList: [],
      // 分页插件数据
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          language: 'cn',
          searchWord: '',
          fuzzySearchDiv: '1',
          searchTarget: [],
          fileNameBoost: '1',
          fileContentBoost: '1',
          fileExtent: [],
          fileSizeFrom: '',
          fileSizeTo: '',
          sortItem: 'default',
          fileSize: [],
          // fileSize2: [],
          fileUpdateTime: []
          // fileUpdateTime2: []

        }
      },
      fileTypeAggResults: [],
      fileSizeAggResults: [],
      fileUpdateTimeAggResults: [],
      fileSizeAggCount: '',
      loadingFlag: false,
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',
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
      uploadDialog: false,
      id: '',
      options: [],
      tableHeight: null,
      scrollColr: localStorage.getItem('theme') !== 'Dark' ? '#D8E0E8' : '#5A5E63',
      selectData: '',
      orgAddOrEdit: '',
      itemEditVisible: false,
      timeTaken: '0毫秒'
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.beforeUrl = from.path
    })
  },
  created: function () {
    // this.loadingFlag = true
    this.fetchData()
    // console.log(this.theme)
  },
  mounted() {
    this.$nextTick(() => {
      const beforeUrl = this.beforeUrl
      // console.log(beforeUrl)
      // eslint-disable-next-line eqeqeq
      if (beforeUrl != '/itm/add' && beforeUrl != '/itm/edit') {
        // this.resetForm()
      }
    })
    var erd = elementResizeDetectorMaker()
    var that = this
    erd.listenTo(that.$refs.apply, function (element) {
      that.$nextTick(function () {
        this.getScrollBar()
        this.getDragBar()
        this.changeTableHeight()
        $('.el-table__body-wrapper').getNiceScroll().resize()
      })
    })

    erd.listenTo(document.getElementsByClassName('dialog-drag')[0], function (element) {
      that.$nextTick(function () {
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
  },
  methods: {
    onScroll() {
      this.getScrollBar()
      $('.el-table__body-wrapper').getNiceScroll().resize()
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
    resetForm() {
      this.searchParam.params = {}
      // this.$refs[formName].resetFields()
    },

    async download(fileUrl, fileName) {
      const res = await downloadFile({ 'fileUrl': fileUrl, 'fileName': fileName })
    },
    async preview(fileUrl) {
      const httpUrl = 'http://192.168.22.14:8020/'
      const separatorIndex = fileUrl.indexOf('/')
      const filepath = httpUrl + fileUrl.substring(separatorIndex)
      window.open('http://192.168.22.13:8012/onlinePreview?url=' + encodeURIComponent(filepath))
    },
    async fetchData() {
      const res = await advancedSearch(this.searchParam)
      if (res && res.success) {
        const { totalRecord, results } = res.datas.searchResult
        const fileTypeAggResult = res.datas.fileTypeAggResult
        const fileSizeAggResult = res.datas.fileSizeAggResult
        const fileUpdateTimeAggResult = res.datas.fileUpdateTimeAggResult
        this.fileTypeAggResults = fileTypeAggResult
        this.fileSizeAggResults = fileSizeAggResult
        this.fileUpdateTimeAggResults = fileUpdateTimeAggResult
        this.searchParam.totalRecord = totalRecord
        this.itemList = results
        this.timeTaken = res.datas.timeTaken
      }
      if (this.searchParam.totalRecord === 0) {
        this.loadingFlag = true
      } else {
        this.loadingFlag = false
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCreate() {
      this.$router.push({ path: '/itm/add', query: { screenDiv: 'add' } })
    },
    async handleEdit(val) {
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
      let selectItemId = ''
      if (val && val.length > 0) {
        val.forEach(obj => {
          selectItemId = obj.id
        })
      }
      this.$router.push({ path: '/itm/edit', query: { itemId: selectItemId, screenDiv: 'edit' } })
    },
    async viewItem(val) {
      this.$router.push({ path: '/itm/edit', query: { itemId: val, screenDiv: 'detail' } })
    },
    async getTerms(queryString) {
      console.log('prefix--->{}', queryString)
      const res = await getTerms({ prefix: queryString })
      if (res && res.success) {
        for (var i = 0; i < res.datas.terms.length; i++) {
          this.terms.push({
            value: res.datas.terms[i],
            id: i
          })
        }
      }
      // console.log('-------------------->{}', this.terms);
      return this.terms
      // this.isLoading = false;
    },
    queryTerm(queryString, cb) {
      this.terms = []
      // 查询
      this.getTerms(queryString)
      // 调用 callback 返回建议列表的数据
      // console.log('-------------------->{}', this.terms);
      // console.log('-------------------->{}', Array.isArray(this.terms));

      cb(this.terms)
    },
    handleSelect(item) {
      console.log(item)
    },
    selectFileType(val) {
      this.searchParam.params.fileExtent = val
      this.fetchData()
    },
    selectFileSize(val) {
      this.searchParam.params.fileSize = val
      this.fetchData()
    },
    selectUpdateTime(val) {
      this.searchParam.params.fileSize = val
      this.fetchData()
    }
  }
}
</script>

