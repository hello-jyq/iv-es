<template>
  <div id="user" class="user">
    <div class="search">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span slot="title" class="collapse-title">{{ $t('comm.queryCriteria') }}</span>
          <div class="input_box">
            <div class="flex3">
              <div class="title">
                <!-- 用户名: -->
                {{ $t('admin.user.userName') }}
              </div>
              <el-input v-model="searchParam.params.userName" class="input" :placeholder="$t('admin.user.userName')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 姓名: -->
                {{ $t('admin.user.nickName') }}
              </div>
              <el-input v-model="searchParam.params.nickName" class="input" :placeholder="$t('admin.user.nickName')" clearable />
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
        :data="userList"
        border
        style="width: 100%"
        height="579"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          :label="$t('comm.operation')"
          min-width="70"
          width="70"
        >
          <template slot-scope="scope">
            <!--<el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row, scope.$index)" />-->
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row, scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column
          label="ID"
          min-width="150"
          prop="id"
        />
        <el-table-column
          prop="userName"
          :label="$t('admin.user.userName')"
          min-width="140"
        />
        <el-table-column
          prop="nickName"
          :label="$t('admin.user.nickName')"
          min-width="80"
        />
        <el-table-column
          prop="mobile"
          :label="$t('admin.user.mobile')"
          min-width="120"
        />
        <el-table-column
          prop="email"
          :label="$t('admin.user.email')"
          min-width="120"
        />
        <el-table-column
          prop="deleteFlag"
          :label="$t('admin.user.deleteFlag')"
          min-width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <dict-write dict-type-id="DeleteFlag" :value="scope.row.deleteFlag" />
          </template>
        </el-table-column>
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
    </div>
    <div class="editDilog">
      <el-dialog
        :title="dialogType==='create'?$t('comm.newlyBuild'):$t('comm.edit')"
        :visible.sync="showDialog"
        width="80%"
        center
      >
        <div class="personnel">
          <h4>{{ $t('comm.essentialInformation') }}</h4>
          <div class="input_box">
            <div class="flex2">
              <div class="title must">
                <!-- 姓名 -->
                {{ $t('admin.user.nickName') }}
              </div>
              <div class="input">
                <el-input
                  v-model="dialogObj.nickName"
                  class="input"
                  :placeholder="$t('admin.user.nickName')"
                  @blur="validator('userNickName')"
                />
                <span ref="userNickName" data-roles="required" :data-value="dialogObj.nickName" class="message" />
              </div>
            </div>
            <div class="flex2">
              <div class="title must">
                <!-- 系统登录用户名 -->
                {{ $t('admin.user.sysName') }}
              </div>
              <div class="input">
                <el-input
                  v-model="dialogObj.userName"
                  class="input"
                  :placeholder="$t('admin.user.sysName')"
                />
                <span ref="userName" data-roles="required" :data-value="dialogObj.userName" class="message" />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 密码 -->
                {{ $t('admin.user.password') }}
              </div>
              <div class="input">
                <el-input
                  v-model="dialogObj.password"
                  class="input"
                  type="password"
                  :placeholder="$t('admin.user.password')"
                />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 确认密码 -->
                {{ $t('admin.user.confirmPassword') }}
              </div>
              <div class="input">
                <el-input
                  v-model="dialogObj.rePassword"
                  class="input"
                  type="password"
                  :placeholder="$t('admin.user.confirmPassword')"
                  @blur="checkPassword()"
                />
                <span ref="userRePassword" class="message" />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 企业微信用户名 -->
                {{ $t('admin.user.corpUserId') }}
              </div>
              <div class="input">
                <el-input
                  v-model="dialogObj.corpUserId"
                  class="input"
                  :placeholder="$t('admin.user.corpUserId')"
                />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 手机号码 -->
                {{ $t('admin.user.mobile') }}
              </div>
              <div class="input">
                <el-input
                  v-model="dialogObj.mobile"
                  class="input"
                  :placeholder="$t('admin.user.mobile')"
                />
              </div>
            </div>
            <div class="flex2">
              <div class="title must">
                <!-- 密码认证模式 -->
                {{ $t('admin.user.authMode') }}
              </div>
              <div class="input">
                <dict-select v-model="dialogObj.authMode" dict-type-id="AuthMode" />
                <span ref="userAuthMod" data-roles="required" :data-value="dialogObj.authMode" class="message" />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 语言 -->
                {{ $t('admin.user.language') }}
              </div>
              <div class="input">
                <dict-select v-model="dialogObj.language" dict-type-id="Language" />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- AD账号用户名 -->
                {{ $t('admin.user.ldapUserId') }}
              </div>
              <div class="input">
                <el-input
                  v-model="dialogObj.ldapUserId"
                  class="input"
                  :placeholder="$t('admin.user.ldapUserId')"
                />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 邮箱 -->
                {{ $t('admin.user.email') }}
              </div>
              <div class="input">
                <el-input
                  v-model="dialogObj.email"
                  class="input"
                  :placeholder="$t('admin.user.email')"
                />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 状态 -->
                {{ $t('admin.user.status') }}
              </div>
              <div class="input">
                <div class="input must">
                  <dict-select v-model="dialogObj.status" dict-type-id="UserStatus" />
                  <span ref="userstatus" data-roles="required" :data-value="dialogObj.status" class="message" />
                </div>
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 用户锁定 -->
                {{ $t('admin.user.userLock') }}
              </div>
              <div class="input">
                <dict-select v-model="dialogObj.isLocked" dict-type-id="IsNo" />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 密码有效期 -->
                {{ $t('admin.user.invalidDate') }}
              </div>
              <div class="input">
                <el-input
                  v-model="dialogObj.invalidDate"
                  class="input"
                  placeholder="yyyy-MM-dd"
                />
              </div>
            </div>
          </div>
          <div class="affiliation">
            <h4>
              <!-- 所属机构 -->
              {{ $t('admin.user.affiliation') }}
              <div class="add_row iconfont icon-jia" @click.stop="addOrgRows">
                <!-- 新增所属机构 -->
                {{ $t('admin.user.addAffiliation') }}
              </div>
            </h4>
            <div class="table">
              <el-table
                :data="orgList"
                border
                height="200"
                style="width: 100%"
              >
                <el-table-column :label="$t('comm.operation')" width="70" :style="{textAlign: 'center'}">
                  <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-delete" type="danger" @click="HandleOrgDelete(scope.row, scope.$index)" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('admin.user.organization')" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="orgChose(scope.$index)">
                      <!-- 选择组织 -->
                      {{ $t('admin.user.sOrganization') }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('admin.user.aId')" prop="orgId" />
                <el-table-column :label="$t('admin.user.aName')" prop="orgName" />
                <el-table-column :label="$t('admin.user.post')">
                  <template slot-scope="scope">
                    <dict-select v-model="scope.row.positionCode" dict-type-id="Position" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('admin.user.isMain')">
                  <template slot-scope="scope">
                    <dict-select v-model="scope.row.isMain" dict-type-id="IsNo" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="role">
            <h4>
              <!-- 角色 -->
              {{ $t('admin.user.role') }}
              <div class="add_row iconfont icon-jia" @click.stop="roleChose">
                <!-- 编辑角色 -->
                {{ $t('admin.user.editRole') }}
              </div>
            </h4>
            <div class="table">
              <el-table
                :data="roleList"
                border
                height="200"
                style="width: 100%"
              >
                <el-table-column :label="$t('comm.operation')" width="70" :style="{textAlign: 'center'}">
                  <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-delete" type="danger" @click="roleHandleDelete(scope.row, scope.$index)" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('admin.user.roleId')" prop="roleId" />
                <el-table-column :label="$t('admin.user.roleName')" prop="roleName" />
              </el-table>
            </div>
          </div>
          <div class="btn">
            <el-button type="primary" size="small" @click="showDialog = false">
              <!-- 取消 -->
              {{ $t('comm.cancel') }}
            </el-button>
            <el-button type="primary" size="small" @click="handleSave">
              <!-- 保存 -->
              {{ $t('comm.save') }}
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <div class="orgChoseDilog">
      <el-dialog
        :title="$t('admin.user.sOrganization')"
        :visible.sync="orgChoseDilog"
        width="35%"
        center
      >
        <!-- <div class="basic">
            <div>
              <el-tree
                ref="orgTree"
                :data="orgChoseData"
                node-key="id"
                :props="defaultProps"
                @node-click="handleNodeClick"
              />
            </div>
          </div> -->
        <div class="box">
          <tissue-tree tree-type="department" @select="selectP" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="orgChoseDilog = false">{{ $t('comm.cancel') }}</el-button>
          <el-button type="primary" @click="handleNodeClick(selectData)">{{ $t('comm.certain') }}</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="roleChoseDilog">
      <el-dialog
        :title="$t('admin.user.selectRole')"
        :visible.sync="roleChoseDilog"
        width="80%"
        center
      >
        <div class="role_chose">
          <div class="basic">
            <div class="input_box">
              <div class="flex3">
                <div class="title">
                  <!-- 角色ID -->
                  {{ $t('admin.user.roleId') }}
                </div>
                <el-input v-model="searchId" :placeholder="$t('admin.user.roleId')" />
              </div>
              <div class="flex3">
                <div class="title">
                  <!-- 角色名称 -->
                  {{ $t('admin.user.roleName') }}
                </div>
                <el-input v-model="searchName" :placeholder="$t('admin.user.roleName')" />
              </div>
              <div class="flex3">
                <el-button type="success" class="el-icon-search" @click="selectRole">
                  <!-- 筛选 -->
                  {{ $t('admin.user.screen') }}
                </el-button>
              </div>
            </div>
            <div class="table">
              <el-table
                ref="roleChoseMultipleTable"
                :data="roleChoseData"
                border
                style="width: 100%"
                @select="handleSelect"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  prop="id"
                  :label="$t('admin.user.roleId')"
                />
                <el-table-column
                  prop="roleName"
                  :label="$t('admin.user.roleName')"
                />
                <el-table-column
                  prop="roleDesc"
                  :label="$t('admin.user.desc')"
                />
              </el-table>
            </div>
          </div>
        </div>
        <span slot="footer">
          <!-- <el-button @click="dialogVisible = false">{{$t('comm.cancel')}}</el-button> -->
          <el-button type="primary" @click="rolesSelect">{{ $t('comm.certain') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import { getUserList } from '@/api/admin/user-api.js'
import { userSave, orgUserEdit } from '@/api/admin/org-api.js'
import { getAllRole } from '@/api/admin/role-api.js'
import { formValidator } from '@/mixins/form-validator.js'
import DictSelect from '@/components/DictSelect'
import DictWrite from '@/components/DictWrite'
import TissueTree from '@/components/TissueTree.vue'
export default {
  components: {
    DictSelect,
    DictWrite,
    TissueTree
  },
  mixins: [search, formValidator],
  data() {
    return {
      isLoading: true,
      activeNames: ['1'],
      dialogType: 'create',
      showDialog: false,
      orgChoseDilog: false,
      userList: [],
      roleChoseDilog: false,
      roleChoseData: [],
      allRoleList: [],
      searchId: '',
      searchName: '',
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
      },
      dialogObj: {
        nickName: '',
        userName: '',
        password: '',
        rePassword: '',
        corpUserId: '',
        mobile: '',
        authMode: '',
        language: '',
        ldapUserId: '',
        email: '',
        deleteFlag: '',
        isLocked: '',
        invalidDate: ''
      },
      orgList: [],
      roleList: [],
      orgChoseData: [],
      orgChoseIndex: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      searchRoleList: [],
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    selectP(data) {
      this.selectData = data
    },
    async fetchData() {
      const res = await getUserList(this.searchParam)
      if (res && res.success) {
        const { results, pageNo, totalRecord } = res.datas.searchResult
        this.userList = results
        this.searchParam.pageNo = pageNo
        this.searchParam.totalRecord = totalRecord
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    resetTable(params) {
      for (var i in params) {
        params[i] = ''
      }
    },
    handleCreate() {
      this.clearErrorMessage('user')
      this.dialogObj = {}
      this.orgList = []
      this.roleList = []
      this.dialogType = 'create'
      this.showDialog = true
    },
    handleEdit(data, index) {
      this.clearErrorMessage('user')
      this.resetTable(this.dialogObj)
      this.orgList = []
      this.roleList = []
      this.dialogType = 'edit'
      orgUserEdit(data.id).then(res => {
        const user = res.datas.user
        const userOrgs = res.datas.userOrgs
        const userRoles = res.datas.userRoles
        this.dialogObj.id = user.id
        this.dialogObj.nickName = user.nickName
        this.dialogObj.userName = user.userName
        this.dialogObj.corpUserId = user.corpUserId
        this.dialogObj.mobile = user.mobile
        this.dialogObj.authMode = user.authMode
        this.dialogObj.language = user.language
        this.dialogObj.ldapUserId = user.ldapUserId
        this.dialogObj.email = user.email
        this.dialogObj.deleteFlag = user.deleteFlag + ''
        this.dialogObj.isLocked = user.isLocked + ''
        this.dialogObj.invalidDate = user.invalidDate
        userOrgs.forEach(data => {
          this.orgList.push({
            orgId: data.org_id,
            orgName: data.org_name,
            positionCode: data.position_code,
            isMain: data.is_main + ''
          })
        })
        userRoles.forEach(data => {
          this.roleList.push({
            roleId: data.role_id,
            roleName: data.role_name
          })
        })
        this.showDialog = true
      })
    },
    checkPassword() {
      if (this.dialogObj.password === this.dialogObj.rePassword) {
        this.clearErrorMessage('userRePassword')
        return true
      } else {
        this.setValidatorMessage('userRePassword', this.$t('comm.msg6'))
        return false
      }
    },
    handleSave() {
      if (!this.validatorAll('user') | !this.checkPassword()) {
        return false
      }
      const item = this.orgList
      if (!item || item.length === 0) {
        const roleItem = this.roleList
        if (!roleItem || roleItem.length === 0) {
          this.$message({
            type: 'error',
            message: this.$t('comm.msg7')
          })
        } else {
          this.dialogObj.userOrgs = this.orgList
          this.dialogObj.userRoles = this.roleList
          userSave(this.dialogObj).then(res => {
            if (res && res.success) {
              this.showDialog = false
              this.search()
            }
          })
        }
      } else {
        let checkFlag = true
        let mainPostionCnt = 0
        for (var i = 0; i < item.length; i++) {
          if (!item[i].orgId || !item[i].orgName) {
            this.$message({
              type: 'error',
              message: this.$t('comm.msg8')
            })
            checkFlag = false
            break
          }
          if (!item[i].positionCode) {
            this.$message({
              type: 'error',
              message: this.$t('comm.msg9')
            })
            checkFlag = false
            break
          }
          if (!item[i].isMain) {
            this.$message({
              type: 'error',
              message: this.$t('comm.msg25')
            })
            checkFlag = false
            break
          }
          if (item[i].isMain === '1') {
            mainPostionCnt++
          }
        }
        if (checkFlag) {
          if (mainPostionCnt !== 1) {
            this.$message({
              type: 'error',
              message: this.$t('comm.msg10')
            })
          } else {
            const roleItem = this.roleList
            if (!roleItem || roleItem.length === 0) {
              this.$message({
                type: 'error',
                message: this.$t('comm.msg7')
              })
            } else {
              this.dialogObj.userOrgs = this.orgList
              this.dialogObj.userRoles = this.roleList
              userSave(this.dialogObj).then(res => {
                if (res && res.success) {
                  this.showDialog = false
                  this.search()
                }
              })
            }
          }
        }
      }
    },
    addOrgRows() {
      const newRow = {
        orgId: '',
        orgName: '',
        positionCode: '',
        isMain: ''
      }
      this.orgList = [...this.orgList, newRow]
    },
    HandleOrgDelete(row, index) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        this.orgList.splice(index, 1)
        this.$message({
          type: 'success',
          message: this.$t('comm.msg2')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    orgChose(index) {
      this.orgChoseIndex = index
      this.orgChoseDilog = true
    },
    handleNodeClick(data) {
      // // console.log(data)
      if (data.id === '_1') {
        this.$message({
          type: 'error',
          message: this.$t('comm.msg22')
        })
        return false
      }
      const repeat = this.orgList.filter(item => item.orgId === data.id)
      if (repeat.length > 0) {
        this.$message({
          type: 'error',
          message: this.$t('comm.msg23')
        })
        return false
      }
      this.orgList[this.orgChoseIndex].orgId = data.id
      this.orgList[this.orgChoseIndex].orgName = data.name
      this.orgChoseDilog = false
    },
    async roleChose() {
      if (this.allRoleList.length === 0) {
        const res = await getAllRole()
        this.allRoleList = res.datas.allRole
      }
      this.allRoleList.forEach((item) => { item.checkFlag = false })
      this.searchId = ''
      this.searchName = ''
      this.roleChoseData = [...this.allRoleList]
      this.$nextTick(function() {
        this.roleList.forEach(obj => {
          const roles = this.roleChoseData.filter(item => item.id === obj.roleId)
          if (roles.length > 0) {
            this.$refs.roleChoseMultipleTable.toggleRowSelection(roles[0], true)
            roles[0].checkFlag = true
          }
        })
      })
      this.roleChoseDilog = true
    },
    roleHandlePageChange(currentPage) {
      this.roleSearchParam.pageNo = currentPage
      this.roleChose()
    },
    roleHandleSizeChange(val) {
      this.roleSearchParam.pageSize = val
      this.roleSearchParam.pageNo = 1
      this.roleChose()
    },
    rolesSelect() {
      const role = []
      this.allRoleList.forEach(obj => {
        if (obj.checkFlag) {
          role.push({ roleId: obj.id, roleName: obj.roleName })
        }
      })
      this.roleList = role
      this.roleChoseDilog = false
    },
    roleHandleDelete(data, index) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        this.roleList.splice(index, 1)
        this.$message({
          type: 'success',
          message: this.$t('comm.msg2')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    selectRole() {
      this.roleChoseData = this.allRoleList.filter(item => {
        // 筛选条件都为空
        if (!this.searchId && !this.searchName) {
          return true
        } else {
          let flag = true
          if (this.searchId && item.id.toLowerCase().indexOf(this.searchId.toLowerCase()) < 0) {
            flag = false
          }
          if (this.searchName && item.roleName.toLowerCase().indexOf(this.searchName.toLowerCase()) < 0) {
            flag = false
          }
          return flag
        }
      })
      this.$nextTick(function() {
        this.roleChoseData.forEach(obj => {
          if (obj.checkFlag) {
            this.$refs.roleChoseMultipleTable.toggleRowSelection(obj, true)
          }
        })
      })
    },
    handleSelect(selection, row) {
      const roles = selection.filter(item => item.id === row.id)
      if (roles.length > 0) {
        row.checkFlag = true
      } else {
        row.checkFlag = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .personnel {
    .info {
      display: flex;
      flex-wrap: wrap;
      &>div {
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
        background-image: linear-gradient(rgb(52, 165, 248), rgb(8, 142, 240));
        color: #fff;
        &:hover {
          background-image: linear-gradient(rgb(42, 155, 238), rgb(8, 142, 240));
        }
      }
    }
    .affiliation,.role {
      width: 80%;
    }
    .btn {
      width: 80%;
      box-sizing: border-box;
      padding-left: 30px;
      margin-top: 10px;
    }
  }
      .orgChoseDilog {
      .box {
        height: 300px;
        overflow: auto;
        background-color: #fff;
      }
    }
</style>
