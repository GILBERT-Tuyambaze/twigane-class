import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloatingAIAssistant } from '@/components/ai/AIChatBot';
import { Award } from 'lucide-react';
import { useSupabaseAuth, useAchievements } from '@/hooks/useSupabase';

export default function AchievementsPage() {
  const { user } = useSupabaseAuth();
  const { achievements, loading, refetch } = useAchievements(user?.id);

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

  if (loading) return <Layout><p className="p-6">Loading achievements...</p></Layout>;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Award className="h-6 w-6 mr-2" /> Achievements
        </h1>

        {achievements.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            You haven’t earned any achievements yet. Complete lessons and practice exercises to earn badges!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((ach, index) => (
              <Card
                key={index}
                className="flex items-center space-x-3 p-4 border rounded-lg border-gray-200 dark:border-gray-600"
              >
                <div className="text-3xl">{ach.icon || '🏆'}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-sm">{ach.name}</h3>
                    <Badge className={`${getRarityColor(ach.rarity)} text-white text-xs`}>
                      {ach.rarity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{ach.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{ach.earned}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FloatingAIAssistant 
        context={`Provide guidance about achievements earned by ${user?.name}. Suggest ways to earn new badges and XP.`} 
      />
    </Layout>
  );
}
