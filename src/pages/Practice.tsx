import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FloatingAIAssistant } from '@/components/ai/AIChatBot';
import { Play } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabase';

interface PracticeExercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
}

export default function Practice() {
  const { user } = useSupabaseAuth();
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<PracticeExercise | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [output, setOutput] = useState<string | null>(null);

  // Fetch practice exercises from Supabase
  useEffect(() => {
    async function fetchExercises() {
      const res = await fetch('/api/practice-exercises').then(r => r.json());
      setExercises(res.data || []);
      if (res.data?.length) {
        setSelectedExercise(res.data[0]);
        setCodeInput(res.data[0].starterCode);
      }
    }
    fetchExercises();
  }, []);

  const handleRunCode = () => {
    // For now, just display the code as output
    // You can replace with real evaluation using server or iframe sandbox
    setOutput(codeInput);
  };

  const handleSelectExercise = (exercise: PracticeExercise) => {
    setSelectedExercise(exercise);
    setCodeInput(exercise.starterCode);
    setOutput(null);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Practice Exercises</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Exercise List */}
          <div className="lg:col-span-1 space-y-2">
            {exercises.map((ex) => (
              <Card
                key={ex.id}
                className={`p-4 cursor-pointer ${
                  selectedExercise?.id === ex.id
                    ? 'border-2 border-orange-500'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleSelectExercise(ex)}
              >
                <CardTitle className="text-sm font-semibold">{ex.title}</CardTitle>
                <CardContent className="text-xs text-gray-600 dark:text-gray-400">
                  {ex.description.slice(0, 50)}...
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-3 space-y-4">
            {selectedExercise && (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>{selectedExercise.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">{selectedExercise.description}</p>
                  <Textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className="font-mono text-sm h-64"
                    placeholder="Write your code here..."
                  />
                  <Button
                    onClick={handleRunCode}
                    className="bg-gradient-to-r from-orange-500 to-blue-500 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" /> Run Code
                  </Button>

                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Output:</h4>
                    <pre className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{output}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <FloatingAIAssistant 
        context="Help the user with coding practice exercises, debugging, and hints." 
      />
    </Layout>
  );
}
