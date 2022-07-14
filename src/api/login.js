import {getlogin} from './index'


//登录
export function loginAdmin(params){
    //登录，参数为用户名和密码
    return getlogin('/loginadmin',params)
}


