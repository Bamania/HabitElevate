import { combineReducers } from 'redux'
import todoReducer from './features/todoSlice/todoSlice';
import uiStateReducer from './features/uiStateSlice/uiStateSlice';

const rootReducer = combineReducers({
  todos: todoReducer,
  uiState: uiStateReducer,
})

export default rootReducer;
