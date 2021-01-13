<template>
  <div>
    <div class="input_box">
      <div class="flex1">
        <h4 v-if="orgChangeDiv == 'edit'">
          组织信息编辑
        </h4>
        <h4 v-if="orgChangeDiv == 'add'">
          组织信息新增
        </h4>
      </div>
      <div class="flex1">
        <div class="title">
          {{ $t('admin.org.validYear') }}:
        </div>
        <div class="input">
          <el-input v-model="validYear" class="input" :readonly="true" />
        </div>
      </div>
      <div class="flex1">
        <div class="title">
          {{ $t('admin.org.orgId') }}
        </div>
        <el-input
          v-if="orgChangeDiv == 'edit'"
          v-model="departmentEdit.id"
          class="input"
          :readonly="true"
        />
        <el-input
          v-if="orgChangeDiv == 'add'"
          v-model="departmentEdit.id"
          class="input"
        />
      </div>
      <div class="flex1">
        <div class="title">
          {{ $t('admin.org.orgCode') }}
        </div>
        <div class="input">
          <el-input
            v-model="departmentEdit.orgCode"
            class="input"
            :placeholder="$t('admin.org.orgCode')"
          />
        </div>
      </div>
      <div class="flex1">
        <div class="title must">
          {{ $t('admin.org.orgName') }}
        </div>
        <div class="input">
          <el-input
            v-model="departmentEdit.orgName"
            class="input"
            @blur="validator('orgEditOrgName')"
          />
          <span ref="orgEditOrgName" data-roles="required" :data-value="departmentEdit.orgName" class="message" />
        </div>
      </div>
      <div class="flex1">
        <div class="title">
          <!-- 父机构ID -->
          {{ $t('admin.org.parentId') }}
        </div>
        <el-input
          v-model="departmentEdit.parentId"
          class="input"
        />
      </div>
      <div class="flex1">
        <div class="title must">
          {{ $t('admin.org.deleteFlag') }}
        </div>
        <div class="input">
          <dict-select v-model="departmentEdit.deleteFlag" dict-type-id="DeleteFlag" @change="(value) => {validator('orgEditState', value)}" />
          <span ref="orgEditState" data-roles="required" :data-value="departmentEdit.deleteFlag" class="message" />
        </div>
      </div>
    </div>

    <div
      class="btn"
      style="margin-top: 10px;"
    >
      <ul class="content-top-btn">
        <li class="operation-item" @click="orgEdit">
          <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont icon-wendang" /></span>
          <span class="operation-text">保&nbsp;存</span>
        </li>
        <li />
      </ul>
    </div>
  </div>
</template>

<script>
import { formValidator } from '@/mixins/form-validator.js'
import DictSelect from '@/components/DictSelect'
import { orgSave } from '@/api/admin/org-api.js'
export default {
  components: {
    DictSelect
  },
  mixins: [formValidator],
  props: {
    validYear: {
      type: String,
      default: ''

    },
    departmentEdit: {
      type: Object,
      default: null

    },
    orgChangeDiv: {
      type: String,
      default: ''

    }
  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    orgEdit() {
      if (!this.validatorAll('orgEdit')) {
        return false
      }
      this.departmentEdit.validYear = this.validYear
      orgSave(this.departmentEdit).then(() => {
        this.$emit('search')
        this.$emit('searchTree')
      })
    }
  }
}
</script>
