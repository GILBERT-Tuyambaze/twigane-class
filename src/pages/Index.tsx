import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloatingAIAssistant } from '@/components/ai/AIChatBot';
import { 
  Code, 
  Trophy, 
  Users, 
  Zap, 
  Star, 
  BookOpen,
  Rocket,
  Heart,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Code,
    title: 'Interactive Coding',
    description: 'Learn by doing with our built-in code editor and instant feedback'
  },
  {
    icon: Trophy,
    title: 'Gamified Learning',
    description: 'Earn XP, badges, and certificates as you progress through courses'
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Connect with fellow learners and get help when you need it'
  },
  {
    icon: Zap,
    title: 'AI Mentor',
    description: 'Get personalized guidance and instant feedback powered by AI'
  }
];

const tracks = [
  {
    title: 'Web Basics',
    description: 'HTML, CSS, JavaScript fundamentals',
    color: 'from-orange-500 to-yellow-500',
    lessons: 25
  },
  {
    title: 'React Mastery',
    description: 'Complete React development course',
    color: 'from-blue-500 to-indigo-500',
    lessons: 35
  },
  {
    title: 'Python Power',
    description: 'From beginner to AI/ML basics',
    color: 'from-green-500 to-emerald-500',
    lessons: 40
  },
  {
    title: 'Database Design',
    description: 'Supabase and SQL fundamentals',
    color: 'from-purple-500 to-pink-500',
    lessons: 20
  }
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-blue-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-orange-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                Twigane Class
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
                  Start Learning Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <Badge className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-1">
              100% Free Forever
            </Badge>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-blue-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700">
              Learn Coding the Fun Way
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-in fade-in delay-300 duration-700">
              Master web development, React, Python, and more with our gamified learning platform. 
              Get AI-powered mentoring and join a supportive community of learners.
            </p>
            
            <div className="flex justify-center space-x-4 animate-in fade-in delay-500 duration-700">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-8 py-3 text-lg">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
            Why Choose Twigane Class?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
            Learning Tracks
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tracks.map((track, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-full h-3 bg-gradient-to-r ${track.color} rounded-full mb-4`} />
                  <h3 className="text-lg font-semibold mb-2">{track.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{track.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{track.lessons} lessons</Badge>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-500 to-blue-500 rounded-2xl p-12 text-white">
            <Heart className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Coding Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of learners already mastering coding skills with Twigane Class
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg">
                <Star className="mr-2 h-5 w-5" />
                Start Learning Now - It's Free!
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-orange-200 dark:border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Twigane Class
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Free coding education for everyone. Built with #love for the community.
            for more info contact +250793438873/tuyambazegilbert <link href="https://gilbert-tuyambaze.vercel.app/">Powered by Gilbert Tuyambaze </link>
          </p>
        </div>
      </footer>
      {/* Floating AI Assistant */}
<FloatingAIAssistant 
  context={`Welcome page for new learners. Guide users about courses, tracks, features, and how to start their coding journey.`} 
/>

    </div>
  );
}
