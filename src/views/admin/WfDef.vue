<template>
  <div class="definition">
    <div class="search">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <span slot="title" class="collapse-title">{{ $t('comm.queryCriteria') }}</span>
          <div class="mode input_box">
            <div class="flex3">
              <div class="title">
                <!-- 流程定义ID: -->
                {{ $t('admin.wfDef.processDefinitionId') }}
              </div>
              <el-input v-model="searchParam.params.defId" class="input" :placeholder="$t('admin.wfDef.processDefinitionId')" clearable />
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 流程定义key: -->
                {{ $t('admin.wfDef.processDefinitionKey') }}
              </div>
              <el-input v-model="searchParam.params.key" class="input" :placeholder="$t('admin.wfDef.processDefinitionKey')" clearable />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="btns">
        <div class="left">
          <el-button type="primary" class="el-icon-upload" @click="uploadZipDialog = true">
            <!-- ZIP发布 -->
            {{ $t('admin.wfDef.zipRelease') }}
          </el-button>
          <el-button type="primary" class="el-icon-upload" @click="uploadOneDialog = true">
            <!-- 单个发布 -->
            {{ $t('admin.wfDef.oneRelease') }}
          </el-button>
          <!-- <el-button type="danger" class="el-icon-delete">
            批量删除
          </el-button>
          <el-button type="primary" class="el-icon-refresh" plain>
             刷新
          </el-button> -->
        </div>
        <div class="right">
          <el-button type="success" class="el-icon-search" @click="search">
            <!-- 查询 -->
            {{ $t('comm.query') }}
          </el-button>
          <el-button class="el-icon-refresh-left" type="info">
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
        :data="tableData"
        border
        height="579"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          :label="$t('comm.operation')"
          width="80"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleStart(scope.row, scope.$index)">
              <!-- 启动 -->
              {{ $t('admin.wfDef.startUp') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          :label="$t('admin.wfDef.processDefinitionId')"
          min-width="180"
        >
          <template slot-scope="scope">
            <a class="link" @click.prevent="handleShowPic(scope.row.id)">{{ scope.row.id }}</a>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="category"
          label="种类"
        /> -->
        <el-table-column
          prop="name"
          :label="$t('admin.wfDef.name')"
          min-width="100"
        />
        <el-table-column
          prop="key"
          :label="$t('admin.wfDef.processDefinitionKey')"
          min-width="100"
        />
        <el-table-column
          prop="description"
          :label="$t('admin.wfDef.des')"
          show-overflow-tooltip
          min-width="100"
        />
        <el-table-column
          prop="version"
          :label="$t('admin.wfDef.version')"
          width="100"
        />
        <el-table-column
          prop="deploymentId"
          :label="$t('admin.wfDef.deploymentId')"
          width="100"
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
    <el-dialog
      :title="$t('admin.wfDef.zipRelease')"
      :visible.sync="uploadZipDialog"
      width="400px"
      class="upload_zip"
    >
      <div class="content">
        <div slot="tip" class="el-upload__tip">
          <!-- 请选择一个zip文件上传 -->
          {{ $t('admin.wfDef.tip1') }}
        </div>
        <upload action="/api/workflow/admin/uploadZip" :on-success="handleUploadSuccess" :on-error="handleUploadError" :multiple="false" @finish="uploadOneDialog=false" />
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('admin.wfDef.oneRelease')"
      :visible.sync="uploadOneDialog"
      width="400px"
      class="upload_zip"
    >
      <div class="box">
        <div slot="tip" class="el-upload__tip">
          <!-- 请将流程定义文件和图片一起上传 -->
          {{ $t('admin.wfDef.tip2') }}
        </div>
        <upload action="/api/workflow/upload" :on-success="handleUploadSuccess" :on-error="handleUploadError" :multiple="true" @finish="uploadOneDialog=false" />
      </div>
    </el-dialog>
    <div class="startDialog">
      <el-dialog
        :title="$t('admin.wfDef.startUp')"
        :visible.sync="startDialog"
        width="80%"
      >
        <div class="">
          <h5>{{ $t('admin.wfDef.processStartValue') }}</h5>
          <div class="input_box">
            <div class="flex3">
              <div class="title">
                <!-- 流程Key -->
                {{ $t('admin.wfDef.processKey') }}
              </div>
              <div class="input">
                <el-input v-model="processData.processKey" class="input" readonly="readonly" />
              </div>
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 业务Key -->
                {{ $t('admin.wfDef.businessKey') }}
              </div>
              <div class="input">
                <el-input v-model="processData.businessKey" class="input" />
              </div>
            </div>
            <div class="flex3">
              <div class="title">
                <!-- 流程名称 -->
                {{ $t('admin.wfDef.processName') }}
              </div>
              <el-input v-model="processData.processName" class="input" />
            </div>
          </div>
        </div>
        <br>
        <h5>
          <!-- 流程变量一览  -->
          {{ $t('admin.wfDef.processVariable') }}
          <div class="add_row iconfont icon-jia" @click.stop="handleAddTableRows">
            <!-- 增加变量 -->
            {{ $t('admin.wfDef.addVariable') }}
          </div>
        </h5>
        <div class="table">
          <el-table
            :data="variableTable"
            border
            height="200"
            style="width: 100%"
          >
            <el-table-column>
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDeleteRow(scope.row, scope.$index)" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin.wfDef.variableName')" width="450">
              <template slot-scope="scope">
                <el-input v-model="scope.row.key" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin.wfDef.variableValue')" width="450">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="startDialog = false">{{ $t('comm.cancel') }}</el-button>
          <el-button type="primary" @click="startInst">{{ $t('comm.submit') }}</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      :title="$t('admin.wfDef.processPhoto') + defId"
      :visible.sync="defPicDialog"
    >
      <div>
        <el-image
          id="pic"
          :src="picUrl"
          width="100%"
          fit="contain"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { search } from '@/mixins/search-params'
import { formValidator } from '@/mixins/form-validator.js'
import { getDefList, createProcessInst } from '@/api/admin/workflow-api.js'
import Upload from '@/components/Upload'
export default {
  components: {
    Upload
  },
  mixins: [search, formValidator],
  data() {
    return {
      isLoading: true,
      activeNames: ['1'],
      tableData: [],
      searchParam: {
        paging: true,
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页条数
        totalRecord: null, // 总条数
        params: {
          defId: '',
          key: ''
        }
      },
      processData: {},
      variableTable: [],
      uploadZipDialog: false,
      uploadOneDialog: false,
      startDialog: false,
      defPicDialog: false,
      defId: '',
      picUrl: '',
      activeName: 'first'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getDefList(this.searchParam)
      if (res && res.success) {
        const { results, pageNo, totalRecord } = res.datas.result
        this.tableData = results
        this.searchParam.pageNo = pageNo
        this.searchParam.totalRecord = totalRecord
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    resetTable(params) {
      for (var i in params) {
        params[i] = ''
      }
    },
    handleStart(data, index) {
      this.resetTable(this.processData)
      this.variableTable = []
      this.processData.processKey = data.key
      this.startDialog = true
    },
    startInst() {
      this.processData.variables = this.variableTable
      createProcessInst(this.processData).then(res => {
        if (res && res.success) {
          this.startDialog = false
        }
      })
    },
    handleAddTableRows() {
      const newRow = {
        key: '',
        value: ''
      }
      this.variableTable = [...this.variableTable, newRow]
    },
    handleDeleteRow(data, index) {
      this.$confirm(this.$t('comm.tip1'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(() => {
        this.variableTable.splice(index, 1)
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
    handleShowPic(id) {
      const dateTime = new Date().getTime()
      this.defId = id
      this.picUrl = `/api/workflow/admin/showPic/${id}?${dateTime}`
      this.defPicDialog = true
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
    }
  }
}
</script>
<style lang="scss" scoped>
.definition {
  .upload_zip {
    .content {
      width: 350px;
      margin: 0 auto;
    }
  }
}
.add_row {
  position: absolute;
  right: 25px;
  bottom: 300px;
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
</style>
