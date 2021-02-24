<template>
  <div class="userOrg" :class="theme=='Light'?'apply  apply-light':'apply'">
    <div class="search-left-box tree-org-user" @click="hideOperation(activeOperation || '')">
      <el-scrollbar>
        <el-tree
          :data="data"
          node-key="id"
          :expand-on-click-node="true"
          :default-expanded-keys="expandedKeys"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          @node-drop="allowNodeDrop"
          @node-click="selectNode"
          @node-contextmenu="operation"
        >
          <template slot-scope="scope">
            <div class="custom-tree-node">
              <div class="tree_item tree-confirm-item">
                <span v-if="scope.data.id !== 50" class="iconfont" :class="scope.data.children || scope.data.type === 'org' ? 'icon-bumenguanli_h' : 'icon-Avatar'" />
                <span v-else class="iconfont icon-zuzhijiagou" />
                <span>{{ scope.data.text }}</span>
              </div>
              <div :ref="scope.data.id" class="tree-lock-text">
                <template v-if="scope.data.children || scope.data.type === 'org'">
                  <p @click.stop="appendOrg(scope.data)">
                    <!-- 增加下级机构 -->
                    {{ $t('admin.org.addSubMech') }}
                  </p>
                  <p @click.stop="appendPersonnel(scope.data)">
                    <!-- 增加机构人员 -->
                    {{ $t('admin.org.addMechUser') }}
                  </p>
                  <p @click.stop="removeOrg(scope)">
                    <!-- 删除本级机构 -->
                    {{ $t('admin.org.deleteLevelMech') }}
                  </p>
                </template>
                <template v-else>
                  <p @click.stop="removePersonnel(scope.node.parent.data, scope.data)">
                    <!-- 删除该人员 -->
                    {{ $t('admin.org.deleteUser') }}
                  </p>
                </template>
              </div>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <div :class="theme=='Light'?'content content-light':'content'">
      <template v-if="active === 'list'">
        <!-- <h3>{{ $t('admin.org.orgManagement') }}<span style="float: right"><span>{{ $t('admin.org.validYear') }}：{{ this.$route.query.validYear }}</span></span></h3> -->
        <div class="content-top-state">
          <el-form label-width="78px" label-position="left" class="content-top-form">
            <el-row type="flex" justify="space-between">
              <el-col :span="7">
                <!-- 年度 -->
                <el-form-item :label="$t('bud.comm.selectYear')" class="big-input">
                  <el-input
                    v-model="validYear"
                    class="input"
                    :readonly="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <!-- 组织名称 -->
                <el-form-item :label="$t('admin.org.orgName')" class="big-input">
                  <el-input
                    v-model="searchParam.params.orgName"
                    class="input"
                    :placeholder="$t('admin.org.orgName')"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <!-- 组织名称 -->
                <el-form-item :label="$t('admin.org.orgName')" class="big-input">
                  <el-input
                    v-model="searchParam.params.orgCode"
                    class="input"
                    :placeholder="$t('admin.org.orgCode')"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <ul class="content-top-btn">
            <li class="operation-item" @click="reset">
              <span class="operation-circle circle-middle-btn btn-light-color"><i class="iconfont icon-refresh" /></span>
              <span class="operation-text">{{ $t('comm.reset') }}</span>
            </li>
            <li class="operation-item" @click="search">
              <span class="operatiouln-circle circle-middle-btn btn-light-color"><i class="iconfont icon-sousuo" /></span>
              <span class="operation-text">{{ $t('comm.query') }}</span>
            </li>
          </ul>
        </div>
        <div class="table-bg-box search-list-table">
          <div ref="tables" style="height: 100%;">
            <el-table
              ref="orgTable"
              v-loading="isLoading"
              :data="tableData"
              style="width: 100%;"
              height="100%"
              border
              stripe
              class="scroll-table-box"
            >
              <el-table-column
                prop="id"
                :label="$t('admin.org.orgId')"
                header-align="center"
                align="center"
              />
              <el-table-column
                prop="orgCode"
                :label="$t('admin.org.orgCode')"
                align="center"
              />
              <el-table-column
                prop="orgName"
                :label="$t('admin.org.orgName')"
                show-overflow-tooltip
                header-align="center"
                align="left"
              />
              <el-table-column
                prop="orgLevel"
                :label="$t('admin.org.orgLevel')"
                header-align="center"
                align="center"
              />
              <el-table-column
                prop="parentId"
                :label="$t('admin.org.parentId')"
                header-align="center"
                align="center"
              />
              <el-table-column
                prop="deleteFlag"
                :label="$t('admin.org.deleteFlag')"
                header-align="center"
                align="center"
              >
                <template slot-scope="scope">
                  <dict-write dict-type-id="DeleteFlag" :value="scope.row.deleteFlag" />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('comm.operation')"
                min-width="200"
                header-align="center"
                align="center"
                width="200"
              >
                <!--
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="handleEdit(scope.$index, scope.row)"
                  />
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleOrgDelete(scope.$index, scope.row)"
                  />
                </template> -->

                <template slot-scope="scope">
                  <p class="advice-operation-left">
                    <span class="advice-operation-btn" @click="handleEdit(scope.$index, scope.row)">
                      <i class="iconfont iconbianji2" />编辑</span>
                    <span class="advice-deleted-btn" @click="handleOrgDelete(scope.$index, scope.row)">
                      <i class="iconfont iconshanchu1" />删除</span>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="pagination-box">
          <el-pagination
            class="page-left"
            :current-page.sync="searchParam.pageNo"
            :page-size="searchParam.pageSize"
            layout="total,sizes"
            :total="searchParam.totalRecord"
            :popper-class="theme=='Light'?'blueDL':''"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />

          <el-pagination
            class="page-right"
            :current-page.sync="searchParam.pageNo"
            :page-size="searchParam.pageSize"
            layout="prev,pager,next,slot,jumper"
            :total="searchParam.totalRecord"
            :popper-class="theme=='Light'?'blueDL':''"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <span class="iconfont icon-Group-1 page-last-page" @click="toLastPage" />
          </el-pagination>
          <el-pagination class="page-right  page-first" layout="slot">
            <span class="iconfont icon-zuiqian page-first-page" @click="toFirstPage" />
          </el-pagination>
        </div>
      </template>

      <div v-if="active === 'department'" class="department">
        <org-info
          :valid-year="validYear"
          :department-edit="departmentEdit"
          :org-change-div="orgChangeDiv"
          @search="search"
          @searchTree="searchTree"
        />
      </div>

      <!-- 选择现有人员Dilog 或者编辑人员是使用 -->
      <div v-if="active === 'personnel' " class="userChoseDilog">
        <!-- 人员信息 -->
        <div class="personnel">
          <personal-info
            :user-edit-flag="userEditFlag"
            :valid-year="validYear"
            :selected-user-id="selectedUserId"
            :new-user-org="newUserOrg"
            @search="search"
            @searchTree="searchTree"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import { formValidator } from '@/mixins/form-validator.js'
