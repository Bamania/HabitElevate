"use client";
import { useState } from "react";
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center">Get in Touch</h2> 
        <p className="text-center text-gray-600">Questions or feedback? We’d love to hear from you.</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              placeholder="How can we help?"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 rounded-md flex justify-center items-center"
          >
            Send Message
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          📧 Email us directly at <a href="mailto:support@habitelevate.com" className="text-blue-500">support@habitelevate.com</a>
        </div>
      </div>

      <footer className="mt-10 text-center text-gray-500">
        <p>© 2024 HabitElevate. All rights reserved.</p>
      </footer>
    </div>
  );
}
