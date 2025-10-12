import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api/v1/todos'

export interface Todo {
  id: string
  text: string
  completed: boolean
  created_at: string
  user_id?: string
}

export interface CreateTodoRequest {
  text: string
  user_id?: string
}

export interface UpdateTodoRequest {
  text?: string
  completed?: boolean
}

export interface ApiResponse<T> {
  status: string
  data?: T
  message: string
}

class TodoApiService {
  // Create a new todo
  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    try {
      // Ensure user_id is included
      if (!todo.user_id) {
        throw new Error('User ID is required to create a todo')
      }
      const response = await axios.post<ApiResponse<Todo>>(API_BASE_URL, todo)
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Failed to create todo')
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to create todo')
    }
  }

  // Get all todos
  async getTodos(userId?: string): Promise<Todo[]> {
    try {
      const params = userId ? { user_id: userId } : {}
      const response = await axios.get<ApiResponse<Todo[]>>(API_BASE_URL, { params })
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Failed to fetch todos')
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch todos')
    }
  }

  // Get a specific todo by ID
  async getTodoById(todoId: string): Promise<Todo> {
    try {
      const response = await axios.get<ApiResponse<Todo>>(`${API_BASE_URL}/${todoId}`)
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Failed to fetch todo')
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch todo')
    }
  }

  // Update a todo
  async updateTodo(todoId: string, updates: UpdateTodoRequest): Promise<Todo> {
    try {
      const response = await axios.put<ApiResponse<Todo>>(`${API_BASE_URL}/${todoId}`, updates)
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Failed to update todo')
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to update todo')
    }
  }

  // Toggle todo completion status
  async toggleTodo(todoId: string): Promise<Todo> {
    try {
      const response = await axios.patch<ApiResponse<Todo>>(`${API_BASE_URL}/${todoId}/toggle`)
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data
      }
      throw new Error(response.data.message || 'Failed to toggle todo')
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to toggle todo')
    }
  }

  // Delete a todo
  async deleteTodo(todoId: string): Promise<void> {
    try {
      const response = await axios.delete<ApiResponse<null>>(`${API_BASE_URL}/${todoId}`)
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to delete todo')
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to delete todo')
    }
  }

  // Clear all completed todos
  async clearCompletedTodos(userId?: string): Promise<void> {
    try {
      const params = userId ? { user_id: userId } : {}
      const response = await axios.delete<ApiResponse<null>>(`${API_BASE_URL}/completed/clear`, { params })
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to clear completed todos')
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to clear completed todos')
    }
  }
}

export const todoApiService = new TodoApiService()
