<!--
 * @Descripttion:下发任务时如果包含灰名单中的账号，则提示确认弹框
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-05-18 14:11:10
 * @LastEditors: Qleo
 * @LastEditTime: 2022-06-23 19:07:21
-->
<template>
  <div>
    <a-modal
      title="下发任务提示"
      :visible="visible"
      :dialog-style="{ top: '40px' }"
      :confirm-loading="confirmLoading"
      :ok-text="'继续下发'"
      dialog-class="confirmDispose"
      width="1000px"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="tips">
        <span>共计{{ total }}条信息，</span>
        <span> 其中含{{ greyTable.length }}条灰名单账号信息 </span>
      </div>
      <div v-show="greyTable.length" class="table-title">
        <span class="title-name">灰名单：</span><span>{{ greyTable.length }}/{{ total }}</span>
      </div>
      <div class="greyTable">
        <div v-for="gray in greyTable" :key="gray.id" class="flex-center-v">
          <SubtaskTemplate :info="gray" />
        </div>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <a-button :style="{ marginRight: '8px' }" @click="handleCancel"> 取消 </a-button>
          <a-button v-show="greyTable.length < total" :style="{ marginRight: '8px' }" @click="handleOk('noGrey')">
            过滤灰名单下发
          </a-button>
          <a-button type="primary" @click="handleOk('all')"> 全部下发 </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import SubtaskTemplate from '@/components/task/SubtaskTemplate.vue'
export default {
  name: 'ConfirmDispose',
  components: {
    SubtaskTemplate
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      total: 0,
      whiteTable: [],
      greyTable: []
    }
  },
  methods: {
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
<style lang="less">
.confirmDispose {
  .tips {
    height: 30px;
    line-height: 30px;
    margin-bottom: 15px;
    text-align: center;
    background: #e7eeff;
    color: #333;
    border: 1px solid rgba(129, 174, 255, 1);
    .total {
      color: rgba(0, 0, 0, 0.85);
    }
    .warn {
      color: rgba(0, 0, 0, 0.85);
    }
    .error {
      color: red;
    }
  }
  .table-title {
    margin-bottom: 20px;
    font-size: 14px;
    .title-name {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.65);
      font-weight: 600;
    }
  }
  .whiteTable {
    margin-bottom: 20px;
  }
  .ant-modal-body {
    padding-bottom: 55px;
  }
  .drawer-footer {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right;
    z-index: 1;
  }
}
</style>
