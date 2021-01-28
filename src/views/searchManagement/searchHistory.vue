<template>
  <div class="container sh">
    <div class="sh_search_box">
      <div class="search_top">
        <div>
          <span> 搜索内容</span>
          <el-input v-model="search.searchContent" placeholder="请输入搜索时的搜索条件" />
        </div>
        <div>
          <span> 搜索结果</span>
          <el-input v-model="search.searchResult" placeholder="请输入搜索结果" />
        </div>
      </div>
      <div class="search_bottom">
        <div>
          <span>搜索时间</span>
          <el-date-picker
            v-model="search.searchTime"
            class="diy_time"
            popper-class="date_picker"
            value-format="yyyy-MM-dd"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
        <div>
          <button @click="searchHistory(search)">
            检&nbsp;索
          </button>
        </div>
      </div>
    </div>
    <div class="sh_search_main">
      <div class="sh_main_title">
        <span>搜索履历结果</span>
      </div>
      <div v-loading="loading" class="sh_main_table">
        <template>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
            />
            <el-table-column
              prop="date"
              label="搜索时间"
              width="180"
              align="center"
            />
            <el-table-column
              label="搜索内容"
              width="180"
              class-name="search_name"
            >
              <template slot-scope="scope">
                <i class="iconfont icon-lianjie" />
                <span style="margin-left: 5px" @click="linkName(scope.row.name)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="搜索结果"
              class-name="search_result"
            >
              <template slot-scope="scope">
                <span style="margin-left: 5px" @click="linkResult(scope.row.result)">{{ scope.row.result }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="160"
            >
              <template slot-scope="scope">
                <el-tooltip class="item" effect="light" content="查看" placement="top" :visible-arrow="false">
                  <i class="iconfont icon-yanjing" @click="showSLT(scope.$index, scope.row)" />
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="删除" placement="top" :visible-arrow="false">
                  <i class="iconfont icon-shanchu1" @click="handleDelete(scope.$index, scope.row)" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="pagination-box">
        <span class="el-pagination__total">共&nbsp;{{ tabParam.totalRecord }}&nbsp;条</span>
        <el-pagination
          :current-page.sync="tabParam.pageNo"
          :page-size="tabParam.pageSize"
          :page-sizes="[10, 20]"
          layout="sizes"
          class="page-left"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <el-pagination
          :current-page.sync="tabParam.pageNo"
          background
          :page-size="tabParam.pageSize"
          :page-sizes="[10, 20]"
          layout=" pager, next,slot,jumper"
          :total="tabParam.totalRecord"
          class="pagination_right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <button type="button" class="last-pager" @click="toLastPage()">
            <i class="iconfont icon-Group-1" />
          </button>
        </el-pagination>
        <el-pagination
          :current-page.sync="tabParam.pageNo"
          background
          :page-size="tabParam.pageSize"
          :page-sizes="[10, 20]"
          layout="slot, prev"
          :total="tabParam.totalRecord"
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
    <el-dialog
      v-model="sltData"
      title="缩略图"
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
        <i class="iconfont icon-Group-" />点击下载
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      search: {
        searchContent: '',
        searchResult: '',
        searchTime: ''
      },
      loading: false,
      tabParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: 99 // 总条数
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小22222dsadasdada方大大厦虎',
        result: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金经济款婚检婚检啥的USA的哈我哦啊灰色调哈是滴哈是的哈是 哈的哦我杀菌哦级 我降低偶家爱搜等级啊哈哈打连击变大我哦交的手机啊柯尼卡 和静安寺宽带连接爱仕达时间沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1516 弄'
      }],
      centerDialogVisible: false,
      kkfileviewurl: '',
      sltData: {
        clickCount: null,
        createBy: '方洁玮',
        createTime: '2017-02-07 14:15:49',
        dataSource: '文件服务器1',
        docScore: '7.588051',
        fileContent: null,
        fileContentOutline: "陆家嘴软件园 100 号 2 号楼 9 楼 注册地址：<span style='color: red'>中国</span>（<span style='color: red'>上海</span>）自由贸易试验区郭守敬路 351 号 2 号楼 645-2 室 上海菱威深信息技术有限公司 【基本契約書】iVision 甲バージョン",
        fileDirectory: '\\192.168.22.14\ public_all\ 430\ 02.契約書フォーム\ 00.【基本契約書】\ 2017年2月修正後Ver(旧)',
        fileExtend: 'pdf',
        fileMeta: null,
        fileName: '2017年2月修正履歴.pdf',
        filePath: 'C:/public_all/430/02.契約書フォーム/00.【基本契約書】/2017年2月修正後Ver(旧)',
        filePathFull: 'iv-fileserver-public/C:/public_all/430/02.契約書フォーム/00.【基本契約書】/2017年2月修正後Ver(旧)',
        fileSize: 102628,
        fileSizeDescription: '101',
        fileType: 'Others',
        fileUrl: 'iv-fileserver-public/C:/public_all/430/02.契約書フォーム/00.【基本契約書】/2017年2月修正後Ver(旧)/2017年2月修正履歴.pdf',
        id: 'WUc0TUZNMFRNNHYwK0g3RS83ZGhZZz09',
        language: 'JP',
        myLabel: [],
        operFlag: null,
        searchWord: null,
        termFetchTime: null,
        updateBy: '',
        updateTime: '2017-02-07 14:15:49'
      }
    }
  },
  updated() {
    this.$nextTick(() => {
      const firstPageStatue = document.getElementsByClassName('btn-prev')[0].disabled
      const lastPageStatue = document.getElementsByClassName('btn-next')[0].disabled
      // console.log(111111111111, firstPageStatue, lastPageStatue)
      if (firstPageStatue) {
        document.getElementsByClassName('first-pager')[0].disabled = true
      } else {
        document.getElementsByClassName('first-pager').disabled = false
      }
      if (lastPageStatue) {
        document.getElementsByClassName('last-pager')[0].disabled = true
      } else {
        document.getElementsByClassName('last-pager')[0].disabled = false
      }
    })
  },
  methods: {
    searchHistory(obj) {
      console.log(obj)
    },
    // 搜索内容点击
    linkName(value) {
      console.log(value)
      this.search.searchContent = value
    },
    // 搜索结果点击
    linkResult(value) {
      console.log(value)
      this.search.searchResult = value
    },
    // 删除履历
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message.closeAll()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message.closeAll()
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查看缩略图
    showSLT(index, row) {
      this.centerDialogVisible = !this.centerDialogVisible
      // this.sltData=row
      console.log(index, row)
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
        const url = baseApi + row.id
        var previewUrl = url + '?fullfilename=' + new Date().getTime() + '.' + row.fileExtend
        const kkfileviewSrc = contextPath + '/preview/onlinePreview?url=' + encodeURIComponent(previewUrl)
        // const kkfileviewSrc = 'http://localhost/preview/onlinePreview?url=' + encodeURIComponent(previewUrl)
        this.kkfileviewurl = kkfileviewSrc
        // this.centerDialogVisible = true
        if (row.fileType === 'Others') {
          loading.close()
        }
        loading.close()
      })

    },
    // 关闭缩略图
    closeSLT() { },
    // 翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.loading = true
      this.tabParam.pageSize = val
      this.tabParam.pageNo = 1
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.loading = true
      this.tabParam.pageNo = val
      // this.loading = false
      this.$nextTick(() => {
        const firstPageStatue = document.getElementsByClassName('btn-prev')[0].disabled
        const lastPageStatue = document.getElementsByClassName('btn-next')[0].disabled
        // console.log(111111111111, firstPageStatue, lastPageStatue)
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
      this.loading = false
    },
    toLastPage() {

    },
    toFirstPage() {
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
</style>
