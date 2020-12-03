<template>
  <div :class="theme=='Light'?'no-search-content-box advice-apply-edit adaE-light':'no-search-content-box advice-apply-edit'">
    <div class="table-bg-box marigin-bottom">
      <div class="advice-edit-table-title justify-content-flex">
        <span>设定各个ES角色</span>
      </div>

      <el-form label-width="110px" label-position="left" class="content-top-form form-big-lable">
        <el-row type="flex" justify="space-between">
          <el-col :span="7">
            <el-form-item label="ES访问角色" prop="info" class="big-input">
              <el-select v-model="roleId" style="width:100%" placeholder="请选择" :popper-class="theme=='Light'?'blueSelect':''">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="height:500px">
          <el-scrollbar>
            <!-- :allow-drop="allowDrop" :allow-drag="allowDrag"   @node-drop="allowNodeDrop"  @node-click="selectNode"  @node-contextmenu="operation" -->
            <el-tree
              :data="data"
              node-key="id"
              :expand-on-click-node="true"
              :default-expanded-keys="expandedKeys"
            >
              <template slot-scope="scope">
                <div class="custom-tree-node">
                  <div class="tree_item tree-confirm-item">
                    <span v-if="scope.data.id !== 50" class="iconfont" :class="scope.data.children || scope.data.type === 'org' ? 'icon-bumenguanli_h' : 'icon-Avatar'" />
                    <span v-else class="iconfont icon-zuzhijiagou" />
                    <span>{{ scope.data.text }}</span>
                  </div>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </el-row>
      </el-form>
    </div>

    <ul class="operation-box dialog-btn-box">
      <li class="operation-item">
        <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconbaocun" /></span>
        <span class="operation-text">保&nbsp;存</span>
      </li>
      <li class="operation-item">
        <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont icontijiao" /></span>
        <span class="operation-text">删&nbsp;除</span>
      </li>
      <li class="operation-item" @click="onCancel()">
        <span class="operation-circle circle-middle-btn btn-light-color bluebg"><i class="iconfont iconquxiao" /></span>
        <span class="operation-text">取&nbsp;消</span>
      </li>
    </ul>
  </div>
</template>
<script>

import { getAllOrgAndUserTree } from '@/api/admin/org-api.js'

