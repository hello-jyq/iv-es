<template>
  <div class="department">
    <el-dialog :visible.sync="dialogFormVisible" :title="title" center @open="open" @close="close">
      <div class="top">
        <div class="item">
          <div class="title">
            条件一:
          </div>
          <el-input v-model="input" class="input" placeholder="请输入内容" />
        </div>
        <div class="item">
          <div class="title">
            条件二:
          </div>
          <el-input v-model="input" class="input" placeholder="请输入内容" />
        </div>
        <div class="item">
          <div class="title">
            条件三:
          </div>
          <el-input v-model="input" class="input" placeholder="请输入内容" />
        </div>
        <div class="item">
          <div class="title">
            条件四:
          </div>
          <el-input v-model="input" class="input" placeholder="请输入内容" />
        </div>
      </div>
      <div class="btn">
        <el-button type="primary" class="iconfont icon-search" size="mini">
          查询
        </el-button>
      </div>
      <div class="content">
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            type="index"
            width="50"
          />
          <el-table-column
            property="name"
            label="部门名称"
            width="120"
          />
          <el-table-column
            property="number"
            label="部门编号"
            width="120"
          />
          <el-table-column
            property="info"
            label="部门简介"
          />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="submit">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'DepartmentDialog',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    width: { // 宽度
      type: String,
      default: '60%'
    },
    title: { // 标题
      type: String,
      default: '部门选择'
    },
    fullscreen: { // 是否为全屏 Dialog
      type: Boolean,
      default: false
    },
    top: { // Dialog CSS 中的 margin-top 值
      type: String,
      default: '100px'
    },
    modal: { // 是否需要遮罩层
      type: Boolean,
      default: true
    },
    ids: { // 外层传入到标识，区分谁打开的弹窗(必传)
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      input: '',
      tableData: [
        {
          name: '部门一',
          number: '10001',
          info: '15244356435'
        },
        {
          name: '部门二',
          number: '10002',
          info: '1244345435'
        },
        {
          name: '部门三',
          number: '10003',
          info: '14244443435'
        },
        {
          name: '部门四',
          number: '10004',
          info: '45412443435'
        }
      ],
      currentRow: null
    }
  },
  watch: {
    isShow(newValue) {
      this.dialogFormVisible = newValue
    }
  },
  methods: {
    submit() {
      this.dialogFormVisible = false
      const { currentRow, ids } = this
      const options = {
        ...currentRow,
        ...ids
      }
      this.$emit('change', options)
    },
    open() {
      this.$emit('open', '打开')
    },
    close() {
      this.$emit('close', '关闭')
    },
    handleCurrentChange(val) {
      this.currentRow = val
    }
  }
}
</script>
<style lang="scss" scoped>
  .department {
    .top {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .item {
        display: flex;
        width: 300px;
        align-items: center;
        flex-wrap: wrap;
        padding: 10px 0;
        .title {
          // width: 120px;
          padding-right: 20px;
        }
        .input {
          flex: 1;
        }
      }
    }
    .btn {
      padding: 10px;
      text-align: right;
      border-bottom: 1px solid #ccc;
      .iconfont {
        font-size: 16px;
      }
    }
    .dialog-footer {
      text-align: right;
    }
  }
</style>
<style lang="scss">
.department {
  .el-table__body {
    .el-table__row:hover>td {
      background-color: skyblue;
    }
    .el-table__row {
      cursor: pointer;
    }
    .current-row {
      color: #000;
      td {
        background-color: skyblue;
      }
    }
  }
}
</style>

