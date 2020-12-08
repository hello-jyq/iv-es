<template>
    <div class="result_box">
        <div :class="isCollapse?'result_DIY result_filter_all':'result_DIY result_filter'">
          <div class="title_box">
            <ul>
              <li v-for="(item,index) in 5" :key="index" :class="active==index?'active':''" @click="active=index" :title="'文件服务器'+(index+1)">文件服务器{{index+1}}</li>
            </ul>
          </div>
          <div class="con_box" :class="active==index?'show':''" v-for="(item,index) in 5" :key="item.index">
            <div class="left_result">
              <div class="search_num" @click="istree=!istree">
                <i class="iconfont icon-sousuo2" />
                <span>搜索结果数量</span>
                <i class="iconfont icon-ai-arrow-down" :class="istree?'':'icon_gif'"></i>
              </div>     
              <el-tree
              v-show="istree"
                :data="data"
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
                >             
              </el-tree>

              <div class="search_num" style="margin-top:30px" @click="ischeck=!ischeck">
                  <i class="iconfont icon-duomeitiicon-" />
                  <span>文档类型</span>
                  <i class="iconfont icon-ai-arrow-down" :class="ischeck?'':'icon_gif'"></i>
              </div>
              <el-checkbox-group v-model="filecheckList" v-show='ischeck'>
                <el-checkbox label="Word (11)"></el-checkbox>
                <el-checkbox label="Excel (12)"></el-checkbox>
                <el-checkbox label="PowerPoint (22)"></el-checkbox>
                <el-checkbox label="Adobe Acrobat PDF (44)"></el-checkbox>
                <el-checkbox label="文本类 (54)"></el-checkbox>
                <el-checkbox label="图像类 (77)"></el-checkbox>
                <el-checkbox label="压缩类 (22)"></el-checkbox>
                <el-checkbox label="媒体类 (54)"></el-checkbox>
                <el-checkbox label="其他类型 (7997)"></el-checkbox>
              </el-checkbox-group> 
        
              <div class="search_num" style="margin-top:30px" @click="isradio=!isradio">
                  <i class="iconfont icon-shijian" />
                  <span>更新时间</span>
                  <i class="iconfont icon-ai-arrow-down" :class="isradio?'':'icon_gif'"></i>
              </div>
              <el-radio-group v-model="radioList" v-show="isradio">
                 <el-radio :label="0">全部时间 (188)</el-radio>
                  <el-radio :label="1">一天内 (33)</el-radio>
                  <el-radio :label="2">一周内 (33)</el-radio>
                  <el-radio :label="3">一月内 (66)</el-radio>
                  <el-radio :label="4">半年内 (33)</el-radio>
                  <el-radio :label="5">一年内 (55)</el-radio>
                  <el-radio :label="6">自定义时间</el-radio>
               </el-radio-group>
              <div class="block" v-show="isradio">        
                  <el-date-picker
                  popper-class="date_picker"
                    v-model="radiotime"
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
                  <el-checkbox label="100K - 500K (33)"></el-checkbox>
                  <el-checkbox label="500K - 1M (33)"></el-checkbox>
                  <el-checkbox label="1M - 100M (33)"></el-checkbox>
                  <el-checkbox label="100M以上 (33)"></el-checkbox>
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
                <el-checkbox-group v-model="lancheckList" v-show='isfile'>
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
                  v-model="searchs"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入您想要搜索的内容"
                  :trigger-on-focus="false"
                  popper-class="search_input"
                >
                <i slot="prefix" class="iconfont icon-sousuo1"></i>
                <el-button slot="suffix" @click="search">搜&nbsp;&nbsp;索</el-button>
              </el-autocomplete>
            </el-col>
            <el-col :span="24" class="flex_ceter" style="height:24px;line-height:24px">
              <span class="font_size_14 fontC_333">搜索条件：</span>
              <el-radio-group v-model="radio">
                <el-radio label="all">不限</el-radio>
                <el-radio label="fileName">文件名</el-radio>
                <el-radio label="fileCon">文件内容</el-radio>
              </el-radio-group>
              <el-select v-model="lang" placeholder="所有语言" placement="top-end" @change="getLang" popper-class="lang_select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>   
       
         <div class="main_box" v-loading="loading">
            <div class="result_header">
              <span>找到约41,300条结果(用时0.55秒)</span>
              <div class="result_header_filter">
                  结果排序：<span @click="isrelativity=!isrelativity">相关度<i class="iconfont icon-xuanze" :class="isrelativity?'icon_active':''"/></span><span  @click="istime=!istime">时间<i class="iconfont icon-xuanze" :class="istime?'icon_active':''"/></span>
                  <!-- <div class="pop_btn"><i class="iconfont icon-sousuo2"/></div> -->
              </div>
             
            </div>
            <div class="result_main" v-if="results!=''">
                <div class="each_reult">
                  <div class="each_r_top">
                    <div>
                      <span><i class="iconfont icon-wenjianjia"/>文件服务器一</span>
                      <span><i class="iconfont icon-wendang"/>\菱威深搜索系统项目\搜索引擎\设计稿</span>
                      <span><i class="iconfont icon-wode"/>李四</span>
                    </div>
                    <span class="each_down">
                     <i class="iconfont  icon-Group-"/>点击下载
                    </span>
                  </div>
                  <div class="each_r_title" >
                    <img src="../../assets/img/PPT.png"/>
                    <span @click="centerDialogVisible = true">ns <span class="key">neuron</span> Solr Cloud. pptx</span>
                    <img class="each_lan" src="../../assets/img/cn_ico.png"/>
                  </div>
                  <div class="each_r_con">
                    2020-11-11 12:00:00 900KB - Powerpoint プレゼンテーションエンタープライズサーチシステム[<span class="key">Neuron</span>が利用するテクノロジ Solrcloudプレインズテクノロジー株式会社 Copyright(ctプレゼンテーションエンタープライズサーチシステム[Neuronが利用するテクノロジ…
                  </div>
                  <div class="each_r_url" id="eachurl">
                    <input id="urlcoby" value="192.168.0.0\菱威深搜索系统项目\搜索引擎\设计稿" style="display:none"/>
                    192.168.0.0\菱威深搜索系统项目\搜索引擎\设计稿 - <span @click="copyUrl">点击可复制路径</span>
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
                <div class="each_reult">
                  <div class="each_r_top">
                    <div>
                      <span><i class="iconfont icon-wenjianjia"/>文件服务器一</span>
                      <span><i class="iconfont icon-wendang"/>\菱威深搜索系统项目\搜索引擎\设计稿</span>
                      <span><i class="iconfont icon-wode"/>李四</span>
                    </div>
                    <span class="each_down">
                     <i class="iconfont  icon-Group-"/>点击下载
                    </span>
                  </div>
                  <div class="each_r_title" >
                    <img src="../../assets/img/PDF.png"/>
                    <span @click="centerDialogVisible = true">ns <span class="key">neuron</span> Solr Cloud. pptx</span>
                    <img class="each_lan" src="../../assets/img/cn_ico.png"/>
                  </div>
                  <div class="each_r_con_p">
                   <div class="each_r_con_p_img"><img src="../../assets/img/search_pdf.png"/></div> 2020-11-11 12:00:00 900KB - image 点击查看内容
                  </div>
                  <div class="each_r_url" id="eachurl">
                    <input id="urlcoby" value="192.168.0.0\菱威深搜索系统项目\搜索引擎\设计稿" style="display:none"/>
                    192.168.0.0\菱威深搜索系统项目\搜索引擎\设计稿 - <span @click="copyUrl">点击可复制路径</span>
                  </div>
                  <div class="each_r_lable">
                    <ul>
                      <li><i class="iconfont icon-label"/>电子商务</li>
                      <li><i class="iconfont icon-label"/>网络推广</li>
                      <li><i class="iconfont icon-label"/>报表合同</li>
                      <li class="set_label"><i class="iconfont icon-label"/>设置个人标签</li>
                    </ul>
                  </div>
                </div>
                <div class="each_reult">
                  <div class="each_r_top">
                    <div>
                      <span><i class="iconfont icon-wenjianjia"/>文件服务器一</span>
                      <span><i class="iconfont icon-wendang"/>\菱威深搜索系统项目\搜索引擎\设计稿</span>
                      <span><i class="iconfont icon-wode"/>李四</span>
                    </div>
                    <span class="each_down">
                     <i class="iconfont  icon-Group-"/>点击下载
                    </span>
                  </div>
                  <div class="each_r_title" >
                    <img src="../../assets/img/excel.png"/>
                    <span @click="centerDialogVisible = true">ns <span class="key">neuron</span> Solr Cloud. pptx</span>
                    <img class="each_lan" src="../../assets/img/jp_ico.png"/>
                  </div>
                  <div class="each_r_con">
                    2020-11-11 12:00:00 900KB - Powerpoint プレゼンテーションエンタープライズサーチシステム[<span class="key">Neuron</span>が利用するテクノロジ Solrcloudプレインズテクノロジー株式会社 Copyright(ctプレゼンテーションエンタープライズサーチシステム[Neuronが利用するテクノロジ…
                  </div>
                  <div class="each_r_url" id="eachurl">
                    <input id="urlcoby" value="192.168.0.0\菱威深搜索系统项目\搜索引擎\设计稿" style="display:none"/>
                    192.168.0.0\菱威深搜索系统项目\搜索引擎\设计稿 - <span @click="copyUrl">点击可复制路径</span>
                  </div>
                  <div class="each_r_lable">
                    <ul>
                      <li class="set_label"><i class="iconfont icon-label"/>设置个人标签</li>
                    </ul>
                  </div>            
                </div>
                <div class="each_reult">
                  <div class="each_r_top">
                    <div>
                      <span><i class="iconfont icon-wenjianjia"/>文件服务器一</span>
                      <span><i class="iconfont icon-wendang"/>\菱威深搜索系统项目\搜索引擎\设计稿</span>
                      <span><i class="iconfont icon-wode"/>李四</span>
                    </div>
                    <span class="each_down">
                     <i class="iconfont  icon-Group-"/>点击下载
                    </span>
                  </div>
                  <div class="each_r_title" >
                    <img src="../../assets/img/word.png"/>
                    <span @click="centerDialogVisible = true">ns <span class="key">neuron</span> Solr Cloud. pptx</span>
                    <img class="each_lan" src="../../assets/img/jp_ico.png"/>
                  </div>
                  <div class="each_r_con">
                    2020-11-11 12:00:00 900KB - Powerpoint プレゼンテーションエンタープライズサーチシステム[<span class="key">Neuron</span>が利用するテクノロジ Solrcloudプレインズテクノロジー株式会社 Copyright(ctプレゼンテーションエンタープライズサーチシステム[Neuronが利用するテクノロジ…
                  </div>
                  <div class="each_r_url" id="eachurl">
                    <input id="urlcoby" value="192.168.0.0\菱威深搜索系统项目\搜索引擎\设计稿" style="display:none"/>
                    192.168.0.0\菱威深搜索系统项目\搜索引擎\设计稿 - <span @click="copyUrl">点击可复制路径</span>
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
                <div class="each_reult">
                  <div class="each_r_top">
                    <div>
                      <span><i class="iconfont icon-wenjianjia"/>文件服务器一</span>
                      <span><i class="iconfont icon-wendang"/>\菱威深搜索系统项目\搜索引擎\设计稿</span>
                      <span><i class="iconfont icon-wode"/>李四</span>
                    </div>
                    <span class="each_down">
                     <i class="iconfont  icon-Group-"/>点击下载
                    </span>
                  </div>
                  <div class="each_r_title" >
                    <img src="../../assets/img/TXT.png"/>
                    <span @click="centerDialogVisible = true">ns <span class="key">neuron</span> Solr Cloud. pptx</span>
                    <img class="each_lan" src="../../assets/img/jp_ico.png"/>
                  </div>
                  <div class="each_r_con">
                    2020-11-11 12:00:00 900KB - Powerpoint プレゼンテーションエンタープライズサーチシステム[<span class="key">Neuron</span>が利用するテクノロジ Solrcloudプレインズテクノロジー株式会社 Copyright(ctプレゼンテーションエンタープライズサーチシステム[Neuronが利用するテクノロジ…
                  </div>
                  <div class="each_r_url" id="eachurl">
                    <input id="urlcoby" value="192.168.0.0\菱威深搜索系统项目\搜索引擎\设计稿" style="display:none"/>
                    192.168.0.0\菱威深搜索系统项目\搜索引擎\设计稿 - <span @click="copyUrl">点击可复制路径</span>
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
                  :current-page="currentPage1"
                  background
                  :page-sizes="[10, 50, 100, 500]"
                  :page-size="10"
                  layout="total, sizes"
                  :total="500"
                  class='pagination_left'
                  >
                </el-pagination>                
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage1"
                  background
                  :page-sizes="[10, 50, 100, 500]"
                  :page-size="10"
                  layout=" pager, next,slot"
                  :total="500"
                   class='pagination_right'
                  >
                  <button type="button" class="last-pager" @click="jumpPage('0')"><i class="iconfont icon-Group-1"></i></button>   
                </el-pagination>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage1"
                  background
                  :page-sizes="[10, 50, 100, 500]"
                  :page-size="10"
                  layout="slot, prev"
                  :total="500"
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
          > 
            <div class="each_r_top">
              <div>
                <span><i class="iconfont icon-wenjianjia"/>文件服务器一</span>
                <span><i class="iconfont icon-wendang"/>\菱威深搜索系统项目\搜索引擎\设计稿</span>
                <span><i class="iconfont icon-wode"/>李四</span>
              </div>
            </div>
            <div class="each_r_title" @click="centerDialogVisible = true">
              <img src="../../assets/img/PPT.png"/>
              <span>ns <span class="key">neuron</span> Solr Cloud. pptx</span>
              <img class="each_lan" src="../../assets/img/cn_ico.png"/>
            </div>
            <div class="each_r_con">
              2020-11-11 12:00:00 900KB - Powerpoint
            </div>
            <div class="slt"><iframe width="100%"     frameborder="0" height="100%" src="https://file.keking.cn/onlinePreview?url=https%3A%2F%2Ffile.keking.cn%2Fdemo%2F%E6%9E%97%E7%89%B9%E4%BA%A7%E5%93%81%E7%94%B5%E5%AD%90%E5%95%86%E5%8A%A1%E5%AD%B5%E5%8C%96%E5%AE%9E%E8%AE%AD%E5%B9%B3%E5%8F%B0%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C.pptx&officePreviewType=pdf"></iframe></div> 
            <div class="slt_down"><i class="iconfont icon-Group-"/>点击下载</div>    
        </el-dialog>
        <el-dialog
          title="自定义文件大小"
          :visible.sync="filesizeDialogVisible"
          :close-on-click-modal="false"
          class="diyfilesize"
          > 

            <div class="each_r_con">
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
            </div>  
        </el-dialog>
    </div>
</template>
<script>

export default {
  data() {
    return {
      restaurants: [{ value: '1' }, { value: '21' }, { value: '311贝斯1' }, { value: '43123' }, { value: '5' }, { value: '贝斯无锡1' }, { value: '贝斯无锡信息系统' }, { value: '73123' }, { value: '8' }],
      searchs: this.$route.query.search,
      radio: this.$route.query.radio,
      lang: this.$route.query.lang,
      options: [{
        value: 'cn',
        label: '中文'
      }, {
        value: 'en',
        label: '英文'
      }, {
        value: 'ja',
        label: '日文'
      }],
      centerDialogVisible: false,
      filesizeDialogVisible: false,
      active: 1,
      loading: false,
      data: [{
        id: 1,
        label: '一级 2 (4)',
        children: [{
          id: 3,
          label: '二级 2-1 (3)',
          children: [{
            id: 4,
            label: '三级 3-1-1 (2)222222222222222222222222222222',
            children: [{
              id: 9,
              label: '四级 4-1-1'
            }, {
              id: 10,
              label: '四级 4-1-2'
            }, {
              id: 11,
              label: '四级 4-1-3',
              disabled: true
            }, {
              id: 12,
              label: '四级 4-1-4 (1)',
              children: [{
                id: 14,
                label: '五级 5-4-1'
              }, {
                id: 15,
                label: '五级 5-4-2',
                disabled: true
              }]
            }, {
              id: 13,
              label: '四级 4-1-5',
              disabled: true
            }]
          }, {
            id: 5,
            label: '三级 3-1-2',
            disabled: true
          }]
        }, {
          id: 2,
          label: '二级 2-2 (1)',
          disabled: true,
          children: [{
            id: 6,
            label: '三级 3-2-1'
          }, {
            id: 7,
            label: '三级 3-2-2',
            disabled: true
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      istree: true,
      ischeck: true,
      isradio: true,
      issize: true,
      isfile: true,
      filecheckList: ['Word (11)', '图像类 (77)'],
      radioList: 4,
      radiotime: '',
      sizecheckList: ['500K - 1M (33)', '100M以上 (33)'],
      diysizefrom: '',
      diysizeto: '',
      isrelativity: '',
      istime: '',
      lancheckList: ["全部语言"],
      results: "1",
      currentPage1: 5,

      // isCollapse: this.$store.state.falg
    }
  },

  created() {
    console.log(this.$route.query)
    // console.log('搜索', this.$store.state.falg)
  },
  computed: {
    isCollapse() {
      return this.$store.state.falg
    }
  },
  methods: {
    search() {

    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().includes(queryString.toLowerCase()) === true);
      };
    },
    getLang(value) {
      this.lang = value
    },
    diysize() {
      console.log(this.sizecheckList.length)
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
    checkboxChange(e) {
      if (e.includes("自定义大小") && e.length > 1) {
        this.sizecheckList.splice(this.sizecheckList, 1)
      }
    },
    copyUrl() {
      document.getElementById("urlcoby").select();
      console.log(document.getElementById("urlcoby").select())
      document.execCommand("copy");
      alert('复制成功')
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
  height: 30px;
  box-shadow: 0px 2px 4px 1px rgba(45, 122, 156, 0.2);
}
.con_box {
  height: calc(100vh - 114px);
  padding: 20px 0 20px 20px;
  display: none;
  box-sizing: border-box;
  overflow: hidden;
}
.left_result {
  height: 100%;
  overflow: auto;
}
.title_box li {
  width: 44px;
  height: 30px;
  float: left;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #999999;
  line-height: 30px;
  padding: 0 2px;
  text-align: center;
  box-shadow: 0px 2px 4px 1px rgba(45, 122, 156, 0.2);
  border-radius: 6px 6px 0px 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.title_box li.active {
  width: 104px;
  background: #2d7a9c;
  box-shadow: 0px 2px 4px 1px rgba(45, 122, 156, 0.2);
  border-radius: 6px 6px 0px 0px;
  font-family: "微软雅黑";
  color: #ffffff;
}
.result_filter_all .title_box li {
  width: 100px;
  height: 30px;
}
.result_filter_all .title_box li.active {
  width: 100px;
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
  height: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-family: "微软雅黑";
  color: #333333;
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