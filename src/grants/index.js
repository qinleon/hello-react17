import GkList from '../pages/taskInitiation/gkList/GkList'
import Commuinfo from '../pages/commuinfo/commuinfo'
import Userstati from '../pages/userstati/userstati'
import Merchanlist from '../pages/merchanlist/merchanlist'
import Loginaccou from '../pages/loginaccou/loginaccou'
import Merchans from '../pages/merchans/merchans'

let stores = [
  {
    title: '用户列表',
    path: '/layouts/gkList',
    component: GkList,
  },
  {
    title: '通讯信息',
    path: '/layouts/commuinfo',
    component: Commuinfo,
  },
  {
    title: '用户分析',
    path: '/layouts/userstati',
    component: Userstati,
  },
  {
    title: '商户列表',
    path: '/layouts/merchanlist',
    component: Merchanlist,
  },
  {
    title: '登录账户',
    path: '/layouts/loginaccou',
    component: Loginaccou,
  },
  {
    title: '商户分析',
    path: '/layouts/merchas',
    component: Merchans,
  },
  {
    title: '产品管理',
    path: '/layouts/authManage/productManage',
    component: Merchans,
  },
]

export default stores
