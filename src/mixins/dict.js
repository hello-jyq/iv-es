import { mapGetters } from 'vuex'
export const dict = {
  created: function() {
    this.$store.dispatch('getDicts', this.dictTypeId)
  },
  methods: {
    handleInput(newValue) {
      this.$emit('input', newValue)
    },
    handleChange(newValue) {
      this.$emit('change', newValue)
    },
    handleBlur(newValue) {
      this.$emit('blur', newValue)
    }
  },
  computed: {
    options: function() {
      const dict = this.dictList.filter(item => item.dictTypeId === this.dictTypeId)
      if (dict && dict.length > 0) {
        return dict[0].dicts
      } else {
        return []
      }
    },
    ...mapGetters([
      'dictList'
    ])
  }
}
