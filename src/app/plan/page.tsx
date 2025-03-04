import Link from "next/link"
import { Eye, Star, Feather, Heart, ArrowLeft, Lock, BarChart2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function HabitPlan() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-blue-600 font-bold text-2xl">
            LOGO
          </Link>
          <nav className="flex gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/habits" className="text-gray-600 hover:text-gray-900">
              My Habits
            </Link>
            <Link href="/settings" className="text-gray-600 hover:text-gray-900">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Habit Plan</h1>
          <p className="text-gray-600">Here's how to build your habit with Atomic Habits principles</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          {/* Make it Obvious */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="text-cyan-400 w-5 h-5" />
              <h2 className="font-semibold text-gray-900">Make it Obvious</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-cyan-400 p-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-600">Set a daily reminder at 8:00 AM on your phone</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-cyan-400 p-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-600">Place your running shoes by the door</span>
              </li>
            </ul>
          </div>

          {/* Make it Attractive */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-cyan-400 w-5 h-5" />
              <h2 className="font-semibold text-gray-900">Make it Attractive</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-cyan-400 p-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-600">Join a running group for social motivation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-cyan-400 p-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-600">Get new workout gear as a milestone reward</span>
              </li>
            </ul>
          </div>

          {/* Make it Easy */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Feather className="text-cyan-400 w-5 h-5" />
              <h2 className="font-semibold text-gray-900">Make it Easy</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-cyan-400 p-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-600">Start with just 10 minutes of running</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-cyan-400 p-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-600">Prepare workout clothes the night before</span>
              </li>
            </ul>
          </div>

          {/* Make it Satisfying */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="text-cyan-400 w-5 h-5" />
              <h2 className="font-semibold text-gray-900">Make it Satisfying</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-cyan-400 p-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-600">Track your runs in the HabitElevate app</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-cyan-400 p-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-gray-600">Reward yourself with a healthy breakfast after</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" className="flex items-center gap-2 text-gray-700 border-gray-200">
            <Lock className="w-4 h-4" />
            <span>Download as PDF</span>
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded ml-1">Premium</span>
          </Button>
          <Button className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-white">
            <BarChart2 className="w-4 h-4" />
            <span>Track Your Progress</span>
          </Button>
        </div>

        {/* Back Link */}
        <div className="mt-12">
          <Link href="/input" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Input</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
