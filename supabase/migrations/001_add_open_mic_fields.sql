-- Migration: Add new fields to open_mics table
-- Run this in your Supabase SQL Editor if you already created the tables

-- Add week_of_month column (0=every week, 1-5=specific week of month)
ALTER TABLE public.open_mics 
ADD COLUMN IF NOT EXISTS week_of_month INTEGER DEFAULT 0 
CHECK (week_of_month >= 0 AND week_of_month <= 5);

-- Add event_type column (open-mic or show)
ALTER TABLE public.open_mics 
ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'open-mic'
CHECK (event_type IN ('open-mic', 'show'));

-- Add venue_name for display when venue_id is not set
ALTER TABLE public.open_mics 
ADD COLUMN IF NOT EXISTS venue_name TEXT;

-- Add host_name for display when host_id is not set
ALTER TABLE public.open_mics 
ADD COLUMN IF NOT EXISTS host_name TEXT;

-- Add contact_email
ALTER TABLE public.open_mics 
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Add website
ALTER TABLE public.open_mics 
ADD COLUMN IF NOT EXISTS website TEXT;

-- Create index for week_of_month queries
CREATE INDEX IF NOT EXISTS idx_open_mics_week_of_month ON public.open_mics(week_of_month);

-- Create index for event_type queries
CREATE INDEX IF NOT EXISTS idx_open_mics_event_type ON public.open_mics(event_type);

