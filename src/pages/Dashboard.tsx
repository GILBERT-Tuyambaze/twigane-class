import React from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  BookOpen, 
  Target, 
  Clock, 
  Flame, 
  Star,
  PlayCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const learningStats = [
    { label: 'Total XP', value: user?.xp || 0, icon: Trophy, color: 'text-yellow-600' },
    { label: 'Lessons Completed', value: user?.completedLessons?.length || 0, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Current Streak', value: user?.streak || 0, icon: Flame, color: 'text-orange-600' },
    { label: 'Badges Earned', value: user?.badges?.length || 0, icon: Star, color: 'text-purple-600' }
  ];

  const currentCourses = [
    {
      id: 1,
      title: 'Web Basics: HTML & CSS',
      progress: 75,
      nextLesson: 'CSS Flexbox Mastery',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      progress: 45,
      nextLesson: 'Array Methods & Iteration',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 3,
      title: 'React Development',
      progress: 20,
      nextLesson: 'Component Props & State',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const recentBadges = [
    { name: 'First Steps', description: 'Completed your first lesson', earned: '2 days ago' },
    { name: 'HTML Master', description: 'Mastered HTML fundamentals', earned: '1 week ago' },
    { name: 'Streak Keeper', description: '5-day learning streak', earned: 'Today' }
  ];

  const weeklyChallenge = {
    title: 'Build a Personal Portfolio',
    description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript',
    progress: 60,
    timeLeft: '3 days',
    reward: '50 XP + Portfolio Badge'
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready to continue your coding journey?
            </p>
          </div>
          <Badge className={`px-4 py-2 text-lg ${
            user?.level === 'Seed' ? 'bg-green-500' :
            user?.level === 'Leaf' ? 'bg-blue-500' :
            user?.level === 'Branch' ? 'bg-purple-500' :
            'bg-gradient-to-r from-orange-500 to-blue-500'
          } text-white`}>
            {user?.level} Level
          </Badge>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningStats.map((stat, index) => (
            <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCourses.map((course) => (
                  <div key={course.id} className="p-4 border rounded-lg border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{course.title}</h3>
                      <Badge variant="outline">{course.progress}% Complete</Badge>
                    </div>
                    <Progress value={course.progress} className="mb-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Next: {course.nextLesson}
                      </div>
                      <Button size="sm" className={`bg-gradient-to-r ${course.color} text-white`}>
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Weekly Challenge */}
            <Card className="bg-gradient-to-br from-orange-500 to-blue-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Weekly Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">{weeklyChallenge.title}</h3>
                <p className="text-sm opacity-90 mb-4">{weeklyChallenge.description}</p>
                <Progress value={weeklyChallenge.progress} className="mb-3" />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {weeklyChallenge.timeLeft} left
                  </div>
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    {weeklyChallenge.reward}
                  </div>
                </div>
                <Button className="w-full mt-4 bg-white text-orange-600 hover:bg-gray-100">
                  View Challenge
                </Button>
              </CardContent>
            </Card>

            {/* Recent Badges */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentBadges.map((badge, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{badge.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{badge.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{badge.earned}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <BookOpen className="h-6 w-6 mb-2" />
                Browse Courses
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Target className="h-6 w-6 mb-2" />
                Take Challenge
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                Schedule Learning
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                View Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}