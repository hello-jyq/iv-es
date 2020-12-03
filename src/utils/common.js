
const commonUtil = {

}

// CRM数据权限的操作许可检查
// CRm系统采用2进制进行权限的配置，
//   第一位 : 读
//	   第二位 : 写
//	   第三位 : 逻辑删除
//	  第四位 : 物理删除
commonUtil.checkRight = function(rightNo, operateStr) {
  if (rightNo == null || rightNo === '') {
    return false
  }

  // 读取
  if (operateStr === 'read') {
    if ((rightNo & 1) === 1) {
      return true
    } else {
      return false
    }
  }

  // 编辑
  if (operateStr === 'write') {
    if (((rightNo & 2) >> 1) === 1) {
      return true
    } else {
      return false
    }
  }

  // 逻辑删除
  if (operateStr === 'delete') {
    if (((rightNo & 4) >> 2) === 1) {
      return true
    } else {
      return false
    }
  }

  // 物理删除
  if (operateStr === 'completedelete') {
    if (((rightNo & 8) >> 3) === 1) {
      return true
    } else {
      return false
    }
  }

  return false
}

// commonUtil.showErrorMessage = function(res) {
//   let message = ''
//   if (res.message != null) {
//     message = message + window.vmi8n.$i18n.t(res.message)
//   }
//   if (res.messages != null) {
//     res.messages.forEach(item => {
//       const filedName = window.vmi8n.$i18n.t(item.arguments.id) + ':'
//       message = message + filedName + window.vmi8n.t(item.message, item.arguments)
//     })
//   }

//   this.$alert(message, window.vmi8n.$i18n.t('comm.tips'), {
//     confirmButtonText: window.vmi8n.$i18n.t('comm.certain')
//   })
// }

// 校验数值
commonUtil.checkNumLengthWithMaxTwoDot = function(value, intLength) {
  if (value === undefined || value === '') {
    return true
  }

  // eslint-disable-next-line no-unused-vars
  const length = value.length
  const regStr = /^(\-|\+)?(([1-9][0-9]*)|0)([.]{1}[0-9]{1,2})?$/
  if (!regStr.test(value)) {
    return false
  }

  const v = value.toString().replace(/,/g, '')
  if (isNaN(v) || !this.trim(v)) {
    return true
  }

  const vs = v.split('.')
  const n = vs[0].replace(/-/g, '')
  if (n.length > intLength) {
    return false
  }

  return true
}
// 验证是否为数字
commonUtil.crmIsNumberCheck = function(value) {
  if (value === undefined) {
    return false
  }

  if (value === 0 || value === '0') {
    return true
  }

  var patrn = /^(-)?\d+(\.\d+)?$/
  if (patrn.exec(value) == null || value === '') {
    return false
  } else {
    return true
  }
}
commonUtil.thousandSeparator = function(value) {
  value = value.toString().replace(/,/g, '')
  var re = /\d{1,3}(?=(\d{3})+$)/g
  var ng = ''
  if (value && value.charAt(0) === '-') {
    ng = '-'
    value = value.substr(1)
  }
  var thousandValue = value.replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) { return s1.replace(re, '$&,') + s2 })
  return ng + thousandValue
  // return thousandValue;
}
commonUtil.formatCurrency = function(v) {
  if (v === undefined || v.toString() == null || v.toString() === '') {
    return ''
  }
  v = v.toString().replace(/,/g, '')
  // eslint-disable-next-line no-undef
  if (isNaN(v) || !$.trim(v)) {
    return v
  }
  v = v * 1
  v = v + ''

  var vs = v.split('.')
  if (vs[1]) {
    if (vs[1].length > 2) {
      /* if(vs[1].substr(2,1) >= "5"){
				v = (v * 1000 + 5)/1000 + "";
				var tempVs = v.split(".");
				if(tempVs[1]){
					if(tempVs[1].length > 2){
						v = tempVs[0] + "." + tempVs[1].substr(0,2);
					}
				}
			}  else {
				v = vs[0] + "." + vs[1].substr(0,2);
			}*/
    } else if (vs[1].length === 1) {
      v = v + '0'
    } else if (vs[1].length === 0) {
      v = v + '00'
    }
  } else {
    v += '.00'
  }
  return v
}

commonUtil.twoDecimal = function(roundNum) {
  if (isNaN(roundNum)) {
    return roundNum
  }

  var number
  try {
    number = Number(roundNum)
  } catch (e) {
    return roundNum
  }

  var _sign = (number < 0) ? -1 : 1				// 正负的符号
  var _pow = Math.pow(10, 2)				// 进度

  var resetNum = commonUtil.numMulti(number, _sign)			// 负值时转化为正的值
  var result = commonUtil.numDiv(Math.round(commonUtil.numMulti(resetNum, _pow)), _pow) // 对正的值求round

  // 返回， 还原符号
  return commonUtil.numMulti(result, _sign)
}

commonUtil.numMulti = function(num1, num2) {
  var baseNum = 0
  try {
    baseNum += num1.toString().split('.')[1].length
  // eslint-disable-next-line no-empty
  } catch (e) {
  }
  try {
    baseNum += num2.toString().split('.')[1].length
  // eslint-disable-next-line no-empty
  } catch (e) {
  }
  return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum)
}
// commonUtil.numDiv = function(num1, num2) {
// 	 var baseNum1 = 0, baseNum2 = 0;
// 	 var baseNum3, baseNum4;
// 	 try {
// 		 baseNum1 = num1.toString().split(".")[1].length;
// 	 } catch (e) {
// 		 baseNum1 = 0;
// 	 }
// 	 try {
// 		 baseNum2 = num2.toString().split(".")[1].length;
// 	 } catch (e) {
// 		 baseNum2 = 0;
//    }
//     with (Math) {
// 		 baseNum3 = Number(num1.toString().replace(".", ""));
// 		 baseNum4 = Number(num2.toString().replace(".", ""));
// 		 return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
// 	 }
// }
commonUtil.moneyFormat = function(val) {
  var num = val + ''
  if (num === 'undefined' || num === '' || num === 'null') {
    return '0.00'
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
export default commonUtil
