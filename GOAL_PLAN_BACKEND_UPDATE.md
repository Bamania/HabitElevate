# Goal Plan Generation - Architecture Update

## ✅ Changed to Python Backend with Agno Agent

Instead of using a separate Next.js API route with OpenAI, we're now using your existing **Python FastAPI backend** with the **Agno agent** you already have configured!

## Why This is Better

1. **Centralized AI Logic** - All AI interactions in one place
2. **Reuse Existing Agent** - Uses your already-configured Agno agent with Gemini
3. **Consistent Architecture** - Keeps the stack clean
4. **No Extra OpenAI Dependency** - Uses Gemini (which you're already using)
5. **Leverages Existing Tools** - Agent can use CRUD todos, calling tools, etc.
6. **Better Context** - Agent has user_id context and can access user data

## Implementation

### Backend (Python)

#### 1. **Chat Service Function** (`server/service/chat_service.py`)
```python
async def generate_goal_plan(
    user_id: str,
    profile: Dict[str, Any],
    goal: Dict[str, Any]
) -> Dict[str, Any]:
```

This function:
- Uses your existing `get_user_agent(user_id)` 
- Builds a comprehensive prompt for goal planning
- Calls `agent.arun()` to generate the plan
- Parses JSON from agent response
- Adds metadata and returns structured plan

#### 2. **API Endpoint** (`server/api/v1/goal_plan_generation.py`)
```python
@router.post("/generate-goal-plan")
async def generate_goal_plan_endpoint(request: GeneratePlanRequest):
```

This endpoint:
- Validates request data
- Calls the chat service function
- Returns the generated plan

#### 3. **Main App** (`server/main.py`)
```python
from api.v1.goal_plan_generation import router as goal_plan_router
app.include_router(goal_plan_router)
```

### Frontend (Next.js)

#### Onboarding Page Updated
```typescript
// Instead of:
const response = await fetch('/api/generate-goal-plan', ...)

// Now:
const response = await fetch(`${BACKEND_URL}/generate-goal-plan`, ...)
```

Calls your Python backend at `http://localhost:8000/generate-goal-plan`

## API Request/Response

### Request
```json
POST http://localhost:8000/generate-goal-plan
{
  "user_id": "user-uuid",
  "profile": {
    "age": 28,
    "schedule": "Fixed (9-6)",
    "goals": ["Be healthier", "Learn new skills"],
    "challenges": ["Procrastination", "Consistency"],
    "currenthabits": ["Morning coffee", "Evening walk"],
    "description": "Software engineer with busy schedule"
  },
  "goal": {
    "primary_goal": "Learn machine learning",
    "goal_duration": 12,
    "duration_type": "weeks"
  }
}
```

### Response
```json
{
  "success": true,
  "plan": {
    "summary": "...",
    "milestones": [...],
    "dailyHabits": [...],
    "weeklyCheckpoints": [...],
    "firstWeekActions": [...],
    "personalizedTips": [...],
    "successMetrics": {...},
    "generatedAt": "2025-10-13T...",
    "goal": "Learn machine learning",
    "duration": "12 weeks",
    "userId": "user-uuid"
  }
}
```

## Files Changed

### Created:
- ✅ `server/service/chat_service.py` - Added `generate_goal_plan()` function
- ✅ `server/api/v1/goal_plan_generation.py` - API endpoint

### Modified:
- ✅ `server/main.py` - Added router
- ✅ `habitelevate/src/app/onboarding/page.tsx` - Updated API call to Python backend

### Deleted:
- ❌ `habitelevate/src/app/api/generate-goal-plan/route.ts` - No longer needed!

## Environment Variables

**No OpenAI API key needed!** Just use your existing setup:

```env
# Python Backend (.env)
GOOGLE_API_KEY=your-gemini-key  # Already configured
POSTGRES_DB_URL=your-db-url      # Already configured
```

```env
# Next.js Frontend (.env.local)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000  # Your Python backend
```

## Testing

### 1. Start Python Backend
```bash
cd server
uvicorn main:app --reload --port 8000
```

### 2. Test API Directly
```bash
curl -X POST http://localhost:8000/generate-goal-plan \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "profile": {
      "age": 28,
      "schedule": "Flexible",
      "description": "Developer learning new skills"
    },
    "goal": {
      "primary_goal": "Master Python",
      "goal_duration": 8,
      "duration_type": "weeks"
    }
  }'
```

### 3. Test Full Flow
1. Sign up new user in Next.js app
2. Complete onboarding form
3. See AI generate plan using Agno agent
4. Check plan saved to Supabase

## Advantages of Using Agno Agent

1. **Smarter Context** - Agent knows user_id and can query user data
2. **Tool Integration** - Can use CRUD todos, calling tools while planning
3. **Conversation History** - Agent maintains context across calls
4. **Cost Effective** - Gemini is cheaper than OpenAI
5. **Unified System** - Same agent for chat, planning, everything
6. **Better Personalization** - Agent can pull user's actual habits/todos

## Future Enhancements

The agent can now:
- **Auto-create habits** from the plan using existing tools
- **Auto-create todos** for first week actions
- **Schedule VAPI calls** for weekly checkpoints
- **Update plans** based on user progress
- **Reference the plan** in chat conversations

## Example Agent Interaction

```python
# The agent receives this prompt:
"""
Create a personalized plan for:
User: Developer, 28, Busy lifestyle
Goal: Master Python in 8 weeks
Challenges: Procrastination, Time management
"""

# Agent can now:
# 1. Generate the plan
# 2. Call create_todo() to add first week tasks
# 3. Schedule weekly check-in calls via CallingTool
# 4. Store plan in user context

# All in one interaction! 🎯
```

---

**Result:** Clean architecture, uses existing infrastructure, no extra dependencies! 🚀
