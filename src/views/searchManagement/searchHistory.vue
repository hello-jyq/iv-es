<template>
  <div class="container sh">
    <div class="sh_search_box">
      <div class="search_top">
        <div>
          <span>{{ $t('searchLog.searchContent') }}</span>
          <el-input v-model="searchParam.params.keywords" :placeholder="$t('searchLog.searchContentTip')" maxlength="100" clearable />
        </div>
        <div>
          <span>{{ $t('searchLog.searchResult') }}</span>
          <el-input v-model="searchParam.params.hitDocName" :placeholder="$t('searchLog.searchResultTip')" maxlength="250" clearable />
        </div>
      </div>
      <div class="search_bottom">
        <div>
          <span>{{ $t('searchLog.searchTime') }}</span>
          <el-date-picker
            v-model="searchParam.params.searchTimes"
            class="diy_time"
            popper-class="date_picker"
            value-format="yyyy-MM-dd"
            type="daterange"
            unlink-panels
            :range-separator="$t('searchLog.timeSplit')"
            :start-placeholder="$t('searchLog.searchTimeStart')"
            :end-placeholder="$t('searchLog.searchTimeEnd')"
          />
        </div>
        <div>
          <button :disabled="btnClickFlag" :class="btnClickFlag?'not_allowed':''" @click="queryPage()">
            {{ $t('searchLog.search') }}
          </button>
        </div>
      </div>
    </div>
    <div class="sh_search_main">
      <!-- <div class="sh_main_title">
        <span>搜索履历结果</span>
      </div> -->
      <div v-loading="loading" class="sh_main_table">
        <template>
          <el-table
            :data="dataList"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              :label="$t('searchLog.index')"
              width="50"
            />
            <el-table-column
              prop="searchTime"
              :label="$t('searchLog.searchTime')"
              width="180"
              align="center"
            />
            <el-table-column
              prop="keywords"
              :label="$t('searchLog.searchContent')"
              width="180"
              class-name="search_name"
            >
              <template slot-scope="scope">
                <i class="iconfont icon-lianjie" />
                <span style="margin-left: 5px" @click="linkName(scope.row)">{{ scope.row.keywords }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="hitDocName"
              :label="$t('searchLog.searchResult')"
              class-name="search_result"
            >
              <!-- <template slot-scope="scope">
                <span style="margin-left: 5px" @click="linkResult(scope.row.result)">{{ scope.row.result }}</span>
              </template> -->
            </el-table-column>
            <el-table-column
              :label="$t('searchLog.operation')"
              align="center"
              width="160"
            >
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.isDownload === 1" class="item" effect="light" :content="$t('searchLog.view')" placement="top" :visible-arrow="false">
                  <i class="iconfont icon-yanjing" @click="showSLT(scope.row.hitDocId)" />
                </el-tooltip>
                <el-tooltip class="item" effect="light" :content="$t('searchLog.delete')" placement="top" :visible-arrow="false">
                  <i class="iconfont icon-shanchu1" @click="deleteSearchLog(scope.row.id)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="pagination-box">
        <span class="el-pagination__total">共&nbsp;{{ searchParam.totalRecord }}&nbsp;条</span>
        <el-pagination
          :current-page.sync="searchParam.pageNo"
          :page-size="searchParam.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="sizes"
          class="page-left"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <el-pagination
          :current-page.sync="searchParam.pageNo"
          background
          :page-size="searchParam.pageSize"
          :page-sizes="[10, 20, 50]"
          layout=" pager, next,slot,jumper"
          :total="searchParam.totalRecord"
          class="pagination_right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <button type="button" class="last-pager" @click="toLastPage()">
            <i class="iconfont icon-Group-1" />
          </button>
        </el-pagination>
        <el-pagination
          :current-page.sync="searchParam.pageNo"
          background
          :page-size="searchParam.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="slot, prev"
          :total="searchParam.totalRecord"
          class="pagination_right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <button type="button" class="first-pager" @click="toFirstPage()">
            <i class="iconfont icon-zuiqian" />
          </button>
        </el-pagination>
      </div>
    </div>

    <thumbnail-dailog
      :is-show="centerDialogVisible"
      :doc-obj="sltData"
      @onClose="closeSLT"
    />

    <!-- <el-dialog
      v-model="sltData"
      :title="$t('es.thumbnail')"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      class="sltDialog"
      @close="closeSLT"
    >
      <div class="each_r_top">
        <div class="each_r_top_left">
          <span><i class="iconfont icon-wenjianjia" />{{ sltData.dataSource }}</span>
          <div class="each_m" :title="sltData.filePath">
            <i class="iconfont icon-wendang" />{{ sltData.filePath }}
          </div>
          <span v-if="sltData.updateBy != ''"><i class="iconfont icon-wode" />{{ sltData.updateBy }}</span>
          <span v-else-if="sltData.updateBy == '' && sltData.createBy != ''"><i class="iconfont icon-wode" />{{ sltData.createBy }}</span>
        </div>
      </div>
      <div class="each_r_title">
        <img v-if="sltData.fileType=='Excel'" src="../../assets/img/filetype/excel.png">
        <img v-else-if="sltData.fileType=='Word'" src="../../assets/img/filetype/word.png">
        <img v-else-if="sltData.fileType=='PowerPoint'" src="../../assets/img/filetype/PPT.png">
        <img v-else-if="sltData.fileType=='Pdf'" src="../../assets/img/filetype/PDF.png">
        <img v-else-if="sltData.fileType=='Text'" src="../../assets/img/filetype/TXT.png">
        <img v-else-if="sltData.fileType=='Image'" src="../../assets/img/filetype/img.png">
        <img v-else-if="sltData.fileType=='zip'" src="../../assets/img/filetype/excel.png">
        <img v-else-if="sltData.fileType=='Media'" src="../../assets/img/filetype/other.png">
        <img v-else src="../../assets/img/filetype/other.png">
        <span v-html="sltData.fileName" />
        <img v-if="sltData.language=='CN'" class="each_lan" src="../../assets/img/cn_ico.png">
        <img v-else-if="sltData.language=='EN'" class="each_lan" src="../../assets/img/en_ico.png">
        <img v-else-if="sltData.language=='JP'" class="each_lan" src="../../assets/img/jp_ico.png">
        <img v-else class="each_lan" src="../../assets/img/other2.png">
      </div>
      <div class="each_r_con">
        {{ sltData.updateTime }}  {{ sltData.fileSizeDescription }}KB - {{ sltData.fileType }}
      </div>
      <div class="slt">
        <iframe v-if="sltData.fileType!='Others'" ref="kkfileviewIframe" width="100%" frameborder="0" height="100%" :src="kkfileviewurl" name="iframe_a" />
        <img v-else src="../../assets/img/slt_empty.png">
      </div>
      <div class="slt_down" @click="download(sltData.fileUrl, sltData.id)">
        <i class="iconfont icon-Group-" />{{ $t('es.download') }}
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import { getSearchLogByPage, deleteById } from '@/api/searchlog/searchlog-api'
import { getDocById } from '@/api/es/es-api'

import thumbnailDailog from './_thumbnail.vue'

export default {
  components: {
    thumbnailDailog
  },
  mixins: [search],
  data() {
    return {
      btnClickFlag: false,
      theme: 'Light', // 主题相关
      searchParam: {// 分页参数
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          keywords: '',
          hitDocName: '',
          searchTimes: []
        }
      },
      loading: false,
      dataList: [],
      centerDialogVisible: false,
      kkfileviewurl: '',
      sltData: {
        clickCount: null,
        createBy: '',
        createTime: '',
        dataSource: '',
        fileContentOutline: '',
        fileDirectory: '',
        fileExtend: '',
        fileMeta: null,
        fileName: '',
        filePath: '',
        filePathFull: '',
        fileSize: null,
        fileSizeDescription: '',
        fileType: '',
        fileUrl: '',
        id: '',
        language: '',
        myLabel: [],
        operFlag: null,
        searchWord: null,
        termFetchTime: null,
        updateBy: '',
        updateTime: ''
      }
    }
  },
  watch: {

  },
  created: function() {
    this.queryPage()
  },

  methods: {
    queryPage() {
      this.btnClickFlag = true
      this.loading = true
      this.fetchData()
    },
    async fetchData() {
      if (this.searchParam.params.keywords > 80) {
        this.$message({
          message: this.$t('searchLog.msg1'),
          type: 'warning'
        })
        this.loading = false
        this.btnClickFlag = false
        return false
      }
      if (this.searchParam.params.hitDocName > 200) {
        this.$message({
          message: this.$t('searchLog.msg2'),
          type: 'warning'
        })
        this.loading = false
        this.btnClickFlag = false
        return false
      }
      const res = await getSearchLogByPage(this.searchParam)
      if (res && res.success) {
        const { totalRecord, results } = res.datas.searchResult
        this.searchParam.totalRecord = totalRecord
        this.dataList = results
        this.loading = false
        this.btnClickFlag = false
      }
      // // console.log(this.dataList)
      // this.changeTableHeight()
    },
    // 翻页
    handleSizeChange(pageSize) {
      this.loading = true
      this.searchParam.pageNo = 1
      this.searchParam.pageSize = pageSize
      // this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      this.fetchData()
    },
    // 跳转页
    handleCurrentChange(currentPage) {
      this.loading = true
      this.searchParam.pageNo = currentPage
      // this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      this.fetchData()
      this.$nextTick(() => {
        const firstPageStatue = document.getElementsByClassName('btn-prev')[0].disabled
        const lastPageStatue = document.getElementsByClassName('btn-next')[0].disabled
        if (firstPageStatue) {
          document.getElementsByClassName('first-pager')[0].disabled = true
        } else {
          document.getElementsByClassName('first-pager')[0].disabled = false
        }
        if (lastPageStatue) {
          document.getElementsByClassName('last-pager')[0].disabled = true
        } else {
          document.getElementsByClassName('last-pager')[0].disabled = false
        }
      })
    },
    // 搜索内容点击
    linkName(row) {
      // console.log(row)
      if (row) {
        // console.log(row.searchType)
        if (row.searchType === 'ADVANCE') { // 高级搜索跳转普通结果页面
          this.$router.push({
            name: 'advancedSearchresult',
            params: {
              search: row.keywords,
              radio: row.fieldScale,
              fuzzy: row.searchDiv,
              allKeyWords: row.must,
              notIncludeKeyWords: row.mustNot,
              modifyedTime: row.searchTimeKey,
              radioDiyTime: row.searchTimeScale,
              fileType: row.searchFileType,
              fileSize: row.searchFileSize,
              diysizefrom: row.searchFileSizeFrom,
              diysizeto: row.searchFileSizeTo,
              dataSource: row.dataSource,
              dataSourceFilePath: row.searchDocFolder
            }
          })
        } else {
          this.$router.push({
            name: '/search/search_result',
            params: {
              search: row.keywords,
              radio: row.fieldScale,
              lang: 'ALL',
              fuzzy: row.searchDiv
            }
          })
        }
      }
    },
    /* linkResult(value) {
      console.log(value)
    }, */
    deleteSearchLog(id) {
      if (!id) {
        this.$message({
          type: 'error',
          message: this.$t('searchLog.e0001')
        })
        return
      }
      this.$confirm(this.$t('searchLog.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      }).then(async() => {
        const res = await deleteById(id)
        if (res) {
          if (res.success) {
            this.$message.closeAll()
            this.$message({
              type: 'success',
              message: this.$t('comm.msg2')
            })
            this.queryPage()
          }
        }
      }).catch(() => {
        this.$message.closeAll()
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    // 预览文档
    async showSLT(id) {
      // console.log(id)
      // 查询当前id对应的文档信息
      if (id) {
        const res = await getDocById(id)
        if (res) {
          if (res.success) {
            if (res.datas.result) {
              this.sltData = res.datas.result
              this.sltData.searchLogId = -1
              this.centerDialogVisible = true
              // this.show()
            } else {
              this.$message.closeAll()
              this.$message({
                type: 'error',
                message: this.$t('searchLog.e0003')
              })
            }
          }
        }
      } else {
        this.$message.closeAll()
        this.$message({
          type: 'error',
          message: this.$t('searchLog.e0002')
        })
      }
    },
    // 预览文档弹窗
    /* show() {
      this.centerDialogVisible = !this.centerDialogVisible
      this.$nextTick(() => {
        var loading = this.$loading({
          lock: true, // lock的修改符--默认是false
          text: 'Loading', // 显示在加载图标下方的加载文案
          spinner: 'el-icon-loading', // 自定义加载图标类名
          background: 'rgba(0, 0, 0, 0.3)', // 遮罩层颜色
          target: '.slt'// loadin覆盖的dom元素节点
        })
        const contextPath = window.location.origin
        const baseApi = contextPath + '/iv-es/api/es/view/'
        // const baseApi = 'http://localhost/iv-es/api/es/view/'
        const url = baseApi + this.sltData.id
        var previewUrl = url + '?fullfilename=' + new Date().getTime() + '.' + this.sltData.fileExtend
        // const kkfileviewSrc = contextPath + '/preview/onlinePreview?url=' + encodeURIComponent(previewUrl)
        const kkfileviewSrc = 'http://localhost/preview/onlinePreview?url=' + encodeURIComponent(previewUrl)
        this.kkfileviewurl = kkfileviewSrc
        // this.centerDialogVisible = true
        if (this.sltData.fileType === 'Others') {
          loading.close()
        }
      })
    }, */
    // 关闭文档预览回调方法
    closeSLT() {
      this.centerDialogVisible = false
      /* this.kkfileviewurl = ''
      const slt = document.getElementsByClassName('el-loading-mask')
      // console.log(slt)
      for (let i = 0; i < slt.length; i++) {
        // slt[i].style.visibility = 'visible'
        slt[i].style.visibility = 'hidden'
      } */
    }
  }
}
</script>
<style scoped>
.sh_search_box {
  height: 200px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  border-radius: 16px;
  padding: 40px 30px 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.sh_search_main {
  margin-top: 20px;
  flex: 1;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  border-radius: 16px;
  padding: 30px 30px 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.search_top,
.search_bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
.search_top span,
.search_bottom span {
  min-width: 60px;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  margin-right: 20px;
}
.search_top div,
.search_bottom div {
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
}
.search_bottom div:first-child {
  margin-right: 95px;
}
.search_bottom div:last-child {
  justify-content: flex-end;
}
.search_bottom button {
  width: 160px;
  height: 50px;
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%);
  border-radius: 25px;
  border: 0;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #ffffff;
  cursor: pointer;
}
.sh_main_title {
  height: 38px;
  width: 100%;
  line-height: 18px;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #333333;
  padding-bottom: 20px;
}
.sh_main_table {
  flex: 1;

  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.2);
  border-radius: 6px;
  overflow: hidden;
}
.sh_main_table .icon-shanchu1 {
  cursor: pointer;
  font-size: 18px;
  color: #f73031;
}
.sh_main_table .icon-yanjing {
  cursor: pointer;
  font-size: 18px;
  color: #2d7a9c;
  margin-right: 20px;
}

.pagination-box {
  padding: 0;
  padding-top: 15px;
  height: 40px;
  width: 100%;
}
.icon-lianjie {
  color: #2263ec;
}

.each_r_top {
  height: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-family: "微软雅黑";
  color: #333333;
  align-items: center;
  line-height: 20px;
}
.each_r_top_left {
  width: 70%;
  height: 20px;
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.each_m {
  margin-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.each_r_top span {
  margin-right: 20px;
}
.each_r_top i {
  color: #2d7a9c;
  margin-right: 5px;
}
.icon-wenjianjia {
  font-size: 18px;
}
.icon-wendang {
  font-size: 15px;
}
.each_down {
  font-size: 14px;
  font-family: "微软雅黑";
  color: #2d7a9c;
  line-height: 20px;
  cursor: pointer;
  min-width: 70px;
}
.each_down i {
  font-size: 18px;
}
.each_r_title {
  margin-top: 5px;
  height: 25px;
  font-size: 24px;
  font-family: "微软雅黑";
  color: #2440b4;
  line-height: 25px;
  text-decoration: underline;
  display: flex;
  align-items: center;
}
.each_r_title span {
  display: block;
  max-width: 70%;
  height: 25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.each_r_title img {
  margin-right: 5px;
}
.each_lan {
  margin-left: 10px;
  margin-bottom: -5px;
}
.each_r_con {
  height: 20px;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 20px;
  margin-top: 8px;
}
.kb {
  white-space: nowrap;
}
.slt {
  width: 1240px;
  height: 650px;
  background: #ffffff;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.slt_down {
  width: 160px;
  height: 50px;
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%);
  border-radius: 25px;
  margin: 40px auto auto;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #ffffff;
  cursor: pointer;
}
.slt_down i {
  margin-right: 6px;
}
.not_allowed{
  cursor: not-allowed !important;
}
</style>
