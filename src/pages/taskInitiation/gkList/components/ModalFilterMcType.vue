<!--
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-06-30 17:52:21
 * @LastEditors: Qleo
 * @LastEditTime: 2022-12-23 18:43:32
-->
<template>
  <a-modal
    :visible="value"
    class="ModalFilterMcType"
    title="下发任务提示"
    width="1100px"
    :after-close="afterClose"
    :mask-closable="false"
    label-align="left"
    @cancel="afterClose"
    @ok="handleOk"
  >
    <div class="tips-box">
      单次任务仅支持一种管控对象，您本次选择了 {{ mcObjectList.length }} 种，请选择 1 种管控对象进行处置
    </div>
    <div class="title">管控对象</div>
    <div class="mcObject-wrap">
      <div
        v-for="item in mcObjectList"
        :key="item.mcObjectCode"
        class="mcObject flex-center-v"
        @click="checkedMcObjectCode = item.mcObjectCode"
      >
        <a-radio
          :checked="checkedMcObjectCode === item.mcObjectCode"
          :value="item.mcObjectCode"
          @change="checkedMcObjectCode = item.mcObjectCode"
        >
          {{ item.mcObjectName }}（{{ item.list.length }}）
        </a-radio>
      </div>
    </div>
  </a-modal>
</template>
<script>
export default {
  name: 'ModalFilterMcType',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      },
    },
    subtaskList: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      checkedMcObjectCode: '',
    }
  },
  computed: {
    mcObjectList() {
      const obj = {}
      const arr = []
      if (this.subtaskList.length) {
        this.subtaskList.forEach(item => {
          if (!obj[item.mcObjectCode]) {
            obj[item.mcObjectCode] = [item]
          } else {
            obj[item.mcObjectCode].push(item)
          }
        })
      }
      Object.values(obj).forEach(item => {
        arr.push({
          mcObjectCode: item[0].mcObjectCode,
          mcObjectName: item[0].mcObjectName,
          list: item,
        })
      })
      return arr
    },
  },
  mounted() {},
  methods: {
    handleOk() {
      if (!this.checkedMcObjectCode) {
        this.$message.warning('请选择 1 种管控对象进行处置')
        return
      }
      const list = this.mcObjectList.find(item => item.mcObjectCode === this.checkedMcObjectCode).list
      this.$emit('handleOk', list)
      this.$emit('input', false)
    },
    afterClose() {
      this.checkedMcObjectCode = ''
      this.$emit('input', false)
    },
  },
}
</script>
<style lang="less" scoped>
.ModalFilterMcType {
  .ant-modal-title {
    position: relative;
    margin-left: 25px;
  }
  .ant-modal-title:before {
    content: ' ';
    position: absolute;
    background-image: url(../../../../assets/imgs/taskInitiation/background.svg);
    top: -1px;
    width: 25px;
    height: 25px;
    left: -30px;
  }
  .tips-box {
    height: 30px;
    line-height: 28px;
    background: #e7eeff;
    border: 1px solid rgba(129, 174, 255, 1);
    font-size: 14px;
    color: #333333;
    text-align: center;
  }
  .title {
    height: 24px;
    font-size: 16px;
    color: #000;
    line-height: 24px;
    margin-top: 15px;
    margin-bottom: 23px;
  }
  .mcObject-wrap {
    display: grid;
    grid-template-columns: repeat(4, auto);
    gap: 20px;
  }
  .mcObject {
    height: 57.34px;
    background: rgba(27, 98, 236, 0.06);
    border-radius: 4px;
    padding-left: 20px;
    cursor: pointer;
  }
}
</style>
