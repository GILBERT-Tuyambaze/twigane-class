# 🚀 Twigane Class - Supabase Integration Setup Guide

## 📋 Prerequisites

- Node.js 18+ and pnpm installed
- A Supabase account (free tier is sufficient)
- OpenAI API key (for AI chatbot functionality)

## 🗄️ Step 1: Supabase Project Setup

### 1.1 Create a New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → "New Project"
3. Choose your organization and create project
4. Wait for the project to be ready (2-3 minutes)

### 1.2 Get Your Project Credentials
1. Go to Settings → API
2. Copy your Project URL and anon/public key
3. Save these for the environment setup

### 1.3 Run Database Setup
1. Go to SQL Editor in your Supabase dashboard
2. Copy the entire content from `src/lib/database-setup.sql`
3. Paste and run the script
4. Verify all tables were created successfully

## 🔧 Step 2: Environment Configuration

### 2.1 Create Environment File
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your actual values
nano .env.local
```

### 2.2 Fill in Your Credentials
```env
# Your Supabase project URL and key
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Your OpenAI API key for AI chatbot
OPENAI_API_KEY=sk-your-openai-api-key

# App settings
VITE_APP_NAME="Twigane Class"
VITE_APP_URL=https://twigane.mgx.world
```

## 🔄 Step 3: Update Authentication Context

Replace your current localStorage-based auth with Supabase:

```typescript
// src/contexts/AuthContext.tsx - Updated version
import { useSupabaseAuth } from '@/hooks/useSupabase'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, loading, signUp, signIn, signOut } = useSupabaseAuth()

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await signIn(email, password)
    return !error
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const { error } = await signUp(email, password, name)
    return !error
  }

  const logout = () => {
    signOut()
  }

  return (
    <AuthContext.Provider value={{ 
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        isAdmin: false, // Will be fetched from user_profiles table
        xp: 0,
        level: 'Seed',
        badges: [],
        streak: 0,
        completedLessons: []
      } : null,
      login, 
      register, 
      logout, 
      loading,
      updateUser: () => {} // Implement with Supabase updates
    }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## 🤖 Step 4: Deploy AI Edge Function

### 4.1 Install Supabase CLI
```bash
npm install -g supabase
```

### 4.2 Initialize Supabase locally
```bash
supabase login
supabase init
```

### 4.3 Create Edge Function
```bash
supabase functions new ai-chat
```

### 4.4 Replace the function code
Copy this code to `supabase/functions/ai-chat/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context } = await req.json()
    
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    
    const systemPrompt = `You are TwigBot, an expert coding mentor for Twigane Class platform. 
    Help students learn programming through clear explanations, step-by-step problem solving,
    code reviews, debugging help, and best practices guidance.
    
    Context: ${context || 'General coding help'}
    
    Keep responses concise but comprehensive. Use code examples when helpful.
    Encourage learning rather than just giving answers.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    const aiResponse = await response.json()
    const assistantMessage = aiResponse.choices[0].message.content

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

### 4.5 Deploy the function
```bash
supabase functions deploy ai-chat --project-ref your-project-ref
```

### 4.6 Set environment variables
```bash
supabase secrets set OPENAI_API_KEY=your-openai-api-key --project-ref your-project-ref
```

## 🎨 Step 5: Integrate Components

### 5.1 Add AI Chat to your pages
```typescript
// In any page component
import { FloatingAIAssistant } from '@/components/ai/AIChatBot'

export default function SomePage() {
  return (
    <div>
      {/* Your page content */}
      
      {/* AI Assistant - automatically appears as floating button */}
      <FloatingAIAssistant 
        context="HTML and CSS Basics" 
        lessonId="lesson-123"
      />
    </div>
  )
}
```

### 5.2 Use Supabase hooks in components
```typescript
// Example: Using in Dashboard
import { useUserProfile, useUserProgress, useAchievements } from '@/hooks/useSupabase'

export default function Dashboard() {
  const { user } = useAuth()
  const { profile } = useUserProfile(user?.id)
  const { progress } = useUserProgress(user?.id)
  const { achievements } = useAchievements(user?.id)

  return (
    <div>
      <h1>Welcome, {profile?.name}!</h1>
      <p>Level: {profile?.level}</p>
      <p>XP: {profile?.xp}</p>
      <p>Completed Lessons: {progress?.length}</p>
      <p>Badges Earned: {achievements?.length}</p>
    </div>
  )
}
```

## 🚀 Step 6: Run and Test

### 6.1 Install dependencies and start
```bash
pnpm install
pnpm run dev
```

### 6.2 Test the features
1. **Registration**: Create a new account
2. **Login**: Sign in with your credentials
3. **Profile**: Check if user profile is created in Supabase
4. **AI Chat**: Test the floating AI assistant
5. **Progress**: Complete a lesson and check progress tracking
6. **Achievements**: Verify badges are awarded

## 🔍 Step 7: Verify Database

Check your Supabase dashboard to ensure:
- ✅ User profiles are created on registration
- ✅ Progress is tracked when lessons are completed
- ✅ Achievements are awarded automatically
- ✅ AI chat sessions and messages are stored
- ✅ Forum posts work (if implemented)

## 🛠️ Troubleshooting

### Common Issues:

1. **Environment variables not loaded**
   - Restart your dev server after changing .env.local
   - Check that variables start with VITE_ for frontend access

2. **Database connection errors**
   - Verify your Supabase URL and keys are correct
   - Check if RLS policies are set up correctly

3. **AI chat not working**
   - Ensure OpenAI API key is set in Supabase secrets
   - Check Edge Function logs in Supabase dashboard

4. **Authentication issues**
   - Verify email confirmation settings in Supabase Auth
   - Check redirect URLs in Supabase Auth settings

## 📚 Next Steps

After successful setup:
1. Customize the AI prompts for your specific curriculum
2. Add more achievement conditions
3. Implement real-time features (notifications, live chat)
4. Add analytics and admin reporting
5. Set up automated backups
6. Configure CDN for better performance

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Review Supabase logs in the dashboard
3. Verify all environment variables are set
4. Test database queries in Supabase SQL editor

Your Twigane Class platform is now ready with full database backing and AI assistance! 🎉