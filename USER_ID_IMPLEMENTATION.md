# User ID Implementation Guide

This document explains how user authentication is integrated with the Todo CRUD operations in HabitElevate.

## Overview

The application now requires a logged-in user to perform any todo operations. The user ID is extracted from Supabase authentication and passed through the entire stack.

## Frontend Implementation

### 1. Authentication Context

The `AuthProvider` in `src/providers/AuthProvider.tsx` provides the current user information throughout the app:

```typescript
import { useAuth } from '@/providers/AuthProvider';

function MyComponent() {
  const { user, session, loading } = useAuth();
  
  // user.id contains the Supabase user ID
  console.log(user?.id);
}
```

### 2. Todo Operations with User ID

#### Creating a Todo

```typescript
import { useAuth } from '@/providers/AuthProvider';
import { todoApiService } from '@/lib/services/todoApi';

function CreateTodo() {
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!user?.id) {
      alert('You must be logged in');
      return;
    }

    const newTodo = await todoApiService.createTodo({
      text: 'My new task',
      user_id: user.id  // Required!
    });
  };
}
```

#### Fetching Todos

```typescript
const { user } = useAuth();

// Fetch todos for current user
const todos = await todoApiService.getTodos(user.id);
```

#### Using Redux Actions

```typescript
import { useDispatch } from 'react-redux';
import { useAuth } from '@/providers/AuthProvider';
import { addTodoAsync, fetchTodos } from '@/lib/features/todoSlice/todoSlice';

function TodoComponent() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      // Fetch todos on mount
      dispatch(fetchTodos(user.id) as any);
    }
  }, [user?.id]);

  const handleAddTodo = () => {
    if (user?.id) {
      dispatch(addTodoAsync({ 
        text: 'New task', 
        userId: user.id 
      }) as any);
    }
  };
}
```

### 3. Chat Interface / Agent Orders

In `AgentOrderForm.tsx`, the user ID is automatically included:

```typescript
export default function AgentOrderForm({ onSubmit }) {
  const { user } = useAuth();  // Get current user

  const handleSubmit = (e) => {
    if (!user?.id) {
      alert('You must be logged in to create an order');
      return;
    }

    const data = {
      ...formData,
      userId: user.id  // Automatically included
    };
    onSubmit(data);
  };
}
```

## Backend Implementation

### 1. API Endpoints

All todo endpoints now require `user_id`:

#### POST /api/v1/todos (Create Todo)
```python
# Request Body
{
  "text": "Complete documentation",
  "user_id": "uuid-here"  # Required
}

# Response
{
  "status": "success",
  "data": {
    "id": "todo-id",
    "text": "Complete documentation",
    "completed": false,
    "user_id": "uuid-here",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Todo created successfully"
}
```

#### GET /api/v1/todos (Fetch Todos)
```python
# Query Parameters
GET /api/v1/todos?user_id=uuid-here  # Required

# Response
{
  "status": "success",
  "data": [
    {
      "id": "todo-id-1",
      "text": "Task 1",
      "completed": false,
      "user_id": "uuid-here"
    }
  ],
  "message": "Todos retrieved successfully"
}
```

#### DELETE /api/v1/todos/completed/clear (Clear Completed)
```python
# Query Parameters
DELETE /api/v1/todos/completed/clear?user_id=uuid-here  # Required
```

### 2. Backend Validation

The backend validates user_id in `server/api/v1/todo_register.py`:

```python
@router.post("/")
async def create_todo(todo: TodoCreate):
    # Validate that user_id is provided
    if not todo.user_id:
        raise HTTPException(
            status_code=400, 
            detail="user_id is required to create a todo"
        )
    
    result = await TodoService.create_todo(todo)
    # ... rest of code
```

### 3. AI Agent Tools

The CRUD tools in `server/tools/crudTodos_tool.py` require user_id:

