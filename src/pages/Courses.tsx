import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FloatingAIAssistant } from '@/components/ai/AIChatBot';
import { Clock, Users, Star, PlayCircle, BookOpen, Code, Database, Smartphone, Cpu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCourses, useSupabaseAuth, useUserProgress } from '@/hooks/useSupabase';


const categories = ['All', 'Web Development', 'Frontend', 'Backend', 'Programming', 'DevOps', 'Mobile'];

// Helper function to get icon based on category
const getCourseIcon = (category: string | null) => {
  switch (category?.toLowerCase()) {
    case 'web development': return Code;
    case 'frontend': return Smartphone;
    case 'backend': return Database;
    case 'programming': return Code;
    case 'devops': return Cpu;
    case 'mobile': return Smartphone;
    default: return BookOpen;
  }
};

// Helper function to get color based on category
const getCourseColor = (category: string | null) => {
  switch (category?.toLowerCase()) {
    case 'web development': return 'from-blue-500 to-purple-600';
    case 'frontend': return 'from-pink-500 to-rose-500';
    case 'backend': return 'from-green-500 to-teal-600';
    case 'programming': return 'from-orange-500 to-red-500';
    case 'devops': return 'from-gray-500 to-slate-600';
    case 'mobile': return 'from-indigo-500 to-blue-600';
    default: return 'from-gray-500 to-gray-600';
  }
};

export default function Courses() {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { courses, loading: coursesLoading } = useCourses();
  const { progress } = useUserProgress(user?.id);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('all');

  if (coursesLoading) return <Layout><div className="p-6">Loading courses...</div></Layout>;

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const userProgress = progress.find(p => p.course_id === course.id)?.progress || 0;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'enrolled' && userProgress > 0) ||
                      (activeTab === 'completed' && userProgress === 100);
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore Courses</h1>
          <p className="text-gray-600 dark:text-gray-400">Master coding skills with our comprehensive curriculum</p>
        </div>

        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-to-r from-orange-500 to-blue-500 text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="enrolled">My Courses</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => {
                const IconComponent = getCourseIcon(course.category);
                const courseColor = getCourseColor(course.category);
                const userProgress = progress.find(p => p.course_id === course.id)?.progress || 0;

                return (
                  <Card key={course.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className={`w-full h-3 bg-gradient-to-r ${courseColor} rounded-full mb-4`} />
                      <div className="flex items-start justify-between">
                        <IconComponent className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                        <Badge className={`${getDifficultyColor(course.difficulty)} text-white`}>
                          {course.difficulty || 'Beginner'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {course.description || 'Learn essential programming concepts'}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration || '4-6 weeks'}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.lessons || '12'} lessons
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.students?.toLocaleString() || '1,234'} students
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {course.rating || '4.8'}
                        </div>
                      </div>

                      {userProgress > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{userProgress}%</span>
                          </div>
                          <Progress value={userProgress} />
                        </div>
                      )}

                      <Button 
                        className={`w-full bg-gradient-to-r ${courseColor} text-white hover:opacity-90 transition-opacity`}
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        {userProgress > 0 ? 'Continue Learning' : 'Start Course'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filters to find more courses.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <FloatingAIAssistant context="Course catalog page" />
    </Layout>
  );
}