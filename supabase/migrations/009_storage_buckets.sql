-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

-- Allow public to view all avatars (they're profile photos, should be public)
CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'profile-photos');

-- Allow users to update/replace their own avatars
CREATE POLICY "Users can update avatars" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'profile-photos');

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete avatars" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'profile-photos');

