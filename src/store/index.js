import { createStore ,combineReducers,applyMiddleware} from "redux";
import thunk from 'redux-thunk'
import alldata from './alldata'
import isload from './load'



let storeReducer = combineReducers({
    alldata,isload
})

let store = createStore(storeReducer,applyMiddleware(thunk))

export default store;