-- Twigane Class Database Setup Script
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email VARCHAR UNIQUE,
  name VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  is_admin BOOLEAN DEFAULT false,
  xp INTEGER DEFAULT 0,
  level VARCHAR DEFAULT 'Seed',
  streak_days INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT,
  bio TEXT
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  difficulty VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  instructor_id UUID REFERENCES public.user_profiles(id)
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  content TEXT,
  lesson_type VARCHAR DEFAULT 'text', -- 'text', 'video', 'interactive', 'quiz'
  order_index INTEGER,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  code_template TEXT,
  expected_output TEXT
);

-- Create user progress tracking table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  time_spent_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Create achievements system table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  badge_name VARCHAR NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rarity VARCHAR DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  icon_url TEXT
);

-- Create projects submissions table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  code_content TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  grade INTEGER,
  feedback TEXT,
  status VARCHAR DEFAULT 'pending', -- 'pending', 'graded', 'needs_revision'
  project_url TEXT
);

-- Create forum posts table
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  content TEXT,
  category VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  tags TEXT[]
);

-- Create forum replies table
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  parent_reply_id UUID REFERENCES public.forum_replies(id)
);

-- Create AI chat sessions table
CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  session_name VARCHAR DEFAULT 'AI Coding Help',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI chat messages table
CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB -- for storing additional context like code snippets, lesson references
);

-- Create donations table (optional for sustainability)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_email VARCHAR,
  amount DECIMAL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_anonymous BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON public.forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON public.forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON public.ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_course_id ON public.projects(course_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for courses (public read, admin write)
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (
  is_published = true OR 
  auth.uid() IN (SELECT id FROM public.user_profiles WHERE is_admin = true)
);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.user_profiles WHERE is_admin = true)
);

-- RLS Policies for lessons
CREATE POLICY "Anyone can view lessons of published courses" ON public.lessons FOR SELECT USING (
  course_id IN (SELECT id FROM public.courses WHERE is_published = true) OR
  auth.uid() IN (SELECT id FROM public.user_profiles WHERE is_admin = true)
);
CREATE POLICY "Admins can manage lessons" ON public.lessons FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.user_profiles WHERE is_admin = true)
);

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all progress" ON public.user_progress FOR SELECT USING (
  auth.uid() IN (SELECT id FROM public.user_profiles WHERE is_admin = true)
);

-- RLS Policies for achievements
CREATE POLICY "Users can view all achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "System can insert achievements" ON public.achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.user_profiles WHERE is_admin = true)
);

-- RLS Policies for projects
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending projects" ON public.projects FOR UPDATE USING (
  auth.uid() = user_id AND status = 'pending'
);
CREATE POLICY "Admins can view and grade all projects" ON public.projects FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.user_profiles WHERE is_admin = true)
);

-- RLS Policies for forum posts
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all posts" ON public.forum_posts FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.user_profiles WHERE is_admin = true)
);

-- RLS Policies for forum replies
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON public.forum_replies FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all replies" ON public.forum_replies FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.user_profiles WHERE is_admin = true)
);

