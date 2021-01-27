<template>
  <div class="container">
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
                <el-tooltip class="item" effect="light" content="查看" placement="top" :visible-arrow="false">
                  <i class="iconfont icon-yanjing" />
                </el-tooltip>
                <span style="margin-left: 5px" @click="linkResult(scope.row.result)">{{ scope.row.result }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="160"
            >
              <template slot-scope="scope">
                <i class="iconfont icon-shanchu1" @click="handleDelete(scope.$index, scope.row)" />
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
      }]
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
.pagination-box {
  padding: 0;
  padding-top: 15px;
  height: 40px;
  width: 100%;
}
.icon-lianjie,
.icon-yanjing {
  color: #2263ec;
}
</style>
