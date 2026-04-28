-- Instagram on public fan cards (optional) + superfan-to-superfan card likes

ALTER TABLE public.superfan_profiles
  ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
  ADD COLUMN IF NOT EXISTS show_instagram_on_card BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS card_like_count INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.superfan_profiles.instagram_handle IS 'Optional Instagram @handle or URL; shown only when show_instagram_on_card and profiles.is_public';
COMMENT ON COLUMN public.superfan_profiles.show_instagram_on_card IS 'When true and profile is public, IG may appear on /superfans/[slug]';
COMMENT ON COLUMN public.superfan_profiles.card_like_count IS 'Denormalized count of superfan_card_likes rows for this profile';

CREATE TABLE IF NOT EXISTS public.superfan_card_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  liker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  liked_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT superfan_card_likes_no_self CHECK (liker_id <> liked_user_id),
  CONSTRAINT superfan_card_likes_unique UNIQUE (liker_id, liked_user_id)
);

CREATE INDEX IF NOT EXISTS idx_superfan_card_likes_liked ON public.superfan_card_likes(liked_user_id);
CREATE INDEX IF NOT EXISTS idx_superfan_card_likes_liker ON public.superfan_card_likes(liker_id);

ALTER TABLE public.superfan_card_likes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.bump_superfan_card_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.superfan_profiles
    SET card_like_count = card_like_count + 1
    WHERE id = NEW.liked_user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.superfan_profiles
    SET card_like_count = GREATEST(0, card_like_count - 1)
    WHERE id = OLD.liked_user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_superfan_card_like_count ON public.superfan_card_likes;
CREATE TRIGGER trg_superfan_card_like_count
AFTER INSERT OR DELETE ON public.superfan_card_likes
FOR EACH ROW EXECUTE FUNCTION public.bump_superfan_card_like_count();

-- Backfill counts from existing rows (none on fresh deploy)
UPDATE public.superfan_profiles sp
SET card_like_count = COALESCE(
  (SELECT COUNT(*)::INTEGER FROM public.superfan_card_likes l WHERE l.liked_user_id = sp.id),
  0
);

DROP POLICY IF EXISTS "Superfans can insert likes on public fan cards" ON public.superfan_card_likes;
CREATE POLICY "Superfans can insert likes on public fan cards"
ON public.superfan_card_likes FOR INSERT
WITH CHECK (
  auth.uid() = liker_id
  AND EXISTS (
    SELECT 1 FROM public.profiles lp
    WHERE lp.id = auth.uid() AND lp.role = 'superfan'
  )
  AND EXISTS (
    SELECT 1 FROM public.profiles tp
    WHERE tp.id = liked_user_id
      AND tp.role = 'superfan'
      AND tp.is_public = true
  )
);

DROP POLICY IF EXISTS "Users can delete own outgoing likes" ON public.superfan_card_likes;
CREATE POLICY "Users can delete own outgoing likes"
ON public.superfan_card_likes FOR DELETE
USING (auth.uid() = liker_id);

DROP POLICY IF EXISTS "Users can see own outgoing likes" ON public.superfan_card_likes;
CREATE POLICY "Users can see own outgoing likes"
ON public.superfan_card_likes FOR SELECT
USING (auth.uid() = liker_id);
