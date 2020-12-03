<template>
  <div id="processDialogNew" :class="theme=='Light'?'apply-light':'apply'">
    <el-dialog
      :title="$t('workflow.detailedProcess') + processInstId"
      :visible.sync="isShow"
      custom-class="dialog-drag"
      class="content-dialog-box"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-table v-loading="isLoading" :data="approveHis" border stripe style="width: 100%;">
          <el-table-column
            header-align="center"
            align="center"
            width="200"
            prop="approveTime"
            :label="$t('component.process.approveTime')"
          />
          <el-table-column
            header-align="center"
            align="left"
            prop="taskName"
            width="150"
            :label="$t('component.process.taskName')"
          />
          <el-table-column
            header-align="center"
            align="center"

            width="100"
            prop="nickName"
            :label="$t('component.process.nickName')"
          />
          <el-table-column
            header-align="center"
            align="center"

            width="100"
            prop="approveResult"
            :label="$t('component.process.approveResult')"
          >
            <template slot-scope="scope">
              <dict-write dict-type-id="ApproveResult" :value="scope.row.approveResult" />
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="left"
            prop="comment"
            :label="$t('component.process.comment')"
          />
          <!--
          <el-table-column v-if="canWithdraw" :label="$t('component.process.approve')">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.withdrawTaskId"
                type="primary"
                class="iconfont icon-withdraw"
                size="mini"
                @click.prevent="handleWithdrawClick(scope.row)"
              >

                {{ $t('comm.withdraw') }}
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div id="workflowTrace">
        <div style="position:relative">
          <img id="pic" :src="picUrl">
          <div id="processImageBorder">
            <el-tooltip
              v-for="(item, index) in activityInfos"
              :key="index"

              effect="light"
              placement="bottom"
              popper-class="tips"
            >
              <!-- <table slot="content" class="tipTable">
              <tr v-for="(value, key) in item.vars" :key="key" v-show="value">
                <td class='tipLabel'>{{key}}</td>
                <td class='tipText'>{{value}}</td>
              </tr>
            </table>-->
              <div slot="content" class="tipTable">
                <div v-for="(value, key) in item.vars" v-show="value" :key="key" class="item">
                  <span>{{ key }}:</span>
                  <span>{{ value }}</span>
                </div>
              </div>
              <div class="activity-attr" :style="item.style" />
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import DictWrite from '@/components/DictWrite'
import { getProcessAllTrace, withdrawTask } from '@/api/base'
import $ from 'jquery'
import 'jquery.nicescroll'
export default {
  name: 'ProcessDetail',
  components: {
    DictWrite
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    processInstId: {
      type: String,
      default: ''
    },
    canWithdraw: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      isLoading: true,
      approveHis: [],
      activityInfos: [],
      picUrl: '',
      scrollColr:
        localStorage.getItem('theme') !== 'Dark' ? '#D8E0E8' : '#5A5E63',
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : ''
    }
  },
  watch: {
    // processInstId: 'fetchData',
    isShow: function(newVal) {
      this.fetchData()
      this.$nextTick(function() {
        this.getDragBar()
      })
    }
  },
  created: function() {
    // this.fetchData()
  },
  mounted() {
    this.fetchData()
    this.$nextTick(function() {
      this.getDragBar()
    })
  },
  methods: {
    handleClose(done) {
      this.$emit('onClose')
    },
    fetchData: async function() {
      const pid = this.processInstId

      if (pid === null || pid === '') {
        return
      }
      const contextPath = process.env.VUE_APP_CONTEXT_PATH ? process.env.VUE_APP_CONTEXT_PATH : ''
      this.picUrl = contextPath +
        '/api/workflow/user/showPic/' + pid + '?' + new Date().getTime()
      const res = await getProcessAllTrace(pid)
      if (res && res.success) {
        const { approveHis, activityInfos } = res.datas
        this.approveHis = approveHis
        this.activityInfos = activityInfos
        this.activityInfos.forEach(item => {
          Vue.set(
            item,
            'style',
            `position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; background-color: black !important; opacity: 0; z-index: 14999;`
          )
        })
        this.getDragBar()
        // 缩放
        this.resizable()
      }
      this.isLoading = false
    },
    handleWithdrawClick: function(row) {
      this.$confirm(this.$t('comm.tip16'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning',
        iconClass: 'iconfont icongantanhao_icon',
        customClass: localStorage.getItem('theme') === 'Dark' ? 'dark-message-box' : 'light-message-box'
      })
        .then(async() => {
          const param = {
            taskId: row.withdrawTaskId,
            destActivityId: row.taskDefKey
          }
          const res = await withdrawTask(param)
          if (res && res.success) {
            this.fetchData()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            iconClass: 'iconfont icongantanhao_icon',
            customClass:
              localStorage.getItem('theme') === 'Dark' ? 'dark-el-message' : ' ',
            message: this.$t('comm.msg1')
          })
        })
    },

    getDragBar() {
      $('#processDialogNew .el-dialog__body').niceScroll({
        cursorcolor: this.scrollColr,
        cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
        cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
        cursorwidth: '8px', // 滚动条的宽度，单位：便素
        cursorborder: `1px solid ${this.scrollColr}`, // CSS方式定义滚动条边框
        autohidemode: true, // 隐藏滚动条的方式, 可用的值:
        zindex: 0,
        railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
        boxzoom: false,
        iframeautoresize: true // 在加载事件时自动重置iframe大小
      })
    },
    getScrollBar() {
      // $('.el-table__body-wrapper').niceScroll({
      //   cursorcolor: this.scrollColr,
      //   cursoropacitymin: 0, // 当滚动条是隐藏状态时改变透明度, 值范围 1 到 0
      //   cursoropacitymax: 1, // 当滚动条是显示状态时改变透明度, 值范围 1 到 0
      //   cursorwidth: '8px', // 滚动条的宽度，单位：便素
      //   cursorborder: `1px solid ${this.scrollColr}`, // CSS方式定义滚动条边框
      //   autohidemode: true, // 隐藏滚动条的方式, 可用的值:
      //   zindex: 0,
      //   railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
      //   boxzoom: false,
      //   iframeautoresize: false // 在加载事件时自动重置iframe大小
      // })
    },

    draggable() {
      $('.dialog-drag').draggable({
        cursor: 'move',
        handle: '.el-dialog__header',
        refreshPositions: true,
        containment: 'parent',
        stop() {
          $('.el-dialog__body')
            .getNiceScroll()
            .resize()
        }
      })
    },
    resizable() {
      $('.dialog-drag').resizable({
        aspectRatio: false,
        minHeight: 150,
        containment: 'parent',
        stop: function(event, ui) {
          $('.footer-box').addClass('drag-table-height')
          $('.el-table__body-wrapper')
            .getNiceScroll()
            .resize()
          $('.el-dialog__body')
            .getNiceScroll()
            .resize()
        }
      })
    }
  }
}
</script>

<style scoped>
table tr {
  line-height: 20px;
}

td.tipText {
  text-align: left;
  padding-left: 10px;
}

td.tipLabel {
  text-align: right;
  font-weight: bold;
  width: 60px;
}
.tips {
  padding: 0 !important;
}

.tipTable {
  border: 1px solid #f1d031;
  background-color: #ffffa3;
  color: #555;
  padding: 15px;
}
#workflowTrace {
  margin-bottom: 70px;
}
</style>
<style lang="scss">
#processDialogNew {
  // z-index: 2000;
  height:auto;
  .content-dialog-box{
    z-index:2039;
  }
  .dialog-drag {
    width: 900px;
    min-width: auto !important;
    height: 600px;
    // .el-dialog__body {
    //   margin: -8px;
    //   padding: 8px;
    // }

    // .dialog-table-box {
    //   height: 100%;
    //   padding: 20px;
    //   background: linear-gradient(180deg, #34393f 0%, #16171b 100%);
    //   box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.5);
    //   border-radius: 16px;
    //   overflow: hidden;

    // }
  }
}
</style>
