import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, User, Send, Loader2, MessageSquare, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, dbHelpers } from '@/lib/supabase'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: any
}

interface AIChatBotProps {
  context?: string
  lessonId?: string
  courseId?: string
  className?: string
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export function AIChatBot({ 
  context = '', 
  lessonId, 
  courseId, 
  className = '',
  isMinimized = false,
  onToggleMinimize 
}: AIChatBotProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(!isMinimized)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize chat session
  useEffect(() => {
    if (user && !sessionId) {
      initializeChatSession()
    }
  }, [user])

  const initializeChatSession = async () => {
    if (!user) return

    try {
      const sessionName = context 
        ? `Help with ${context}` 
        : lessonId 
        ? `Lesson Help`
        : 'AI Coding Help'

      const { data: session, error } = await dbHelpers.createChatSession(user.id, sessionName)
      
      if (error) {
        console.error('Error creating chat session:', error)
        return
      }

      setSessionId(session?.id || null)
      
      // Load existing messages if any
      if (session?.id) {
        loadChatMessages(session.id)
      }

      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date()
      }
      setMessages([welcomeMessage])

    } catch (error) {
      console.error('Error initializing chat session:', error)
    }
  }

  const loadChatMessages = async (sessionId: string) => {
    try {
      const { data: messages, error } = await dbHelpers.getChatMessages(sessionId)
      
      if (error) {
        console.error('Error loading chat messages:', error)
        return
      }

      if (messages && messages.length > 0) {
        const formattedMessages: Message[] = messages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
          metadata: msg.metadata
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error('Error loading chat messages:', error)
    }
  }

  const getWelcomeMessage = () => {
    if (context) {
      return `Hi! I'm TwigBot, your AI coding mentor. I'm here to help you with ${context}. What would you like to learn or work on?`
    }
    if (lessonId) {
      return `Hi! I'm TwigBot. I'm here to help you with this lesson. Ask me anything about the concepts, code examples, or if you're stuck on something!`
    }
    return `Hi! I'm TwigBot, your AI coding mentor. I'm here to help you learn programming, debug code, understand concepts, and solve problems. What can I help you with today?`
  }

  const sendMessage = async () => {
    if (!input.trim() || !user || !sessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Save user message to database
      await dbHelpers.addChatMessage(sessionId, 'user', input, {
        lessonId,
        courseId,
        context
      })

      // Call AI API (using mock response for now)
      const aiResponse = await callAIAPI(input, context)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Save assistant message to database
      await dbHelpers.addChatMessage(sessionId, 'assistant', aiResponse)

    } catch (error) {
      console.error('AI chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const callAIAPI = async (message: string, context: string): Promise<string> => {
    // In a real implementation, this would call your Supabase Edge Function
    // For now, providing contextual mock responses
    
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('error') || lowerMessage.includes('bug')) {
      return `I can help you debug! Here are some common debugging steps:

1. **Check the console** - Look for error messages in your browser's developer console
2. **Verify syntax** - Make sure all brackets, parentheses, and semicolons are properly placed
3. **Check variable names** - Ensure you're using the correct variable names and they're in scope
4. **Test step by step** - Break down your code into smaller pieces and test each part

Can you share the specific error message or the code you're having trouble with?`
    }
    
    if (lowerMessage.includes('html')) {
      return `Great question about HTML! Here are some key points:

**HTML Basics:**
- HTML uses tags to structure content: \`<tag>content</tag>\`
- Always close your tags (except self-closing ones like \`<img>\`)
- Use semantic tags like \`<header>\`, \`<main>\`, \`<section>\` for better structure

**Common HTML tags:**
- \`<h1>\` to \`<h6>\` for headings
- \`<p>\` for paragraphs
- \`<div>\` for containers
- \`<a>\` for links
- \`<img>\` for images

What specific HTML concept would you like me to explain further?`
    }
    
    if (lowerMessage.includes('css')) {
      return `CSS is powerful for styling! Here's what you should know:

**CSS Syntax:**
\`\`\`css
selector {
  property: value;
}
\`\`\`

**Key concepts:**
- **Selectors**: Target HTML elements (\`.class\`, \`#id\`, \`element\`)
- **Box Model**: margin, border, padding, content
- **Flexbox**: For flexible layouts
- **Grid**: For complex 2D layouts

**Best practices:**
- Use classes for reusable styles
- Keep specificity low
- Use semantic naming

What CSS topic would you like to dive deeper into?`
    }
    
    if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
      return `JavaScript is the programming language of the web! Here are fundamentals:

**Variables:**
\`\`\`javascript
let name = "TwigBot";
const age = 25;
var message = "Hello!"; // avoid var, use let/const
\`\`\`

**Functions:**
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Arrow function
const greet = (name) => \`Hello, \${name}!\`;
\`\`\`

**Common methods:**
- Arrays: \`.map()\`, \`.filter()\`, \`.forEach()\`
- DOM: \`document.querySelector()\`, \`addEventListener()\`

What JavaScript concept are you working on?`
    }

    // Generic helpful response
    return `That's a great question! I'm here to help you learn and understand programming concepts better.

Here are some ways I can assist you:
- 📚 **Explain concepts** - Ask me about HTML, CSS, JavaScript, or any programming topic
- 🐛 **Debug code** - Share your code and I'll help you find and fix issues
- 💡 **Provide examples** - I can show you practical code examples
- 🎯 **Guide problem-solving** - I'll help you break down complex problems

Feel free to ask me anything specific about coding, and I'll provide detailed, helpful explanations!`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    )
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-96 h-[500px] shadow-2xl border-orange-200 z-50 ${className}`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="text-sm font-medium">TwigBot - AI Mentor</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[calc(500px-80px)]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] p-3 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                    {message.content}
                  </pre>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-none">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-500">TwigBot is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about coding, debugging, concepts..."
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Floating AI Assistant Button Component
export function FloatingAIAssistant({ 
  context, 
  lessonId, 
  courseId 
}: { 
  context?: string
  lessonId?: string 
  courseId?: string 
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-gradient-to-r from-orange-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all z-50 animate-pulse"
        >
          <Bot className="w-6 h-6" />
        </Button>
      )}
      
      {isOpen && (
        <AIChatBot
          context={context}
          lessonId={lessonId}
          courseId={courseId}
          onToggleMinimize={() => setIsOpen(false)}
        />
      )}
    </>
  )
}