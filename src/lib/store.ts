import { configureStore } from '@reduxjs/toolkit';
import { aiGeneratedSlice } from './features/aiGeneratedslice/GeneratedSlice';
import todoReducer from './features/todoSlice/todoSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

// Define the persist config
const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  GENERATED_TEXT: aiGeneratedSlice.reducer,
  todos: todoReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store instance
export const store = configureStore({
  reducer: persistedReducer,
  // middleware: getDefaultMiddleware({
  //   serializableCheck: {
  //     ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
  //   },
  // }),
});

// Create the persistor
export const persistor = persistStore(store);

// Infer the type of the store
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;