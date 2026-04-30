-- =============================================================================
-- open_mics RLS — paste into Supabase SQL Editor (matches app behavior)
-- =============================================================================
-- App behavior:
--   • Homepage /open-mics / submit form: SELECT only rows where is_active = true
--   • Submit form: INSERT with is_active = false (pending review), no login required
--   • /admin/open-mics (logged-in profiles.role = 'admin'): full SELECT, INSERT live,
--     UPDATE (approve/edit), DELETE (reject/remove)
--
-- Prerequisite: profiles.role allows 'admin' (see migration 006_superfan_feature.sql).
-- Grant admin in Table Editor: UPDATE profiles SET role = 'admin' WHERE id = '<auth uid>';
--
-- Optional — live homepage counts without refresh: Dashboard → Database → Replication,
-- enable replication for table `open_mics`, or run the block at the bottom if supported.
-- =============================================================================

ALTER TABLE public.open_mics ENABLE ROW LEVEL SECURITY;

-- Remove every policy name this repo has ever used on open_mics (idempotent)
DROP POLICY IF EXISTS "Active open mics are viewable by everyone" ON public.open_mics;
DROP POLICY IF EXISTS "Open mics are viewable by everyone" ON public.open_mics;
DROP POLICY IF EXISTS "Open mics are viewable to public or admins" ON public.open_mics;
DROP POLICY IF EXISTS "Hosts can create open mics" ON public.open_mics;
DROP POLICY IF EXISTS "Authenticated users can create open mics" ON public.open_mics;
DROP POLICY IF EXISTS "Submissions and admin creates for open mics" ON public.open_mics;
DROP POLICY IF EXISTS "Hosts/Venues can update their open mics" ON public.open_mics;
DROP POLICY IF EXISTS "Users can update their own open mics" ON public.open_mics;
DROP POLICY IF EXISTS "Only admins can delete open mics" ON public.open_mics;
DROP POLICY IF EXISTS "open_mics_select_public_or_admin" ON public.open_mics;
DROP POLICY IF EXISTS "open_mics_insert_pending_or_admin" ON public.open_mics;
DROP POLICY IF EXISTS "open_mics_update_admins_only" ON public.open_mics;
DROP POLICY IF EXISTS "open_mics_delete_admins_only" ON public.open_mics;

-- SELECT: public sees live listings only; admins see all rows (pending queue + live)
CREATE POLICY "open_mics_select_public_or_admin"
ON public.open_mics
FOR SELECT
TO public
USING (
  is_active = true
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- INSERT: anyone may submit a pending row; only admins may insert or import live rows
CREATE POLICY "open_mics_insert_pending_or_admin"
ON public.open_mics
FOR INSERT
TO public
WITH CHECK (
  is_active = false
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- UPDATE: admins only (approve, edit modal, bulk operations from admin UI)
CREATE POLICY "open_mics_update_admins_only"
ON public.open_mics
FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- DELETE: admins only (reject submission or remove listing)
CREATE POLICY "open_mics_delete_admins_only"
ON public.open_mics
FOR DELETE
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- -----------------------------------------------------------------------------
-- Optional: Realtime for HomeMicFinder live counts (ignore error if already added)
-- -----------------------------------------------------------------------------
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.open_mics;
