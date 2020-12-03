<template>
  <div>
    <el-button type="primary" icon="el-icon-menu" class="selects_butt" @click="showSelect">
      <i class="el-icon-caret-bottom" />
    </el-button>
    <el-checkbox-group
      v-show="selects"
      :value="value"
      @input="handleInput"
      @change="handleChange"
    >
      <el-checkbox
        v-for="item in allColumns"
        :key="item.colKey"
        :label="item.colKey"
      >
        {{ item.colName }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  name: 'ColumnsSelect',
  props: {
    allColumns: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      selects: false
    }
  },
  methods: {
    showSelect() {
      this.selects = !this.selects
    },
    handleInput(newValue) {
      this.$emit('input', newValue)
    },
    handleChange(newValue) {
      this.$emit('change', newValue)
    }
  }
}
</script>
