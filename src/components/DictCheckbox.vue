<template>
  <el-checkbox-group
    :value="value"
    :disabled="disabled"
    @input="handleInput"
    @change="handleChange"
  >
    <el-checkbox
      v-for="item in options"
      :key="item.dictId"
      :label="item.dictId"
    >
      {{ item.dictName }}
    </el-checkbox>
  </el-checkbox-group>
</template>
<script>
import { dict } from '@/mixins/dict'
export default {
  name: 'DictCheckbox',
  mixins: [dict],
  props: {
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
  }
}
</script>
