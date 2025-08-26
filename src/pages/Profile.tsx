import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FloatingAIAssistant } from '@/components/ai/AIChatBot';
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
import { useSupabaseAuth, useUserProfile, useAchievements, useUserProgress } from '@/hooks/useSupabase';

export default function Profile() {
  const { user } = useSupabaseAuth();
  const { profile } = useUserProfile(user?.id || '');
  const { achievements } = useAchievements(user?.id || '');
  const { progress } = useUserProgress(user?.id || '');

  const [certificates, setCertificates] = useState<any[]>([]);

  // Example: fetch certificates from Supabase table
  useEffect(() => {
    async function fetchCertificates() {
      if (!user?.id) return;
      const { data, error } = await fetch(`/api/user-certificates?userId=${user.id}`).then(res => res.json());
      if (!error) setCertificates(data || []);
    }
    fetchCertificates();
  }, [user?.id]);

  const learningStats = {
    totalXP: profile?.xp || 0,
    currentLevel: profile?.level || 'Seed',
    nextLevel: 'Branch',
    xpToNext: profile?.xp_to_next || 350,
    coursesCompleted: progress.filter(p => p.completed).length,
    totalCourses: profile?.total_courses || 6,
    streakDays: profile?.streak_days || 0,
    longestStreak: profile?.longest_streak || 12,
    timeSpent: profile?.time_spent || '0 hours',
    projectsCompleted: profile?.projects_completed || 0
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
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
                  {profile?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{profile?.name}</h1>
                <p className="text-lg opacity-90 mb-4">{profile?.email}</p>
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
                  <Progress value={(learningStats.totalXP / learningStats.xpToNext) * 100} className="h-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {learningStats.xpToNext - learningStats.totalXP} XP needed for next level
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</p>
                    <p className="text-2xl font-bold">{learningStats.coursesCompleted}/{learningStats.totalCourses}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent Learning</p>
                    <p className="text-2xl font-bold">{learningStats.timeSpent}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
                    <p className="text-2xl font-bold">{learningStats.longestStreak} days</p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500" />
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Projects Built</p>
                    <p className="text-2xl font-bold">{learningStats.projectsCompleted}</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" /> Achievements ({achievements.length})
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" /> Share
                </Button>
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
                        <p className="text-xs text-gray-500 dark:text-gray-500">{achievement.earned_at}</p>
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
                  <Star className="h-5 w-5 mr-2" /> Certificates ({certificates.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certificates.map((cert, index) => (
                  <div key={index} className="p-4 border rounded-lg border-gray-200 dark:border-gray-600 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{cert.title}</h3>
                      <Badge variant="outline" className="text-xs">{cert.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Issued: {cert.issueDate}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">ID: {cert.credentialId}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="h-3 w-3 mr-2" /> Download PDF
                    </Button>
                  </div>
                ))}
                {certificates.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Complete courses to earn certificates!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FloatingAIAssistant 
        context={`Profile page for ${profile?.name}. Provide guidance on achievements, certificates, learning stats, and tips to reach next level.`} 
      />
    </Layout>
  );
}
