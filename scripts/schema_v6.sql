ALTER TABLE bookings
ADD COLUMN guest_id UUID REFERENCES auth.users(id);

-- It's recommended to backfill existing bookings with the correct guest_id

-- Update RLS policies for bookings
DROP POLICY IF EXISTS bookings_public ON bookings;
DROP POLICY IF EXISTS bookings_insert ON bookings;

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = guest_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = guest_id);
