// 1:提供全部校验方法 this.validator(ref) 传入需要校验的ref数组
// 1-2:单个校验： this.validator(ref) 传入单个ref
/* <div class="input">
  <el-input v-model="addDilogInfo.money" placeholder="请输入内容" @blur="validator('money')" />
  <span ref="money" data-roles="number" :data-value="addDilogInfo.money" class="message" />
  注: span需要绑定ref以及提供两个自定义参数 data-roles:校验规则(以逗号分隔，例：a,b,c);
        校验规则里需要绑定param时， a[param0,param1...]的
      data-value: 需要校验的值，一般是input所绑定的值。
</div> */

/* <el-select clearable v-model="addDilogInfo.subject" placeholder="请选择" class="input" @change="(value) => {validator('aa', value)}">
<el-option
  v-for="item in subjectList"
  :key="item"
  :value="item"
/>
</el-select>
<span ref="aa" data-roles="required" :data-value="addDilogInfo.subject" class="message" /> */
// 2:validatorState:校验变量，可用于判断校验是否通过，从而禁用提交按键
// 3:提供单个提示自定义接口, 可以手动打开提示
// rules为校验规则列表
import i18n from '@/i18n/index.js'
const rules = [
  {
    type: 'number',
    regexp: /^[0-9][0-9 | .]*[0-9]*$/,
    meg: i18n.t('validator.msg1') // 请输入数字

  },
  {
    type: 'positiveInt',
    regexp: /^\+?[1-9]\d*$/,
    meg: i18n.t('validator.msg2') // '请输入大于0的正整数！'
  },
  {
    type: 'positiveIntAnd0',
    regexp: /^[0-9]*$/,
    meg: i18n.t('validator.msg3') // '请输入正整数或0！'
  },
  {
    type: 'character',
    regexp: /^[A-Za-z]+$/,
    meg: i18n.t('validator.msg4') // '请输入字母！'
  },
  {
    type: 'charNum',
    regexp: /^[A-Za-z0-9]+$/,
    meg: i18n.t('validator.msg5') // '请输入英数字！'
  },
  {
    type: 'charNumUnderline',
    regexp: /^[0-9a-zA-Z_]{1,}$/,
    meg: i18n.t('validator.msg6') // '请输入英数字或下划线！'
  },
  {
    type: 'email',
    regexp: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    meg: i18n.t('validator.msg7') // '请输入正确的Email地址！'
  },
  {
    type: 'password',
    // regexp: /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}$/,  英数字+特殊字符
    regexp: /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/, // 英文和数字
    meg: i18n.t('validator.msg8') // '密码必须8位以上，并包含英文和数字！'
  },
  {
    type: 'required',
    regexp: /^\S/,
    meg: i18n.t('validator.msg9') // '内容不能为空'
  },
  {
    type: 'positiveIntAndDecimal2', // 带q
    regexp: /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/,
    meg: i18n.t('validator.msg10') // '请输入正整数或0！'
  }
]
export const formValidator = {
  data() {
    return {
      validatorState: true
    }
  },
  methods: {
    // @ref: string | array
    validator(ref, ...arg) {
      // // console.log(arg)
      this.validatorState = true
      if (typeof ref === 'string') {
        if (arg.length > 0) {
          this.__validatorOne(ref, arg[0])
        } else {
          this.__validatorOne(ref)
        }
      } else {
        ref.forEach(item => {
          this.__validatorOne(item)
        })
      }
      return this.validatorState
    },
    validatorAll(startStr) {
      if (this.$refs) {
        for (const item in this.$refs) {
          if (this.$refs[item] && this.$refs[item].className === 'message') {
            if (startStr) {
              if (item.startsWith(startStr)) {
                this.__validatorOne(item)
              }
            } else {
              this.__validatorOne(item)
            }
          }
        }
      }
      // refs.forEach(item => {
      //   this.__validatorOne(item)
      // })
      return this.validatorState
    },
    __validatorOne(ref, value) {
      const span = this.$refs[ref]
      let strRoles = span.getAttribute('data-roles')
      let params = null
      // 自定义规则的时候，回带参数过来，定义形式为rule[param0,param1...]
      if (strRoles != null && strRoles.indexOf('[') > -1) {
        const strRolesArray = strRoles.split('[')
        params = strRolesArray[1].split(']')[0]
        strRoles = strRolesArray[0]
      }
      value = value === undefined ? span.getAttribute('data-value') : value
      // value = value.trim()
      // // console.log(value)
      const ruleList = strRoles ? strRoles.split(',') : []
      let message = ''
      let lang = true
      if (value) {
        // 货币的检查 moneyWith2Decimal[10,2]
        if (ruleList.find(item => item === 'moneyWith2Decimal')) {
          const intLength = params.split(':')[0]
          const decimalLength = params.split(':')[1]
          if (!checkCurrencyAndLengthNegative(value, intLength)) {
            message = i18n.t('validator.msg11', { 'intLength': intLength, 'decimalLength': decimalLength })
          }
        // 检查字符串长度
        } else if (ruleList.find(item => item === 'lengthCheck')) {
          const minLength = params.split(':')[0]
          const maxLength = params.split(':')[1]
          if (!checkLength(value, minLength, maxLength)) {
            message = i18n.t('validator.msg10', { 'minLength': minLength, 'maxLength': maxLength })
          }
        } else {
          rules.forEach(item => {
            if (ruleList.indexOf(item.type) > -1) {
              lang = item.regexp.test(value)
              if (!lang) {
                message = item.meg
                return false
              }
            }
          })
        }
      } else {
        if (ruleList.find(item => item === 'required')) {
          message = i18n.t('validator.msg9')
          lang = false
        }
      }
      // if (!value || value.trim() === '') {
      //   message = '内容不能为空！'
      //   lang = false
      // }
      span.innerText = message
      if (this.validatorState) {
        this.validatorState = lang
      }
    },
    setValidatorMessage(ref, message) {
      // this.validatorState = false
      this.$refs[ref].innerText = message
    },
    clearErrorMessage(startStr) {
      // refs.forEach(item => {
      //   this.refs[item].innerText = ''
      // })
      if (this.$refs) {
        for (const item in this.$refs) {
          if (this.$refs[item]) {
            if (this.$refs[item].className === 'message') {
              if (startStr) {
                if (item.startsWith(startStr)) {
                  this.$refs[item].innerText = ''
                }
              } else {
                this.$refs[item].innerText = ''
              }
            }
          }
        }
      }
    }
  }
}

/**
 * 检查货币，保留两位小数
 * 允许负数
 * @param {*} value
 * @param {*} intLength
 */
function checkCurrencyAndLengthNegative(value, intLength) {
  if (value === undefined || value === '') {
    return true
  }

  // var regStr = /^(\-|\+)?(([1-9][0-9]{0,2}(,\d{3})*)|0)((\.\d{2})?|0)$/
  const regStr = /^(\-|\+)?(([1-9]\d*)|([0]{1}))(\.(\d){0,2})?$/
  if (!regStr.test(value)) {
    return false
  }

  const v = value.toString().replace(/,/g, '')
  if (isNaN(v) || v === '') {
    return true
  }

  const vs = v.split('.')
  const n = vs[0].replace(/-/g, '')
  if (n.length > intLength) {
    return false
  }

  return true
}

/**
 * 检查长度
 * @param {*} value
 * @param {*} min
 * @param {*} max
 */
function checkLength(value, min, max) {
  if (value.length < min) {
    return false
  }

  if (value.length > max) {
    return false
  }
  return true
}
