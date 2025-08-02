import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, User, DollarSign } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  function handleGoogleClick() {
    try {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!isRegister) {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        }, {
          withCredentials: true
        });

        if (response.status == 200) {
          window.location.reload();
        }

        console.log(response.status);
      } else {
        console.log(formData);
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData);
        setIsRegister(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-white">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-blue-50 to-gray-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-blue-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-300 rounded-full"></div>
          <div className="absolute bottom-32 right-10 w-12 h-12 bg-blue-600 rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-8 xl:p-12 w-full">
          <div className="text-center max-w-lg">
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-xl">
                <span className="text-5xl text-blue-600 font-bold">₹</span>
              </div>
              <h1 className="text-5xl xl:text-6xl font-bold mb-4 text-blue-900">
                ShareFair
              </h1>
              <p className="text-xl xl:text-2xl font-medium text-gray-600">
                Split Expenses, Share Fairly
              </p>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl xl:text-4xl font-bold text-gray-800">
                Simplify Group Expenses
              </h2>
              <p className="text-lg xl:text-xl text-gray-600">
                Track shared expenses with friends and family. Never worry about who owes what again.
              </p>

              <div className="mt-8 space-y-4 text-left">
                {[
                  "Easy expense tracking",
                  "Smart split calculations",
                  "Real-time notifications",
                  "Secure payment reminders"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center group">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="text-lg text-gray-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-gray-200 rounded-full mb-4 shadow-lg">
              <span className="text-3xl text-blue-600 font-bold">₹</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-900">
              ShareFair
            </h1>
            <p className="text-sm mt-2 text-gray-600">
              Split expenses the smart way
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            {/* Form Heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-6">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                {isRegister ? 'Join ShareFair' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-gray-600">
                {isRegister ? "Create your account to get started" : "Sign in to access your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              {isRegister && (
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm text-gray-900 placeholder-gray-400"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm text-gray-900 placeholder-gray-400"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm text-gray-900 placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            {/* Toggle Register/Login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 hover:underline"
                >
                  {isRegister ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
            {!isRegister && (<div onClick={() => navigate('/forgot')}>
              Forgot Password
            </div>)}

            {/* Divider */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <div className="mt-6">
              <button
                onClick={handleGoogleClick}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02]"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Terms and Privacy */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}