```python
async def create_todo(self, text: str, user_id: str) -> str:
    """
    Create a new todo item for a user.

    Args:
        text (str): The text content of the todo item.
        user_id (str): The ID of the user who owns this todo.
    """
    todo_data = TodoCreate(text=text, user_id=user_id)
    result = await TodoService.create_todo(todo_data)
    return str(result)
```

## Security Considerations

### Current Implementation (Approach 1)
- User ID is passed from frontend to backend
- Frontend extracts user ID from Supabase session
- Backend trusts the user_id sent by the client

### Limitations
⚠️ **Security Note**: In the current implementation, a malicious user could potentially send a different user_id in the request body. This is acceptable for development but should be enhanced for production.

### Recommended Enhancement (Future)

For production, implement JWT token validation:

```python
# server/api/v1/todo_register.py
from fastapi import Header, HTTPException, Depends
import jwt
import os

async def get_current_user(authorization: str = Header(None)) -> str:
    """Extract user ID from Supabase JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    secret = os.environ.get("SUPABASE_JWT_SECRET")
    
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload.get("sub")  # User ID
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/")
async def create_todo(
    todo: TodoCreate,
    user_id: str = Depends(get_current_user)  # Extract from JWT
):
    # Override any user_id in request body
    todo.user_id = user_id
    # ... rest of code
```

## Testing

### Frontend Testing

```typescript
// Test with logged-in user
const { user } = useAuth();
console.log('Current user:', user?.id);

// Try creating a todo
await todoApiService.createTodo({
  text: 'Test task',
  user_id: user.id
});

// Fetch user's todos
const todos = await todoApiService.getTodos(user.id);
console.log('User todos:', todos);
```

### Backend Testing

```bash
# Test with curl
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test todo",
    "user_id": "test-user-123"
  }'

# Fetch todos
curl "http://localhost:8000/api/v1/todos?user_id=test-user-123"
```

## Common Issues & Solutions

### Issue: "User ID is required" error

**Solution**: Ensure user is logged in before making todo operations:

```typescript
const { user, loading } = useAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <div>Please log in</div>;

// Now safe to use user.id
```

### Issue: Todos not showing up

**Solution**: Verify you're passing the correct user_id:

```typescript
// ✅ Correct
dispatch(fetchTodos(user.id));

// ❌ Incorrect
dispatch(fetchTodos());  // Missing user_id
```

### Issue: Redux state not updating

**Solution**: Make sure to dispatch with proper parameters:

```typescript
// ✅ Correct
dispatch(addTodoAsync({ text: 'New task', userId: user.id }));

// ❌ Incorrect (old API)
dispatch(addTodoAsync('New task'));  // Missing userId
```

## File Changes Summary

### Modified Files

**Frontend:**
- ✅ `src/lib/services/todoApi.ts` - Added user_id validation
- ✅ `src/lib/features/todoSlice/todoSlice.ts` - Updated async thunks to require userId
- ✅ `src/app/todo/page.tsx` - Added useAuth hook, user checks, and userId passing
- ✅ `src/components/chatInterface/AgentOrderForm.tsx` - Added useAuth hook and userId to form

**Backend:**
- ✅ `server/api/v1/todo_register.py` - Added user_id validation in endpoints
- ✅ `server/service/todo_crud.py` - Already had user_id filtering (no changes needed)
- ✅ `server/tools/crudTodos_tool.py` - Already accepts user_id (no changes needed)

## Next Steps

1. ✅ **Current**: User ID passed from frontend (Approach 1)
2. 🔄 **Recommended for Production**: Implement JWT token validation (Approach 2)
3. 🔄 **Future Enhancement**: Add Row Level Security (RLS) in Supabase
4. 🔄 **Future Enhancement**: Add user-specific rate limiting

## Questions?

If you have questions about the user ID implementation, check:
- Frontend auth: `src/providers/AuthProvider.tsx`
- Backend validation: `server/api/v1/todo_register.py`
- Service layer: `server/service/todo_crud.py`
