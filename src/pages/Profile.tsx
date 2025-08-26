import React from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Trophy, 
  Star, 
  Calendar, 
  Flame, 
  BookOpen,
  Target,
  Download,
  Share,
  Edit,
  Award
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  const achievements = [
    { 
      name: 'First Steps', 
      description: 'Completed your first lesson',
      icon: '🎯',
      earned: '2024-01-15',
      rarity: 'Common'
    },
    { 
      name: 'HTML Master', 
      description: 'Mastered all HTML fundamentals',
      icon: '🏆',
      earned: '2024-01-20',
      rarity: 'Uncommon'
    },
    { 
      name: 'Streak Keeper', 
      description: 'Maintained a 7-day learning streak',
      icon: '🔥',
      earned: '2024-01-25',
      rarity: 'Rare'
    },
    { 
      name: 'Code Reviewer', 
      description: 'Helped 10 fellow learners',
      icon: '🤝',
      earned: '2024-02-01',
      rarity: 'Epic'
    }
  ];

  const certificates = [
    {
      title: 'HTML & CSS Fundamentals',
      issueDate: '2024-01-25',
      credentialId: 'TWG-HTML-001-2024',
      status: 'Verified'
    },
    {
      title: 'JavaScript Basics',
      issueDate: '2024-02-10',
      credentialId: 'TWG-JS-001-2024',
      status: 'Verified'
    }
  ];

  const learningStats = {
    totalXP: user?.xp || 0,
    currentLevel: user?.level || 'Seed',
    nextLevel: 'Branch',
    xpToNext: 350,
    coursesCompleted: 2,
    totalCourses: 6,
    streakDays: user?.streak || 0,
    longestStreak: 12,
    timeSpent: '42 hours',
    projectsCompleted: 5
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-500';
      case 'Uncommon': return 'bg-green-500';
      case 'Rare': return 'bg-blue-500';
      case 'Epic': return 'bg-purple-500';
      case 'Legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarFallback className="bg-white text-orange-600 text-2xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                <p className="text-lg opacity-90 mb-4">{user?.email}</p>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white text-orange-600 text-lg px-4 py-2">
                    <Trophy className="h-4 w-4 mr-2" />
                    {learningStats.currentLevel} Level
                  </Badge>
                  <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                    {learningStats.totalXP} XP
                  </Badge>
                  <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                    <Flame className="h-4 w-4 mr-2" />
                    {learningStats.streakDays} day streak
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="bg-white text-orange-600 border-white hover:bg-gray-100">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Learning Statistics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress to Next Level */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Progress to {learningStats.nextLevel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{learningStats.currentLevel}</span>
                    <span>{learningStats.nextLevel}</span>
                  </div>
                  <Progress value={70} className="h-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {learningStats.xpToNext - learningStats.totalXP} XP needed for next level
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Learning Stats Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</p>
                      <p className="text-2xl font-bold">{learningStats.coursesCompleted}/{learningStats.totalCourses}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent Learning</p>
                      <p className="text-2xl font-bold">{learningStats.timeSpent}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
                      <p className="text-2xl font-bold">{learningStats.longestStreak} days</p>
                    </div>
                    <Flame className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Projects Built</p>
                      <p className="text-2xl font-bold">{learningStats.projectsCompleted}</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Achievements ({achievements.length})
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg border-gray-200 dark:border-gray-600">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-sm">{achievement.name}</h3>
                          <Badge className={`${getRarityColor(achievement.rarity)} text-white text-xs`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{achievement.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{achievement.earned}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certificates */}
          <div>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Certificates ({certificates.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certificates.map((cert, index) => (
                  <div key={index} className="p-4 border rounded-lg border-gray-200 dark:border-gray-600 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{cert.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {cert.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Issued: {cert.issueDate}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                      ID: {cert.credentialId}
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="h-3 w-3 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                ))}
                
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Complete more courses to earn certificates!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}