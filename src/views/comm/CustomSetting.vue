<template>
  <div v-show="isShow" v-loading="isLoading" class="set_bg">
    <div class="set_box">
      <div class="title">
        <div>{{ $t('setting.title') }}</div>
        <span><i class="el-icon-close" @click="closedialog()" /></span>
      </div>
      <div class="set_main">
        <div class="set_menu">
          <ul>
            <li v-for="(item,index) in menu" :key="index" :class="menuActive==index?'menuActive':''" @click="menuActive=index,overscroll=true,goTop(index)">
              <i :class="item.icon" />{{ item.name }}
            </li>
          </ul>
        </div>
        <div class="set_content" :class="overscroll?'overscroll':''">
          <div id="set_1" class="set_content_item">
            <label>{{ $t('setting.searchDiv') }}</label>
            <div class="set_content_item_box">
              <span>
                <dict-radio v-model="esSearchDiv" dict-type-id="ESFuzzySearch" class="light-select" theme="theme" />
              </span>
              <button @click="changeUserSetting('SearchDiv')">
                {{ $t('comm.save') }}
              </button>
            </div>
          </div>

          <div id="set_2" class="set_content_item">
            <label>{{ $t('setting.searchTarget') }}</label>
            <div class="set_content_item_box">
              <span>
                <dict-radio v-model="esSearchTarget" dict-type-id="ESSearchTarget" class="light-select" theme="theme" />
              </span>
              <button @click="changeUserSetting('SearchTarget')">
                {{ $t('comm.save') }}
              </button>
            </div>
          </div>
          <div id="set_3" class="set_content_item">
            <label>{{ $t('setting.initOrg') }}</label>
            <div class="set_content_item_box org_group">
              <span>
                <el-radio-group v-model="initOrg">
                  <el-radio v-for="item in orgList" :key="item.id" :label="item.id">{{ item.fullName }}</el-radio>
                </el-radio-group>
              </span>
              <button v-if="showOrgSaveButtonFlag" @click="changeUserSetting('InitOrg')">
                {{ $t('comm.save') }}
              </button>
            </div>
          </div>
          <div id="set_4" class="set_content_item">
            <label>{{ $t('setting.changePassword') }}</label>
            <div class="set_content_item_box_auto">
              <div class="set_items">
                <div class="set_items_title">
                  {{ $t('comm.nowPassword') }}
                </div>
                <div class="set_items_input">
                  <el-input
                    v-model="oldPassword"
                    :placeholder="$t('comm.msgnowPassword')"
                    type="password"
                    show-password
                    @blur="validator('oldPassword')"
                  />
                  <span ref="oldPassword" data-roles="required" :data-value="oldPassword" class="message" />
                </div>
              </div>
              <div class="set_items">
                <div class="set_items_title">
                  {{ $t('comm.newPassword') }}
                </div>
                <div class="set_items_input">
                  <el-input
                    v-model="newPassword"
                    :placeholder="$t('comm.msgnewPassword')"
                    type="password"
                    maxlength="20"
                    show-password
                    @blur="validator('newPassword')"
                  />
                  <span ref="newPassword" data-roles="required,password" :data-value="newPassword" class="message" />
                </div>
              </div>
              <div class="set_items">
                <div class="set_items_title">
                  {{ $t('comm.cPassword') }}
                </div>
                <div class="set_items_input">
                  <el-input
                    v-model="reNewPassword"
                    :placeholder="$t('comm.msgcPassword')"
                    type="password"
                    maxlength="20"
                    show-password
                    @blur="validator('reNewPassword')"
                  />
                  <span ref="reNewPassword" data-roles="required,password" :data-value="reNewPassword" class="message" />
                </div>
              </div>
              <button :disabled="!validatorState" @click="handleChangePasswordOkClick">
                {{ $t('comm.save') }}
              </button>
            </div>
          </div>
          <!--
          <div id="set_5" class="set_content_item">
            <label>清空联想词</label>
            <div class="set_content_item_box_auto">
              <div>
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                  全选
                </el-checkbox>
                <button class="set_button">
                  删&nbsp;除
                </button>
              </div>
              <div class="beetween_line" />
              <el-checkbox-group v-model="Wordschecked" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="item in associatedWords" :key="item" :label="item">
                  {{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div> -->
          <div id="set_5" class="set_content_item">
            <label>{{ $t('setting.clearTeams') }}</label>
            <div class="set_content_item_box">
              <span><i class="iconfont icon-jinggao" />{{ $t('setting.msg1') }}</span>
              <button @click="handleClearTerms">
                {{ $t('comm.delete') }}
              </button>
            </div>
          </div>
          <div id="set_6" class="set_content_item">
            <label>{{ $t('setting.clearLogs') }}</label>
            <div class="set_content_item_box">
              <span><i class="iconfont icon-jinggao" />{{ $t('setting.msg2') }}</span>
              <button @click="handleClearLogs">
                {{ $t('comm.delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DictRadio from '@/components/DictRadio'
import { changePassword, changeUserSetting } from '@/api/login'
import { clearTerms, clearLogs } from '@/api/es/es-api.js'
import { formValidator } from '@/mixins/form-validator.js'
export default {
  components: {
    DictRadio
  },
  mixins: [formValidator],
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuActive: 0,
      isVisible: this.isShow,
      overscroll: false,
      menu: [
        { icon: 'iconfont icon-sousuowenjian', name: this.$t('setting.searchDiv') },
        { icon: 'iconfont icon-zhidingweizhi', name: this.$t('setting.searchTarget') },
        { icon: 'iconfont icon-zuzhiDataOrganization6', name: this.$t('setting.initOrg') },
        { icon: 'iconfont icon-mima', name: this.$t('setting.changePassword') },
        { icon: 'iconfont icon-shanchu1', name: this.$t('setting.clearTeams') },
        { icon: 'iconfont icon-qingkongbeifen', name: this.$t('setting.clearLogs') }
      ],
      searchType: '1',
      defaultOrg: '1',
      searchPosition: '1',
      oldPassword: '',
      newPassword: '',
      reNewPassword: '',
      Wordschecked: [],
      checkAll: false,
      // sociatedWords: ['neuron設計書', '導入 neuron', 'neuron導入5', 'neuron営業資', 'active directory neuron', 'elasticsearch neuron7', 'active direc1tory neuron', 'active directory neuron ', 'neuron設1計書', 'neuron導入', '導2入 neuron', 'elasticsearch neuron2', 'elasticsearch neuron'],
      isIndeterminate: false,
      esSearchDiv: '0',
      esSearchTarget: 'ALL',
      initOrg: '',
      orgList: [],
      showOrgSaveButtonFlag: false,
      isLoading: false
    }
  },
  watch: {
    'isShow': function(newVal, oldVal) {
      if (newVal === true) {
        // // console.log(this.$refs.upload)
        this.initSettings()
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.Wordschecked = val ? this.associatedWords : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.associatedWords.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.associatedWords.length
    },
    closedialog() {
      //   this.isShow = false
      this.$emit('onClose', this.isVisible)
    },
    goTop(index) {
      document.querySelector('#set_' + (index + 1)).scrollIntoView(true)
    },
    initSettings() {
      const userSettingMap = this.$store.state.userInfo.userSettingMap
      if (userSettingMap !== undefined && userSettingMap !== null) {
        if (userSettingMap.SearchDiv !== undefined) {
          this.esSearchDiv = userSettingMap.SearchDiv
        }

        if (userSettingMap.SearchTarget !== undefined) {
          this.esSearchTarget = userSettingMap.SearchTarget
        }

        if (userSettingMap.InitOrg !== undefined) {
          this.initOrg = userSettingMap.InitOrg
        } else {
          this.initOrg = this.$store.state.userInfo.orgId
        }
      } else {
        this.initOrg = this.$store.state.userInfo.orgId
        this.esSearchDiv = '0'
        this.esSearchTarget = 'ALL'
      }

      // 做成新的orgList
      const defaultOrg = {
        'id': this.$store.state.userInfo.orgId,
        'fullName': this.$store.state.userInfo.orgFullName
      }

      this.showOrgSaveButtonFlag = false
      this.orgList = []
      this.orgList.push(defaultOrg)
      const userOrgList = this.$store.state.userOrgList
      if (userOrgList !== undefined) {
        this.showOrgSaveButtonFlag = true
        userOrgList.forEach((item) => this.orgList.push(item))
      }
    },
    changeUserSetting(setType) {
      let msg = ''
      let setValue = ''

      if (setType === 'InitOrg') {
        msg = this.$t('comm.tip24')
        setValue = this.initOrg
      } else if (setType === 'SearchDiv') {
        msg = this.$t('comm.tip22')
        setValue = this.esSearchDiv
      } else if (setType === 'SearchTarget') {
        msg = this.$t('comm.tip23')
        setValue = this.esSearchTarget
      }

      this.$confirm(msg, this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const param = { key: setType, value: setValue }
        const res = await changeUserSetting(param)
        // eslint-disable-next-line no-empty
        if (res && res.success) {
          // 反写设置
          const userInfo = this.$store.state.userInfo
          let userSettingMap = userInfo.userSettingMap
          if (userSettingMap === undefined || userSettingMap === null) {
            userSettingMap = {}
          }
          // 修改state里的值
          if (setType === 'InitOrg') {
            userSettingMap.InitOrg = setValue
          } else if (setType === 'SearchDiv') {
            userSettingMap.SearchDiv = setValue
          } else if (setType === 'SearchTarget') {
            userSettingMap.SearchTarget = setValue
          }

          userInfo.userSettingMap = userSettingMap
          this.$store.commit('SET_USER_INFO', userInfo)

          this.$message({
            type: 'info',
            message: this.$t('comm.success')
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleChangePasswordOkClick() {
      if (!this.validatorAll()) {
        return false
      }
      if (this.newPassword !== this.reNewPassword) {
        this.setValidatorMessage('reNewPassword', this.$t('home.msg1'))
        this.validatorState = false
        return
      }
      if (this.newPassword === this.oldPassword) {
        this.setValidatorMessage('newPassword', this.$t('home.msg2'))
        this.validatorState = false
        return
      }
      if (this.newPassword === this.$store.state.userInfo.userName) {
        this.setValidatorMessage('newPassword', this.$t('home.msg3'))
        this.validatorState = false
        return
      }

      this.$confirm(this.$t('comm.tip21'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const param = { oldPassword: this.oldPassword, newPassword: this.newPassword }
        const res = await changePassword(param)
        // eslint-disable-next-line no-empty
        if (res && res.success) {
          this.$message({
            type: 'info',
            message: this.$t('comm.success')
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleClearTerms() {
      this.$confirm(this.$t('comm.tip25'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const param = {}
        const res = await clearTerms(param)
        // eslint-disable-next-line no-empty
        if (res && res.success) {
          this.$message({
            type: 'info',
            message: this.$t('comm.success')
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleClearLogs() {
      this.$confirm(this.$t('comm.tip26'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const param = {}
        const res = await clearLogs(param)
        // eslint-disable-next-line no-empty
        if (res && res.success) {
          this.$message({
            type: 'info',
            message: this.$t('comm.success')
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    }
  }
}
</script>
<style scoped>
.set_bg {
  position: absolute;
  min-width: 1300px;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  bottom: 0;
  background: #ffffff;
  overflow-x: auto;
  overflow-y: hidden;
}
.set_box {
  width: 100%;
  height: 100%;
  padding: 30px 0px 40px 40px;
  display: flex;
  flex-direction: column;
}
.title {
  width: 100%;
  height: 40px;
  padding-left: 30px;
  padding-right: 40px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-family: "微软雅黑";
  font-weight: bold;
  color: #333333;
  line-height: 60px;
  margin-bottom: 20px;
}
.title span {
  height: 20px;
  line-height: 20px;
  margin-top: -10px;
}
.title span i {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
.set_main {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: left;
}
.set_menu {
  width: 330px;
  height: calc(100vh - 130px);
  border-radius: 16px;
  border: 1px solid #cccccc;
}
.set_content {
  flex: 1;
  width: 100%;
  height: calc(100vh - 90px);
  margin-left: 32px;
  overflow-y: auto;
  padding-right: 40px;
}
.set_menu ul {
  width: 100%;
  height: 100%;
  padding: 30px;
}
.set_menu ul li {
  height: 20px;
  display: flex;
  justify-content: left;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 20px;
  margin-bottom: 40px;
  cursor: pointer;
}
.set_menu ul li i {
  margin-right: 20px;
}

.set_content_item {
  width: 100%;
  margin-bottom: 40px;
}
.set_content_item > label {
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bold;
  color: #333333;
  line-height: 20px;
}
.set_content_item_box {
  width: 100%;
  height: 80px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #cccccc;
  margin-top: 20px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.set_content_item_box label {
  margin-right: 50px;
}
.set_content_item_box_auto {
  width: 100%;
  height: auto;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #cccccc;
  margin-top: 20px;
  padding: 30px;
  display: inline-block;
}

.menuActive {
  color: #2d7a9c !important;
}
.set_content_item button {
  width: 160px;
  height: 40px;
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%);
  border-radius: 20px;
  border: 0;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #ffffff;
  cursor: pointer;
  float: right;
}
.set_items {
  height: auto;
  width: 100%;
  margin-bottom: 30px;
  border-bottom: 1px solid #eeeeee;
}
.set_items_title {
  height: 18px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: 400;
  color: #333333;
  line-height: 18px;
}
.beetween_line {
  width: 100%;
  height: 1px;
  background: #eeeeee;
  margin-bottom: 30px;
}
.set_content_item_box span {
  height: 18px;
  font-size: 16px;
  font-family: "微软雅黑";
  font-weight: 400;
  color: #333333;
  line-height: 18px;
}
.set_content_item_box span i {
  color: #ff9200;
  font-size: 20px;
  margin-right: 5px;
}
.set_button {
  margin-top: -10px;
}
.overscroll {
  padding-bottom: 685px;
}
.org_group {
  height: auto;
  display: inline-block;
  padding-bottom: 10px;
}
.org_group label {
  width: 100%;
  height: 20px;
  line-height: 20px;
  margin-bottom: 20px;
}
.org_group button {
  margin-top: -10px;
}

.set_items_input .message {
    color: red;
}
</style>
