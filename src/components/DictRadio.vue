<template>
  <el-radio-group
    v-model="myValue"
    :disabled="disabled"
    :popper-class="theme=='Light' ? 'blueSelect' : ''"
    @input="handleInput"
    @change="handleChange"
    @blur="handleBlur"
  >
    <el-radio
      v-for="item in options"
      :key="item.dictId"
      :label="item.dictId"
    >
      {{ item.dictName }}
    </el-radio>
  </el-radio-group>
</template>
<script>
import { dict } from '@/mixins/dict'
export default {
  name: 'DictRadio',
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

    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myValue: this.value,
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : ''
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.myValue = newVal
    }
  }
}
</script>
