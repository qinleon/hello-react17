import {get,post,remove,update} from './index'


//查询
export function getmerchanlist(params){
    //无参数，查询所有数据 ,有参则按照参数查找
    return get('/merchanlist',params)
}

//删除(通过id删除)
export function removemerchanlist(params) {
    //params  要删除数据的id
    return remove('/merchanlist',params)
}

//添加
export function addmerchanlist(params) {
    //params 添加的数据
    return post("/merchanlist",params);
}

//修改
export function updatemerchanlist(id,params) {
    //id 要修改哪一条数据，params修改的数据
    return update('/merchanlist',id,params)
}

