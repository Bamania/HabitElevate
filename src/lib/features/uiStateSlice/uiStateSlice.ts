import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
}

interface UIState {
  // Chat interface state
  isChatMode: boolean;
  messages: Message[];
  isLoading: boolean;
  streamingMessageId: string | null;
  
  // Context sidebar state
  showContext: boolean;
  
  // Suggestions state
  showSuggestions: boolean;
  
  // Transition state
  isTransitioning: boolean;
}

const initialState: UIState = {
  isChatMode: false,
  messages: [
    {
      id: '1',
      content: "Hello! I'm your AI habit coach. I'm here to help you build amazing habits and achieve your goals. What would you like to work on today?",
      type: 'ai',
      timestamp: new Date()
    }
  ],
  isLoading: false,
  streamingMessageId: null,
  showContext: false,
  showSuggestions: true,
  isTransitioning: false,
};

const uiStateSlice = createSlice({
  name: 'uiState',
  initialState,
  reducers: {
    // Chat mode actions
    enterChatMode: (state) => {
      state.isChatMode = true;
      state.showSuggestions = false;
      state.isTransitioning = true;
    },
    
    exitChatMode: (state) => {
      state.isChatMode = false;
      state.showSuggestions = true;
      state.isTransitioning = true;
    },
    
    // Message actions
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    
    updateMessage: (state, action: PayloadAction<{ id: string; content: string; isStreaming?: boolean }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
        if (action.payload.isStreaming !== undefined) {
          message.isStreaming = action.payload.isStreaming;
        }
      }
    },
    
    setStreamingMessageId: (state, action: PayloadAction<string | null>) => {
      state.streamingMessageId = action.payload;
    },
    
    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Context sidebar
    toggleContext: (state) => {
      state.showContext = !state.showContext;
    },
    
    setShowContext: (state, action: PayloadAction<boolean>) => {
      state.showContext = action.payload;
    },
    
    // Suggestions
    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload;
    },
    
    // Transition state
    setTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isTransitioning = action.payload;
    },
    
    // Reset to initial state
    resetUIState: (state) => {
      return initialState;
    },
  },
});

export const {
  enterChatMode,
  exitChatMode,
  addMessage,
  updateMessage,
  setStreamingMessageId,
  setLoading,
  toggleContext,
  setShowContext,
  setShowSuggestions,
  setTransitioning,
  resetUIState,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
