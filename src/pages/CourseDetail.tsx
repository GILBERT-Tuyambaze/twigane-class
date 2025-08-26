import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FloatingAIAssistant } from '@/components/ai/AIChatBot';
import { BookOpen, CheckCircle, Lock, PlayCircle, Clock, Users, Star } from 'lucide-react';
import { useCourseDetails, useSupabaseAuth, useUserProgress } from '@/hooks/useSupabase';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { course, loading } = useCourseDetails(id || '');
  const { progress } = useUserProgress(user?.id);

  if (loading) return <Layout><div className="p-6">Loading course...</div></Layout>;
  if (!course) return <Layout><div className="p-6">Course not found.</div></Layout>;

  const userProgress = progress.find(p => p.course_id === course.id)?.progress || 0;
  const totalLessons = course.lessons?.length || 0;
  const completedLessons = course.lessons?.filter((l: any) => l.completed).length || 0;
  const courseProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleStartLesson = (lessonId: string) => {
    navigate(`/lessons/${lessonId}`);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Course Header */}
        <Card className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Badge className="bg-white text-orange-600 mb-4">{course.difficulty}</Badge>
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg opacity-90 mb-6">{course.description}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />{course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />{course.students.toLocaleString()} students
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400" />{course.rating}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-white text-gray-900">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Your Progress</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{completedLessons} of {totalLessons} lessons</span>
                          <span>{courseProgress}%</span>
                        </div>
                        <Progress value={courseProgress} className="h-3" />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white">
                        <PlayCircle className="h-4 w-4 mr-2" />Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center"><BookOpen className="h-5 w-5 mr-2" />Course Lessons</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-gray-200 dark:divide-gray-600">
            {course.lessons?.map((lesson: any, index: number) => (
              <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center space-x-3">
                  {lesson.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : index === 0 || course.lessons[index - 1]?.completed ? (
                    <PlayCircle className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.duration}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={lesson.completed ? "outline" : "default"}
                  className={lesson.completed ? "" : "bg-gradient-to-r from-orange-500 to-blue-500 text-white"}
                  disabled={!lesson.completed && index > 0 && !course.lessons[index - 1]?.completed}
                  onClick={() => handleStartLesson(lesson.id)}
                >
                  {lesson.completed ? 'Review' : 'Start'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <FloatingAIAssistant context={`${course.title} course`} courseId={course.id?.toString()} />
      </div>
    </Layout>
  );
}