import { getOrgList, getAllOrgAndUserTree, orgRemove, userRemove, userMove, orgMove } from '@/api/admin/org-api.js'

import DictWrite from '@/components/DictWrite'

import PersonalInfo from '@/views/admin/org/_personnelInfo.vue'
import OrgInfo from '@/views/admin/org/_orgInfo.vue'

// var elementResizeDetectorMaker = require('element-resize-detector')
import $ from 'jquery'
import 'jquery.nicescroll'
export default {
  components: {
    DictWrite,
    OrgInfo,
    PersonalInfo
  },
  mixins: [search, formValidator],
  data() {
    return {
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',
      scrollColr: localStorage.getItem('theme') !== 'Dark' ? '#D8E0E8' : '#5A5E63',
      selectData: '',
      selectedUserId: '',
      userEditFlag: false,
      searchId: '',
      searchName: '',
      searchUserName: '',
      orgEditDilog: false,
      addOrgDilog: false,
      validYear: '',
      orgChoseDilog: false,
      roleChoseDilog: false,
      dialogUserVisible: false,
      isLoading: true,
      paginationFlag: 'orgList',
      users: [],
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          orgCode: '',
          orgName: '',
          userName: '',
          nickName: '',
          validYear: ''
        }
      },
      data: [],
      expandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      activeOperation: '',
      tableData: [],
      active: 'list',
      departmentInfo: {
        radio: '1'
      },
      newUserOrg: {},
      orgChangeDiv: '',
      orgChoseData: [],
      roleChoseData: [],

      allRoleList: [],

      orgChoseIndex: '0',

      roleChoseName: [],
      multipleSelection: [],
      departmentEdit: {
        id: '',
        orgCode: '',
        orgName: '',
        parentId: '',
        deleteFlag: ''
      },
      addOrEdit: '',
      orgAddOrEdit: '',
      userMove: {
        userId: '',
        orgId: '',
        targetOrgId: ''
      },
      orgMove: {
        orgId: '',
        targetParentOrgId: ''
      }
    }
  },
  computed: {

  },

  created() {
    this.validYear = this.$route.query.validYear

    // this.searchTree()
    // this.getScrollBar()
  },
  mounted() {
    // this.fetchData()
    this.searchTree()
    this.fetchData()
    // var erd = elementResizeDetectorMaker()
    var that = this
    that.$nextTick(() => {
      this.getScrollBar()
      $('.el-table__body-wrapper').getNiceScroll().resize()
    })
    // erd.listenTo(that.$refs.orgTable, function(element) {
    //   that.$nextTick(function() {
    //     $('.el-table__body-wrapper').getNiceScroll().resize()
    //   })
    // })
  },
  methods: {
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

    async fetchData() {
      this.searchParam.params.validYear = this.$route.query.validYear
      const res = await getOrgList(this.searchParam)
      if (res && res.success) {
        const { results, pageNo, totalRecord } = res.datas.searchResult
        this.tableData = results
        this.searchParam.pageNo = pageNo
        this.searchParam.totalRecord = totalRecord

        this.$nextTick(() => {
          this.getScrollBar()
          $('.el-table__body-wrapper').getNiceScroll().resize()
        })
      }
      //  this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    async searchTree() {
      this.validYear = this.$route.query.validYear
      const res = await getAllOrgAndUserTree(this.validYear)
      if (res && res.success) {
        this.data = res.datas.result
        // 默认展开第一级
        if (this.data) {
          this.expandedKeys = this.data.map(item => item.id)
        }
        this.data.unshift({ id: 50, text: this.validYear + '年度机构人员树' })
      }
    },
    operation(event, data, node, target) {
      // 点击右键时触发
      // alert('点击了右键')
      // console.log(event)
      // console.log(data)
      // console.log(node)
      // console.log(target)
      if (!(data.text === '机构人员树')) {
        this.showOperation(data.id)
      }
    },
    selectNode(target) {
      // 点击左键时触发
      if (target.id === 50) {
        this.active = 'list'
      } else {
        if (target.children || target.type === 'org') {
          this.clearErrorMessage('orgEdit')
          this.departmentEdit.id = target.id
          this.departmentEdit.orgCode = target.code
          this.departmentEdit.orgName = target.text
          this.departmentEdit.parentId = target.parentId
          this.departmentEdit.deleteFlag = '0'
          this.orgChangeDiv = 'edit'
          this.active = 'department'
        } else {
          this.clearErrorMessage('userEdit')
          this.active = 'personnel'
          this.selectedUserId = target.id
          this.userEditFlag = true
          this.newUserOrg = {}
        }
      }
    },
    // 设置节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.type === 'user') {
        // 不能放置在人员的里面
        return type !== 'inner'
      } else {
        return true
      }
    },
    // 设置节点能否被拖拽
    allowDrag(draggingNode) {
      // 判断是否为第一级，第一级不可拖动
      // console.log(draggingNode)
      if (!draggingNode.parent.data.children) {
        return false
      }
      return true
    },
    //  拖拽完成时触发
    allowNodeDrop(draggingNode, dropNode, dropType, ev) {
      if (draggingNode.data.type === 'user') {
        // 用户拖拽
        this.userMove.userId = draggingNode.data.id
        this.userMove.orgId = draggingNode.data.parentId
        if (dropType !== 'inner') {
          this.userMove.targetOrgId = dropNode.data.parentId
        } else {
          this.userMove.targetOrgId = dropNode.data.id
        }
        userMove(this.userMove).then(res => {
          if (res && res.success) {
            this.$message({
              type: 'success',
              message: this.$t('comm.success')
            })
            this.searchTree()
          }
        })
      }
      if (draggingNode.data.type === 'org') {
        // 组织拖拽
        this.orgMove.orgId = draggingNode.data.id
        if (dropType !== 'inner') {
          this.orgMove.targetParentOrgId = dropNode.data.parentId
        } else {
          this.orgMove.targetParentOrgId = dropNode.data.id
        }
        orgMove(this.orgMove).then(res => {
          if (res && res.success) {
            this.$message({
              type: 'success',
              message: this.$t('comm.success')
            })
            this.searchTree()
          }
        })
      }
    },

    // 增加下属机构
    appendOrg(data) {
      this.clearErrorMessage('orgEdit')
      this.orgChangeDiv = 'add'
      this.departmentEdit.id = ''
      this.departmentEdit.orgCode = ''
      this.departmentEdit.orgName = ''
      this.departmentEdit.parentId = data.id
      this.departmentEdit.deleteFlag = '0'
      this.hideOperation(this.activeOperation)
      this.active = 'department'
    },
    resetTable(params) {
      for (var i in params) {
        params[i] = ''
      }
    },
    // 增加下级人员
    appendPersonnel(data) {
      this.clearErrorMessage('userAdd')
      this.newUserOrg = {}
      this.active = 'personnel'
      this.selectedUserId = ''
      this.newUserOrg.orgId = data.id
      this.newUserOrg.orgName = data.text
      this.hideOperation(this.activeOperation)

      this.userEditFlag = true
      // this.addUserDilog = true
    },
    // 删除本级机构
    removeOrg(scope) {
      const { node, data } = scope
      const { data: parentData } = node.parent
      // 判断是否在最外层，最外层无法删除
      if (!parentData.children) {
        // console.log('无法删除')
        this.$message({
          type: 'error',
          message: this.$t('comm.msg5')
        })
        return
      }
      this.removeOrgProcess(data.id)
      this.hideOperation(this.activeOperation)
    },
    // 删除组织的处理
    removeOrgProcess(orgId) {
      this.$confirm(this.$t('comm.tip8'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        orgRemove([{ id: orgId }]).then(() => {
          this.search()
          this.searchTree()
        })
        this.activeOperation = ''
      })
    },

    // 删除组织
    handleOrgDelete(index, rowData) {
      this.removeOrgProcess(rowData.id)
    },

    // 删除人员
    removePersonnel(parent, data) {
      this.$confirm(this.$t('comm.tip7'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        // children.splice(index, 1)
        userRemove({ userId: data.id, orgId: parent.id }).then(res => {
          if (res && res.success) {
            this.activeOperation = ''
            this.hideOperation(this.activeOperation)
            this.searchTree()
          }
        })
      })

      this.hideOperation(this.activeOperation)
    },
    // 显示右键操作菜单
    showOperation(ref) {
      // 判断前一个的操作菜单是否隐藏
      if (this.activeOperation) {
        this.$refs[this.activeOperation].style.display = 'none'
      }
      this.activeOperation = ref
      this.$refs[ref].style.display = 'block'
    },
    // 隐藏右键操作菜单
    hideOperation(ref) {
      if (ref) {
        this.$refs[ref].style.display = 'none'
      }
    },

    // 编辑组织
    handleEdit(index, rowData) {
      this.clearErrorMessage('edit')
      this.departmentEdit = { ...rowData }
      this.departmentEdit.deleteFlag = '0'

      this.orgChangeDiv = 'edit'
      this.active = 'department'
    },

    onConfirm(item) {
      this.radioNumner = -1
      this.dialogUserVisible = false
      // this.UserList.push(user)
    },

    checkPassword(table) {
      let startStr = ''
      if (table === 'addUserData') {
        startStr = 'userAdd'
      } else if (table === 'personEdit') {
        startStr = 'userEdit'
      }
      if (this[table].password === this[table].rePassword) {
        this.clearErrorMessage(startStr + 'RePassword')
        return true
      } else {
        this.setValidatorMessage(startStr + 'RePassword', this.$t('comm.msg21'))
        return false
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.user {
  height: 100%;
  width: 100%;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  padding: 0 !important;
  .left {
    width: 180px;
    height: 100%;
    float: left;
    overflow: auto;
    box-sizing: border-box;
    padding: 0 5px;
    background-color: #eee;
    border-right: 5px solid #ccc;
    // background-color: skyblue;
    .tree_content {
      position: relative;
      .tree_item {
        .iconfont {
          font-size: 16px;
        }
        .icon-bumenguanli_h {
          color: rgb(180, 87, 6);
          font-size: 18px;
        }
        .icon-Avatar {
          color: rgb(64, 179, 224);
          font-size: 14px;
        }
        .icon-zuzhijiagou {
          color: cadetblue;
          font-size: 16px;
          position: relative;
          left: -12px;
        }
      }
      .tree_down {
        position: absolute;
        top: 20px;
        left: 15px;
        z-index: 999;
        background-color: #fff;
        padding: 3px;
        // height: 300px;
        display: none;
        p {
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          color: #000;
          &:hover {
            background-color: #ccc;
          }
        }
      }
    }
  }
  .content {
    overflow: auto;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    .list {
      h3 {
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        border-bottom: 1px dashed #ccc;
        margin-bottom: 15px;
        position: relative;
        color: rgb(50, 50, 50);
      }
      .search {
        display: flex;
        flex-wrap: wrap;
        & > div {
          width: 33.33%;
          min-width: 200px;
          box-sizing: border-box;
          padding: 0 30px 15px 10px;
          display: flex;
          align-items: center;
          .title {
            width: 130px;
            font-size: 14px;
            font-weight: 700;
          }
          .input {
            flex: 1;
          }
        }
      }
      .pagination {
        text-align: right;
        padding: 20px 5px;
      }
    }
    .department {
      width: 100%;
      box-sizing: border-box;
      padding-left: 10%;
      .info {
        width: 50%;
        & > div {
          display: flex;
          padding: 10px 0;
          align-items: center;
          .title {
            width: 130px;
            font-size: 14px;
            font-weight: 700;
          }
          .input {
            flex: 1;
          }
        }
      }
      .btn {
        width: 50%;
        box-sizing: border-box;
        padding-left: 130px;
        margin-top: 10px;
      }
    }
    .personnel {
      .info {
        display: flex;
        flex-wrap: wrap;
        & > div {
          width: 50%;
          display: flex;
          box-sizing: border-box;
          padding: 10px 0;
          padding-right: 50px;
          align-items: center;
          .title {
            width: 120px;
            font-size: 14px;
            font-weight: 700;
          }
          .input {
            flex: 1;
          }
        }
      }
      h4 {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        border-bottom: 1px dashed #ccc;
        color: rgb(50, 50, 50);
        margin-bottom: 10px;
        padding: 10px 0;
        position: relative;
        // color: #000;
        .add_row {
          position: absolute;
          right: 0;
          bottom: 10px;
          border-radius: 6px;
          // border: 1px solid #ccc;
          cursor: pointer;
          font-size: 12px;
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background-image: linear-gradient(
            rgb(52, 165, 248),
            rgb(8, 142, 240)
          );
          color: #fff;
          &:hover {
            background-image: linear-gradient(
              rgb(42, 155, 238),
              rgb(8, 142, 240)
            );
          }
        }
      }
      .affiliation,
      .role {
        width: 80%;
        .select_role {
          display: flex;
          .input {
            margin-right: 15px;
          }
        }
      }
      .btn {
        width: 80%;
        box-sizing: border-box;
        padding-left: 30px;
        margin-top: 10px;
      }
    }
  }
  .orgChoseDilog {
    .box {
      height: 400px;
      overflow: auto;
      background-color: #fff;
    }
  }
}
</style>
<style lang="scss">
.userOrg {
  .tree-lock-text {
    top: 20px;
    min-width: auto;
    width: 100px;
    height: 120px;
  }
}

.content-top-state .el-form-item {
  margin-bottom: 30px;
}

.content-top-state .el-form-item {
  margin-bottom: 30px;
}

.content-top-btn .operation-item {
  margin-bottom: 30px;
}

.table-tree-item {
  padding-left: 27px;
}
.el-tree-node {
  white-space: initial;
  .el-tree-node__content {
    display: inline-flex;
  }
}
.table-edit-icon {
  display: none;
  font-size: 14px;
}
.table-cell-hover i {
  display: inline-block;
}
.table-cell-hover:hover {
  color: #00e2de;
  cursor: pointer;
}
.table-cell-rightClick {
  font-size: 14px;
}
.table-cell-total .cell {
  line-height: 30px;
}
.tree-org-user {
  .el-tree-node__content {
    height: auto !important;
  }
  .custom-tree-node {
    min-height: 32px;
    line-height: 31px;
  }
}

.total-item-span {
  position: relative;

  span {
    position: absolute;
    top: -12px;
    right: -15px;

    i {
      font-size: 12px;
    }
  }
}

.table-cell-hover:hover i {
  display: inline-block;
  color: #00e2de;
}

.table-span-style {
  td:first-child .cell,
  th:first-child .cell {
    padding: 0 10px;
  }
}

// .wtHider tr:nth-child(2) td

#processDialog .el-dialog {
  width: 1000px;
  height: 800px;
  margin-top: 80px !important;
  padding: 0;
  border-radius: 16px;
}
</style>

