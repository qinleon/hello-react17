<template>
  <div class="left-panel" :class="isExpand ? '' : 'close'">
    <div ref="leftPanel" class="left-panel-wrap">
      <div class="panel-head">
        常用搜索
        <a-tooltip title="新建分组">
          <a-icon type="plus-square" theme="filled" class="icon-plus" @click="addGroup" />
        </a-tooltip>
      </div>
      <div class="tree-wrap">
        <a-tree
          class="draggable-tree"
          draggable
          :tree-data="treeData"
          :selected-keys="selectedKeys"
          default-expand-all
          :expanded-keys="expandedKeys"
          @select="onSelect"
          @dragenter="onDragEnter"
          @drop="onDrop"
          @expand="onExpand"
        >
          <a-icon slot="switcherIcon" type="caret-down" style="font-size: 18px" />
          <template slot="custom" slot-scope="item">
            <div class="tree-view-item">
              <span class="tree-view-left" :title="item.title">{{ item.title }}</span>
              <div class="tree-view-right">
                <a-tooltip>
                  <template slot="title"> 修改分组 </template>
                  <svg-icon
                    v-if="item.isGroup == 1"
                    icon-class="edit"
                    class="hanlde-icon"
                    @click.stop="editGroup(item)"
                  />
                </a-tooltip>
                <a-tooltip>
                  <template slot="title"> 删除分组 </template>
                  <svg-icon
                    v-if="item.isGroup == 1"
                    icon-class="delete"
                    class="hanlde-icon"
                    @click.stop="deleteGroup(item)"
                  />
                  <!-- <a-icon v-if="item.isGroup == 0" type="delete" class="hanlde-icon" @click.stop="deleteGroup()" /> -->
                </a-tooltip>
                <a-tooltip>
                  <template slot="title"> 修改常用搜索 </template>
                  <svg-icon
                    v-if="item.isGroup == 0"
                    icon-class="edit"
                    class="hanlde-icon"
                    @click.stop="editSearchName(item)"
                  />
                </a-tooltip>
                <a-tooltip>
                  <template slot="title"> 删除常用搜索 </template>
                  <svg-icon
                    v-if="item.isGroup == 0"
                    icon-class="delete"
                    class="hanlde-icon"
                    @click.stop="deleteSearchName(item)"
                  />
                </a-tooltip>
              </div>
            </div>
          </template>
        </a-tree>
      </div>
    </div>
    <div class="expand-collapse-box" :style="collapseStyle" @click="expandCollapse">
      <a-icon :type="isExpand ? 'caret-left' : 'caret-right'" />
    </div>
    <!-- 分组 -->
    <GroupModal
      v-model="openGroup"
      :tree-item="treeItem"
      :is-edit="isEdit"
      :cur-menu="curMenu"
      @onOk="reacquire"
      @upDataScreen="upDataScreen"
    />
    <!-- 搜索名称 -->
    <SearchNameModal
      v-model="openSearchNameModal"
      :is-edit="isEditName"
      :tree-item="treeItem"
      :tree-data="treeData"
      :screen-json="screenJson"
      :cur-menu="curMenu"
      @upDataScreen="upDataScreen"
      @onOk="reacquire"
      @setSelect="setSelect"
    />
  </div>
</template>
<script>
import GroupModal from '@/views/integrate-search/components/group-modal'
import SearchNameModal from '@/views/integrate-search/components/search-name-modal'
import { delSearchRecord, upDataSearchRecord, changeOrder } from '@/api/integrateSearch'

