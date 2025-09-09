"use client"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { Checkbox } from "../../components/ui/checkbox"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckbox = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      acceptTerms: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions")
      return
    }

    try {
      setLoading(true)
      // Add your signup logic here
      // For now, just redirect to input page
      router.push('/input')
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during signup")
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
      <div className="absolute top-4 left-4">
        <Image
          src="/placeholder.svg?height=40&width=40"
          width={40}
          height={40}
          alt="HabitElevate logo"
          className="text-purple-600"
        />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold">Join HabitElevate Today</h2>
          <p className="text-sm text-muted-foreground">Transform Your Life, One Habit at a Time</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-2 text-sm text-red-500 bg-red-50 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="h-9"
              />
            </div>
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
            <div className="space-y-2">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-9"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.acceptTerms}
                onCheckedChange={handleCheckbox}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-cyan-500 hover:text-cyan-600">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-cyan-500 hover:text-cyan-600">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-cyan-400 hover:bg-cyan-500 h-9"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">or continue with</span>
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
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-500 hover:text-cyan-600">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

