<template>
  <a-modal
    v-model="isShow"
    :mask-closable="false"
    width="1300px"
    class="modal"
    :after-close="fn_closeModal"
    :body-style="{ padding: '0px 56px 24px 56px' }"
    dialog-class="disposeModal"
    @cancel="fn_closeModal"
  >
    <template slot="title"> 下发 </template>
    <div class="subtitle">填写主任务信息</div>
    <a-form-model ref="queryForm" :model="queryForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row type="flex" class="flex-center-v" :gutter="20">
        <a-col :span="8">
          <a-form-model-item ref="taskId" label="任务ID" prop="taskId">
            <a-input v-model="queryForm.taskId" placeholder="最多输入200字" allow-clear disabled />
          </a-form-model-item>
        </a-col>
        <a-col :span="queryForm.operation == '01030102' ? 6 : 8">
          <a-form-model-item
            ref="operation"
            label="管控操作"
            prop="operation"
            :label-col="{ span: queryForm.operation == '01030102' ? 8 : 6 }"
            :wrapper-col="{ span: queryForm.operation == '01030102' ? 16 : 18 }"
          >
            <a-select
              v-model="queryForm.operation"
              placeholder="请选择管控操作"
              allow-clear
              :get-popup-container="triggerNode => triggerNode.parentNode"
              @change="fn_operationChange"
            >
              <a-select-option v-for="(item, index) in operationList" :key="index" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <!-- 当管控操作选择 禁言 时展示禁言时长 -->
        <a-col v-if="queryForm.operation == '01030102' && noWeibo" :span="6">
          <a-form-model-item prop="duration" label="禁言时长" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-select
              v-model="queryForm.duration"
              :get-popup-container="triggerNode => triggerNode.parentNode"
              placeholder="请选择禁言时长"
            >
              <a-select-option v-for="item in muzzleList" :key="item.id" :value="item.dictType">
                {{ item.dictName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="4" style="text-align: center; margin-bottom: 24px">
          <a-button type="link" @click="fn_show">
            更多信息 (选填)
            <a-icon :type="iptShow ? 'up' : 'down'" />
          </a-button>
        </a-col>
      </a-row>

      <template v-if="iptShow">
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              ref="taskTitle"
              label="任务标题"
              prop="taskTitle"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 22 }"
            >
              <a-input v-model="queryForm.taskTitle" placeholder="最多输入200字" allow-clear />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-between" :gutter="20">
          <a-col span="8">
            <a-form-model-item ref="special" label="专项" prop="special">
              <a-select
                v-model="queryForm.special"
                :get-popup-container="triggerNode => triggerNode.parentNode"
                placeholder="请选择专项"
                allow-clear
              >
                <a-select-option v-for="(i, index) in specialData" :key="index" :value="i.dictType">
                  {{ i.dictName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="8">
            <a-form-model-item ref="taskType" label="任务类型" prop="taskType">
              <a-select
                v-model="queryForm.taskType"
                :get-popup-container="triggerNode => triggerNode.parentNode"
                placeholder="请选择任务类型"
                allow-clear
              >
                <a-select-option v-for="(i, index) in taskTypeData" :key="index" :value="i.dictType">
                  {{ i.dictName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="8">
            <a-form-model-item ref="eventType" label="事件类型" prop="eventType">
              <a-select
                v-model="queryForm.eventType"
                :get-popup-container="triggerNode => triggerNode.parentNode"
                placeholder="请选择事件类型"
                allow-clear
              >
                <a-select-option v-for="(i, index) in eventTypeData" :key="index" :value="i.dictType">
                  {{ i.dictName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="20">
          <!-- <a-col span="8">
            <a-form-model-item ref="sourceType" label="来源类型" prop="sourceType">
              <a-select v-model="queryForm.sourceType" placeholder="请选择来源类型" allow-clear>
                <a-select-option v-for="(i, index) in sourceTypeData" :key="index" :value="i.dictType">
                  {{ i.dictName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col> -->
          <a-col span="8">
            <a-form-model-item ref="level" label="响应级别" prop="level">
              <a-select
                v-model="queryForm.level"
                :get-popup-container="triggerNode => triggerNode.parentNode"
                placeholder="请选择响应级别"
                allow-clear
              >
                <a-select-option v-for="(i, index) in levelData" :key="index" :value="i.dictType">
                  {{ i.dictName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="24">
            <a-form-model-item
              ref="remark"
              label="任务描述"
              prop="remark"
              class="remark"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 22 }"
            >
              <a-textarea v-model="queryForm.remark" placeholder="最多输入1000字" allow-clear />
            </a-form-model-item>
          </a-col>
        </a-row>
      </template>
    </a-form-model>
    <div class="listBox">
      <div class="listHead">
        <span>管控列表（{{ taskList.length }}）</span>
      </div>
      <p v-if="promptText" class="prompt">{{ promptText }}</p>
      <div v-for="item in taskListShowned" :key="item.id" class="taskList">
        <SubtaskTemplate :info="item">
          <template #operation>
            <div v-for="hand in item.handleCodeList" :key="hand.id" class="operation-tag">{{ hand.name }}</div>
          </template>
        </SubtaskTemplate>
      </div>
      <div v-if="taskList.length > 0" style="text-align: right; padding-top: 22px">
        <a-pagination
          v-model="pagination.number"
          :page-size.sync="pagination.size"
          :total="taskList.length"
          @change="pageChange"
        />
      </div>
    </div>

    <template slot="footer">
      <a-button key="back" @click="fn_closeModal"> 取消 </a-button>

      <a-popover v-if="greyList.length && greyList.length < taskList.length" placement="top">
        <template slot="content">
          <div><a-icon type="exclamation-circle" theme="twoTone" two-tone-color="#faad14" />下发时自动过滤灰名单</div>
        </template>
        <a-button type="primary" @click="fn_onOkModal('noGrey')"> 过滤灰名单下发 </a-button>
      </a-popover>

      <a-popover v-if="greyList.length == taskList.length" slot="content" placement="top">
        <template slot="content">
          <div><a-icon type="exclamation-circle" theme="twoTone" two-tone-color="#faad14" />下发灰名单信息</div>
        </template>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="fn_onOkModal"> 直接下发 </a-button>
      </a-popover>
      <a-button v-else key="submit" type="primary" :loading="confirmLoading" @click="fn_onOkModal"> 直接下发 </a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  getObjectTypeList,
  getPreparedMarkListAPI,
  getTaskCodeAPI,
  disposeAPI,
  handlecodeAPI
} from '@/api/taskInitiation/newTask'
import { dicList } from '@/api/dic.js'
import SubtaskTemplate from '@/components/task/SubtaskTemplate.vue'
import cloneDeep from 'lodash.clonedeep'
import { strLenValid, validSpace } from '@/utils/validate.js'

export default {
  name: 'MoreTaskInfo',
  components: { SubtaskTemplate },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    taskIdList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      isShow: false,
      confirmLoading: false, // 下发按钮的loading
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },

      iptShow: false, // 更多信息的显隐

      operationList: [], // 管控操作列表
      specialData: [], // 专项列表
      taskTypeData: [], // 任务类型列表
      eventTypeData: [], // 事件类型列表
      sourceTypeData: [], // 来源类型列表
      levelData: [], // 响应级别列表
      muzzleList: [], // 禁言时长
      taskList: [], // 所有的子任务
      greyList: [], // 灰名单列表
      queryForm: {
        operation: undefined, // 管控操作
        operationName: '',
        taskId: undefined, // 任务ID
        duration: undefined, // 禁言时长
        taskTitle: undefined, // 任务标题
        special: undefined, // 专项
        taskType: undefined, // 任务类型
        eventType: undefined, // 事件类型
        sourceType: undefined, // 来源类型
        level: undefined, // 响应级别
        remark: undefined // 任务描述
      },
      queryFormCopy: {},
      rules: {
        operation: [{ required: true, message: '请选择管控操作' }],
        duration: [{ required: true, message: '请选择禁言时长' }],
        taskTitle: [{ validator: strLenValid(200), trigger: 'blur' }],
        remark: [{ validator: strLenValid(1000), trigger: 'blur' }]
      },
      promptText: '', // 提示文字
      pagination: {
        number: 1,
        size: 10
      },
      pageSizeOptions: ['10', '30', '50', '70', '100']
    }
  },
  computed: {
    taskListShowned() {
      const number = this.pagination.number
      const size = this.pagination.size
      return this.taskList.slice((number - 1) * size, number * size)
    },
    noWeibo() {
      return this.taskList.every(item => {
        return item.productName !== '新浪微博'
      })
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal === true) {
          this.isShow = true
          this.fn_getDicList(['special', 'taskType', 'eventType', 'sourceType', 'level', 'muzzle'])
        } else if (newVal === false) {
          this.isShow = false
        }
      }
    },
    taskIdList() {
      this.getTaskList()
      this.getTaskCode()
    }
  },

  created() {
    this.fn_getDicList(['special', 'taskType', 'eventType', 'sourceType', 'level', 'muzzle'])
  },
  mounted() {
    this.queryFormCopy = cloneDeep(this.queryForm)
  },

  methods: {
    // 根据角色获取管控对象列表及其包含的操作编码
    fn_getObjectTypeList() {
      getObjectTypeList({})
        .then(res => {
          if (res.data) {
            this.operationList = []
            res.data.forEach(item => {
              if (item.children && item.name === this.taskList[0].mcObjectCode) {
                item.children.forEach(event => {
                  this.operationList.push({
                    label: event.name,
                    value: event.allCode
                  })
                })
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取字典下拉列表数据
    fn_getDicList(val) {
      dicList({ dictType: val }).then(res => {
        res.data.forEach(item => {
          if (item.dictType == 'special') {
            this.specialData = item.dictContent
          } else if (item.dictType == 'taskType') {
            this.taskTypeData = item.dictContent
          } else if (item.dictType == 'eventType') {
            this.eventTypeData = item.dictContent
          } else if (item.dictType == 'sourceType') {
            this.sourceTypeData = item.dictContent
          } else if (item.dictType == 'level') {
            this.levelData = item.dictContent
          } else if (item.dictType == 'muzzle') {
            this.muzzleList = item.dictContent
          }
        })
      })
    },
    getTaskCode() {
      getTaskCodeAPI().then(({ data }) => {
        this.queryForm.taskId = data
      })
    },
    getTaskList(operationCode, operationName) {
      const loading = this.$Loading()
      getPreparedMarkListAPI({ ids: this.taskIdList, operationCode, operationName, number: 0, size: 999 }).then(
        ({ data }) => {
          this.taskList = data.content
          // 没有传操作code,则查询操作列表
          if (!operationCode) {
            this.fn_getObjectTypeList()
          }
          this.greyList = this.taskList.filter(item => {
            return item.greyOrWhite === 'GREY'
          })
          loading.close()
        }
      )
    },
    // 更多信息的显隐
    fn_show() {
      this.iptShow = !this.iptShow
    },
    // 管控操作的change方法
    fn_operationChange(value, option) {
      this.queryForm.operationName = option?.componentOptions.children[0].text.trim()
      if (value) {
        const params = {
          mcObjectCode: this.taskList[0].mcObjectCode,
          operationCode: value,
          operationName: option?.componentOptions.children[0].text.trim(),
          ids: this.taskList.map(item => item.id)
        }
        handlecodeAPI(params).then(({ data }) => {
          if (data.status === 1) {
            // 需要自动调整
            if (data.filterCount) {
              this.promptText = `有${data.notMatchCount}条无${data.operationName}操作的信息，${data.upCount}条下发时自动调整为${data.operationNameUp}，${data.filterCount}条自动过滤不下发`
            } else {
              this.promptText = `有${data.notMatchCount}条无${data.operationName}的信息，下发时自动调整为${data.operationNameUp}`
            }
          } else if (data.status === 0) {
            // 需要过滤
            this.promptText = `有${data.filterCount}条无${data.operationName}操作的信息，自动过滤不下发`
          } else {
            // 不需要任何操作，正常下发
            this.promptText = ''
          }
        })
        this.getTaskList(value, option?.componentOptions.children[0].text.trim())
      } else {
        this.taskList.forEach(item => {
          item.handleCodeList = []
        })
        this.promptText = ''
      }
    },

    // 分页大小变化
    pageSizeChange(current, size) {
      this.pagination.number = 1
      this.pagination.size = size
    },
    // 页码变化
    pageChange(val, pageSize) {
      this.pagination.number = val
    },

    // 下发按钮的回调
    fn_onOkModal(noGrey) {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          let finallyTaskList = cloneDeep(this.taskList)
          if (noGrey === 'noGrey') {
            finallyTaskList = finallyTaskList.filter(item => {
              return item.greyOrWhite !== 'GREY'
            })
          }
          // 调用下发接口
          let preparedSubtaskList = finallyTaskList.map(item => {
            return {
              ...item,
              accountType: item.accountType,
              commentType: item.commentType,
              dataTypeCode: item.dataTypeCode,
              dataTypeName: item.dataTypeName,
              duration: this.queryForm.duration,
              type: item.dataTypeIndex,
              enterpriseCode: item.enterpriseCode,
              esId: item.esId,
              greyOrWhite: item.greyOrWhite,
              operationCodeList: item.handleCodeList?.map(item => item.allCode),
              productCode: item.productCode,
              productName: item.productName,
              preparedId: item.id,
              uid: item.uid,
              url: item.url
            }
          })
          preparedSubtaskList = preparedSubtaskList.filter(item => {
            return item.handleCodeList?.length
          })
          if (!preparedSubtaskList.length) {
            this.$message.error(`提交失败，没有符合【${this.queryForm.operationName}】操作的数据`)
            this.$emit('input', false)
            return
          }
          const params = {
            mcObjectCode: finallyTaskList[0].mcObjectCode,
            mcObjectName: finallyTaskList[0].mcObjectName,
            duration: this.queryForm.duration,
            eventType: this.queryForm.eventType,
            level: this.queryForm.level,
            operationCode: this.queryForm.operation,
            operationName: this.queryForm.operationName,
            remark: this.queryForm.remark,
            sourceType: this.queryForm.sourceType,
            specialType: this.queryForm.special,
            taskTitle: this.queryForm.taskTitle,
            taskType: this.queryForm.taskType,
            taskCode: this.queryForm.taskId,
            preparedSubtaskList: preparedSubtaskList
          }
          this.confirmLoading = true
          disposeAPI(params)
            .then(() => {
              this.$message.success('提交成功')
              this.$emit('success')
              this.$emit('input', false)
              this.fn_closeModal()
              this.$router.push({ path: '/taskInitiation/missionQuery' })
              this.confirmLoading = false
            })
            .catch(() => {
              this.$emit('success')
              this.$emit('input', false)
              this.fn_closeModal()
              this.confirmLoading = false
            })
        }
      })
    },
    // 取消按钮的回调
    fn_closeModal() {
      this.$refs.queryForm?.clearValidate()
      this.queryForm = cloneDeep(this.queryFormCopy)
      this.taskList = []
      this.iptShow = false
      this.promptText = ''
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="less">
.disposeModal {
  // .ant-modal-footer {
  //   padding: 10px 20px;
  // }
  .subtitle {
    margin-bottom: 20px;
    height: 54px;
    line-height: 54px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .listBox {
    .listHead {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      span {
        font-size: 16px;
        height: 28px;
        font-family: PingFangSC-Medium;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
        font-weight: 500;
      }
    }
    .operation-tag {
      height: 22px;
      margin-right: 10px;
      padding: 0 10px;
      line-height: 22px;
      background: rgba(231, 130, 42, 0.16);
      border-radius: 2px;
      font-size: 12px;
      color: #f1882e;
    }
    .prompt {
      border: 1px solid #cfe0ff;
      background: #e7eeff;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
    }
    .taskList {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      margin-top: 10px;
      padding-bottom: 10px;
    }
    .SubtaskTemplate .name {
      max-width: 250px;
    }
  }
}
</style>
