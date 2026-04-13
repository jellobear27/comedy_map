-- superfan_profiles stays empty until the app saved Edit Profile because nothing inserted
-- a row at signup. Ensure a row exists whenever profiles.role is (or becomes) superfan.

CREATE OR REPLACE FUNCTION public.ensure_superfan_profile_for_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'superfan' THEN
    INSERT INTO public.superfan_profiles (id, updated_at)
    VALUES (NEW.id, NOW())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_ensure_superfan ON public.profiles;
CREATE TRIGGER trg_profiles_ensure_superfan
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  WHEN (NEW.role = 'superfan')
  EXECUTE FUNCTION public.ensure_superfan_profile_for_role();

-- Backfill existing superfans who only have public.profiles
INSERT INTO public.superfan_profiles (id, updated_at)
SELECT id, NOW()
FROM public.profiles
WHERE role = 'superfan'
ON CONFLICT (id) DO NOTHING;
