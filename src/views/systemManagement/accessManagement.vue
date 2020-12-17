<template>
  <div class="container acc">
    <div class="header_box">
      选择用户角色：
      <el-select v-model="selectid" placeholder="请选择" popper-class="acc" @change="selectChange">
        <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id" />
      </el-select>
    </div>
    <div class="acc_main_box">
      <div class="acc_title">
        <ul>
          <li v-for="(item,index) in ESDataSourceList" :key="index" :class="active==index?'active':''" @click="ESDataSourceClick(item.dictId,index,item.dictName),active=index">
            {{ item.dictName }}
          </li>
        </ul>
      </div>
      <div v-for="(item,index) in ESDataSourceList" :key="index" class="acc_con" :class="active==index?'show':''">
        <el-checkbox v-model="checked" @change="selectAllNodes(checked,index)">
          全选
        </el-checkbox>
        <div class="acc_con_tee">
          <el-tree
            ref="tree"
            show-checkbox
            :data="treedata"
            :expand-on-click-node="false"
            node-key="seqNo"
            :default-expanded-keys="expandedKeys"
            :default-checked-keys="checkedKeys"
            :props="defaultProps"
            icon-class="iconfont icon-jiantou-copy"
            @check="handleCheckChange"
          />
        </div>
        <el-row type="flex" justify="center" class="acc_button">
          <el-button round icon="iconfont icon-refresh" @click="reset(index)">
            重置
          </el-button>
          <el-button type="primary" round icon="iconfont icon-queding" @click="submit(index)">
            确定
          </el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { getEsRoles, getFoldertree } from '@/api/es/es-api'
import { getDictEntriesByTypeId } from '@/api/base'
export default {
  data() {
    return {
      options: '',
      selectid: '',
      selectOldvalue: '',
      ESDataSourceList: '',
      ESDataSourcID: '',
      active: 0,
      checked: false,
      treedata: [],
      expandedKeys: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'folderName'
      }
    }
  },
  created() {
    this.getEsRoles()
    this.getDictEntriesByTypeId().then(() => {
      this.getFoldertree(this.ESDataSourcID, 0)
    })
  },
  methods: {
    // 获取用户角色
    async getEsRoles(item) {
      const res = await getEsRoles({ item })
      if (res && res.success) {
        this.selectid = res.datas.rolesList[0].id
        this.options = res.datas.rolesList
      }
    },
    // 获取tree
    async getFoldertree(dictId, i) {
      const res = await getFoldertree({ roleId: this.selectid })
      if (res && res.success) {
        this.treedata = res.datas.folderTree
        this.expandedKeys = res.datas.expandedKeys
        this.checkedKeys = res.datas.checkedKeys
        sessionStorage.setItem('tree' + i, JSON.stringify(res.datas.folderTree))
        sessionStorage.setItem('checked' + i, JSON.stringify(res.datas.checkedKeys))
        sessionStorage.setItem('expanded' + i, JSON.stringify(res.datas.expandedKeys))
      }
    },
    // 获取服务器列表
    async getDictEntriesByTypeId(item) {
      const res = await getDictEntriesByTypeId({ dictTypeId: 'ESDataSourceName' })
      if (res && res.success) {
        this.ESDataSourceList = res.datas.dicts
        this.ESDataSourcID = res.datas.dicts[0].dictId
      }
    },
    // tab服务器切换
    ESDataSourceClick(dictId, i) {
      this.ESDataSourcID = dictId
      this.checked = false
      const sessointree = JSON.parse(sessionStorage.getItem('tree' + i))
      const sessointreechecked = JSON.parse(sessionStorage.getItem('checked' + i))
      const sessointreeexpanded = JSON.parse(sessionStorage.getItem('expanded' + i))
      if (sessointree) {
        this.treedata = sessointree
        this.expandedKeys = sessointreeexpanded
        this.checkedKeys = sessointreechecked
      } else {
        this.getFoldertree(dictId, i)
      }
    },
    handleCheckChange(a, b) {
      if (b.checkedNodes) {
        sessionStorage.setItem('checked' + this.active, JSON.stringify(b.checkedKeys))
        sessionStorage.setItem('expanded' + this.active, JSON.stringify(b.halfCheckedKeys))
      }
    },
    // 全选
    selectAllNodes(flag, i) {
      if (flag) {
        this.$refs.tree[i].setCheckedNodes(this.treedata)
      } else {
        this.$refs.tree[i].setCheckedNodes([])
      }
    },
    reset(i) {
      this.$refs.tree[i].setCheckedKeys([])
    },
    // 选择用户角色二次确认
    selectChange(val) {
      if (this.selectOldvalue !== val) {
        this.$confirm('切换用户将清空未保存的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectid = val
          this.selectOldvalue = val
          this.active = 0
          for (let i = 0; i < this.ESDataSourceList.length; i++) {
            sessionStorage.removeItem('tree' + i)
            sessionStorage.removeItem('checked' + i)
            sessionStorage.removeItem('expanded' + i)
          }
          this.getFoldertree(this.ESDataSourcID, 0)
          this.ESDataSourceClick(this.ESDataSourceList[0].dictId, 0, this.ESDataSourceList[0].dictName)
        }).catch(() => {
          this.selectid = this.selectOldvalue
        })
      }
    },
    // 提交
    submit() {
      if (this.selectid) {
        this.$message({
          message: 'id：' + this.ESDataSourcID + '提交成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '提交失败，请选择用户角色',
          type: 'error'
        })
      }
    }
  }
}
</script>
<style lang="css" scoped>
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
  padding: 0px 0px 30px 0px;
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
.acc_con {
  height: 100%;
  display: none;
  padding: 20px 0px 20px 30px;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
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
  padding-top: 10px;
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
  margin-left: 100px;
}
</style>
