<template>
  <div class="container">
    <el-row class="search_box">
      <el-col :span="24">
        <el-autocomplete
          v-model="searchs"
          class="inline-input search_input"
          :fetch-suggestions="querySearch"
          placeholder="请输入您想要搜索的内容"
          :trigger-on-focus="false"
          clearable
          :maxlength="81"
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
        <span class="font_size_14 fontC_333">文档语言：</span>
        <el-select v-model="lang" placeholder="选择语言" placement="top-end" popper-class="lang_select" @change="getLang">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <span class="font_size_14 fontC_333" style="margin-left:20px">搜索方式：</span>
        <el-select v-model="fuzzy" placeholder="请选择" placement="top-end" popper-class="lang_select" @change="getFuzzy">
          <el-option
            v-for="item in searchOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
      </el-col>
    </el-row>
    <el-row class="search_params">
      <div class="search_params_item">
        <span><i class="iconfont icon-sousuoguanjianci" />搜索关键字：</span>
        <el-input v-model="params.allKeyWords" placeholder="请输入内容">
          <template slot="prepend">
            包含全部关键词
          </template>
        </el-input>
        <el-input v-model="params.arbitraryWords" placeholder="请输入内容">
          <template slot="prepend">
            包含任意关键词
          </template>
        </el-input>
        <el-input v-model="params.notIncludeKeyWords" placeholder="请输入内容">
          <template slot="prepend">
            不包含关键词
          </template>
        </el-input>
      </div>
      <div class="search_params_item">
        <span><i class="iconfont icon-shijian" />更新时间：</span>
        <el-radio-group v-model="params.radioTime">
          <el-radio v-for="time in radioTimeList" :key="time.id" :label="time.id">
            {{ time.name }}
          </el-radio>
        </el-radio-group>
        <el-date-picker
          v-model="params.radioDiyTime"
          class="diy_time"
          popper-class="date_picker"
          value-format="yyyy-MM-dd"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="diyTimeChange"
        />
      </div>
      <div class="search_params_item">
        <span><i class="iconfont icon-duomeitiicon-" />文档类型：</span>
        <el-checkbox-group v-model="params.fileType">
          <el-checkbox v-for="type in checkboxFileTypeList" :key="type.index" :label="type.id">
            {{ type.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="search_params_item">
        <span><i class="iconfont icon-daxiao" />文件大小：</span>
        <el-checkbox-group v-model="params.fileSize">
          <el-checkbox v-for="type in checkboxFileSizeList" :key="type.index" :label="type.id">
            {{ type.name }}
          </el-checkbox>
        </el-checkbox-group>
        <div class="diy_filesize">
          <el-input
            v-model="params.diysizefrom"
            class="from"
            placeholder="请输入数值"
            prefix-icon="iconfont icon-daxiao"
          />
          <span class="zhi">至</span>
          <el-input
            v-model="params.diysizeto"
            class="to"
            placeholder="请输入数值"
            prefix-icon="iconfont icon-daxiao"
          />
        </div>
      </div>
      <div class="search_params_item">
        <span><i class="iconfont icon-mulu" />在指定目录中搜索：</span>
        <el-input v-model="params.dataSourceSearch" placeholder="请输入内容" class="input-with-select">
          <el-select slot="prepend" v-model="params.dataSource" class="item_select" placeholder="请选择">
            <el-option v-for="item in dataSourceSelectList" :key="item.index" :label="item.name" :value="item.id" />
          </el-select>
        </el-input>
      </div>
      <div class="search_params_item">
        <span><i class="iconfont icon-paixu" />排序方式：</span>
        <el-radio-group v-model="params.radioSort">
          <el-radio v-for="time in radioSortList" :key="time.id" :label="time.id">
            {{ time.name }}
          </el-radio>
        </el-radio-group>
      </div>
    </el-row>
  </div>
</template>
<script>
import { getTerms } from '@/api/es/es-api'
export default {
  data() {
    return {
      restaurants: [],
      searchs: '',
      radio: 'ALL',
      lang: 'ALL',
      fuzzy: '0',
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
          value: '0',
          label: '部分一致'
        },
        {
          value: '2',
          label: '完全一致'
        }
      ],
      radioTimeList: [
        { id: 'ALL', name: '全部时间' },
        { id: '1', name: '一天内' },
        { id: '7', name: '一周内' },
        { id: '30', name: '一月内' },
        { id: '188', name: '半年内' },
        { id: '365', name: '一年内' },
        { id: 'diy', name: '自定义时间(YYMMDD)' }
      ],
      checkboxFileTypeList: [
        { id: 'Word', name: 'Word' },
        { id: 'Excel', name: 'Excel' },
        { id: 'PowerPoint', name: 'PowerPoint' },
        { id: 'Pdf', name: 'Adobe Acrobat PDF' },
        { id: 'Text', name: '文本类' },
        { id: 'Image', name: '图像类' },
        { id: 'zip', name: '压缩类' },
        { id: 'Media', name: '媒体类' },
        { id: 'Others', name: '其他类型' }
      ],
      checkboxFileSizeList: [
        { id: '1', name: '0~500KB' },
        { id: '2', name: '500KB~1MB' },
        { id: '3', name: '1MB~100MB' },
        { id: '4', name: '1MB以上' },
        { id: 'diy', name: '自定义大小' }
      ],
      dataSourceSelectList: [
        { id: '1', name: '服务器一' },
        { id: '2', name: '服务器二' },
        { id: '3', name: '服务器三' }
      ],
      radioSortList: [
        { id: 'relativity', name: '按相关度排序' },
        { id: 'time', name: '按时间排序' }
      ],
      params: {
        allKeyWords: '',
        arbitraryWords: '',
        notIncludeKeyWords: '',
        radioTime: 'ALL',
        radioDiyTime: '',
        fileType: [],
        fileSize: [],
        diysizefrom: '',
        diysizeto: '',
        dataSource: '1',
        dataSourceSearch: '',
        radioSort: 'relativity'
      }
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
  methods: {
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
      this.getTerms(prefix)
      // 调用 callback 返回建议列表的数据
      cb(this.restaurants)
    },
    handleSelect(item) {
      console.log(item)
    },
    getLang(value) {
      this.lang = value
    },
    // getFuzzy(value) {
    //   this.fuzzy = value
    // },
    search() {
      console.log(this.searchs)
      if (this.searchs) {
        this.$router.push({
          name: 'advancedSearchresult',
          params: {
            search: this.searchs,
            radio: this.radio,
            lang: this.lang,
            fuzzy: this.fuzzy
          }
        })
      } else {
        this.$message.close()
        this.$message({
          message: '请输入搜索内容！',
          type: 'warning'
        })
      }
    },
    diyTimeChange(val) {
      if (val) {
        this.params.radioTime = 'diy'
      }
    }
  }
}
</script>
<style  scoped>
.search_box {
  height: 164px;
  margin-bottom: 20px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  border-radius: 16px;
}
.search_params {
  height: calc(100vh - 288px);
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  background: #ffffff;
  border-radius: 16px;
  overflow: auto;
  flex: 1;
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
.search_params_item {
  width: 100%;
  height: 40px;
  color: #333333;
  margin-bottom: 20px;
  box-sizing: border-box;
  line-height: 40px;
  display: flex;
  justify-content: left;
}
.search_params_item > span {
  display: flex;
  align-items: center;
  justify-items: center;
  font-size: 16px;
  min-width: 120px;
  max-width: 120px;
  line-height: 24px;
}
.search_params_item span i {
  margin-right: 8px;
}
.search_params_item .el-input {
  margin-left: 20px;
  border-radius: 4px;
  border-color: #cccccc;
}
.search_params_item .el-radio-group {
  display: flex;
  align-items: center;
  justify-items: left;
  margin-left: 20px;
}
.search_params_item .el-radio-group label {
  margin-right: 30px;
}
.search_params_item .el-checkbox-group {
  display: flex;
  align-items: center;
  justify-items: left;
  margin-left: 20px;
}
.search_params_item .el-checkbox-group label {
  margin-right: 30px;
}
.search_params_item .el-range-editor.el-input__inner {
  border-color: #cccccc;
}
.diy_filesize {
  max-width: 540px;
  height: 40px;
  line-height: 38px;
  /* border: 1px solid #cccccc; */
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
.diy_filesize .from,
.diy_filesize .to {
  max-width: 248px;
  margin-left: 0;
  border: 1px solid #cccccc;
}
.zhi {
  display: block;
  min-width: 30px;
  text-align: center;
}
.item_select {
  width: 120px;
}
.search_params_item .input-with-select {
  width: 440px;
}
</style>
