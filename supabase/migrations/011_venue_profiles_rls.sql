-- RLS for venue_profiles so venue accounts can read/write their row from the app
ALTER TABLE public.venue_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Venue profiles viewable when public or owner" ON public.venue_profiles;
DROP POLICY IF EXISTS "Users can insert own venue profile" ON public.venue_profiles;
DROP POLICY IF EXISTS "Users can update own venue profile" ON public.venue_profiles;

CREATE POLICY "Venue profiles viewable when public or owner"
ON public.venue_profiles FOR SELECT
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = venue_profiles.id
      AND p.is_public = true
  )
);

CREATE POLICY "Users can insert own venue profile"
ON public.venue_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own venue profile"
ON public.venue_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
