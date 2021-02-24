<template>
  <div class="dict">
    <div class="search">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span slot="title" class="collapse-title">{{ $t('comm.queryCriteria') }}</span>
          <div class="input_box">
            <div class="flex3">
              <div class="title">
                {{ $t('admin.i18n.keySeqNo') }}:
              </div>
              <el-input v-model="searchParam.params.keySeqNo" class="input" :placeholder="$t('admin.i18n.keySeqNo')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                {{ $t('admin.i18n.dataType') }}:
              </div>
              <dict-select v-model="searchParam.params.dataType" class="input" dict-type-id="I18nResourceType" :placeholder="$t('admin.i18n.dataType')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                {{ $t('admin.i18n.locale') }}:
              </div>
              <dict-select v-model="searchParam.params.locale" class="input" dict-type-id="Language" :placeholder="$t('admin.i18n.locale')" clearable />
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
          <el-button type="primary" class="el-icon-refresh" plain @click="handleRefresh">
            {{ $t('comm.refreshCache') }}
          </el-button>
          <el-button type="success" class="el-icon-download" @click="handleExport">
            {{ $t('comm.export') }}
          </el-button>
          <el-button type="success" class="el-icon-upload2" plain @click="uploadDialog = true">
            {{ $t('comm.import') }}
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
        :data="i18nList"
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
          v-if="tableHeaderList[0].isShow"
          :label="$t('admin.i18n.keySeqNo')"
          min-width="150"
          prop="keySeqNo"
        />
        <el-table-column v-if="tableHeaderList[1].isShow" prop="dataType" :label="$t('admin.i18n.dataType')" min-width="80">
          <template slot-scope="scope">
            <dict-write dict-type-id="I18nResourceType" :value="scope.row.dataType" />
          </template>
        </el-table-column>
        <el-table-column v-if="tableHeaderList[2].isShow" prop="locale" :label="$t('admin.i18n.locale')" min-width="80">
          <template slot-scope="scope">
            <dict-write dict-type-id="Language" :value="scope.row.locale" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableHeaderList[3].isShow"
          prop="nameI18n"
          :label="$t('admin.i18n.nameI18n')"
          min-width="140"
        />
      </el-table>
      <div class="pagination">
        <div class="select_header">
          <el-popover
            width="260"
            trigger="hover"
            placement="top-start"
          >
            <div class="check_box">
              <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                {{ $t('comm.selectAll') }}
              </el-checkbox>
              <div class="check_box_item">
                <el-checkbox v-for="value in tableHeaderList" :key="value.label" v-model="value.isShow" @change="handleItemChange">
                  {{ value.label }}
                </el-checkbox>
              </div>
            </div>
            <i slot="reference" class="el-icon-menu" />
          </el-popover>
        </div>
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
        :title="dialogType==='create'?$t('comm.newlyBuild'):$t('comm.edit')"
        :visible.sync="showDialog"
        width="80%"
        center
      >
        <div class="edit">
          <h5>{{ $t('comm.essentialInformation') }}</h5>
          <div class="input_box">
            <div class="flex3">
              <div class="title must">
                {{ $t('admin.i18n.keySeqNo') }}
              </div>
              <div class="input">
                <el-input v-model="dialogObj.keySeqNo" :placeholder="$t('admin.i18n.keySeqNo')" class="input" @blur="validator('keySeqNo')" />
                <span ref="keySeqNo" data-roles="required" :data-value="dialogObj.keySeqNo" class="message" />
              </div>
            </div>
            <div class="flex3">
              <div class="title must">
                {{ $t('admin.i18n.dataType') }}
              </div>
              <div class="input">
                <dict-select v-model="dialogObj.dataType" :clearable="false" class="input" dict-type-id="I18nResourceType" @change="(value)=>{validator('dataType',value)}" />
                <span ref="dataType" data-roles="required" :data-value="dialogObj.dataType" class="message" />
              </div>
            </div>
            <div class="flex3">
              <div class="title must">
                {{ $t('admin.i18n.locale') }}
              </div>
              <div class="input">
                <dict-select v-model="dialogObj.locale" :clearable="false" class="input" dict-type-id="Language" @change="(value)=>{validator('locale',value)}" />
                <span ref="locale" data-roles="required" :data-value="dialogObj.locale" class="message" />
              </div>
            </div>
            <div class="flex3">
              <div class="title">
                {{ $t('admin.i18n.nameI18n') }}
              </div>
              <div class="input">
                <el-input v-model="dialogObj.nameI18n" :placeholder="$t('admin.i18n.nameI18n')" class="input" @blur="validator('nameI18n')" />
                <span ref="nameI18n" data-roles="required" :data-value="dialogObj.nameI18n" class="message" />
              </div>
            </div>
          </div>
        </div>
        <span slot="footer">
          <!-- <el-button @click="dialogVisible = false">{{$t('comm.cancel')}}</el-button> -->
          <el-button type="primary" :disabled="!validatorState" @click="handleSave">{{ $t('comm.certain') }}</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      title="导入"
      :visible.sync="uploadDialog"
      width="400px"
      class="upload_zip"
    >
      <el-button type="primary" size="mini" @click="handleTemplateDownload">
        <!-- 模板下载 -->
        {{ $t('admin.dac.templateDownload') }}
      </el-button>
      <div class="box">
        <div slot="tip" class="el-upload__tip">
          <!-- 请用模板格式的xlsx文件进行上传 -->
          {{ $t('admin.dac.uploadMsg') }}
        </div>
        <upload action="/api/i18n/import" :on-success="handleUploadSuccess" :on-error="handleUploadError" :multiple="false" @finish="uploadDialog=false" />
        <!-- <upload action="/api/workflow/upload" :on-success="handleUploadSuccess" :on-error="handleUploadError" @finish="uploadDialog=false" /> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import { selectHeader } from '@/mixins/select-header.js'
