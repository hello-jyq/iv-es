import { mapGetters } from 'vuex'
export const search = {
  created: function() {
    if (this.searchParams.has(this.$route.path)) {
      this.searchParam = this.searchParams.get(this.$route.path)
    }
  },
  methods: {
    reset() {
      for (const item in this.searchParam.params) {
        this.searchParam.params[item] = ''
      }
    },
    search() {
      this.searchParam.pageNo = 1
      this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      this.fetchData()
    },
    handleSizeChange(pageSize, ref) {
      this.searchParam.pageNo = 1
      this.searchParam.pageSize = pageSize
      this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      this.fetchData()
      if (ref && this.$refs[ref]) {
        this.$refs[ref].doLayout()
      }
    },
    toFirstPage() {
      this.handleCurrentChange(1)
    },
    toLastPage() {
      this.searchParam.pageNo = Math.ceil(this.searchParam.totalRecord / this.searchParam.pageSize)
      this.handleCurrentChange(this.searchParam.pageNo)
    },
    handleCurrentChange(currentPage) {
      this.searchParam.pageNo = currentPage
      this.$store.dispatch('saveSearchParam', { path: this.$route.path, searchParam: this.searchParam })
      this.fetchData()
    },
    // 出现纵向滚动条时，防止表头行错位
    tableDolayout(refTable = this.$refs['table']) {
      setTimeout(() => {
        if (refTable) refTable.doLayout()
      },
      1000)
    }
  },
  computed: {
    ...mapGetters([
      'searchParams'
    ])
  },
  updated() {
    this.$nextTick(() => {
      const firstPageStatue = document.getElementsByClassName('btn-prev')[0].disabled
      const lastPageStatue = document.getElementsByClassName('btn-next')[0].disabled
      // console.log('=================>', firstPageStatue, lastPageStatue)
      if (firstPageStatue) {
        document.getElementsByClassName('first-pager')[0].disabled = true
      } else {
        document.getElementsByClassName('first-pager').disabled = false
      }
      if (lastPageStatue) {
        document.getElementsByClassName('last-pager')[0].disabled = true
      } else {
        document.getElementsByClassName('last-pager')[0].disabled = false
      }
    })
  },
}
