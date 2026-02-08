-- ============================================
-- SUPERFAN FEATURE MIGRATION
-- Adds superfan role and related tables
-- ============================================

-- 1. Update profiles role constraint to include 'superfan'
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'comedian', 'venue', 'host', 'promoter', 'superfan', 'admin'));

-- 2. Create superfan_profiles table
CREATE TABLE IF NOT EXISTS public.superfan_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  favorite_comedians UUID[] DEFAULT '{}',
  shows_attended INTEGER DEFAULT 0,
  membership_tier TEXT CHECK (membership_tier IN ('free', 'premium')) DEFAULT 'free',
  premium_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create badges table
CREATE TABLE IF NOT EXISTS public.superfan_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

-- 4. Create show_attendance table (for tracking shows attended)
CREATE TABLE IF NOT EXISTS public.show_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID,
  event_name TEXT NOT NULL,
  venue_name TEXT,
  attended_at TIMESTAMPTZ DEFAULT NOW(),
  review TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create event_hypes table (for upcoming event hype)
CREATE TABLE IF NOT EXISTS public.event_hypes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_id UUID,
  event_name TEXT NOT NULL,
  venue_name TEXT,
  event_date TIMESTAMPTZ,
  hype_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create community_posts table with forum_type for access control
ALTER TABLE public.community_posts 
ADD COLUMN IF NOT EXISTS forum_type TEXT CHECK (forum_type IN ('comedian', 'superfan', 'general')) DEFAULT 'general';

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_superfan_badges_user ON public.superfan_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_show_attendance_user ON public.show_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_event_hypes_user ON public.event_hypes(user_id);
CREATE INDEX IF NOT EXISTS idx_event_hypes_date ON public.event_hypes(event_date);
CREATE INDEX IF NOT EXISTS idx_community_posts_forum ON public.community_posts(forum_type);

-- 8. Enable RLS on new tables
ALTER TABLE public.superfan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.superfan_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.show_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_hypes ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for superfan_profiles
CREATE POLICY "Users can view their own superfan profile"
ON public.superfan_profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update their own superfan profile"
ON public.superfan_profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Users can insert their own superfan profile"
ON public.superfan_profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- 10. RLS Policies for badges (public read, system insert)
CREATE POLICY "Anyone can view badges"
ON public.superfan_badges FOR SELECT
USING (true);

CREATE POLICY "System can insert badges"
ON public.superfan_badges FOR INSERT
WITH CHECK (user_id = auth.uid());

-- 11. RLS Policies for show_attendance
CREATE POLICY "Users can view all attendance records"
ON public.show_attendance FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own attendance"
ON public.show_attendance FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own attendance"
ON public.show_attendance FOR UPDATE
USING (user_id = auth.uid());

-- 12. RLS Policies for event_hypes
CREATE POLICY "Anyone can view event hypes"
ON public.event_hypes FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own hypes"
ON public.event_hypes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own hypes"
ON public.event_hypes FOR DELETE
USING (user_id = auth.uid());

-- 13. Function to auto-award badges based on show count
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
  show_count INTEGER;
  hype_count INTEGER;
  post_count INTEGER;
BEGIN
  -- Get counts
  SELECT COUNT(*) INTO show_count FROM public.show_attendance WHERE user_id = NEW.user_id;
  SELECT COUNT(*) INTO hype_count FROM public.event_hypes WHERE user_id = NEW.user_id;
  
  -- Award show-based badges
  IF show_count >= 1 THEN
    INSERT INTO public.superfan_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (NEW.user_id, 'first_show', 'First Laugh', 'Attended your first comedy show', '🎭')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  
  IF show_count >= 5 THEN
    INSERT INTO public.superfan_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (NEW.user_id, 'regular', 'Regular', 'Attended 5 comedy shows', '⭐')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  
  IF show_count >= 10 THEN
    INSERT INTO public.superfan_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (NEW.user_id, 'superfan', 'Superfan', 'Attended 10 comedy shows', '🌟')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  
  IF show_count >= 25 THEN
    INSERT INTO public.superfan_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (NEW.user_id, 'legendary', 'Legendary', 'Attended 25 comedy shows', '👑')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  
  IF show_count >= 50 THEN
    INSERT INTO public.superfan_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (NEW.user_id, 'comedy_addict', 'Comedy Addict', 'Attended 50 comedy shows', '🎪')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  
  -- Update shows_attended count in superfan_profiles
  UPDATE public.superfan_profiles 
  SET shows_attended = show_count, updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Trigger to check badges on new attendance
DROP TRIGGER IF EXISTS on_show_attendance_insert ON public.show_attendance;
CREATE TRIGGER on_show_attendance_insert
  AFTER INSERT ON public.show_attendance
  FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();

-- 15. Function to award hype-based badges
CREATE OR REPLACE FUNCTION check_hype_badges()
RETURNS TRIGGER AS $$
DECLARE
  hype_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO hype_count FROM public.event_hypes WHERE user_id = NEW.user_id;
  
  IF hype_count >= 50 THEN
    INSERT INTO public.superfan_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (NEW.user_id, 'hype_master', 'Hype Master', 'Hyped 50 upcoming events', '🔥')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_event_hype_insert ON public.event_hypes;
CREATE TRIGGER on_event_hype_insert
  AFTER INSERT ON public.event_hypes
  FOR EACH ROW EXECUTE FUNCTION check_hype_badges();

