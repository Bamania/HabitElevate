"use client"

import React, { useState } from 'react';
import { Sprout, ChevronLeft, Send } from 'lucide-react';
import { useAppDispatch } from '@/lib/hooks';
import { setGeneratedText } from '@/lib/features/aiGeneratedslice/GeneratedSlice';
import { useRouter } from 'next/navigation';
function InputPage() {
  const [formData,setFormData] =useState({
    habitName:'',
    frequency:'',
    motivation:'',
    obstacles:'',
  })
   const route=useRouter();  
  const dispatch=useAppDispatch();


  const handleSubmit=async(e:any)=>{
    e.preventDefault()
    alert("clicked")
    const response=await fetch("/api/generate",{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData)
      
    }) 
    const generatedData=await response.json()
    console.log("Aigen Response",generatedData.data);
    const splitArr=generatedData.data.split('`')
    const AIGenContent=splitArr[3].split("json")[1];
    const jsonData=JSON.parse(AIGenContent)
    
    dispatch(setGeneratedText(jsonData))
    route.push('/plan')
  }

  const handleChange=(e:any)=>{
    
    setFormData({...formData,[e.target.name]:e.target.value})
    
    console.log(formData) 
  }

//   function debounce(func,delay){
//     let TimerId;
//     return ()=>{
//       clearTimeout(TimerId);
//       TimerId= setTimeout(func(),delay);
//     }
//   }

//   function radFunc(){
//     console.log("radFunc")
//   }
// const temp_function= debounce(radFunc,2000)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sprout className="h-8 w-8 text-teal-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">HabitElevate</span>
          </div>
          <a href="#" className="text-teal-600 hover:text-teal-700 transition-colors flex items-center">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Home
          </a>
        </div>
      </nav>

      {/* Form Section */}
      <section className="container mx-auto px-6 py-8 flex-grow">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Tell Us About Your Habit</h1>
            <p className="mt-3 text-lg text-gray-600">
              Answer these questions to get a tailored plan based on Atomic Habits principles.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Habit Name */}
            <div>
              <label htmlFor="habitName" className="block text-sm font-medium text-gray-700 mb-1">
                What habit do you want to build or break?
              </label>
              <input
                type="text"
                id="habitName"
                name="habitName"
                value={formData.habitName}
                onChange={handleChange}
                placeholder="e.g., Morning meditation, Quitting smoking"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            {/* Frequency */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                How often do you currently do this habit?
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="" disabled>Select an option</option>
                <option value="never">Never</option>
                <option value="rarely">Rarely</option>
                <option value="once-a-week">Once a week</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            {/* Motivation */}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                How motivated are you to do this habit?
              </span>
              <div className="flex space-x-6 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="low"
                    name="motivation"
                    value="low"
                    checked={formData.motivation === 'low'}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    required
                  />
                  <label htmlFor="low" className="ml-2 text-gray-700">Low</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="medium"
                    name="motivation"
                    value="medium"
                    checked={formData.motivation === 'medium'}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <label htmlFor="medium" className="ml-2 text-gray-700">Medium</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="high"
                    name="motivation"
                    value="high"
                    checked={formData.motivation === 'high'}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <label htmlFor="high" className="ml-2 text-gray-700">High</label>
                </div>
              </div>
            </div>

            {/* Obstacles */}
            <div>
              <label htmlFor="obstacles" className="block text-sm font-medium text-gray-700 mb-1">
                What makes this habit hard for you?
              </label>
              <textarea
                id="obstacles"
                name="obstacles"
                value={formData.obstacles}
                onChange={handleChange}
                placeholder="e.g., Lack of time, Distractions, Low energy"
                rows={3}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              ></textarea>
            </div>

            {/* Ideal Time */}
            {/* <div>
              <label htmlFor="idealTime" className="block text-sm font-medium text-gray-700 mb-1">
                When would you ideally do this habit?
              </label>
              <input
                type="text"
                id="idealTime"
                name="idealTime"
                value={formData.idealTime}
                onChange={handleChange}
                placeholder="e.g., After breakfast, Before bed, During lunch break"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div> */}

            {/* Resources */}
            {/* <div>
              <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-1">
                What resources do you have available?
              </label>
              <input
                type="text"
                id="resources"
                name="resources"
                value={formData.resources}
                onChange={handleChange}
                placeholder="e.g., Smartphone, Gym membership, Quiet space"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div> */}

            {/* Reward */}
            {/* <div>
              <label htmlFor="reward" className="block text-sm font-medium text-gray-700 mb-1">
                What reward would you enjoy after doing this habit?
              </label>
              <input
                type="text"
                id="reward"
                name="reward"
                value={formData.reward}
                onChange={handleChange}
                placeholder="e.g., Cup of coffee, 10 minutes of social media, A small treat"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div> */}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-emerald-500 text-white px-6 py-4 rounded-md text-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center"
              >
                Generate My Plan
                <Send className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <a 
            href="https://jamesclear.com/atomic-habits" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-teal-300 hover:text-teal-200 transition-colors"
          >
            Learn More About Atomic Habits
          </a>
          <p className="mt-2 text-gray-400">© 2025 HabitElevate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default InputPage;