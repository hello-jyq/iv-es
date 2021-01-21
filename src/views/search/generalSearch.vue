<template>
  <div class="container">
    <el-row class="search_box">
      <el-col :span="24">
        <!-- 拉取联想词 -->
        <el-autocomplete
          v-model="searchs"
          class="inline-input search_input"
          placeholder="请输入您想要搜索的内容"
          :trigger-on-focus="false"
          clearable
          :maxlength="81"
          popper-class="search_input"
          :fetch-suggestions="querySearch"
          @select="handleSelect"
          @keyup.enter.native="search"
        >
          <i slot="prefix" class="iconfont icon-sousuo1" />
          <el-button slot="suffix" @click="search">
            搜&nbsp;&nbsp;索
          </el-button>
        </el-autocomplete>
      </el-col>
      <el-col :span="24" class="flex_ceter" style="height:24px;line-height:24px">
        <span class="font_size_14 fontC_333">搜索位置：</span>
        <el-radio-group v-model="radio">
          <el-radio label="ALL">
            不限
          </el-radio>
          <el-radio label="FILENAME">
            文件名
          </el-radio>
          <el-radio label="FILECONTENT">
            文件内容
          </el-radio>
        </el-radio-group>
        <!-- <span class="font_size_14 fontC_333">文档语言：</span>
        <el-select v-model="lang" placeholder="选择语言" placement="top-end" popper-class="lang_select" @change="getLang">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <span class="font_size_14 fontC_333" style="margin-left:20px">搜索方式：</span>
        <el-select v-model="fuzzy" placeholder="请选择" placement="top-end" popper-class="lang_select" @change="getFuzzy">
          <el-option
            v-for="item in searchOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <div class="main_box">
      <!-- <div class="main_left_box">
        <div class="hot_search">
          <span class="item_title">
            热词搜索
          </span>
          <span class="refresh_words" @click="hotWordRefresh()"><i class="iconfont icon-refresh" />换一换</span>
          <ul class="item_content">
            <li v-for="item in item_hot_contents" :key="item.index" @click="getHotValue(item)">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="key_search">
          <span class="item_title">
            搜索履历
          </span>
          <el-table

            :data="tableData"
            height="90%"
            border
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              type="index"
            />
            <el-table-column
              prop="date"
              label="搜索时间"
              width="180"
            />
            <el-table-column
              prop="name"
              label="搜索内容"
              width="180"
              class-name="font_center"
            >
              <template slot-scope="scope">
                <a class="link" @click.prevent="handleProcessInstClick(scope.row.name)">{{ scope.row.name }}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="result"
              class-name="font_left"
              label="搜索结果"
            >
              <template slot-scope="scope">
                <a class="link" @click.prevent="handleProcessInstClick(scope.row.result)">{{ scope.row.result }}</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="theme_search">
        <span class="item_title">
          主题搜索
        </span>
        <span class="refresh_words" @click="themeRefresh()"><i class="iconfont icon-refresh" />换一换</span>
        <div class="theme_search_item">
          <template v-for="item in theme_options_values">
            <el-cascader :key="item.index" :placeholder="item" :options="theme_options" class="theme_search_input" :show-all-levels="false" popper-class="theme_search" @change="getThemeValue" />
          </template>
        </div>
      </div> -->
      <img src="../../assets/img/search_bg.png">
    </div>
  </div>
