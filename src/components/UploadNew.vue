<template>
  <div>
    <el-dialog
      title="上传画面"
      :visible.sync="isShow"
      class="content-dialog-box upload-dialog"
      :close-on-click-modal="false"
      custom-class="dialog-drag"
      top="0"
      :before-close="handleClose"
    >
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        :headers="{'X-CSRF-TOKEN': csrfToken}"
        :action="action"
        :auto-upload="false"
        :on-success="handleSuccess"
        :on-error="handelError"
        :on-remove="handleRemove"
        :data="otherParams"
        :accept="accept"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :on-change="handleChange"
        :http-request="uploadFile"
      >
        <i class="iconfont iconshangchuan1" />
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <!-- <div slot="tip" class="el-upload__tip">
          只能上传.xlsx文件，且不超过10MB
        </div> -->
      </el-upload>
      <div class="upload-btn" @click="submitUpload">
        <span class="operation-text"><i class="iconfont iconshangchuan" /></span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上&nbsp;传
      </div>
      <div class="upload-bg-box">
        <div class="detail-header">
          处理详情
        </div>
        <div class="detail-time">
          <div class="detail-time-left">
            {{ uploadInfo.startDate }}
          </div>
          <div class="detail-time-line" />
          <div class="detail-time-right">
            {{ uploadInfo.endDate }}
          </div>
        </div>
        <div class="detail-info">
          <ul class="filelist">
            <div class="scroll-info-list">
              <!-- <li class="info-err">
                交际费1：数字类型不正确，请输入数字。（当前值：a）
              </li>
              <li class="info-err">
                交际费2：数字类型不正确，请输入数字。（当前值：b）
              </li> -->
              <li v-for="(errorInfo,i) in errorDetails" :key="i" class="info-err">
                {{ errorInfo }}
              </li>
              <li>
                {{ resultInfo }}
              </li>
            </div>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { upload } from '@/utils/request'
