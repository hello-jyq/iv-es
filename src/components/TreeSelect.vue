<template>
  <el-select :value="valueId" :label="valueTitle">
    <el-option :value="valueId" :label="valueTitle" class="options">
      <el-tree
        :data="data"
        :value="valueId"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="expandedKeys"
        @getValue="getValue($event.target.value)"
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
          </div>
        </template>
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
import { getOrgList, getAllOrgAndUserTree } from '@/api/admin/org-api.js'
export default {
  name: 'ElTreeSelect',
  model: {
    type: 'text',
    event: 'getValue'
  },
  props: {
    // 类型 department | personnel
    treeType: {
      type: String,
      default: 'personnel'
    },
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'title', // 显示名称
          children: 'children' // 子级字段名
        }
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => { return [] }
    },
    /* 初始值 */
    value: {
      type: String,
      default: () => { return null }
    }
  },
  data() {
    return {
      valueId: this.value, // 初始值
      valueTitle: '',
      defaultExpandedKey: [],
      data: [],
      expandedKeys: [],
      dataList: []
    }
  },
  watch: {
    value() {
      this.valueId = this.value
    }
  },
  created() {
    this.__getList()
  },
  mounted() {
  },
  methods: {
    selectNode(node) {
      // // console.log(data)
      // // console.log(node)
      // // console.log(con)
      // 向外分发选中事件
      this.valueTitle = node.text
      // // console.log(this.valueTitle)
      this.valueId = node[this.props.value]
      this.$emit('getValue', this.valueId)
      this.defaultExpandedKey = []
      // this.$emit('select', data)
    },
    async __getList() {
      const res = this.treeType === 'personnel' ? await getAllOrgAndUserTree() : await getOrgList()
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
    },
    // 切换选项
    handleNodeClick(node) {
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.$emit('getValue', this.valueId)
      this.defaultExpandedKey = []
    },
    // 清除选中
    // clearHandle() {
    //   this.valueTitle = ''
    //   this.valueId = null
    //   this.defaultExpandedKey = []
    //   this.clearSelected()
    //   this.$emit('getValue', null)
    // },
    /* 清空选中样式 */
    clearSelected() {
      const allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element) => element.classList.remove('is-current'))
    },
    getValue(value) {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.selectInput {
  padding: 0 5px;
  box-sizing: border-box;
}
</style>
