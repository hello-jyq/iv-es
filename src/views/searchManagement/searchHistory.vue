<template>
  <div class="container">
    <div class="sh_search_box">
      <div class="search_top">
        <div>
          <span> 搜索内容</span>
          <el-input v-model="search.searchContent" placeholder="请输入搜索时的搜索条件" />
        </div>
        <div>
          <span> 搜索结果</span>
          <el-input v-model="search.searchResult" placeholder="请输入搜索结果" />
        </div>
      </div>
      <div class="search_bottom">
        <div>
          <span>搜索时间</span>
          <el-date-picker
            v-model="search.searchTime"
            class="diy_time"
            popper-class="date_picker"
            value-format="yyyy-MM-dd"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
        <div><button @click="searchHistory(search)">检索</button></div>
      </div>
    </div>
    <div class="sh_search_main">
      2
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      search: {
        searchContent: '',
        searchResult: '',
        searchTime: ''
      }
    }
  },
  methods: {
    searchHistory(obj) {
      console.log(obj)
    }
  }

}
</script>
<style scoped>
.sh_search_box {
  height: 200px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  border-radius: 16px;
  padding: 40px 30px 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.sh_search_main {
  margin-top: 20px;
  flex: 1;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(68, 100, 163, 0.1);
  border-radius: 16px;
  padding: 30px 30px 25px;
  box-sizing: border-box;
}
.search_top,
.search_bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
.search_top span,
.search_bottom span {
  min-width: 60px;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  margin-right: 20px;
}
.search_top div,
.search_bottom div {
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
}
.search_bottom div:first-child {
  margin-right: 95px;
}
.search_bottom div:last-child {
  justify-content: flex-end;
}
.search_bottom button {
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
</style>