export default {
  components: {
    GroupModal,
    SearchNameModal
  },
  props: {
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    isAddScreen: {
      type: Boolean,
      default: false
    },
    screenJson: {
      type: Object,
      default: () => {
        return {}
      }
    },
    curMenu: {
      type: String,
      default: 'MC_CONTENT'
    }
  },
  data() {
    return {
      expandedKeys: [],
      selectedKeys: [], // 选中的节点id
      selected: false, // 是否是选中状态
      openGroup: false, // 是否打开分组弹窗
      isEdit: false, // 是否编辑分组
      openSearchNameModal: false, // 是否打开常用搜索弹窗
      isEditName: false, // 是否编辑常用搜索名称
      isExpand: true,
      treeItem: {},
      saveScreenRecord: false, // 在点击保存筛选之后重新获取列表数据之后  保留上一次选中的数据
      basicCollapse: null,
      collapseStyle: this.isExpand ? 'right:0;' : ''
    }
  },
  computed: {},
  watch: {
    treeData: {
      handler(value) {
        if (!this.saveScreenRecord) {
          this.selectedKeys = []
          this.selected = false
        } else {
          this.saveScreenRecord = false
          if (this.leftPanelJson) {
            this.setSearchJson()
          }
        }
      },
      deep: true,
      immediate: true
    },
    isAddScreen: {
      handler(val) {
        if (val) {
          if (this.selectedKeys.length && this.selected) {
            this.upDataScreen()
            const { preItem } = this.fn_recursion(this.treeData, this.selectedKeys[0])
            if (preItem.isGroup == 0) {
              // 当有选中的常用搜索时，点击保存筛选直接调用保存接口，提示保存成功
              this.saveScreen()
            } else if (preItem.isGroup == 1) {
              this.openSearchNameModal = true
              this.isEditName = false
            }
            // this.isEditName = true
          } else {
            if (this.treeData.length) {
              this.treeItem = this.treeData[this.treeData.length - 1]
            } else {
              this.treeItem = {}
            }
            this.openSearchNameModal = true
            this.isEditName = false
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.leftPanelId = localStorage.getItem('leftPanelId') ? JSON.parse(localStorage.getItem('leftPanelId')) : null
    this.leftPanelJson = localStorage.getItem('leftPanelJson')
      ? JSON.parse(localStorage.getItem('leftPanelJson'))
      : null
    if (this.leftPanelId) {
      this.saveScreenRecord = true
      this.selectedKeys = this.leftPanelId
      this.selected = true
    }
    const _this = this
    window.microApp.addDataListener(val => {
      if (val.collapsible) {
        _this.basicCollapse = 1
      } else {
        _this.basicCollapse = 2
      }
    })
  },
  methods: {
    setSearchJson() {
      this.$emit('selected', this.leftPanelJson)
      localStorage.removeItem('leftPanelId')
      localStorage.removeItem('leftPanelJson')
      this.leftPanelJson = null
      this.leftPanelId = null
    },
    // 列表的点击选中和点击取消方法
    onSelect(selectedKeys, { selected, selectedNodes, node, event }) {
      // this.selectedKeys = selectedKeys
      // this.selected = selected
      node.onExpand()
      if (selected) {
        localStorage.setItem('leftPanelId', JSON.stringify(selectedKeys))
        localStorage.setItem('leftPanelJson', JSON.stringify(node.dataRef || {}))
        // this.$emit('selected', node.dataRef)
        const domA = document.createElement('a')
        domA.setAttribute('target', '_blank')
        domA.setAttribute('href', '/micro-integrate/search')
        domA.click()
      } else {
        this.selectedKeys = selectedKeys
        this.selected = selected
        this.$emit('selected', {})
      }
    },
    // 新建分组
    addGroup() {
      this.openGroup = true
      this.isEdit = false

      if (this.treeData.length) {
        this.treeItem = this.treeData[this.treeData.length - 1]
      } else {
        this.treeItem = {}
      }
    },
    // 修改分组
    editGroup(item) {
      this.openGroup = true
      this.isEdit = true
      this.treeItem = item
    },
    // 删除分组
    deleteGroup(item) {
      const that = this
      this.$confirm({
        title: '提示',
        content: `删除分组会删掉该分组下的全部常用搜索，您确定要删除【${item.recordName}】分组吗？`,
        onOk() {
          const name = that.$store.getters.name
          delSearchRecord({ creator: name, id: item.id }).then(res => {
            if (res.code === '0000') {
              that.reacquire()
              that.$message.success('删除分组成功')
            } else {
              that.$message.error(res.data)
            }
          })
        },
        onCancel() {}
      })
    },

    // 修改搜索名字
    editSearchName(item) {
      this.openSearchNameModal = true
      this.isEditName = true
      this.treeItem = item
    },

    // 删除搜索名字
    deleteSearchName(item) {
      const that = this
      this.$confirm({
        title: '提示',
        content: `您确定要删除该常用搜索吗？`,
        onOk() {
          const name = that.$store.getters.name
          delSearchRecord({ creator: name, id: item.id }).then(res => {
            if (res.code === '0000') {
              if (that.selectedKeys.length && that.selectedKeys[0] == item.id) {
                that.$emit('selected', {})
              }
              that.reacquire()
              that.$message.success('删除成功')
            } else {
              that.$message.error(res.data)
            }
          })
        }
      })
    },

    onDragEnter(info) {
      // console.log('onDragEnter', info)
      // expandedKeys 需要受控时设置
      this.expandedKeys = info.expandedKeys
    },
    onDrop(info) {
      // dropPosition: 拖拽到节点之上,该节点的 index-1; 拖拽到节点上：dropPosition 就是该节点的 index；拖拽到节点之下：该节点的 index+1
      // console.log('drop', info)
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      // console.log('dropPos', dropPos)
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      // console.log('dropPosition', dropPosition)
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.treeData]

      // Find dragObject
      let dragObj
      const dragLength = info.dragNode.pos.split('-').length
      const dropLength = info.node.pos.split('-').length
      const dragData = info.dragNode.dataRef
      const dropData = info.node.dataRef

      if (!info.dropToGap) {
        // Drop on the content
        // dragLength === dropLength ||
        console.log(dragData, dropData, 'hhhhhhhhhhhhhh')
        if (dropPosition == 0 && (dragData.isGroup === 1 || dropData.isGroup === 0)) {
          // dropData.isGroup
          return
        } else {
          loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1)
            dragObj = item
          })
          loop(data, dropKey, item => {
            item.children = item.children || []
            // where to insert 示例添加到尾部，可以是随意位置
            item.children.push(dragObj)
          })
        }
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dragKey, (item, index, arr) => {
          arr.splice(index, 1)
          dragObj = item
        })
        loop(data, dropKey, item => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj)
        })
      } else {
        // 一级不能拖拽为二级、二级子级 , isGroup: TODO: 等待后端真实数据判断  0是常用搜索，1是分组
        if (dragLength === 2 && dragData.isGroup === 1 && dropData.parentId) {
          return
        }
        loop(data, dragKey, (item, index, arr) => {
          arr.splice(index, 1)
          dragObj = item
        })
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      this.$emit('update:treeData', data)
      this.fn_changeOrder(dragData.id, data)
    },
    // 节点树的展开收起
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    // 展开收起
    expandCollapse() {
      this.isExpand = !this.isExpand
    },

    // 更新常用搜索列表
    reacquire() {
      this.$emit('reacquire')
    },
    // 关闭弹框后修改isAddScreen的值
    upDataScreen() {
      this.treeItem = {}
      this.$emit('upDataScreen')
    },
    fn_changeOrder(ids, newData) {
      const username = this.$store.getters.name
      const { preItem, beforeItem, afterItem, parentItem } = this.fn_recursion(newData, ids)

      changeOrder({
        creator: username,
        id: preItem?.id,
        parentId: parentItem?.id || null,
        previousId: beforeItem?.id || null,
        nextId: afterItem?.id || null
      }).then(res => {
        if (res.code === '0000') {
          this.$message.success('修改成功！')
          this.reacquire()
        } else {
          this.$message.error(res.data)
          this.reacquire()
        }
      })
    },
    // 递归确定移动的数据以及前后的数据
    fn_recursion(data, id, parentItem) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
          return {
            preItem: data[i] || undefined,
            beforeItem: data[i - 1] || undefined,
            afterItem: data[i + 1] || undefined,
            parentItem: parentItem || undefined
          }
        } else {
          if (data[i].children && data[i].children.length) {
            const obj = this.fn_recursion(data[i].children, id, data[i])
            if (obj) return obj
          }
        }
      }
    },
    saveScreen() {
      const username = this.$store.getters.name
      upDataSearchRecord({
        creator: username,
        id: this.selectedKeys[0],
        conditionJson: this.screenJson ? JSON.stringify(this.screenJson) : undefined
      }).then(res => {
        if (res.code === '0000') {
          this.reacquire()
          this.$message.success('修改成功')
          this.saveScreenRecord = true
        } else {
          this.$message.error(res.data)
        }
      })
    },

    // 新增常用搜索后选中新增的项
    setSelect(val, parentId) {
      this.saveScreenRecord = true
      if (parentId) this.expandedKeys.push(parentId)
      this.selectedKeys = [val.id]
      this.selected = true
    }
  }
}
</script>
<style lang="less">
.left-panel {
  width: 172px;
  transition: width 0.25s;
  position: relative;
  margin-right: 10px;
}
.close {
  width: 0;
  margin: 0;
  .left-panel-wrap {
    left: -172px;
    opacity: 0;
  }
  .expand-collapse-box {
    left: 10px;
  }
}
.left-panel-wrap {
  width: 172px;
  height: 100%;
  background: #fff;
  position: relative;
  left: 0;
  transition: all 0.25s;
  color: #333;
  opacity: 1;

  .panel-head {
    height: 40px;
    border-bottom: 1px solid #a6b7df;
    box-sizing: border-box;
    padding: 0 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;

    .icon-plus {
      cursor: pointer;
      color: #1b62ec;
    }
  }

  .tree-wrap {
    .ant-tree li .ant-tree-node-content-wrapper {
      line-height: 40px;
      height: 40px;
      width: 85%;
    }

    // .ant-tree .ant-tree-child-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    //     background: rgba(27, 98, 236, 0.1);
    //     position: relative;
    //     width: 111%;
    //     margin-left: -42px;
    //     padding-left: 46px;}

    .ant-tree li span.ant-tree-switcher,
    .ant-tree li span.ant-tree-iconEle {
      line-height: 46px;
    }

    .ant-tree .ant-tree-child-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
      background: rgba(27, 98, 236, 0.1);
      position: relative;
      width: 111%;
      margin-left: -42px;
      padding-left: 46px;

      // &::before {
      //   position: absolute;
      //   content: '';
      //   width: 2px;
      //   height: 100%;
      //   background: #1b62ec;
      //   left: 0;
      //   top: 0;
      // }

      .tree-view-left {
        color: #1b62ec;
      }
    }

    .ant-tree .ant-tree-child-tree .ant-tree-node-content-wrapper:hover {
      background: rgba(27, 98, 236, 0.1);
      position: relative;
      width: 111%;
      margin-left: -42px;
      padding-left: 46px;

      // &::before {
      //   position: absolute;
      //   content: '';
      //   width: 2px;
      //   height: 100%;
      //   background: #1b62ec;
      //   left: 0;
      //   top: 0;
      // }
    }

    .ant-tree > .ant-tree-treenode-selected {
      background: rgba(27, 98, 236, 0.1);
      position: relative;

      // &::before {
      //   position: absolute;
      //   content: '';
      //   width: 2px;
      //   height: 100%;
      //   background: #1b62ec;
      //   left: 0;
      //   top: 0;
      // }
    }

    .tree-view-item {
      height: 40px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .tree-view-left {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #333;
      }

      &:hover {
        .hanlde-icon {
          display: inline-block;
        }
      }

      .hanlde-icon {
        margin-left: 4px;
        color: #1b62ec;
        display: none;
        border: none;
        outline: none;
      }
    }

    .tree-parent-selected {
      background: transparent;
    }
  }
}
.expand-collapse-box {
  position: fixed;
  // right: -20px;
  left: 178px;
  bottom: 50%;
  width: 12px;
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid rgba(222, 222, 222, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  color: rgab(0, 0, 0, 0.33);
  font-size: 12px;
  text-align: center;
  z-index: 999;
  transition: left 0.25s;
}
</style>