</template>
<script>
import { advancedSearch, getItems, getTerms, getHotwords, getKeywords } from '@/api/es/es-api'
export default {
  data() {
    return {
      restaurants: [],
      searchs: '',
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          keyWords: '',
          fieldScale: '',
          docLanguage: '',
          language: 'cn',
          fuzzySearchDiv: '2',
          searchTarget: [],
          fileNameBoost: '1',
          fileContentBoost: '1',
          fileExtent: [],
          fileSizeFrom: '',
          fileSizeTo: '',
          sortItem: 'default',
          fileSize: [],
          fileUpdateTime: [],
          filePath: []
        }
      },
      radio: 'ALL',
      lang: 'ALL',
      fuzzy: '2',
      options: [
        {
          value: 'ALL',
          label: '所有语言'
        }, {
          value: 'CN',
          label: '中文'
        }, {
          value: 'EN',
          label: '英文'
        }, {
          value: 'JP',
          label: '日文'
        }],
      searchOption: [
        {
          value: '2',
          label: '完全一致'
        },
        {
          value: '0',
          label: '部分一致'
        }
      ],
      item_hot_contents: ['锦鲤', '杠精', '佛系', '确认过眼神', '官宣', 'C位', '土味情话', '皮一下', '卡路里', '创造101', '超越妹妹', '五位一体', '四个全面', '共享经济', '大数据', '互联网+', '全十四五规划全面小康'],
      hotWords: [],
      searchLogs: [],
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        result: '上海市普陀区金沙江路 1518 弄'
      }],
      theme_options_values: ['合同', '组件', '资源', '组件', '资源1', '组件2', '资源4'],
      theme_options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则'
          }, {
            value: 'daohang',
            label: '导航'
          }]
        },
        {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic'
          }, {
            value: 'form',
            label: 'Form'
          }, {
            value: 'data',
            label: 'Data'
          }, {
            value: 'notice',
            label: 'Notice'
          }, {
            value: 'navigation',
            label: 'Navigation'
          }, {
            value: 'others',
            label: 'Others'
          }]
        },
        {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }]

    }
  },
  watch: {
    searchs(newVal, oldVal) {
      if (newVal.length > 80) {
        this.$message({
          message: '被搜索的关键字被限制在80个字符以内，请调整重新输入！',
          type: 'warning'
        })
        return false
      }
    }
  },
  created() {
    // this.getHotwords()
    // this.getKeywords()
  },
  methods: {
    // 获得热词
    async getHotwords() {
      const res = await getHotwords()
      if (res && res.success) {
        const hotWords = res.datas.terms
        this.hotWords = hotWords
        // console.log(terms)
      }
    },
    // 获得搜索履历
    async getKeywords() {
      const res = await getKeywords()
      if (res && res.success) {
        const searchLogs = res.datas.logs
        this.searchLogs = searchLogs
        // console.log(logs)
      }
    },
    async getTerms(prefix) {
      const res = await getTerms({ prefix })
      if (res && res.success) {
        for (var i = 0; i < res.datas.terms.length; i++) {
          this.restaurants.push({
            id: i,
            value: res.datas.terms[i]

          })
        }
      }
    },
    querySearch(prefix, cb) {
      this.restaurants = []
      // this.getTerms(prefix)
      // 调用 callback 返回建议列表的数据
      cb(this.restaurants)
    },
    handleSelect(item) {
      // console.log(item)
    },
    getLang(value) {
      this.lang = value
    },
    getFuzzy(value) {
      this.fuzzy = value
    },
    hotWordRefresh() {
      this.item_hot_contents.sort(() => Math.random() - 0.5)
    },
    keyWordRefresh() {
      this.item_key_contents.sort(() => Math.random() - 0.5)
    },
    themeRefresh() {
      this.theme_options_values.sort(() => Math.random() - 0.5)
    },
    getHotValue(value) {
      this.$router.push({
        path: '/search/search_result',
        query: {
          search: value
        }
      })
    },
    getKeyValue(value) {
      this.$router.push({
        path: '/search/search_result',
        query: {
          search: value
        }
      })
    },
    handleProcessInstClick(value) {
      this.$router.push({
        path: '/search/search_result',
        query: {
          search: value
        }
      })
    },
    getThemeValue(value) {
      this.$router.push({
        path: '/search/search_result',
        query: {
          search: value[1]
        }
      })
    },
    search() {
      // console.log(this.searchs)
      if (this.searchs) {
        this.$router.push({
          name: '/search/search_result',
          params: {
            search: this.searchs,
            radio: this.radio,
            lang: this.lang,
            fuzzy: this.fuzzy
          }
        })
      } else {
        this.$message.closeAll()
        this.$message({
          message: '请输入搜索内容！',
          type: 'warning'
        })
      }
    }
  }

}
</script>
<style scoped>
.search_box {
  height: 164px;
  margin-bottom: 20px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  border-radius: 16px;
}
.main_box {
  height: calc(100vh - 288px);
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding: 30px;
  box-sizing: border-box;
}
.main_box img {
  margin: 0 auto;
  height: 100%;
}
.inline-input {
  width: 100%;
  padding: 40px 30px 20px;
}
.icon-sousuo1 {
  line-height: 50px;
}
.search_box .el-button {
  width: 160px;
  height: 50px;
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%);
  border-radius: 25px;
  margin-right: -5px;
  color: #ffffff;
  font-size: 16px;
  font-family: "微软雅黑";
  border: none;
}
.main_left_box {
  width: calc(66% - 30px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hot_search {
  height: 240px;
  background: #ffffff;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #cccccc;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}
.key_search {
  height: calc(100% - 270px);
  background: #ffffff;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #cccccc;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}

.theme_search {
  width: 34%;
  background: #ffffff;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #cccccc;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}
.item_title {
  font-size: 18px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 24px;
}
.refresh_words {
  position: absolute;
  right: 30px;
  top: 20px;
  font-size: 16px;
  font-family: "微软雅黑";
  font-weight: 400;
  color: #999999;
  line-height: 28px;
  cursor: pointer;
}
.refresh_words:hover {
  color: #2d7a9c;
}
.icon-refresh {
  margin-right: 10px;
}
.item_content {
  margin-top: 20px;
  height: calc(100% - 40px);
  overflow: auto;
}
.item_content li {
  float: left;
  margin-right: 30px;
  margin-bottom: 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: #2263ec;
  text-decoration: underline;
}
.item_content li:hover {
  color: #2d7a9c;
}
.theme_search_input {
  width: 100%;
}
.theme_search_item {
  height: calc(100% - 40px);
  flex: 1;
  margin-top: 20px;
  padding-bottom: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
