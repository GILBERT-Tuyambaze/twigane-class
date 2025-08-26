import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Clock, 
  Users, 
  Star, 
  PlayCircle,
  BookOpen,
  Code,
  Database,
  Smartphone,
  Cpu
} from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Web Basics: HTML, CSS & JavaScript',
    description: 'Master the fundamentals of web development from scratch',
    category: 'Web Development',
    difficulty: 'Beginner',
    duration: '8 weeks',
    lessons: 25,
    students: 1234,
    rating: 4.8,
    progress: 75,
    color: 'from-orange-500 to-yellow-500',
    icon: Code,
    topics: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design']
  },
  {
    id: 2,
    title: 'React Mastery: Complete Frontend Course',
    description: 'Build modern web applications with React and ecosystem',
    category: 'Frontend',
    difficulty: 'Intermediate',
    duration: '12 weeks',
    lessons: 35,
    students: 892,
    rating: 4.9,
    progress: 45,
    color: 'from-blue-500 to-indigo-500',
    icon: Code,
    topics: ['React', 'Hooks', 'Router', 'State Management']
  },
  {
    id: 3,
    title: 'Python Programming: From Zero to Hero',
    description: 'Learn Python programming and dive into AI/ML basics',
    category: 'Programming',
    difficulty: 'Beginner',
    duration: '10 weeks',
    lessons: 40,
    students: 1567,
    rating: 4.7,
    progress: 20,
    color: 'from-green-500 to-emerald-500',
    icon: Cpu,
    topics: ['Python Basics', 'OOP', 'Data Science', 'Machine Learning']
  },
  {
    id: 4,
    title: 'Database Design with Supabase',
    description: 'Master database design and real-time applications',
    category: 'Backend',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    lessons: 20,
    students: 543,
    rating: 4.6,
    progress: 0,
    color: 'from-purple-500 to-pink-500',
    icon: Database,
    topics: ['SQL', 'Supabase', 'Real-time', 'Authentication']
  },
  {
    id: 5,
    title: 'Modern Tools & Deployment',
    description: 'Learn essential developer tools and deployment strategies',
    category: 'DevOps',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    lessons: 15,
    students: 321,
    rating: 4.5,
    progress: 0,
    color: 'from-gray-500 to-slate-600',
    icon: BookOpen,
    topics: ['Git', 'GitHub', 'Vite', 'Netlify', 'Vercel']
  },
  {
    id: 6,
    title: 'Mobile App Development Basics',
    description: 'Introduction to mobile app development concepts',
    category: 'Mobile',
    difficulty: 'Advanced',
    duration: '8 weeks',
    lessons: 28,
    students: 234,
    rating: 4.4,
    progress: 0,
    color: 'from-teal-500 to-cyan-500',
    icon: Smartphone,
    topics: ['React Native', 'Mobile UI', 'App Store', 'Performance']
  }
];

const categories = ['All', 'Web Development', 'Frontend', 'Backend', 'Programming', 'DevOps', 'Mobile'];

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('all');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'enrolled' && course.progress > 0) ||
                      (activeTab === 'completed' && course.progress === 100);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Master coding skills with our comprehensive curriculum
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 
                  "bg-gradient-to-r from-orange-500 to-blue-500 text-white" : 
                  ""
                }
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
              {filteredCourses.map((course) => {
                const IconComponent = course.icon;
                
                return (
                  <Card key={course.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className={`w-full h-3 bg-gradient-to-r ${course.color} rounded-full mb-4`} />
                      <div className="flex items-start justify-between">
                        <IconComponent className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                        <Badge className={`${getDifficultyColor(course.difficulty)} text-white`}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.description}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.lessons} lessons
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.students.toLocaleString()} students
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </div>
                      </div>

                      {course.progress > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {course.topics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {course.topics.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{course.topics.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <Button className={`w-full bg-gradient-to-r ${course.color} text-white`}>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}