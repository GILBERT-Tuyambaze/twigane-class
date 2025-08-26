import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          created_at: string
          is_admin: boolean
          xp: number
          level: string
          streak_days: number
          last_active: string
          avatar_url: string | null
          bio: string | null
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          created_at?: string
          is_admin?: boolean
          xp?: number
          level?: string
          streak_days?: number
          last_active?: string
          avatar_url?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          created_at?: string
          is_admin?: boolean
          xp?: number
          level?: string
          streak_days?: number
          last_active?: string
          avatar_url?: string | null
          bio?: string | null
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string | null
          difficulty: string | null
          created_at: string
          updated_at: string
          is_published: boolean
          thumbnail_url: string | null
          instructor_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category?: string | null
          difficulty?: string | null
          created_at?: string
          updated_at?: string
          is_published?: boolean
          thumbnail_url?: string | null
          instructor_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string | null
          difficulty?: string | null
          created_at?: string
          updated_at?: string
          is_published?: boolean
          thumbnail_url?: string | null
          instructor_id?: string | null
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          content: string | null
          lesson_type: string
          order_index: number | null
          duration_minutes: number | null
          created_at: string
          code_template: string | null
          expected_output: string | null
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          content?: string | null
          lesson_type?: string
          order_index?: number | null
          duration_minutes?: number | null
          created_at?: string
          code_template?: string | null
          expected_output?: string | null
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          content?: string | null
          lesson_type?: string
          order_index?: number | null
          duration_minutes?: number | null
          created_at?: string
          code_template?: string | null
          expected_output?: string | null
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed_at: string | null
          score: number | null
          time_spent_minutes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed_at?: string | null
          score?: number | null
          time_spent_minutes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed_at?: string | null
          score?: number | null
          time_spent_minutes?: number | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          badge_name: string
          description: string | null
          earned_at: string
          rarity: string
          icon_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          badge_name: string
          description?: string | null
          earned_at?: string
          rarity?: string
          icon_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          badge_name?: string
          description?: string | null
          earned_at?: string
          rarity?: string
          icon_url?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          course_id: string
          title: string
          description: string | null
          code_content: string | null
          submitted_at: string
          grade: number | null
          feedback: string | null
          status: string
          project_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          title: string
          description?: string | null
          code_content?: string | null
          submitted_at?: string
          grade?: number | null
          feedback?: string | null
          status?: string
          project_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          title?: string
          description?: string | null
          code_content?: string | null
          submitted_at?: string
          grade?: number | null
          feedback?: string | null
          status?: string
          project_url?: string | null
        }
      }
      forum_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          category: string | null
          created_at: string
          likes_count: number
          replies_count: number
          is_pinned: boolean
          tags: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          category?: string | null
          created_at?: string
          likes_count?: number
          replies_count?: number
          is_pinned?: boolean
          tags?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          category?: string | null
          created_at?: string
          likes_count?: number
          replies_count?: number
          is_pinned?: boolean
          tags?: string[] | null
        }
      }
      ai_chat_sessions: {
        Row: {
          id: string
          user_id: string
          session_name: string
          created_at: string
          last_message_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_name?: string
          created_at?: string
          last_message_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_name?: string
          created_at?: string
          last_message_at?: string
        }
      }
      ai_chat_messages: {
        Row: {
          id: string
          session_id: string
          role: string
          content: string
          created_at: string
          metadata: any | null
        }
        Insert: {
          id?: string
          session_id: string
          role: string
          content: string
          created_at?: string
          metadata?: any | null
        }
        Update: {
          id?: string
          session_id?: string
          role?: string
          content?: string
          created_at?: string
          metadata?: any | null
        }
      }
    }
    Functions: {
      update_user_xp: {
        Args: {
          user_uuid: string
          xp_gained: number
        }
        Returns: void
      }
      award_achievement: {
        Args: {
          user_uuid: string
          badge: string
          description: string
          rarity?: string
        }
        Returns: void
      }
    }
  }
}

// Auth Types
export interface User {
  id: string
  email?: string
  user_metadata?: {
    name?: string
    [key: string]: any
  }
}

export interface Session {
  access_token: string
  refresh_token: string
  expires_at?: number
  user: User
}

// useAuth Hook
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    session,
    loading,
    signUp: authHelpers.signUp,
    signIn: authHelpers.signIn,
    signOut: authHelpers.signOut,
  }
}

// useCourses Hook
export const useCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const { data, error } = await dbHelpers.getPublishedCourses()
        
        if (error) {
          setError(error)
          console.error('Error fetching courses:', error)
        } else {
          setCourses(data || [])
        }
      } catch (err) {
        setError(err)
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return { courses, loading, error }
}

// useUserProgress Hook
export const useUserProgress = (userId?: string) => {
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchProgress = async () => {
      try {
        setLoading(true)
        const { data, error } = await dbHelpers.getUserProgress(userId)
        
        if (error) {
          setError(error)
          console.error('Error fetching user progress:', error)
        } else {
          // Transform progress data to include course_id and calculated progress percentage
          const progressData = data?.map(item => ({
            ...item,
            course_id: item.lessons?.course_id,
            progress: item.completed_at ? 100 : 0 // Simple calculation, you may want to make this more sophisticated
          })) || []
          
          setProgress(progressData)
        }
      } catch (err) {
        setError(err)
        console.error('Error fetching user progress:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [userId])

  return { progress, loading, error }
}

// Helper functions for common database operations
export const dbHelpers = {
  // User Profile Operations
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  async updateUserProfile(userId: string, updates: Database['public']['Tables']['user_profiles']['Update']) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  },

  // Course Operations
  async getPublishedCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  async getCourseWithLessons(courseId: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        lessons (*)
      `)
      .eq('id', courseId)
      .single()
    
    return { data, error }
  },

  // Progress Operations
  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        lessons (
          title,
          course_id
        )
      `)
      .eq('user_id', userId)
    
    return { data, error }
  },

  async markLessonComplete(userId: string, lessonId: string, score?: number, timeSpent?: number) {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
        score,
        time_spent_minutes: timeSpent
      })
      .select()
    
    return { data, error }
  },

  // Achievement Operations
  async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
    
    return { data, error }
  },

  // AI Chat Operations
  async createChatSession(userId: string, sessionName?: string) {
    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .insert({
        user_id: userId,
        session_name: sessionName || 'AI Coding Help'
      })
      .select()
      .single()
    
    return { data, error }
  },

  async getChatMessages(sessionId: string) {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
    
    return { data, error }
  },

  async addChatMessage(sessionId: string, role: 'user' | 'assistant', content: string, metadata?: any) {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .insert({
        session_id: sessionId,
        role,
        content,
        metadata
      })
      .select()
      .single()
    
    // Update session last_message_at
    await supabase
      .from('ai_chat_sessions')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', sessionId)
    
    return { data, error }
  },

  // Forum Operations
  async getForumPosts(category?: string) {
    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        user_profiles (name, avatar_url)
      `)
      .order('created_at', { ascending: false })
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  async createForumPost(userId: string, title: string, content: string, category?: string, tags?: string[]) {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        user_id: userId,
        title,
        content,
        category,
        tags
      })
      .select()
      .single()
    
    return { data, error }
  }
}

// Authentication helpers
export const authHelpers = {
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })
    
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}