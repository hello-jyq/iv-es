<template>
  <div id="changeOrg" :class="theme=='Light' ? 'apply-light' : 'apply'">
    <el-dialog
      ref="dragBox"
      class="content-dialog-box  search-light"
      :close-on-click-modal="false"
      custom-class="dialog-drag fixed-search-btn-box"
      top="0"
      :title="$t('comm.changeOrg')"
      :visible.sync="isShow"
      :before-close="handleDialogClose"
      width="500px"
    >
      <div style="display: flex;flex-direction: column;height: 100%;">
        <div class="middle-box">
          <div class="dialog-search-box middle-input">
            <el-form ref="searchForm" label-width="80px" label-position="left">
              <el-row type="flex" justify="space-between">
                <el-col :span="24">
                  <el-form-item label="组织变更">
                    <el-select v-model="selectOrgId" style="width:100%" :popper-class="theme=='Light' ? 'blueSelect' : ''">
                      <el-option
                        v-for="itemOrg in userOrgList"
                        :key="itemOrg.id"
                        :label="itemOrg.fullName"
                        :value="itemOrg.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="space-between">
                <el-col :span="24" />
              </el-row>
            </el-form>
          </div>
        </div>

        <ul class="operation-box dialog-btn-box fixed-btn-box end-content-flex">
          <li class="operation-item" @click="onClose()">
            <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconquxiao" /></span>
            <span class="operation-text">{{ $t('comm.cancel') }}</span>
          </li>
          <li class="operation-item" @click="handleChangeOrgOkClick">
            <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconqueren" /></span>
            <span class="operation-text">{{ $t('comm.certain') }}</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import $ from 'jquery'
import 'jquery.nicescroll'
import { mapGetters } from 'vuex'
import { changeOrg } from '@/api/login'

export default {

  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      isLoading: false,
      scrollColr: localStorage.getItem('theme') !== 'Dark' ? '#D8E0E8' : '#5A5E63',
      dacList: [],
      // 新增结束
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',
      Height: '',
      item: null,
      selectOrgId: '',
      contactsPopover: false

    }
  },
  computed: {
    ...mapGetters([
      'userOrgList'
    ])

  },
  // 新增监听
  watch: {
    'isShow': function(newVal, oldVal) {
      if (newVal === true) {
        this.$nextTick(() => {
          this.getScrollBar()
          this.getDragBar()
          const dom = document.getElementsByClassName('el-dialog__body')[0]
          dom.addEventListener('scroll', this.scroll)
        })
      }
    }
  },
  mounted() {
    this.getScrollBar()
    this.getDragBar()
    this.draggable()
    this.resizable()

    if (this.userOrgList !== undefined && this.userOrgList.length) {
      this.selectOrgId = this.userOrgList[0].id
    }
  },
  methods: {
    headerDragend() {
      this.$refs.table.doLayout()
    },

    getScrollBar() {
      $('.el-table__body-wrapper').niceScroll({
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
    getDragBar() {
      $('.el-dialog__body').niceScroll({
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
    draggable() {
      $('.dialog-drag').draggable({
        cursor: 'move',
        handle: '.el-dialog__header',
        refreshPositions: true,
        containment: 'parent',
        stop() {
          $('.el-table__body-wrapper').getNiceScroll().resize()
          $('.el-dialog__body').getNiceScroll().resize()
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
          $('.el-dialog__body').getNiceScroll().resize()
        }
      })
    },
    scroll() {
      $('.el-table__body-wrapper').getNiceScroll().resize()
    },
    // 修改—— 新增关闭前事件
    handleDialogClose() {
      this.$emit('onClose')
    },
    onClose() {
      this.$emit('onClose')
    },
    handleChangeOrgOkClick() {
      // 取得选择的组织名称
      let changeOrgInfo = {}
      changeOrgInfo = this.userOrgList.find((item) => { // 这里的chargingWorkNameList就是上面遍历的数据源
        return item.id === this.selectOrgId
        // 筛选出匹配数据，是对应数据的整个对象
      })
      // // console.debug(changeOrgInfo.fullName)
      var msg = this.$t('home.msg6', { para0: changeOrgInfo.fullName })
      this.$confirm(msg, this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning',
        iconClass: 'iconfont icongantanhao_icon',
        customClass: localStorage.getItem('theme') === 'Dark' ? 'dark-message-box' : 'light-message-box'
      }).then(async() => {
        const param = { newOrgId: this.selectOrgId }
        const res = await changeOrg(param)
        // // console.log('change success')
        // // console.log(res)
        if (res.success) {
          // // console.log('change res')
          // 转移到home画面
          this.$emit('onChangeOrgSuccess')
        }
      }).catch(() => {})
    },
    getContactsChecked(data, node, ischeck) {
      if (node.isLeaf) {
        this.form.contacts = node.label
        this.contactsPopover = false
      }
    },
    getCurrentRow(index) {
      this.item = index
      // console.log('index', index)
    },

    handleSelectionChange(val) {

    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row)
        })
      } else {
        this.$refs.table.clearSelection()
      }
    }
  }
}
</script>
<style lang="scss">
#changeOrg .content-dialog-box .dialog-drag {
    height: 260px;
}
</style>
