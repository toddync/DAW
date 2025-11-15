-- Add user_id to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Remove guest_name from bookings table
ALTER TABLE bookings DROP COLUMN IF EXISTS guest_name;
