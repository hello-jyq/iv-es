<template>
  <div class="dict">
    <div class="search">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span slot="title" class="collapse-title">{{ $t('comm.queryCriteria') }}</span>
          <div class="input_box">
            <div class="flex3">
              <div class="title">
                <!-- 类型id: -->
                {{ $t('admin.dict.dictTypeId') }}:
              </div>
              <el-input v-model="searchParam.params.dictTypeId" class="input" :placeholder="$t('admin.dict.dictTypeId')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 类型名称: -->
                {{ $t('admin.dict.dictTypeName') }}:
              </div>
              <el-input v-model="searchParam.params.dictTypeName" class="input" :placeholder="$t('admin.dict.dictTypeName')" clearable />
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
            {{ $t('comm.batchDeletion') }}
          </el-button>
          <el-button type="primary" class="el-icon-refresh" plain @click="refreshDict">
            {{ $t('comm.refreshCache') }}
          </el-button>
        </div>
        <div class="right">
          <el-button type="success" class="el-icon-search" @click="search">
            {{ $t('comm.query') }}
          </el-button>
          <el-button class="el-icon-refresh-left" type="info" @click="reset">
            {{ $t('comm.reset') }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="table"
        v-loading="isLoading"
        :data="dictList"
        border
        height="579"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          :label="$t('comm.operation')"
          min-width="120"
          width="120"
        >
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row, scope.$index)" />
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.row, scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('admin.dict.dictTypeId')"
          min-width="150"
          prop="dictTypeId"
        />
        <el-table-column
          prop="dictTypeName"
          :label="$t('admin.dict.dictTypeName')"
          min-width="140"
        />
        <el-table-column
          prop="rankNo"
          :label="$t('admin.dict.level')"
          min-width="80"
        />
        <el-table-column
          prop="parentId"
          :label="$t('admin.dict.parentId')"
          min-width="120"
        />
        <el-table-column
          prop="seqNo"
          label="seqNo"
          min-width="160"
          show-overflow-tooltip
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
    <div class="editDilog">
      <el-dialog
        :title="dialogType==='create'? $t('comm.newlyBuild') : $t('comm.edit')"
        :visible.sync="showDialog"
        width="80%"
        center
      >
        <div class="dict_edit">
          <h5>{{ $t('comm.essentialInformation') }}</h5>
          <div class="input_box">
            <div class="flex3">
              <div class="title must">
                <!-- 类型ID -->
                {{ $t('admin.dict.dictTypeId') }}
              </div>
              <div class="input">
                <el-input v-model="dialogObj.dictTypeId" :placeholder="$t('admin.dict.dictTypeId')" class="input" @blur="validator('typeId')" />
                <span ref="typeId" data-roles="required" :data-value="dialogObj.dictTypeId" class="message" />
              </div>
            </div>
            <div class="flex3">
              <div class="title must">
                <!-- 类型名称 -->
                {{ $t('admin.dict.dictTypeName') }}
              </div>
              <div class="input">
                <el-input v-model="dialogObj.dictTypeName" :placeholder="$t('admin.dict.dictTypeName')" class="input" @blur="validator('typeName')" />
                <span ref="typeName" data-roles="required" :data-value="dialogObj.dictTypeName" class="message" />
              </div>
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 级别 -->
                {{ $t('admin.dict.level') }}
              </div>
              <el-input v-model="dialogObj.rankNo" :placeholder="$t('admin.dict.level')" class="input" />
            </div>
            <div class="flex3">
              <div class="title">
                {{ $t('admin.dict.parentId') }}
                <!-- 父级ID -->
              </div>
              <el-input v-model="dialogObj.parentId" :placeholder="$t('admin.dict.parentId')" class="input" />
            </div>
            <div class="flex3">
              <div class="title">
                seqNo
              </div>
              <el-input v-model="dialogObj.seqNo" placeholder="seqNo" class="input" disabled />
            </div>
          </div>
        </div>
        <h5>
          <!-- 字典明细 -->
          {{ $t('admin.dict.dictionaryDetails') }}
          <div class="add_row iconfont icon-jia" @click.stop="handleAddTableRows">
            <!-- 添加字典 -->
            {{ $t('admin.dict.addDictionary') }}
          </div>
        </h5>
        <div class="table">
          <el-table
            :data="detailTable"
            border
            height="200"
            style="width: 100%"
          >
            <el-table-column :label="$t('comm.operation')" width="70">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDeleteRow(scope.row, scope.$index)" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin.dict.dictId')" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.dictId" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin.dict.dictName')" width="250">
              <template slot-scope="scope">
                <el-input v-model="scope.row.dictName" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin.dict.status')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin.dict.sortNo')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sortNo" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin.dict.parentId')" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.parentId" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin.dict.filter', {value: 1})" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.filter1" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin.dict.filter', {value: 2})" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.filter2" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin.dict.desc')" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.description" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer">
          <!-- <el-button @click="dialogVisible = false">{{$t('comm.cancel')}}</el-button> -->
          <el-button type="primary" :disabled="!validatorState" @click="handleSave">{{ $t('comm.certain') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import { getDictInfo, deleteDictById, editDict, getEntryList } from '@/api/admin/dict-api.js'
import { mapActions } from 'vuex'
import { formValidator } from '@/mixins/form-validator.js'
export default {
  mixins: [search, formValidator],
  data() {
    return {
      isLoading: true,
      activeNames: ['1'],
      dialogType: 'create',
      showDialog: false,
      dictList: [],
      // 分页插件数据
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          dictTypeId: '',
          dictTypeName: ''
        }
      },
      dialogObj: {},
      multipleSelection: [],
      detailTable: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getDictInfo(this.searchParam)
      if (res && res.success) {
        const { results, pageNo, totalRecord } = res.datas.searchResult
        this.dictList = results
        this.searchParam.pageNo = pageNo
        this.searchParam.totalRecord = totalRecord
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    handleCreate() {
      this.dialogObj = {}
      this.detailTable = []
      this.dialogType = 'create'
      this.showDialog = true
      this.validatorState = false
      this.$nextTick(function() {
        this.clearErrorMessage()
      })
    },
    handleEdit(rowData) {
      getEntryList({ dictTypeId: rowData.dictTypeId }).then(res => {
        this.detailTable = res.datas.entryList
        this.dialogObj = { ...rowData }
        this.dialogType = 'edit'
        this.showDialog = true
        this.validatorState = true
        this.$nextTick(function() {
          this.clearErrorMessage()
        })
      })
    },
    handleDelete(rowData) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        deleteDictById([rowData]).then(() => {
          this.search()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    batchDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm(this.$t('comm.tip2'), this.$t('comm.tips'), {
          confirmButtonText: this.$t('comm.certain'),
          cancelButtonText: this.$t('comm.cancel'),
          type: 'warning'
        }).then(() => {
          deleteDictById(this.multipleSelection).then(() => {
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
    handleSave() {
      if (!this.validatorAll()) {
        return false
      }
      this.dialogObj.dicts = this.detailTable
      editDict(this.dialogObj).then(() => {
        this.showDialog = false
        this.fetchData()
      })
    },
    handleAddTableRows() {
      const newRow = {
        dictId: '',
        dictName: '',
        status: '',
        sortNo: '',
        parentId: '',
        filter1: '',
        filter2: ''
      }
      this.detailTable = [...this.detailTable, newRow]
    },
    handleDeleteRow(row, index) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        this.detailTable.splice(index, 1)
        this.$message({
          type: 'success',
          message: this.$t('comm.msg2')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    refreshDict() {
      this.$confirm(this.$t('comm.tip3'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        this.refreshDictAndClearStore()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    ...mapActions([
      'refreshDictAndClearStore'
    ])
  }
}
</script>
<style lang="scss" scoped>
.dict {
  .editDilog,.addDilog {
    h5 {
      font-size: 16px;
      line-height: 30px;
      height: 30px;
      .add_row {
        position: absolute;
        right: 25px;
        // bottom: 300px;
        border-radius: 6px;
        // border: 1px solid #ccc;
        cursor: pointer;
        font-size: 12px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-image: linear-gradient(rgb(52, 165, 248), rgb(8, 142, 240));
        color: #fff;
        &:hover {
          background-image: linear-gradient(rgb(42, 155, 238), rgb(8, 142, 240));
        }
      }
    }
    // .basic {
    //   display: flex;
    //   flex-wrap: wrap;
    //   margin-bottom: 15px;
    //   &>div {
    //     width: 33.33%;
    //     display: flex;
    //     align-items: center;
    //     box-sizing: border-box;
    //     padding-right: 20px;
    //     margin-bottom: 20px;
    //     .input {
    //       flex: 1;
    //     }
    //     .title {
    //       width: 120px;
    //     }
    //   }
    // }
  }
  // .dict_add {
  //   flex: 1;
  //   position: relative;
  //   .message {
  //     position: absolute;
  //     height: 20px;
  //     line-height: 20px;
  //     padding-left: 130px;
  //     font-size: 12px;
  //     color: red;
  //     top: 46%;
  //   }
  // }
}
</style>
