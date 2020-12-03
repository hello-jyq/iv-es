export const numFormat = {
  filters: {
    // 格式化数字，千分位表示
    numFormat(num) {
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
