<template>
  <div id="box" v-loading="fullscreenLoading" class="result_box">
    <div id="left" :class="isCollapse?'result_DIY result_filter_all':'result_DIY result_filter'" @click="isAdvanceFlag=false,isAdvanceSearch=false">
      <div class="title_box">
        <ul>
          <li v-for="(item,index) in filetab" :id="'tab'+index" :key="index" :class="activeDataSource==index?'active':''" :title="item.value" @click="filetapClick(item),activeDataSource=index">
            {{ item.value }}
          </li>
        </ul>
      </div>
      <div v-if="activeDataSource!=0" class="qxz">
        <span>{{ $t('advanced.isChildFolder') }}:</span>
        <el-radio-group v-model="cascadeSelect" @change="onSelectedChange">
          <el-radio v-for="item in optionsFolder" :id="item.value" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </div>
      <div class="con_box_search">
        <div class="left_result">
          <div v-for="(item,index) in dataSourceFolderTree" v-show="('dataSource'+acticeName) == index" :key="index">
            <!--el-tree严格模式：只能选中当前节点  -->
            <!-- check-strictly="true" -->
            <el-tree
              :ref="'ProjectTree'+index"
              class="iv-seach-tree"
              :check-strictly="true"
              :data="item"
              show-checkbox
              node-key="id"
              :expand-on-click-node="false"
              :check-on-click-node="true"

              icon-class="iconfont icon-jiantou-copy"
              @check="docTreeCheck"
            >
              <template slot-scope="scope">
                <div>
                  <div :class="{'f_bolder':getIsBolder(scope)}">
                    <span>{{ scope.data.label }}</span><span class="filter_number"><span>{{ scope.data.fileItemCount }}</span><span>/</span><span>{{ scope.data.totalFileItemCount }}</span><span>/</span><span>{{ scope.data.oldTotalFileItemCount }}</span></span>
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
          <div v-if="activeDataSource!='0'" />
          <div v-if="activeDataSource==0">
            <div class="search_num" @click="isfile=!isfile">
              <i class="iconfont icon-ziyuan" />
              <span>{{ $t('advanced.fileLanguage') }}</span>
              <i class="iconfont icon-ai-arrow-down" :class="isfile?'':'icon_gif'" />
            </div>
            <el-checkbox-group v-show="isfile" v-model="languageCheckList" @change="language">
              <el-checkbox v-for="type in languageAggResult" :key="type.id" :label="type.id">
                {{ type.name }}
                <template>
                  <span class="filter_number"><span>{{ type.count }}</span><span>/</span><span>{{ type.oldCount }}</span></span>
                </template>
              </el-checkbox>
            </el-checkbox-group>
            <div class="search_num" style="margin-top:30px" @click="ischeck=!ischeck">
              <i class="iconfont icon-duomeitiicon-" />
              <span>{{ $t('advanced.fileType') }}</span>
              <i class="iconfont icon-ai-arrow-down" :class="ischeck?'':'icon_gif'" />
            </div>
            <el-checkbox-group v-show="ischeck" v-model="filecheckList" @change="fileType">
              <el-checkbox v-for="type in fileTypeAggResult" :key="type.id" :label="type.id">
                {{ type.name }}
                <template>
                  <span class="filter_number"><span>{{ type.count }}</span><span>/</span><span>{{ type.oldCount }}</span></span>
                </template>
              </el-checkbox>
            </el-checkbox-group>
            <div class="search_num" style="margin-top:30px" @click="isradio=!isradio">
              <i class="iconfont icon-shijian" />
              <span>{{ $t('advanced.modifyedTime') }}</span>
              <i class="iconfont icon-ai-arrow-down" :class="isradio?'':'icon_gif'" />
            </div>
            <el-radio-group v-show="isradio" v-model="radiocheckList" @change="radioTimeCheck">
              <el-radio v-for="type in fileUpdateTimeAggResult" :id="type.id" :key="type.id" :label="type.id">
                {{ type.name }}
                <template>
                  <span class="filter_number"><span>{{ type.count }}</span><span>/</span><span>{{ type.oldCount }}</span></span>
                </template>
              </el-radio>
              <el-radio :label="$t('advanced.diyDate')" />
            </el-radio-group>
            <div v-show="isradio" class="block">
              <el-date-picker
                v-model="radiotime"
                class="diy_time"
                :disabled="radiocheckList==='自定义日期'?false:true"
                popper-class="date_picker"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                unlink-panels
                :clearable="false"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="diyTime"
              />
            </div>

            <div class="search_num" style="margin-top:30px" @click="issize=!issize">
              <i class="iconfont icon-daxiao" />
              <span>{{ $t('advanced.fileSize') }}</span>
              <i class="iconfont icon-ai-arrow-down" :class="issize?'':'icon_gif'" />
            </div>
            <el-checkbox-group v-show="issize" v-model="sizecheckList" @change="checkboxChange">
              <el-checkbox v-for="type in fileSizeAggResult" :key="type.index" :label="type.id">
                {{ type.name }}
                <template>
                  <span class="filter_number"><span>{{ type.count }}</span><span>/</span><span>{{ type.oldCount }}</span></span>
                </template>
              </el-checkbox>
            </el-checkbox-group>
            <el-checkbox v-show="issize" v-model="sizecheckDIY" class="diycheck" label="自定义大小" @change="checkboxDIYChange(sizecheckDIY),sizecheckDIY=!sizecheckDIY">
              {{ $t('advanced.diyFileSize') }}
            </el-checkbox>
            <div v-show="issize" class="diy_size">
              <el-input
                v-model="diysizefrom"
                :disabled="sizecheckDIY?false:true"
                class="from"
                :placeholder="$t('advanced.numInput')"
                prefix-icon="iconfont icon-daxiao"
                @focus="diysize"
              />
              <span class="zhi">{{ $t('advanced.timeSplit') }}</span>
              <el-input
                v-model="diysizeto"
                :disabled="sizecheckDIY?false:true"
                class="to"
                :placeholder="$t('advanced.numInput')"
                @focus="diysize"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="resize" @mousedown="isAdvanceFlag=false,isAdvanceSearch=false" />
    <div id="right" class="container" @click="isAdvanceFlag=false,isAdvanceSearch=false">
      <el-row class="search_box advance_filter_height" :class="{'advance_filter_shadow':isAdvanceFlag}">
        <el-col :span="24">
          <!-- 拉取联想词 -->
          <el-autocomplete
            ref="searchInput"
            v-model="keyWords"
            class="inline-input search_input"
            :fetch-suggestions="querySearch"
            :placeholder="$t('advanced.searchInput')"
            :maxlength="81"
            :trigger-on-focus="false"
            popper-class="search_input search_input_q"
            clearable
            @select="searchWords"
            @keyup.enter.native="btnSearch"
          >
            <i slot="prefix" class="iconfont icon-sousuo1" />
            <el-button slot="suffix" @click.stop="btnSearch">
              {{ $t('advanced.searchBtn') }}
            </el-button>
          </el-autocomplete>
        </el-col>
        <el-col :span="24" class="flex_ceter" style="height:24px;line-height:24px">
          <span class="font_size_14 fontC_333"> {{ $t('advanced.fieldScale') }}：</span>
          <el-radio-group v-model="fieldScale" @change="fileScale">
            <el-radio label="ALL">
              {{ $t('advanced.unlimit') }}
            </el-radio>
            <el-radio label="FILENAME">
              {{ $t('advanced.fileName') }}
            </el-radio>
            <el-radio label="FILECONTENT">
              {{ $t('advanced.fileContent') }}
            </el-radio>
          </el-radio-group>
          <span class="font_size_14 fontC_333" style="margin-left:20px"> {{ $t('advanced.fuzzySearchDiv') }}：</span>
          <el-select v-model="fuzzySearchDiv" placeholder="请选择" placement="top-end" popper-class="lang_select" @change="getFuzzy">
            <el-option
              v-for="item in searchOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <div class="advance_filter" @click.stop="">
          <el-collapse-transition>
            <div v-show="isAdvanceFlag" class="anim">
              <div class="reset_filter_btn">
                <span @click="resetFilterClick()"><i class="iconfont icon-shuaxin" />{{ $t('advanced.reset') }}</span>
              </div>
              <div class="search_params_item">
                <span><i class="iconfont icon-sousuoguanjianci" />{{ $t('advanced.searchResult') }}：</span>
                <el-input v-model="advanceparams.allKeyWords" placeholder="请输入内容" autocomplete="off" clearable>
                  <template slot="prepend">
                    {{ $t('advanced.allKeyWords') }}
                  </template>
                </el-input>
                <el-input v-model="advanceparams.notIncludeKeyWords" placeholder="请输入内容" autocomplete="off" clearable>
                  <template slot="prepend">
                    {{ $t('advanced.notIncludeKeyWords') }}
                  </template>
                </el-input>
              </div>
              <div class="search_params_item updataTime">
                <span><i class="iconfont icon-shijian" />{{ $t('advanced.modifyedTime') }}：</span>
                <dict-radio v-model="advanceparams.radioTime" dict-type-id="ESSearchModifyedTime" @change="radioTimeChange" />
                <el-date-picker
                  v-model="advanceparams.radioDiyTime"
                  class="diy_time"
                  :disabled="advanceparams.radioTime === 'diy' ? false : true"
                  popper-class="date_picker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="diyTimeChange"
                />
              </div>
              <div class="search_params_item">
                <span><i class="iconfont icon-duomeitiicon-" />{{ $t('advanced.fileType') }}：</span>
                <!-- <el-checkbox-group v-model="advanceparams.fileType">
                  <el-checkbox v-for="type in checkboxFileTypeList" :key="type.index" :label="type.id">
                    {{ type.name }}
                  </el-checkbox>
                </el-checkbox-group> -->
                <dict-checkbox
                  v-model="advanceparams.fileType"
                  dict-type-id="ESFilterExtent"
                  @change="fileTypeCheckbox"
                />
              </div>
              <div class="search_params_item flieSize">
                <span><i class="iconfont icon-daxiao" />{{ $t('advanced.fileSize') }}：</span>
                <!-- <el-checkbox-group v-model="advanceparams.fileSize">
                  <el-checkbox v-for="type in checkboxFileSizeList" :key="type.index" :label="type.id">
                    {{ type.name }}
                  </el-checkbox>
                </el-checkbox-group> -->
                <dict-checkbox
                  v-show="issize"
                  v-model="advanceparams.fileSize"
                  dict-type-id="ESSearchFileSizeRange"
                  @change="fileSizeChange"
                />
                <div class="diy_filesize">
                  <el-input
                    v-model="advanceparamsDiysizeFrom"
                    :disabled="fileSizeDiy ? false : true"
                    class="from"
                    :placeholder="$t('normal.numInputStart')"
                    prefix-icon="iconfont icon-daxiao"
                    clearable
                  />
                  <span class="fileszieDiyfromerror">{{ advancedDiysizefrommessage }}</span>
                  <span class="zhi">至</span>
                  <el-input
                    v-model="advanceparamsDiysizeTo"
                    :disabled="fileSizeDiy ? false : true"
                    class="to"
                    :placeholder="$t('normal.numInputEnd')"
                    prefix-icon="iconfont icon-daxiao"
                    clearable
                  />
                  <span class="fileszieDiytoerror">{{ advancedDiysizetomessage }}</span>
                  <span class="kb">KB</span>
                </div>
              </div>
              <div class="search_params_item">
                <span><i class="iconfont icon-mulu" />{{ $t('advanced.folderSearch') }}：</span>
                <dict-select
                  v-model="advanceparams.dataSource"
                  class="select_input"
                  dict-type-id="ESDataSourceName"
                  @change="dataSourceChange"
                />
                <el-autocomplete
                  ref="filePathsearchInput"
                  v-model="advanceparamsDataSourceFilePath"
                  class="select_input_value"
                  :fetch-suggestions="queryFilePathSearch"
                  :placeholder="$t('advanced.pathSuggestions')"
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
                <el-radio-group v-model="advanceparams.searchSortType">
                  <el-radio v-for="time in radioSortList" :key="time.id" :label="time.id">
                    {{ time.name }}
                  </el-radio>
                </el-radio-group>
              </div> -->
            </div>
          </el-collapse-transition>
          <div class="put_filter">
            <span @click.stop="putFilterClick()"><i :class="isAdvanceFlag?'iconfont icon-open-copy':'iconfont icon-open'" />{{ isAdvanceFlag?'收起搜索条件':'展开重新选择搜索条件' }}</span>
          </div>
        </div>
      </el-row>

      <div v-loading="loading" class="main_box">
        <div class="result_header">
          <span>找到{{ pageTotalRecord }}条结果(用时{{ timeTaken }})</span>
          <div class="result_header_filter">
            {{ $t('advanced.resultSort') }}：<span class="result_header_filter_box">
              {{ $t('advanced.relevancy') }}<span class="result_header_filter_flex">
                <i class="iconfont icon-jiantouarrow492" :class="isRelativitySortActiveTop?'icon_active':'icon_def'" @click="relativityTop()" /><i class="iconfont icon-jiantouarrow492-copy" :class="isRelativitySortActiveBottom?'icon_active':'icon_def'" @click="relativityBottom()" />
              </span>
            </span>
            <span class="result_header_filter_box">
              {{ $t('advanced.time') }}<span class="result_header_filter_flex">
                <i class="iconfont icon-jiantouarrow492" :class="isTimeSortTop?'icon_active':'icon_def'" @click="timeSortTop()" /><i class="iconfont icon-jiantouarrow492-copy" :class="isTimeSortBottom?'icon_active':'icon_def'" @click="timeSortBottom()" />
              </span>
            </span>
            <!-- 本次开发不需要 -->
            <!-- <div class="pop_btn" @click.stop="" @click="showAdvanceSearch()">
              <i class="iconfont icon-sousuo2" />
            </div> -->
            <!-- <el-collapse-transition>
              <div v-show="isAdvanceSearch" class="pop_advance" @click.stop="">
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
                        <li v-for="label in pop_advanceOBJ.personLabelList" :key="label.index" :class="pop_advanceOBJ.searchLabel.includes(label.name)?'personlabel_box_li-active':''" @click="getLabel(label.name)">
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
                        <el-cascader :key="theme.index" :placeholder="theme" :options="pop_advanceOBJ.themeList.theme_options" clearable class="theme_search_input" :show-all-levels="false" popper-class="theme_search" @change="getThemeValue">
                          <template slot-scope="{data}">
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
            </el-collapse-transition> -->
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
                <i class="iconfont  icon-Group-" />{{ $t('advanced.clickDownload') }}
              </span>
            </div>
            <div class="each_r_title" :title="item.realFileName">
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
                <span slot="reference" @click="copyUrl(index)"> {{ $t('advanced.clickCopyFilePath') }}</span>
              </el-popover>
              <input :id="'urlcoby'+index" type="text" :value="item.fileDirectory" style="opacity: 0">
            </div>
            <!-- 本次开发不需要 -->
            <!-- <div class="each_r_lable">
              <ul>
                <li v-for="label in item.myLabel">
                  <i class="iconfont icon-label" />{{ label.name }}
                </li>
                <li class="set_label" @click="setLabel(item)">
                  <i class="iconfont icon-label" />{{ $t('advanced.setPersionTap') }}
                </li>
              </ul>
            </div> -->
          </div>
        </div>
        <div v-else class="result_main_empty">
          <div class="empty_img">
            <img src="../../assets/img/result_empty.png">
            <span>{{ $t('advanced.meg1') }}</span>
            <span>{{ $t('advanced.msg2') }}</span>
          </div>
        </div>
      </div>
      <div v-show="results!=''" class="pagination-box">
        <span class="el-pagination__total">共&nbsp;{{ pageTotalRecord }}&nbsp;条</span>
        <el-pagination
          :current-page.sync="searchParam.pageNo"
          :page-size="searchParam.pageSize"
          :page-sizes="[10, 20]"
          layout="sizes"
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

    <thumbnail-dailog
      :is-show="centerDialogVisible"
      :doc-obj="sltData"
      @onClose="closeSLT"
    />
    <!-- <el-dialog
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
        <i class="iconfont icon-Group-" /> {{ $t('advanced.clickDownload') }}
      </div>
    </el-dialog> -->
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
        <span> {{ $t('advanced.msg3') }}</span>
      </div>
      <div class="has_Label_list">
        <ul>
          <li v-for="list in hasSetLabelList" :key="list.index" @click="personLabelRemoveClick(list)">
            <i class="iconfont icon-label" /> {{ list }}
          </li>
        </ul>
      </div>
      <br>
      <div class="person_Label_list">
        <ul>
          <li v-for="list in personlabelList" :key="list.index" @click="personLabelAddClick(list)">
            <i class="iconfont icon-label" /> {{ list }}
          </li>
        </ul>
      </div>
      <div class="set_new_label">
        <span>{{ $t('advanced.addTap') }}:</span>
        <el-input v-model="newLabelValue" placeholder="请输入新的标签内容" />
        <button class="set_new_label_btn" @click="setNewLabel(newLabelValue)">
          {{ $t('advanced.add') }}
        </button>
      </div>
      <div class="diy_size_pop_button">
        <div class="clear_size" @click="personLabelDialogVisible=false">
          {{ $t('advanced.cancel') }}
        </div>
        <button class="submit_size">
          {{ $t('advanced.setting') }}
        </button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import { permission } from '@/mixins/permission-mixin'
