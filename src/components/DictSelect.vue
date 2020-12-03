<template>
  <el-select
    :value="value"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    :popper-class="theme=='Light' ? 'blueSelect' : ''"
    @input="handleInput"
    @change="handleChange"
    @blur="handleBlur"
  >
    <el-option
      v-for="item in options"
      :key="item.dictId"
      :label="item.dictName"
      :value="item.dictId"
    />
  </el-select>
</template>
<script>
import { dict } from '@/mixins/dict'
export default {
  name: 'DictSelect',
  mixins: [dict],
  props: {
    dictTypeId: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : ''
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>
