<template>
  <div class="container">
    <el-row class="search_box">
      <el-col :span="24">
        <el-autocomplete
          ref="searchInput"
          v-model="searchs"
          class="inline-input search_input"
          :fetch-suggestions="querySearch"
          placeholder="请输入您想要搜索的内容"
          :trigger-on-focus="false"
          clearable
          :maxlength="81"
          popper-class="search_input"
          @select="handleSelect"
          @keyup.enter.native="search"
        >
          <i slot="prefix" class="iconfont icon-sousuo1" />
          <el-button slot="suffix" @click="search">
            搜&nbsp;&nbsp;索
          </el-button>
        </el-autocomplete>
      </el-col>
      <el-col
        :span="24"
        class="flex_ceter"
        style="height: 24px; line-height: 24px"
      >
        <span class="font_size_14 fontC_333">搜索位置：</span>
        <dict-radio v-model="esSearchTarget" dict-type-id="ESSearchTarget" />
        <!-- <el-radio-group v-model="radio">
          <el-radio label="ALL">
            不限
          </el-radio>
          <el-radio label="FILENAME">
            文件名
          </el-radio>
          <el-radio label="FILECONTENT">
            文件内容
          </el-radio>
        </el-radio-group> -->
        <!-- <span class="font_size_14 fontC_333">文档语言：</span>
        <el-select v-model="lang" placeholder="选择语言" placement="top-end" popper-class="lang_select" @change="getLang">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <span
          class="font_size_14 fontC_333"
          style="margin-left: 20px"
        >搜索方式：</span>
        <!-- <el-select v-model="fuzzy" placeholder="请选择" placement="top-end" popper-class="lang_select" @change="getFuzzy">
          <el-option
            v-for="item in searchOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <dict-select v-model="esSearchDiv" dict-type-id="ESFuzzySearch" :clearable="false" />
      </el-col>
    </el-row>
    <el-row class="search_params">
      <div class="reset_filter_btn">
        <span
          @click="resetFilterClick()"
        ><i class="iconfont icon-shuaxin" />重置</span>
      </div>
      <div class="search_params_item">
        <span><i class="iconfont icon-sousuoguanjianci" />搜索关键字：</span>
        <el-input
          v-model="allKeyWords"
          placeholder="请输入内容"
          maxlength="10"
          clearable
        >
          <template slot="prepend">
            包含全部关键词
          </template>
        </el-input>
        <!-- <el-input v-model="params.arbitraryWords" placeholder="请输入内容">
          <template slot="prepend">
            包含任意关键词
          </template>
        </el-input> -->
        <el-input
          v-model="notIncludeKeyWords"
          placeholder="请输入内容"
          maxlength="10"
          clearable
        >
          <template slot="prepend">
            不包含关键词
          </template>
        </el-input>
      </div>
      <div class="search_params_item">
        <span><i class="iconfont icon-shijian" />更新日期：</span>
        <!-- <el-radio-group v-model="params.radioTime">
          <el-radio v-for="time in radioTimeList" :key="time.id" :label="time.id">
            {{ time.name }}
          </el-radio>
        </el-radio-group> -->
        <dict-radio v-model="modifyedTime" dict-type-id="ESSearchModifyedTime" />
        <!-- <el-radio v-model="modifyedTime" label="diy">
          自定义时间
        </el-radio> -->
        <el-date-picker
          v-model="radioDiyTime"
          class="diy_time"
          :disabled="modifyedTime === 'diy' ? false : true"
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
        <dict-checkbox
          v-model="fileType"
          dict-type-id="ESFilterExtent"
          @change="fileTypeCheckbox"
        />
        <!-- <el-checkbox-group v-model="params.fileType">
          <el-checkbox v-for="type in checkboxFileTypeList" :key="type.index" :label="type.id">
            {{ type.name }}
          </el-checkbox>
        </el-checkbox-group> -->
        <!-- <dict-checkbox></dict-checkbox> -->
      </div>
      <div class="search_params_item">
        <span><i class="iconfont icon-daxiao" />文件大小：</span>
        <dict-checkbox
          v-show="issize"
          v-model="fileSize"
          dict-type-id="ESSearchFileSizeRange"
          @change="fileSizeChange"
        />
        <!-- <el-checkbox-group v-model="params.fileSize">
          <el-checkbox v-for="type in checkboxFileSizeList" :key="type.index" :label="type.id">
            {{ type.name }}
          </el-checkbox>
        </el-checkbox-group> -->
        <!-- <el-checkbox
          v-show="issize"
          v-model="fileSizeDiy"
          class="diycheck"
          label="diy"
          @change="checkboxDIYChange(fileSizeDiy), (fileSizeDiy = !fileSizeDiy)"
        >
          自定义大小
        </el-checkbox> -->
        <div class="diy_filesize">
          <el-input
            v-model="diysizefrom"
            :disabled="fileSizeDiy ? false : true"
            class="from"
            placeholder="请输入数值"
            prefix-icon="iconfont icon-daxiao"
            clearable
          />
          <span class="fileszieDiyfromerror">{{ diysizefrommessage }}</span>
          <span class="zhi">至</span>
          <el-input
            v-model="diysizeto"
            :disabled="fileSizeDiy ? false : true"
            class="to"
            placeholder="请输入数值"
            prefix-icon="iconfont icon-daxiao"
            clearable
          />
          <span class="fileszieDiytoerror">{{ diysizetomessage }}</span>
          <span class="kb">KB</span>
        </div>
      </div>
      <div class="search_params_item">
        <span><i class="iconfont icon-mulu" />目录搜索：</span>
        <dict-select
          v-model="dataSource"
          class="select_input"
          dict-type-id="ESDataSourceName"
          @change="dataSourceChange"
        />
        <!-- <el-input v-model="params.dataSourceSearch" placeholder="请输入内容" class=" select_input_value" /> -->
        <!-- 当输入建议框发生改变时触发的事件 -->
        <!-- @input="filePathInputChange" -->
        <el-autocomplete
          ref="filePathsearchInput"
          v-model="dataSourceFilePath"
          class="select_input_value"
          :fetch-suggestions="queryFilePathSearch"
          placeholder="请输入您要搜索的目录（/Public_all$/310.Public_ITS_InfraServiceDept/HR-FI/...）"
          :trigger-on-focus="false"
          clearable
          :disabled="filePathInputEnable ? false : true"
          popper-class="search_input"
          @select="handleFilePathSelect"
        >
          <template slot-scope="{ item }">
            <div
              class="value"
              :title="item.value"
              style="
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                width: 100%;
              "
            >
              {{ item.value }}
            </div>
          </template>
        </el-autocomplete>
      </div>
      <!-- <div class="search_params_item">
        <span><i class="iconfont icon-paixu" />排序方式：</span>
        <dict-radio v-model="searchSortType" dict-type-id="ESSearchSortType" />
      </div> -->
    </el-row>
  </div>
