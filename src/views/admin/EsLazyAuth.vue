<template>
  <div class="container acc">
    <div class="header_box">
      {{ $t('admin.esAuth.selectEsRole') }}:
      <el-select v-model="selectvalue" popper-class="acc" @change="selectChange">
        <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id" />
      </el-select>
    </div>
    <div class="acc_main_box">
      <div class="acc_con" :class="active===0?'show':''">
        <div class="acc_con_tee">
          <el-tree
            ref="tree"
            :data="treedata"
            show-checkbox
            :expand-on-click-node="false"
            node-key="id"
            :default-checked-keys="checkedKeys"
            lazy
            :props="defaultProps"
            icon-class="iconfont icon-jiantou-copy"
            :load="searchTree"
          />
        </div>
        <el-row type="flex" justify="left" class="acc_button">
          <el-button type="primary" round icon="iconfont icon-queding" @click="onSave()">
            {{ $t('comm.save') }}
          </el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getFolderTreeByParentId, getEsRoles, saveAuthNodes } from '@/api/es/folder-auth-api.js'

export default {
  data() {
    return {
      options: '',
      selectvalue: '',
      selectOldvalue: '',
      ESDataSourcID: '',
      ESDataSourcName: '',
      active: 0,
      checked: false,
      treedata: [],
      treeold: [],
      expandedKeys: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'folderName'
      }
    }
  },
  mounted() {
    this.getEsRoles()
  },
  methods: {
    // 获取用户角色
    async getEsRoles() {
      const res = await getEsRoles()

      if (res && res.success) {
        this.options = res.datas.rolesList
        console.log(this.options)
        this.selectvalue = res.datas.roleId
        this.selectOldvalue = res.datas.roleId
        console.log(this.selectvalue)
        if (this.selectvalue !== '') {
          this.searchtree(this.selectvalue)
        }
      }
    },
    // 获取tree
    async searchTree(node, resolve) {
      console.log(node)
      if (node.level === 0) {
        const params = { 'parentId': '' }
        const res = await getFolderTreeByParentId(params)
        if (res && res.success) {
          this.data = res.datas.result
          let treeList = []
          treeList.push(this.data)
          this.data[0].children.forEach((item) => {          
            treeList.push(item)
          })
          this.$nextTick(() => {
            let nodedata = this.node.childNodes[0]
            nodedata.expanded = true
            nodedata.loadData()
          })
          // 默认展开第一级
          resolve(treeList)
        } else {
          resolve([])
        }
      } else {
        console.log('当前节点id值为：' + node.data.id)
        const params = {
          'parentId': node.data.id
        }
        const res = await getFolderTreeByParentId(params)
        if (res && res.success) {
          this.data = res.datas.result
          // 默认展开第一级
          resolve(res.datas.result)
          this.$nextTick(() => {
            this.checkedKeys = res.datas.checkedKeys
          })
        } else {
          resolve([])
        }
      }
    },
    // 选择用户角色二次确认
    selectChange(val) {
      if (this.selectOldvalue !== val) {
        this.$confirm(this.$t('admin.esAuth.tip1'), this.$t('comm.tips'), {
          confirmButtonText: this.$t('comm.certain'),
          cancelButtonText: this.$t('comm.cancel'),
          type: 'warning'
        }).then(() => {
          this.selectvalue = val
          this.selectOldvalue = val
          this.searchtree(val)
        }).catch(() => {
          this.selectvalue = this.selectOldvalue
        })
      }
    },
    // 提交
    onSave() {
      this.$confirm(this.$t('comm.tip10'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      })
        .then(async() => {
          const params = {
            'roleId': this.selectvalue,
            'checkedNodes': this.$refs.tree.getCheckedNodes()
          }
          const res = await saveAuthNodes(params)
          if (res && res.success) {
            this.$message({
              type: 'info',
              message: this.$t('comm.success')
            })
          }
        })
        .catch(() => {
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
.header_box {
  width: 100%;
  height: 100px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  border-radius: 16px;
  padding: 30px 30px 30px 20px;
  line-height: 40px;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  display: flex;
  justify-content: left;
  white-space: nowrap;
}

.acc_main_box {
  height: calc(100vh - 328px);
  background: #ffffff;
  border-radius: 0px 0px 16px 16px;
  overflow: hidden;
  flex: 1;
  padding: 0px 0px 0px 0px;
  margin-top: 20px;
  box-sizing: border-box;
  flex-direction: column;
}

.acc_title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #eef2f6;
}
.acc_title li {
  width: 156px;
  height: 50px;
  background: #fafcff;
  box-shadow: 0px 2px 4px 1px rgba(45, 122, 156, 0.2);
  border-radius: 16px 16px 0px 0px;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #999999;
  float: left;
  text-align: center;
  cursor: pointer;
}

.acc .el-select {
 margin-left: 5px;
}
.acc_con {
  height: 100%;
  display: none;
  padding: 20px 0px 0px 30px;
  /* box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1); */
}
.acc_con_tee {
  height: calc(100% - 90px);
  overflow: auto;
}
.acc_title li.active {
  color: #ffffff;
  background: #2d7a9c;
}
.acc_button {
  height: 70px;
  padding-top: 30px;
}
.acc_button .el-button {
  width: 160px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.acc_button .el-button--primary {
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%);
  border: none;
  color: #ffffff;
  margin-left: 20px;
}
</style>
