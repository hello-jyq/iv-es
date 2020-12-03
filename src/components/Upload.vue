<template>
  <div class="upload">
    <div class="content">
      <el-upload
        v-if="!multiple"
        ref="upload"
        :on-success="handelUploadSuccess"
        :on-error="handelUploadError"
        drag
        :headers="{'X-CSRF-TOKEN': csrfToken}"
        :action="action"
        :multiple="multiple"
        :auto-upload="!multiple"
        :data="otherParams"
        :accept="accept"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
      <el-upload
        v-else
        ref="upload"
        :on-success="handelUploadSuccess"
        :on-error="handelUploadError"
        drag
        :headers="{'X-CSRF-TOKEN': csrfToken}"
        :action="action"
        :multiple="multiple"
        :auto-upload="!multiple"
        :http-request="uploadFile"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
    </div>
    <div class="footer">
      <el-button type="primary" @click="handleSubmit">
        <!-- 确定 -->
        {{ $t('comm.confirm') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { upload } from '@/utils/request'
export default {
  name: 'Upload',
  props: {
    action: {
      type: String,
      required: true
    },
    onSuccess: {
      type: Function,
      default: _ => {}
    },
    onError: {
      type: Function,
      default: _ => {}
    },
    multiple: {
      type: Boolean,
      default: true
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
      fileData: '',
      fileName: []
    }
  },
  computed: {
    ...mapGetters([
      'csrfToken'
    ])
  },
  methods: {
    handelUploadSuccess(res, file, fileList) {
      // // console.log(file.name)
      this.uploadMessage([file.name], res)
      this.onSuccess(res, file, fileList)
    },
    handelUploadError(err, file, fileList) {
      this.uploadMessage(file.name, err, false)
      this.onError(err, file, fileList)
    },
    handleSubmit() {
      // multiple ==true 多文件时，需要点击确定上传，multiple==false 单文件时自动上传
      if (this.multiple) {
        this.fileData = new FormData()
        this.$refs.upload.submit()
        // // console.log('fileData', this.fileData)
        // // console.log(this.$refs.upload.fileList)
        upload(this.action, this.fileData).then(res => {
          // // console.log(this.fileName)
          this.uploadMessage(this.fileName, res)
        }).catch(err => {
          this.uploadMessage(this.fileName, err, false)
        })
      } else {
        this.$emit('finish')
      }
    },
    uploadFile(file) {
      if (this.multiple) {
        this.fileName = [...this.fileName, file.file.name]
        this.fileData.append('file', file.file)
      }
    },
    uploadMessage(files = [], res, status = true) {
      const { success, messages, message, warnings } = res
      // // console.log(warnings)
      if (status) {
        if (!success) {
          let html = ''
          if (messages.length || warnings.length) {
            html = [...messages.map(item => {
              const args = {}
              for (const key in item.arguments) {
                args[key] = this.$t(item.arguments[key])
              }
              return `<p class="err_icon el-icon-error">${this.$t(item.message, args)}</p></br>`
            }), ...warnings.map(item => {
              const args = {}
              for (const key in item.arguments) {
                args[key] = this.$t(item.arguments[key])
              }
              return `<p class="war_icon el-icon-warning">${this.$t(item.message, args)}</p></br>`
            })]
              .join('')
          } else {
            html = `<p class="err_icon el-icon-error">${this.$t(message)}</p>`
          }
          // // console.log(html)
          this.$alert(html, `文件错误!(${files.join(',')})`, {
            dangerouslyUseHTMLString: true
          })
          this.$refs.upload.clearFiles()
        } else {
          if (warnings.length) {
            const html = warnings.map(item => {
              const args = {}
              for (const key in item.arguments) {
                args[key] = this.$t(item.arguments[key])
              }
              return `<p class="war_icon el-icon-warning">${this.$t(item.message, args)}</p></br>`
            }).join('')
            this.$alert(html, `文件上传成功!(${files.join(',')})`, {
              dangerouslyUseHTMLString: true
            })
          } else {
            this.$alert('文件上传成功！', `文件上传成功！(${files.join(',')})`, {
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
          }
        }
      } else {
        this.$message({
          type: 'error',
          message: '上传失败，请稍后再试！'
        })
      }
      this.$emit('finish')
    }
  }
}
</script>
<style lang="scss" scoped>
.footer{
  text-align: right;
  padding-top: 10px;
}
</style>
<style lang="css">
.err_icon {
  color: #F56C6C;
}
.war_icon {
  color: #E6A23C;
}
</style>
