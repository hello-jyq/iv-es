export const selectHeader = {
  data() {
    return {
      isIndeterminate: false,
      checkAll: true
    }
  },
  methods: {
    handleCheckAllChange(val) {
      if (val) {
        this.tableHeaderList.forEach(item => (item.isShow = true))
        this.isIndeterminate = false
      } else {
        this.tableHeaderList.forEach(item => (item.isShow = false))
      }
    },
    handleItemChange() {
      const isAll = this.tableHeaderList.every(item => item.isShow)
      if (isAll) {
        this.isIndeterminate = false
        this.checkAll = true
      } else {
        this.checkAll = false
        const isSome = this.tableHeaderList.some(item => item.isShow)
        if (isSome) {
          this.isIndeterminate = true
        } else {
          this.isIndeterminate = false
        }
      }
    }
  }
}
