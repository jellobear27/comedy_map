-- ============================================
-- ROAST THREADS FEATURE
-- "Roast Me" threads where users opt-in to be roasted
-- ============================================

-- 1. Create roast_threads table (the "Roast Me" posts)
CREATE TABLE IF NOT EXISTS public.roast_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT, -- Optional context for roasters
  photo_url TEXT, -- Optional photo to roast
  is_active BOOLEAN DEFAULT true, -- User can close their thread
  roast_count INTEGER DEFAULT 0,
  best_roast_id UUID, -- Featured best roast
  created_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- 2. Create roasts table (the actual roasts/burns)
CREATE TABLE IF NOT EXISTS public.roasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES public.roast_threads(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  fire_count INTEGER DEFAULT 0, -- Upvotes (🔥)
  is_reported BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false, -- Hidden if reported and confirmed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create roast_fires table (upvotes for roasts)
CREATE TABLE IF NOT EXISTS public.roast_fires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roast_id UUID REFERENCES public.roasts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(roast_id, user_id) -- One fire per user per roast
);

-- 4. Create roast_reports table (for safety)
CREATE TABLE IF NOT EXISTS public.roast_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roast_id UUID REFERENCES public.roasts(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT CHECK (reason IN ('harassment', 'racism', 'homophobia', 'personal_attack', 'other')) NOT NULL,
  details TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  UNIQUE(roast_id, reporter_id) -- One report per user per roast
);

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_roast_threads_user ON public.roast_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_roast_threads_active ON public.roast_threads(is_active);
CREATE INDEX IF NOT EXISTS idx_roasts_thread ON public.roasts(thread_id);
CREATE INDEX IF NOT EXISTS idx_roasts_author ON public.roasts(author_id);
CREATE INDEX IF NOT EXISTS idx_roast_fires_roast ON public.roast_fires(roast_id);
CREATE INDEX IF NOT EXISTS idx_roast_reports_status ON public.roast_reports(status);

-- 6. Enable RLS
ALTER TABLE public.roast_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roast_fires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roast_reports ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for roast_threads
CREATE POLICY "Anyone can view active roast threads"
ON public.roast_threads FOR SELECT
USING (is_active = true);

CREATE POLICY "Users can create their own roast threads"
ON public.roast_threads FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own roast threads"
ON public.roast_threads FOR UPDATE
USING (user_id = auth.uid());

-- 8. RLS Policies for roasts
CREATE POLICY "Anyone can view non-hidden roasts"
ON public.roasts FOR SELECT
USING (is_hidden = false);

CREATE POLICY "Authenticated users can create roasts"
ON public.roasts FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own roasts"
ON public.roasts FOR UPDATE
USING (author_id = auth.uid());

-- 9. RLS Policies for roast_fires
CREATE POLICY "Anyone can view fires"
ON public.roast_fires FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can add fires"
ON public.roast_fires FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their own fires"
ON public.roast_fires FOR DELETE
USING (user_id = auth.uid());

-- 10. RLS Policies for reports
CREATE POLICY "Users can create reports"
ON public.roast_reports FOR INSERT
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view their own reports"
ON public.roast_reports FOR SELECT
USING (reporter_id = auth.uid());

-- 11. Function to update fire count
CREATE OR REPLACE FUNCTION update_roast_fire_count()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $func$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.roasts SET fire_count = fire_count + 1 WHERE id = NEW.roast_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.roasts SET fire_count = fire_count - 1 WHERE id = OLD.roast_id;
  END IF;
  RETURN NULL;
END;
$func$;

-- 12. Trigger for fire count
DROP TRIGGER IF EXISTS on_roast_fire_change ON public.roast_fires;
CREATE TRIGGER on_roast_fire_change
  AFTER INSERT OR DELETE ON public.roast_fires
  FOR EACH ROW EXECUTE FUNCTION update_roast_fire_count();

-- 13. Function to update roast count on thread
CREATE OR REPLACE FUNCTION update_thread_roast_count()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $func$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.roast_threads SET roast_count = roast_count + 1 WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.roast_threads SET roast_count = roast_count - 1 WHERE id = OLD.thread_id;
  END IF;
  RETURN NULL;
END;
$func$;

-- 14. Trigger for roast count
DROP TRIGGER IF EXISTS on_roast_change ON public.roasts;
CREATE TRIGGER on_roast_change
  AFTER INSERT OR DELETE ON public.roasts
  FOR EACH ROW EXECUTE FUNCTION update_thread_roast_count();

-- 15. Badge for roast masters (optional - ties into superfan badges)
-- Users who get 100+ total fires on their roasts earn "Roast Master" badge