import { advancedSearchForTree, normalSearch, downloadFile, getTerms, getFilePath, filterSearch } from '@/api/es/es-api'
import DictRadio from '@/components/DictRadio'
import DictSelect from '@/components/DictSelect'
import DictCheckbox from '@/components/DictCheckbox'
import tools from './tools/tools.js'
import $ from 'jquery'
// import DictCheckbox from '../../components/DictCheckbox.vue'
// import { getDictEntriesByTypeId } from '@/api/base'
import thumbnailDailog from '../searchManagement/_thumbnail.vue'

export default {
  components: {
    DictRadio,
    DictCheckbox,
    DictSelect,
    thumbnailDailog
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
      dataSource: '',
      filePathInputEnable: false,
      dataSourceFilePath: '',
      advanceparamsDataSourceFilePath: '',
      optionsFolder: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '2'
        }
      ],
      cascadeSelect: '1',
      keyWords: '',
      fieldScale: 'ALL',
      docLanguage: '',
      fuzzySearchDiv: '2',
      refreshFalg: true,
      restaurants: [],
      // keyWords: '',
      // keyWords: this.$route.params.search !== '' ? this.$route.params.search : '',
      // fieldScale: this.$route.params.radio !== '' ? this.$route.params.radio : 'ALL',
      // docLanguage: this.$route.params.lang !== '' ? this.$route.params.lang : 'ALL',
      // fuzzySearchDiv: this.$route.params.fuzzy !== '' ? this.$route.params.fuzzy : '0',
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
      oldNormalSearch: null,

      // 搜索参数
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          keyWords: '',
          // 过滤条件
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
          fuzzySearchDiv: '2',
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
          allCheckedNodes: [],
          // 检索条件
          allKeyWords: '',
          notIncludeKeyWords: '',
          modifyTimeKeyForSearch: '',
          modifyStartTimeForSearch: '',
          modifyEndTimeForSearch: '',
          fileTypeListForSearch: [],
          fileSizeListForSearch: [],
          fileSizeFromForSearch: '',
          fileSizeToForSearch: '',
          dataSourceforSearch: '',
          dataSourceFilePathForSearch: '',
          sortItemForSearch: ['_score,desc']
        }
      },
      sltData: {},
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
      dataHalfCheckedList: {},
      dataSourceFolderTree: {},
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
      isBtnSearchFlag: true,
      pageTotalRecord: '',
      // isCollapse: this.$store.state.falg
      // 高级检索条件
      // isAdvanceDOM: this.$route.query.advance == 0,
      isAdvanceFlag: false,
      personLabelDialogVisible: false,
      isAdvanceSearch: false,
      listSearchInputReadyonlyFlag: false,
      advanceparamsDiysizeFrom: '',
      advanceparamsDiysizeTo: '',
      radioTimeList: [
        { id: '0', name: '全部时间' },
        { id: '1', name: '过去一天' },
        { id: '7', name: '过去一周' },
        { id: '30', name: '过去一月' },
        { id: '365', name: '过去一年' },
        { id: 'diy', name: '自定义日期' }
      ],
      checkboxFileTypeList: [
        { id: 'Word', name: 'Word' },
        { id: 'Excel', name: 'Excel' },
        { id: 'PowerPoint', name: 'PowerPoint' },
        { id: 'Pdf', name: 'Pdf' },
        { id: 'Text', name: '文本类' },
        { id: 'Zip', name: '压缩包' },
        { id: 'Media', name: '媒体类' },
        { id: 'Image', name: '图片类' },
        { id: 'Others', name: '其他类型' }
      ],
      checkboxFileSizeList: [
        { id: '0-512000', name: '0~500KB' },
        { id: '512000-1048576', name: '500KB~1MB' },
        { id: '1048576-', name: '1MB以上' },
        { id: 'diy', name: '自定义大小' }
      ],
      dataSourceSelectList: [
        { id: '0', name: '请选择' },
        { id: 'iv-fileserver-private', name: 'cto测试文件服务器' },
        { id: 'iv-fileserver-public', name: '共享盘Z' },
        { id: 'iv-fileserver-test', name: '14测试文件服务器共享盘C' }
      ],
      radioSortList: [
        { id: 'rel', name: '按相关度排序' },
        { id: 'time', name: '按时间排序' }
      ],
      advanceparams: {
        allKeyWords: '',
        // arbitraryWords: '',
        notIncludeKeyWords: '',
        radioTime: '0',
        radioDiyTime: [],
        fileType: [],
        fileSize: [],
        diysizefrom: '',
        diysizeto: '',
        dataSource: '',
        dataSourceFilePath: '',
        dataSourceSearch: '',
        radioSort: 'rel'
      },
      hasSetLabelList: ['电子商务', '网络推广', '报表合同'],
      personlabelList: ['电子商务', '网络推广', '报表合同', '网络推广2', '报表合同3', '网络推广一二', '网络推广4', '网络推广三四', '网络推广5', '网络推广6'],
      newLabelValue: '',
      pop_advance_active: 0,
      pop_advanceOBJ: {
        keyWordsList: ['neuron仕楼', 'neuron設計書', 'neuron営業資', 'active directory neuron', 'elasticsearch neuron', '導入" neuron', 'active directory neuron', 'elasticsearch neuron', '導入" neuron', '導入 neuron', 'neuron導入', 'active directory neuron', 'elasticsearch neuron', 'neuron営業資', 'neuron設計書', 'neuron営業資', 'neuron設計書', 'neuron営業資', 'active directory neuron', 'elasticsearch neuron'],
        personLabelList: [
          { name: '电子商务', count: '239' },
          { name: '网络推广', count: '239' },
          { name: '网络推广2', count: '239' },
          { name: '电子商务电子', count: '23' },
          { name: '网络推广3', count: '23' },
          { name: '电子商务电子2', count: '23' },
          { name: '报合同', count: '239' },
          { name: '上午', count: '239' },
          { name: '网络推广4', count: '239' },
          { name: '网络推广5', count: '239' },
          { name: '商务', count: '239' },
          { name: '网络推广6', count: '239' },
          { name: '又要推广', count: '239' },
          { name: '网络推广7', count: '239' },
          { name: '网络推广8', count: '239' }
        ],
        searchLabel: [],
        themeList: {
          theme_options_values: ['合同', '组件', '资源', '组件', '资源1', '组件2', '资源4'],
          theme_options: [
            {
              value: 'zhinan',
              label: '指南',
              count: '29',
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
              count: '29',
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
              count: '239',
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
      elTop: 0, // 当前点击购物车按钮在网页中的绝对left值
      fileSizeDiy: false,
      modifyedTimeFlag: false,
      suggestFilePaths: [],
      selectedFullFilePath: '',
      advancedDiysizefrommessage: '',
      advancedDiysizetomessage: ''

    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.falg
    }
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
      localStorage.setItem('keyWords', newVal)
    },
    diysizefrom(newVal, oldVal) {
      const reg = /^\+?[0-9]\d*$/
      if (newVal !== '') {
        this.diysizefrommessage = ''
        if (!reg.test(newVal)) {
          this.diysizefrommessage = '请输入大于等于0的正整数'
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
        this.diysizefrommessage = ''
      }
    },
    advanceparamsDiysizeFrom(newVal, oldVal) {
      const reg = /^\+?[0-9]\d*$/
      if (newVal !== '') {
        this.advancedDiysizefrommessage = ''
        if (!reg.test(newVal)) {
          this.advancedDiysizefrommessage = '请输入大于等于0的正整数'
        } else {
          if (Number(newVal) > Number(this.advanceparamsDiysizeTo) && this.advanceparamsDiysizeTo !== '') {
            this.advancedDiysizefrommessage = '请输入小于' + this.advanceparamsDiysizeTo + '的正整数'
          } else if (Number(newVal) < Number(this.advanceparamsDiysizeTo) && this.advanceparamsDiysizeTo !== '') {
            this.advancedDiysizetomessage = ''
          } else {
            this.advancedDiysizefrommessage = ''
          }
        }
        if (newVal.length > 11) {
          this.advancedDiysizefrommessage = '输入位数请限制在11位以内'
        }
      } else if (newVal === '') {
        this.advancedDiysizefrommessage = ''
      }
    },
    diysizeto(newVal, oldVal) {
      const reg = /^\+?[0-9]\d*$/
      if (newVal !== '') {
        this.diysizetomessage = ''
        if (!reg.test(newVal)) {
          this.diysizetomessage = '请输入大于等于0的正整数'
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
    advanceparamsDiysizeTo(newVal, oldVal) {
      const reg = /^\+?[0-9]\d*$/
      if (newVal !== '') {
        this.advancedDiysizetomessage = ''
        if (!reg.test(newVal)) {
          this.advancedDiysizetomessage = '请输入大于等于0的正整数'
        } else {
          if (Number(this.advanceparamsDiysizeFrom) > Number(newVal) && this.advanceparamsDiysizeFrom !== '') {
            this.advancedDiysizetomessage = '请输入大于' + this.advanceparamsDiysizeFrom + '的正整数'
          } else if (Number(this.advanceparamsDiysizeFrom) < Number(newVal) && this.advanceparamsDiysizeFrom !== '') {
            this.advancedDiysizefrommessage = ''
          } else {
            // this.diysizefrommessage = ''
            this.advancedDiysizetomessage = ''
          }
        }
        if (newVal.length > 11) {
          this.advancedDiysizetomessage = '输入位数请限制在11位以内'
        }
      } else if (newVal === '') {
        this.advancedDiysizetomessage = ''
      }
    },
    advanceparamsDataSourceFilePath(newVal, oldVal) {
      if (!newVal) {
        this.selectedFullFilePath = ''
      }
    },
    $route(to, from) {
      // console.log(111111111111, to)
    }
  },
  created() {
    // console.log(this.dictTypeId)
    // console.log(this.$route.params)
    const search = this.$route.params.search !== '' ? this.$route.params.search : ''
    const radio = this.$route.params.radio !== '' ? this.$route.params.radio : 'ALL'
    const lang = this.$route.params.lang !== '' ? this.$route.params.lang : 'ALL'
    const fuzzy = this.$route.params.fuzzy !== '' ? this.$route.params.fuzzy : '2'
    const allKeyWords = this.$route.params.allKeyWords !== '' ? this.$route.params.allKeyWords : ''
    const notIncludeKeyWords = this.$route.params.notIncludeKeyWords !== '' ? this.$route.params.notIncludeKeyWords : ''
    const modifyedTime = this.$route.params.modifyedTime !== '' ? this.$route.params.modifyedTime : '0'
    const radioDiyTime = this.$route.params.radioDiyTime !== '' ? this.$route.params.radioDiyTime : ''
    const fileType = this.$route.params.fileType !== '' ? this.$route.params.fileType : ''
    const fileSize = this.$route.params.fileSize !== '' ? this.$route.params.fileSize : ''
    // const fileSizeDiy = this.$route.params.fileSizeDiy !== '' ? this.$route.params.fileSizeDiy : ''
    const diysizefrom = this.$route.params.diysizefrom !== '' ? this.$route.params.diysizefrom : ''
    const diysizeto = this.$route.params.diysizeto !== '' ? this.$route.params.diysizeto : ''
    const dataSource = this.$route.params.dataSource !== '' ? this.$route.params.dataSource : ''
    const dataSourceFilePath = this.$route.params.dataSourceFilePath !== '' ? this.$route.params.dataSourceFilePath : ''
    const searchSortType = this.$route.params.searchSortType !== '' ? this.$route.params.searchSortType : ''
    if (this.$route.params.search) {
      this.keyWords = search
      this.fieldScale = radio
      this.fuzzySearchDiv = fuzzy
      this.advanceparams.allKeyWords = allKeyWords
      this.advanceparams.notIncludeKeyWords = notIncludeKeyWords
      this.advanceparams.radioTime = modifyedTime
      this.advanceparams.radioDiyTime = radioDiyTime
      this.advanceparams.fileType = fileType
      if (fileSize == 'diy') {
        this.fileSizeDiy = true
      }
      this.advanceparams.fileSize = fileSize
      // this.advanceparams.diysizefrom = diysizefrom
      this.advanceparamsDiysizeFrom = diysizefrom
      // this.advanceparams.diysizeto = diysizeto
      this.advanceparamsDiysizeTo = diysizeto
      this.advanceparams.dataSource = dataSource
      this.advanceparamsDataSourceFilePath = dataSourceFilePath.slice(2)
      if (dataSource || dataSourceFilePath) {
        this.filePathInputEnable = true
      }
      this.advanceparams.searchSortType = searchSortType
    }
    if (tools.isBlank(this.keyWords)) {
      this.keyWords = localStorage.getItem('keyWords')
    }
    this.searchParam.params.keyWords = this.keyWords
    this.searchParam.params.fieldScale = radio
    this.searchParam.params.docLanguage = lang
    this.searchParam.params.fuzzySearchDiv = fuzzy
    this.searchParam.params.allKeyWords = allKeyWords
    this.searchParam.params.notIncludeKeyWords = notIncludeKeyWords
    this.searchParam.params.modifyTimeKeyForSearch = modifyedTime
    this.searchParam.params.modifyDiyTimeForSearch = radioDiyTime
    this.searchParam.params.fileTypeListForSearch = fileType
    this.searchParam.params.fileSizeListForSearch = fileSize
    this.searchParam.params.fileSizeFromForSearch = diysizefrom
    this.searchParam.params.fileSizeToForSearch = diysizeto
    this.searchParam.params.dataSourceforSearch = dataSource
    this.searchParam.params.dataSourceFilePathForSearch = dataSourceFilePath
    // this.searchParam.params.sortItemForSearch = searchSortType
    this.loading = true
    this.sltLoading = true
    this.normalSearch()
    this.$nextTick(() => {
      this.$refs.searchInput.focus()
    })
  },
  mounted() {
    this.dragControllerDiv()
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
    //
    // 初始化监听dom大小改变 将自定义时间与自定义大小一期换行显示
    const domW = document.getElementById('right').offsetWidth
    if (domW < 1200) {
      // 获取最后一个子节点
      document.querySelector('.updataTime .el-radio-group').lastElementChild.appendChild(document.querySelector('.updataTime .diy_time '))
      document.querySelector('.flieSize .el-checkbox-group').lastElementChild.appendChild(document.querySelector('.flieSize .diy_filesize'))
    }
    //
  },
  updated() {
    this.$nextTick(() => {
      this.sltLoading = false
    })
    // this.$nextTick(() => {
    //   const firstPageStatue = document.getElementsByClassName('btn-prev')[0].disabled
    //   const lastPageStatue = document.getElementsByClassName('btn-next')[0].disabled
    //   // console.log(111111111111, firstPageStatue, lastPageStatue)
    //   if (firstPageStatue) {
    //     document.getElementsByClassName('first-pager')[0].disabled = true
    //   } else {
    //     document.getElementsByClassName('first-pager').disabled = false
    //   }
    //   if (lastPageStatue) {
    //     document.getElementsByClassName('last-pager')[0].disabled = true
    //   } else {
    //     document.getElementsByClassName('last-pager')[0].disabled = false
    //   }
    // })
  },
  methods: {
    onSelectedChange(event, item) {
      // console.log(this.cascadeSelect)
    },
    dragControllerDiv: function () {
      const resize = document.getElementById('resize')
      const left = document.getElementById('left')
      const right = document.getElementById('right')
      const box = document.getElementById('box')
      const rightMinWidth = 700
      // console.log('dragControllerDiv, resize=' + resize.id + ', left=' + left.id + ', right=' + right.id + ', box=' + box.id)

      resize.onmousedown = function (e) {
        const startX = e.clientX
        resize.left = resize.offsetLeft
        document.onmousemove = function (e) {
          const endX = e.clientX
          let moveLen = resize.left + (endX - startX)
          const maxT = box.clientWidth - resize.offsetWidth
          // if (moveLen < 150) moveLen = 360
          if (moveLen > maxT - rightMinWidth) moveLen = maxT - rightMinWidth
          resize.style.left = moveLen
          left.style.width = moveLen + 'px'
          right.style.width = (box.clientWidth - moveLen - 5) + 'px'
          // 监听dom大小改变 将自定义时间与自定义大小一期换行显示
          const domW = document.getElementById('right').offsetWidth
          if (domW < 1200) {
            // 获取最后一个子节点
            document.querySelector('.updataTime .el-radio-group').lastElementChild.appendChild(document.querySelector('.updataTime .diy_time '))
            document.querySelector('.flieSize .el-checkbox-group').lastElementChild.appendChild(document.querySelector('.flieSize .diy_filesize'))
          }
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
          resize.releaseCapture && resize.releaseCapture()
        }
        resize.setCapture && resize.setCapture()
        return false
      }
    },
    async btnSearch() {
      if (!this.keyWords) {
        this.$message.closeAll()
        this.$message({
          message: '请输入搜索内容！',
          type: 'warning'
        })
        return
      }
      if (this.advancedDiysizefrommessage !== '' || this.advancedDiysizetomessage !== '') {
        this.$message.closeAll()
        this.$message({
          message: '搜索条件中的文件自定义大小输入有误，请确认！',
          type: 'warning'
        })
        return
      }
      if (this.keyWords) {
        this.loading = true
        this.isAdvanceFlag = false
        this.isAdvanceSearch = false
        this.isBtnSearchFlag = true
        if (this.$refs['ProjectTreedataSource' + this.acticeName]) {
          this.$refs['ProjectTreedataSource' + this.acticeName][0].setCheckedKeys([])
        }
        this.activeDataSource = 0
        this.fullscreenLoading = true

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
        // this.searchParam.params.docFolderList = []
        // this.searchParam.params.fuzzySearchDiv = '0'
        // 重置排序
        this.searchParam.params.sortItem = ['_score,desc']
        this.isRelativitySortActiveTop = false
        this.isRelativitySortActiveBottom = true
        this.isTimeSortTop = false
        this.isTimeSortBottom = false

        this.searchParam.params.keyWords = this.keyWords
        this.searchParam.pageNo = 1
        this.searchParam.pageSize = 10
        this.dataCheckedList = {}
        this.radiotime = ''
        this.sizecheckDIY = false
        this.diysizefrom = ''
        this.diysizeto = ''
        this.searchParam.params.searchLogId = ''
        // 搜索条件
        this.searchParam.params.allKeyWords = this.advanceparams.allKeyWords
        this.searchParam.params.notIncludeKeyWords = this.advanceparams.notIncludeKeyWords
        this.searchParam.params.modifyTimeKeyForSearch = this.advanceparams.radioTime
        this.searchParam.params.modifyDiyTimeForSearch = this.advanceparams.radioDiyTime
        this.searchParam.params.fileTypeListForSearch = this.advanceparams.fileType
        this.searchParam.params.fileSizeListForSearch = this.advanceparams.fileSize
        // this.searchParam.params.fileSizeFromForSearch = this.advanceparams.diysizefrom
        // this.searchParam.params.fileSizeToForSearch = this.advanceparams.diysizeto
        this.searchParam.params.fileSizeFromForSearch = this.advanceparamsDiysizeFrom
        this.searchParam.params.fileSizeToForSearch = this.advanceparamsDiysizeTo
        this.searchParam.params.dataSourceforSearch = this.advanceparams.dataSource
        this.searchParam.params.dataSourceFilePathForSearch = this.selectedFullFilePath
        await this.normalSearch()
        this.tabLength = this.filetab.length
      } else {
        this.$message.closeAll()
        this.$message({
          message: '请输入搜索内容！',
          type: 'warning'
        })
      }
      document.querySelector('.search_input_q').style.display = 'none'
    },
    async normalSearch(callback) {
      if (this.isBtnSearchFlag) {
        this.dataSourceFolderTree = {}
      }
      this.isAdvanceFlag = false
      this.isAdvanceSearch = false
      const res = await normalSearch(this.searchParam)
      if (res && res.success) {
        const resultscrollbox = this.$refs.scrollbox
        if (resultscrollbox) {
          resultscrollbox.scrollTop = 0
        }
        // console.log('搜索结果', res)
        // this.$refs.ProjectTree.setCheckedKeys([])
        this.results = res.datas.searchResult.results
        this.treeData = res.datas.folderTreeResult
        this.searchParam.pageNo = res.datas.searchResult.pageNo
        this.searchParam.pageSize = res.datas.searchResult.pageSize
        this.searchParam.totalPage = res.datas.searchResult.totalPage
        this.searchParam.totalRecord = res.datas.searchResult.totalRecord
        this.searchLogId = res.datas.searchLogId
        this.timeTaken = res.datas.timeTaken
        // console.log(1111, res.datas.searchResult.results)
        const groupTree = {}
        for (var i = 0; i < res.datas.folderTreeResult.length; i++) {
          var key = res.datas.folderTreeResult[i].dataSource
          groupTree[key] = groupTree[key] || (groupTree[key] = [])
          groupTree[key].push(res.datas.folderTreeResult[i])
        }
        const allTree = []
        allTree.push(...Object.values(groupTree))
        // this.treeData = allTree

        if (this.isBtnSearchFlag) {
          this.acticeName = ''
          // 点击搜索按钮时处理
          this.oldNormalSearch = res.datas
          tools.normalSearchCopy(this.oldNormalSearch, 'fileTypeAggResult', 'fileUpdateTimeAggResult', 'languageAggResult', 'fileSizeAggResult')

          this.filetab = [{ id: 'fixed', dataSource: '', value: '筛选过滤' }]
          for (let i = 0; i < allTree.length; i++) {
            const dataTree = allTree[i]
            this.dataSourceFolderTree['dataSource' + allTree[i][0].dataSource] = dataTree
            if (dataTree.length > 0) {
              const data = dataTree[0]
              // 向第一次返回的树中添加检索结果的总文件数
              tools.recordDataTreeFirstCount(data)
              this.filetab.push({
                id: data.id,
                value: data.dataSourceName,
                dataSource: data.dataSource
              })
            }
          }
          this.$nextTick(() => {
            // 页面加载完毕后设置默认展开
            for (const item of res.datas.folderTreeResultExpandedKeys) {
              for (const iterator of item.expandedKeys) {
                const node = this.$refs['ProjectTreedataSource' + item.dataSource][0].getNode(iterator)
                node.expanded = true
              }
            }
          })
        } else if (this.activeDataSource === 0) {
          // 改变文件属性时，重新构造检索条件
          const fileAttrParams = $.extend(true, {}, this.searchParam)
          // 清空文件树勾选的内容，作为新检索条件
          fileAttrParams.params.docFolderList = {}
          const fileAttrResult = await advancedSearchForTree(fileAttrParams)
          const fileTreeData = fileAttrResult.datas.folderTreeResult
          for (const key in this.dataSourceFolderTree) {
            let dataTree = {}
            const dataSourceTree = this.dataSourceFolderTree[key][0]
            for (let i = 0; i < fileTreeData.length; i++) {
              const data = fileTreeData[i]
              if ('dataSource' + data.dataSource === key) {
                dataTree = data
                break
              }
            }
            // 将检索后的文件结果数更行到文件树上
            tools.mergeDataTree(dataSourceTree, dataTree)
          }
        }
        if (!!callback && typeof callback === 'function') {
          callback.call(this)
        }
        this.isBtnSearchFlag = false
        this.loading = false
        this.fullscreenLoading = false
      } else {
        this.loading = false
        this.fullscreenLoading = false
      }
      const totalRecord = res.datas.searchResult ? res.datas.searchResult.totalRecord : 0
      if (totalRecord === 1000) {
        this.pageTotalRecord = '999+'
      } else {
        this.pageTotalRecord = totalRecord
      }

      const fileTypeAggResult = res.datas.fileTypeAggResult
      const fileUpdateTimeAggResult = res.datas.fileUpdateTimeAggResult
      const languageAggResult = res.datas.languageAggResult
      const fileSizeAggResult = res.datas.fileSizeAggResult
      // 刷新搜索结果数据
      if (!tools.isBlank(this.oldNormalSearch)) {
        // 文档类型
        tools.normalSearchMergeList(this.oldNormalSearch.fileTypeAggResult, fileTypeAggResult)
        // 文档更新时间
        tools.normalSearchMergeList(this.oldNormalSearch.fileUpdateTimeAggResult, fileUpdateTimeAggResult)
        // 文档语言
        tools.normalSearchMergeList(this.oldNormalSearch.languageAggResult, languageAggResult)
        // 文档大小
        tools.normalSearchMergeList(this.oldNormalSearch.fileSizeAggResult, fileSizeAggResult)
      }
      this.fileTypeAggResult = fileTypeAggResult
      this.fileUpdateTimeAggResult = fileUpdateTimeAggResult
      this.languageAggResult = languageAggResult
      this.fileSizeAggResult = fileSizeAggResult
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
      this.restaurants = [{ id: 1, value: 'adadadas' }, { id: 1, value: 'adadadas' }, { id: 1, value: 'adadadas' }, { id: 1, value: 'adadadas' }]
      // this.getTerms(queryString)
      // 调用 callback 返回建议列表的数据
      cb(this.restaurants)
    },
    // 更新时间
    diyTimeChange(val) {
      if (val) {
        if (this.advanceparams.radioDiyTime.length > 0) {
          this.modifyStartTime = val[0]
          this.modifyEndTime = val[1]
          this.modifyedTimeFlag = true
        }
      }
    },
    // 搜索关键字
    searchWords(value) {
      this.$refs.searchInput.focus()
      // console.log(value.value)
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
      // console.log(index)
      // console.log(this.$refs.ProjectTree)
      this.acticeName = obj.dataSource
      this.tabItem = obj
      if (this.filetab.length >= 1) {
        this.choseTreeData = []
        for (let i = 0; i < this.filetab.length; i++) {
          if (this.filetab[i].dataSource === obj.dataSource) {
            const dataSourceTree = this.dataSourceFolderTree['dataSource' + obj.dataSource]
            this.choseTreeData = dataSourceTree
            break
          }
        }
      }

      this.searchParam.params.currentDataSource = obj.dataSource
      // this.searchParam.params.docFolderList
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
    // 具体方法可以看element官网api
    /* childNodes(node) {
      const len = node.childNodes.length
      for (let i = 0; i < len; i++) {
        node.childNodes[i].checked = node.checked
        this.childNodes(node.childNodes[i])
      }
    }, */
    childNodesIsChecked(node) {
      const len = node.childNodes.length
      let checkFlag = false
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          // console.log(node.label + '===>' + node.childNodes[i].checked)
          if (node.childNodes[i].checked || node.childNodes[i].indeterminate) {
            return true
          } else {
            checkFlag = this.childNodesIsChecked(node.childNodes[i])
          }
          if (checkFlag) {
            return true
          }
        }
        return false
        // return this.childNodesIsChecked(node.childNodes[i])
      } else {
        return false
      }
    },
    parentNodesChecked(node) {
      if (node.parent) {
        /* let isChecked = true
        for (let i = 0; i < node.parent.childNodes.length; i++) {
          if (!node.parent.childNodes[i].checked) {
            isChecked = false
            break
          }
        }
        if (isChecked) {
          node.parent.checked = true
        } */
        for (const key in node) {
          if (key === 'parent') {
            // node[key].checked = true
            // console.log(node[key].label + "------>" + this.childNodesisChecked(node[key]))
            if (node[key].checked !== true) {
              node[key].indeterminate = true
            }
            this.parentNodesChecked(node[key])
          }
        }
      }
    },
    parentNodesunChecked(node) {
      if (node.parent) {
        /* let isChecked = true
        for (let i = 0; i < node.parent.childNodes.length; i++) {
          if (!node.parent.childNodes[i].checked) {
            isChecked = false
            break
          }
        }
        if (isChecked) {
          node.parent.checked = true
        } */
        for (const key in node) {
          if (key === 'parent') {
            // node[key].checked = true
            if (!node[key].checked && !this.childNodesIsChecked(node[key])) {
              node[key].indeterminate = false
            }
            this.parentNodesunChecked(node[key])
          }
        }
      }
    },
    checkedNodes(node) {
      if (node.checked) {
        this.parentNodesChecked(node)
      } else {
        if (this.childNodesIsChecked(node)) {
          node.indeterminate = true
        }
        this.parentNodesunChecked(node)
      }
    },
    // 选择tree: node当前节点数据，b:选中项
    docTreeCheck(node, b) {
      // 操作子节点
      let isChecked = false
      // 判断当前操作是勾选还是取消勾选
      if (b.checkedKeys.contains(node.id)) {
        isChecked = true
      } else {
        isChecked = false
      }
      // 选中项子节点控制
      const childrenKeys = b.checkedKeys
      if (this.cascadeSelect === '1') { // 联动
        tools.isCheckedChild(node, childrenKeys, isChecked)
      }
      // 刷新勾选项
      this.$refs['ProjectTreedataSource' + this.acticeName][0].setCheckedKeys(childrenKeys)

      this.loading = true
      this.fullscreenLoading = true
      this.selectedFolder = []
      this.searchParam.params.searchLogId = this.searchLogId
      if (!tools.isBlank(childrenKeys)) {
        this.dataCheckedList['checked' + this.acticeName] = childrenKeys
      } else {
        delete this.dataCheckedList['checked' + this.acticeName]
      }
      this.searchParam.params.docFolderList = this.dataCheckedList
      const halfCheckNodes = this.$refs['ProjectTreedataSource' + this.acticeName][0].getHalfCheckedNodes()
      this.dataHalfCheckedList['halfChecked' + this.acticeName] = halfCheckNodes
      this.normalSearch()
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
      // console.log(value)
      // console.log(this.radiotime)
      if (value !== '自定义日期') {
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
      // console.log(this.radiotime)
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
      this.fullscreenLoading = true
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
      this.fullscreenLoading = true
      this.isRelativitySortActiveTop = false
      this.isRelativitySortActiveBottom = true
      this.isTimeSortTop = false
      this.isTimeSortBottom = false
      this.searchParam.pageNo = 1
      this.searchParam.params.searchLogId = this.searchLogId
      this.searchParam.params.sortItem = ['_score,desc']
      this.normalSearch(this.searchParam)
    },
    timeSortTop() {
      this.loading = true
      this.fullscreenLoading = true
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
      this.fullscreenLoading = true
      this.isTimeSortTop = false
      this.isTimeSortBottom = true
      this.isRelativitySortActiveTop = false
      this.isRelativitySortActiveBottom = false
      this.searchParam.pageNo = 1
      this.searchParam.params.searchLogId = this.searchLogId
      this.searchParam.params.sortItem = ['updateTime,desc']
      this.normalSearch(this.searchParam)
    },
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
    },

    async download(fileUrl, docId) {
      await downloadFile({ 'fileUrl': fileUrl, 'docId': docId, 'searchLogId': this.searchLogId })
    },
    showSLT(item) {
      // 成功回调函数停止加载
      if (item) {
        this.sltData = item
        this.sltData.searchLogId = this.searchLogId
        this.centerDialogVisible = true
      }

      /* this.$nextTick(() => {
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
      }) */
    },
    closeSLT() {
      this.centerDialogVisible = false
      /* this.kkfileviewurl = ''
      const slt = document.getElementsByClassName('el-loading-mask')
      // console.log(slt)
      for (let i = 0; i < slt.length; i++) {
        // slt[i].style.visibility = 'visible'
        slt[i].style.visibility = 'hidden'
      } */
    },
    copyUrl(i) {
      document.getElementById('urlcoby' + i).select()
      document.execCommand('copy')
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.loading = true
      this.searchParam.pageSize = val
      this.searchParam.pageNo = 1
      this.normalSearch(this.searchParam)
      // this.loading = false
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.loading = true
      this.searchParam.pageNo = val

      this.normalSearch(this.searchParam)
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
    },
    closeDiyFileSizeDialog() {
      this.diysizefrommessage = ''
      this.diysizetomessage = ''
      // this.searchParam.params.fileSizeFrom = ''
      // this.searchParam.params.fileSizeTo = ''
      // this.
    },
    // 判断是否需要变粗体
    getIsBolder(scope) {
      let flag = false
      if (scope.node) {
        const res = function (node) {
          if (!tools.isBlank(node)) {
            if (node.checked) {
              flag = true
              return flag
            } else {
              if (!tools.isBlank(node.childNodes)) {
                for (const iterator of node.childNodes) {
                  res(iterator)
                }
              }
            }
          }
        }
        res(scope.node)
      }
      return flag
    },
    // stateChange() {
    //   this.sltLoading = false
    // }
    // 重置高级检索
    resetFilterClick() {
      this.advanceparams.allKeyWords = ''
      // this.advanceparams.arbitraryWords = ''
      this.advanceparams.notIncludeKeyWords = ''
      this.advanceparams.radioTime = '0'
      this.advanceparams.radioDiyTime = []
      this.advanceparams.fileType = []
      this.advanceparams.fileSize = []
      // this.advanceparams.diysizefrom = ''
      // this.advanceparams.diysizeto = ''
      this.fileSizeDiy = false
      this.advanceparamsDiysizeFrom = ''
      this.advanceparamsDiysizeTo = ''
      this.advanceparams.dataSource = ''
      this.advanceparamsDataSourceFilePath = ''
      this.advanceparams.dataSourceSearch = ''
      this.advanceparams.radioSort = 'rel'
    },
    // 隐藏显示过滤条件
    putFilterClick() {
      this.isAdvanceFlag = !this.isAdvanceFlag
    },
    // 设置个人标签按钮
    setLabel(item) {
      this.personLabelDialogVisible = !this.personLabelDialogVisible
      this.perDialogList = item
      // console.log(item)
    },
    // 取消标签
    personLabelRemoveClick(val) {
      // console.log()
      this.hasSetLabelList.splice(this.hasSetLabelList.findIndex(list => list === val), 1)
      this.personlabelList.unshift(val)
      // document.getElementById('animation_' + item.id).style.transform = 'translate(0px, 70px)'
    },
    // 打标签
    personLabelAddClick(val) {
      if (this.hasSetLabelList.length > 8) {
        this.$message.closeAll()
        this.$message({
          message: '文档已设置9个标签，请取消部分标签，再重新设置！',
          type: 'warning'
        })
        return false
      } else {
        this.personlabelList.splice(this.personlabelList.findIndex(list => list === val), 1)
        this.hasSetLabelList.unshift(val)
      }
    },
    // 添加新标签
    setNewLabel(val) {
      // hasSetLabelList
      // personlabelList
      // newLabelValue
      // console.log(this.personlabelList.map(item => { return item.name }))
      if (val) {
        if (val.length > 6) {
          this.$message.closeAll()
          this.$message({
            message: '标签被限制在6个字符以内，请调整重新输入！',
            type: 'warning'
          })
          return false
        } else if (this.personlabelList.includes(val)) {
          this.$message.closeAll()
          this.$message({
            message: '标签已存在，请调整重新输入！',
            type: 'warning'
          })
          return false
        } else if (this.hasSetLabelList.length + this.personlabelList.length > 29) {
          this.$message.closeAll()
          this.$message({
            message: '标签最大数量为30个，已超出！',
            type: 'warning'
          })
          return false
        } else {
          this.personlabelList.unshift(val)
        }
      }
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
      if (this.pop_advanceOBJ.searchLabel.includes(val)) {
        this.pop_advanceOBJ.searchLabel.splice(this.pop_advanceOBJ.searchLabel.indexOf(val), 1)
      } else {
        this.pop_advanceOBJ.searchLabel.push(val)
      }
      this.keyWords = this.pop_advanceOBJ.searchLabel.toString()
    },
    // 主题搜索
    getThemeValue(value) {
      console.log(value)
      this.keyWords = value[1]
    },
    fileTypeCheckbox() {
      // todo
    },
    fileSizeChange(val) {
      if (val.length > 1) {
        if (val.contains('diy')) {
          const diyIndex = val.indexOf('diy')
          // console.log(diyIndex)
          if (diyIndex > -1) {
            if (!this.fileSizeDiy) {
              this.advanceparams.fileSize = ['diy']
            } else {
              val.splice(diyIndex, 1)
              // console.log(val)
              this.advanceparams.fileSize = val
            }
          }
        } else {
          //
        }
      }
      if (val.contains('diy')) {
        // console.log('111')
        this.fileSizeDiy = true
        this.advanceparams.fileSize = ['diy']
      } else {
        this.fileSizeDiy = false
        // this.advanceparams.diysizefrom = ''
        // this.advanceparams.diysizeto = ''
        this.advanceparamsDiysizeFrom = ''
        this.advanceparamsDiysizeTo = ''
      }
    },
    dataSourceChange(val) {
      // console.log(val)
      if (val) {
        this.advanceparams.dataSource = val
        // this.dataSource = val
        console.log(this.dataSource)
        this.filePathInputEnable = true
        this.advanceparamsDataSourceFilePath = ''
      } else {
        this.filePathInputEnable = false
        this.advanceparamsDataSourceFilePath = ''
      }
    },
    async getFilePath(queryString, dataSource) {
      const res = await getFilePath({ queryString, dataSource })
      if (res && res.success) {
        for (var i = 0; i < res.datas.filePaths.length; i++) {
          this.suggestFilePaths.push({
            id: i,
            value: res.datas.filePaths[i].slice(2),
            fullFilePath: res.datas.filePaths[i]
          })
        }
      }
    },
    handleFilePathSelect(item) {
      // 被选中完整文件目录（包括盘符）
      const fullFilePath = item.fullFilePath
      this.selectedFullFilePath = fullFilePath
      this.listSearchInputReadyonlyFlag = true
      // const divinpuut = document.createElement('div')
      // divinpuut.className = 'div_inpuut'
      // document.querySelector('.search_params_item .select_input_value').appendChild(divinpuut)
    },
    queryFilePathSearch(queryString, cb) {
      this.suggestFilePaths = []
      const dataSource = this.advanceparams.dataSource
      // console.log(dataSource)
      this.getFilePath(queryString, dataSource)
      // 调用 callback 返回建议列表的数据
      cb(this.suggestFilePaths)
    },
    radioTimeChange(val) {
      // console.log(val)
      if (val !== 'diy') {
        this.advanceparams.radioDiyTime = []
      }
    }
  }
}
</script>
<style scoped>
#box {
  width: 100%;
  position: relative;
  overflow: hidden;
}
#left {
  /* width: calc(30% - 5px); */
  float: left;
  overflow: auto;
}
#resize {
  position: relative;
  width: 5px;
  cursor: w-resize;
  float: left;
}
#right {
  width: 70%;
  float: left;
  overflow: hidden;
}
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
  display: ruby;
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
  margin-right: 20px;
  margin-top: 15px;
  padding: 0 5px;
  text-align: center;
  user-select: none;
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
  cursor: pointer;
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
  left: 205px;
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
  overflow: auto;
  box-shadow: -26px 0 26px -26px rgba(68, 100, 163, 0.2),
    0 26px 26px -26px rgba(68, 100, 163, 0.2),
    26px 0 26px -26px rgba(68, 100, 163, 0.2);
  /* transition: all 0.3s linear; */
}
.anim {
  transition: all 0.3s linear;
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
  /* height: 40px; */
  color: #333333;
  margin-bottom: 15px;
  box-sizing: border-box;
  /* line-height: 40px; */
  display: flex;
  justify-content: left;
  padding: 5px 0;
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
  width: auto;
  margin-left: 20px;
  border-radius: 4px;
  border-color: #cccccc;
}
.search_params_item .el-radio-group {
  display: flex;
  align-items: center;
  justify-items: left;
  margin-left: 20px;
  flex-wrap: wrap;
}
.search_params_item .el-radio-group label {
  margin-right: 30px;
}
.search_params_item .el-checkbox-group {
  display: flex;
  align-items: center;
  justify-items: left;
  margin-left: 20px;
  flex-wrap: wrap;
}
.search_params_item .el-checkbox-group label {
  margin-right: 30px;
}
.search_params_item .el-range-editor.el-input__inner {
  border-color: #cccccc;
}
.diy_filesize {
  max-width: 380px;
  height: 40px;
  line-height: 38px;
  /* border: 1px solid #cccccc; */
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  position: relative;
}
.diy_filesize .from,
.diy_filesize .to {
  max-width: 200px;
  margin-left: 0;
  border: 1px solid #cccccc;
}
.zhi {
  display: block;
  min-width: 30px;
  text-align: center;
}
.item_select {
  min-width: 100px;
  width: auto;
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
.person_Label_list .icon-label {
  color: #999999;
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
  top: -3px;
  right: 2px;
}
.person_Label_list li:hover:after {
  position: absolute;
  content: "+";
  color: #2d7a9c;
  font-size: 18px;
  top: -3px;
  right: 2px;
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
  transition: all 0.3s linear;
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
  box-shadow: 0px 2px 4px 1px rgba(45, 122, 156, 0.2);
  border-radius: 6px 6px 0px 0px;
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
.iv-seach-tree .el-tree-node[aria-checked="true"] > .el-tree-node__content {
  font-weight: bolder;
}
.qxz {
  margin-top: 10px;
  margin-left: 5px;
}
.qxz .el-radio-group {
  display: inline-block;
  margin-left: 20px;
  width: 159px;
}
.qxz .el-radio-group .el-radio {
  color: #333333;
  margin-top: 0;
}
.f_bolder {
  font-weight: bolder;
}
.icon-shuaxin {
  color: #2d7a9c;
}
.kb {
  margin-left: 5px;
}
.icon-open-copy,
.icon-open {
  color: #2d7a9c;
}
</style>

