<template>
  <div class="upload">
    <div class="file_list">
      <div v-for="item in fileList" :key="item.uid" class="item">
        <div class="file_name">
          <i class="el-icon-document" /> <span>{{ item.name }}</span>
        </div>
        <div class="operation">
          <!-- <i class="el-icon-success"></i> -->
          <i class="el-icon-close" @click="remove(item)" />
        </div>
      </div>
    </div>
    <el-button v-if="uploadBtnShow" type="primary" size="mini" @click="uploadDialog = true">
      <!-- 点击上传文件 -->
      {{ $t('component.attachement.text1') }}
    </el-button>
    <el-dialog
      :title="$t('component.attachement.text2')"
      :visible.sync="uploadDialog"
      width="400px"
      center
    >
      <div class="content">
        <el-upload
          class="upload-demo"
          :on-success="uploadSuccess"
          :file-list="uploadList"
          drag
          :headers="{'X-CSRF-TOKEN': csrfToken}"
          :action="action"
          multiple
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            {{ $t('component.attachement.text3') }}<em>{{ $t('component.attachement.text4') }}</em>
          </div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="uploadDialog = false">{{$t('comm.cancel')}}</el-button> -->
        <el-button type="primary" @click="complete">{{ $t('component.attachement.text5') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Attachement',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    action: {
      type: String,
      required: true
    },
    uploadBtnShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      uploadList: [],
      uploadDialog: false
    }
  },
  computed: {
    ...mapGetters([
      'csrfToken'
    ])
  },
  watch: {
    data(newValue) {
      this.fileList = newValue
    }
  },
  created() {
    this.fileList = this.data
  },
  methods: {
    // 当点击删除时，向外分发remove事件
    remove(item) {
      this.$emit('remove', item)
    },
    complete() {
      // // console.log(this.uploadList)
      const list = [...this.uploadList]
      this.fileList = [...this.fileList, ...list]
      this.uploadList = []
      // 向外分发add事件
      this.$emit('add', list)
      this.uploadDialog = false
    },
    uploadSuccess(res, file, fileList) {
      this.uploadList = fileList
    }
  }
}
</script>
<style lang="scss" scoped>
  .upload {
    .file_list {
      .item {
        width: 300px;
        display: flex;
        height: 25px;
        align-items: center;
        justify-content: space-between;
        line-height: 25px;
        margin: 5px 0;
        padding: 0 5px;
        box-sizing: border-box;
        cursor: pointer;
        .file_name {
          i {
            margin-right: 5px;
          }
        }
        &:hover {
          background-color: #eee;
          border-radius: 6px;
        }
        &:hover .file_name > i {
          color: red;
        }
        &:hover .file_name > span {
          color: #409EFF;
        }
      }
    }
    .content {
      // text-align: center;
      margin: 0 auto;
      width: 360px;
    }
  }
</style>