import { getI18nList, deleteI18n, saveI18n, refreshI18n, exportI18n, downloadI18nTemplate } from '@/api/admin/i18n-api.js'
import DictSelect from '@/components/DictSelect'
import DictWrite from '@/components/DictWrite'
import { mapActions } from 'vuex'
import { formValidator } from '@/mixins/form-validator.js'
import Upload from '@/components/Upload'
export default {
  components: {
    DictSelect,
    DictWrite,
    Upload
  },
  mixins: [search, formValidator, selectHeader],
  data() {
    return {
      isLoading: true,
      activeNames: ['1'],
      dialogType: 'create',
      showDialog: false,
      i18nList: [],
      tableHeaderList: [
        { label: this.$t('admin.i18n.keySeqNo'), isShow: true },
        { label: this.$t('admin.i18n.dataType'), isShow: true },
        { label: this.$t('admin.i18n.locale'), isShow: true },
        { label: this.$t('admin.i18n.nameI18n'), isShow: true }
      ],
      uploadDialog: false,
      // 分页插件数据
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          keySeqNo: '',
          dataType: '',
          locale: ''
        }
      },
      dialogObj: {},
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getI18nList(this.searchParam)
      if (res && res.success) {
        const { results, pageNo, totalRecord } = res.datas.searchResult
        this.i18nList = results
        this.searchParam.pageNo = pageNo
        this.searchParam.totalRecord = totalRecord
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    isColunmShow(col) {
      if (this.showColumns.indexOf(col) >= 0) {
        return true
      } else {
        false
      }
    },
    handleCreate() {
      this.dialogObj = {}
      this.dialogType = 'create'
      this.showDialog = true
      this.validatorState = false
      this.$nextTick(function () {
        this.clearErrorMessage()
      })
    },
    handleEdit(rowData) {
      this.dialogObj = { ...rowData }
      this.dialogType = 'edit'
      this.showDialog = true
      this.validatorState = true
      this.$nextTick(function () {
        this.clearErrorMessage()
      })
    },
    handleDelete(rowData) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        deleteI18n([rowData]).then(() => {
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
          deleteI18n(this.multipleSelection).then(() => {
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
      saveI18n(this.dialogObj).then(() => {
        this.showDialog = false
        this.fetchData()
      })
    },
    handleRefresh() {
      this.$confirm(this.$t('comm.tip3'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async () => {
        await refreshI18n()
        this.loginInfoAction()
        this.refreshDictAndClearStore()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    handleExport() {
      exportI18n('xlsx', this.searchParam.params)
    },
    handleUploadSuccess(res, file, fileList) {
      // // console.log(res)
      // // console.log(file)
      // // console.log(fileList)
    },
    handleUploadError(res, file, fileList) {
      // // console.log(res)
      // // console.log(file)
      // // console.log(fileList)
    },
    handleTemplateDownload() {
      downloadI18nTemplate()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    ...mapActions([
      'loginInfoAction',
      'refreshDictAndClearStore'
    ])
  }
}
</script>
<style lang="scss" scoped>
.dict {
  .editDilog {
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
          background-image: linear-gradient(
            rgb(42, 155, 238),
            rgb(8, 142, 240)
          );
        }
      }
    }
  }
}
.pagination {
  position: relative;
  .select_header {
    position: absolute;
    top: 11px;
    left: 0;
  }
  .el-icon-menu {
    color: skyblue;
    font-size: 18px;
    cursor: pointer;
  }
  .check_box_item {
    padding-top: 15px;
    border-top: 1px solid #666;
  }
}
</style>
