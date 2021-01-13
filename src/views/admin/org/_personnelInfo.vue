<template>
  <div v-loading="isLoading">
    <div class="input_box">
      <div class="flex1">
        <h4>用户信息维护</h4>
      </div>
      <div class="flex2">
        <div class="title">
          年度
        </div>
        <div class="input">
          {{ validYear }}
        </div>
      </div>
      <div class="flex2">
        <div v-if="personEdit.id === ''" class="input">
          <div class="input">
            <el-button icon="el-icon-search" size="mini" round type="success" @click.stop="userChose('personEdit')">
              {{ $t('admin.org.selectUser') }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="flex2">
        <div class="title must">
          {{ $t('admin.org.fullName') }}
        </div>
        <div class="input">
          <el-input
            v-model="personEdit.nickName"
            class="input"
            :placeholder="$t('admin.org.fullName')"
            @blur="validator('userEditNickName')"
          />
          <span ref="userEditNickName" data-roles="required" :data-value="personEdit.nickName" class="message" />
        </div>
      </div>
      <div class="flex2">
        <div class="title must">
          <!-- 系统登入用户名 -->
          {{ $t('admin.org.systemLoginUsername') }}
        </div>
        <div v-if="personEdit.id !== ''" class="input">
          {{ personEdit.userName }}
        </div>
        <div v-if="personEdit.id === ''" class="input">
          <el-input
            v-model="personEdit.userName"
            class="input"
            :placeholder="$t('admin.org.systemLoginUsername')"
          />
          <span ref="userEdituserName" data-roles="required" :data-value="personEdit.userName" class="message" />
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.org.password') }}
        </div>
        <div class="input">
          <el-input
            v-model="personEdit.password"
            type="password"
            class="input"
            :placeholder="$t('admin.org.password')"
          />
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.org.confirmPassword') }}
        </div>
        <div class="input">
          <el-input
            v-model="personEdit.rePassword"
            class="input"
            type="password"
            :placeholder="$t('admin.org.confirmPassword')"
            @blur="checkPassword('personEdit')"
          />
          <span ref="userEditRePassword" class="message" />
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.org.corpUserId') }}
        </div>
        <div class="input">
          <el-input
            v-model="personEdit.corpUserId"
            class="input"
            :placeholder="$t('admin.org.corpUserId')"
          />
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.org.mobile') }}
        </div>
        <div class="input">
          <el-input
            v-model="personEdit.mobile"
            class="input"
            :placeholder="$t('admin.org.mobile')"
          />
        </div>
      </div>
      <div class="flex2">
        <div class="title must">
          {{ $t('admin.org.authMode') }}
        </div>
        <div class="input">
          <dict-select v-model="personEdit.authMode" dict-type-id="AuthMode" class="input" @blur="validator('userEditNickName')" />
          <span ref="userEditauthMode" data-roles="required" :data-value="personEdit.authMode" class="message" />
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.org.language') }}
        </div>
        <div class="input">
          <dict-select v-model="personEdit.language" dict-type-id="Language" class="input" />
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.org.ldapUserId') }}
        </div>
        <div class="input">
          <el-input
            v-model="personEdit.ldapUserId"
            class="input"
            :placeholder="$t('admin.org.ldapUserId')"
          />
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.org.email') }}
        </div>
        <div class="input">
          <el-input
            v-model="personEdit.email"
            class="input"
            :placeholder="$t('admin.org.email')"
          />
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.user.status') }}
        </div>
        <div class="input">
          <dict-select v-model="personEdit.status" dict-type-id="UserStatus" class="input" />
        </div>
      </div>
      <div class="flex2">
        <div class="title must">
          {{ $t('admin.org.userLock') }}
        </div>
        <div class="input">
          <dict-select v-model="personEdit.isLocked" dict-type-id="IsNo" class="input" />
          <!-- <span ref="userIsLocked" data-roles="required" :data-value="addUserData.authMode" class="message" /> -->
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.org.invalidDate') }}
        </div>
        <div class="input">
          <el-date-picker
            v-model="personEdit.invalidDate"
            class="input"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          />
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.org.jobRank') }}
        </div>
        <div class="input">
          <dict-select v-model="personEdit.jobRank" dict-type-id="JobRank" class="input" />
        </div>
      </div>
      <div class="flex2">
        <div class="title">
          {{ $t('admin.org.staffNum') }}
        </div>
        <div class="input">
          <el-input
            v-model="personEdit.staffNum"
            class="input"
            :placeholder="$t('admin.org.staffNum')"
          />
        </div>
      </div>
    </div>
    <div class="personnel">
      <div v-for="(userOrg,index) in personEdit.userOrgs" :key="index" style="margin-top:20px">
        <!-- 所属机构 -->
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>{{ $t('admin.org.organization') }}{{ index+1 }}</span>
            <el-button icon="el-icon-delete" type="danger" style="float: right; padding: 3px 0;" @click="HandleOrgDelete('personEdit', index)">
              {{ $t('admin.org.dOrganization') }}
            </el-button>
          </div>
          <div>
            <div class="input_box">
              <div class="flex3">
                <div class="title">
                  {{ $t('admin.org.orgId') }}:
                </div>
                <div class="input">
                  <el-input v-model="userOrg.orgId" :placeholder="$t('admin.org.orgId')" class="input" :disabled="true" />
                </div>
              </div>
              <div class="flex3">
                <div class="title">
                  {{ $t('admin.org.orgName') }}:
                </div>
                <div class="input">
                  <el-input v-model="userOrg.orgName" :placeholder="$t('admin.org.orgCode')" class="input" :disabled="true" />
                </div>
              </div>
              <div class="flex3">
                <div class="title" />
                <div class="input">
                  <el-button size="mini" icon="el-icon-edit" type="primary" style="float: right; padding: 3px 0" @click.stop="orgChoseAndAddOrgRow('personEdit', index)">
                    切换组织
                  </el-button>
                </div>
              </div>
              <div class="flex3">
                <div class="title">
                  {{ $t('admin.org.userId') }}:
                </div>
                <div class="input">
                  <el-input v-model="userOrg.userId" class="input" :disabled="true" />
                </div>
              </div>
              <div class="flex3">
                <div class="title">
                  {{ $t('admin.org.post') }}:
                </div>
                <div class="input">
                  <dict-select v-model="userOrg.positionCode" dict-type-id="Position" />
                </div>
              </div>
              <div class="flex3">
                <div class="title">
                  {{ $t('admin.org.isMain') }}:
                </div>
                <div class="input">
                  <dict-select v-model="userOrg.isMain" dict-type-id="IsNo" />
                </div>
              </div>
            </div>
            <!-- 机构所属角色-->
            <div>
              <el-button size="mini" icon="el-icon-edit" type="primary" style="float: right; padding: 3px 0" @click.stop="roleChose('personEdit', index)">
                {{ $t('admin.org.addRole') }}
              </el-button>
              <div class="table">
                <el-table
                  :data="userOrg.userRoles"
                  border
                  height="200"
                  style="width: 100%"
                >
                  <el-table-column :label="$t('comm.operation')" width="70" :style="{textAlign: 'center'}">
                    <template slot-scope="scope">
                      <!--
                      <el-button
                        style="max-height: 20px;"
                        size="mini"
                        icon="el-icon-delete"
                        type="danger"
                        @click="roleHandleDelete('personEdit', scope.row, index, scope.$index)"
                      /> -->
                      <p class="advice-operation-left">
                        <span class="advice-deleted-btn" @click="roleHandleDelete('personEdit', scope.row, index, scope.$index)">
                          <i class="iconfont iconshanchu1" />删除
                        </span>
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('admin.org.roleId')" prop="roleId" />
                  <el-table-column :label="$t('admin.org.roleName')" prop="roleName" />
                </el-table>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <el-row>
        <el-button
          size="mini"
          icon="el-icon-edit"
          type="primary"
          style="margin: 10px;    float: right;"
          @click.stop="orgChoseAndAddOrgRow('personEdit', -1)"
        >
          增加组织
        </el-button>
      </el-row>

      <!-- 保存，取消按钮 -->
      <el-row
        class="btn"
        style="margin-bottom: 50px;"
      >
        <ul class="content-top-btn">
          <li class="operation-item" @click="userSave('personEdit')">
            <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont icon-wendang" /></span>
            <span class="operation-text">保&nbsp;存</span>
          </li>
        </ul>
      </el-row>
    </div>

    <!-- 选择组织的popup -->
    <div class="orgChoseDilog">
      <el-dialog
        :title="$t('admin.org.selectOrg')"
        :visible.sync="orgChoseDilog"
        width="35%"
        center
      >
        <div class="box">
          <tissue-tree tree-type="department" :valid-year="validYear" @select="selectP" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="orgChoseDilog = false">{{ $t('comm.cancel') }}</el-button>
          <el-button type="primary" @click="handleNodeClick(selectData)">{{ $t('comm.certain') }}</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 选择角色popup -->
    <!-- 角色选择Dilog -->
    <div class="roleChoseDilog">
      <el-dialog
        :title="$t('admin.org.selectRole')"
        :visible.sync="roleChoseDilog"
        width="80%"
        center
      >
        <div class="role_chose">
          <div class="basic">
            <div class="input_box">
              <div class="flex3">
                <div class="title">
                  {{ $t('admin.org.roleId') }}
                </div>
                <el-input v-model="searchId" :placeholder="$t('admin.org.roleId')" clearable />
              </div>
              <div class="flex3">
                <div class="title">
                  {{ $t('admin.org.roleName') }}
                </div>
                <el-input v-model="searchName" :placeholder="$t('admin.org.roleName')" clearable />
              </div>
              <div class="flex3">
                <el-button type="success" class="el-icon-search" @click="searchRole">
                  {{ $t('admin.org.screen') }}
                </el-button>
              </div>
            </div>
            <div class="table">
              <el-table
                ref="roleChoseMultipleTable"
                :data="roleChoseData"
                border
                style="width: 100%"
                @select="handleRoleSelect"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  prop="id"
                  :label="$t('admin.org.roleId')"
                />
                <el-table-column
                  prop="roleName"
                  :label="$t('admin.org.roleName')"
                />
                <el-table-column
                  prop="roleDesc"
                  :label="$t('admin.org.desc')"
                />
              </el-table>
            </div>
          </div>
        </div>
        <span slot="footer">
          <el-button @click="roleChoseDilog = false">{{ $t('comm.cancel') }}</el-button>
          <el-button type="primary" @click="rolesSelect()">{{ $t('comm.certain') }}</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 选择现有用户 el-dialog start -->
    <el-dialog
      :title="$t('admin.org.selectUser')"
      :visible.sync="userChoseDilog"
      width="80%"
      center
      class="content-dialog-box  search-light"
      :close-on-click-modal="false"
      custom-class="dialog-drag fixed-search-btn-box"
    >
      <div class="user_chose">
        <div class="basic">
          <div class="input_box">
            <div class="flex3">
              <div class="title">
                {{ $t('admin.org.fullName') }}
              </div>
              <el-input v-model="searchParam.params.nickName" :placeholder="$t('admin.org.fullName')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                {{ $t('admin.org.sysName') }}
              </div>
              <el-input v-model="searchParam.params.userName" :placeholder="$t('admin.org.sysName')" clearable />
            </div>
            <div class="flex3">
              <el-button type="success" class="el-icon-search" @click="selectUser">
                {{ $t('admin.org.screen') }}
              </el-button>
            </div>
          </div>
          <div class="table">
            <el-table
              ref="userChoseMultipleTable"
              class="scroll-table-box"
              :data="userChoseData"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column width="40" :resizable="false" class-name="table-radio" fixed>
                <template scope="scope">
                  <el-radio v-model="radio" :label="scope.$index" class="textRadio" @change.native="getCurrentUser(scope.row)" />
                </template>
              </el-table-column>

              <el-table-column
                prop="id"
                width="150"
                :label="$t('admin.org.userId')"
              />
              <el-table-column
                prop="nickName"
                :label="$t('admin.org.fullName')"
              />
              <el-table-column
                prop="orgName"
                width="350"
                :label="$t('admin.org.organization')"
              />

              <el-table-column
                prop="userName"
                :label="$t('admin.org.sysName')"
              />
              <el-table-column
                prop="corpUserId"
                :label="$t('admin.org.corpUserId')"
              />
              <!--
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
              /> -->
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
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="userSelect()">{{ $t('comm.certain') }}</el-button>
      </span>
    </el-dialog> <!-- 选择现有用户 el-dialog   end -->
  </div>
</template>
<script>
import { formValidator } from '@/mixins/form-validator.js'
import { userSave, orgUserInfo } from '@/api/admin/org-api.js'
import DictSelect from '@/components/DictSelect'
import TissueTree from '@/components/TissueTree.vue'
import { getAllRole } from '@/api/admin/role-api.js'
import { getUserList } from '@/api/admin/user-api.js'

export default {
  components: {
    DictSelect,
    TissueTree
  },
  mixins: [formValidator],
  props: {
    selectedUserId: {
      type: String,
      default: ''
    },
    userEditFlag: {
      type: Boolean,
      default: false
    },
    validYear: {
      type: String,
      default: ''

    },
    newUserOrg: {
      type: Object,
      default: null

    }
  },

  data() {
    return {
      radio: -1, // x选择人员的初始值
      personEdit: {
        id: '',
        nickName: '',
        userName: '',
        password: '',
        rePassword: '',
        corpUserId: '',
        mobile: '',
        authMode: 'local',
        language: 'zh_CN',
        ldapUserId: '',
        email: '',
        deleteFlag: '0',
        isLocked: '0',
        invalidDate: '',
        jobRank: '',
        staffNum: '',
        validYear: '',
        status: '0',
        userOrgs: [{
          orgId: '',
          orgName: '',
          positionCode: '',
          isMain: '',
          userId: '',
          userRoles: []
        }]
      },
      isLoading: false,
      orgChoseDilog: false,
      orgChoseIndex: 0,
      orgAddOrEdit: null,
      roleChoseDilog: false,
      roleChoseData: [],
      searchId: '',
      searchName: '',
      allRoleList: [],
      selectCurrentUser: null,
      userChoseDilog: false,
      allUserList: [],
      userChoseData: [],
      searchParam: {
        paging: false,
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
      }

    }
  },
  watch: {
    selectedUserId: 'fetchUserInfo',
    newUserOrg: 'fetchUserInfo'
  },
  created() {
    this.fetchUserInfo()
  },
  methods: {
    resetTable(params) {
      for (var i in params) {
        params[i] = ''
      }
    },
    selectP(data) {
      this.selectData = data
    },
    initPersonInfo() {
      this.personEdit.password = ''
      this.personEdit.rePassword = ''
      this.personEdit.authMode = 'local'
      this.personEdit.language = 'zh_CN'
      this.personEdit.deleteFlag = '0'
      this.personEdit.isLocked = '0'
      this.personEdit.status = '1'

      if (this.newUserOrg !== null) {
        this.personEdit.userOrgs = []
        this.personEdit.userOrgs.push({ orgId: this.newUserOrg.orgId, orgName: this.newUserOrg.orgName })
        const userRoles = []
        userRoles.push({ roleId: 'ROLE_OPC_SYS_TOOL_AUTH', roleName: '系统功能照会角色' })
        this.personEdit.userOrgs[0].userRoles = userRoles
      }
    },
    fetchUserInfo() {
      this.searchParam.params.validYear = this.validYear
      this.resetTable(this.personEdit)
      // 点击左键时触发
      if (this.selectedUserId === null || this.selectedUserId === '') {
        this.initPersonInfo()
        return
      }

      this.fetchUserInfoDetail(this.selectedUserId, false)
    },
    // 取得数据，画面中
    fetchUserInfoDetail(userId, fromUserFlag) {
      this.isLoading = true
      orgUserInfo(userId, this.validYear).then(res => {
        const user = res.datas.user
        const dbUserOrgs = res.datas.userOrgs
        this.personEdit.password = ''
        this.personEdit.rePassword = ''
        this.personEdit.id = user.id
        this.personEdit.nickName = user.nickName
        this.personEdit.userName = user.userName
        this.personEdit.corpUserId = user.corpUserId
        this.personEdit.mobile = user.mobile
        this.personEdit.authMode = user.authMode
        this.personEdit.language = user.language
        this.personEdit.ldapUserId = user.ldapUserId
        this.personEdit.email = user.email
        this.personEdit.deleteFlag = user.deleteFlag + ''
        this.personEdit.isLocked = user.isLocked + ''
        this.personEdit.invalidDate = user.invalidDate
        this.personEdit.jobRank = user.jobRank
        this.personEdit.staffNum = user.staffNum
        this.personEdit.status = user.status + ''

        const personUserOrgs = []

        if (dbUserOrgs === null || dbUserOrgs.length === 0) {
          this.personEdit.userOrgs = [{
            orgId: this.newUserOrg.orgId,
            orgName: this.newUserOrg.orgName, userId: userId
          }]
          this.personEdit.userOrgs[0].userRoles = [{ roleId: 'ROLE_OPC_SYS_TOOL_AUTH', roleName: '系统功能照会角色' }]
          this.isLoading = false
          return
        }

        // 画面中有的组织，DB里没有的, 去重
        let currentOrgNotRegist = false
        if (fromUserFlag) {
          // 去掉重复的项目
          // 如果现有组织数组里有没有和后台相同的orgId
          const userOrgId = this.newUserOrg.orgId
          var findIndex = dbUserOrgs.findIndex((item) => {
            return item.orgId === userOrgId
          })
          // 如果有相同的覆盖当前画面
          if (findIndex > -1) {
            currentOrgNotRegist = true
          }

          // 确认用户是否已经被使用，被使用的时候，
          // 表示错误信息，该用户已经追加到了对象组织。
          // var orgFullName = ''
          var findUserIndex = dbUserOrgs.findIndex((item) => {
            // orgFullName = item.orgName
            return item.userId === userId
          })

          // if (findUserIndex > -1) {
          //   // this.$message({
          //   //   type: 'warning',
          //   //   message: this.$t('admin.org.msg4', { para0: this.validYear, para1: orgFullName })
          //   // })

          //   this.isLoading = false
          //   return
          // }

          // 如果用户还没有这个组织
          if (currentOrgNotRegist === false) {
            let newOrgUserId = userId
            if (findUserIndex > -1) {
              newOrgUserId = ''
            }
            personUserOrgs.push({
              orgId: this.newUserOrg.orgId,
              orgName: this.newUserOrg.orgName,
              userId: newOrgUserId,
              userRoles: [{ roleId: 'ROLE_OPC_SYS_TOOL_AUTH', roleName: '系统功能照会角色' }]
            })
          }
        }

        dbUserOrgs.forEach(data => {
          personUserOrgs.push({
            orgId: data.orgId,
            orgName: data.orgName,
            positionCode: data.positionCode,
            isMain: data.isMain,
            userId: data.userId,
            userRoles: data.userRoles
          })
        })

        this.personEdit.userOrgs = personUserOrgs
        this.isLoading = false
      })
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
    },
    userSave(table) {
      this.userSaveProcess(table)
    },
    userSaveProcess(table) {
      // 获取当前年度
      this[table].validYear = this.validYear
      let startValid = ''
      // if (this.selectedUserId === '') {
      //   startValid = 'userAdd'
      //   this[table].id = null
      // } else if (table === 'personEdit') {
      startValid = 'userEdit'
      // }
      if (!this.validatorAll(startValid) | !this.checkPassword(table)) {
        return false
      }
      const item = this[table].userOrgs

      if (!item || item.length === 0) { // 没有组织
        this.$message({
          type: 'error',
          message: this.$t('comm.msg8')
        })
        return
      }

      let checkFlag = true // 错误flag
      let mainPostionCnt = 0 // 主要岗位的数量
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
            message: this.$t('comm.msg9')
          })
          checkFlag = false
          break
        }
        if (item[i].isMain === '1') {
          mainPostionCnt++
        }

        // 检查是否有角色
        const roleItem = this[table].userOrgs[i].userRoles
        if (!roleItem || roleItem.length === 0) {
          this.$message({
            type: 'error',
            message: this.$t('comm.msg7')
          })
        }
      }
      if (checkFlag) {
        // modify by wanglei 20200527
        if (mainPostionCnt !== 1) {
          this.$message({
            type: 'error',
            message: this.$t('comm.msg10')
          })
          return
        }
        this.isLoading = true
        this.$confirm(this.$t('comm.tip10'), this.$t('comm.tips'), {
          confirmButtonText: this.$t('comm.certain'),
          cancelButtonText: this.$t('comm.cancel'),
          type: 'warning'
        }).then(() => {
          userSave(this[table]).then(res => {
            if (res && res.success) {
              this.$emit('searchTree')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('comm.msg1')
          })
        })

        this.isLoading = false

        // }
      }
    },
    // 删除组织
    HandleOrgDelete(table, index) {
      if (this[table].userOrgs.length === 1) {
        this.$message({
          type: 'error',
          message: this.$t('comm.msg39')
        })
        return
      }
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        this[table].userOrgs.splice(index, 1)
        // this.orgChoseName.splice(index, 1)
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
    // 点击增加组织按钮
    orgChoseAndAddOrgRow(table, index) {
      // const orgCount = this[table].userOrgs.length
      // // console.log(orgCount)

      this.orgChoseIndex = index
      this.orgAddOrEdit = table
      this.orgChoseDilog = true

      // this.orgChoseName.push('')
    },

    // 增加组织画面确定后
    handleNodeClick(data) {
      if (data.id === '_1') {
        this.$message({
          type: 'error',
          message: this.$t('comm.msg22')
        })
        return false
      }

      const repeat = this[this.orgAddOrEdit].userOrgs.filter(item => item.orgId === data.id)
      if (repeat.length > 0) {
        this.$message({
          type: 'error',
          message: this.$t('comm.msg23')
        })
        return false
      }

      // 如果是切换组织的时候
      if (this.orgChoseIndex !== -1) {
        this[this.orgAddOrEdit].userOrgs[this.orgChoseIndex].orgId = data.id
        this[this.orgAddOrEdit].userOrgs[this.orgChoseIndex].orgName = data.name

        this.orgChoseDilog = false
        return
      }
      const userRoles = []
      userRoles.push({ roleId: 'ROLE_OPC_SYS_TOOL_AUTH', roleName: '系统功能照会角色' })
      // console.log(userRoles)
      const newRow = {
        orgId: data.id,
        orgName: data.name,
        positionCode: '',
        isMain: '',
        userRoles
      }
      // // console.log(newRow)
      this[this.orgAddOrEdit].userOrgs.push(newRow)
      // // console.log(this[this.orgAddOrEdit].userOrgs)
      this.orgChoseDilog = false
    },
    async roleChose(table, index) {
      if (this.allRoleList.length === 0) {
        const res = await getAllRole()
        this.allRoleList = res.datas.allRole
      }
      this.allRoleList.forEach((item) => { item.checkFlag = false })
      this.searchId = ''
      this.searchName = ''
      this.roleChoseData = [...this.allRoleList]
      this.$nextTick(() => {
        // this[table].userOrgs.forEach(org => {
        this[table].userOrgs[index].userRoles.forEach(role => {
          const roles = this.roleChoseData.filter(item => item.id === role.roleId)
          if (roles.length > 0) {
            this.$refs.roleChoseMultipleTable.toggleRowSelection(roles[0], true)
            roles[0].checkFlag = true
          }
        })
        // })
      })
      this.orgChoseIndex = index
      this.roleChoseDilog = true
      this.addOrEdit = table
    },
    // 选择role
    handleRoleSelect(selection, row) {
      const roles = selection.filter(item => item.id === row.id)
      if (roles.length > 0) {
        row.checkFlag = true
      } else {
        row.checkFlag = false
      }
    },
    // 检索role
    searchRole() {
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
      this.$nextTick(() => {
        this.roleChoseData.forEach(obj => {
          if (obj.checkFlag) {
            this.$refs.roleChoseMultipleTable.toggleRowSelection(obj, true)
          }
        })
      })
    },
    // role检索画面的检索
    rolesSelect() {
      const role = []
      this.allRoleList.forEach((obj) => {
        if (obj.checkFlag) {
          role.push({ roleId: obj.id, roleName: obj.roleName })
        }
      })
      this.personEdit.userOrgs[this.orgChoseIndex].userRoles = role

      this.roleChoseDilog = false
    },
    // 删除一个role
    roleHandleDelete(table, row, orgIndex, rowIndex) {
      if (row.roleId === 'ROLE_OPC_SYS_TOOL_AUTH') {
        this.$message({
          type: 'error',
          message: this.$t('comm.msg40')
        })
        return
      }
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        this[table].userOrgs[orgIndex].userRoles.splice(rowIndex, 1)
        this.roleChoseName.splice(rowIndex, 1)
        this.$message({
          type: 'success',
          message: this.$t('comm.msg2')
        })
      }).catch((e) => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    async userChose(table) {
      if (this.allUserList.length === 0) {
        const res = await getUserList(this.searchParam)
        this.allUserList = res.datas.searchResult.results
      }
      this.allUserList.forEach((item) => { item.checkFlag = false })
      this.searchParam.params.nickName = ''
      this.searchParam.params.userName = ''
      this.userChoseData = [...this.allUserList]
      this.$nextTick(() => {
        const userId = this[table].id
        const users = this.userChoseData.filter(item => item.id === userId)
        this.$refs.userChoseMultipleTable.toggleRowSelection(users, true)
        users.checkFlag = true
      })
      this.paginationFlag = 'userList'
      this.userChoseDilog = true
      this.addOrEdit = table
    },
    userSelect() {
      const userId = this.selectCurrentUser.id

      this.fetchUserInfoDetail(userId, true)
      this.userChoseDilog = false
    },
    selectUser() {
      this.userChoseData = this.allUserList.filter(item => {
        // 筛选条件都为空
        if (!this.searchParam.params.userName && !this.searchParam.params.nickName) {
          return true
        } else {
          let flag = true
          if (this.searchParam.params.userName && item.userName.toLowerCase().indexOf(this.searchParam.params.userName.toLowerCase()) < 0) {
            flag = false
          }
          if (this.searchParam.params.nickName && item.nickName.toLowerCase().indexOf(this.searchParam.params.nickName.toLowerCase()) < 0) {
            flag = false
          }
          return flag
        }
      })
      this.$nextTick(() => {
        this.userChoseData.forEach(obj => {
          if (obj.checkFlag) {
            this.$refs.userChoseMultipleTable.toggleRowSelection(obj, true)
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
    },
    // 选择现有用户画面，取得用户
    getCurrentUser(row) {
      this.selectCurrentUser = row
    },
    handleSelectionChange(val) {

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
.orgChoseDilog .el-dialog__body {
  height: 450px !important;
}
</style>

