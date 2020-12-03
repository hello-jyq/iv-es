<template>
  <el-checkbox-group
    :value="value"
    :disabled="disabled"
    @input="handleInput"
    @change="handleChange"
  >
    <el-checkbox
      v-for="item in fileUpdatetimeAgg"
      :key="item.periodId"
      :label="item.periodName"
    >
      {{ item.periodName }}<template>
        <span>({{ item.count }})</span>
      </template>
    </el-checkbox>
  </el-checkbox-group>
</template>
<script>
import { dict } from '@/mixins/dict'
export default {
  name: 'FileTypeCheckbox',
  mixins: [dict],
  props: {
    fileUpdatetimeAgg: {
      type: Array,
      default: () => { return [] }
    },
    value: {
      type: Array,
      default: () => { return [] }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  // data() {
  //   return {
  //     options: [
  //       { fileTypeId: '',
  //         fileTypeCount: ''
  //       }
  //     ]
  //   }
  // }
  methods: {
    handleChange(value) {
      this.$emit('selectUpdateTime', value)
    }
  }
}
</script>
