<template>
  <el-checkbox-group
    :value="value"
    :disabled="disabled"
    @input="handleInput"
    @change="handleChange"
  >
    <el-checkbox
      v-for="item in fileTypeAgg"
      :key="item.fileTypeId"
      :label="item.fileTypeId"
    >
      {{ item.fileTypeId }}<template>
        <span>({{ item.fileTypeCount }})</span>
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
    fileTypeAgg: {
      type: Array,
      default: () => { return [] }
    },
    dictTypeId: {
      type: String,
      required: true
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
      this.$emit('selectFileType', value)
    }
  }
}
</script>
