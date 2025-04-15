import { combineReducers } from 'redux'
import { aiGeneratedSlice } from './features/aiGeneratedslice/GeneratedSlice'

const rootReducer = combineReducers({
  GENERATED_TEXT: aiGeneratedSlice.reducer,
})

export default rootReducer;
