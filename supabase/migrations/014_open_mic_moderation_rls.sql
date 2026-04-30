-- Public open mics: only live (is_active) rows visible to non-admins.
-- Submissions (is_active = false); admins have full CRUD via admin UI.
-- Matches supabase/sql/open_mics_admin_and_public_policies.sql for manual runs.

ALTER TABLE public.open_mics ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "open_mics_select_public_or_admin"
ON public.open_mics FOR SELECT TO public
USING (
  is_active = true
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "open_mics_insert_pending_or_admin"
ON public.open_mics FOR INSERT TO public
WITH CHECK (
  is_active = false
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "open_mics_update_admins_only"
ON public.open_mics FOR UPDATE TO public
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

CREATE POLICY "open_mics_delete_admins_only"
ON public.open_mics FOR DELETE TO public
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Realtime (optional): Dashboard → Replication → enable open_mics, or:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.open_mics;
