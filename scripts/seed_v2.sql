-- Update rooms with images
UPDATE rooms SET images = ARRAY[
  'https://images.unsplash.com/photo-1631049307038-da0ec89d4d0a?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1631049307038-da0ec89d4d0a?w=800&h=600&fit=crop'
] WHERE name = 'Cozy Corner';

UPDATE rooms SET images = ARRAY[
  'https://images.unsplash.com/photo-1611432579699-484f7990f761?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1611432579699-484f7990f761?w=800&h=600&fit=crop'
] WHERE name = 'Sunset View';

UPDATE rooms SET images = ARRAY[
  'https://images.unsplash.com/photo-1555854518-d410251401a3?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1555854518-d410251401a3?w=800&h=600&fit=crop'
] WHERE name = 'Budget Bunk Room';

UPDATE rooms SET images = ARRAY[
  'https://images.unsplash.com/photo-1631049307038-da0ec89d4d0a?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1631049307038-da0ec89d4d0a?w=800&h=600&fit=crop'
] WHERE name = 'Deluxe Suite';

UPDATE rooms SET images = ARRAY[
  'https://images.unsplash.com/photo-1596178065887-cf88b2d05ad9?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1596178065887-cf88b2d05ad9?w=800&h=600&fit=crop'
] WHERE name = 'Garden Room';

UPDATE rooms SET images = ARRAY[
  'https://images.unsplash.com/photo-1551876805-3a2f4b63a6d1?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551876805-3a2f4b63a6d1?w=800&h=600&fit=crop'
] WHERE name = 'Social Hub';
