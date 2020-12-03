<template>
  <div class="activity">
    <div class="search">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span slot="title" class="collapse-title">{{ $t('comm.queryCriteria') }}</span>
          <div class="mode input_box">
            <div class="flex3">
              <div class="title">
                {{ $t('admin.resource.resourceId') }}:
              </div>
              <el-input v-model="searchParam.params.resId" class="input" :placeholder="$t('admin.resource.resourceId')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                {{ $t('admin.resource.resType') }}:
              </div>
              <dict-select v-model="searchParam.params.type" dict-type-id="ResourceType" class="input" />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="btns">
        <div class="left">
          <el-button type="primary" class="el-icon-circle-plus-outline" @click="handleCreate">
            {{ $t('comm.newlyBuild') }}
          </el-button>
          <el-button type="danger" class="el-icon-delete" @click="batchDelete">
            <!-- 批量删除 -->
            {{ $t('comm.batchDeletion') }}
          </el-button>
          <el-button type="primary" class="el-icon-refresh" plain @click="refreshResource">
            <!-- 刷新缓存 -->
            {{ $t('comm.refreshCache') }}
          </el-button>
        </div>
        <div class="right">
          <el-button type="success" class="el-icon-search" @click="search">
            <!-- 查询 -->
            {{ $t('comm.query') }}
          </el-button>
          <el-button class="el-icon-refresh-left" type="info" @click="reset">
            <!-- 重置 -->
            {{ $t('comm.reset') }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="table"
        v-loading="isLoading"
        :data="resourcesList"
        border
        style="width: 100%"
        height="579"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column :label="$t('comm.operation')" min-width="120" width="120">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row, scope.$index)" />
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row, scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('admin.resource.resourceId')"
          min-width="150"
          prop="id"
        />
        <el-table-column
          prop="resName"
          :label="$t('admin.resource.resName')"
          min-width="160"
        />
        <el-table-column
          prop="parentId"
          :label="$t('admin.resource.parentId')"
          min-width="150"
        />
        <el-table-column prop="type" :label="$t('admin.resource.resType')" min-width="80">
          <template slot-scope="scope">
            <dict-write dict-type-id="ResourceType" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column
          prop="resUrl"
          :label="$t('admin.resource.resUrl')"
          min-width="150"
        />
        <el-table-column
          prop="resLevel"
          :label="$t('admin.resource.resLevel')"
          min-width="80"
        />
        <el-table-column
          prop="displayOrder"
          :label="$t('admin.resource.displayOrder')"
          min-width="80"
        />
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, ->"
          :page-size="searchParam.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="searchParam.pageNo"
          :total="searchParam.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div class="addDilog">
      <el-dialog
        :title="dialogType==='create'? $t('comm.newlyBuild') : $t('comm.edit')"
        :visible.sync="showDialog"
        width="80%"
        center
      >
        <div class="res_add">
          <div class="input_box">
            <div class="flex2">
              <div class="title must">
                {{ $t('admin.resource.resourceId') }}
              </div>
              <div class="input">
                <el-input v-model="dialogObj.id" :placeholder="$t('admin.resource.resourceId')" class="input" @blur="validator('resId')" />
                <span ref="resId" data-roles="required" :data-value="dialogObj.id" class="message" />
              </div>
            </div>
            <div class="flex2">
              <div class="title must">
                {{ $t('admin.resource.resName') }}
              </div>
              <div class="input">
                <el-input v-model="dialogObj.resName" :placeholder="$t('admin.resource.resName')" class="input" @blur="validator('resName')" />
                <span ref="resName" data-roles="required" :data-value="dialogObj.resName" class="message" />
              </div>
            </div>
            <div class="flex2">
              <div class="title must">
                {{ $t('admin.resource.resType') }}
              </div>
              <div class="input">
                <dict-select v-model="dialogObj.type" :clearable="false" class="input" dict-type-id="ResourceType" @change="(value)=>{validator('resType',value)}" />
                <span ref="resType" data-roles="required" :data-value="dialogObj.type" class="message" />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                {{ $t('admin.resource.parentId') }}
              </div>
              <el-input v-model="dialogObj.parentId" :placeholder="$t('admin.resource.parentId')" class="input" />
            </div>
            <div class="flex2">
              <div class="title">
                {{ $t('admin.resource.resKey') }}
              </div>
              <el-input v-model="dialogObj.resKey" :placeholder="$t('admin.resource.resKey')" class="input" />
            </div>
            <div class="flex2">
              <div class="title">
                {{ $t('admin.resource.resUrl') }}
              </div>
              <el-input v-model="dialogObj.resUrl" :placeholder="$t('admin.resource.resUrl')" class="input" />
            </div>
            <div class="flex2">
              <div class="title">
                {{ $t('admin.resource.resFile') }}
              </div>
              <el-input v-model="dialogObj.resFile" :placeholder="$t('admin.resource.resFile')" class="input" />
            </div>
            <div class="flex2">
              <div class="title">
                {{ $t('admin.resource.resLevel') }}
              </div>
              <div class="input">
                <el-input v-model="dialogObj.resLevel" :placeholder="$t('admin.resource.resLevel')" class="input" @blur="validator('resLevel')" />
                <span ref="resLevel" data-roles="positiveIntAnd0" :data-value="dialogObj.resLevel" class="message" />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 是否叶子节点 -->
                {{ $t('admin.resource.isLeaf') }}
              </div>
              <dict-select v-model="dialogObj.isLeaf" class="input" dict-type-id="IsNo" />
            </div>
            <div class="flex2">
              <div class="title">
                {{ $t('admin.resource.displayOrder') }}
              </div>
              <div class="input">
                <el-input v-model="dialogObj.displayOrder" :placeholder="$t('admin.resource.displayOrder')" class="input" @blur="validator('resOrder')" />
                <span ref="resOrder" data-roles="positiveIntAnd0" :data-value="dialogObj.displayOrder" class="message" />
              </div>
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 图标Class -->
                {{ $t('admin.resource.iconClass') }}
              </div>
              <el-input v-model="dialogObj.icon" :placeholder="$t('admin.resource.iconClass')" class="input" />
            </div>
            <div class="flex2">
              <div class="title">
                <!-- 描述 -->
                {{ $t('admin.resource.desc') }}
              </div>
              <el-input v-model="dialogObj.description" :placeholder="$t('admin.resource.desc')" class="input" />
            </div>
          </div>
        </div>
        <span slot="footer">
          <el-button type="primary" :disabled="!validatorState" @click="handleSave">{{ $t('comm.certain') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import DictSelect from '@/components/DictSelect'
import DictWrite from '@/components/DictWrite'
import { getResList, deleteRes, resSave, refreshRes } from '@/api/admin/resource-api.js'
import { formValidator } from '@/mixins/form-validator.js'
export default {
  components: {
    DictSelect,
    DictWrite
  },
  mixins: [search, formValidator],
  data: function() {
    return {
      isLoading: true,
      activeNames: ['1'],
      multipleSelection: [],
      showDialog: false,
      dialogObj: {},
      dialogType: 'create',
      resourcesList: [],
      // 分页插件数据
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          resId: '',
          type: ''
        }
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getResList(this.searchParam)
      if (res && res.success) {
        const { results, pageNo, totalRecord } = res.datas.searchResult
        this.resourcesList = results
        this.searchParam.pageNo = pageNo
        this.searchParam.totalRecord = totalRecord
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    batchDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm(this.$t('comm.tip2'), this.$t('comm.tips'), {
          confirmButtonText: this.$t('comm.certain'),
          cancelButtonText: this.$t('comm.cancel'),
          type: 'warning'
        }).then(() => {
          deleteRes(this.multipleSelection).then(() => {
            this.search()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('comm.msg1')
          })
        })
      } else {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg3')
        })
      }
    },
    refreshResource() {
      this.$confirm(this.$t('comm.tip3'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        await refreshRes()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleCreate() {
      this.dialogObj = {}
      this.dialogType = 'create'
      this.showDialog = true
      this.validatorState = false
      this.$nextTick(function() {
        this.clearErrorMessage()
      })
    },
    handleDelete(rowData) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        deleteRes([rowData]).then(() => {
          this.search()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleEdit(rowData) {
      this.dialogType = 'edit'
      this.dialogObj = { ...rowData }
      this.dialogObj.isLeaf = rowData.isLeaf + ''
      this.validatorState = true
      this.showDialog = true
      this.$nextTick(function() {
        this.clearErrorMessage()
      })
    },
    handleSave() {
      if (!this.validatorAll()) {
        return false
      }
      resSave(this.dialogObj).then(() => {
        this.showDialog = false
        this.fetchData()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>
  .activity {
    width: 100%;
    padding: 20px;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    border-radius: 6px;
    background-color: #fff;
    box-sizing: border-box;
    .search {
      .btns {
        padding: 10px 0;
        text-align: right;
      }
    }
    .content {
      .pagination {
        padding: 5px 0;
        text-align: right;
      }
    }
    .res_add {
      .message {
        font-size: 12px;
        padding-left: 15px;
        color: red;
      }
    }
  }
</style>
