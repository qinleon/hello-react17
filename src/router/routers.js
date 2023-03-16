import { lazy } from 'react'
// 组件
import GkList from '../pages/taskInitiation/gkList/GkList'
// 搜索结果
import Integrate from '../pages/Integrate/Integrate.js'
// 权限管理
import ProductManage from '../pages/AuthManage/ProductManage/ProductManage.js'
// 角色管理
import RoleManage from '../pages/AuthManage/RoleManage/RoleManage'
// 字典管理
import UserDictionary from '../pages/SystemManage/dictionary/UserDictionary'
// 404
import Notfound from '../pages/notfound/notfound'
// Demo
const Demo = lazy(() => import('../pages/Demo/Demo'))
const routers = [
  { path: '/', component: GkList },
  { path: '/layouts/gkList', component: GkList, meta: { authBtn: '23' }, auth: true },
  { path: '/layouts/search', component: Integrate, meta: { authBtn: '23' }, auth: true },
  { path: '/layouts/authManage/productManage', component: ProductManage },
  { path: '/layouts/authManage/roleManage', component: RoleManage },
  { path: '/layouts/systemManage/userDictionary', component: UserDictionary },
  { path: '/layouts/Demo', component: Demo },
  { path: '*', component: Notfound },
]
export default routers
