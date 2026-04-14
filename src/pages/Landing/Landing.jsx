import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, ShieldAlert, Gamepad2, TrendingUp, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
            NeuroSense-AI
          </span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-slate-600 font-medium hover:text-primary-600">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-50 pt-16 pb-32">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              AI-Enabled Early Dementia Screening
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Empowering individuals and families with cognitive monitoring, early risk assessment, and personalized therapy, right from your home.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center w-full sm:w-auto justify-center">
                Start Free Assessment <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/about" className="btn-outline text-lg px-8 py-4 w-full sm:w-auto justify-center bg-white">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Comprehensive Cognitive Care</h2>
            <p className="text-slate-500 mt-4 text-lg">Our holistic approach to monitoring brain health.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="inline-flex h-16 w-16 bg-blue-50 text-blue-600 rounded-full items-center justify-center mb-6">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">AI Risk Assessment</h3>
              <p className="text-slate-600">Advanced machine learning models analyze your patterns to detect early signs of cognitive decline.</p>
            </div>
            
            <div className="card text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="inline-flex h-16 w-16 bg-teal-50 text-teal-600 rounded-full items-center justify-center mb-6">
                <Gamepad2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Therapeutic Games</h3>
              <p className="text-slate-600">Engaging mini-games scientifically designed to stimulate memory, reaction time, and word recall.</p>
            </div>
            
            <div className="card text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="inline-flex h-16 w-16 bg-purple-50 text-purple-600 rounded-full items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Progress Tracking</h3>
              <p className="text-slate-600">Monitor your cognitive performance over time with clear, easy-to-read charts and personalized feedback.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}