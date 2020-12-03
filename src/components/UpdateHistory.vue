<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        placement="top"
        icon="el-icon-more"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.createTimeStr"
      >
        <el-card v-if="activity.historyList != null">
          <div
            v-for="(historyItem, itemIndex) in activity.historyList"
            :key="itemIndex"
            class="info-cont"
          >
            <h3 class="tit">
              {{ $t(historyItem.fieldName) }}
            </h3>
            <div class="det">
              <div class="new-txt">
                {{ $t('updateHistory.oldValueLabel') }} {{ historyItem.oldValue }}
              </div>
              <div class="old-txt">
                {{ $t('updateHistory.newValueLabel') }} {{ historyItem.newValue }}
              </div>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>

import { getHistoryList } from '@/api/base.js'

export default {

  props: {
    funcNo: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      isLoading: true,
      activities: []
    }
  },
  watch: {
    indentiferNum: 'fetchData'
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    fetchData: async function() {
      const indentiferNum = this.funcNo

      const res = await getHistoryList(indentiferNum)
      if (res && res.success) {
        const activitieList = res.datas.updateHistoryList
        if (activitieList != null) {
          activitieList.forEach((item) => {
            const msgId = 'updateHistory.' + item.updateType + 'Title'
            item.createTimeStr = this.$t(msgId, { 'time': item.createTimeStr, 'createBy': item.createBy })

            item.size = 'large'
            item.icon = 'el-icon-more'
            item.type = 'primary'
          })
        }
        this.activities = activitieList
      }
      this.isLoading = false
    }
  }
}
</script>

<style scoped>

.info-cont {
    border-bottom: 1px solid #c6e2df;
    margin-bottom: 10px;
}
.tit {
    color: #375694;
    padding-bottom: 5px;
    font-size: 14px;
    font-weight: normal;
    position: absolute;
    width: 130px;
    padding: 5px 0 10px 0px;
}
.det {
    padding: 5px 0 10px 130px;
    font-size: 12px;
    line-height: 1.3;
}
.det .new-txt {
    color: #888888;
    padding: 5px 0;
    word-break: break-all;
}
.det .old-txt {
    padding: 5px 0;
    color: #53c6ea;
    word-break: break-all;
}
</style>
