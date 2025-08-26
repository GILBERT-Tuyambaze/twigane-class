import { useState, useEffect } from 'react'
import { supabase, dbHelpers, authHelpers } from '@/lib/supabase'

// Hook for authentication state
export function useSupabaseAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    // Get initial session
    authHelpers.getCurrentSession().then((session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
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
    signOut: authHelpers.signOut
  }
}

// Hook for user profile management
export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    if (!userId) return

    setLoading(true)
    const { data, error } = await dbHelpers.getUserProfile(userId)
    
    if (error) {
      setError(error.message)
    } else {
      setProfile(data)
      setError(null)
    }
    setLoading(false)
  }

  const updateProfile = async (updates: any) => {
    if (!userId) return { error: 'No user ID provided' }

    const { data, error } = await dbHelpers.updateUserProfile(userId, updates)
    
    if (!error && data) {
      setProfile(data)
    }
    
    return { data, error }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  }
}

// Hook for course management
export function useCourses() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    const { data, error } = await dbHelpers.getPublishedCourses()
    
    if (error) {
      setError(error.message)
    } else {
      setCourses(data || [])
      setError(null)
    }
    setLoading(false)
  }

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  }
}

// Hook for course details with lessons
export function useCourseDetails(courseId: string) {
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails()
    }
  }, [courseId])

  const fetchCourseDetails = async () => {
    setLoading(true)
    const { data, error } = await dbHelpers.getCourseWithLessons(courseId)
    
    if (error) {
      setError(error.message)
    } else {
      setCourse(data)
      setError(null)
    }
    setLoading(false)
  }

  return {
    course,
    loading,
    error,
    refetch: fetchCourseDetails
  }
}

// Hook for user progress tracking
export function useUserProgress(userId?: string) {
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchProgress()
    }
  }, [userId])

  const fetchProgress = async () => {
    if (!userId) return

    setLoading(true)
    const { data, error } = await dbHelpers.getUserProgress(userId)
    
    if (error) {
      setError(error.message)
    } else {
      setProgress(data || [])
      setError(null)
    }
    setLoading(false)
  }

  const markLessonComplete = async (lessonId: string, score?: number, timeSpent?: number) => {
    if (!userId) return { error: 'No user ID provided' }

    const { data, error } = await dbHelpers.markLessonComplete(userId, lessonId, score, timeSpent)
    
    if (!error) {
      // Refresh progress data
      fetchProgress()
      
      // Award XP for lesson completion
      try {
        await supabase.rpc('update_user_xp', {
          user_uuid: userId,
          xp_gained: score || 10
        })
      } catch (xpError) {
        console.error('Error updating XP:', xpError)
      }
    }
    
    return { data, error }
  }

  return {
    progress,
    loading,
    error,
    markLessonComplete,
    refetch: fetchProgress
  }
}

// Hook for achievements
export function useAchievements(userId?: string) {
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchAchievements()
    }
  }, [userId])

  const fetchAchievements = async () => {
    if (!userId) return

    setLoading(true)
    const { data, error } = await dbHelpers.getUserAchievements(userId)
    
    if (error) {
      setError(error.message)
    } else {
      setAchievements(data || [])
      setError(null)
    }
    setLoading(false)
  }

  const checkAndAwardAchievements = async (userId: string, context: string) => {
    try {
      const { data: profile } = await dbHelpers.getUserProfile(userId)
      const { data: progress } = await dbHelpers.getUserProgress(userId)
      
      if (!profile || !progress) return

      const completedLessons = progress.filter(p => p.completed_at).length
      const totalXP = profile.xp || 0

      // First lesson achievement
      if (completedLessons === 1) {
        await supabase.rpc('award_achievement', {
          user_uuid: userId,
          badge: 'First Steps',
          description: 'Completed your first lesson!',
          rarity: 'common'
        })
      }

      // XP milestones
      if (totalXP >= 100 && totalXP < 200) {
        await supabase.rpc('award_achievement', {
          user_uuid: userId,
          badge: 'Getting Started',
          description: 'Earned 100 XP',
          rarity: 'common'
        })
      }

      if (totalXP >= 500 && totalXP < 600) {
        await supabase.rpc('award_achievement', {
          user_uuid: userId,
          badge: 'Learning Machine',
          description: 'Earned 500 XP',
          rarity: 'rare'
        })
      }

      // Streak achievements
      if (profile.streak_days >= 7) {
        await supabase.rpc('award_achievement', {
          user_uuid: userId,
          badge: 'Week Warrior',
          description: '7-day learning streak',
          rarity: 'rare'
        })
      }

      fetchAchievements()
    } catch (error) {
      console.error('Error checking achievements:', error)
    }
  }

  return {
    achievements,
    loading,
    error,
    checkAndAwardAchievements,
    refetch: fetchAchievements
  }
}

// Hook for forum posts
export function useForumPosts(category?: string) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [category])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await dbHelpers.getForumPosts(category)
    
    if (error) {
      setError(error.message)
    } else {
      setPosts(data || [])
      setError(null)
    }
    setLoading(false)
  }

  const createPost = async (title: string, content: string, postCategory?: string, tags?: string[]) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await dbHelpers.createForumPost(
      user.id, 
      title, 
      content, 
      postCategory, 
      tags
    )
    
    if (!error) {
      fetchPosts()
    }
    
    return { data, error }
  }

  return {
    posts,
    loading,
    error,
    createPost,
    refetch: fetchPosts
  }
}

// Hook for real-time data
export function useRealtimeSubscription(table: string, callback: (payload: any) => void) {
  useEffect(() => {
    const subscription = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [table, callback])
}

// Hook for AI chat functionality
export function useAIChat() {
  const [sessions, setSessions] = useState<any[]>([])
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const createSession = async (sessionName?: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await dbHelpers.createChatSession(user.id, sessionName)
    
    if (!error && data) {
      setCurrentSession(data)
      setSessions(prev => [data, ...prev])
    }
    
    return { data, error }
  }

  const loadMessages = async (sessionId: string) => {
    setLoading(true)
    const { data, error } = await dbHelpers.getChatMessages(sessionId)
    
    if (!error && data) {
      setMessages(data)
    }
    
    setLoading(false)
    return { data, error }
  }

  const sendMessage = async (sessionId: string, content: string, metadata?: any) => {
    const { data, error } = await dbHelpers.addChatMessage(sessionId, 'user', content, metadata)
    
    if (!error) {
      setMessages(prev => [...prev, data])
    }
    
    return { data, error }
  }

  return {
    sessions,
    currentSession,
    messages,
    loading,
    createSession,
    loadMessages,
    sendMessage,
    setCurrentSession
  }
}