import Link from "next/link"
import { Eye, Star, Feather, Heart, ArrowLeft, Lock, BarChart2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function habitProgress() {
  return (
    <div className=" bg-gradient-to-br from-blue-600 to-teal-500  p-8 text-white font-sans">
    <header className="mb-8">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
                <span className="material-symbols-outlined text-3xl mr-2">calendar_month</span>
                <h1 className="text-3xl font-bold">HabitElevate</h1>
            </div>
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined p-2 rounded-full hover:bg-blue-500/30 transition-all cursor-pointer">
                    notifications
                </span>
                <span className="material-symbols-outlined p-2 rounded-full hover:bg-blue-500/30 transition-all cursor-pointer">
                    settings
                </span>
                <div className="w-10 h-10 rounded-full bg-teal-300 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white/50 transition-all">
                    <span className="material-symbols-outlined">person</span>
                </div>
            </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-1">Track Your Progress</h2>
        <p className="text-center text-lg opacity-90 mb-6">See your habits grow with real-time insights</p>
    </header>

    <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 hover:bg-white/15 transition-all transform hover:scale-102 hover:shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-80">Current Streak</h3>
                <span className="material-symbols-outlined text-teal-300">local_fire_department</span>
            </div>
            <p className="text-3xl font-bold mb-1">5 days</p>
            <p className="text-xs opacity-70">Best streak: 12 days</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 hover:bg-white/15 transition-all transform hover:scale-102 hover:shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-80">Success Rate</h3>
                <span className="material-symbols-outlined text-teal-300">trending_up</span>
            </div>
            <p className="text-3xl font-bold mb-1">87%</p>
            <p className="text-xs opacity-70">Last 30 days</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 hover:bg-white/15 transition-all transform hover:scale-102 hover:shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-80">Total Days</h3>
                <span className="material-symbols-outlined text-teal-300">calendar_today</span>
            </div>
            <p className="text-3xl font-bold mb-1">42 days</p>
            <p className="text-xs opacity-70">Since you started</p>
        </div>
    </div>

    <div className="flex flex-col gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 hover:bg-white/15 transition-all">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Weekly Progress</h3>
                <button className="bg-gradient-to-r from-teal-400 to-teal-500 px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:from-teal-300 hover:to-teal-400 transition-all transform hover:scale-105 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Log Today's Habit
                </button>
            </div>

            <div className="h-[200px] relative">
                <div className="flex justify-between items-end h-full pb-6">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                        const heights = [80, 90, 70, 95, 85, 88, 75]
                        return (
                            <div key={idx} className="flex flex-col items-center w-full">
                                <div
                                    className="w-4/5 bg-teal-300 rounded-md hover:bg-teal-200 transition-all cursor-pointer transform hover:scale-105 hover:shadow-md"
                                    style={{height: `${heights[idx]}%`}}
                                />
                                <div className="text-xs mt-2 font-medium">{day}</div>
                            </div>
                        )
                    })}
                </div>
                <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between pointer-events-none opacity-30">
                    {[0, 1, 2, 3].map((_, idx) => (
                        <div key={idx} className="border-t border-white/20 h-0"></div>
                    ))}
                </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 hover:bg-white/15 transition-all transform hover:translate-y-[-2px] hover:shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-teal-300">format_quote</span>
                    <h3 className="text-lg font-semibold">Today's Motivation</h3>
                </div>

                <p className="text-sm opacity-70">- James Clear, Atomic Habits</p>
            </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 relative overflow-hidden hover:bg-white/15 transition-all transform hover:translate-y-[-2px]">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-teal-300 text-sm font-semibold mb-2">Premium Feature</div>
                    <h3 className="text-xl font-bold mb-2">Unlock Advanced Analytics</h3>
                    <p className="text-sm opacity-80 mb-4">Get detailed insights and personalized recommendations</p>
                </div>
                <button className="bg-gradient-to-r from-teal-400 to-teal-500 px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:from-teal-300 hover:to-teal-400 transition-all transform hover:scale-105">
                    Upgrade Now
                </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-300/20 rounded-full blur-xl"></div>
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
        </div>

        <footer className="flex justify-between items-center border-t border-white/20 pt-4 mt-auto">
            <div className="text-sm opacity-70">© 2024 HabitElevate. All rights reserved.</div>
            <div className="flex gap-6">
                <a href="#" className="text-sm hover:text-teal-300 transition-colors hover:underline">
                    Plan
                </a>
                <a href="#" className="text-sm hover:text-teal-300 transition-colors hover:underline">
                    Pricing
                </a>
                <a href="#" className="text-sm hover:text-teal-300 transition-colors hover:underline">
                    Contact
                </a>
            </div>
        </footer>
    </div>
    <p className="text-lg italic mb-2">
        "Success is the product of daily habits—not once-in-a-lifetime transformations."
    </p>
</div>
  )
}
