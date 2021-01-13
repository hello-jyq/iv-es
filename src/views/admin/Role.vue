<template>
  <div class="role">
    <div class="search">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span slot="title" class="collapse-title">{{ $t('comm.queryCriteria') }}</span>
          <div class="mode input_box">
            <div class="flex3">
              <div class="title">
                <!-- 角色ID： -->
                {{ $t('admin.role.roleId') }}
              </div>
              <el-input v-model="searchParam.params.roleId" class="input" :placeholder="$t('admin.role.roleId')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 角色名称： -->
                {{ $t('admin.role.roleName') }}
              </div>
              <el-input v-model="searchParam.params.roleName" class="input" :placeholder="$t('admin.role.roleName')" clearable />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="btns">
        <div class="left">
          <el-button type="primary" class="el-icon-circle-plus-outline" @click="handleCreate">
            <!-- 新建 -->
            {{ $t('comm.newlyBuild') }}
          </el-button>
          <el-button type="danger" class="el-icon-delete" @click="batchDelete">
            <!-- 批量删除 -->
            {{ $t('comm.batchDeletion') }}
          </el-button>
          <el-button type="primary" class="el-icon-refresh" plain @click="refreshRole">
            <!-- 刷新缓存 -->
            {{ $t('comm.refreshCache') }}
          </el-button>
        </div>
        <div class="right">
          <el-button type="success" class="el-icon-search" @click="search">
            <!-- 查询 -->
            {{ $t('comm.query') }}
          </el-button>
          <el-button class="el-icon-refresh-left" type="info" @click="reset">
            <!-- 重置 -->
            {{ $t('comm.reset') }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="table"
        v-loading="isLoading"
        :data="tableData"
        border
        style="width: 100%"
        height="579"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column :label="$t('comm.operation')" min-width="120" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index, scope.row)" />
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          min-width="140"
          :label="$t('admin.role.roleId')"
        />
        <el-table-column
          min-width="140"
          prop="roleName"
          :label="$t('admin.role.roleName')"
        />
        <el-table-column
          prop="roleDesc"
          min-width="160"
          :label="$t('admin.role.roleDesc')"
        />
        <el-table-column
          min-width="145"
          prop="createTime"
          :label="$t('admin.role.createTime')"
        />
        <el-table-column
          min-width="145"
          prop="updateTime"
          :label="$t('admin.role.updateTime')"
        />
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, ->"
          :page-size="searchParam.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="searchParam.pageNo"
          :total="searchParam.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog
        :key="dialogKey"
        class="roleDialog"
        :title="dialogType==='create' ? $t('comm.newlyBuild') : $t('comm.edit')"
        :visible.sync="showDialog"
        width="80%"
      >
        <div class="main">
          <h4>{{ $t('comm.essentialInformation') }}</h4>
          <div class="input_box">
            <div class="flex3">
              <div class="title must">
                <!-- 角色ID -->
                {{ $t('admin.role.roleId') }}
              </div>
              <div class="input">
                <el-input v-model="basicInfo.id" :placeholder="$t('admin.role.roleId')" @blur="validator('roleId')" />
                <span ref="roleId" data-roles="required" :data-value="basicInfo.id" class="message" />
              </div>
            </div>
            <div class="flex3">
              <div class="title must">
                {{ $t('admin.role.roleName') }}
                <!-- 角色名称 -->
              </div>
              <div class="input">
                <el-input v-model="basicInfo.roleName" :placeholder="$t('admin.role.roleName')" @blur="validator('roleName')" />
                <span ref="roleName" data-roles="required" :data-value="basicInfo.roleName" class="message" />
              </div>
            </div>
            <div class="flex3">
              <div class="title">
                {{ $t('admin.role.roleDesc') }}
                <!-- 角色描述 -->
              </div>
              <el-input v-model="basicInfo.roleDesc" :placeholder="$t('admin.role.roleDesc')" />
            </div>
          </div>
          <h4>{{ $t('admin.role.accessConfig') }}</h4>
          <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('admin.role.menuAccess')" name="menu">
              <div class="roleList">
                <el-tree
                  :key="dialogKey"
                  ref="addTree"
                  :data="createTree"
                  show-checkbox
                  node-key="id"
                  :default-checked-keys="checkedKeys"
                  :props="defaultProps"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('admin.role.urlAccess')" name="url">
              <el-table
                ref="resUrlMultipleTable"
                :data="allUrl"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="urlHandleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  prop="id"
                  label="ID"
                  min-width="150"
                />
                <el-table-column
                  prop="resName"
                  :label="$t('admin.role.name')"
                  min-width="160"
                />
                <el-table-column
                  prop="resUrl"
                  :label="$t('admin.role.url')"
                  min-width="150"
                />
                <el-table-column
                  prop="description"
                  :label="$t('admin.role.desc')"
                  min-width="160"
                  show-overflow-tooltip
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('admin.role.elementAccess')" name="element">
              <el-table
                ref="pageMultipleTable"
                :data="allPageRes"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="pageHandleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  prop="id"
                  label="ID"
                  min-width="150"
                />
                <el-table-column
                  prop="resName"
                  :label="$t('admin.role.name')"
                  min-width="160"
                />
                <el-table-column
                  prop="resKey"
                  :label="$t('admin.role.elementKey')"
                  min-width="120"
                />
                <el-table-column
                  prop="description"
                  :label="$t('admin.role.desc')"
                  min-width="160"
                  show-overflow-tooltip
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('admin.role.routeAccess')" name="route">
              <el-table
                ref="resRouteMultipleTable"
                :data="allRoutes"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="routeHandleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  prop="id"
                  label="ID"
                  min-width="150"
                />
                <el-table-column
                  prop="resName"
                  :label="$t('admin.role.name')"
                  min-width="160"
                />
                <el-table-column
                  prop="resUrl"
                  :label="$t('admin.role.url')"
                  min-width="150"
                />
                <el-table-column
                  prop="resFile"
                  :label="$t('admin.role.pageFile')"
                  min-width="150"
                />
                <el-table-column
                  prop="description"
                  :label="$t('admin.role.desc')"
                  min-width="160"
                  show-overflow-tooltip
                />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="!validatorState" @click="handleSave">{{ $t('comm.certain') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import { getRoleList, editDetail, getAllResourceList, roleSave, deleteRole, refreshRole } from '@/api/admin/role-api.js'
import { formValidator } from '@/mixins/form-validator.js'
export default {
  mixins: [search, formValidator],
  data() {
    return {
      isLoading: true,
      activeNames: ['1'],
      // 表格数据
      tableData: [],
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          roleId: '',
          roleName: ''
        }
      },
      dialogKey: 0,
      dialogType: 'add',
      // tab控件
      activeName: 'menu',
      // 修改角色数据
      showDialog: false,
      basicInfo: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      vTree: false,
      // 菜单显示
      createTree: [],
      checkedKeys: [],
      allUrl: [],
      urlMultipleSelection: [],
      allPageRes: [],
      pageMultipleSelection: [],
      allRoutes: [],
      routeMultipleSelection: [],
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getRoleList(this.searchParam)
      if (res && res.success) {
        const { results, pageNo, totalRecord } = res.datas.searchResult
        this.tableData = results
        this.searchParam.pageNo = pageNo
        this.searchParam.totalRecord = totalRecord
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    async getTreeAndList(callback) {
      if (this.createTree.length === 0 && this.allUrl.length === 0 && this.allPageRes.length === 0 && this.allRoutes.length === 0) {
        const res = await getAllResourceList()
        this.createTree = res.datas.allMenu
        this.allUrl = res.datas.allUrl
        this.allPageRes = res.datas.allPageRes
        this.allRoutes = res.datas.allRoutes
      }
      callback && callback()
    },
    handleEdit(val) {
      this.basicInfo = { ...val }
      this.dialogType = 'edit'
      this.activeName = 'menu'
      this.getTreeAndList(() => {
        editDetail(val.id).then((res) => {
          this.dialogKey++
          this.validatorState = true
          this.showDialog = true
          // this.checkedKeys = res.datas.menuCheckedKeys
          // // console.log(this.menuTreeFilter(this.createTree, res.datas.menuCheckedKeys))
          this.checkedKeys = this.menuTreeFilter(this.createTree, res.datas.menuCheckedKeys)
          this.$nextTick(function () {
            this.clearErrorMessage()
            res.datas.urlCheckedKeys.forEach(i => {
              this.$refs.resUrlMultipleTable.toggleRowSelection(this.allUrl.filter(item => item.id === i)[0], true)
            })
            res.datas.pageCheckedKeys.forEach(i => {
              this.$refs.pageMultipleTable.toggleRowSelection(this.allPageRes.filter(item => item.id === i)[0], true)
            })
            res.datas.routeCheckedKeys.forEach(i => {
              this.$refs.resRouteMultipleTable.toggleRowSelection(this.allRoutes.filter(item => item.id === i)[0], true)
            })
          })
        })
      })
    },
    handleSave() {
      if (!this.validatorAll()) {
        return false
      }
      this.basicInfo.menuList = this.$refs.addTree.getCheckedKeys()
      this.basicInfo.urlList = this.urlMultipleSelection
      this.basicInfo.pageList = this.pageMultipleSelection
      this.basicInfo.routeList = this.routeMultipleSelection
      const params = { ...this.basicInfo }
      roleSave(params).then(() => {
        this.showDialog = false
        this.search()
      })
    },
    batchDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm(this.$t('comm.tip2'), this.$t('comm.tips'), {
          confirmButtonText: this.$t('comm.certain'),
          cancelButtonText: this.$t('comm.cancel'),
          type: 'warning'
        }).then(() => {
          deleteRole(this.multipleSelection).then(() => {
            this.search()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('comm.msg1')
          })
        })
      } else {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg3')
        })
      }
    },
    refreshRole() {
      this.$confirm(this.$t('comm.tip3'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async () => {
        await refreshRole()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    async handleCreate() {
      this.basicInfo = {}
      this.dialogType = 'create'
      this.activeName = 'menu'
      this.validatorState = false
      this.dialogKey++
      this.checkedKeys = []
      this.urlMultipleSelection = []
      this.pageMultipleSelection = []
      this.routeMultipleSelection = []
      this.getTreeAndList()
      this.showDialog = true
    },
    handleDelete(index, rowData) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        deleteRole([rowData]).then(() => {
          this.search()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    urlHandleSelectionChange(val) {
      this.urlMultipleSelection = val
    },
    pageHandleSelectionChange(val) {
      this.pageMultipleSelection = val
    },
    routeHandleSelectionChange(val) {
      this.routeMultipleSelection = val
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    menuTreeFilter(allMenu = [], selectIds = []) {
      // // console.log(allMenu)
      const bassicsNodes = []
      getBasicsNode(allMenu)
      // // console.log(bassicsNodes)
      return bassicsNodes.filter(item => selectIds.indexOf(item) > -1)
      function getBasicsNode(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            getBasicsNode(arr[i].children)
          } else {
            bassicsNodes.push(arr[i].id)
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.role {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 6px;
  background-color: #fff;
  .search {
    .btns {
      padding: 10px 0;
      text-align: right;
    }
  }
  .content {
    .pagination {
      text-align: right;
      padding: 10px 0;
    }
    .roleDialog {
      .main {
        h4 {
          height: 30px;
          line-height: 30px;
          margin: 15px 0;
          border-bottom: 1px dashed #ccc;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
