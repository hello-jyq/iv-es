<template>
  <div :class="theme=='Light'?'no-search-content-box advice-apply-edit adaE-light':'no-search-content-box advice-apply-edit'">
    <div class="table-bg-box marigin-bottom">
      <div class="advice-edit-table-title justify-content-flex">
        <span>设定各个ES角色</span>
      </div>

      <el-form label-width="110px" label-position="left" class="content-top-form form-big-lable">
        <el-row type="flex" justify="space-between">
          <el-col :span="7">
            <el-form-item label="ES访问角色" prop="info" class="big-input">
              <el-select
                v-model="roleId"
                style="width:100%"
                placeholder="请选择"
                :popper-class="theme=='Light'?'blueSelect':''"
                @change="changeRole"
              >
                <el-option
                  v-for="item in esRoleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="height:500px">
          <el-scrollbar>
            <!-- :allow-drop="allowDrop" :allow-drag="allowDrag"   @node-drop="allowNodeDrop"  @node-click="selectNode"  @node-contextmenu="operation" -->
            <el-tree
              id="folderTree"
              ref="tree"
              :data="data"
              node-key="seqNo"
              show-checkbox
              :expand-on-click-node="true"
              :default-expand-all="false"
              :default-checked-keys="checkedKeys"
              :default-expanded-keys="expandedKeys"
            >
              <template slot-scope="scope">
                <div class="custom-tree-node">
                  <div class="tree_item tree-confirm-item">
                    <span v-if="scope.data.id !== 50" class="iconfont" :class="scope.data.children || scope.data.type === 'org' ? 'icon-bumenguanli_h' : 'icon-Avatar'" />
                    <span v-else class="iconfont icon-zuzhijiagou" />
                    <span>{{ scope.data.folderName }}</span>
                  </div>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </el-row>
      </el-form>
    </div>

    <ul class="operation-box dialog-btn-box">
      <li class="operation-item" @click="onSave()">
        <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconbaocun" /></span>
        <span class="operation-text">保&nbsp;存</span>
      </li>
      <li class="operation-item">
        <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont icontijiao" /></span>
        <span class="operation-text">删&nbsp;除</span>
      </li>
      <li class="operation-item" @click="onCancel()">
        <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconquxiao" /></span>
        <span class="operation-text">取&nbsp;消</span>
      </li>
    </ul>
  </div>
</template>
<script>

import { getFolderTree, getEsRoles, saveAuthNodes } from '@/api/es/folder-auth-api.js'

export default {

  data() {
    return {
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',

      esRoleOptions: [],
      roleId: '',
      expandedKeys: [],
      checkedKeys: [],
      data: [],
      validYear: '2020'
    }
  },
  mounted() {
    this.getEsRoles()
  },
  methods: {
    async getEsRoles() {
      const res = await getEsRoles()

      if (res && res.success) {
        this.esRoleOptions = res.datas.rolesList
        console.log(this.esRoleOptions)
        this.roleId = res.datas.roleId
        console.log(this.roleId)
        if (this.roleId !== '') {
          this.searchTree(this.roleId)
        }
      }
    },
    changeRole(selVal) {
      this.roleId = selVal
      this.searchTree(selVal)
    },
    async searchTree(roleId) {
      var params = { 'roleId': roleId }
      const res = await getFolderTree(params)
      if (res && res.success) {
        this.data = res.datas.result
        // 默认展开第一级

        this.expandedKeys = res.datas.expandedKeys
        this.checkedKeys = res.datas.checkedKeys
      }
    },
    onCancel() {
      this.$router.push({ path: '/ada/list' })
    },
    onSave() {
      this.$confirm(this.$t('comm.tip10'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning',
        iconClass: 'iconfont icongantanhao_icon',
        customClass: localStorage.getItem('theme') === 'Dark' ? 'dark-message-box' : 'light-message-box'
      })
        .then(async() => {
          const params = {
            'roleId': this.roleId,
            'checkedNodes': this.$refs.tree.getCheckedNodes()
          }
          const res = await saveAuthNodes(params)
          if (res && res.success) {
            // todo 怎么处理
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            iconClass: 'iconfont icongantanhao_icon',
            customClass:
              localStorage.getItem('theme') === 'Dark' ? 'dark-el-message' : 'light-el-message',
            message: this.$t('comm.msg1')
          })
        })
    }

  }
}
</script>
<style lang="scss">
.advice-apply-edit {
  .advice-edit-title {
    margin-top: 10px;
    margin-bottom: 20px;
    font-family: "微软雅黑";
    font-size: 22px;
    font-weight: bold;
    color: #ffffff;
  }
  .table-bg-box {
    background: linear-gradient(180deg, #34393f 0%, #22252a 100%);
    .el-form-item {
      margin-bottom: 30px;
    }
    .upload-demo {
      display: flex;
      height: 38px;
      border-radius: 4px;
    }
    .advice-edit-table {
      margin-bottom: 38px;
    }
  }
  .state-status {
    position: relative;
  }
  .advice-help {
    position: absolute;
    top: 0px;
    right: 35px;
    i {
      font-size: 16px;
    }
  }
  .dialog-btn-box {
    justify-content: flex-start;
    margin-top: 30px;
    margin-bottom: 50px;
  }
  .operation-text span {
    max-width: 300px;
  }
  #folderTree .confirmIcon i, .tree-confirm-item, .confirm-text {
    color: #34393f;
  }

  #folderTree .el-checkbox__inner, .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: rgba(0,0,0,.1);
    border-color: #333333;
    border-radius: 2px;
  }
}
</style>
<style lang="scss">
.advice-apply-edit {
  .el-icon-date {
    display: none;
  }
  .col-right {
    padding-right: 110px;
  }
  .el-upload--text {
    width: 120px;
    height: 38px;
    margin-left: -27px;
    background: linear-gradient(180deg, #2f343a 0%, #1e2225 100%);
    box-shadow: -2px -2px 15px 2px rgba(255, 255, 255, 0.2),
      0px 2px 10px 6px rgba(20, 22, 26, 1);
    border-radius: 24px;
    border: 1px solid #1d2226;
    & > div {
      font-size: 14px;
      color: #00e2de;
      .iconshangchuan {
        color: #00e2de;
        margin-right: 4px;
      }
    }
  }
}

</style>
