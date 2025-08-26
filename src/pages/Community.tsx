import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  ThumbsUp, 
  Share, 
  Plus,
  Search,
  Filter,
  BookOpen,
  Code,
  Trophy,
  Users,
  Star,
  Eye,
  Heart,
  MessageSquare
} from 'lucide-react';

const forumPosts = [
  {
    id: 1,
    title: 'How to center a div - the ultimate guide',
    content: 'After struggling with CSS for weeks, I finally mastered centering divs. Here are 5 different methods that work...',
    author: 'Sarah Chen',
    avatar: 'SC',
    tags: ['CSS', 'HTML', 'Beginners'],
    likes: 24,
    replies: 8,
    views: 156,
    time: '2 hours ago',
    category: 'Help & Questions'
  },
  {
    id: 2,
    title: 'My first React project - feedback welcome!',
    content: 'Just built my first Todo app with React. Would love some feedback on my code structure and any improvements...',
    author: 'Mike Rodriguez',
    avatar: 'MR',
    tags: ['React', 'JavaScript', 'Projects'],
    likes: 31,
    replies: 12,
    views: 203,
    time: '4 hours ago',
    category: 'Show & Tell'
  },
  {
    id: 3,
    title: 'Python vs JavaScript for beginners?',
    content: "I'm new to programming and can't decide between Python and JavaScript as my first language. What would you recommend?",
    author: 'Alex Kim',
    avatar: 'AK',
    tags: ['Python', 'JavaScript', 'Career'],
    likes: 18,
    replies: 15,
    views: 298,
    time: '6 hours ago',
    category: 'Help & Questions'
  }
];

const showcaseProjects = [
  {
    id: 1,
    title: 'Personal Portfolio Website',
    description: 'Responsive portfolio built with HTML, CSS, and JavaScript',
    author: 'Emma Wilson',
    avatar: 'EW',
    likes: 42,
    views: 234,
    tech: ['HTML', 'CSS', 'JavaScript']
  },
  {
    id: 2,
    title: 'Weather App with API',
    description: 'Real-time weather app using OpenWeather API and React',
    author: 'David Park',
    avatar: 'DP',
    likes: 38,
    views: 189,
    tech: ['React', 'API', 'CSS']
  }
];

const leaderboard = [
  { rank: 1, name: 'Alex Chen', xp: 2840, badges: 12, avatar: 'AC' },
  { rank: 2, name: 'Sarah Kim', xp: 2650, badges: 10, avatar: 'SK' },
  { rank: 3, name: 'Mike Wilson', xp: 2480, badges: 9, avatar: 'MW' },
  { rank: 4, name: 'Emma Davis', xp: 2350, badges: 8, avatar: 'ED' },
  { rank: 5, name: 'David Lee', xp: 2200, badges: 7, avatar: 'DL' }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState('forum');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Community
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect, learn, and grow together with fellow developers
            </p>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="forum">
              <MessageCircle className="h-4 w-4 mr-2" />
              Forum
            </TabsTrigger>
            <TabsTrigger value="showcase">
              <Code className="h-4 w-4 mr-2" />
              Showcase
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="events">
              <Users className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forum" className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {forumPosts.map((post) => (
                <Card key={post.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-blue-500 text-white">
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center space-x-2 mb-3">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>by {post.author}</span>
                            <span>{post.time}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span className="text-sm">{post.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-sm">{post.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span className="text-sm">{post.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="showcase" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseProjects.map((project) => (
                <Card key={project.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                      <Code className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-blue-500 text-white text-xs">
                            {project.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {project.author}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{project.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{project.views}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Top Learners This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-white' :
                          user.rank === 2 ? 'bg-gray-400 text-white' :
                          user.rank === 3 ? 'bg-orange-500 text-white' :
                          'bg-gray-300 text-gray-700'
                        }`}>
                          {user.rank}
                        </div>
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-blue-500 text-white">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.badges} badges earned
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
                        {user.xp.toLocaleString()} XP
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Community Events</h2>
                <p className="text-lg opacity-90 mb-6">
                  Join our weekly coding sessions, workshops, and challenges!
                </p>
                <Button className="bg-white text-orange-600 hover:bg-gray-100">
                  View Upcoming Events
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}