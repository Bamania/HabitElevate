import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { todoApiService, Todo as ApiTodo } from '../../services/todoApi'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  loading: boolean
  error: string | null
}

const initialState: TodoState = {
  todos: [],
  filter: 'all',
  loading: false,
  error: null
}

// Helper function to convert API todo to local todo format
const convertApiTodo = (apiTodo: ApiTodo): Todo => ({
  id: apiTodo.id,
  text: apiTodo.text,
  completed: apiTodo.completed,
  createdAt: apiTodo.created_at
})

// Async thunks for API calls
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId?: string) => {
    const apiTodos = await todoApiService.getTodos(userId)
    return apiTodos.map(convertApiTodo)
  }
)

export const addTodoAsync = createAsyncThunk(
  'todos/addTodo',
  async (text: string) => {
    const apiTodo = await todoApiService.createTodo({ text })
    return convertApiTodo(apiTodo)
  }
)

export const updateTodoAsync = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, text }: { id: string; text: string }) => {
    const apiTodo = await todoApiService.updateTodo(id, { text })
    return convertApiTodo(apiTodo)
  }
)

export const toggleTodoAsync = createAsyncThunk(
  'todos/toggleTodo',
  async (id: string) => {
    const apiTodo = await todoApiService.toggleTodo(id)
    return convertApiTodo(apiTodo)
  }
)

export const deleteTodoAsync = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string) => {
    await todoApiService.deleteTodo(id)
    return id
  }
)

export const clearCompletedAsync = createAsyncThunk(
  'todos/clearCompleted',
  async (userId?: string) => {
    await todoApiService.clearCompletedTodos(userId)
    return userId
  }
)

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch todos
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false
        state.todos = action.payload
        state.error = null
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch todos'
      })
      
    // Add todo
    builder
      .addCase(addTodoAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.loading = false
        state.todos.unshift(action.payload)
        state.error = null
      })
      .addCase(addTodoAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to add todo'
      })
      
    // Update todo
    builder
      .addCase(updateTodoAsync.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id)
        if (index !== -1) {
          state.todos[index] = action.payload
        }
      })
      .addCase(updateTodoAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update todo'
      })
      
    // Toggle todo
    builder
      .addCase(toggleTodoAsync.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id)
        if (index !== -1) {
          state.todos[index] = action.payload
        }
      })
      .addCase(toggleTodoAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to toggle todo'
      })
      
    // Delete todo
    builder
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload)
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete todo'
      })
      
    // Clear completed
    builder
      .addCase(clearCompletedAsync.fulfilled, (state) => {
        state.todos = state.todos.filter(todo => !todo.completed)
      })
      .addCase(clearCompletedAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to clear completed todos'
      })
  }
})

export const { setFilter, clearError } = todoSlice.actions
export default todoSlice.reducer
