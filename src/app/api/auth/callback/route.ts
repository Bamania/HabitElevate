import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Handle errors from OAuth provider
  if (error) {
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(new URL(`/login?error=${error_description || error}`, requestUrl.origin))
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(new URL('/login?error=Authentication failed', requestUrl.origin))
    }

    // Check if user has completed onboarding
    if (data?.session?.user?.id) {
      const { data: profileData, error: profileError } = await supabase
        .from('users_profile')
        .select('phone, primary_goal, plan_generated_at')
        .eq('id', data.session.user.id)
        .maybeSingle();

      // If profile doesn't exist or onboarding incomplete, redirect to onboarding
      if (!profileData?.phone || !profileData?.primary_goal || !profileData?.plan_generated_at) {
        return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
      }
    }
  }

  // URL to redirect to after sign in process completes (for completed users)
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
