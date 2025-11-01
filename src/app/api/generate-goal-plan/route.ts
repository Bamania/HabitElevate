import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, profile, goal } = body;

    if (!userId || !goal?.primaryGoal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use OpenAI or your preferred AI service to generate the plan
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create a comprehensive prompt for the AI
    const prompt = `You are an expert habit coach and goal planning assistant. Create a detailed, actionable plan for the following user:

**User Profile:**
- Age: ${profile.age}
- Occupation: ${profile.occupation}
- Lifestyle: ${profile.lifestyle}
- Energy Level: ${profile.energyLevel}
- Schedule: ${profile.schedule}
- Current Habits: ${profile.currentHabits?.join(', ') || 'None specified'}
- Challenges: ${profile.challenges?.join(', ') || 'None specified'}
- Preferences: ${profile.preferences?.join(', ') || 'None specified'}

**Primary Goal:**
${goal.primaryGoal}

**Timeline:**
${goal.goalDuration} ${goal.durationType}

**Instructions:**
Create a comprehensive, personalized plan that includes:

1. **Goal Breakdown**: Break down the primary goal into 3-5 key milestones
2. **Daily Habits**: Suggest 3-7 daily habits that will help achieve this goal
3. **Weekly Milestones**: Define weekly checkpoints and what should be accomplished
4. **Action Steps**: Provide specific, actionable steps for the first week
5. **Tips & Motivation**: Include personalized tips based on their challenges and preferences
6. **Success Metrics**: Define how to measure progress

Format the response as a structured JSON object with the following structure:
{
  "summary": "Brief overview of the plan",
  "milestones": [
    {
      "title": "Milestone name",
      "description": "What needs to be achieved",
      "timeframe": "When to achieve it",
      "tasks": ["task 1", "task 2"]
    }
  ],
  "dailyHabits": [
    {
      "name": "Habit name",
      "description": "Why this habit matters",
      "frequency": "daily/weekly",
      "duration": "How long to spend",
      "bestTime": "When to do it"
    }
  ],
  "weeklyCheckpoints": [
    {
      "week": 1,
      "focus": "What to focus on",
      "goals": ["goal 1", "goal 2"],
      "reflection": "Questions to ask yourself"
    }
  ],
  "firstWeekActions": [
    {
      "day": 1,
      "tasks": ["task 1", "task 2"],
      "focus": "Daily focus area"
    }
  ],
  "personalizedTips": [
    "Tip 1 based on their profile",
    "Tip 2 based on their challenges"
  ],
  "successMetrics": {
    "daily": "How to measure daily progress",
    "weekly": "How to measure weekly progress",
    "overall": "How to measure overall success"
  }
}

Make the plan realistic, achievable, and tailored to their specific situation. Consider their occupation, lifestyle, and energy level when scheduling activities.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert habit coach and goal planning assistant. You create detailed, actionable, and personalized plans to help people achieve their goals. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate plan' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const planContent = data.choices[0].message.content;
    
    let plan;
    try {
      plan = JSON.parse(planContent);
    } catch (e) {
      console.error('Failed to parse AI response:', planContent);
      return NextResponse.json(
        { error: 'Invalid plan format' },
        { status: 500 }
      );
    }

    // Add metadata to the plan
    const enrichedPlan = {
      ...plan,
      generatedAt: new Date().toISOString(),
      goal: goal.primaryGoal,
      duration: `${goal.goalDuration} ${goal.durationType}`,
      userId: userId
    };

    return NextResponse.json({
      success: true,
      plan: enrichedPlan
    });

  } catch (error) {
    console.error('Error generating goal plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
