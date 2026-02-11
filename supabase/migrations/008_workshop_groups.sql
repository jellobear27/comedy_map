-- ============================================
-- PRIVATE WORKSHOP GROUPS
-- Small trusted groups for comedians to workshop material
-- ============================================

-- 1. Workshop groups table
CREATE TABLE IF NOT EXISTS public.workshop_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  max_members INTEGER DEFAULT 10,
  is_private BOOLEAN DEFAULT true,
  invite_code TEXT UNIQUE, -- For invite links
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Group memberships
CREATE TABLE IF NOT EXISTS public.workshop_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.workshop_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- 3. Group invites
CREATE TABLE IF NOT EXISTS public.workshop_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.workshop_groups(id) ON DELETE CASCADE NOT NULL,
  inviter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  invitee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_email TEXT, -- For inviting by email
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'expired')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- 4. Workshop posts (material being workshopped)
CREATE TABLE IF NOT EXISTS public.workshop_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.workshop_groups(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- The joke/bit
  post_type TEXT CHECK (post_type IN ('joke', 'bit', 'premise', 'crowdwork', 'setlist', 'other')) DEFAULT 'joke',
  video_url TEXT, -- Optional video clip
  status TEXT CHECK (status IN ('draft', 'seeking_feedback', 'revised', 'stage_ready')) DEFAULT 'seeking_feedback',
  feedback_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Workshop feedback (comments on posts)
CREATE TABLE IF NOT EXISTS public.workshop_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.workshop_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  feedback_type TEXT CHECK (feedback_type IN ('general', 'punchline', 'premise', 'timing', 'wording', 'structure')) DEFAULT 'general',
  rating TEXT CHECK (rating IN ('hits', 'almost', 'needs_work')), -- Optional quick rating
  is_helpful BOOLEAN DEFAULT false, -- Marked helpful by post author
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_workshop_groups_owner ON public.workshop_groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_workshop_memberships_group ON public.workshop_memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_workshop_memberships_user ON public.workshop_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_posts_group ON public.workshop_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_workshop_posts_author ON public.workshop_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_workshop_feedback_post ON public.workshop_feedback(post_id);
CREATE INDEX IF NOT EXISTS idx_workshop_invites_invitee ON public.workshop_invites(invitee_id);

-- 7. Enable RLS
ALTER TABLE public.workshop_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_feedback ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies for workshop_groups
-- Members can view their groups
CREATE POLICY "Members can view their groups"
ON public.workshop_groups FOR SELECT
USING (
  id IN (SELECT group_id FROM public.workshop_memberships WHERE user_id = auth.uid())
);

-- Authenticated users can create groups
CREATE POLICY "Users can create groups"
ON public.workshop_groups FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- Owners can update their groups
CREATE POLICY "Owners can update their groups"
ON public.workshop_groups FOR UPDATE
USING (owner_id = auth.uid());

-- Owners can delete their groups
CREATE POLICY "Owners can delete their groups"
ON public.workshop_groups FOR DELETE
USING (owner_id = auth.uid());

-- 9. RLS Policies for memberships
CREATE POLICY "Members can view group memberships"
ON public.workshop_memberships FOR SELECT
USING (
  group_id IN (SELECT group_id FROM public.workshop_memberships WHERE user_id = auth.uid())
);

CREATE POLICY "Group admins can manage memberships"
ON public.workshop_memberships FOR INSERT
WITH CHECK (
  group_id IN (
    SELECT group_id FROM public.workshop_memberships 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
  OR user_id = auth.uid() -- Users can add themselves when accepting invite
);

CREATE POLICY "Users can leave groups"
ON public.workshop_memberships FOR DELETE
USING (user_id = auth.uid() OR 
  group_id IN (
    SELECT group_id FROM public.workshop_memberships 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- 10. RLS Policies for invites
CREATE POLICY "Users can view their invites"
ON public.workshop_invites FOR SELECT
USING (invitee_id = auth.uid() OR inviter_id = auth.uid());

CREATE POLICY "Members can create invites"
ON public.workshop_invites FOR INSERT
WITH CHECK (
  group_id IN (SELECT group_id FROM public.workshop_memberships WHERE user_id = auth.uid())
);

CREATE POLICY "Invitees can update invite status"
ON public.workshop_invites FOR UPDATE
USING (invitee_id = auth.uid());

-- 11. RLS Policies for posts
CREATE POLICY "Members can view group posts"
ON public.workshop_posts FOR SELECT
USING (
  group_id IN (SELECT group_id FROM public.workshop_memberships WHERE user_id = auth.uid())
);

CREATE POLICY "Members can create posts"
ON public.workshop_posts FOR INSERT
WITH CHECK (
  group_id IN (SELECT group_id FROM public.workshop_memberships WHERE user_id = auth.uid())
);

CREATE POLICY "Authors can update their posts"
ON public.workshop_posts FOR UPDATE
USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their posts"
ON public.workshop_posts FOR DELETE
USING (author_id = auth.uid());

-- 12. RLS Policies for feedback
CREATE POLICY "Members can view feedback"
ON public.workshop_feedback FOR SELECT
USING (
  post_id IN (
    SELECT wp.id FROM public.workshop_posts wp
    JOIN public.workshop_memberships wm ON wp.group_id = wm.group_id
    WHERE wm.user_id = auth.uid()
  )
);

CREATE POLICY "Members can give feedback"
ON public.workshop_feedback FOR INSERT
WITH CHECK (
  post_id IN (
    SELECT wp.id FROM public.workshop_posts wp
    JOIN public.workshop_memberships wm ON wp.group_id = wm.group_id
    WHERE wm.user_id = auth.uid()
  )
);

CREATE POLICY "Authors can update their feedback"
ON public.workshop_feedback FOR UPDATE
USING (author_id = auth.uid());

-- 13. Function to update feedback count
CREATE OR REPLACE FUNCTION update_workshop_feedback_count()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $func$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.workshop_posts SET feedback_count = feedback_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.workshop_posts SET feedback_count = feedback_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$func$;

DROP TRIGGER IF EXISTS on_workshop_feedback_change ON public.workshop_feedback;
CREATE TRIGGER on_workshop_feedback_change
  AFTER INSERT OR DELETE ON public.workshop_feedback
  FOR EACH ROW EXECUTE FUNCTION update_workshop_feedback_count();

-- 14. Function to update member count
CREATE OR REPLACE FUNCTION update_workshop_member_count()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $func$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.workshop_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.workshop_groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END;
$func$;

DROP TRIGGER IF EXISTS on_workshop_membership_change ON public.workshop_memberships;
CREATE TRIGGER on_workshop_membership_change
  AFTER INSERT OR DELETE ON public.workshop_memberships
  FOR EACH ROW EXECUTE FUNCTION update_workshop_member_count();

-- 15. Function to generate invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $func$
BEGIN
  IF NEW.invite_code IS NULL THEN
    NEW.invite_code := encode(gen_random_bytes(6), 'hex');
  END IF;
  RETURN NEW;
END;
$func$;

DROP TRIGGER IF EXISTS on_workshop_group_create ON public.workshop_groups;
CREATE TRIGGER on_workshop_group_create
  BEFORE INSERT ON public.workshop_groups
  FOR EACH ROW EXECUTE FUNCTION generate_invite_code();