-- RLS Policies for AI chat sessions
CREATE POLICY "Users can view own chat sessions" ON public.ai_chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own chat sessions" ON public.ai_chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chat sessions" ON public.ai_chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat sessions" ON public.ai_chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for AI chat messages
CREATE POLICY "Users can view own chat messages" ON public.ai_chat_messages FOR SELECT USING (
  session_id IN (SELECT id FROM public.ai_chat_sessions WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert messages in own sessions" ON public.ai_chat_messages FOR INSERT WITH CHECK (
  session_id IN (SELECT id FROM public.ai_chat_sessions WHERE user_id = auth.uid())
);

-- RLS Policies for donations (public read for transparency)
CREATE POLICY "Anyone can view non-anonymous donations" ON public.donations FOR SELECT USING (is_anonymous = false);
CREATE POLICY "Anyone can insert donations" ON public.donations FOR INSERT WITH CHECK (true);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update user XP and level
CREATE OR REPLACE FUNCTION public.update_user_xp(user_uuid UUID, xp_gained INTEGER)
RETURNS void AS $$
DECLARE
  current_xp INTEGER;
  new_total_xp INTEGER;
  new_level VARCHAR;
BEGIN
  -- Get current XP
  SELECT xp INTO current_xp FROM public.user_profiles WHERE id = user_uuid;
  
  -- Calculate new total XP
  new_total_xp := current_xp + xp_gained;
  
  -- Determine new level based on total XP
  SELECT CASE
    WHEN new_total_xp >= 10000 THEN 'Twigane Pro'
    WHEN new_total_xp >= 5000 THEN 'Branch'
    WHEN new_total_xp >= 1000 THEN 'Leaf'
    ELSE 'Seed'
  END INTO new_level;
  
  -- Update XP, level, and last_active
  UPDATE public.user_profiles 
  SET 
    xp = new_total_xp, 
    level = new_level,
    last_active = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award achievements
CREATE OR REPLACE FUNCTION public.award_achievement(
  user_uuid UUID, 
  badge VARCHAR, 
  description TEXT, 
  rarity VARCHAR DEFAULT 'common'
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.achievements (user_id, badge_name, description, rarity)
  VALUES (user_uuid, badge, description, rarity)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update streak
CREATE OR REPLACE FUNCTION public.update_user_streak(user_uuid UUID)
RETURNS void AS $$
DECLARE
  last_active_date DATE;
  today_date DATE;
  current_streak INTEGER;
BEGIN
  SELECT DATE(last_active), streak_days INTO last_active_date, current_streak
  FROM public.user_profiles WHERE id = user_uuid;
  
  today_date := CURRENT_DATE;
  
  -- If user was active yesterday, increment streak
  IF last_active_date = today_date - INTERVAL '1 day' THEN
    UPDATE public.user_profiles 
    SET streak_days = streak_days + 1, last_active = NOW()
    WHERE id = user_uuid;
  -- If user wasn't active yesterday, reset streak to 1
  ELSIF last_active_date < today_date - INTERVAL '1 day' THEN
    UPDATE public.user_profiles 
    SET streak_days = 1, last_active = NOW()
    WHERE id = user_uuid;
  -- If user was already active today, just update last_active
  ELSE
    UPDATE public.user_profiles 
    SET last_active = NOW()
    WHERE id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for development (optional)
INSERT INTO public.courses (title, description, category, difficulty, is_published) VALUES
('Web Basics: HTML & CSS', 'Learn the fundamentals of web development with HTML and CSS', 'Web Development', 'Beginner', true),
('JavaScript Fundamentals', 'Master the basics of JavaScript programming', 'Programming', 'Beginner', true),
('React Development', 'Build modern web applications with React', 'Web Development', 'Intermediate', true),
('Python Programming', 'Learn Python from scratch to advanced concepts', 'Programming', 'Beginner', true),
('Database Design', 'Understanding databases and SQL', 'Backend', 'Intermediate', true);

-- Insert sample lessons for the first course
DO $$
DECLARE
  course_uuid UUID;
BEGIN
  SELECT id INTO course_uuid FROM public.courses WHERE title = 'Web Basics: HTML & CSS' LIMIT 1;
  
  IF course_uuid IS NOT NULL THEN
    INSERT INTO public.lessons (course_id, title, content, lesson_type, order_index, duration_minutes) VALUES
    (course_uuid, 'Introduction to HTML', 'Learn what HTML is and how it structures web content', 'text', 1, 30),
    (course_uuid, 'HTML Tags and Elements', 'Understanding different HTML tags and their purposes', 'interactive', 2, 45),
    (course_uuid, 'CSS Basics', 'Introduction to styling with CSS', 'text', 3, 40),
    (course_uuid, 'CSS Selectors', 'Learn how to target HTML elements with CSS', 'interactive', 4, 35),
    (course_uuid, 'Layout with Flexbox', 'Create flexible layouts using CSS Flexbox', 'interactive', 5, 50);
  END IF;
END $$;

-- Create a view for user statistics
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  up.id,
  up.name,
  up.email,
  up.level,
  up.xp,
  up.streak_days,
  COUNT(DISTINCT prog.lesson_id) as completed_lessons,
  COUNT(DISTINCT ach.id) as total_badges,
  COUNT(DISTINCT proj.id) as submitted_projects,
  COUNT(DISTINCT fp.id) as forum_posts
FROM public.user_profiles up
LEFT JOIN public.user_progress prog ON up.id = prog.user_id AND prog.completed_at IS NOT NULL
LEFT JOIN public.achievements ach ON up.id = ach.user_id
LEFT JOIN public.projects proj ON up.id = proj.user_id
LEFT JOIN public.forum_posts fp ON up.id = fp.user_id
GROUP BY up.id, up.name, up.email, up.level, up.xp, up.streak_days;

-- Create a view for course progress
CREATE OR REPLACE VIEW public.course_progress AS
SELECT 
  c.id as course_id,
  c.title as course_title,
  up.user_id,
  COUNT(l.id) as total_lessons,
  COUNT(prog.lesson_id) as completed_lessons,
  ROUND(
    (COUNT(prog.lesson_id)::decimal / NULLIF(COUNT(l.id), 0)) * 100, 
    2
  ) as progress_percentage
FROM public.courses c
LEFT JOIN public.lessons l ON c.id = l.course_id
LEFT JOIN public.user_progress prog ON l.id = prog.lesson_id AND prog.completed_at IS NOT NULL
CROSS JOIN public.user_profiles up
WHERE c.is_published = true
GROUP BY c.id, c.title, up.user_id
ORDER BY c.title, up.user_id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';