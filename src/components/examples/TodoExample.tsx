/**
 * Example: Todo Component with User Authentication
 * 
 * This file demonstrates how to properly use user authentication
 * with todo CRUD operations.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { todoApiService } from '../../lib/services/todoApi';
import { getUserId, requireAuth } from '../../lib/utils/authUtils';

export default function TodoExample() {
  const { user, loading: authLoading } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos when user is available
  useEffect(() => {
    if (user?.id) {
      fetchUserTodos();
    }
  }, [user?.id]);

  const fetchUserTodos = async () => {
    try {
      if (!requireAuth(user, 'Must be logged in to fetch todos')) {
        return;
      }

      setLoading(true);
      const userId = getUserId(user);
      const fetchedTodos = await todoApiService.getTodos(userId);
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async () => {
    try {
      if (!requireAuth(user, 'Must be logged in to create todo')) {
        alert('Please log in to create todos');
        return;
      }

      if (!newTodoText.trim()) {
        alert('Please enter todo text');
        return;
      }

      setLoading(true);
      const userId = getUserId(user);
      
      const newTodo = await todoApiService.createTodo({
        text: newTodoText.trim(),
        user_id: userId
      });

      setTodos([newTodo, ...todos]);
      setNewTodoText('');
      alert('Todo created successfully!');
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (todoId: string) => {
    try {
      if (!requireAuth(user)) return;

      setLoading(true);
      const updatedTodo = await todoApiService.toggleTodo(todoId);
      
      setTodos(todos.map(todo => 
        todo.id === todoId ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Failed to toggle todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      if (!requireAuth(user)) return;

      setLoading(true);
      await todoApiService.deleteTodo(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login message if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please log in to manage your todos</p>
          <a 
            href="/login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Todos</h1>
      
      {/* User Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Logged in as: <span className="font-semibold">{user.email}</span>
        </p>
        <p className="text-xs text-gray-500">User ID: {user.id}</p>
      </div>

      {/* Create Todo Form */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateTodo()}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={handleCreateTodo}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      {loading && todos.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading todos...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No todos yet. Create one above!
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="w-5 h-5 text-blue-600"
              />
              <span
                className={`flex-1 ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {todos.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          {todos.filter(t => !t.completed).length} active, {todos.filter(t => t.completed).length} completed
        </div>
      )}
    </div>
  );
}