import $ from 'jquery'
import 'jquery.nicescroll'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      required: true
    },
    otherParams: {
      type: Object,
      default: null
    },
    accept: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      fileList: [],
      fileObj: '',
      fileData: '',
      uploadInfo: {
        startDate: '',
        endDate: ''
      },
      errorDetails: [],
      resultInfo: '',
      scrollColr: localStorage.getItem('theme') !== 'Dark' ? '#D8E0E8' : '#5A5E63',
      contextPath: process.env.VUE_APP_CONTEXT_PATH ? process.env.VUE_APP_CONTEXT_PATH : ''
    }
  },
  computed: {
    ...mapGetters([
      'csrfToken'
    ])
  },
  watch: {
    'isShow': function(newVal, oldVal) {
      if (newVal === false) {
        // // console.log(this.$refs.upload)
        this.resetForm()
      }
    }
  },
  mounted() {
    this.draggable()
    this.$nextTick(function() {
      this.getScrollBar()
    })
  },
  methods: {
    resetForm() {
      this.fileList = []
      this.fileObj = ''
      this.fileData = ''
      this.uploadInfo.startDate = ''
      this.uploadInfo.endDate = ''
      this.errorDetails = []
      this.resultInfo = ''
    },
    resetInfo() {
      this.uploadInfo.startDate = ''
      this.uploadInfo.endDate = ''
      this.errorDetails = []
      this.resultInfo = ''
    },
    handleChange(file, fileList) {
      // // console.log('fileList', fileList)
      this.fileList = fileList.slice(-1)
    },
    handleExceed(files, fileList) {
      this.resetInfo()
      this.errorDetails.push('只能选择一个文件上传，若要更换文件请先移除当前文件！')
      // this.$message.warning(`只能选择一个文件上传，若要更换文件请先移除当前文件！`)
    },
    handleClose(done) {
      this.$emit('onClose')
    },
    handleRemove(file, fileList) {
      // // console.log('remove...')
      this.resetForm()
      // this.$refs.upload.clearFiles()
    },
    checkTypeAndSize(file) {
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isLt10M = file.size / 1024 / 1024 < 10

      // // console.log('file', file)
      // // console.log('isLt10M', isLt10M)

      if (!isXLSX) {
        this.errorDetails.push('上传文件只能是 .xlsx 格式！')
        // this.$message.error('上传文件只能是 .xlsx 格式!')
      }
      if (!isLt10M) {
        this.errorDetails.push('上传文件大小不能超过 10MB！')
        // this.$message.error('上传文件大小不能超过 10MB！')
      }
      return isLt10M && isXLSX
    },
    beforeUpload(file) {
      // // console.log('beforeUpload')
      return this.checkTypeAndSize(file)
    },
    uploadFile(file) {
      // // console.log('uploadFile...')
      this.fileData = new FormData()
      // // console.log('otherParams', this.otherParams)
      this.fileData.append('file', file.file)
      this.fileObj = file.file
      if (this.otherParams) {
        // // console.log('otherParams', JSON.stringify(this.otherParams))
        for (const key in this.otherParams) {
          this.fileData.append(key, this.otherParams[key])
        }
      }
      // // console.log('fileData', this.fileData.keys())
      // for (const keys of this.fileData.entries()) {
      //   // console.log(keys)
      // }
    },
    submitUpload() {
      // // console.log('submitUpload')
      // // console.log(this.fileList)
      this.resetInfo()
      if (this.$refs.upload.fileList.length <= 0) {
        this.errorDetails.push('上传文件不能为空！')
        // this.$message.error('上传文件不能为空!')
        return false
      } else {
        // 调用上传并校验
        this.$refs.upload.submit()
        if (this.fileData && this.fileObj && this.checkTypeAndSize(this.fileObj)) {
          this.uploadInfo.startDate = this.dateFtt('yyyy-MM-dd hh:mm:ss', new Date()) + '    上传开始'
          upload(this.action, this.fileData).then(res => {
            // // console.log(this.fileName)
            this.uploadMessage(this.fileName, res)
          }).catch(err => {
            this.uploadMessage(this.fileName, err, false)
          })
        }
      }
    },
    handleSuccess(res, file, fileList) {
      this.uploadMessage([file.name], res)
    },
    handelError(err, file, fileList) {
      this.uploadMessage(file.name, err, false)
    },
    uploadMessage(files = [], res, status = true) {
      const { success, messages, message, warnings } = res
      // // console.log(warnings)
      if (status) {
        if (!success) {
          // // console.log('messages', messages)
          // // console.log('message', message)
          if (messages.length || warnings.length) {
            this.errorDetails = [...messages.map(item => {
              // const args = {}
              // for (const key in item.arguments) {
              //   args[key] = this.$t(item.arguments[key])
              // }
              // return `${this.$t(item.message, args)}`
              return `${this.$t(item.message)}`
            }), ...warnings.map(item => {
              const args = {}
              for (const key in item.arguments) {
                args[key] = this.$t(item.arguments[key])
              }
              return `${this.$t(item.message, args)}`
            })]
          } else {
            this.errorDetails = [`${this.$t(message)}`]
          }
          this.resultInfo = '上传失败！'
          // this.$refs.upload.clearFiles()
        } else {
          if (res.datas.count !== undefined && res.datas.count !== '') {
            this.resultInfo = '文件上传成功，导入条数：' + res.datas.count
          } else {
            this.resultInfo = '文件上传成功！'
          }
          this.$emit('onSuccess')
          // if (warnings.length) {
          //   const html = warnings.map(item => {
          //     const args = {}
          //     for (const key in item.arguments) {
          //       args[key] = this.$t(item.arguments[key])
          //     }
          //     return `<p class="war_icon el-icon-warning">${this.$t(item.message, args)}</p></br>`
          //   }).join('')
          //   this.$alert(html, `文件上传成功!(${files.join(',')})`, {
          //     dangerouslyUseHTMLString: true
          //   })
          // } else {
          //   this.$alert('文件上传成功！', `文件上传成功！(${files.join(',')})`, {
          //     dangerouslyUseHTMLString: true,
          //     type: 'success'
          //   })
          // }
        }
      } else {
        // this.$message({
        //   type: 'error',
        //   message: '上传失败，请稍后再试！'
        // })
        this.resultInfo = '上传失败！'
        $('.scroll-info-list').getNiceScroll().resize()
        // this.$refs.upload.clearFiles()
      }
      this.$nextTick(() => {
        this.uploadInfo.endDate = this.dateFtt('yyyy-MM-dd hh:mm:ss', new Date()) + '    上传结束'
        this.getScrollBar()
        $('.scroll-info-list').getNiceScroll().resize()
      })
      // this.$emit('finish')
    },
    getScrollBar() {
      $('.scroll-info-list').niceScroll({
        cursorcolor: this.scrollColr,
        cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
        cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
        cursorwidth: '8px', // 滚动条的宽度，单位：便素
        cursorborder: `1px solid ${this.scrollColr}`, // CSS方式定义滚动条边框
        autohidemode: true, // 隐藏滚动条的方式, 可用的值:
        zindex: 0,
        railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
        boxzoom: false,
        iframeautoresize: false // 在加载事件时自动重置iframe大小
      })
    },
    draggable() {
      $('.dialog-drag').draggable({
        cursor: 'move',
        handle: '.el-dialog__header',
        refreshPositions: true,
        containment: 'parent',
        stop() {
          $('.el-table__body-wrapper').getNiceScroll().resize()
          $('.el-dialog__body').getNiceScroll().resize()
          $('.scroll-info-list').getNiceScroll().resize()
        }
      })
    },
    dateFtt(fmt, time) {
      let date
      if (!time) {
        date = new Date()
      } else {
        date = new Date(time)
      }
      const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    }
  }
}
</script>
<style lang="scss">
.upload-dialog .dialog-drag {
  width: 800px;
  min-width: 800px;
  height: 620px;
  max-height: 800px;
  .el-icon-close {
    font-size: 22px;
    color: #ffffff;
    font-weight: bold;
  }

  .el-dialog__body {
    // padding: 30px 20px 20px 20px;
    overflow: hidden;
    .el-upload {
      border: 1px solid #cccccc;
      width: 100%;
      height: 204px;
      .el-upload-dragger {
        border: none;
        width: 100%;
        height: 100%;
      }
      .iconshangchuan1 {
        font-size: 140px;
        color: #dddddd;
      }
    }
    .el-upload-list {
      float: left;
      width: calc(100% - 130px);
      margin-top: 10px;
      margin-bottom: 20px;
      .el-upload-list__item {
        width: auto;
      }
      .el-icon-close {
        color: #666666;
      }
    }
    // .el-upload-list {
    //   display: none;
    // }
    .upload-btn {
      width: 130px;
      height: 48px;
      margin-top: 10px;
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 4px 1px rgba(28, 29, 84, 0.15);
      border-radius: 24px;
      padding: 5px;
      line-height: 38px;
      float: right;
      cursor: pointer;
      .operation-text {
        display: inline-block;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        padding: 0;
        text-align: center;
        background: linear-gradient(
          180deg,
          rgba(71, 91, 160, 1) 0%,
          rgba(47, 165, 187, 1) 100%
        );
      }
    }

    .upload-bg-box {
      width: 100%;
      height: 248px;
      border: 1px solid #cccccc;
      margin-top: 75px;
      box-sizing: border-box;
      border-radius: 16px;
      padding: 20px;
      //   overflow: scroll;
      .detail-header {
        width: 100%;
        height: 20px;
        color: #333333;
        font-size: 14px;
        line-height: 20px;
        font-display: "微软雅黑";
      }
      .detail-time {
        padding: 10px 0;
        height: 58px;
        position: relative;
        .detail-time-left {
          width: 316px;
          height: 38px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(204, 204, 204, 1);
          text-align: center;
          line-height: 38px;
          font-size: 14px;
          font-display: "微软雅黑";
          float: left;
        }

        .detail-time-right {
          width: 316px;
          height: 38px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(204, 204, 204, 1);
          text-align: center;
          line-height: 38px;
          font-size: 14px;
          font-display: "微软雅黑";
          float: right;
        }
        .detail-time-right::before {
          content: "";
          position: absolute;
          width: 60px;
          height: 19px;
          border-bottom: 1px solid #979797;
          left: 46%;
        }
      }
      .detail-info {
        width: 100%;
        height: auto;
        li {
          height: 20px;
          line-height: 20px;
          color: #666666;
          font-family: "微软雅黑";
          margin-bottom: 5px;
        }
        .info-err {
          color: #ed5565;
        }
      }
    }
  }
  .scroll-info-list{
    max-height: 125px;
    overflow: auto;
  }
}
</style>
