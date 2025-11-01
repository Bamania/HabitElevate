'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '../../../lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createSupabaseClient()
        
        // Check for error in URL params
        const params = new URLSearchParams(window.location.search)
        const errorParam = params.get('error')
        const errorDescription = params.get('error_description')

        if (errorParam) {
          setError(errorDescription || errorParam)
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        // Handle the OAuth callback - this will process hash fragments
        const { data, error: authError } = await supabase.auth.getSession()

        if (authError) {
          console.error('Auth error:', authError)
          setError(authError.message)
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        if (data.session) {
          // Check if user has completed onboarding
          const userId = data.session.user.id;
          
          const { data: profileData, error: profileError } = await supabase
            .from('users_profile')
            .select('phone, primary_goal, plan_generated_at')
            .eq('id', userId)
            .maybeSingle();
          
          // Ignore PGRST116 error (no rows) - it's expected for new users
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
          }

          // Check onboarding status
          const hasPhone = profileData?.phone;
          const hasCompletedOnboarding = profileData?.primary_goal && profileData?.plan_generated_at;

          if (!hasPhone || !hasCompletedOnboarding) {
            // New user or incomplete onboarding - redirect to onboarding
            console.log('Incomplete onboarding, redirecting to onboarding page');
            router.push('/onboarding');
            router.refresh();
          } else {
            // Onboarding complete, redirect to home
            console.log('Onboarding complete, redirecting to home');
            router.push('/');
            router.refresh();
          }
        } else {
          // No session found, redirect to login
          setTimeout(() => router.push('/login'), 2000)
        }
      } catch (err) {
        console.error('Callback error:', err)
        setError('An error occurred during authentication')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <h2 className="text-xl font-bold mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold mb-2">Signing you in...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  )
}
