import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Code,
  BookOpen,
  Play
} from 'lucide-react';

const lessonData = {
  id: 1,
  title: 'Introduction to HTML',
  course: 'Web Basics: HTML, CSS & JavaScript',
  progress: 0,
  content: {
    text: `HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of web pages using markup elements.

What is HTML?
HTML consists of a series of elements that tell the browser how to display content. Elements are represented by tags.

Basic HTML Structure:
Every HTML document has a basic structure with DOCTYPE, html, head, and body elements.

Key Concepts:
1. Tags: HTML elements are enclosed in angle brackets
2. Attributes: Provide additional information about elements  
3. Nesting: Elements can contain other elements
4. Semantic HTML: Using meaningful tags for better structure

Common HTML Elements:
- h1 to h6: Headings
- p: Paragraphs
- a: Links
- img: Images
- div: Generic containers

Let's practice with some code!`,
    codeExample: `<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to HTML!</h1>
    <p>This is my first paragraph.</p>
    <a href="https://www.example.com">Visit Example</a>
</body>
</html>`,
    quiz: {
      question: "Which HTML element is used for the largest heading?",
      options: ["<h1>", "<h6>", "<header>", "<title>"],
      correct: 0
    }
  }
};

export default function LessonView() {
  const [activeTab, setActiveTab] = useState('content');
  const [codeInput, setCodeInput] = useState(lessonData.content.codeExample);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleQuizSubmit = () => {
    setShowResult(true);
  };

  const handleCompleteLesson = () => {
    alert('Lesson completed! 🎉');
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{lessonData.course}</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {lessonData.title}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Lesson Progress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{lessonData.progress}%</span>
            </div>
            <Progress value={lessonData.progress} className="h-2" />
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
                        <BookOpen className="h-4 w-4 mr-2" />
                        Content
                      </TabsTrigger>
                      <TabsTrigger value="code" className="flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Practice
                      </TabsTrigger>
                      <TabsTrigger value="quiz" className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Quiz
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="content" className="p-6">
                    <div className="space-y-4">
                      {lessonData.content.text.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Try it yourself!</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Edit the HTML code below and see how it works:
                      </p>
                      <div className="space-y-2">
                        <Textarea
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value)}
                          className="font-mono text-sm h-64"
                          placeholder="Write your HTML code here..."
                        />
                        <Button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
                          <Play className="h-4 w-4 mr-2" />
                          Run Code
                        </Button>
                      </div>
                      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                        <h4 className="font-medium mb-2">Preview:</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Code preview would appear here in a real implementation
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quiz" className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Knowledge Check</h3>
                      <Card className="p-4">
                        <p className="font-medium mb-4">{lessonData.content.quiz.question}</p>
                        <div className="space-y-2">
                          {lessonData.content.quiz.options.map((option, index) => (
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
                            {quizAnswer === lessonData.content.quiz.correct ? (
                              <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
                                <p className="text-green-800 dark:text-green-200">
                                  ✅ Correct! Great job!
                                </p>
                              </div>
                            ) : (
                              <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                                <p className="text-red-800 dark:text-red-200">
                                  ❌ Not quite right. The correct answer is {lessonData.content.quiz.options[lessonData.content.quiz.correct]}.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    </div>
                  </TabsContent>
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
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Lesson
                </Button>
                <Button variant="outline" className="w-full">
                  Ask AI Mentor
                </Button>
                <Button variant="outline" className="w-full">
                  Discussion Forum
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-orange-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Take your time to understand each concept</li>
                  <li>• Practice with the code editor</li>
                  <li>• Ask questions in the community</li>
                  <li>• Complete the quiz to test your knowledge</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}