<template>
  <div class="container">
    <div class="perLabel_search_box">
      <el-input v-model="labelValue" placeholder="添加你的个人标签内容" clearable>
        <template slot="append">
          <el-button slot="suffix" @click="search">
            添加标签
          </el-button>
        </template>
      </el-input>
    </div>
    <div class="perLabel_main_box">
      <div class="recommend_label">
        <div class="recommend_label_title">
          <span>你可能感兴趣的标签：</span>
          <span class="refresh" @click="refreshLabel"><i class="iconfont icon-refresh" />换一换</span>
        </div>
        <ul>
          <li v-for="list in recommendList" :key="list.index" @click="addInterestLabel(list)">
            <i class="iconfont icon-tianjia" />{{ list }}
          </li>
        </ul>
      </div>
      <div class="person_label">
        <div class="person_label_title">
          <span>你已有的标签：</span>
          <span class="fontC_999">（可点选单个或多个已有的标签进行标签搜索）</span>
        </div>
        <ul>
          <li v-for="list in personLabelList" :key="list.index">
            <div class="label" :class="searchLabel.includes(list)?'person_label_select':''" @click="addSearchLabel(list)">
              <i class="iconfont icon-label" />{{ list }}
            </div>
            <i class="iconfont icon-guanbi" @click="deleteLabel(list)" />
          </li>
        </ul>
        <div class="btn_label_search">
          <button type="primary" @click="labelSearch()">
            标签搜索
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      labelValue: '',
      recommendList: ['电子合同合合', '电子合44同', '电子44合同', '电子合44同', '电子合同', '电子合合合同', '电子合合合同', '电子44合同', '电子合44同', '电子合同', '电子合合合同', '电子合合合同', '电子44合同', '电子合44同', '电子合同', '电子合同', '电子合同', '电子合同', '电子合同', '电子合同', '电子合同', '电子合同', '电子合同', '电子合同', '电子合同'],
      personLabelList: ['电子商务1', '网络推广2', '网络推广3', '网络推广4', '网络合同推广', '网络推9广', '网络推广7', '网合同络11推广', '网络22推广', '网44络推广', '网络33推广', '网络推广0', '网络推66广', '网77络推广', '网99络推广'],
      searchLabel: []
    }
  },
  methods: {
    // 新建标签
    search() {
      console.log(this.labelValue)
      this.personLabelList.unshift(this.labelValue)
    },
    // 添加推荐标签
    addInterestLabel(value) {
      console.log(value)
      this.personLabelList.unshift(value)
    },
    // 换一换推荐标签
    refreshLabel() {
      this.recommendList.sort(() => Math.random() - 0.5)
    },
    // 添加搜索标签
    addSearchLabel(value) {
      console.log(value)
      if (this.searchLabel.includes(value)) {
        this.searchLabel.splice(this.searchLabel.indexOf(value), 1)
      } else {
        this.searchLabel.push(value)
      }
    },
    // 删除标签
    deleteLabel(value) {
      console.log(value)
      this.personLabelList.splice(this.personLabelList.indexOf(value), 1)
    },
    // 搜索标签
    labelSearch() {
      console.log(this.searchLabel)
    }
  }
}
</script>
<style scoped>
.perLabel_search_box {
  width: 100%;
  height: 130px;
  padding: 40px 30px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  border-radius: 16px;
}
.perLabel_main_box {
  flex: 1;
  width: 100%;
  height: auto;
  margin-top: 20px;
  display: flex;
}
.recommend_label {
  width: 420px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  border-radius: 16px;
  padding: 30px 10px;
  height: calc(100vh - 235px);
  overflow: hidden;
}
.person_label {
  flex: 1;
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  border-radius: 16px;
  margin-left: 20px;
  height: calc(100vh - 235px);
  overflow: hidden;
  padding: 30px;
  padding-right: 0;
  position: relative;
}
.recommend_label_title {
  width: 100%;
  height: 18px;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #333333;
  padding: 0 20px;
  line-height: 18px;
  display: flex;
  justify-content: space-between;
}
.person_label_title {
  width: 100%;
  height: 18px;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 18px;
}
.refresh {
  font-weight: 400;
  color: #999999;
  cursor: pointer;
}
.refresh i {
  margin-right: 10px;
}
.recommend_label ul,
.person_label ul {
  height: 100%;
  overflow: auto;
}
.recommend_label ul li i {
  margin-right: 6px;
  color: #2d7a9c;
  cursor: pointer;
}
.recommend_label ul li {
  min-width: 90px;
  max-width: 120px;
  height: 18px;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 18px;
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 20px;
  float: left;
  user-select: none;
}
.person_label ul li {
  width: 120px;
  height: 24px;
  margin-top: 30px;
  margin-right: 35px;
  float: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.person_label ul li .label {
  width: 100px;
  height: 24px;
  border-radius: 12px;
  font-size: 14px;
  font-family: "微软雅黑";
  text-align: center;
  padding: 0 7px;
  color: #999999;
  background: #ffffff;
  border: 1px solid #cccccc;
  line-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
/* .person_label ul li .label:hover {
  border-color: #2d7a9c;
} */
.person_label ul li .icon-label {
  color: #999999;
  font-size: 14px;
}
.person_label ul li .icon-guanbi {
  font-size: 18px;
  color: #f73031;
  cursor: pointer;
}
.btn_label_search {
  width: 100%;
  height: 50px;
  position: absolute;
  top: 57%;
  left: 0;
  text-align: center;
}
.btn_label_search button {
  width: 160px;
  height: 50px;
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%);
  border-radius: 25px;
  border: 0;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #ffffff;
  cursor: pointer;
}
.person_label_select {
  background: #2d7a9c !important;
  color: #ffffff !important;
}
.person_label_select .icon-label {
  color: #ffffff !important;
}
</style>
