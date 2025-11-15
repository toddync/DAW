-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  amenities TEXT[] DEFAULT '{}',
  bathroom BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create beds table
CREATE TABLE IF NOT EXISTS beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('single', 'couple', 'bunk')),
  position TEXT NOT NULL CHECK (position IN ('near_door', 'center', 'window')),
  amenities TEXT[] DEFAULT '{}',
  price_per_night NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_id UUID NOT NULL REFERENCES beds(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guest_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for efficient booking lookups
CREATE INDEX IF NOT EXISTS bookings_bed_id_dates_idx ON bookings (bed_id, start_date, end_date);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY rooms_public ON rooms FOR SELECT USING (true);
CREATE POLICY beds_public ON beds FOR SELECT USING (true);
CREATE POLICY bookings_public ON bookings FOR SELECT USING (true);
CREATE POLICY bookings_insert ON bookings FOR INSERT WITH CHECK (true);
