-- Add images column to rooms table
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS rooms_amenities_idx ON rooms USING GIN (amenities);
