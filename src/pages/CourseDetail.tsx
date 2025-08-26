import React from 'react';
import { Layout } from '@/components/Layout';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  PlayCircle, 
  CheckCircle, 
  Lock, 
  Clock,
  Users,
  Star,
  BookOpen
} from 'lucide-react';

const courseData = {
  id: 1,
  title: 'Web Basics: HTML, CSS & JavaScript',
  description: 'Master the fundamentals of web development from scratch. Learn HTML structure, CSS styling, and JavaScript interactivity to build your first websites.',
  instructor: 'Twigane Team',
  duration: '8 weeks',
  students: 1234,
  rating: 4.8,
  difficulty: 'Beginner',
  progress: 75,
  modules: [
    {
      id: 1,
      title: 'HTML Fundamentals',
      lessons: [
        { id: 1, title: 'Introduction to HTML', duration: '15 min', completed: true },
        { id: 2, title: 'HTML Document Structure', duration: '20 min', completed: true },
        { id: 3, title: 'Common HTML Elements', duration: '25 min', completed: true },
        { id: 4, title: 'Forms and Input Elements', duration: '30 min', completed: false }
      ]
    },
    {
      id: 2,
      title: 'CSS Styling',
      lessons: [
        { id: 5, title: 'CSS Basics and Selectors', duration: '20 min', completed: true },
        { id: 6, title: 'Box Model and Layout', duration: '25 min', completed: true },
        { id: 7, title: 'Flexbox Layout', duration: '30 min', completed: false },
        { id: 8, title: 'Grid Layout', duration: '35 min', completed: false }
      ]
    },
    {
      id: 3,
      title: 'JavaScript Basics',
      lessons: [
        { id: 9, title: 'Variables and Data Types', duration: '25 min', completed: false },
        { id: 10, title: 'Functions and Control Flow', duration: '30 min', completed: false },
        { id: 11, title: 'DOM Manipulation', duration: '35 min', completed: false },
        { id: 12, title: 'Event Handling', duration: '30 min', completed: false }
      ]
    }
  ]
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { course, loading } = useCourseDetails(id || '');
  const { progress } = useUserProgress(user?.id);

  // Use Supabase data if available, fallback to mock data
  const courseData = course || {
    id: 1,
    title: 'Web Basics: HTML, CSS & JavaScript',
    description: 'Master the fundamentals of web development from scratch. Learn HTML structure, CSS styling, and JavaScript interactivity to build your first websites.',
    instructor: 'Twigane Team',
    duration: '8 weeks',
    students: 1234,
    rating: 4.8,
    difficulty: 'Beginner',
    progress: 75,
    lessons: [
      { id: 1, title: 'Introduction to HTML', duration: '15 min', completed: true, order_index: 1 },
      { id: 2, title: 'HTML Document Structure', duration: '20 min', completed: true, order_index: 2 },
      { id: 3, title: 'Common HTML Elements', duration: '25 min', completed: true, order_index: 3 },
      { id: 4, title: 'Forms and Input Elements', duration: '30 min', completed: false, order_index: 4 },
      { id: 5, title: 'CSS Basics and Selectors', duration: '20 min', completed: true, order_index: 5 },
      { id: 6, title: 'Box Model and Layout', duration: '25 min', completed: true, order_index: 6 },
      { id: 7, title: 'Flexbox Layout', duration: '30 min', completed: false, order_index: 7 },
      { id: 8, title: 'Grid Layout', duration: '35 min', completed: false, order_index: 8 },
      { id: 9, title: 'Variables and Data Types', duration: '25 min', completed: false, order_index: 9 },
      { id: 10, title: 'Functions and Control Flow', duration: '30 min', completed: false, order_index: 10 }
    ]
  };

  const handleStartLesson = (lessonId: number | string) => {
    navigate(`/lessons/${lessonId}`);
  };

  const totalLessons = courseData.lessons?.length || 0;
  const completedLessons = courseData.lessons?.filter(lesson => lesson.completed).length || 0;
  const courseProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
          </div>
        </div>
      </Layout>
    );
  }



  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Course Header */}
        <Card className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Badge className="bg-white text-orange-600 mb-4">
                  {courseData.difficulty}
                </Badge>
                <h1 className="text-4xl font-bold mb-4">{courseData.title}</h1>
                <p className="text-lg opacity-90 mb-6">{courseData.description}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {courseData.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {courseData.students.toLocaleString()} students
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400" />
                    {courseData.rating}
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
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg border-gray-200 dark:border-gray-600">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
                    <h3 className="font-semibold text-lg">
                      Course Lessons
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {totalLessons} lessons
                    </p>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {courseData.lessons?.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex items-center space-x-3">
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : lessonIndex === 0 || (courseData.lessons && courseData.lessons[lessonIndex - 1]?.completed) ? (
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
                          disabled={!lesson.completed && lessonIndex > 0 && courseData.lessons && !courseData.lessons[lessonIndex - 1]?.completed}
                          onClick={() => handleStartLesson(lesson.id)}
                        >
                          {lesson.completed ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Course Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">What you'll learn:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• HTML document structure and semantic elements</li>
                    <li>• CSS styling and modern layout techniques</li>
                    <li>• JavaScript fundamentals and DOM manipulation</li>
                    <li>• Building responsive and interactive websites</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Prerequisites:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No prior programming experience required. Just bring your curiosity!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">T</span>
                  </div>
                  <h3 className="font-semibold">{courseData.instructor}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expert educators passionate about making coding accessible to everyone.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Assistant */}
        <FloatingAIAssistant 
          context={`${courseData.title} course`} 
          courseId={courseData.id?.toString()} 
        />
      </div>
    </Layout>
  );
}