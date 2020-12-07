<template>
     <div class="container"> 
       <div class="header_box">
        选择用户角色：
          <el-radio-group v-model="radio">
            <el-radio :label="1">角色1</el-radio>
            <el-radio :label="2">角色2</el-radio>
            <el-radio :label="3">角色3</el-radio>
            <el-radio :label="4">角色4</el-radio>
            <el-radio :label="5">角色5</el-radio>
          </el-radio-group>
       </div>
       <div class="main_box">
         <div class="acc_title">
            <ul>
              <li v-for="(item,index) in 5" :key="index" :class="active==index?'active':''" @click="active=index">文件服务器{{index+1}}</li>
            </ul>
         </div>
           <div class="acc_con" :class="active==index?'show':''" v-for="(item,index) in 5" :key="item.index">
             <el-checkbox v-model="checked"   @change="selectAllNodes(checked,index)">全选</el-checkbox>
             <div class="acc_con_tee">
              <el-tree
                :data="data"
                show-checkbox
                default-expand-all
                :expand-on-click-node=false
                :check-on-click-node=true
                :check-strictly=true
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps">
              </el-tree>
             </div>
                <el-row type="flex" justify="center" class="acc_button">
                    <el-button round icon="iconfont icon-refresh">重置</el-button>
                    <el-button type="primary" round icon="iconfont icon-queding">确定</el-button>
                </el-row>
          </div>
       </div>
    </div>   
</template>
<script>
export default {
  data() {
    return {
      radio: 3,
      active: 1,
      checked: '',
      data: [{
        id: 1,
        label: '菱威深搜索系统项目',
        children: [{
          id: 4,
          label: '搜索引擎',
          children: [{
            id: 9,
            label: '普通搜索引擎设计稿权限访问管理页面',
            children: [{
              id: 11,
              label: '営業第1'
            }, {
              id: 12,
              label: '営業第2'
            }, {
              id: 13,
              label: '営業第3'
            }, {
              id: 14,
              label: '営業第4'
            }, {
              id: 15,
              label: '営業第5'
            }, {
              id: 16,
              label: '営業第6'
            }, {
              id: 17,
              label: '営業第7',
              children: [{
                id: 18,
                label: '搜索引擎1'
              }, {
                id: 19,
                label: '搜索引擎2'
              }, {
                id: 20,
                label: '搜索引擎3'
              }, {
                id: 21,
                label: '搜索引擎4'
              }, {
                id: 22,
                label: '搜索引擎5'
              }, {
                id: 23,
                label: '搜索引擎6'
              }, {
                id: 24,
                label: '搜索引擎7'
              }]
            }]
          }, {
            id: 10,
            label: '営業企画部'
          }, {
            id: 30,
            label: 'IT企画支援部',
            children: [{
              id: 31,
              label: 'Unit1'
            }]
          }

          ]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    setCheckedKeys(e, i) {
      console.log(this.$refs.tree[i])
      if (e) { this.$refs.tree[i].setCheckedKeys([]); } else {
        this.$refs.tree[i].setCheckedKeys([]);
      }
    },
    // setCheckedNodes(e, i) {
    //   this.$refs.tree[i].setCheckedNodes(this.data);
    // },
    selectAllNodes: function (e, i) {
      if (e) {
        //  获取根节点
        let rootNode = this.$refs.tree[i].getNode(this.data[0].id).parent;
        travelNodes(rootNode);
        function travelNodes(tmpRoot) {
          // 选中该节点
          tmpRoot.checked = true;
          // 叶子节点
          if (tmpRoot.childNodes.length === 0) {
            return;
          }
          // 不是叶子节点,递归遍历
          else {
            let tmpChildNoes = tmpRoot.childNodes;
            for (let i = 0; i < tmpChildNoes.length; i++) {
              travelNodes(tmpChildNoes[i]);
            }
          }
        }
      } else {
        this.$refs.tree[i].setCheckedKeys([]);
      }
    },


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
  padding: 0 20px;
  line-height: 100px;
}
.main_box {
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
.el-radio {
  margin-left: 10px;
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