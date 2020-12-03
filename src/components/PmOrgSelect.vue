<template>
  <div class="el-input">
    <el-cascader
      class="font_pla"
      :value="value1"
      :props="prop"
      :show-all-levels="true"
      @input="input($event.target.value)"
      @change="handleChange"
    />
  </div>
</template>
<script>
import { getDictEntriesByTypeId, getDictEntriesByParent } from '@/api/base.js'
export default {
  data() {
    return {
      value1: [],
      prop: {
        lazy: true,
        async lazyLoad(node, resolve) {
          if (node.level === 0) {
            // 第一层节点，取得统括
            const res = await getDictEntriesByTypeId({ 'dictTypeId': 'TONGKUO' })

            const nodes = res.datas.dicts.map((value, i) => ({
              value: value.dictId,
              label: value.dictName,
              leaf: node.level >= 1
            }))

            resolve(nodes)
          }
          if (node.level === 1) {
            const res = await getDictEntriesByParent({ 'dictTypeId': 'BUSHU', 'parentId': node.value })

            const childNodes = res.datas.dicts.map((value, i) => ({
              value: node.value + '-' + value.dictId,
              label: value.dictName,
              leaf: node.level >= 1
            }))
            resolve(childNodes)
          }
        }
      }
    }
  },
  created() {
    const value = this.value
    this.value1 = value
  },
  methods: {
    input(value) {
      this.$emit('input', value)
      this.value1 = value
    },
    blur(event) {
      // // console.log(this.value1)
      this.value1 = this.value1
      this.$emit('blur', event)
    },
    handleChange(value) {
      this.value1 = value
      // // console.log(value)
    }
  }
}
</script>

