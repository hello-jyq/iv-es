<template>
  <div class="el-input">
    <input
      class="el-input__inner"
      type="text"
      :placeholder="placeholder"
      :value="value1"
      @input="input($event.target.value)"
      @blur="blur($event)"
      @focus="focus"
    >
  </div>
</template>
<script>
export default {
  model: {
    type: 'text',
    event: 'input'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'placeholder'],
  data() {
    return {
      value1: ''
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
      this.value1 = this.__format(this.value1)
      this.$emit('blur', event)
    },
    focus(event) {
      this.value1 = this.value
      this.$emit('focus', event)
      // // console.log(this.value)
    },
    __format(num) {
      let reg = null
      if (num.indexOf('.') > -1) {
        reg = /(\d)(?=(\d{3})+\.)/g
        return (num + '').replace(reg, '$1,')
      } else {
        reg = /\d{1,3}(?=(\d{3})+$)/g
        return (num + '').replace(reg, '$&,')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
