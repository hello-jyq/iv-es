<template>
  <div class="container">
    <el-row class="search_box">
      <el-col :span="24">
        <el-autocomplete
          v-model="searchs"
          class="inline-input"
          :fetch-suggestions="querySearch"
          :maxlength="300"
          placeholder="请输入您想要搜索的内容"
          :trigger-on-focus="false"
          popper-class="search_input"
          @select="handleSelect"
        >
          <i slot="prefix" class="iconfont icon-sousuo1" />
          <el-button slot="suffix" @click="search">
            搜&nbsp;&nbsp;索
          </el-button>
        </el-autocomplete>
      </el-col>
      <el-col :span="24" class="flex_ceter" style="height:24px;line-height:24px">
        <span class="font_size_14 fontC_333">搜索条件：</span>
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
        <el-select v-model="lang" placeholder="选择语言" placement="top-end" popper-class="lang_select" @change="getLang">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <div class="main_box">
      <div class="main_left_box">
        <div class="hot_search">
          <span class="item_title">
            热词搜索
          </span>
          <span class="refresh_words" @click="hotWordRefresh()"><i class="iconfont icon-refresh" />
            换一换
          </span>
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
          <!-- <span class="refresh_words" @click="keyWordRefresh()"><i class="iconfont icon-refresh"/>换一换</span>
            <ul class="item_content">
            <li v-for="(item,index) in item_key_contents" :key="index" @click="getKeyValue(item)">
              {{index+1}}、{{item}}
            </li>
          </ul> -->
        </div>
      </div>
      <div class="theme_search">
        <span class="item_title">
          主题搜索
        </span>
        <span class="refresh_words" @click="themeRefresh()"><i class="iconfont icon-refresh" />换一换</span>
        <div class="theme_search_item">
          <template v-for="item in theme_options_values">
            <el-cascader
              :key="item.index"
              :options="theme_options"
              class="theme_search_input"
              :show-all-levels="false"
              popper-class="theme_search"
              :placeholder="item"
              @change="getThemeValue"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getHotwords, getKeywords, getTerms } from '@/api/es/es-api'
export default {
  data() {
    return {
      restaurants: [],
      searchs: '',
      radio: 'FILENAME',
      lang: 'ALL',
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
      item_hot_contents: [],
      tableData: [],
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
  created() {
    this.getHotwords()
    this.getKeywords()
  },
  methods: {
    async getTerms(queryString) {
      const res = await getTerms({ prefix: queryString })
      if (res && res.success) {
        for (var i = 0; i < res.datas.terms.length; i++) {
          this.restaurants.push({
            id: i,
            value: res.datas.terms[i]

          })
        }
      }
    },
    async getHotwords(item) {
      const res = await getHotwords({ item })
      if (res && res.success) {
        console.log('热词', res)
        this.item_hot_contents = res.datas.terms
      }
    },
    async getKeywords(item) {
      const res = await getKeywords({ item })
      if (res && res.success) {
        console.log('履历', res)
        for (let i = 0; i < res.datas.logs.length; i++) {
          this.tableData.push({ date: null, name: res.datas.logs[i], result: null })
        }
      }
    },
    querySearch(queryString, cb) {
      this.restaurants = []
      this.getTerms(queryString)
      // 调用 callback 返回建议列表的数据
      cb(this.restaurants)
    },
    handleSelect(item) {
      console.log(item)
    },
    getLang(value) {
      this.lang = value
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
        path: '/search_result',
        query: {
          search: value
        }
      })
    },
    getKeyValue(value) {
      this.$router.push({
        path: '/search_result',
        query: {
          search: value
        }
      })
    },
    handleProcessInstClick(value) {
      this.$router.push({
        path: '/search_result',
        query: {
          search: value
        }
      })
    },
    getThemeValue(value) {
      this.$router.push({
        path: '/search_result',
        query: {
          search: value[1]
        }
      })
    },
    search() {
      this.$router.push({
        path: '/search_result',
        query: {
          search: this.searchs,
          radio: this.radio,
          lang: this.lang
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
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
