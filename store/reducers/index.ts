import { combineReducers } from 'redux'
import canvasReducer from './canvasReducer'

const reducers = {
    canvas: canvasReducer
  }
  
export default combineReducers(reducers)