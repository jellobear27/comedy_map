-- Superfan profile fields for public card + discovery
ALTER TABLE public.superfan_profiles
  ADD COLUMN IF NOT EXISTS public_slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS preferred_comedy_styles TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS show_frequency TEXT,
  ADD COLUMN IF NOT EXISTS favorite_local_names TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.superfan_profiles.public_slug IS 'URL segment for /superfans/[slug]';
COMMENT ON COLUMN public.superfan_profiles.preferred_comedy_styles IS 'Comedy styles this fan enjoys';
COMMENT ON COLUMN public.superfan_profiles.show_frequency IS 'How often they attend shows (app-defined values)';
COMMENT ON COLUMN public.superfan_profiles.favorite_local_names IS 'Free-text local comedian names they love';

CREATE INDEX IF NOT EXISTS idx_superfan_profiles_slug ON public.superfan_profiles(public_slug)
  WHERE public_slug IS NOT NULL;

-- Allow anyone to read superfan rows when the base profile is public (for /superfans/[slug])
CREATE POLICY "Public can view superfan profiles when profile is public"
ON public.superfan_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = superfan_profiles.id
      AND p.is_public = true
  )
);
