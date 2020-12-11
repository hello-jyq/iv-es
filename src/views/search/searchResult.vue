<template>
    <div class="result_box">
        <div :class="isCollapse?'result_DIY result_filter_all':'result_DIY result_filter'">
          <div class="title_box">
            <ul >
              <li v-for="(item,index) in filetab" :key="index" :class="activeDataSource==index?'active':''"   @click="filetapClick(item.id),activeDataSource=index" :title="item.dictName">{{item.dictName}}</li>
            </ul>
          </div>
          <div class="con_box" >
            <div class="left_result">
              <div class="search_num" @click="istree=!istree">
                <i class="iconfont icon-sousuo2" />
                <span>搜索结果数量</span>
                <i class="iconfont icon-ai-arrow-down" :class="istree?'':'icon_gif'"></i>
              </div>     
              <el-tree
              v-show="istree"
                :data="treeData"
                show-checkbox
                node-key="id"
                :expand-on-click-node=false
                :check-on-click-node=true
                :check-strictly=true
                :default-expanded-keys="[2, 5]"
                :default-checked-keys="[1]"
                :default-expand-all="istree"
                icon-class="iconfont icon-jiantou-copy"
                ref="ProjectTree"
                @check="docTreeCheck"
                >             
              </el-tree>

              <div class="search_num" style="margin-top:30px" @click="ischeck=!ischeck">
                  <i class="iconfont icon-duomeitiicon-" />
                  <span>文档类型</span>
                  <i class="iconfont icon-ai-arrow-down" :class="ischeck?'':'icon_gif'"></i>
              </div>
              <el-checkbox-group v-model="filecheckList" @change="fileType" v-show='ischeck' >
                <el-checkbox v-for="type in fileTypeAggResult" :key="type.id" :label="type.id">{{type.name}}</el-checkbox>
              </el-checkbox-group> 
        
              <div class="search_num" style="margin-top:30px" @click="isradio=!isradio">
                  <i class="iconfont icon-shijian" />
                  <span>更新时间</span>
                  <i class="iconfont icon-ai-arrow-down" :class="isradio?'':'icon_gif'"></i>
              </div>
              <el-radio-group v-model="radiocheckList" @change="radioTimeCheck" v-show="isradio">
                 <el-radio :label="time.id" v-for="time in fileUpdateTimeAggResult" :id="time.id" :key="time.id">{{time.name}}</el-radio>
                  <el-radio label="自定义时间"></el-radio>
               </el-radio-group>
              <div class="block" v-show="isradio">        
                  <el-date-picker
                  popper-class="date_picker"
                    v-model="radiotime"
                    @change="diyTime"
                    value-format="yyyy-MM-dd hh:mm"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
              </div>

                <div class="search_num" style="margin-top:30px" @click="issize=!issize">
                  <i class="iconfont icon-daxiao" />
                  <span>文件大小</span>
                  <i class="iconfont icon-ai-arrow-down" :class="issize?'':'icon_gif'"></i>
                </div>
                <el-checkbox-group v-model="sizecheckList" v-show='issize' @change="checkboxChange">
                  <el-checkbox  v-for="filesize in fileSizeAggResult" :key="filesize.index"  :label="filesize.id">{{filesize.name}}</el-checkbox>
                  <el-checkbox label="自定义大小" @click.native="diysize"></el-checkbox>
                </el-checkbox-group> 
                <div class="diy_size"  v-show='issize'>
                  <el-input
                  class="from"
                 readonly
                    placeholder="请输入数值"
                    prefix-icon="iconfont icon-daxiao"
                    v-model="diysizefrom">
                  </el-input>
                  <span class="zhi">至</span>
                  <el-input
                  readonly
                   class="to"
                    placeholder="请输入数值"
                    v-model="diysizeto">
                  </el-input>
                </div>
                
                <div class="search_num" style="margin-top:30px" @click="isfile=!isfile">
                  <i class="iconfont icon-ziyuan" />
                  <span>文档语言</span>
                  <i class="iconfont icon-ai-arrow-down" :class="isfile?'':'icon_gif'"></i>
                </div>
                <el-checkbox-group v-model="lancheckList" @change="langCheckbox" v-show='isfile'>
                  <el-checkbox label="全部语言"></el-checkbox>
                  <el-checkbox label="中文"></el-checkbox>
                  <el-checkbox label="英文"></el-checkbox>
                  <el-checkbox label="日文"></el-checkbox>
                </el-checkbox-group> 
            </div>
            <!-- <el-row type="flex" justify="space-around" style="margin-top:20px;margin-right:20px">
              <el-button round icon="iconfont icon-refresh">重置</el-button>
              <el-button type="primary" round icon="iconfont icon-queding">确定</el-button>
            </el-row> -->
          </div>
        </div>
        <div  class="container">
         <el-row class="search_box">
            <el-col :span="24">             
                <el-autocomplete
                  class="inline-input "
                  v-model="keyWords"
                  :fetch-suggestions="querySearch"
                  @select="searchWords"
                  placeholder="请输入您想要搜索的内容"
                  :maxlength=300
                  :trigger-on-focus="false"
                  popper-class="search_input"
                >
                <i slot="prefix" class="iconfont icon-sousuo1"></i>
                <el-button slot="suffix" @click="btnSearch">搜&nbsp;&nbsp;索</el-button>
              </el-autocomplete>
            </el-col>
            <el-col :span="24" class="flex_ceter" style="height:24px;line-height:24px">
              <span class="font_size_14 fontC_333">搜索条件：</span>
              <el-radio-group v-model="fieldScale" @change="fileScale">
                <el-radio label="ALL">不限</el-radio>
                <el-radio label="FILENAME">文件名</el-radio>
                <el-radio label="FILECONTENT">文件内容</el-radio>
              </el-radio-group>
              <el-select v-model="docLanguage" placeholder="选择语言" placement="top-end" @change="getLang" popper-class="lang_select">
                <el-option
                  v-for="item in optionslang"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>   
       
         <div class="main_box" v-loading="loading">
            <div class="result_header">
              <span>找到约{{totalRecord}}条结果(用时0.55秒)</span>
              <div class="result_header_filter">
                  结果排序：<span @click="relativity('big'),isrelativity=!isrelativity">相关度<i class="iconfont icon-xuanze" :class="isrelativity?'icon_active':''"/></span><span  @click="timeSort('new'),istime=!istime">时间<i class="iconfont icon-xuanze" :class="istime?'icon_active':''"/></span>
                  <!-- <div class="pop_btn"><i class="iconfont icon-sousuo2"/></div> -->
              </div>
             
            </div>
            <div class="result_main" v-if="results.results!=''">
                <div class="each_reult" v-for="(item,index) in results.results" :key="item.id">
                  <div class="each_r_top">
                    <div>
                      <span><i class="iconfont icon-wenjianjia"/>{{item.dataSource}}</span>
                      <span><i class="iconfont icon-wendang"/>{{item.filePath}}</span>
                      <span><i class="iconfont icon-wode"/>{{item.updateUser}}</span>
                    </div>
                    <span class="each_down" @click="down(item.fileUrl)">
                     <i class="iconfont  icon-Group-"/>点击下载
                    </span>
                  </div>
                  <div class="each_r_title" >
                    <img v-if="item.fileType=='Excel'" src="../../assets/img/filetype/excel.png"/>
                    <img v-else-if="item.fileType=='Word'" src="../../assets/img/filetype/word.png"/>
                    <img v-else-if="item.fileType=='PowerPoint'" src="../../assets/img/filetype/PPT.png"/>
                    <img v-else-if="item.fileType=='Pdf'" src="../../assets/img/filetype/PDF.png"/>
                    <img v-else-if="item.fileType=='Text'" src="../../assets/img/filetype/TXT.png"/>
                    <img v-else-if="item.fileType=='Image'" src="../../assets/img/filetype/img.png"/>
                    <img v-else-if="item.fileType=='zip'" src="../../assets/img/filetype/excel.png"/>
                    <img v-else-if="item.fileType=='Media'" src="../../assets/img/filetype/other.png"/>
                    <img v-else src="../../assets/img/filetype/other.png"/>
                    <span @click="showSLT(item)" v-html="item.fileName"></span>
                     <img v-if="item.language=='CN'" class="each_lan" src="../../assets/img/cn_ico.png"/>
                    <img v-else-if="item.language=='EN'" class="each_lan" src="../../assets/img/en_ico.png"/>
                    <img v-else class="each_lan" src="../../assets/img/jp_ico.png"/>
                  </div>
                  <div class="each_r_con">
                    {{item.updateTime}} {{item.fileSize}}KB - {{item.fileType}} <span v-html="item.fileContentOutline"></span>
                  </div>
                  <div class="each_r_url" id="eachurl">
                 
                    {{item.fileDerectory}} - 
                     <el-popover
                        placement="right"
                        width="200"
                        trigger="click"
                        content="复制成功"
                        popper-class="coby"
                      >
                        <span slot="reference"  @click="copyUrl(index)">点击可复制路径</span>
                      </el-popover>
                       <input :id="'urlcoby'+index" type="text" :value="item.fileDerectory" style="opacity: 0"/>
                  </div>
                  <div class="each_r_lable">
                    <ul>
                      <li><i class="iconfont icon-label"/>电子商务</li>
                      <li><i class="iconfont icon-label"/>网络推广</li>
                      <li><i class="iconfont icon-label"/>报表合同</li>
                      <li><i class="iconfont icon-label"/>电子商务啊啊啊啊</li>
                      <li><i class="iconfont icon-label"/>网络推广</li>
                      <li><i class="iconfont icon-label"/>报表合同</li>
                      <li><i class="iconfont icon-label"/>网络推广</li>
                      <li><i class="iconfont icon-label"/>报表合同</li>
                      <li><i class="iconfont icon-label"/>电子商务啊啊啊啊</li>
                      <li><i class="iconfont icon-label"/>网络推广</li>
                      <li class="set_label"><i class="iconfont icon-label"/>设置个人标签</li>
                    </ul>
                  </div>
                </div>
          
            </div>
            <div class="result_main_empty" v-else>
              <div class="empty_img">
                <img src="../../assets/img/result_empty.png"/>
                <span>抱歉，没有找到符合条件的内容</span>
                <span>您可以简化或缩短关键词再进行搜索</span>
              
              </div>
              <div>
              <span class="empty_title">未搜索到结果的原因为： </span>
              <span>未搜索到结果的原因有多种，关键词太繁杂，可以试着删除一些；未搜索到结果的原因有多种，关键词太繁杂，可以试着删除一些；未搜索到结果的原因有多种，关键词太繁杂，可以试着删除一些；未搜索到结果的原因有多种，关键词太繁杂，可以试着删除一些。</span>
              </div>
            </div>
            
          </div>   
          <div class="search_Pagination" v-show="results!=''">             
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pageNo"
                  background
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="pageSize"
                  layout="total, sizes"
                  :total="totalRecord"
                  class='pagination_left'
                  >
                </el-pagination>                
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pageNo"
                  background
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="pageSize"
                  layout=" pager, next,slot"
                  :total="totalRecord"
                   class='pagination_right'
                  >
                  <button type="button" class="last-pager" @click="jumpPage('0')"><i class="iconfont icon-Group-1"></i></button>   
                </el-pagination>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pageNo"
                  background
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="pageSize"
                  layout="slot, prev"
                  :total="totalRecord"
                   class='pagination_right'
                  >
                    <button type="button" class="first-pager" @click="jumpPage('1')"><i class="iconfont icon-zuiqian"></i></button>   
                </el-pagination>
            </div>  
        </div>
        <el-dialog
          title="缩略图"
          :visible.sync="centerDialogVisible"
          :close-on-click-modal="false"
          v-model="sltData"
           class="sltDialog"
          > 
            <div class="each_r_top">
              <div>
                <span><i class="iconfont icon-wenjianjia"/>{{sltData.dataSource}}</span>
                <span><i class="iconfont icon-wendang"/>{{sltData.filePath}}</span>
                <span><i class="iconfont icon-wode"/>{{sltData.updateUser}}</span>
              </div>
            </div>
            <div class="each_r_title">
                <img v-if="sltData.fileType=='Excel'" src="../../assets/img/filetype/excel.png"/>
                <img v-else-if="sltData.fileType=='Word'" src="../../assets/img/filetype/word.png"/>
                <img v-else-if="sltData.fileType=='PowerPoint'" src="../../assets/img/filetype/PPT.png"/>
                <img v-else-if="sltData.fileType=='Pdf'" src="../../assets/img/filetype/PDF.png"/>
                <img v-else-if="sltData.fileType=='Text'" src="../../assets/img/filetype/TXT.png"/>
                <img v-else-if="sltData.fileType=='Image'" src="../../assets/img/filetype/img.png"/>
                <img v-else-if="sltData.fileType=='zip'" src="../../assets/img/filetype/excel.png"/>
                <img v-else-if="sltData.fileType=='Media'" src="../../assets/img/filetype/other.png"/>
                <img v-else src="../../assets/img/filetype/other.png"/>
              <span v-html="sltData.fileName"></span>
              <img v-if="sltData.language=='CN'" class="each_lan" src="../../assets/img/cn_ico.png"/>
              <img v-else-if="sltData.language=='EN'" class="each_lan" src="../../assets/img/en_ico.png"/>
              <img v-else class="each_lan" src="../../assets/img/jp_ico.png"/>
            </div>
            <div class="each_r_con">
               {{sltData.updateTime}}  {{sltData.fileSize}}KB - {{sltData.fileType}}
            </div>
            <div class="slt">      
              <iframe v-if="sltData.fileType!='Other'" width="100%"     frameborder="0" height="100%" src="https://file.keking.cn/onlinePreview?url=https%3A%2F%2Ffile.keking.cn%2Fdemo%2F%E6%9E%97%E7%89%B9%E4%BA%A7%E5%93%81%E7%94%B5%E5%AD%90%E5%95%86%E5%8A%A1%E5%AD%B5%E5%8C%96%E5%AE%9E%E8%AE%AD%E5%B9%B3%E5%8F%B0%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C.pptx&officePreviewType=pdf"></iframe>
              <img v-else src="../../assets/img/slt_empty.png"/>
              </div> 
            <div class="slt_down" @click="down(sltData.fileUrl)"><i class="iconfont icon-Group-"/>点击下载</div>    
        </el-dialog>
        <el-dialog
          title="自定义文件大小"
          :visible.sync="filesizeDialogVisible"
          :close-on-click-modal="false"
          class="diyfilesize"
          >         
             <div class="diy_size_pop">
                  <el-input
                  class="from"
                    placeholder="请输入数值"               
                    v-model="diysizefrom">
                  </el-input>
                  <span class="zhi">至</span>
                  <el-input
                   class="to"
                    placeholder="请输入数值"
                    v-model="diysizeto">
                  </el-input>
                </div>
                <div class="diy_size_pop_button">
                  <div class="clear_size" @click="diysizefrom='';diysizeto=''">清&nbsp;空</div>
                  <div class="submit_size"  @click="submitSize">确&nbsp;定</div>
                </div>
            
        </el-dialog>
    </div>
