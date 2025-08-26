import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, CheckCircle } from 'lucide-react';
import { useSupabaseAuth, useUserProfile } from '@/hooks/useSupabase';
import { FloatingAIAssistant } from '@/components/ai/AIChatBot';

type Challenge = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'locked';
  rewardXP: number;
};

export default function ChallengesPage() {
  const { user } = useSupabaseAuth();
  const { profile } = useUserProfile(user?.id);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetchChallenges();
  }, [user]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      // Replace this with Supabase call to fetch challenges
      // e.g., const { data } = await dbHelpers.getUserChallenges(user.id)
      const data: Challenge[] = [
        { id: 'c1', title: 'Complete HTML Lesson', description: 'Finish the first HTML lesson.', status: 'completed', rewardXP: 10 },
        { id: 'c2', title: 'Build a Personal Page', description: 'Create a personal webpage using HTML/CSS.', status: 'pending', rewardXP: 50 },
        { id: 'c3', title: 'JavaScript Quiz', description: 'Score at least 80% on JS quiz.', status: 'locked', rewardXP: 30 },
      ];
      setChallenges(data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'locked': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Trophy className="h-6 w-6 mr-2" /> Challenges
        </h1>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading challenges...</p>
        ) : challenges.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No challenges available at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="border rounded-lg border-gray-200 dark:border-gray-600 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-sm font-semibold">{challenge.title}</CardTitle>
                    <Badge className={`${getStatusColor(challenge.status)} text-white text-xs`}>
                      {challenge.status.toUpperCase()}
                    </Badge>
                  </div>
                  <CardContent className="p-0 text-xs text-gray-600 dark:text-gray-400">
                    {challenge.description}
                  </CardContent>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Reward: {challenge.rewardXP} XP</span>
                  {challenge.status === 'pending' && (
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-blue-500 text-white flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FloatingAIAssistant 
        context={`Provide guidance about coding challenges for ${user?.name}. Suggest ways to complete pending challenges and earn XP.`} 
      />
    </Layout>
  );
}
