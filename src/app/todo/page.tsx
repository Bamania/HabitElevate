'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../lib/store'
import { 
  fetchTodos, 
  addTodoAsync, 
  toggleTodoAsync, 
  deleteTodoAsync, 
  updateTodoAsync, 
  setFilter, 
  clearCompletedAsync,
  clearError
} from '../../lib/features/todoSlice/todoSlice'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Checkbox } from '../../components/ui/checkbox'

import { Plus, Trash2, Edit3, Check, X } from 'lucide-react'

export default function TodoPage() {
  const dispatch = useDispatch()
  const { todos, filter, loading, error } = useSelector((state: RootState) => state.todos)
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  // Fetch todos on component mount
  // useEffect(() => {
  //   dispatch(fetchTodos(user_id) as any)
  // }, [dispatch])

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      dispatch(addTodoAsync(newTodo.trim()) as any)
      setNewTodo('')
    }
  }

  const handleEditStart = (id: string, text: string) => {
    setEditingId(id)
    setEditingText(text)
  }

  const handleEditSave = async () => {
    if (editingId && editingText.trim()) {
      dispatch(updateTodoAsync({ id: editingId, text: editingText.trim() }) as any)
      setEditingId(null)
      setEditingText('')
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditingText('')
  }

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodoAsync(id) as any)
  }

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodoAsync(id) as any)
  }

  // const handleClearCompleted = () => {
  //   dispatch(clearCompletedAsync(user_id) as any)
  // }



  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.filter(todo => !todo.completed).length

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Todo List
          </h1>
          <p className="text-gray-500">
            Simple task management
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Add Todo Form */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:border-gray-400 focus:outline-none"
              disabled={loading}
            />
            <Button 
              onClick={handleAddTodo}
              className="px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              disabled={loading}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex border border-gray-200 rounded-lg">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => dispatch(setFilter(filterType))}
                className={`px-4 py-2 text-sm ${
                  filter === filterType
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:text-gray-800 bg-white'
                } ${filterType === 'all' ? 'rounded-l-lg' : filterType === 'completed' ? 'rounded-r-lg' : ''} border-r border-gray-200 last:border-r-0`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading...</p>
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-2">
          {!loading && filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {filter === 'all' ? 'No tasks yet' : 
                 filter === 'active' ? 'No active tasks' : 
                 'No completed tasks'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div key={todo.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleTodo(todo.id)}
                    className="w-5 h-5"
                  />
                  
                  {editingId === todo.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave()
                          if (e.key === 'Escape') handleEditCancel()
                        }}
                        className="flex-1 border border-gray-200 rounded px-3 py-2"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={handleEditSave}
                        className="bg-gray-800 text-white hover:bg-gray-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEditCancel}
                        className="border-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className={`text-base ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {todo.text}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditStart(todo.id, todo.text)}
                          className="text-gray-400 hover:text-gray-600 p-2"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-gray-400 hover:text-red-500 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>{activeCount} active</span>
                <span>{completedCount} completed</span>
              </div>
              {/* {completedCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearCompleted}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  Clear completed
                </Button>
              )} */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
