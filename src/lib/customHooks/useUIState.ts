import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
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
} from '../features/uiStateSlice/uiStateSlice';
import { Message } from '../features/uiStateSlice/uiStateSlice';

export const useUIState = () => {
  const dispatch = useDispatch();
  const uiState = useSelector((state: RootState) => state.uiState);

  return {
    // State
    ...uiState,
    
    // Actions
    enterChatMode: () => dispatch(enterChatMode()),
    exitChatMode: () => dispatch(exitChatMode()),
    addMessage: (message: Message) => dispatch(addMessage(message)),
    updateMessage: (payload: { id: string; content: string; isStreaming?: boolean }) => 
      dispatch(updateMessage(payload)),
    setStreamingMessageId: (id: string | null) => dispatch(setStreamingMessageId(id)),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    toggleContext: () => dispatch(toggleContext()),
    setShowContext: (show: boolean) => dispatch(setShowContext(show)),
    setShowSuggestions: (show: boolean) => dispatch(setShowSuggestions(show)),
    setTransitioning: (transitioning: boolean) => dispatch(setTransitioning(transitioning)),
    resetUIState: () => dispatch(resetUIState()),
  };
};
