'use client';

import React from 'react';
import { CheckCircle2, Circle, Plus, Trash2, ToggleRight, ListChecks } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function extractTodos(data: any): Todo[] {
  if (!data) return [];
  const list = data?.data ?? data;
  if (Array.isArray(list)) {
    return list.map((item: any) => ({
      id: item.id ?? item.todo_id ?? String(Math.random()),
      text: item.text ?? item.title ?? item.name ?? JSON.stringify(item),
      completed: Boolean(item.completed ?? item.is_completed ?? false),
    }));
  }
  return [];
}

function extractSingle(data: any): Todo | null {
  const item = data?.data ?? data;
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
  return {
    id: item.id ?? '',
    text: item.text ?? item.title ?? '',
    completed: Boolean(item.completed ?? false),
  };
}

// ─── Todo List (get_todos) ───────────────────────────────────────────────────

function TodoList({ data }: { data: any }) {
  const todos = extractTodos(data);
  if (todos.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <ListChecks className="h-4 w-4" />
          <span>No todos found</span>
        </div>
      </div>
    );
  }

  const active = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">Your Todos</span>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
          {active.length} active
        </span>
      </div>
      <ul className="divide-y divide-gray-50">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-3 px-4 py-2.5">
            {todo.completed ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-gray-300" />
            )}
            <span
              className={`text-sm ${
                todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
      {completed.length > 0 && (
        <div className="border-t border-gray-50 px-4 py-2 text-xs text-gray-400">
          {completed.length} completed
        </div>
      )}
    </div>
  );
}

// ─── Todo Created ────────────────────────────────────────────────────────────

function TodoCreated({ data }: { data: any }) {
  const todo = extractSingle(data);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
        <Plus className="h-4 w-4 text-green-600" />
      </div>
      <div>
        <p className="text-xs font-medium text-green-700">Todo created</p>
        <p className="text-sm text-gray-700">{todo?.text || 'New task added'}</p>
      </div>
    </div>
  );
}

// ─── Todo Updated / Toggled ──────────────────────────────────────────────────

function TodoUpdated({ data }: { data: any }) {
  const todo = extractSingle(data);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
        <ToggleRight className="h-4 w-4 text-blue-600" />
      </div>
      <div>
        <p className="text-xs font-medium text-blue-700">Todo updated</p>
        <p className="text-sm text-gray-700">
          {todo?.text || 'Task'} — {todo?.completed ? 'completed' : 'active'}
        </p>
      </div>
    </div>
  );
}

// ─── Todo Deleted ────────────────────────────────────────────────────────────

function TodoDeleted({ data }: { data: any }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
        <Trash2 className="h-4 w-4 text-red-500" />
      </div>
      <div>
        <p className="text-xs font-medium text-red-600">Todo removed</p>
        <p className="text-sm text-gray-500">Task has been deleted</p>
      </div>
    </div>
  );
}

// ─── Todos Cleared ───────────────────────────────────────────────────────────

function TodosCleared({ data }: { data: any }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
        <Trash2 className="h-4 w-4 text-orange-500" />
      </div>
      <div>
        <p className="text-xs font-medium text-orange-600">Completed todos cleared</p>
        <p className="text-sm text-gray-500">All finished tasks have been removed</p>
      </div>
    </div>
  );
}

// ─── Router ──────────────────────────────────────────────────────────────────

interface GenUiProps {
  type: string;
  data: any;
}

export default function GenUiElements({ type, data }: GenUiProps) {
  switch (type) {
    case 'todos':
      return <TodoList data={data} />;
    case 'todo_created':
      return <TodoCreated data={data} />;
    case 'todo_updated':
      return <TodoUpdated data={data} />;
    case 'todo_deleted':
      return <TodoDeleted data={data} />;
    case 'todos_cleared':
      return <TodosCleared data={data} />;
    default:
      return null;
  }
}
