import React from 'react'
import { Layout } from '@/components/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FloatingAIAssistant } from '@/components/ai/AIChatBot'
import { 
  Trophy, 
  BookOpen, 
  Flame, 
  Star,
  PlayCircle
} from 'lucide-react'

// Import Supabase hooks
import { useUserProfile, useUserProgress, useAchievements } from '@/hooks/useSupabase'

export default function Dashboard() {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile(user?.id)
  const { progress, loading: progressLoading } = useUserProgress(user?.id)
  const { achievements, loading: achievementsLoading } = useAchievements(user?.id)

  // Handle not logged in
  if (!user) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <h1 className="text-xl font-semibold">Please log in to view your dashboard</h1>
        </div>
      </Layout>
    )
  }

  //  Handle loading state
  if (profileLoading || progressLoading || achievementsLoading) {
    return <div className="p-6">Loading your dashboard...</div>
  }

  const learningStats = [
    { label: 'Total XP', value: profile?.xp || 0, icon: Trophy, color: 'text-yellow-600' },
    { label: 'Lessons Completed', value: (progress ?? []).length, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Current Streak', value: profile?.streak || 0, icon: Flame, color: 'text-orange-600' },
    { label: 'Badges Earned', value: (achievements ?? []).length, icon: Star, color: 'text-purple-600' }
  ]

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {profile?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready to continue your coding journey?
            </p>
          </div>
          <Badge className={`px-4 py-2 text-lg ${
            profile?.level === 'Seed' ? 'bg-green-500' :
            profile?.level === 'Leaf' ? 'bg-blue-500' :
            profile?.level === 'Branch' ? 'bg-purple-500' :
            'bg-gradient-to-r from-orange-500 to-blue-500'
          } text-white`}>
            {profile?.level} Level
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
          {/* Current Courses (from progress) */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(progress ?? []).length === 0 ? (
                  <p className="text-gray-500">No courses in progress yet. Start learning! 🚀</p>
                ) : (
                  (progress ?? []).map((course) => (
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
                        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Badges */}
          <div>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(achievements ?? []).length === 0 ? (
                  <p className="text-gray-500">No badges yet — complete lessons to earn some 🏅</p>
                ) : (
                  (achievements ?? []).slice(0, 3).map((badge, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{badge.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{badge.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{badge.earned_at}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <FloatingAIAssistant 
        context={`Dashboard for ${profile?.name || "a learner"}.
        XP: ${profile?.xp || 0}, Level: ${profile?.level || "Seed"},
        Lessons completed: ${(progress ?? []).length}, 
        Badges: ${(achievements ?? []).length}.
        Provide encouragement, coding help, and guidance.`} 
      />
    </Layout>
  )
}
