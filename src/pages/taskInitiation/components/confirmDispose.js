/*
 * @Descripttion:
 * @version: V1.0.0.1
 * @Author: Qleo
 * @Date: 2022-05-18 17:36:05
 * @LastEditors: huangzhihu huangzhihu@golaxy.cn
 * @LastEditTime: 2022-07-18 16:50:57
 */
import Vue from 'vue'
import ConfirmDispose from './confirmDispose.vue'

const ConfirmStructor = Vue.extend(ConfirmDispose) // 返回一个实例创建的构造器，但实例构造器需要进行挂载到页面中

const myConfirmDispose = function (params) {
  return new Promise((resolve, reject) => {
    const confirmDom = new ConfirmStructor({
      el: document.createElement('div')
    })
    // 在body中动态创建一个div元素，之后此div将会替换成整个vue文件的内容
    // 此时的confirmDom通俗讲就是相当于是整个组件对象，通过对象调用属性的方法来进行组件中数据的使用
    // 可以通过$el属性来访问创建的组件实例
    document.body.appendChild(confirmDom.$el)

    // 组件初始化
    confirmDom.visible = true
    confirmDom.total = params.total
    confirmDom.whiteTable = params.whiteTable
    confirmDom.greyTable = params.greyTable
    // 将需要传入的文本内容传给组件实例
    confirmDom.handleOk = type => {
      confirmDom.visible = false
      resolve(type)
    }
    confirmDom.handleCancel = () => {
      confirmDom.visible = false
    }
  })
}

// 将逻辑函数进行导出和暴露
export default myConfirmDispose
