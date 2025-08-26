import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FloatingAIAssistant } from '@/components/ai/AIChatBot';
import { ChevronLeft, ChevronRight, CheckCircle, Code, BookOpen, Play } from 'lucide-react';
import { useCourseDetails, useUserProgress, useSupabaseAuth } from '@/hooks/useSupabase';

export default function LessonView() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  const { course, loading: courseLoading } = useCourseDetails(courseId || '');
  const { progress, markLessonComplete } = useUserProgress(user?.id);

  const [activeTab, setActiveTab] = useState('content');
  const [codeInput, setCodeInput] = useState('');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    if (!course) return;
    const currentLesson = course.lessons.find((l: any) => l.id.toString() === lessonId);
    setLesson(currentLesson);

    // Initialize code input if lesson has code
    if (currentLesson?.content?.codeExample) {
      setCodeInput(currentLesson.content.codeExample);
    }
  }, [course, lessonId]);

  if (courseLoading) return <Layout><div className="p-6">Loading lesson...</div></Layout>;
  if (!lesson) return <Layout><div className="p-6">Lesson not found.</div></Layout>;

  const userLessonProgress = progress.find(p => p.lesson_id === lesson.id)?.completed || false;

  const handleQuizSubmit = () => setShowResult(true);

  const handleCompleteLesson = async () => {
    if (!user) return;
    await markLessonComplete(lesson.id);
    alert('Lesson completed! 🎉');
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (!course) return;
    const index = course.lessons.findIndex((l: any) => l.id === lesson.id);
    const targetLesson = direction === 'prev'
      ? course.lessons[index - 1]
      : course.lessons[index + 1];
    if (targetLesson) navigate(`/courses/${course.id}/lessons/${targetLesson.id}`);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{course.title}</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => handleNavigation('prev')} disabled={course.lessons[0].id === lesson.id}>
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white" onClick={() => handleNavigation('next')}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Lesson Progress */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Lesson Progress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {userLessonProgress ? '100%' : '0%'}
              </span>
            </div>
            <Progress value={userLessonProgress ? 100 : 0} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="border-b border-gray-200 dark:border-gray-600">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="content" className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" /> Content
                      </TabsTrigger>
                      <TabsTrigger value="code" className="flex items-center">
                        <Code className="h-4 w-4 mr-2" /> Practice
                      </TabsTrigger>
                      {lesson.content?.quiz && (
                        <TabsTrigger value="quiz" className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" /> Quiz
                        </TabsTrigger>
                      )}
                    </TabsList>
                  </div>

                  {/* Lesson Content */}
                  <TabsContent value="content" className="p-6">
                    <div className="space-y-4">
                      {lesson.content.text.split('\n\n').map((paragraph: string, index: number) => (
                        <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Code Practice */}
                  {lesson.content?.codeExample && (
                    <TabsContent value="code" className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Try it yourself!</h3>
                        <Textarea
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value)}
                          className="font-mono text-sm h-64"
                        />
                        <Button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
                          <Play className="h-4 w-4 mr-2" /> Run Code
                        </Button>
                        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                          <h4 className="font-medium mb-2">Preview:</h4>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Code preview would appear here in a real implementation
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  {/* Quiz */}
                  {lesson.content?.quiz && (
                    <TabsContent value="quiz" className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Knowledge Check</h3>
                        <Card className="p-4">
                          <p className="font-medium mb-4">{lesson.content.quiz.question}</p>
                          <div className="space-y-2">
                            {lesson.content.quiz.options.map((option: string, index: number) => (
                              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name="quiz"
                                  value={index}
                                  checked={quizAnswer === index}
                                  onChange={() => setQuizAnswer(index)}
                                  className="text-orange-500"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                          {!showResult && (
                            <Button
                              onClick={handleQuizSubmit}
                              disabled={quizAnswer === null}
                              className="mt-4 bg-gradient-to-r from-orange-500 to-blue-500 text-white"
                            >
                              Submit Answer
                            </Button>
                          )}
                          {showResult && (
                            <div className="mt-4">
                              {quizAnswer === lesson.content.quiz.correct ? (
                                <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
                                  <p className="text-green-800 dark:text-green-200">✅ Correct! Great job!</p>
                                </div>
                              ) : (
                                <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                                  <p className="text-red-800 dark:text-red-200">
                                    ❌ Not quite right. Correct answer is {lesson.content.quiz.options[lesson.content.quiz.correct]}.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </Card>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Lesson Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleCompleteLesson}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Complete Lesson
                </Button>
                <Button variant="outline" className="w-full">Ask AI Mentor</Button>
                <Button variant="outline" className="w-full">Discussion Forum</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FloatingAIAssistant context={lesson.title} lessonId={lesson.id?.toString()} />
    </Layout>
  );
}
