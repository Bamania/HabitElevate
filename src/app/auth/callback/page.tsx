'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '../../../lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
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
          // Successfully authenticated, redirect to home
          router.push('/')
          router.refresh()
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
  }, [router, supabase.auth])

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
