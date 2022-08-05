<template>
  <div class="extractID">
    <a-drawer
      title="子项配置"
      placement="right"
      :closable="false"
      :visible="visible"
      :mask-closable="false"
      width="1000"
      wrap-class-name="extractIdDrawer"
      :after-visible-change="afterVisibleChange"
      :body-style="{
        padding: '24px 40px'
      }"
      @close="onClose"
    >
      <div style="margin-bottom: 15px">
        <span style="color: #666">字典名称</span>
        <span style="margin-left: 24px">{{ dictionary.dictName }}</span>
      </div>
      <div style="margin-bottom: 15px">
        <span style="color: #666">字典编码</span>
        <span style="margin-left: 24px">{{ dictionary.dictType }}</span>
      </div>
      <a-table row-key="id" :columns="columns" :data-source="tableData" bordered :pagination="false">
        <template slot="roleList" slot-scope="text, record">
          <div class="roleListWrap flex-between">
            <a-checkbox
              class="checkAll"
              :indeterminate="record.indeterminate"
              :checked="record.checkAll"
              style="width: 15%; margin-right: 10px"
              @change="onCheckAllChange($event, record)"
            >
              全选
            </a-checkbox>
            <a-checkbox-group
              v-model="record.checkedList"
              class="roleList flex-1"
              @change="onRoleChange($event, record)"
            >
              <span v-for="role in roleList" :key="role.id">
                <a-checkbox :value="role.id">{{ role.name }} </a-checkbox>
              </span>
            </a-checkbox-group>
          </div>
        </template>
      </a-table>
      <div class="drawer-footer">
        <a-button :style="{ marginRight: '8px' }" @click="onClose"> 取消 </a-button>
        <a-button type="primary" :loading="okLoading" @click="handleOk"> 确定 </a-button>
      </div>
      <div v-show="loading" class="spin"><a-spin /></div>
    </a-drawer>
  </div>
</template>
<script>
import { getRoleListAPI } from '@/api/user'
import { subDictBindRolesAPI, getSubDictListByDictAPI } from '@/api/dictionary/index'
export default {
  name: 'SubDictBindRole',
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    dictionary: {
      type: Object,
      require: true,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      columns: [
        // #region
        {
          title: '子项名称',
          dataIndex: 'dictName',
          width: 160
        },
        {
          title: '角色名称',
          colSpan: 2,
          dataIndex: 'roleList',
          scopedSlots: { customRender: 'roleList' }
        }
        // #endregion
      ],
      tableData: [],
      roleList: [],
      loading: false,
      okLoading: false
    }
  },
  watch: {
    dictionary(newV) {
      this.tableData = newV.dictContent.map(item => {
        return {
          ...item,
          indeterminate: false,
          checkAll: false,
          checkedList: []
        }
      })
      this.getSubDictListByDict()
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      getRoleListAPI({ number: 0, size: 999 }).then(({ data }) => {
        this.roleList = data.content
      })
    },
    // 获取二级字典
    getSubDictListByDict() {
      getSubDictListByDictAPI(this.dictionary.id).then(({ data }) => {
        this.tableData.forEach(tableRow => {
          data.forEach(item => {
            if (item.id === tableRow.id) {
              tableRow.checkedList = item.roleList.map(role => role.id)
              this.onRoleChange(tableRow.checkedList, tableRow)
            }
          })
        })
      })
    },
    // 全选
    onCheckAllChange(e, record) {
      Object.assign(record, {
        checkedList: e.target.checked ? this.roleList.map(item => item.id) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    // 单选
    onRoleChange(checkedList, record) {
      record.indeterminate = !!checkedList.length && checkedList.length < this.roleList.length
      record.checkAll = checkedList.length === this.roleList.length
    },
    handleOk() {
      const param = {
        dictId: this.dictionary.id,
        dictName: this.dictionary.dictName,
        dictType: this.dictionary.dictType,
        subDictBindRoleList: this.tableData.map(item => {
          return {
            roleIds: item.checkedList,
            subDictId: item.id,
            subDictName: item.dictName
          }
        })
      }
      this.okLoading = true
      subDictBindRolesAPI(param)
        .then(() => {
          this.$message.success('操作成功！')
          this.okLoading = false
          this.$emit('update:visible', false)
          this.$store.dispatch('dic/getDictList')
          this.$parent.expandedRowsChange()
        })
        .catch(() => {
          this.okLoading = false
          this.$emit('update:visible', false)
        })
    },
    afterVisibleChange(visible) {
      if (visible) {
        this.getSubDictListByDict()
      }
    },
    onClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
.roleListWrap {
  .roleList {
    display: grid;
    grid-template-columns: repeat(5, auto);
    grid-gap: 10px;
  }
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
.spin {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
