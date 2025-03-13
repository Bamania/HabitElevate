import { configureStore } from '@reduxjs/toolkit'
import { config } from 'process'
import { aiGeneratedSlice } from './features/aiGeneratedslice/GeneratedSlice'

export const Store=()=>{
    return configureStore({
        reducer: {
//  list down your reducers here ! 
    GENERATED_TEXT:aiGeneratedSlice.reducer
        
   } })

}

// Infer the type of makeStore

export type AppStore = ReturnType<typeof Store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']