export default {

  data() {
    return {
      theme: localStorage.getItem('theme') !== 'Dark' ? 'Light' : '',

      options: [{
        value: '0',
        label: '有保修'
      }, {
        value: '1',
        label: '无保修'
      }],
      roleId: '',
      expandedKeys: [],
      data: [],
      validYear: '2020'
    }
  },
  mounted() {
    this.searchTree()
  },
  methods: {
    async searchTree() {
      const res = await getAllOrgAndUserTree(this.validYear)
      if (res && res.success) {
        this.data = res.datas.result
        // 默认展开第一级
        if (this.data) {
          this.expandedKeys = this.data.map(item => item.id)
        }
        this.data.unshift({ id: 50, text: this.validYear + '年度机构人员树' })
      }
    },
    onCancel() {
      this.$router.push({ path: '/ada/list' })
    }

  }
}
</script>
<style lang="scss">
.advice-apply-edit {
  .advice-edit-title {
    margin-top: 10px;
    margin-bottom: 20px;
    font-family: "微软雅黑";
    font-size: 22px;
    font-weight: bold;
    color: #ffffff;
  }
  .table-bg-box {
    background: linear-gradient(180deg, #34393f 0%, #22252a 100%);
    .el-form-item {
      margin-bottom: 30px;
    }
    .upload-demo {
      display: flex;
      height: 38px;
      border-radius: 4px;
    }
    .advice-edit-table {
      margin-bottom: 38px;
    }
  }
  .state-status {
    position: relative;
  }
  .advice-help {
    position: absolute;
    top: 0px;
    right: 35px;
    i {
      font-size: 16px;
    }
  }
  .dialog-btn-box {
    justify-content: flex-start;
    margin-top: 30px;
    margin-bottom: 50px;
  }
  .operation-text span {
    max-width: 300px;
  }
}
</style>
<style lang="scss">
.advice-apply-edit {
  .el-icon-date {
    display: none;
  }
  .col-right {
    padding-right: 110px;
  }
  .el-upload--text {
    width: 120px;
    height: 38px;
    margin-left: -27px;
    background: linear-gradient(180deg, #2f343a 0%, #1e2225 100%);
    box-shadow: -2px -2px 15px 2px rgba(255, 255, 255, 0.2),
      0px 2px 10px 6px rgba(20, 22, 26, 1);
    border-radius: 24px;
    border: 1px solid #1d2226;
    & > div {
      font-size: 14px;
      color: #00e2de;
      .iconshangchuan {
        color: #00e2de;
        margin-right: 4px;
      }
    }
  }
  .el-upload-list {
    display: flex;
    align-items: center;
    padding-left: 30px;
    .el-upload-list__item {
      margin-top: 0 !important;
    }
    .el-icon-document {
      display: none;
    }
    .el-upload-list__item-name {
      margin-right: 10px;
      color: #52b3ff;
      text-decoration: underline;
    }
    .el-upload-list__item-status-label {
      display: none;
    }
    .el-upload-list__item:hover {
      background-color: transparent;
    }
    .el-icon-close {
      display: none;
    }
    .el-upload-list__item.is-success .el-upload-list__item-name:focus,
    .el-upload-list__item.is-success .el-upload-list__item-name:hover {
      color: #ffffff;
    }
  }
}
.advice-info-help {
  width: 100px;
  min-width: auto;
  height: 30px;
  line-height: 30px;
  padding: 0;
  text-align: center;
  font-size: 12px;
  color: #ffffff;
}

.advice-apply-edit {
  .handsontable {
    height: 100%;
  }
  .handsontable table,
  .handsontable tbody,
  .handsontable thead,
  .handsontable td,
  .handsontable th,
  .handsontable input,
  .handsontable textarea,
  .handsontable div {
    box-sizing: border-box;
  }
  .handsontable td,
  .handsontable th {
    padding: 0 5px;
  }
  .handsontable .wtSpreader {
    min-width: 100%;
  }
  .handsontable tr:first-child th {
    height: 50px !important;
    line-height: 50px;
    font-family: "微软雅黑";
    font-size: 16px;
    color: #ffffff;
    background-color: #26272c;
  }
  .handsontable thead th .relative {
    padding: 0 4px;
  }
  .ht_clone_top,
  .wtHolder,
  .htCore {
    width: 100% !important;
    overflow: hidden;
  }
  .wtHider {
    width: 100% !important;
  }

  .handsontable tr td:first-child {
    color: #ffffff !important;
  }
  .handsontable th:last-child {
    border-right: 1px solid #44474e;
    border-bottom: 1px solid #44474e;
  }
  .handsontable tr td {
    font-family: "微软雅黑";
    font-size: 14px;
    color: #dddddd;
    text-align: center;
    border-right: 1px solid #44474e;
    border-bottom: 1px solid #44474e;
  }
  .handsontable tr td:hover {
    border: 1px solid #0ab09c !important;
  }
  .handsontable th {
    border-right-color: #44474e;
    border-bottom-color: #44474e;
  }
  .handsontable tr:first-child th,
  .handsontable tr:first-child td {
    border-top: 1px solid #44474e;
  }
  .ht_clone_top_left_corner thead tr th:nth-last-child(2) {
    border-right: 0;
  }

  .ht_master .wtHolder {
    width: 100% !important;
    height: 100% !important;
  }
  .handsontable thead th.ht__highlight,
  .handsontable th:first-child,
  .handsontable th:nth-child(2),
  .handsontable td:first-of-type,
  .handsontable .htNoFrame + th,
  .handsontable .htNoFrame + td {
    border-left-color: #44474e;
  }

  .handsontable tbody th.ht__highlight,
  .handsontable th,
  .handsontable td,
  .handsontable tr {
    background: transparent;
  }
  .handsontable tbody tr:nth-child(odd) {
    background-color: #34393f;
  }
  .handsontable tbody tr:nth-child(even) {
    background-color: #26272c;
  }
  .handsontableInput {
    box-shadow: none;
    white-space: nowrap;
    background: #26272c;
    color: #ffffff;
    margin-top: 2px;
    margin-left: 1px;
    width: calc(49% + 8px) !important;
  }
  .handsontable td.area:before,
  .handsontable td.area-1:before,
  .handsontable td.area-2:before,
  .handsontable td.area-3:before,
  .handsontable td.area-4:before,
  .handsontable td.area-5:before,
  .handsontable td.area-6:before,
  .handsontable td.area-7:before {
    background: transparent;
  }
  .wtBorder,
  .area {
    background-color: transparent !important;
  }
  .money-right {
    text-align: right;
  }
}
</style>
