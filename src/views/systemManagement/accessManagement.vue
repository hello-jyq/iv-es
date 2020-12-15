<template>
     <div class="container acc"> 
       <div class="header_box">
        选择用户角色：
         <el-select v-model="selectvalue" placeholder="请选择" @change="selectChange"  popper-class="acc">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
       </div>
       <div class="acc_main_box">
         <div class="acc_title">
            <ul>
              <li v-for="(item,index) in ESDataSourceList" :key="index"  :class="active==index?'active':''" @click="ESDataSourceClick(item.dictId,index,item.dictName),active=index">{{item.dictName}}</li>
            </ul>
         </div>
           <div class="acc_con" :class="active==index?'show':''" v-for="(item,index) in ESDataSourceList" :key="index">
             <el-checkbox v-model="checked"   @change="selectAllNodes(checked,index)">全选</el-checkbox>
             <div class="acc_con_tee">
              <el-tree
                :data="treedata"
                show-checkbox        
                :expand-on-click-node=false
                node-key="seqNo"              
                :default-expanded-keys="expandedKeys"
                :default-checked-keys="checkedKeys"
                ref="tree"            
                :props="defaultProps"
                icon-class="iconfont icon-jiantou-copy"
                  >
              </el-tree>
             </div>
                <el-row type="flex" justify="center" class="acc_button">
                    <el-button round icon="iconfont icon-refresh" @click="reset(index)">重置</el-button>
                    <el-button type="primary" round   @click="submit(index)" icon="iconfont icon-queding">确定</el-button>
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
      options: "",
      selectvalue: '',
      selectOldvalue: '',
      ESDataSourceList: '',
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
  created() {
    this.getEsRoles()
    this.getDictEntriesByTypeId()
    this.getFoldertree(0)
  },
  methods: {
    // 获取用户角色
    async getEsRoles(item) {
      const res = await getEsRoles({ item })
      if (res && res.success) {
        this.options = res.datas.rolesList
      }
    },
    // 获取tree
    async getFoldertree(i) {
      const res = await getFoldertree({ roleId: this.selectvalue })
      if (res && res.success) {
        // console.log('tree', res.datas)
        this.datas = res.datas
        // this.treedata = this.filter(res.datas.folderTree)
        if (res.datas.folderTree[i]) {
          this.treedata = [res.datas.folderTree[i]]
          this.expandedKeys.push(res.datas.expandedKeys[i])
          // this.checkedKeys.push(res.datas.checkedKeys[0])
          sessionStorage.setItem("tree" + i, JSON.stringify(res.datas.folderTree[i]));
          this.$nextTick(() => {
            // console.log(3, this.$refs.tree[0])
            this.$refs.tree[i].setCheckedKeys([res.datas.checkedKeys[i]])
          })
        } else {
          this.treedata = []
          sessionStorage.setItem("tree" + i, JSON.stringify('empty'));
        }
      }
    },
    // 获取服务器列表
    async getDictEntriesByTypeId(item) {
      const res = await getDictEntriesByTypeId({ dictTypeId: 'ESDataSourceName' })
      if (res && res.success) {
        // console.log("ESDataSource", res)
        this.ESDataSourceList = res.datas.dicts
      }
    },
    // tab服务器切换
    ESDataSourceClick(id, i, val) {
      this.ESDataSourcID = id
      this.ESDataSourcName = val
      this.checked = false
      let sessoin = JSON.parse(sessionStorage.getItem("tree" + i))
      if (sessoin && sessoin != 'empty') {
        this.treedata = [sessoin]
      } else if (sessoin) { this.treedata = [] } else {
        this.getFoldertree(i)
      }
      // console.log(id)

    },

    // setCheckedKeys(e, i) {
    //   // console.log(this.$refs.tree[i])
    //   if (e) { this.$refs.tree[i].setCheckedKeys([]); } else {
    //     this.$refs.tree[i].setCheckedKeys([]);
    //   }
    // },
    selectAllNodes(flag, i) {
      if (flag) { this.$refs.tree[i].setCheckedNodes(this.treedata) } else {
        this.$refs.tree[i].setCheckedNodes([])
      }


    },
    // setCheckedNodes(e, i) {
    //   this.$refs.tree[i].setCheckedNodes(this.data);
    // },
    // selectAllNodes: function (e, i) {
    //   if (e) {
    //     //  获取根节点
    //     let rootNode = this.$refs.tree[i].getNode(this.data[0].id).parent;
    //     travelNodes(rootNode);
    //     function travelNodes(tmpRoot) {
    //       // 选中该节点
    //       tmpRoot.checked = true;
    //       // 叶子节点
    //       if (tmpRoot.childNodes.length === 0) {
    //         return;
    //       }
    //       // 不是叶子节点,递归遍历
    //       else {
    //         let tmpChildNoes = tmpRoot.childNodes;
    //         for (let i = 0; i < tmpChildNoes.length; i++) {
    //           travelNodes(tmpChildNoes[i]);
    //         }
    //       }
    //     }
    //   } else {
    //     this.$refs.tree[i].setCheckedKeys([]);
    //   }
    // },
    filter(arr) {
      if (arr != '') {
        console.log('filter', arr)
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].dataSource == this.ESDataSourcID) {
            return [arr[i]]
          }

        }
      } else {
        return null
      }
    },
    reset(i) {
      this.$refs.tree[i].setCheckedKeys([]);
    },
    //选择用户角色二次确认
    selectChange(val) {
      if (this.selectOldvalue != val) {
        this.$confirm('切换用户将清空未保存的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectvalue = val
          this.selectOldvalue = val
          this.active = 0


          for (let i = 0; i < this.ESDataSourceList.length; i++) {
            sessionStorage.removeItem("tree" + i);
          }
          this.getFoldertree(0)
          this.ESDataSourceClick(this.ESDataSourceList[0].dictId, 0, this.ESDataSourceList[0].dictName)
        }).catch(() => {
          this.selectvalue = this.selectOldvalue
        });
      }
    },
    // 提交
    submit(i) {
      if (this.selectvalue) {
        this.$message({
          message: this.ESDataSourcName + '提交成功',
          type: 'success'
        });
      } else {
        this.$message({
          message: '提交失败，请选择用户角色',
          type: 'error'
        });
      }

    }
  },
  mounted() {

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