<template>
  <el-checkbox-group
    :value="value"
    :disabled="disabled"
    @input="handleInput"
    @change="handleChange"
  >
    <el-checkbox
      v-for="item in fileSizeAgg"
      :key="item.rangeId"
      :label="item.rangeName"
    >
      {{ item.rangeName }}<template>
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
    fileSizeAgg: {
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
      this.$emit('selectFileSize', value)
    }
  }
}
</script>
