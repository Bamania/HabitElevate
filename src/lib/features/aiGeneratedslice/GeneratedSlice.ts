import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface GeneratedTextState {
    generatedText: {
        obvious?: string;
        attractive?: string;
        easy?: string;
        satisfying?: string;
    }
}

const AiGeneratedInitialState: GeneratedTextState = {
    generatedText: {}
};

export const aiGeneratedSlice = createSlice({
    name:"aiGenerated",
    initialState:AiGeneratedInitialState,
    reducers:{
        setGeneratedText:(state, action: PayloadAction<GeneratedTextState['generatedText']>)=>{
            state.generatedText = action.payload;
        }
    }
})
export const { setGeneratedText } = aiGeneratedSlice.actions

export default aiGeneratedSlice.reducer