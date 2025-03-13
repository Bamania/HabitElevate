"use client";
import Image from "next/image";
import StairImage from "../../public/images/Stair.jpg";
import { Sprout, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from "next/navigation";
export default function Home() {
  const route=useRouter();  
  return (
    <>
  <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 flex flex-col">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sprout className="h-8 w-8 text-teal-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">HabitElevate</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-teal-600 transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-teal-600 transition-colors">Pricing</a>
            <a href="#contact" className="text-gray-600 hover:text-teal-600 transition-colors">Contact</a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#login" className="text-gray-600 hover:text-teal-600 transition-colors">Login</a>
            <a href="#signup" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">Sign Up</a>
          </div>
          <button className="md:hidden text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Transform Your Habits, <span className="text-teal-600">Elevate Your Life</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Personalized plans to turn small changes into big results.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row">
            <button onClick={()=>route.push("/input")} className="bg-emerald-500 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <a href="#learn-more" className="border border-gray-300 text-gray-600 px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
              Learn More
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
            alt="Growing plant symbolizing habit growth" 
            className="rounded-lg shadow-xl max-w-full h-auto"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">How HabitElevate Works</h2>
            <p className="mt-4 text-xl text-gray-600">Simple steps to transform your daily habits</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-teal-50 p-8 rounded-lg">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="text-teal-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Track Your Habits</h3>
              <p className="text-gray-600">Easily log your daily habits and track your progress over time with our intuitive interface.</p>
            </div>
            <div className="bg-teal-50 p-8 rounded-lg">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="text-teal-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Analyze Patterns</h3>
              <p className="text-gray-600">Gain insights into your behavior patterns and identify areas for improvement.</p>
            </div>
            <div className="bg-teal-50 p-8 rounded-lg">
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="text-teal-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Build Consistency</h3>
              <p className="text-gray-600">Develop lasting habits through consistent practice and our proven methodology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">The Science of Habit Formation</h2>
              <p className="text-gray-600 mb-6">
                Based on the principles from "Atomic Habits," our platform helps you make tiny changes that lead to remarkable results.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Make habits obvious, attractive, easy, and satisfying</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Focus on systems instead of goals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Track your progress with detailed analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Build a positive identity through consistent habits</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Person meditating representing mindful habit building" 
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600">Real stories from people who transformed their lives</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 font-bold">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Jane Doe</h4>
                  <p className="text-gray-600 text-sm">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-600">
                "HabitElevate helped me establish a consistent morning routine that has transformed my productivity. I've never felt more focused and energized."
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 font-bold">MS</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Michael Smith</h4>
                  <p className="text-gray-600 text-sm">Software Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The habit tracking features are intuitive and the insights have helped me break bad habits I've struggled with for years. Highly recommend!"
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 font-bold">AJ</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Alex Johnson</h4>
                  <p className="text-gray-600 text-sm">Fitness Coach</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I recommend HabitElevate to all my clients. The small steps approach aligns perfectly with sustainable fitness progress."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Habits?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of others who have already started their journey to better habits and improved lives.
          </p>
          <a href="#signup" className="bg-white text-teal-600 px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors inline-block">
            Start Your Free Trial
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Sprout className="h-6 w-6 text-teal-400" />
                <span className="ml-2 text-lg font-bold">HabitElevate</span>
              </div>
              <p className="text-gray-400">
                Helping you build better habits, one small step at a time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#press" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#guides" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#terms" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2025 HabitElevate. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#twitter" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#facebook" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#instagram" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>

    </>

  );
}