</template>
<script>
import { getTerms, getFilePath } from '@/api/es/es-api'
import DictRadio from '@/components/DictRadio'
import DictSelect from '@/components/DictSelect'
import DictCheckbox from '@/components/DictCheckbox'
export default {
  components: {
    DictRadio,
    DictCheckbox,
    DictSelect
  },
  data() {
    return {
      restaurants: [],
      suggestFilePaths: [],
      searchs: '',
      esSearchDiv: 'ALL',
      esSearchTarget: '2',
      allKeyWords: '',
      // arbitraryWords: '',
      notIncludeKeyWords: '',
      modifyedTime: '0',
      radioTime: 'ALL',
      radioDiyTime: [],
      fileType: [],
      fileSize: [],
      diysizefrom: '',
      diysizeto: '',
      dataSource: '',
      dataSourceFilePath: '',
      searchSortType: 'rel',
      diysizefrommessage: '',
      diysizetomessage: '',
      issize: true,
      fileSizeDiy: false,
      modifyedTimeFlag: false,
      filePathInputEnable: false
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
    },
    modifyedTime(newVal, oldVal) {
      if (newVal !== 'diy') {
        this.radioDiyTime = []
      }
    },
    diysizefrom(newVal, oldVal) {
      const reg = /^\+?[1-9]\d*$/
      if (newVal !== '') {
        this.diysizefrommessage = ''
        if (!reg.test(newVal)) {
          this.diysizefrommessage = '请输入大于0的正整数'
        } else {
          if (
            Number(newVal) > Number(this.diysizeto) &&
            this.diysizeto !== ''
          ) {
            this.diysizefrommessage =
              '请输入小于' + this.diysizeto + '的正整数'
          } else if (
            Number(newVal) < Number(this.diysizeto) &&
            this.diysizeto !== ''
          ) {
            this.diysizetomessage = ''
          } else {
            this.diysizefrommessage = ''
          }
        }
        if (newVal.length > 11) {
          this.diysizefrommessage = '输入位数请限制在11位以内'
        }
      } else if (newVal === '') {
        this.diysizefrommessage = ''
      }
    },
    diysizeto(newVal, oldVal) {
      const reg = /^\+?[1-9]\d*$/
      if (newVal !== '') {
        this.diysizetomessage = ''
        if (!reg.test(newVal)) {
          this.diysizetomessage = '请输入大于0的正整数'
        } else {
          if (
            Number(this.diysizefrom) > Number(newVal) &&
            this.diysizefrom !== ''
          ) {
            this.diysizetomessage =
              '请输入大于' + this.diysizefrom + '的正整数'
          } else if (
            Number(this.diysizefrom) < Number(newVal) &&
            this.diysizefrom !== ''
          ) {
            this.diysizefrommessage = ''
          } else {
            // this.diysizefrommessage = ''
            this.diysizetomessage = ''
          }
        }
        if (newVal.length > 11) {
          this.diysizetomessage = '输入位数请限制在11位以内'
        }
      } else if (newVal === '') {
        this.diysizetomessage = ''
      }
    }
  },
  created() {
    this.initSettings()
    this.$nextTick(() => {
      this.$refs.searchInput.focus()
    })
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
    async getFilePath(queryString, dataSource) {
      const res = await getFilePath({ queryString, dataSource })
      if (res && res.success) {
        for (var i = 0; i < res.datas.filePaths.length; i++) {
          this.suggestFilePaths.push({
            id: i,
            value: res.datas.filePaths[i]
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
    queryFilePathSearch(queryString, cb) {
      this.suggestFilePaths = []
      const dataSource = this.dataSource
      console.log(dataSource)
      this.getFilePath(queryString, dataSource)
      // 调用 callback 返回建议列表的数据
      cb(this.suggestFilePaths)
    },
    handleSelect(item) {
      console.log(item)
    },
    handleFilePathSelect(item) {
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
            radio: this.esSearchTarget,
            fuzzy: this.esSearchDiv,
            allKeyWords: this.allKeyWords,
            notIncludeKeyWords: this.notIncludeKeyWords,
            modifyedTime: this.modifyedTime,
            radioDiyTime: this.radioDiyTime,
            // modifyStartTime: this.modifyStartTime,
            // modifyEndTime: this.modifyEndTime,
            fileType: this.fileType,
            fileSize: this.fileSize,
            // fileSizeDiy: this.fileSizeDiy,
            diysizefrom: this.diysizefrom,
            diysizeto: this.diysizeto,
            dataSource: this.dataSource,
            dataSourceFilePath: this.dataSourceFilePath,
            searchSortType: this.searchSortType
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
    // 重置
    resetFilterClick() {
      this.allKeyWords = ''
      this.notIncludeKeyWords = ''
      this.modifyedTime = '0'
      this.radioTime = 'ALL'
      this.radioDiyTime = []
      this.fileType = []
      this.fileSize = []
      this.fileSizeDiy = false
      this.diysizefrom = ''
      this.diysizeto = ''
      this.dataSource = ''
      this.dataSourceFilePath = ''
      this.searchSortType = 'rel'
    },
    // 更新时间
    diyTimeChange(val) {
      // console.log(val)
      console.log(this.modifyedTime)
      console.log(this.radioDiyTime)
      if (val) {
        if (this.radioDiyTime.length > 0) {
          this.modifyStartTime = val[0]
          this.modifyEndTime = val[1]
          this.modifyedTimeFlag = true
        }
      }
    },
    fileTypeCheckbox(val) {
      // TODO
    },
    checkboxDIYChange(val) {
      if (val) {
        this.fileSizeDiy = false
        this.fileSize = []
        // this.searchParam.params.fileSizeList = []
        // this.normalSearch(this.searchParam)
      } else {
        this.fileSizeDiy = true
      }
    },
    fileSizeChange(val) {
      console.log(val)
      // this.fileSizeDiy = false
      // // this.searchParam.pageNo = 1
      // this.diysizefrom = ''
      // this.diysizeto = ''
      // if (val.length > 1) {
      //   if (!val.contains('diy')) {
      //     this.diysizefrom = ''
      //     this.diysizeto = ''
      //     // this.fileSize.remove('diy')
      //     this.fileSizeDiy = false
      //   } else {
      //     this.fileSizeDiy = true
      //     this.fileSize.remove('diy')
      //   }
      // } else {
      //   if (!val.contains('diy')) {
      //     this.diysizefrom = ''
      //     this.diysizeto = ''
      //     // this.fileSize.remove('diy')
      //     this.fileSizeDiy = false
      //   } else {
      //     this.fileSizeDiy = true
      //     this.fileSize = ['diy']
      //   }
      // }
      // if (!val.contains('diy')){}
    },
    dataSourceChange(val) {
      console.log(val)
      if (val) {
        this.dataSource = val
        console.log(this.dataSource)
        this.filePathInputEnable = true
        this.dataSourceFilePath = ''
      } else {
        this.filePathInputEnable = false
      }
    },
    initSettings() {
      const userSettingMap = this.$store.state.userInfo.userSettingMap
      console.log(userSettingMap)
      if (userSettingMap !== undefined) {
        if (userSettingMap.SearchDiv !== undefined) {
          this.esSearchDiv = userSettingMap.SearchDiv
        }

        if (userSettingMap.SearchTarget !== undefined) {
          this.esSearchTarget = userSettingMap.SearchTarget
        }

        if (userSettingMap.InitOrg !== undefined) {
          this.initOrg = userSettingMap.InitOrg
        } else {
          this.initOrg = this.$store.state.userInfo.orgId
        }
      }

      // 做成新的orgList
      const defaultOrg = {
        id: this.$store.state.userInfo.orgId,
        fullName: this.$store.state.userInfo.orgFullName
      }
      this.orgList = []
      this.orgList.push(defaultOrg)
      const userOrgList = this.$store.state.userOrgList
      if (userOrgList !== undefined) {
        userOrgList.forEach((item) => this.orgList.push(item))
      }
    }
    // filePathInputChange(val) {
    //   if (val) {
    //     if (!this.dataSource) {
    //       this.$message({
    //         message: '请选择文件服务器！',
    //         type: 'warning'
    //       })
    //     }
    //   }
    // }
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
  /* height: 40px; */
  color: #333333;
  margin-bottom: 20px;
  box-sizing: border-box;
  /* line-height: 40px; */
  display: flex;
  justify-content: left;
  align-items: center;
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
  width: auto;
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
.reset_filter_btn {
  /* padding-top: 15px; */
  margin-bottom: 10px;
  color: #2d7a9c;
  font-family: "微软雅黑";
  font-size: 16px;
  /* border-top: 1px solid #eeeeee; */
}
.reset_filter_btn i {
  margin-right: 15px;
}
.put_filter i {
  font-size: 24px;
}
.reset_filter_btn span {
  cursor: pointer;
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
  position: relative;
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
  min-width: 120px;
}
.search_params_item .input-with-select {
  width: 440px;
}
.fileszieDiyfromerror {
  position: absolute;
  top: 30px;
  left: 10px;
  color: #f54132;
}
.fileszieDiytoerror {
  position: absolute;
  top: 30px;
  left: 255px;
  color: #f54132;
}
</style>
