import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";



const AiGeneratedInitialState=({
    generatedText:""
});

export const aiGeneratedSlice = createSlice({
    name:"aiGenerated",
    initialState:AiGeneratedInitialState,
    reducers:{
        setGeneratedText:(state,action)=>{
            // expecting the payload to be an object
            state.generatedText=action.payload
        }
    }
})
export const { setGeneratedText } = aiGeneratedSlice.actions

export default aiGeneratedSlice.reducer