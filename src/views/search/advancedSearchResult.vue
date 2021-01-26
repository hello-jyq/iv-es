<template>
  <div v-loading="fullscreenLoading" class="result_box">
    <div :class="isCollapse?'result_DIY result_filter_all':'result_DIY result_filter'">
      <div class="title_box">
        <ul>
          <li v-for="(item,index) in filetab" :id="'tab'+index" :key="index" :class="activeDataSource==index?'active':''" :title="item.value" @click="filetapClick(item),activeDataSource=index">
            {{ item.value }}
          </li>
        </ul>
      </div>
      <div class="con_box_search">
        <div class="left_result">
          <!--el-tree严格模式：只能选中当前节点  -->
          <!-- check-strictly="true" -->
          <el-tree
            v-if="refreshFalg&&activeDataSource!=0"
            ref="ProjectTree"
            :data="choseTreeData"
            show-checkbox
            node-key="id"
            :expand-on-click-node="false"
            :default-expanded-keys="expandedKeys"
            :check-on-click-node="true"
            :default-checked-keys="checkedKeys"
            icon-class="iconfont icon-jiantou-copy"
            @check="docTreeCheck"
            @node-expand="docTreeExpand"
            @node-collapse="docTreeExpandClose"
          >
            <template slot-scope="scope">
              <div>
                <div>
                  <!-- <span v-if="scope.data.id !== 50" class="iconfont" :class="scope.data.children || scope.data.type === 'org' ? 'icon-bumenguanli_h' : 'icon-Avatar'" />
                  <span v-else class="iconfont icon-zuzhijiagou" /> -->
                  <span>{{ scope.data.label }}</span><span class="filter_number"><span>{{ scope.data.fileItemCount }}</span><span>/</span><span>{{ scope.data.totalFileItemCount }}</span></span>
                </div>
              </div>
            </template>
          </el-tree>
          <div v-if="activeDataSource!='0'" />
          <div v-if="activeDataSource==0">
            <div class="search_num" @click="isfile=!isfile">
              <i class="iconfont icon-ziyuan" />
              <span>文档语言</span>
              <i class="iconfont icon-ai-arrow-down" :class="isfile?'':'icon_gif'" />
            </div>
            <!-- <el-checkbox-group v-show="isfile" v-model="lancheckList" @change="langCheckbox">
              <el-checkbox label="全部语言" />
              <el-checkbox label="中文" />
              <el-checkbox label="英文" />
              <el-checkbox label="日文" />
            </el-checkbox-group> -->
            <!-- <dict-checkbox v-model="searchParam.params.docLanguageList" dict-type-id="Language" class="light-select" theme="theme" @change="langCheckbox" /> -->
            <el-checkbox-group v-show="isfile" v-model="languageCheckList" @change="language">
              <el-checkbox v-for="type in languageAggResult" :key="type.id" :label="type.id">
                {{ type.name }}
                <template>
                  <span class="filter_number">{{ type.count }}</span>
                </template>
              </el-checkbox>
            </el-checkbox-group>
            <div class="search_num" style="margin-top:30px" @click="ischeck=!ischeck">
              <i class="iconfont icon-duomeitiicon-" />
              <span>文档类型</span>
              <i class="iconfont icon-ai-arrow-down" :class="ischeck?'':'icon_gif'" />
            </div>
            <el-checkbox-group v-show="ischeck" v-model="filecheckList" @change="fileType">
              <el-checkbox v-for="type in fileTypeAggResult" :key="type.id" :label="type.id">
                {{ type.name }}
                <template>
                  <span class="filter_number">{{ type.count }}</span>
                </template>
              </el-checkbox>
            </el-checkbox-group>
            <!-- <dict-checkbox v-model="searchParam.params.fileTypeAggResult" dict-type-id="ESFilterExtent" class="light-select" theme="theme">
              <template slot-scope="scope">
                <div>
                  <div> -->
            <!-- <span v-if="scope.data.id !== 50" class="iconfont" :class="scope.data.children || scope.data.type === 'org' ? 'icon-bumenguanli_h' : 'icon-Avatar'" /> -->
            <!-- <span v-else class="iconfont icon-zuzhijiagou" /> -->
            <!-- <span>（{{ scope.data.count }}）</span>
                  </div>
                </div>
              </template>
            </dict-checkbox> -->

            <div class="search_num" style="margin-top:30px" @click="isradio=!isradio">
              <i class="iconfont icon-shijian" />
              <span>更新时间</span>
              <i class="iconfont icon-ai-arrow-down" :class="isradio?'':'icon_gif'" />
            </div>
            <el-radio-group v-show="isradio" v-model="radiocheckList" @change="radioTimeCheck">
              <el-radio v-for="time in fileUpdateTimeAggResult" :id="time.id" :key="time.id" :label="time.id">
                {{ time.name }}
                <template>
                  <span class="filter_number">{{ time.count }}</span>
                </template>
              </el-radio>
              <el-radio label="自定义时间" />
            </el-radio-group>
            <div v-show="isradio" class="block">
              <el-date-picker
                v-model="radiotime"
                class="diy_time"
                :disabled="radiocheckList==='自定义时间'?false:true"
                popper-class="date_picker"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="diyTime"
              />
            </div>

            <div class="search_num" style="margin-top:30px" @click="issize=!issize">
              <i class="iconfont icon-daxiao" />
              <span>文件大小</span>
              <i class="iconfont icon-ai-arrow-down" :class="issize?'':'icon_gif'" />
            </div>
            <el-checkbox-group v-show="issize" v-model="sizecheckList" @change="checkboxChange">
              <el-checkbox v-for="filesize in fileSizeAggResult" :key="filesize.index" :label="filesize.id">
                {{ filesize.name }}
                <template>
                  <span class="filter_number">{{ filesize.count }}</span>
                </template>
              </el-checkbox>
            </el-checkbox-group>
            <el-checkbox v-show="issize" v-model="sizecheckDIY" class="diycheck" label="自定义大小" @change="checkboxDIYChange(sizecheckDIY),sizecheckDIY=!sizecheckDIY">
              自定义大小
            </el-checkbox>
            <div v-show="issize" class="diy_size">
              <el-input
                v-model="diysizefrom"
                :disabled="sizecheckDIY?false:true"
                class="from"
                placeholder="请输入数值"
                prefix-icon="iconfont icon-daxiao"
                @focus="diysize"
              />
              <span class="zhi">至</span>
              <el-input
                v-model="diysizeto"
                :disabled="sizecheckDIY?false:true"
                class="to"
                placeholder="请输入数值"
                @focus="diysize"
              />
            </div>

            <!-- <div class="search_num" style="margin-top:30px" @click="isfile=!isfile">
              <i class="iconfont icon-ziyuan" />
              <span>文档语言</span>
              <i class="iconfont icon-ai-arrow-down" :class="isfile?'':'icon_gif'" />
            </div> -->
            <!-- <el-checkbox-group v-show="isfile" v-model="lancheckList" @change="langCheckbox">
              <el-checkbox label="全部语言" />
              <el-checkbox label="中文" />
              <el-checkbox label="英文" />
              <el-checkbox label="日文" />
            </el-checkbox-group> -->
            <!-- <dict-checkbox v-model="searchParam.params.docLanguageList" dict-type-id="Language" class="light-select" theme="theme" @change="langCheckbox" /> -->
            <!-- <el-checkbox-group v-show="ischeck" v-model="languageCheckList" @change="language">
              <el-checkbox v-for="type in languageAggResult" :key="type.id" :label="type.id">
                {{ type.name }}
                <template>
                  <span>({{ type.count }})</span>
                </template>
              </el-checkbox>
            </el-checkbox-group> -->
          </div>
        </div>
        <!-- <el-row type="flex" justify="space-around" style="margin-top:20px;margin-right:20px">
              <el-button round icon="iconfont icon-refresh">重置</el-button>
              <el-button type="primary" round icon="iconfont icon-queding">确定</el-button>
            </el-row> -->
      </div>
    </div>
    <div class="container">
      <el-row class="search_box advance_filter_height" :class="{'advance_filter_shadow':isAdvanceFlag}">
        <el-col :span="24">
          <el-autocomplete
            v-model="keyWords"
            ref="searchInput"
            class="inline-input search_input"
            :fetch-suggestions="querySearch"
            placeholder="请输入您想要搜索的内容"
            :maxlength="81"
            :trigger-on-focus="false"
            popper-class="search_input"
            clearable
            @select="searchWords"
          >
            <i slot="prefix" class="iconfont icon-sousuo1" />
            <el-button slot="suffix" @click.stop="btnSearch">
              搜&nbsp;&nbsp;索
            </el-button>
          </el-autocomplete>
        </el-col>
        <el-col :span="24" class="flex_ceter" style="height:24px;line-height:24px">
          <span class="font_size_14 fontC_333">搜索位置：</span>
          <el-radio-group v-model="fieldScale" @change="fileScale">
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
          <el-select v-model="docLanguage" placeholder="选择语言" placement="top-end" popper-class="lang_select" @change="getLang">
            <el-option
              v-for="item in optionslang"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span class="font_size_14 fontC_333" style="margin-left:20px">搜索方式：</span>
          <el-select v-model="fuzzySearchDiv" placeholder="请选择" placement="top-end" popper-class="lang_select" @change="getFuzzy">
            <el-option
              v-for="item in searchOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <div class="advance_filter">
          <transition name="el-zoom-in-top">
            <el-row v-show="isAdvanceFlag">
              <div class="reset_filter_btn">
                <span @click="resetFilterClick()"><i class="iconfont icon-shuaxin" />重置</span>
              </div>
              <div class="search_params_item">
                <span><i class="iconfont icon-sousuoguanjianci" />搜索关键字：</span>
                <el-input v-model="advanceparams.allKeyWords" placeholder="请输入内容">
                  <template slot="prepend">
                    包含全部关键词
                  </template>
                </el-input>
                <el-input v-model="advanceparams.arbitraryWords" placeholder="请输入内容">
                  <template slot="prepend">
                    包含任意关键词
                  </template>
                </el-input>
                <el-input v-model="advanceparams.notIncludeKeyWords" placeholder="请输入内容">
                  <template slot="prepend">
                    不包含关键词
                  </template>
                </el-input>
              </div>
              <div class="search_params_item">
                <span><i class="iconfont icon-shijian" />更新时间：</span>
                <el-radio-group v-model="advanceparams.radioTime">
                  <el-radio v-for="time in radioTimeList" :key="time.id" :label="time.id">
                    {{ time.name }}
                  </el-radio>
                </el-radio-group>
                <el-date-picker
                  v-model="advanceparams.radioDiyTime"
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
              <div class="search_params_item">
                <span><i class="iconfont icon-duomeitiicon-" />文档类型：</span>
                <el-checkbox-group v-model="advanceparams.fileType">
                  <el-checkbox v-for="type in checkboxFileTypeList" :key="type.index" :label="type.id">
                    {{ type.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="search_params_item">
                <span><i class="iconfont icon-daxiao" />文件大小：</span>
                <el-checkbox-group v-model="advanceparams.fileSize">
                  <el-checkbox v-for="type in checkboxFileSizeList" :key="type.index" :label="type.id">
                    {{ type.name }}
                  </el-checkbox>
                </el-checkbox-group>
                <div class="diy_filesize">
                  <el-input
                    v-model="advanceparams.diysizefrom"
                    class="from"
                    placeholder="请输入数值"
                    prefix-icon="iconfont icon-daxiao"
                  />
                  <span class="zhi">至</span>
                  <el-input
                    v-model="advanceparams.diysizeto"
                    class="to"
                    placeholder="请输入数值"
                    prefix-icon="iconfont icon-daxiao"
                  />
                </div>
              </div>
              <div class="search_params_item">
                <span><i class="iconfont icon-mulu" />在指定目录中搜索：</span>
                <el-input v-model="advanceparams.dataSourceSearch" placeholder="请输入内容" class="input-with-select">
                  <el-select slot="prepend" v-model="advanceparams.dataSource" class="item_select" placeholder="请选择">
                    <el-option v-for="item in dataSourceSelectList" :key="item.index" :label="item.name" :value="item.id" />
                  </el-select>
                </el-input>
              </div>
              <div class="search_params_item">
                <span><i class="iconfont icon-paixu" />排序方式：</span>
                <el-radio-group v-model="advanceparams.radioSort">
                  <el-radio v-for="time in radioSortList" :key="time.id" :label="time.id">
                    {{ time.name }}
                  </el-radio>
                </el-radio-group>
              </div>
            </el-row>
          </transition>
          <div class="put_filter">
            <span @click="putFilterClick()"><i :class="isAdvanceFlag?'iconfont icon-open-copy':'iconfont icon-open'" />{{ isAdvanceFlag?'收起选择搜索条件条件':'展开重新选择搜索条件' }}</span>
          </div>
        </div>
      </el-row>

      <div v-loading="loading" class="main_box">
        <div class="result_header">
          <span>找到{{ searchParam.totalRecord }}条结果(用时{{ timeTaken }})</span>
          <div class="result_header_filter">
            结果排序：<span class="result_header_filter_box">
              相关度<span class="result_header_filter_flex">
                <i class="iconfont icon-jiantouarrow492" :class="isRelativitySortActiveTop?'icon_active':'icon_def'" @click="relativityTop()" /><i class="iconfont icon-jiantouarrow492-copy" :class="isRelativitySortActiveBottom?'icon_active':'icon_def'" @click="relativityBottom()" />
              </span>
            </span>
            <span class="result_header_filter_box">
              时间<span class="result_header_filter_flex">
                <i class="iconfont icon-jiantouarrow492" :class="isTimeSortTop?'icon_active':'icon_def'" @click="timeSortTop()" /><i class="iconfont icon-jiantouarrow492-copy" :class="isTimeSortBottom?'icon_active':'icon_def'" @click="timeSortBottom()" />
              </span>
            </span>
            <div class="pop_btn" @click="showAdvanceSearch()">
              <i class="iconfont icon-sousuo2" />
            </div>
            <transition name="el-zoom-in-top">
              <div v-show="isAdvanceSearch" class="pop_advance">
                <ul>
                  <li v-for="(title,index) in ['热词搜索','个人标签搜索','主题搜索']" :key="title.index" :class="pop_advance_active==index?'pop_advance_active':''" @click="pop_advance_active=index">
                    {{ title }}
                  </li>
                </ul>
                <div v-for="(item,index) in 3" :key="item.index" :class="pop_advance_active==index?'show':''" class="pop_advance_main">
                  <template v-if="index==0">
                    <div class="keywords_box">
                      <ul>
                        <li v-for="key in pop_advanceOBJ.keyWordsList" :key="key.index" @click="getKeyWords(key)">
                          {{ key }}
                        </li>
                      </ul>
                    </div>
                  </template>
                  <template v-else-if="index==1">
                    <div class="personlabel_box">
                      <ul>
                        <li v-for="label in pop_advanceOBJ.personLabelList" :key="label.index" :class="label.active?'personlabel_box_li-active':''" @click="getLabel(label.name)">
                          <i class="iconfont icon-label" />{{ label.name }}
                          <div class="count">
                            {{ label.count }}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </template>
                  <template v-else>
                    <div class="theme_search_item">
                      <template v-for="theme in pop_advanceOBJ.themeList.theme_options_values">
                        <el-cascader :key="theme.index" :placeholder="theme" :options="pop_advanceOBJ.themeList.theme_options" class="theme_search_input" :show-all-levels="false" popper-class="theme_search" @change="getThemeValue">
                          <template slot-scope="{data }">
                            {{ data.label }}
                            <span class="theme_count">
                              {{ data.count }}
                            </span>
                          </template>
                        </el-cascader>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div v-if="results.length>0" ref="scrollbox" class="result_main">
          <div v-for="(item,index) in results" :key="item.id" class="each_reult">
            <div class="each_r_top">
              <div class="each_r_top_left">
                <span><i class="iconfont icon-wenjianjia" />{{ item.dataSource }}</span>
                <div class="each_m" :title="item.filePath">
                  <i class="iconfont icon-wendang" />{{ item.filePath }}
                </div>
                <span v-if="item.updateBy != ''"><i class="iconfont icon-wode" />{{ item.updateBy }}</span>
                <span v-else-if="item.updateBy == '' && item.createBy != ''"><i class="iconfont icon-wode" />{{ item.createBy }}</span>
              </div>
              <span class="each_down" @click="download(item.fileUrl,item.id)">
                <i class="iconfont  icon-Group-" />点击下载
              </span>
            </div>
            <div class="each_r_title" :title="item.fileName">
              <img v-if="item.fileType=='Excel'" src="../../assets/img/filetype/excel.png">
              <img v-else-if="item.fileType=='Word'" src="../../assets/img/filetype/word.png">
              <img v-else-if="item.fileType=='PowerPoint'" src="../../assets/img/filetype/PPT.png">
              <img v-else-if="item.fileType=='Pdf'" src="../../assets/img/filetype/PDF.png">
              <img v-else-if="item.fileType=='Text'" src="../../assets/img/filetype/TXT.png">
              <img v-else-if="item.fileType=='Image'" src="../../assets/img/filetype/img.png">
              <img v-else-if="item.fileType=='zip'" src="../../assets/img/filetype/excel.png">
              <img v-else-if="item.fileType=='Media'" src="../../assets/img/filetype/other.png">
              <img v-else src="../../assets/img/filetype/other.png">
              <span @click.stop="showSLT(item)" v-html="item.fileName" />
              <img v-if="item.language=='CN'" class="each_lan" src="../../assets/img/cn_ico.png">
              <img v-else-if="item.language=='EN'" class="each_lan" src="../../assets/img/en_ico.png">
              <img v-else-if="item.language=='JP'" class="each_lan" src="../../assets/img/jp_ico.png">
              <img v-else class="each_lan" src="../../assets/img/other2.png">
            </div>
            <div class="each_r_con">
              {{ item.updateTime }} {{ item.fileSizeDescription }}KB - {{ item.fileType }}
            </div>
            <div class="each_r_des">
              <span v-html="item.fileContentOutline" />
            </div>
            <div id="eachurl" class="each_r_url">
              <div class="each_r_url_left" :title="item.fileDirectory">
                {{ item.fileDirectory }}
              </div> -
              <el-popover
                placement="right"
                width="200"
                trigger="click"
                content="复制成功"
                popper-class="coby"
              >
                <span slot="reference" @click="copyUrl(index)">点击可复制路径</span>
              </el-popover>
              <input :id="'urlcoby'+index" type="text" :value="item.fileDirectory" style="opacity: 0">
            </div>
            <!-- 本次开发不需要 -->
            <div class="each_r_lable">
              <ul>
                <li v-for="label in item.myLabel"><i class="iconfont icon-label" />{{label.name}}</li>
                <li class="set_label" @click="setLabel(item)">
                  <i class="iconfont icon-label" />设置个人标签
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else class="result_main_empty">
          <div class="empty_img">
            <img src="../../assets/img/result_empty.png">
            <span>抱歉，没有找到符合条件的内容</span>
            <span>您可以简化或缩短关键词再进行搜索</span>
          </div>
          <!-- <div>
            <span class="empty_title">未搜索到结果的原因为： </span>
            <span>未搜索到结果的原因有多种，关键词太繁杂，可以试着删除一些；未搜索到结果的原因有多种，关键词太繁杂，可以试着删除一些；未搜索到结果的原因有多种，关键词太繁杂，可以试着删除一些；未搜索到结果的原因有多种，关键词太繁杂，可以试着删除一些。</span>
          </div> -->
        </div>
      </div>
      <div v-show="results!=''" class="pagination-box">
        <el-pagination
          :current-page.sync="searchParam.pageNo"
          :page-size="searchParam.pageSize"
          :page-sizes="[10, 20]"
          layout="total, sizes"
          :total="searchParam.totalRecord"
          class="page-left"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <el-pagination
          :current-page.sync="searchParam.pageNo"
          background
          :page-size="searchParam.pageSize"
          :page-sizes="[10, 20]"
          layout=" pager, next,slot"
          :total="searchParam.totalRecord"
          class="pagination_right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <button type="button" class="last-pager" @click="toLastPage">
            <i class="iconfont icon-Group-1" />
          </button>
        </el-pagination>
        <el-pagination
          :current-page.sync="searchParam.pageNo"
          background
          :page-size="searchParam.pageSize"
          :page-sizes="[10, 20]"
          layout="slot, prev"
          :total="searchParam.totalRecord"
          class="pagination_right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <button type="button" class="first-pager" @click="toFirstPage">
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
    <el-dialog
      title="自定义文件大小"
      :visible.sync="filesizeDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      class="diyfilesize"
      @close="closeDiyFileSizeDialog"
    >
      <div class="diy_size_pop">
        <el-input
          v-model="diysizefrom"
          class="from"
          placeholder="请输入数值"
        />
        <span class="fileszieDiyfromerror">{{ diysizefrommessage }}</span>
        <span class="zhi">至</span>
        <el-input
          v-model="diysizeto"
          class="to"
          placeholder="请输入数值"
        />
        <span class="fileszieDiytoerror">{{ diysizetomessage }}</span>
        <span class="kb">KB</span>
      </div>
      <div class="diy_size_pop_button">
        <div class="clear_size" @click="diysizefrom='';diysizeto=''">
          清&nbsp;空
        </div>
        <button class="submit_size" :disabled="diysizefrom&&diysizeto&&diysizefrommessage==''&&diysizetomessage==''?false:true" @click="submitSize">
          确&nbsp;定
        </button>
      </div>
    </el-dialog>
    <el-dialog
      title="个人标签设置"
      :visible.sync="personLabelDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      class="person_label_dialog"
    >
      <div class="labelD_title">
        <span>请在以下的标签中选择您想要的标签</span>
      </div>
      <div class="has_Label_list">
        <ul>
          <li v-for="list in hasSetLabelList" :id="'animation_'+list.id" :key="list.index" @click="personLabelRemoveClick(list)">
            <i class="iconfont icon-label" /> {{ list.name }}
          </li>
        </ul>
      </div>
      <br>
      <div class="person_Label_list">
        <ul>
          <li v-for="list in personlabelList" :id="'animation_'+list.id" :key="list.index" @click="personLabelAddClick(list)">
            <i class="iconfont icon-label" /> {{ list.name }}
          </li>
        </ul>
      </div>
      <div class="set_new_label">
        <span>添加新标签:</span>
        <el-input v-model="newLabelValue" placeholder="请输入新的标签内容" />
        <button class="set_new_label_btn" @click="setNewLabel">
          添&nbsp;加
        </button>
      </div>
      <div class="diy_size_pop_button">
        <div class="clear_size" @click="personLabelDialogVisible=false">
          取&nbsp;消
        </div>
        <button class="submit_size">
          设&nbsp;置
        </button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import { permission } from '@/mixins/permission-mixin'
import { normalSearch, downloadFile, getTerms, filterSearch } from '@/api/es/es-api'
import $ from 'jquery'
// import DictCheckbox from '../../components/DictCheckbox.vue'
// import { getDictEntriesByTypeId } from '@/api/base'

export default {
  components: {
  },
  // filters: {
  //   // 当标题字数超出时，超出部分显示’...‘。此处限制超出8位即触发隐藏效果
  //   ellipsis(value) {
  //     if (!value) return ''
  //     if (value.length > 50) {
  //       return value.slice(0, 50) + '...'
  //     }
  //     return value
  //   }
  // },
  mixins: [search, permission],

  data() {
    return {
      refreshFalg: true,
      restaurants: [],
      // keyWords: '',
      keyWords: this.$route.params.search !== '' ? this.$route.params.search : '',
      fieldScale: this.$route.params.radio !== '' ? this.$route.params.radio : 'ALL',
      docLanguage: this.$route.params.lang !== '' ? this.$route.params.lang : 'ALL',
      fuzzySearchDiv: this.$route.params.fuzzy !== '' ? this.$route.params.fuzzy : '0',
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
      // 搜索参数
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          keyWords: '',
          fieldScale: 'ALL',
          docLanguage: 'ALL',
          searchLogId: '',
          currentDataSource: '',
          docLanguageList: [],
          docFolderList: {},
          fileTypeList: [],
          fileSizeList: [],
          modifyTimeKey: '',
          modifyStartTime: '',
          modifyEndTime: '',
          language: 'cn',
          fuzzySearchDiv: '0',
          searchTarget: [],
          fileNameBoost: '1',
          fileContentBoost: '1',
          fileExtent: [],
          fileSizeFrom: '',
          fileSizeTo: '',
          sortItem: ['_score,desc'],
          fileSize: [],
          fileUpdateTime: [],
          filePath: [],
          languageList: [],
          otherDataSources: [],
          allCheckedNodes: []
        }
      },
      sltData: '',
      centerDialogVisible: false,
      filesizeDialogVisible: false,
      activeDataSource: 0,
      acticeName: '',
      filetab: [
      ],
      loading: false,
      fullscreenLoading: false,
      ischeck: true,
      isradio: true,
      issize: true,
      isfile: true,
      treeData: [],
      choseTreeData: [],
      expandedKeys: [],
      allexpandedKeys: [],
      dataCheckedList: {},
      dataexpandedKeysList: {},
      tabItem: '',
      tabLength: '',
      fileTypeAggResult: [
        // { id: 'Word', name: 'Word(0)', count: '0' },
        // { id: 'Excel', name: 'Excel(0)', count: '0' },
        // { id: 'PowerPoint', name: 'PowerPoint(0)', count: '0' },
        // { id: 'Pdf', name: 'Adobe Acrobat PDF(0)', count: '0' },
        // { id: 'Text', name: '文本类(0)', count: '0' },
        // { id: 'Image', name: '图像类(0)', count: '0' },
        // { id: 'zip', name: '压缩类(0)', count: '0' },
        // { id: 'Media', name: '媒体类(0)', count: '0' },
        // { id: 'Others', name: '其他类型(0)', count: '0' }
      ],
      filecheckList: [],
      languageCheckList: [],
      sizecheckDIY: false,
      fileUpdateTimeAggResult: [
        // { id: 'all', name: '全部时间 (0)', count: '0' },
        // { id: '1', name: '一天内（0）', count: '0' },
        // { id: '7', name: '一周内（0）', count: '0' },
        // { id: '30', name: '一月内（0）', count: '0' },
        // { id: '188', name: '半年内（0）', count: '0' },
        // { id: '365', name: '一年内（0）', count: '0' }
      ],
      radiocheckList: '0',
      radiotime: '',
      fileSizeAggResult: [
        // { id: '1', name: '0~500KB(0)', count: '0' },
        // { id: '2', name: '500KB~1MB((0)', count: '0' },
        // { id: '3', name: '1MB以上(0)', count: '0' }
      ],
      sizecheckList: [],
      checkedKeys: [],
      diysizefrom: '',
      diysizeto: '',
      diysizefrommessage: '',
      diysizetomessage: '',
      isTimeSortTop: false,
      isTimeSortBottom: false,
      isRelativitySortActiveTop: false,
      isRelativitySortActiveBottom: true,
      lancheckList: ['全部语言'],
      results: '',
      // 分页
      // pageNo: 1,
      // pageSize: 10,
      // totalPage: 1,
      totalRecord: 0,
      searchLogId: '',
      selectedFolder: [],
      kkfileviewurl: '',
      timeTaken: '',
      languageAggResult: [],
      otherDataSources: [],
      checkCount: 0,
      sessionCheckedNodes: [],
      allCheckedNodes: [],
      sltLoading: true,
      // isCollapse: this.$store.state.falg
      // 高级检索条件
      // isAdvanceDOM: this.$route.query.advance == 0,
      isAdvanceFlag: false,
      personLabelDialogVisible: false,
      isAdvanceSearch: false,
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
      advanceparams: {
        allKeyWords: '',
        arbitraryWords: '',
        notIncludeKeyWords: '',
        radioTime: 'ALL',
        radioDiyTime: '',
        fileType: ['Word'],
        fileSize: ['1'],
        diysizefrom: '',
        diysizeto: '',
        dataSource: '1',
        dataSourceSearch: '',
        radioSort: 'relativity'
      },
      hasSetLabelList: [{ id: '1', name: '电子商务' }, { id: '2', name: '网络推广' }, { id: '3', name: '报表合同' }],
      personlabelList: [{ id: '11', name: '电子商务' }, { id: '22', name: '网络推广' }, { id: '33', name: '报表合同' }, { id: '44', name: '网络推广' }, { id: '55', name: '报表合同' }, { id: '66', name: '网络推广一二' }, { id: '77', name: '网络推广' }, { id: '88', name: '网络推广三四' }, { id: '99', name: '网络推广' }, { id: '100', name: '网络推广' }],
      newLabelValue: '',
      pop_advance_active: 0,
      pop_advanceOBJ: {
        keyWordsList: ['neuron仕楼', 'neuron設計書', 'neuron営業資', 'active directory neuron', 'elasticsearch neuron', '導入" neuron', 'active directory neuron', 'elasticsearch neuron', '導入" neuron', '導入 neuron', 'neuron導入', 'active directory neuron', 'elasticsearch neuron', 'neuron営業資', 'neuron設計書', 'neuron営業資', 'neuron設計書', 'neuron営業資', 'active directory neuron', 'elasticsearch neuron'],
        personLabelList: [
          { active: false, name: '电子商务', count: '239' },
          { active: false, name: '网络推广', count: '239' },
          { active: false, name: '网络推广', count: '239' },
          { active: true, name: '电子商务电子', count: '23' },
          { active: true, name: '网络推广', count: '23' },
          { active: false, name: '电子商务电子', count: '23' },
          { active: false, name: '报合同', count: '239' },
          { active: true, name: '上午', count: '239' },
          { active: false, name: '网络推广', count: '239' },
          { active: true, name: '网络推广', count: '239' },
          { active: false, name: '商务', count: '239' },
          { active: false, name: '网络推广', count: '239' },
          { active: true, name: '又要推广', count: '239' },
          { active: false, name: '网络推广', count: '239' },
          { active: false, name: '网络推广', count: '239' }
        ],
        themeList: {
          theme_options_values: ['合同', '组件', '资源', '组件', '资源1', '组件2', '资源4'],
          theme_options: [
            {
              value: 'zhinan',
              label: '指南',
              children: [{
                value: 'shejiyuanze',
                label: '设计原则',
                count: 239
              }, {
                value: 'daohang',
                label: '导航',
                count: 239
              }]
            },
            {
              value: 'zujian',
              label: '组件',
              children: [{
                value: 'basic',
                label: 'Basic',
                count: 239
              }, {
                value: 'form',
                label: 'Form',
                count: 239
              }, {
                value: 'data',
                label: 'Data',
                count: 239
              }, {
                value: 'notice',
                label: 'Notice',
                count: 239
              }, {
                value: 'navigation',
                label: 'Navigation',
                count: 239
              }, {
                value: 'others',
                label: 'Others',
                count: 239
              }]
            },
            {
              value: 'ziyuan',
              label: '资源',
              children: [{
                value: 'axure',
                label: 'Axure Components',
                count: 239
              }, {
                value: 'sketch',
                label: 'Sketch Templates',
                count: 239
              }, {
                value: 'jiaohu',
                label: '组件交互文档',
                count: 239
              }]
            }]
        }
      },
      elLeft: 0, // 当前点击购物车按钮在网页中的绝对top值
      elTop: 0 // 当前点击购物车按钮在网页中的绝对left值
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.falg
    }
    // diysizefrommessage() {
    //   let errormessagefrom = ''
    //   const reg = /^\+?[1-9]\d*$/
    //   if (this.diysizefrom) {
    //     if (!reg.test(this.diysizefrom)) {
    //       errormessagefrom = '请输入大于0的正整数'
    //     } else if (this.diysizefrom > this.diysizeto && this.diysizeto) {
    //       errormessagefrom = '请输入小于' + this.diysizeto + '的正整数'
    //     }
    //   }
    //   return errormessagefrom
    // },
    // diysizetomessage() {
    //   let errormessageto = ''
    //   const reg = /^\+?[1-9]\d*$/
    //   if (this.diysizeto) {
    //     if (!reg.test(this.diysizeto)) {
    //       errormessageto = '请输入大于0的正整数'
    //     } else if (this.diysizefrom > this.diysizeto && this.diysizefrom) {
    //       errormessageto = '请输入大于' + this.diysizefrom + '的正整数'
    //     }
    //   }
    //   return errormessageto
    // }
  },
  watch: {
    results: {
      handler: function (newVal, oldVal) { },
      deep: true
    },
    keyWords(newVal, oldVal) {
      if (newVal.length > 80) {
        this.$message({
          message: '被搜索的关键字被限制在80个字符以内，请调整重新输入！',
          type: 'warning'
        })
        return false
      }
    },
    diysizefrom(newVal, oldVal) {
      const reg = /^\+?[1-9]\d*$/
      if (newVal !== '') {
        this.diysizefrommessage = ''
        if (!reg.test(newVal)) {
          this.diysizefrommessage = '请输入大于0的正整数'
        } else {
          if (Number(newVal) > Number(this.diysizeto) && this.diysizeto !== '') {
            this.diysizefrommessage = '请输入小于' + this.diysizeto + '的正整数'
          } else if (Number(newVal) < Number(this.diysizeto) && this.diysizeto !== '') {
            this.diysizetomessage = ''
          } else {
            this.diysizefrommessage = ''
          }
        }
        if (newVal.length > 11) {
          this.diysizefrommessage = '输入位数请限制在11位以内'
        }
      } else if (newVal === '') {
        this.diysizefrommessage = '请输入大于0的正整数'
      }
    },
    diysizeto(newVal, oldVal) {
      const reg = /^\+?[1-9]\d*$/
      if (newVal !== '') {
        this.diysizetomessage = ''
        if (!reg.test(newVal)) {
          this.diysizetomessage = ''
        } else {
          if (Number(this.diysizefrom) > Number(newVal) && this.diysizefrom !== '') {
            this.diysizetomessage = '请输入大于' + this.diysizefrom + '的正整数'
          } else if (Number(this.diysizefrom) < Number(newVal) && this.diysizefrom !== '') {
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
    },
    $route(to, from) {
      console.log(111111111111, to)
    }
  },
  created() {
    console.log(this.dictTypeId)
    console.log(this.$route.params)
    const search = this.$route.params.search !== '' ? this.$route.params.search : ''
    const radio = this.$route.params.radio !== '' ? this.$route.params.radio : ''
    const lang = this.$route.params.lang !== '' ? this.$route.params.lang : ''
    const fuzzy = this.$route.params.fuzzy !== '' ? this.$route.params.fuzzy : ''
    this.searchParam.params.keyWords = search
    this.searchParam.params.fieldScale = radio
    this.searchParam.params.docLanguage = lang
    this.searchParam.params.fuzzySearchDiv = fuzzy
    this.keyWords = search
    this.loading = true
    this.sltLoading = true
    this.normalSearch()
    this.$nextTick(() => {
      this.$refs.searchInput.focus()
    })
  },
  mounted() {
    // this.$nextTick(() => {
    //   const iframe = this.$refs.kkfileviewIframe
    //   console.log(iframe)
    //   // IE和非IE浏览器，监听iframe加载事件不一样，需要兼容
    //   const that = this
    //   if (iframe.attachEvent) {
    //   // IE
    //     iframe.attachEvent('onload', () => {
    //       that.stateChange()
    //     })
    //   } else {
    //   // 非IE
    //     iframe.onload = function() {
    //       that.stateChange()
    //     }
    //   }
    // })
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
  updated() {
    this.$nextTick(() => {
      this.sltLoading = false
    })
  },
  methods: {
    btnSearch() {
      if (this.keyWords) {
        this.loading = true
        if (this.$refs.ProjectTree) {
          this.$refs.ProjectTree.setCheckedKeys([])
        }
        this.activeDataSource = 0
        this.fullscreenLoading = true
        this.checkedKeys = []
        this.filecheckList = []
        this.sizecheckList = []
        this.radiocheckList = '0'
        this.languageCheckList = []
        this.searchParam.params.fileTypeList = []
        this.searchParam.params.modifyTimeKey = ''
        this.searchParam.params.modifyStartTime = ''
        this.searchParam.params.modifyEndTime = ''
        this.searchParam.params.fileSize = []
        this.searchParam.params.fileSizeList = []
        this.searchParam.params.fileSizeFrom = ''
        this.searchParam.params.fileSizeTo = ''
        this.searchParam.params.docLanguageList = []
        this.searchParam.params.docFolderList = {}
        // this.searchParam.params.fuzzySearchDiv = '0'
        // 重置排序
        this.searchParam.params.sortItem = ['_score,desc']
        this.isRelativitySortActiveTop = false
        this.isRelativitySortActiveBottom = true
        this.isTimeSortTop = false
        this.isTimeSortBottom = false

        this.searchParam.params.keyWords = this.keyWords
        this.searchParam.pageNo = 1
        this.dataCheckedList = {}
        this.radiotime = ''
        this.sizecheckDIY = false
        this.diysizefrom = ''
        this.diysizeto = ''
        this.normalSearch()
        this.tabLength = this.filetab.length
      } else {
        this.$message({
          message: '请输入搜索内容！',
          type: 'warning'
        })
      }
      document.getElementsByClassName('el-autocomplete-suggestion')[0].style.display = 'none'
    },
    async normalSearch() {
      const res = await normalSearch(this.searchParam)
      if (res && res.success) {
        const resultscrollbox = this.$refs.scrollbox
        if (resultscrollbox) {
          resultscrollbox.scrollTop = 0
        }
        console.log('搜索结果', res)
        // this.$refs.ProjectTree.setCheckedKeys([])
        this.results = res.datas.searchResult.results
        // this.treeData = res.datas.folderTreeResult
        this.fileTypeAggResult = res.datas.fileTypeAggResult
        this.fileUpdateTimeAggResult = res.datas.fileUpdateTimeAggResult
        this.languageAggResult = res.datas.languageAggResult
        this.fileSizeAggResult = res.datas.fileSizeAggResult
        this.searchParam.pageNo = res.datas.searchResult.pageNo
        this.searchParam.pageSize = res.datas.searchResult.pageSize
        this.searchParam.totalPage = res.datas.searchResult.totalPage
        this.searchParam.totalRecord = res.datas.searchResult.totalRecord
        this.searchLogId = res.datas.searchLogId
        this.timeTaken = res.datas.timeTaken
        console.log(1111, res.datas.searchResult.results)
        this.filetab = [{ id: 'fixed', dataSource: '', value: '搜索结果' }]
        const groupTree = {}
        for (var i = 0; i < res.datas.folderTreeResult.length; i++) {
          var key = res.datas.folderTreeResult[i].dataSource
          groupTree[key] = groupTree[key] || (groupTree[key] = [])
          groupTree[key].push(res.datas.folderTreeResult[i])
        }
        const allTree = []
        allTree.push(...Object.values(groupTree))
        this.treeData = allTree
        this.allexpandedKeys = res.datas.folderTreeResultExpandedKeys
        for (let i = 0; i < allTree.length; i++) {
          if (allTree[i].length > 0) {
            this.filetab.push({
              id: allTree[i][0].id,
              value: allTree[i][0].dataSourceName,
              dataSource: allTree[i][0].dataSource
            })
          }
        }
        this.loading = false
        this.fullscreenLoading = false
      } else {
        this.loading = false
        this.fullscreenLoading = false
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
    async filterSearch(item) {
      const res = await filterSearch({ item })
      if (res && res.success) {
        // console.log('过滤条件', res)
        this.results = res.datas.searchResult.results
      }
    },
    // async getDictEntriesByTypeId(item) {
    //   // const res = await getDictEntriesByTypeId({ dictTypeId: item.name })
    //   const res = await getDictEntriesByTypeId({ dictTypeId: 'ESDataSourceName' })
    //   if (res && res.success) {
    //     this.filetab = res.datas.dicts
    //     let fixedTap = { dictId: 'fixed', dictName: '搜索结果表' }
    //     this.filetab.unshift(fixedTap);
    //     console.log(this.filetab)
    //   }
    // },
    querySearch(queryString, cb) {
      this.restaurants = []
      this.getTerms(queryString)
      // 调用 callback 返回建议列表的数据
      cb(this.restaurants)
    },
    // 搜索关键字
    searchWords(value) {
      console.log(value.value)
      // this.filteritem.keyWords = value.value
      // this.filterSearch(this.filteritem)
    },
    // 搜索字段位置(文件名、文件内容)
    fileScale(value) {
      // console.log(value)
      this.searchParam.params.fieldScale = value
      // this.normalSearch(this.searchParam)
      // this.filteritem.fieldScale = value
      // this.filterSearch(this.filteritem)
    },
    // 文档语言
    getLang(value) {
      // console.log(value)
      // this.filteritem.docLanguage = value
      // this.filterSearch(this.filteritem)
      this.searchParam.params.docLanguage = value
      // this.normalSearch(this.searchParam)
    },
    getFuzzy(value) {
      // console.log(value)
      // this.filteritem.docLanguage = value
      // this.filterSearch(this.filteritem)
      this.searchParam.params.fuzzySearchDiv = value
      // this.normalSearch(this.searchParam)
    },
    // 文件服务器tab
    filetapClick(obj) {
      this.acticeName = obj.dataSource
      this.tabItem = obj
      if (this.treeData.length >= 1) {
        this.choseTreeData = []
        for (let i = 0; i < this.treeData.length; i++) {
          if (this.treeData[i][0].dataSource === obj.dataSource) {
            this.choseTreeData = this.treeData[i]
          }
        }
      }
      // 展开
      const datatreeexpandedKeys = this.dataexpandedKeysList['expanded' + obj.dataSource]
      for (let i = 0; i < this.allexpandedKeys.length; i++) {
        if (this.allexpandedKeys[i].dataSource === obj.dataSource) {
          this.$nextTick(() => {
            this.expandedKeys = this.allexpandedKeys[i].expandedKeys
            // this.dataCheckedList['expanded' + index] = this.expandedKeys
          })
        }
      }
      if (datatreeexpandedKeys) {
        this.$nextTick(() => {
          this.expandedKeys = datatreeexpandedKeys
        })
      }
      // 勾选
      const datatreechecked = this.dataCheckedList['checked' + obj.dataSource]
      if (datatreechecked !== '') {
        this.$nextTick(() => {
          this.checkedKeys = datatreechecked
        })
      }
      this.searchParam.params.currentDataSource = obj.dataSource
      this.searchParam.params.docFolderList
      const currentDataSource = this.searchParam.params.currentDataSource
      this.otherDataSources = []
      this.filetab.forEach(item => {
        if (item.dataSource) {
          if (item.dataSource !== currentDataSource) {
            this.otherDataSources.push(item.dataSource)
          }
        }
      })
      // this.filteritem.dataSource = value
      // this.filterSearch(this.filteritem)
      // console.log(3333, this.treeData.id)
      this.searchParam.params.searchLogId = this.searchLogId
      // this.searchParam.params.docFolderList = this.selectedFolder
      this.searchParam.params.otherDataSources = this.otherDataSources
      // const sessointreechecked = JSON.parse(sessionStorage.getItem('checked' + index))
    },
    // 选择tree
    docTreeCheck(a, b) {
      // console.log(1111111111111, a)
      // console.log(2222222222222, b)
      // console.log(this.$refs.ProjectTree.getCheckedNodes())
      this.loading = true
      this.fullscreenLoading = true
      this.selectedFolder = []
      // this.$refs.ProjectTree.getCheckedNodes().forEach(item => {
      //   this.selectedFolder.push(item.dataSource + '/' + item.realPath)
      // })
      this.searchParam.params.searchLogId = this.searchLogId
      // this.searchParam.params.docFolderList = this.selectedFolder
      if (b.checkedKeys) {
        this.dataCheckedList['checked' + this.acticeName] = b.checkedKeys
      }
      this.searchParam.params.docFolderList = this.dataCheckedList
      // this.allCheckedNodes.forEach(item => {
      //   this.selectedFolder.push(item.dataSource + '/' + item.realPath)
      // })
      // this.searchParam.params.docFolderList = this.selectedFolder
      // 树重新渲染
      // this.refreshFalg = false
      // this.normalSearch().then(() => {
      //   this.refreshFalg = true

      // })
      // .then(() => {
      //   console.log(this.filetab.length ,this.tabLength)
      //   if(this.filetab.length < this.tabLength){
      //     document.getElementById('tab'+0).click()}

      // })
    },
    // 展开节点
    docTreeExpand(obj, node, dom) {
      this.expandedKeys.push(obj.id)
      this.dataexpandedKeysList['expanded' + this.acticeName] = this.expandedKeys
    },
    // 关闭节点
    docTreeExpandClose(obj, node, dom) {
      this.expandedKeys.forEach((item, index, arr) => {
        if (item === obj.id) {
          arr.splice(index, 1)
        }
      })
      this.dataexpandedKeysList['expanded' + this.acticeName] = this.expandedKeys
    },
    // 选择文件类型
    fileType(value) {
      // console.log(value)
      this.loading = true
      this.fullscreenLoading = true
      this.searchParam.params.searchLogId = this.searchLogId
      this.searchParam.params.fileTypeList = value
      this.searchParam.pageNo = 1
      // this.filteritem.fileTypeList = value
      this.normalSearch(this.searchParam)
    },
    // 选择文档语言
    language(value) {
      // console.log(value)
      this.loading = true
      this.fullscreenLoading = true
      this.searchParam.params.searchLogId = this.searchLogId
      this.searchParam.params.docLanguageList = value
      this.searchParam.pageNo = 1
      // this.filteritem.fileTypeList = value
      this.normalSearch(this.searchParam)
    },

    // 选择更新时间
    radioTimeCheck(value) {
      console.log(value)
      console.log(this.radiotime)
      if (value !== '自定义时间') {
        this.loading = true
        this.fullscreenLoading = true
        this.searchParam.pageNo = 1
        this.radiotime = []
        this.searchParam.params.modifyStartTime = ''
        this.searchParam.params.modifyEndTime = ''
        this.searchParam.params.searchLogId = this.searchLogId
        this.searchParam.params.modifyTimeKey = value
        this.normalSearch(this.searchParam)
      } else {
        this.searchParam.params.modifyTimeKey = ''
        // this.normalSearch(this.searchParam)
      }
    },
    // 选择文件大小
    checkboxChange(val) {
      this.sizecheckDIY = false
      this.searchParam.pageNo = 1
      this.diysizefrom = ''
      this.diysizeto = ''
      if (val !== '自定义大小') {
        this.searchParam.pageNo = 1
        this.loading = true
        this.fullscreenLoading = true
        this.searchParam.params.searchLogId = this.searchLogId
        this.searchParam.params.fileSizeFrom = ''
        this.searchParam.params.fileSizeTo = ''
        this.searchParam.params.fileSizeList = val
        this.normalSearch(this.searchParam)
      } else {
        this.searchParam.params.fileSizeList = []
        // this.normalSearch(this.searchParam)
      }
    },
    checkboxDIYChange(val) {
      this.searchParam.pageNo = 1
      if (val) {
        this.sizecheckDIY = false
        this.sizecheckList = []
        this.searchParam.params.fileSizeList = []
        // this.normalSearch(this.searchParam)
      } else { this.sizecheckDIY = true }
    },
    // 自定义开始时间 - 结束时间
    diyTime() {
      console.log(this.radiotime)
      this.searchParam.pageNo = 1
      this.searchParam.params.searchLogId = this.searchLogId
      if (this.radiotime) {
        this.loading = true
        this.fullscreenLoading = true
        this.searchParam.params.modifyTimeKey = ''
        this.searchParam.params.modifyStartTime = this.radiotime[0]
        this.searchParam.params.modifyEndTime = this.radiotime[1]
        this.normalSearch(this.searchParam)
      }
      // this.filterSearch(this.filteritem)
    },
    // 语言复选框
    langCheckbox(val) {
      this.searchParam.params.searchLogId = this.searchLogId
      this.searchParam.params.docLanguageList = val
      this.normalSearch(this.searchParam)
    },
    relativityTop() {
      this.loading = true
      this.isRelativitySortActiveTop = true
      this.isRelativitySortActiveBottom = false
      this.isTimeSortTop = false
      this.isTimeSortBottom = false
      this.searchParam.pageNo = 1
      this.searchParam.params.searchLogId = this.searchLogId
      this.searchParam.params.sortItem = ['_score,asc']
      this.normalSearch(this.searchParam)
    },
    relativityBottom() {
      this.loading = true
      this.isRelativitySortActiveTop = false
      this.isRelativitySortActiveBottom = true
      this.isTimeSortTop = false
      this.isTimeSortBottom = false
      this.searchParam.pageNo = 1
      this.searchParam.params.searchLogId = this.searchLogId
      this.searchParam.params.sortItem = ['_score,desc']
      this.normalSearch(this.searchParam)
    },
    // 排序（相关度、时间）
    // relativity() {
    //   this.isRelativitySortActiveTop = !this.isRelativitySortActiveTop
    //   this.isRelativitySortActiveBottom = !this.isRelativitySortActiveBottom
    //   this.isTimeSortTop = false
    //   this.isTimeSortBottom = false
    //   this.searchParam.params.searchLogId = this.searchLogId
    //   if (this.isRelativitySort) {
    //     this.searchParam.params.sortItem = ['_score,asc']
    //     this.normalSearch(this.searchParam)
    //   } else {
    //     this.searchParam.params.sortItem = []
    //     this.normalSearch(this.searchParam)
    //   }
    // },
    timeSortTop() {
      this.loading = true
      this.isTimeSortTop = true
      this.isTimeSortBottom = false
      this.isRelativitySortActiveTop = false
      this.isRelativitySortActiveBottom = false
      this.searchParam.pageNo = 1
      this.searchParam.params.searchLogId = this.searchLogId
      this.searchParam.params.sortItem = ['updateTime,asc']
      this.normalSearch(this.searchParam)
    },
    timeSortBottom() {
      this.loading = true
      this.isTimeSortTop = false
      this.isTimeSortBottom = true
      this.isRelativitySortActiveTop = false
      this.isRelativitySortActiveBottom = false
      this.searchParam.pageNo = 1
      this.searchParam.params.searchLogId = this.searchLogId
      this.searchParam.params.sortItem = ['updateTime,desc']
      this.normalSearch(this.searchParam)
    },
    // timeSort() {
    //   // console.log(v)
    //   this.isTimeSortTop = false
    //   this.isTimeSortBottom = true
    //   this.isRelativitySortActiveTop = false
    //   this.isRelativitySortActiveBottom = false
    //   this.searchParam.params.searchLogId = this.searchLogId
    //   // if (v !== 'new') {
    //   //   this.filteritem.sortItem = ['timeSort', 'old']
    //   // } else {
    //   //   this.filteritem.sortItem = ['timeSort', 'new']
    //   // }
    //   // this.filterSearch(this.filteritem)
    //   if (this.isTimeSort) {
    //     this.searchParam.params.sortItem = ['updateTime,desc']
    //     this.normalSearch(this.searchParam)
    //   } else {
    //     this.searchParam.params.sortItem = ['updateTime,asc']
    //     this.normalSearch(this.searchParam)
    //   }
    //   // this.normalSearch(this.searchParam)
    // },
    diysize() {
      this.sizecheckDIY = true
      this.sizecheckList.length = 0
      this.filesizeDialogVisible = true
    },
    submitSize() {
      this.searchParam.pageNo = 1
      this.filesizeDialogVisible = false
      this.searchParam.params.searchLogId = this.searchLogId
      this.loading = true
      this.fullscreenLoading = true
      this.searchParam.params.fileSizeList = []
      this.searchParam.params.fileSizeFrom = this.diysizefrom
      this.searchParam.params.fileSizeTo = this.diysizeto
      this.normalSearch(this.searchParam)
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

    async download(fileUrl, docId) {
      await downloadFile({ 'fileUrl': fileUrl, 'docId': docId })
    },
    showSLT(item) {
      // 成功回调函数停止加载
      this.centerDialogVisible = true
      this.sltData = item
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
        const url = baseApi + item.id
        var previewUrl = url + '?fullfilename=' + new Date().getTime() + '.' + item.fileExtend
        const kkfileviewSrc = contextPath + '/preview/onlinePreview?url=' + encodeURIComponent(previewUrl)
        // const kkfileviewSrc = 'http://localhost/preview/onlinePreview?url=' + encodeURIComponent(previewUrl)
        this.kkfileviewurl = kkfileviewSrc
        // this.centerDialogVisible = true
        if (item.fileType === 'Others') {
          loading.close()
        }
      })
      // this.sltLoading = true
      // const contextPath = window.location.origin
      // console.log(contextPath)
      // const baseApi = contextPath + '/iv-es/api/es/view/'
    },
    closeSLT() {
      this.kkfileviewurl = ''
      const slt = document.getElementsByClassName('el-loading-mask')
      // console.log(slt)
      for (let i = 0; i < slt.length; i++) {
        // slt[i].style.visibility = 'visible'
        slt[i].style.visibility = 'hidden'
      }
    },
    copyUrl(i) {
      document.getElementById('urlcoby' + i).select()
      document.execCommand('copy')
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.loading = true
      this.searchParam.pageSize = val
      this.searchParam.pageNo = 1
      this.normalSearch(this.searchParam)
      // this.loading = false
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.loading = true
      this.searchParam.pageNo = val

      this.normalSearch(this.searchParam)
      // this.loading = false
      this.$nextTick(() => {
        const firstPageStatue = document.getElementsByClassName('btn-prev')[0].disabled
        const lastPageStatue = document.getElementsByClassName('btn-next')[0].disabled
        console.log(111111111111, firstPageStatue, lastPageStatue)
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
    closeDiyFileSizeDialog() {
      this.diysizefrommessage = ''
      this.diysizetomessage = ''
      // this.searchParam.params.fileSizeFrom = ''
      // this.searchParam.params.fileSizeTo = ''
      // this.
    },
    // stateChange() {
    //   this.sltLoading = false
    // }
    // 重置高级检索
    resetFilterClick() {
      this.advanceparams.allKeyWords = ''
      this.advanceparams.arbitraryWords = ''
      this.advanceparams.notIncludeKeyWords = ''
      this.advanceparams.radioTime = 'ALL'
      this.advanceparams.radioDiyTime = ''
      this.advanceparams.fileType = []
      this.advanceparams.fileSize = []
      this.advanceparams.diysizefrom = ''
      this.advanceparams.diysizeto = ''
      this.advanceparams.dataSource = '1'
      this.advanceparams.dataSourceSearch = ''
      this.advanceparams.radioSort = 'relativity'
    },
    // 隐藏显示过滤条件
    putFilterClick() {
      this.isAdvanceFlag = !this.isAdvanceFlag
    },
    // 设置个人标签
    setLabel(item) {
      this.personLabelDialogVisible = !this.personLabelDialogVisible
      this.perDialogList = item
      console.log(item)
    },
    // 取消标签
    personLabelRemoveClick(item) {
      console.log()
      this.hasSetLabelList.splice(this.hasSetLabelList.findIndex(list => list.id === item.id), 1)
      this.personlabelList.unshift({ id: item.id, name: item.name })
      // document.getElementById('animation_' + item.id).style.transform = 'translate(0px, 70px)'
    },
    // 打标签
    personLabelAddClick(item) {
      this.personlabelList.splice(this.personlabelList.findIndex(list => list.id === item.id), 1)
      this.hasSetLabelList.unshift({ id: item.id, name: item.name })
    },
    // 添加新标签
    setNewLabel(item) {
      // hasSetLabelList
      // personlabelList
      // newLabelValue
      this.personlabelList.unshift({ id: this.perDialogList.id, name: this.newLabelValue })
    },
    // 高级搜索pop隐藏显示
    showAdvanceSearch() {
      this.isAdvanceSearch = !this.isAdvanceSearch
    },
    // 热词搜索
    getKeyWords(val) {
      console.log(val)
      this.keyWords = val
    },
    // 个人标签搜索
    getLabel(val) {
      console.log(val)
      this.keyWords = val
    },
    // 主题搜索
    getThemeValue(value) {
      console.log(value)
      this.keyWords = value[1]
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
  position: relative;
  z-index: 3;
}
.main_box {
  height: calc(100vh - 328px);
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  flex: 1;
  padding: 10px 0px 20px 30px;
  box-sizing: border-box;
  width: 100%;
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
.con_box_search {
  height: calc(100vh - 114px);
  padding: 20px 0 20px 20px;
  box-sizing: border-box;
  overflow: hidden;
}
.left_result {
  height: 100%;
  overflow: auto;
}
.left_result >>> .el-range-editor.is-disabled input {
  background: transparent;
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
.result_header_filter {
  display: flex;
}
.result_header_filter_box {
  margin-right: 35px;
  display: flex;
}
.result_header_filter_flex {
  margin-top: -4px;
  display: flex;
  justify-items: center;
  flex-direction: column;
  line-height: 20px;
}
.result_header_filter_flex i:first-child {
  margin-bottom: 5px;
  margin-top: 19px;
}
.result_header span i {
  color: #666666;
  margin-left: 5px;
  cursor: pointer;
  line-height: 6px;
}
.result_header span i::before {
  cursor: pointer;
}
.pop_btn {
  width: 40px;
  height: 40px;
  float: right;
  background: #2d7a9c;
  border-radius: 50%;
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
  height: calc(100% - 40px);
  overflow: auto;
}
.result_main_empty {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  padding: 9px 0;
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
.each_r_des {
  max-width: 98%;
  word-break: break-all;
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
.each_r_con_p {
  margin-top: 20px;
  height: 100px;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 30px;
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
  margin-top: 5px;
  height: 20px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #4a90e2;
  line-height: 20px;
  display: flex;
  align-items: center;
}
.each_r_url input {
  width: 10px;
}
.each_r_url_left {
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.each_r_url span {
  cursor: pointer;
}
.each_r_lable {
  height: auto;
  max-height: 78px;
  overflow: hidden;
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
  padding: 0 5px;
  text-align: center;
}
.each_r_lable li i {
  font-size: 14px;
  margin-right: 5px;
}
.each_r_lable .set_label {
  width: 120px;
  height: 24px;
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%);
  border-radius: 12px;
  color: #ffffff;
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
.pagination-box {
  width: calc(100% - 40px);
  padding: 15px 0 0px 0;
}
.icon_active {
  color: #1e90ff !important;
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
  left: 280px;
  color: #f54132;
}
</style>
<style scoped>
.advance_filter {
  width: 100%;
  height: auto;
  display: inline-block;
  padding: 10px 30px 10px;
  background: #ffffff;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  box-sizing: border-box;
  transition: all 0.3s linear;
  overflow: auto;
  box-shadow: -26px 0 26px -26px rgba(68, 100, 163, 0.2),
    0 26px 26px -26px rgba(68, 100, 163, 0.2),
    26px 0 26px -26px rgba(68, 100, 163, 0.2);
}
.advance_filter_shadow {
  box-shadow: 0px 6px 26px 2px rgba(68, 100, 163, 0.2);
}
.advance_filter_height {
  height: 184px;
  width: 100%;
}
.search_params_item {
  width: 100%;
  height: 40px;
  color: #333333;
  margin-bottom: 15px;
  box-sizing: border-box;
  line-height: 40px;
  display: flex;
  justify-content: left;
}
.search_params_item:last-child {
  margin-bottom: 5px;
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
.reset_filter_btn {
  padding-top: 15px;
  margin-bottom: 10px;
  color: #2d7a9c;
  font-family: "微软雅黑";
  font-size: 16px;
  border-top: 1px solid #eeeeee;
}
.reset_filter_btn i,
.put_filter i {
  margin-right: 15px;
}
.put_filter i {
  font-size: 24px;
}
.reset_filter_btn span,
.put_filter span {
  cursor: pointer;
}
.put_filter span {
  cursor: pointer;
  width: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.search_params {
  display: none;
}
.put_filter {
  text-align: center;
  color: #2d7a9c;
  font-family: "微软雅黑";
  font-size: 14px;
  height: 16px;
  line-height: 16px;
  margin-top: 14px;
}
.labelD_title {
  text-align: center;
  height: 20px;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 20px;
}
.has_Label_list {
  width: 100%;
  height: auto;
  display: inline-block;
  margin-top: 30px;
  border-bottom: 1px solid #cccccc;
}
.person_Label_list {
  width: 100%;
  height: auto;
  display: inline-block;
  margin-top: 20px;
  border-bottom: 1px solid #cccccc;
}
.has_Label_list li {
  min-width: 100px;
  height: 24px;
  background: #2d7a9c;
  border-radius: 12px;
  border: 1px solid #2d7a9c;
  float: left;
  text-align: left;
  margin-right: 20px;
  text-align: center;
  margin-bottom: 20px;
  color: #ffffff;
  padding-left: 15px;
  padding-right: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  position: relative;
  transition: all 1s linear;
}
.person_Label_list li {
  min-width: 100px;
  max-width: 135px;
  height: 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #cccccc;
  float: left;
  text-align: left;
  margin-right: 20px;
  text-align: center;
  margin-bottom: 20px;
  color: #999999;
  padding-left: 15px;
  padding-right: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  position: relative;
  transition: all 1s linear;
}
.has_Label_list li:hover:after {
  position: absolute;
  content: "-";
  color: #ffffff;
  font-size: 18px;
  top: -4px;
  right: 2px;
}
.person_Label_list li:hover:after {
  position: absolute;
  content: "+";
  color: #2d7a9c;
  font-size: 18px;
  top: -3px;
}
.has_Label_list li i,
.person_Label_list li i {
  font-size: 14px;
}
.person_label_dialog .diy_size_pop_button {
  margin-top: 30px;
}
.set_new_label {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.set_new_label span {
  min-width: 85px;
}
.set_new_label_btn {
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%);
  font-size: 16px;
  font-family: "微软雅黑";
  color: #ffffff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  width: 100px;
  min-width: 100px;
  height: 40px;
  border-radius: 25px;
  border: none;
  margin-left: 20px;
}
/* 高级弹出框 */
.pop_advance {
  width: 381px;
  height: calc(100vh - 300px);
  background: #ffffff;
  box-shadow: 0px 6px 20px 2px rgba(68, 100, 163, 0.2);
  border-radius: 16px;
  position: fixed;
  right: 120px;
  overflow: hidden;
  user-select: none;
  z-index: 2;
}
.pop_advance ul {
  height: 50px;
}
.pop_advance > ul li {
  width: 127px;
  height: 50px;
  font-size: 18px;
  font-family: "微软雅黑";
  color: #333333;
  background: #d8e0e8;
  text-align: center;
  line-height: 50px;
  float: left;
  position: relative;
  cursor: pointer;
}
.pop_advance > ul li:nth-child(2):before {
  width: 1px;
  height: 20px;
  position: absolute;
  top: 15px;
  left: 0;
  content: "";
  content: "";
  background: #c7d0d9;
}
.pop_advance > ul li:nth-child(2)::after {
  width: 1px;
  height: 20px;
  position: absolute;
  top: 15px;
  right: 0;
  content: "";
  background: #c7d0d9;
  cursor: pointer;
}
.pop_advance_active {
  font-size: 18px;
  font-family: "微软雅黑";
  color: #ffffff !important;
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%) !important;
}
.pop_advance .pop_advance_main {
  display: none;
  padding: 20px;
  overflow: auto;
  height: calc(100% - 50px);
}
.pop_advance_main ul {
  height: auto;
}
.keywords_box ul li {
  height: 20px;
  line-height: 20px;
  font-size: 16px;
  font-family: "微软雅黑";
  font-weight: 400;
  color: #2263ec;
  text-decoration: underline;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  cursor: pointer;
}
.personlabel_box li {
  width: auto;
  height: 24px;
  min-width: 95px;
  max-width: 130px;
  padding: 0 10px;
  line-height: 22px;
  border-radius: 12px;
  display: inline-block;
  border: 1px solid #cccccc;
  margin-right: 15px;
  text-align: center;
  background: #ffffff;
  color: #999999;
  cursor: pointer;
  font-family: "微软雅黑";
  position: relative;
  margin-bottom: 20px;
}
.personlabel_box li i {
  font-size: 14px;
}
.personlabel_box_li-active {
  background: #2d7a9c !important;
  color: #ffffff !important;
  border: 1px solid #2d7a9c !important;
}
.personlabel_box .count {
  position: absolute;
  right: -9px;
  top: -8px;
  border-radius: 7px;
  height: 14px;
  line-height: 14px;
  font-size: 12px;
  background: #ff9200;
  color: #ffffff;
  padding: 0 2px;
}
.theme_search_input {
  width: 100%;
}
.theme_search_item {
  height: calc(100% - 40px);
  flex: 1;
  margin-bottom: 20px;
  padding-bottom: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

