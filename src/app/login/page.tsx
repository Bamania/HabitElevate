"use client"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

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
      // Add your authentication logic here
      // For now, just redirect to input page
      router.push('/input')
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Add your Google authentication logic here
      router.push('/input')
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to sign in with Google")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-100 p-4">
      <Card className="w-full max-w-[400px] shadow-lg">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/placeholder.svg?height=28&width=28"
              width={28}
              height={28}
              alt="HabitElevate logo"
              className="text-purple-600"
            />
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
              >
                <Image
                  src="/placeholder.svg?height=16&width=16"
                  width={16}
                  height={16}
                  alt="Google logo"
                  className="mr-2"
                />
                Google
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

