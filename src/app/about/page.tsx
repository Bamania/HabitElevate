"use client"
import React from 'react';
import { Sprout, ArrowRight, CheckCircle } from 'lucide-react';

function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div className="flex items-center">
              <Sprout className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-lg font-bold text-gray-800">HabitElevate</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">About</a>
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Contact</a>
            </div>
          </div>
          <div>
            <a href="#started" className="bg-teal-400 text-white px-4 py-2 rounded-md hover:bg-teal-500 transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* About Header */}
      <section className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          About HabitElevate
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Helping you build better habits, one small step at a time
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <p className="text-gray-700 mb-6">
            HabitElevate transforms the proven principles of habit formation into 
            personalized, actionable plans that empower you to achieve lasting positive 
            change. Our platform combines behavioral science with intuitive technology to 
            help you build and maintain habits that stick.
          </p>
          
          <p className="text-gray-700 mb-6">
            We understand that meaningful change doesn't happen overnight. That's why our 
            approach focuses on small, incremental improvements that compound over time. 
            Through smart tracking, gentle reminders, and data-driven insights, we make it 
            easier than ever to turn positive behaviors into lasting habits.
          </p>
          
          <p className="text-gray-700">
            Whether you're looking to improve your health, boost productivity, or develop new 
            skills, HabitElevate provides the structure and support you need to succeed on 
            your journey to personal growth.
          </p>
        </div>
        
        <div className="md:w-1/2">
          <div className="bg-orange-300 rounded-lg p-8 relative">
            <img 
              src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80" 
              alt="Notebook with checkmarks representing habit tracking" 
              className="rounded-lg w-full h-auto shadow-lg"
            />
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-md">
              <CheckCircle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Sprout className="h-6 w-6 text-teal-500 mr-2" />
            <p className="text-gray-700">
              Inspired by James Clear's <a href="https://jamesclear.com/atomic-habits" className="text-teal-500 hover:text-teal-600 font-medium">Atomic Habits</a>, we've created a platform that makes it easier than ever to implement the proven strategies for habit formation and personal development.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-12 text-center">
        <a 
          href="#journey" 
          className="inline-flex items-center justify-center px-6 py-3 bg-teal-400 text-white rounded-md hover:bg-teal-500 transition-colors"
        >
          <span>Start Your Habit Journey</span>
          <ArrowRight className="h-5 w-5 ml-2" />
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 mt-auto">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Sprout className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 text-lg font-bold text-gray-800">HabitElevate</span>
              </div>
              <p className="text-gray-600 text-sm">
                Building better habits, together.
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-800 font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">Pricing</a></li>
                <li><a href="#faq" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-800 font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">About</a></li>
                <li><a href="#blog" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">Blog</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-800 font-medium mb-4">Stay Updated</h3>
              <p className="text-gray-600 text-sm mb-4">Subscribe to our newsletter for tips on habit formation.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 text-sm flex-grow"
                />
                <button className="bg-teal-400 text-white px-4 py-2 rounded-r-md hover:bg-teal-500 transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-gray-600 text-sm">© 2025 HabitElevate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;