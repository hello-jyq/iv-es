<template>
  <div style="display: flex;flex-direction: column;height: 100%;">
    <div class="middle-box">
      <div class="dialog-search-box middle-input">
        <el-form ref="searchForm" :model="form" label-width="80px" label-position="left">
          <el-row type="flex" justify="space-between">
            <el-col :span="7">
              <el-form-item label="姓名" prop="nickName">
                <el-input v-model="searchParam.params.nickName" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="登陆名" prop="userName">
                <el-input v-model="searchParam.params.userName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="margin-bottom:0 !important">
            <div class="dialog-btn-box">
              <div class="dialog-btn-right" @click="resetForm('searchForm')">
                <span class="circle-bigger-btn btn-default-color"><i class="iconfont iconrefresh" /></span>
                <span class="dialog-btn-text"> 重&nbsp;置</span>
              </div>
              <div @click="search">
                <span class="circle-bigger-btn btn-light-color bluebg"><i class="iconfont iconsousuo" /></span>
                <span class="dialog-btn-text">检&nbsp;索</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer-box">
      <div class="dialog-table-box">
        <el-table ref="table" class="scroll-table-box" :data="userList" height="100%" stripe border @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="id"
            :label="$t('admin.org.userId')"
          />
          <el-table-column
            prop="orgName"
            :label="$t('admin.org.organization')"
          />
          <el-table-column
            prop="nickName"
            :label="$t('admin.org.fullName')"
          />
          <el-table-column
            prop="userName"
            :label="$t('admin.org.sysName')"
          />
          <el-table-column
            prop="corpUserId"
            :label="$t('admin.org.corpUserId')"
          />
          <el-table-column
            prop="mobile"
            :label="$t('admin.org.mobile')"
          />
          <el-table-column
            prop="ldapUserId"
            :label="$t('admin.org.ldapUserId')"
          />
          <el-table-column
            prop="email"
            :label="$t('admin.org.email')"
          />
          <el-table-column
            prop="jobRank"
            :label="$t('admin.org.jobRank')"
          />
          <el-table-column
            prop="staffNum"
            :label="$t('admin.org.staffNum')"
          />
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination
          class="page-left"
          :current-page.sync="searchParam.pageNo"
          :page-size="searchParam.pageSize"
          layout="total,sizes"
          :total="searchParam.totalRecord"
          :popper-class="theme=='Light' ? 'blueDL' : ''"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

        <el-pagination
          class="page-right"
          :current-page.sync="searchParam.pageNo"
          :page-size="searchParam.pageSize"
          layout="prev,pager,next,slot,jumper"
          :total="searchParam.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="iconfont iconjiantou-youzhi page-last-page" @click="toLastPage" />
        </el-pagination>
        <el-pagination class="page-right  page-first" layout="slot">
          <span class="iconfont iconjiantou-zuozhi page-first-page" @click="toFirstPage" />
        </el-pagination>
      </div>
    </div>
    <div class="dialog-btn-box light-box" style="padding-bottom: 3px;">
      <div class="dialog-btn-right" @click="onClose()">
        <span class="circle-bigger-btn btn-default-color"><i class="iconfont iconquxiao" /></span>
        <span class="dialog-btn-text"> 取&nbsp;消</span>
      </div>
      <div @click="onConfirm()">
        <span class="circle-bigger-btn btn-light-color bluebg"><i class="iconfont iconqueren" /></span>
        <span class="dialog-btn-text">确&nbsp;认</span>
      </div>
    </div>
  </div>
</template>

<script>
import { search } from '@/mixins/search-params'
import { getUserList } from '@/api/admin/user-api.js'
import $ from 'jquery'
import 'jquery.nicescroll'
export default {
  mixins: [search],
  data() {
    return {
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',
      Height: '',
      user: null,
      contactsPopover: false,
      userList: [],
      form: { // 弹窗检索参数
        nickName: '',
        userName: ''
      },
      // 分页插件数据
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          userName: '',
          nickName: ''
        }
      }
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    // 监听滚动事件
    const dom = document.getElementsByClassName('el-dialog__body')[0]
    dom.addEventListener('scroll', this.scroll)
  },
  methods: {
    async fetchData() {
      const res = await getUserList(this.searchParam)
      const { results, pageNo, totalRecord } = res.datas.searchResult
      this.userList = results
      this.searchParam.pageNo = pageNo
      this.searchParam.totalRecord = totalRecord

      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    scroll() {
      this.$emit('onScroll')
      $('.el-table__body-wrapper').getNiceScroll().resize()
    },
    onClose() {
      this.$emit('onClose')
    },
    onConfirm() {
      this.$emit('onConfirm', this.user)
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
