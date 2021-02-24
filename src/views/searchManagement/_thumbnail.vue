<template>
  <el-dialog
    v-model="docObj"
    :title="$t('es.thumbnail')"
    :visible.sync="isShow"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    class="sltDialog"
    :before-close="handleDialogClose"
    @close="close"
  >
    <div class="each_r_top">
      <div class="each_r_top_left">
        <span><i class="iconfont icon-wenjianjia" />{{ docObj.dataSource }}</span>
        <div class="each_m" :title="docObj.filePath">
          <i class="iconfont icon-wendang" />{{ docObj.filePath }}
        </div>
        <span v-if="docObj.updateBy != ''"><i class="iconfont icon-wode" />{{ docObj.updateBy }}</span>
        <span v-else-if="docObj.updateBy == '' && docObj.createBy != ''"><i class="iconfont icon-wode" />{{ docObj.createBy }}</span>
      </div>
    </div>
    <div class="each_r_title">
      <img v-if="docObj.fileType=='Excel'" src="../../assets/img/filetype/excel.png">
      <img v-else-if="docObj.fileType=='Word'" src="../../assets/img/filetype/word.png">
      <img v-else-if="docObj.fileType=='PowerPoint'" src="../../assets/img/filetype/PPT.png">
      <img v-else-if="docObj.fileType=='Pdf'" src="../../assets/img/filetype/PDF.png">
      <img v-else-if="docObj.fileType=='Text'" src="../../assets/img/filetype/TXT.png">
      <img v-else-if="docObj.fileType=='Image'" src="../../assets/img/filetype/img.png">
      <img v-else-if="docObj.fileType=='zip'" src="../../assets/img/filetype/excel.png">
      <img v-else-if="docObj.fileType=='Media'" src="../../assets/img/filetype/other.png">
      <img v-else src="../../assets/img/filetype/other.png">
      <span v-html="docObj.fileName" />
      <img v-if="docObj.language=='CN'" class="each_lan" src="../../assets/img/cn_ico.png">
      <img v-else-if="docObj.language=='EN'" class="each_lan" src="../../assets/img/en_ico.png">
      <img v-else-if="docObj.language=='JP'" class="each_lan" src="../../assets/img/jp_ico.png">
      <img v-else class="each_lan" src="../../assets/img/other2.png">
    </div>
    <div class="each_r_con">
      {{ docObj.updateTime }}  {{ docObj.fileSizeDescription }}KB - {{ docObj.fileType }}
    </div>
    <div class="slt">
      <iframe v-if="docObj.fileType!='Others'" ref="kkfileviewIframe" width="100%" frameborder="0" height="100%" :src="kkfileviewurl" name="iframe_a" />
      <img v-else src="../../assets/img/slt_empty.png">
    </div>
    <div class="slt_down" @click="download(docObj.fileUrl, docObj.id, docObj.searchLogId)">
      <i class="iconfont icon-Group-" />{{ $t('es.download') }}
    </div>
  </el-dialog>
</template>
<script>

import { downloadFile } from '@/api/es/es-api'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    docObj: {
      type: Object,
      default: function() {
        return {}
      }
    },
    docId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      theme: 'Light',
      kkfileviewurl: ''
    }
  },
  watch: {
    'isShow': function(newVal, oldVal) {
      if (newVal === true) {
        this.show()
      }
    }
  },
  mounted() {
    // this.getList()
    // // console.log('itemsData', this.itemsData)
  },
  methods: {
    async download(fileUrl, docId, searchLogId) {
      await downloadFile({ 'fileUrl': fileUrl, 'docId': docId, 'searchLogId': !searchLogId ? '-1' : searchLogId })
    },
    show() {
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
        const url = baseApi + this.docObj.id
        var previewUrl = url + '?fullfilename=' + new Date().getTime() + '.' + this.docObj.fileExtend
        const kkfileviewSrc = contextPath + '/preview/onlinePreview?url=' + encodeURIComponent(previewUrl)
        // const kkfileviewSrc = 'http://localhost/preview/onlinePreview?url=' + encodeURIComponent(previewUrl)
        this.kkfileviewurl = kkfileviewSrc
        if (this.docObj.fileType === 'Others') {
          loading.close()
        }
      })
    },
    // 关闭文档预览回调方法
    close() {
      this.kkfileviewurl = ''
      const slt = document.getElementsByClassName('el-loading-mask')
      for (let i = 0; i < slt.length; i++) {
        // slt[i].style.visibility = 'visible'
        slt[i].style.visibility = 'hidden'
      }
      // console.log('kk-close')
    },
    onClose() {
      // console.log('kk-onClose')
      this.$emit('onClose')
    },
    onConfirm() {
    },
    handleDialogClose() {
      // console.log('kk-handleDialogClose')
      this.$emit('onClose')
    }
  }
}
</script>
<style lang="scss">
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
  display:ruby;
  max-width: 70%;
  height: 25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.each_r_title img {
  margin-right: 5px;
  margin-bottom: 8px;
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
