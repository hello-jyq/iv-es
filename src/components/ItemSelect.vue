<template>
  <span>{{ text }}</span>
</template>
<script>
import { dict } from '@/mixins/dict'
export default {
  name: 'DictWrite',
  mixins: [dict],
  props: {
    dictTypeId: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    text: function() {
      if (this.value == null || this.value === '' || this.value === undefined) {
        return this.value
      }

      if (this.options && this.options.length > 0) {
        const dictEntry = this.options.filter(item => item.dictId === this.value.toString())
        if (dictEntry && dictEntry.length > 0) {
          return dictEntry[0].dictName
        } else {
          return this.value
        }
      } else {
        return this.value
      }
    }
  }

}
</script>
