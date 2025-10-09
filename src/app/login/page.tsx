"use client"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "../../lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const supabase = createSupabaseClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (data.user) {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true)
      setError("")

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (signInError) {
        setError(signInError.message)
        setGoogleLoading(false)
      }
      // The user will be redirected to Google, so we don't set loading to false here
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to sign in with Google")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-100 p-4">
      <Card className="w-full max-w-[400px] shadow-lg">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex items-center justify-center gap-2">
          
            <h2 className="text-xl font-bold tracking-tight">Welcome Back</h2>
          </div>
          <p className="text-sm text-muted-foreground">Let&apos;s Keep Building Your Habits!</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-2 text-sm text-red-500 bg-red-50 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Input 
                name="email"
                type="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                className="h-9"
              />
            </div>
            <div className="space-y-2 relative">
              <Input 
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                className="h-9 pr-10" 
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <EyeOffIcon className="h-4 w-4" /> : 
                  <EyeIcon className="h-4 w-4" />
                }
              </Button>
            </div>
            <div className="flex items-center justify-end">
              <Link 
                href="/forgot-password" 
                className="text-xs text-cyan-500 hover:text-cyan-600"
              >
                Forgot Password?
              </Link>
            </div>
            <Button 
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-500 h-9"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                type="button"
                variant="outline" 
                className="h-9 text-sm"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {googleLoading ? "Loading..." : "Google"}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className="h-9 text-sm"
                disabled
              >
                <Image
                  src="/placeholder.svg?height=16&width=16"
                  width={16}
                  height={16}
                  alt="Apple logo"
                  className="mr-2"
                />
                Apple
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-cyan-500 hover:text-cyan-600">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

