import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Bot, MessageSquare, Zap, Shield, Code, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Bot className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI Agent Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build, deploy, and manage intelligent AI agents with real-time capabilities. 
            Connect multiple providers, track conversations, and scale your AI solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat/travel-agent" className="inline-block">
              <Button size="lg" className="w-full sm:w-auto">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Chatting
              </Button>
            </Link>
            <Link to="/demo" className="inline-block">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Zap className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Shield className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
            <p className="text-gray-600">
              Enterprise-grade security with real-time monitoring and analytics.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Code className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Developer Friendly</h3>
            <p className="text-gray-600">
              Easy-to-use SDK and APIs for seamless integration into your applications.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <BarChart3 className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Analytics & Insights</h3>
            <p className="text-gray-600">
              Comprehensive analytics to track performance and optimize your agents.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore our platform and see how AI agents can transform your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sdk" className="inline-block">
              <Button size="lg" className="w-full sm:w-auto">
                View SDK Documentation
              </Button>
            </Link>
            <Link to="/admin" className="inline-block">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}