-- Migration: Enhance comedian profiles for talent booking
-- Run this in your Supabase SQL Editor

-- Add new columns to comedian_profiles
ALTER TABLE public.comedian_profiles 
ADD COLUMN IF NOT EXISTS comedy_start_date DATE,
ADD COLUMN IF NOT EXISTS headline TEXT, -- Short tagline like "NYC-based observational comic"
ADD COLUMN IF NOT EXISTS video_clips JSONB DEFAULT '[]', -- Array of {title, url, platform}
ADD COLUMN IF NOT EXISTS available_for_booking BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS booking_rate TEXT, -- "Contact for rates", "$500-1000", etc.
ADD COLUMN IF NOT EXISTS travel_radius TEXT, -- "Local only", "Regional", "National", "International"
ADD COLUMN IF NOT EXISTS performance_types TEXT[] DEFAULT '{}', -- ["standup", "hosting", "corporate", "private"]
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE; -- For public profile URL /comedians/username

-- Add more fields to base profiles table for all users
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Create index for searching comedians
CREATE INDEX IF NOT EXISTS idx_comedian_profiles_available ON public.comedian_profiles(available_for_booking);
CREATE INDEX IF NOT EXISTS idx_comedian_profiles_username ON public.comedian_profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_city_state ON public.profiles(city, state);

-- Update RLS policies for comedian_profiles
CREATE POLICY "Comedian profiles are viewable by everyone" ON public.comedian_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own comedian profile" ON public.comedian_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own comedian profile" ON public.comedian_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to generate a unique username from full_name
CREATE OR REPLACE FUNCTION public.generate_username(full_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base username from full name (lowercase, no spaces)
  base_username := LOWER(REGEXP_REPLACE(full_name, '[^a-zA-Z0-9]', '', 'g'));
  
  -- If empty, use 'comedian'
  IF base_username = '' THEN
    base_username := 'comedian';
  END IF;
  
  final_username := base_username;
  
  -- Check for uniqueness and add number if needed
  WHILE EXISTS (SELECT 1 FROM public.comedian_profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;
  
  RETURN final_username;
END;
$$ LANGUAGE plpgsql;

