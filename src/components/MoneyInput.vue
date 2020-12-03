<template>
  <div class="el-input">
    <input
      class="el-input__inner"
      type="text"
      :class="{'positive-num':isPositiveInput, 'negative-num':!isPositiveInput}"
      :placeholder="placeholder"
      :value="value"
      @change="changeCss"
      @input="input($event.target.value)"
      @blur="blur($event)"
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
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isPositiveInput: true
    }
  },
  created() {
    const value = this.value
    this.value = value
  },
  methods: {
    input(value) {
      this.$emit('input', value)
      this.value = value
    },
    blur(event) {
      // // console.log(this.value1)
      this.value = this.__format(this.value)
      this.$emit('blur', event)
    },
    // focus(event) {
    //   this.value1 = this.value
    //   this.$emit('focus', event)
    //   // // console.log(this.value)
    // },
    changeCss(val) {
      if (val.target.value.indexOf('-') > -1) {
        this.isPositiveInput = false
      } else {
        this.isPositiveInput = true
      }
    },
    __format(num) {
      if (num === 'undefined' || num === '') {
        return num
      }
      let reg = null

      let formatedValue = null
      if (num.indexOf('.') > -1) {
        reg = /(\d)(?=(\d{3})+\.)/g
        formatedValue = (num + '').replace(reg, '$1,')
        const vs = num.split('.')
        if (vs[1].length === 1) {
          formatedValue = formatedValue + '0'
        } else if (vs[1].length === 0) {
          formatedValue = formatedValue + '00'
        }
        return formatedValue
      } else {
        reg = /\d{1,3}(?=(\d{3})+$)/g
        formatedValue = (num + '').replace(reg, '$&,') + '.00'
        return formatedValue
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .positive-num {
    color: #525661;
  }
  .negative-num {
    color: #e80d21;
  }

</style>
