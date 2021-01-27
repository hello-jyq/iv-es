<template>
  <div v-show="isShow" class="set_bg">
    <div class="set_box">
      <div class="title">
        <div>设置</div>
        <span><i class="el-icon-close" @click="closedialog()" /></span>
      </div>
      <div class="set_main">
        <div class="set_menu">
          <ul>
            <li v-for="(item,index) in menu" :key="index" :class="menuActive==index?'menuActive':''" @click="menuActive=index,overscroll=true,goTop(index)">
              <i :class="item.icon" />{{ item.name }}
            </li>
          </ul>
        </div>
        <div class="set_content" :class="overscroll?'overscroll':''">
          <div id="set_1" class="set_content_item">
            <label>设置默认搜索方式</label>
            <div class="set_content_item_box">
              <span>
                <el-radio v-model="searchType" label="1">
                  完全一致
                </el-radio>
                <el-radio v-model="searchType" label="2">
                  部分一致
                </el-radio>
              </span>
              <button>保&nbsp;存</button>
            </div>
          </div>
          <div id="set_2" class="set_content_item">
            <label>设置登陆默认组织</label>
            <div class="set_content_item_box">
              <span>
                <el-radio v-model="defaultOrg" label="1">
                  组织1
                </el-radio>
                <el-radio v-model="defaultOrg" label="2">
                  组织2
                </el-radio>
                <el-radio v-model="defaultOrg" label="3">
                  组织3
                </el-radio>
              </span>
              <button>保&nbsp;存</button>
            </div>
          </div>
          <div id="set_3" class="set_content_item">
            <label>设置默认搜索位置</label>
            <div class="set_content_item_box">
              <span>
                <el-radio v-model="searchPosition" label="1">
                  不限
                </el-radio>
                <el-radio v-model="searchPosition" label="2">
                  文件名
                </el-radio>
                <el-radio v-model="searchPosition" label="3">
                  文件内容
                </el-radio>
              </span>
              <button>保&nbsp;存</button>
            </div>
          </div>
          <div id="set_4" class="set_content_item">
            <label>设置登录密码</label>
            <div class="set_content_item_box_auto">
              <div class="set_items">
                <div class="set_items_title">
                  旧密码
                </div>
                <div class="set_items_input">
                  <el-input v-model="oldPassword" placeholder="请输入您的旧密码" />
                </div>
              </div>
              <div class="set_items">
                <div class="set_items_title">
                  新密码
                </div>
                <div class="set_items_input">
                  <el-input v-model="newPassword" placeholder="请输入您的新密码" />
                </div>
              </div>
              <div class="set_items">
                <div class="set_items_title">
                  确认密码
                </div>
                <div class="set_items_input">
                  <el-input v-model="surePassword" placeholder="请再次输入您的密码" />
                </div>
              </div>
              <button>保&nbsp;存</button>
            </div>
          </div>
          <div id="set_5" class="set_content_item">
            <label>设置删除联想词</label>
            <div class="set_content_item_box_auto">
              <div>
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                  全选
                </el-checkbox>
                <button class="set_button">
                  删&nbsp;除
                </button>
              </div>
              <div class="beetween_line" />
              <el-checkbox-group v-model="Wordschecked" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="item in associatedWords" :key="item" :label="item">
                  {{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div id="set_6" class="set_content_item">
            <label>清空搜索履历</label>
            <div class="set_content_item_box">
              <span><i class="iconfont icon-jinggao" />清空所有的所搜履历</span>
              <button>
                删&nbsp;除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuActive: 0,
      isVisible: this.isShow,
      overscroll: false,
      menu: [
        { icon: 'iconfont icon-sousuowenjian', name: '设置默认搜索方式' },
        { icon: 'iconfont icon-zuzhiDataOrganization6', name: '设置登陆默认组织' },
        { icon: 'iconfont icon-zhidingweizhi', name: '设置默认搜索位置' },
        { icon: 'iconfont icon-mima', name: '设置登录密码' },
        { icon: 'iconfont icon-shanchu1', name: '设置删除联想词' },
        { icon: 'iconfont icon-qingkongbeifen', name: '清空搜索履历' }
      ],
      searchType: '1',
      defaultOrg: '1',
      searchPosition: '1',
      oldPassword: '',
      newPassword: '',
      surePassword: '',
      Wordschecked: [],
      checkAll: false,
      associatedWords: ['neuron設計書', '導入 neuron', 'neuron導入5', 'neuron営業資', 'active directory neuron', 'elasticsearch neuron7', 'active direc1tory neuron', 'active directory neuron ', 'neuron設1計書', 'neuron導入', '導2入 neuron', 'elasticsearch neuron2', 'elasticsearch neuron'],
      isIndeterminate: false
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.Wordschecked = val ? this.associatedWords : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.associatedWords.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.associatedWords.length
    },
    closedialog() {
      //   this.isShow = false
      this.$emit('onClose', this.isVisible)
    },
    goTop(index) {
      document.querySelector('#set_' + (index + 1)).scrollIntoView(true)
    }
  }
}
</script>
<style scoped>
.set_bg {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #ffffff;
}
.set_box {
  width: 100%;
  height: 100%;
  padding: 30px 0px 40px 40px;
  display: flex;
  flex-direction: column;
}
.title {
  width: 100%;
  height: 40px;
  padding-left: 30px;
  padding-right: 40px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-family: "微软雅黑";
  font-weight: bold;
  color: #333333;
  line-height: 60px;
  margin-bottom: 20px;
}
.title span {
  height: 20px;
  line-height: 20px;
  margin-top: -10px;
}
.title span i {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
.set_main {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: left;
}
.set_menu {
  width: 330px;
  height: calc(100vh - 130px);
  border-radius: 16px;
  border: 1px solid #cccccc;
}
.set_content {
  flex: 1;
  width: 100%;
  height: calc(100vh - 90px);
  margin-left: 32px;
  overflow-y: auto;
  padding-right: 40px;
}
.set_menu ul {
  width: 100%;
  height: 100%;
  padding: 30px;
}
.set_menu ul li {
  height: 20px;
  display: flex;
  justify-content: left;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #333333;
  line-height: 20px;
  margin-bottom: 40px;
  cursor: pointer;
}
.set_menu ul li i {
  margin-right: 20px;
}

.set_content_item {
  width: 100%;
  margin-bottom: 40px;
}
.set_content_item > label {
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bold;
  color: #333333;
  line-height: 20px;
}
.set_content_item_box {
  width: 100%;
  height: 80px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #cccccc;
  margin-top: 20px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.set_content_item_box label {
  margin-right: 50px;
}
.set_content_item_box_auto {
  width: 100%;
  height: auto;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #cccccc;
  margin-top: 20px;
  padding: 30px;
  display: inline-block;
}

.menuActive {
  color: #2d7a9c !important;
}
.set_content_item button {
  width: 160px;
  height: 40px;
  background: linear-gradient(180deg, #475ba0 0%, #2fa5bb 100%);
  border-radius: 20px;
  border: 0;
  font-size: 16px;
  font-family: "微软雅黑";
  color: #ffffff;
  cursor: pointer;
  float: right;
}
.set_items {
  height: auto;
  width: 100%;
  margin-bottom: 30px;
  border-bottom: 1px solid #eeeeee;
}
.set_items_title {
  height: 18px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: 400;
  color: #333333;
  line-height: 18px;
}
.beetween_line {
  width: 100%;
  height: 1px;
  background: #eeeeee;
  margin-bottom: 30px;
}
.set_content_item_box span {
  height: 18px;
  font-size: 16px;
  font-family: "微软雅黑";
  font-weight: 400;
  color: #333333;
  line-height: 18px;
}
.set_content_item_box span i {
  color: #ff9200;
  font-size: 20px;
  margin-right: 5px;
}
.set_button {
  margin-top: -10px;
}
.overscroll {
  padding-bottom: 685px;
}
</style>
