<template>
  <div class="online">
    <h3>{{ $t('admin.onlineUser.onlineUser') }}</h3>
    <div>
      <el-table ref="table" v-loading="isLoading" :data="onlineUsers" border stripe style="width: 100%; margin: 5px;">
        <el-table-column label="SessionID" prop="sessionId" />
        <el-table-column prop="userId" :label="$t('admin.onlineUser.userId')" />
        <el-table-column prop="nickName" :label="$t('admin.onlineUser.nickName')" />
        <el-table-column prop="loginTime" :label="$t('admin.onlineUser.loginTime')" />
        <el-table-column prop="lastAccsessTime" :label="$t('admin.onlineUser.lastAccsessTime')" />
        <el-table-column prop="loginIp" :label="$t('admin.onlineUser.loginIp')" />
        <el-table-column :label="$t('comm.operation')">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click.prevent="handleLogoutClick(scope.row.sessionId)">
              {{ $t('admin.onlineUser.offline') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { onlineUsers, kickOut } from '@/api/admin/online-user-api.js'

export default {
  name: 'OnlineUsers',
  data: function() {
    return {
      isLoading: true,
      onlineUsers: []
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await onlineUsers()
      if (res && res.success) {
        this.onlineUsers = res.datas.onlineUserList
      }
      this.tableDolayout(this.$refs['table'])
      this.isLoading = false
    },
    handleLogoutClick(sessionId) {
      this.$confirm(this.$t('comm.tip6'), this.$t('comm.tips'), {
        confirmButtonText: this.$t('comm.certain'),
        cancelButtonText: this.$t('comm.cancel'),
        type: 'warning'
      }).then(async() => {
        const param = { sessionId }
        const res = await kickOut(param)
        if (res && res.success) {
          this.fetchData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('comm.msg1')
        })
      })
    },
    // 出现纵向滚动条时，防止表头行错位
    tableDolayout(refTable) {
      setTimeout(() => {
        if (refTable) refTable.doLayout()
      },
      1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.online {
  background-color: #fff;
  padding: 20px;
  border-radius: 6px;
  h3 {
    height: 35px;
    line-height: 35px;
    font-size: 18px;
    color: rgb(50, 50, 50);
    border-bottom: 1px dashed #ccc;
    margin-bottom: 10px;
    position: relative;
  }
  a {
    text-decoration:underline;
    cursor:pointer;
    color:rgb(120, 165, 241);
  }
}

</style>
