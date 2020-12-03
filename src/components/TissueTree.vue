<template>
  <div class="tree_box">
    <el-scrollbar>
      <el-tree
        :data="data"
        node-key="id"
        :default-expanded-keys="expandedKeys"
        @node-click="selectNode"
      >
        <template slot-scope="scope">
          <div class="tree_content">
            <div class="tree_item">
              <span v-if="scope.data.id === '_1'" class="iconfont icon-zuzhijiagou" />
              <span v-else-if="treeType === 'department'" class="iconfont icon-bumenguanli_h" />
              <span v-else class="iconfont" :class="scope.data.children || scope.data.type === 'org' ? 'icon-bumenguanli_h' : 'icon-Avatar'" />
              <span>{{ scope.data.name || scope.data.text }}</span>
            </div>
          <!-- <div :ref="scope.data.id" class="tree_down">
              <template v-if="scope.data.children || scope.data.type === 'org'">
                <p @click.stop="append(scope.data)">
                  增加下级机构
                </p>
                <p @click.stop="insertAfter(scope.node.parent.data)">
                  增加本级机构
                </p>
                <p @click.stop="appendPersonnel(scope.data)">
                  增加机构人员
                </p>
                <p @click.stop="removeObject(scope)">
                  删除本级机构
                </p>
              </template>
              <template v-else>
                <p @click.stop="removePersonnel(scope.node.parent.data, scope.data)">
                  删除该人员
                </p>
              </template>
            </div> -->
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>
<script>
import { getAllOrgAndUserTree, getAllOrgTreeByYear } from '@/api/admin/org-api'
export default {
  props: {
    // 类型 department | personnel
    treeType: {
      type: String,
      default: 'personnel'
    },
    validYear: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: [],
      expandedKeys: [],
      dataList: []
    }
  },
  created() {
    this.__getList()
  },
  methods: {
    selectNode(data, node, con) {
      // // console.log(data)
      // // console.log(node)
      // // console.log(con)
      // 向外分发选中事件
      this.$emit('select', data)
    },
    async __getList() {
      const res = this.treeType === 'personnel' ? await getAllOrgAndUserTree() : await getAllOrgTreeByYear(this.validYear)
      // // console.log(res)
      const { success, datas } = res
      if (success) {
        // // console.log(datas.result)
        this.dataList = datas.result
        this.expandedKeys = this.dataList.map(item => item.id)
        const title = {
          id: '_1',
          name: this.treeType === 'department' ? '请选择部门' : '请选择人员',
          children: null
        }
        this.data = [title, ...this.dataList]
      } else {
        this.dataList = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tree_box {
  width: 80%;
  height: 400px;
  float: left;
  overflow: auto;
  box-sizing: border-box;
  padding: 0 5px;
  // background-color: #eee;
  // border-right: 5px solid #ccc;
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
    // .tree_down {
    //   position: absolute;
    //   top: 20px;
    //   left: 15px;
    //   z-index: 999;
    //   background-color: #fff;
    //   padding: 3px;
    //   // height: 300px;
    //   display: none;
    //   p {
    //     height: 20px;
    //     line-height: 20px;
    //     font-size: 12px;
    //     color: #000;
    //     &:hover {
    //       background-color: #ccc;
    //     }
    //   }
    // }
  }
}
</style>