</template>
<script>
import { advancedSearch, downloadFile, getTerms, filterSearch } from '@/api/es/es-api'
import { getDictEntriesByTypeId } from '@/api/base'
export default {

  data() {
    return {
      restaurants: [],
      keyWords: this.$route.query.search != '' ? this.$route.query.search : '',
      fieldScale: this.$route.query.radio != '' ? this.$route.query.radio : 'ALL',
      docLanguage: this.$route.query.lang != '' ? this.$route.query.lang : 'ALL',
      optionslang: [
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
      // 搜索参数
      search: [
        { keyWords: '' },
        { fieldScale: '' },
        { docLanguage: '' },
        { searchLogId: '' },
        { dataSource: '' },
      ],
      // 过滤参数
      filteritem: [
        { keyWords: this.keyWords },      //搜索
        { fieldScale: '' },    //字段范围
        { docLanguage: '' },   //语言
        { searchLogId: '' },   //查询日志主键
        { dataSource: '' },    //tab服务器
        { docFolderList: [] }, //tree
        { fileTypeList: [] },  //文件类型
        { fileSizeList: [] },  //文件大小
        { modifyTimeKey: '' }, //时间
        { modifyStartTime: '' },//自定义开始时间
        { modifyEndTime: '' },  //自定义结束时间
        { sortItem: [] },      //排序项目——格式为：字段名称+“,”+排序类型，例如“fileSize,desc"
      ],
      sltData: '',
      centerDialogVisible: false,
      filesizeDialogVisible: false,
      activeDataSource: '',
      filetab: [
      ],
      loading: false,

      istree: true,
      ischeck: true,
      isradio: true,
      issize: true,
      isfile: true,
      treeData: [],
      fileTypeAggResult: [
        { id: "Word", name: "Word(0)", count: "0" },
        { id: "Excel", name: "Excel(0)", count: "0" },
        { id: "PowerPoint", name: "PowerPoint(0)", count: "0" },
        { id: "Pdf", name: "Adobe Acrobat PDF(0)", count: "0" },
        { id: "Text", name: "文本类(0)", count: "0" },
        { id: "Image", name: "图像类(0)", count: "0" },
        { id: "zip", name: "压缩类(0)", count: "0" },
        { id: "Media", name: "媒体类(0)", count: "0" },
        { id: "Others", name: "其他类型(0)", count: "0" }],
      filecheckList: [],
      fileUpdateTimeAggResult: [
        { id: "all", name: "全部时间 (0)", count: "0" },
        { id: "1", name: "一天内（0）", count: "0" },
        { id: "7", name: "一周内（0）", count: "0" },
        { id: "30", name: "一月内（0）", count: "0" },
        { id: "188", name: "半年内（0）", count: "0" },
        { id: "365", name: "一年内（0）", count: "0" }
      ],
      radiocheckList: "all",
      radiotime: '',
      fileSizeAggResult: [
        { id: '1', name: '0~500KB(0)', count: '0' },
        { id: '2', name: '500KB~1MB((0)', count: '0' },
        { id: '3', name: '1MB以上(0)', count: '0' }
      ],
      sizecheckList: [],
      diysizefrom: '',
      diysizeto: '',
      isrelativity: false,
      istime: false,
      lancheckList: ["全部语言"],
      results: "",
      // 分页
      pageNo: 1,
      pageSize: 10,
      totalPage: 1,
      totalRecord: 0
      // isCollapse: this.$store.state.falg
    }
  },

  created() {
    console.log(this.dictTypeId)
    console.log(this.$route.query)
  },
  computed: {
    isCollapse() {
      return this.$store.state.falg
    }
  },
  methods: {
    btnSearch() {
      this.loading = true
      this.search.keyWords = this.keyWords
      this.search.fieldScale = this.fieldScale
      this.search.docLanguage = this.docLanguage
      setTimeout(() => this.loading = false, 1000)
      this.advancedSearch(this.search)

    },
    async advancedSearch(item) {
      const res = await advancedSearch({ item })
      if (res && res.success) {
        console.log("搜索结果", res)
        this.results = res.datas.searchResult
        this.treeData = res.datas.folderTreeResult
        this.fileTypeAggResult = res.datas.fileTypeAggResult
        this.fileUpdateTimeAggResult = res.datas.fileUpdateTimeAggResult
        this.fileSizeAggResult = res.datas.fileSizeAggResult
        this.pageNo = res.datas.searchResult.pageNo
        this.pageSize = res.datas.searchResult.pageSize
        this.totalPage = res.datas.searchResult.totalPage
        this.totalRecord = res.datas.searchResult.totalRecord
        this.filetab = []
        for (var i = 0; i < res.datas.folderTreeResult.length; i++) {
          this.filetab.push({
            id: res.datas.folderTreeResult[i].id,
            name: res.datas.folderTreeResult[i].dataSource
          })
        }
        this.getDictEntriesByTypeId(this.filetab)
        // console.log(1111, res.datas.folderTreeResult[2].dataSource)
      }
    },
    async getTerms(queryString) {
      const res = await getTerms({ queryString })
      if (res && res.success) {
        for (var i = 0; i < res.datas.terms.length; i++) {
          this.restaurants.push({
            id: i,
            value: res.datas.terms[i]

          })
        }
      }
    },
    async filterSearch(item) {
      const res = await filterSearch({ item })
      if (res && res.success) {
        // console.log('过滤条件', res)
        this.results = res.datas.searchResult
      }
    },
    async getDictEntriesByTypeId(item) {

      // const res = await getDictEntriesByTypeId({ dictTypeId: item.name })
      const res = await getDictEntriesByTypeId({ dictTypeId: 'ESDataSourceName' })
      if (res && res.success) {
        this.filetab = res.datas.dicts
      }
    },
    querySearch(queryString, cb) {
      this.restaurants = []
      this.getTerms(queryString)
      // 调用 callback 返回建议列表的数据
      cb(this.restaurants);
    },
    // 搜索关键字
    searchWords(value) {
      console.log(value.value);
      // this.filteritem.keyWords = value.value
      // this.filterSearch(this.filteritem)
    },
    //搜索字段位置(文件名、文件内容)
    fileScale(value) {
      // console.log(value)
      this.filteritem.fieldScale = value
      this.filterSearch(this.filteritem)
    },
    //文档语言
    getLang(value) {
      // console.log(value)
      this.filteritem.docLanguage = value
      this.filterSearch(this.filteritem)
    },
    //文件服务器tab
    filetapClick(value) {
      //  console.log(value)
      this.filteritem.dataSource = value
      this.filterSearch(this.filteritem)
    },
    // 选择tree
    docTreeCheck(node, key) {
      // console.log(key.checkedKeys)
      this.filteritem.docFolderList = key.checkedKeys
      this.filterSearch(this.filteritem)
    },
    // 选择文件类型
    fileType(value) {
      // console.log(value)
      this.filteritem.fileTypeList = value
      this.filterSearch(this.filteritem)

    },

    // 选择更新时间
    radioTimeCheck(value) {
      console.log(value)
      console.log(this.radiotime)
      if (value != "自定义时间") {
        this.filteritem.modifyTimeKey = value

      }
    },
    // 选择文件大小
    checkboxChange(val) {
      if (val.includes("自定义大小") && val.length > 1) {
        this.sizecheckList.splice(this.sizecheckList, 1)
      } else {
        this.filteritem.fileSizeList = this.sizecheckList
        this.filterSearch(this.filteritem)
      }

      console.log(val)
    },
    // 自定义开始时间 - 结束时间
    diyTime() {
      this.filteritem.modifyStartTime = this.radiotime[0]
      this.filteritem.modifyEndTime = this.radiotime[1]
      this.filterSearch(this.filteritem)
    },
    //语言复选框
    langCheckbox(val) {
      console.log(val)
    },
    // 排序（相关度、时间）
    relativity(v) {

      this.istime = false
      if (v != 'big') {
        this.filteritem.sortItem = ['relativity', 'small']
      } else {
        this.filteritem.sortItem = ['relativity', 'big']
      }
      this.filterSearch(this.filteritem)
    },
    timeSort(v) {
      this.isrelativity = false
      if (v != 'new') {
        this.filteritem.sortItem = ['timeSort', 'old']
      } else {
        this.filteritem.sortItem = ['timeSort', 'new']
      }
      this.filterSearch(this.filteritem)
    },
    diysize() {
      this.sizecheckList.length = 0
      this.filesizeDialogVisible = true
    },
    submitSize() {
      this.filesizeDialogVisible = false
    },
    closeTree() {

      // var nodes = this.$refs.ProjectTree[1].store.nodesMap;
      // for (var i in nodes) {
      //   nodes[i].expanded = false;
      // }
      // var nodes = this.$refs.ProjectTree
      // for (var i in this.$refs.ProjectTree) {
      //   var item = nodes[i].store.nodesMap
      //   for (var e in nodes[i].store.nodesMap) {
      //     item[e].expanded = bool;
      //   }
      // }

    },

    down(e) {
      console.log("下载路径", e)
      window.location.href = e
    },
    showSLT(item) {
      this.centerDialogVisible = true
      this.sltData = item
    },
    copyUrl(i) {
      document.getElementById('urlcoby' + i).select();
      document.execCommand("copy");
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
  height: calc(100vh - 328px);
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding: 20px 0px 0 30px;
  box-sizing: border-box;
  flex-direction: column;
}
.search_Pagination {
  height: 40px;
  padding: 20px 60px 0 0;
  width: 100%;
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
.title_box {
  width: 100%;
  height: 30px;
  box-shadow: 0px 2px 4px 1px rgba(45, 122, 156, 0.2);
}
.title_box ul {
  display: flex;
  flex-direction: row;
}
.con_box {
  height: calc(100vh - 114px);
  padding: 20px 0 20px 20px;
  box-sizing: border-box;
  overflow: hidden;
}
.left_result {
  height: 100%;
  overflow: auto;
}
.title_box li {
  width: auto;
  height: 30px;
  float: left;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #999999;
  line-height: 30px;
  text-align: center;
  box-shadow: 0px 2px 4px 1px rgba(45, 122, 156, 0.2);
  border-radius: 6px 6px 0px 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  padding: 0 4px;
}
.title_box li.active {
  width: auto;
  /* min-width: 100px; */
  display: inline-table;
  background: #2d7a9c;
  box-shadow: 0px 2px 4px 1px rgba(45, 122, 156, 0.2);
  border-radius: 6px 6px 0px 0px;
  font-family: "微软雅黑";
  color: #ffffff;
}
.result_filter_all .title_box li {
  width: auto;
  height: 30px;
}
.result_filter_all .title_box li.active {
  width: auto;
  /* min-width: 100px; */
  display: inline-table;
  background: #2d7a9c;
  box-shadow: 0px 2px 4px 1px rgba(45, 122, 156, 0.2);
  border-radius: 6px 6px 0px 0px;
  font-family: "微软雅黑";
  color: #ffffff;
}
.search_num {
  height: 20px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.search_num span {
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 19px;
}
.search_num .icon-sousuo2 {
  font-size: 22px;
  line-height: 19px;
  margin-right: 2px;
  margin-left: -2px;
}
.search_num .icon-ai-arrow-down {
  font-size: 12px;
  margin-left: 6px;
  margin-top: 5px;
}
.icon-duomeitiicon- {
  margin-right: 6px;
}
.icon-shijian {
  font-size: 14px;
  margin-right: 6px;
}
.icon-daxiao {
  margin-right: 6px;
}
.icon-ziyuan {
  font-size: 14px;
  margin-right: 6px;
}
.result_header {
  width: 100%;
  height: 40px;
  padding-right: 30px;
  border-bottom: 1px solid #eeeeee;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #666666;
  line-height: 45px;
  display: flex;
  justify-content: space-between;
}
.result_header .result_header_filter span {
  margin-right: 35px;
  cursor: pointer;
}
.result_header span i {
  margin-left: 5px;
}
.pop_btn {
  width: 40px;
  height: 40px;
  float: right;
  background: #2d7a9c;
  border-radius: 50%;
  margin-top: -15px;
  box-shadow: 0px 6px 10px 0px rgba(45, 122, 156, 0.25);
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}
.pop_btn .icon-sousuo2 {
  color: #fff;
  font-size: 28px;
}
.result_main {
  width: 100%;
  min-width: 690px;
  margin-bottom: 10px;
  flex: 1;
  overflow: auto;
}
.result_main_empty {
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
}
.empty_img {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
}
.empty_img img {
  margin-bottom: 30px;
}
.empty_img span {
  font-size: 20px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 32px;
}
.empty_title {
  display: block;
}
.result_main_empty div {
  padding: 0 100px 0 70px;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #666666;
  line-height: 28px;
}

.each_reult {
  padding: 25px 0;
  width: 100%;
  height: auto;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
}
.each_r_top {
  height: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-family: "微软雅黑";
  color: #333333;
}
.each_r_top div {
  height: 20px;
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
  line-height: 28px;
  cursor: pointer;
  min-width: 70px;
}
.each_down i {
  font-size: 18px;
}
.each_r_title {
  margin-top: 15px;
  height: 25px;
  font-size: 24px;
  font-family: "微软雅黑";
  color: #2440b4;
  line-height: 25px;

  text-decoration: underline;
}
.each_r_title span {
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
  margin-top: 20px;
  height: 40px;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.each_r_con_p {
  margin-top: 20px;
  height: 100px;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 20px;
  display: flex;
  align-items: center;
}
.each_r_con_p_img {
  width: 240px;
  height: 100px;
  background: #ffffff;
  border-radius: 4px;
  padding: 5px 33px;
  border: 1px solid #cccccc;
  margin-right: 20px;
}
.each_r_url {
  margin-top: 15px;
  height: 15px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #4a90e2;
  line-height: 15px;
}
.each_r_url span {
  cursor: pointer;
}
.each_r_lable {
  height: auto;
}
.each_r_lable li {
  width: 100px;
  height: 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #cccccc;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #999999;
  line-height: 20px;
  float: left;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  margin-right: 20px;
  margin-top: 15px;
  padding-left: 10px;
}
.each_r_lable .set_label {
  width: 120px;
  height: 24px;
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%);
  border-radius: 12px;
  color: #ffffff;
}
.slt {
  width: 1240px;
  height: 632px;
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
  margin: 20px auto 30px;
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