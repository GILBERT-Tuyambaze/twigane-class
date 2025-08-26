import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  Search,
  Plus,
  Edit,
  Eye,
  Settings,
  Mail,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react';

const adminStats = [
  { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'text-blue-600' },
  { label: 'Active Courses', value: '12', change: '+2', icon: BookOpen, color: 'text-green-600' },
  { label: 'Completion Rate', value: '78%', change: '+5%', icon: TrendingUp, color: 'text-purple-600' },
  { label: 'Monthly Donations', value: '$1,240', change: '+18%', icon: DollarSign, color: 'text-yellow-600' }
];

const recentUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2024-01-15', status: 'Active', progress: 45 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '2024-01-14', status: 'Active', progress: 67 },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joined: '2024-01-13', status: 'Inactive', progress: 23 },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', joined: '2024-01-12', status: 'Active', progress: 89 }
];

const courses = [
  { id: 1, title: 'Web Basics: HTML, CSS & JavaScript', students: 1234, completion: 78, status: 'Published', lastUpdated: '2024-01-10' },
  { id: 2, title: 'React Mastery Course', students: 892, completion: 65, status: 'Published', lastUpdated: '2024-01-08' },
  { id: 3, title: 'Python Programming', students: 1567, completion: 72, status: 'Published', lastUpdated: '2024-01-05' },
  { id: 4, title: 'Database Design with Supabase', students: 0, completion: 0, status: 'Draft', lastUpdated: '2024-01-15' }
];

const submissions = [
  { id: 1, student: 'Alex Chen', project: 'Personal Portfolio', course: 'Web Basics', submitted: '2024-01-15', status: 'Pending Review', grade: null },
  { id: 2, student: 'Sarah Kim', project: 'Todo App', course: 'React Mastery', submitted: '2024-01-14', status: 'Approved', grade: 92 },
  { id: 3, student: 'Mike Wilson', project: 'Calculator App', course: 'JavaScript Advanced', submitted: '2024-01-13', status: 'Needs Revision', grade: 75 }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Published':
      case 'Approved':
        return 'bg-green-500';
      case 'Inactive':
      case 'Draft':
      case 'Pending Review':
        return 'bg-yellow-500';
      case 'Needs Revision':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage users, courses, and platform analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map((stat, index) => (
            <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Recent User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-blue-500 text-white text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{user.progress}% complete</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(user.status)} text-white text-xs`}>
                          {user.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex-col bg-gradient-to-r from-orange-500 to-blue-500 text-white">
                      <Plus className="h-6 w-6 mb-2" />
                      Add Course
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <Mail className="h-6 w-6 mb-2" />
                      Send Newsletter
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <Download className="h-6 w-6 mb-2" />
                      Export Data
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <Settings className="h-6 w-6 mb-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Project Submissions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {submissions.map((submission) => (
                        <tr key={submission.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-medium">{submission.student}</p>
                            <p className="text-sm text-gray-500">{submission.course}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-medium">{submission.project}</p>
                            <p className="text-sm text-gray-500">{submission.submitted}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`${getStatusColor(submission.status)} text-white`}>
                              {submission.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {submission.grade ? (
                              <span className="font-medium">{submission.grade}/100</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" className="bg-green-500 text-white">
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button size="sm" className="bg-red-500 text-white">
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
                <p className="text-lg opacity-90 mb-6">
                  Detailed analytics and insights coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}