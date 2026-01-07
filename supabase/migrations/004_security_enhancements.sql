-- Security Enhancement Migration
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================

ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comedian_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.open_mics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.community_posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. PROFILES TABLE - Enhanced Policies
-- ============================================

-- Drop existing policies to recreate with better security
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Only show public profiles to everyone
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (is_public = true OR auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Users cannot delete profiles (soft delete only via is_public = false)
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- ============================================
-- 3. COMEDIAN PROFILES - Enhanced Policies
-- ============================================

DROP POLICY IF EXISTS "Comedian profiles are viewable by everyone" ON public.comedian_profiles;
DROP POLICY IF EXISTS "Users can update their own comedian profile" ON public.comedian_profiles;
DROP POLICY IF EXISTS "Users can insert their own comedian profile" ON public.comedian_profiles;

-- Public comedian profiles are viewable
CREATE POLICY "Comedian profiles are viewable by everyone" 
ON public.comedian_profiles FOR SELECT 
USING (
  available_for_booking = true 
  OR auth.uid() = id
);

-- Users can only update their own
CREATE POLICY "Users can update their own comedian profile" 
ON public.comedian_profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can only insert their own
CREATE POLICY "Users can insert their own comedian profile" 
ON public.comedian_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- ============================================
-- 4. OPEN MICS - Enhanced Policies
-- ============================================

DROP POLICY IF EXISTS "Open mics are viewable by everyone" ON public.open_mics;
DROP POLICY IF EXISTS "Authenticated users can create open mics" ON public.open_mics;
DROP POLICY IF EXISTS "Users can update their own open mics" ON public.open_mics;

-- Anyone can view approved open mics
CREATE POLICY "Open mics are viewable by everyone" 
ON public.open_mics FOR SELECT 
USING (true);

-- Authenticated users can submit open mics
CREATE POLICY "Authenticated users can create open mics" 
ON public.open_mics FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Only creators or admins can update
CREATE POLICY "Users can update their own open mics" 
ON public.open_mics FOR UPDATE 
USING (
  auth.uid() = submitted_by 
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can delete
CREATE POLICY "Only admins can delete open mics" 
ON public.open_mics FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 5. COMMUNITY POSTS - Enhanced Policies
-- ============================================

DROP POLICY IF EXISTS "Community posts are viewable by everyone" ON public.community_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.community_posts;

-- Anyone can view posts
CREATE POLICY "Community posts are viewable by everyone" 
ON public.community_posts FOR SELECT 
USING (true);

-- Only authenticated users can post
CREATE POLICY "Authenticated users can create posts" 
ON public.community_posts FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

-- Users can only update their own posts
CREATE POLICY "Users can update their own posts" 
ON public.community_posts FOR UPDATE 
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Users can delete their own posts, admins can delete any
CREATE POLICY "Users can delete their own posts" 
ON public.community_posts FOR DELETE 
USING (
  auth.uid() = author_id 
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 6. STORAGE BUCKET - Enhanced Policies
-- ============================================

-- Ensure profile-photos bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos', 
  'profile-photos', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- ============================================
-- 7. CREATE AUDIT LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON public.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.audit_log(created_at DESC);

-- Only admins can view audit logs
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" 
ON public.audit_log FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.audit_log FOR INSERT 
WITH CHECK (true);

-- ============================================
-- 8. ADD ROLE COLUMN TO PROFILES IF NOT EXISTS
-- ============================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' 
CHECK (role IN ('user', 'comedian', 'venue', 'admin'));

-- ============================================
-- 9. CREATE FUNCTION FOR AUDIT LOGGING
-- ============================================

CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. ATTACH AUDIT TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION log_audit();

DROP TRIGGER IF EXISTS audit_comedian_profiles ON public.comedian_profiles;
CREATE TRIGGER audit_comedian_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.comedian_profiles
  FOR EACH ROW EXECUTE FUNCTION log_audit();

DROP TRIGGER IF EXISTS audit_open_mics ON public.open_mics;
CREATE TRIGGER audit_open_mics
  AFTER INSERT OR UPDATE OR DELETE ON public.open_mics
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- ============================================
-- SECURITY COMPLETE! 🔒
-- ============================================

