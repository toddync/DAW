-- Insert sample rooms
INSERT INTO rooms (name, description, amenities, bathroom) VALUES
('Cozy Corner', 'Small private room with a window view', ARRAY['wifi', 'heating', 'desk'], true),
('Sunset View', 'Bright room overlooking the city', ARRAY['wifi', 'air_conditioning', 'safe'], true),
('Budget Bunk Room', 'Shared room with bunk beds', ARRAY['wifi', 'locker'], false),
('Deluxe Suite', 'Spacious room with premium amenities', ARRAY['wifi', 'minibar', 'safe', 'heating', 'air_conditioning'], true),
('Garden Room', 'Peaceful room with garden access', ARRAY['wifi', 'heating', 'balcony'], true),
('Social Hub', 'Shared common room for travelers', ARRAY['wifi', 'kitchen', 'common_area'], false);

-- Insert beds for each room
INSERT INTO beds (room_id, label, type, position, amenities, price_per_night) 
SELECT id, 'Single Bed A', 'single', 'near_door', ARRAY['reading_light'], 45.00 FROM rooms WHERE name = 'Cozy Corner'
UNION ALL
SELECT id, 'Single Bed B', 'single', 'window', ARRAY['reading_light', 'desk_lamp'], 50.00 FROM rooms WHERE name = 'Cozy Corner'
UNION ALL
SELECT id, 'Queen Bed', 'couple', 'center', ARRAY['premium_bedding'], 85.00 FROM rooms WHERE name = 'Sunset View'
UNION ALL
SELECT id, 'Single Bed', 'single', 'window', ARRAY['reading_light'], 40.00 FROM rooms WHERE name = 'Sunset View'
UNION ALL
SELECT id, 'Top Bunk A', 'bunk', 'near_door', ARRAY['locker'], 25.00 FROM rooms WHERE name = 'Budget Bunk Room'
UNION ALL
SELECT id, 'Bottom Bunk A', 'bunk', 'near_door', ARRAY['locker'], 25.00 FROM rooms WHERE name = 'Budget Bunk Room'
UNION ALL
SELECT id, 'Top Bunk B', 'bunk', 'center', ARRAY['locker'], 25.00 FROM rooms WHERE name = 'Budget Bunk Room'
UNION ALL
SELECT id, 'Bottom Bunk B', 'bunk', 'center', ARRAY['locker'], 25.00 FROM rooms WHERE name = 'Budget Bunk Room'
UNION ALL
SELECT id, 'King Bed', 'couple', 'window', ARRAY['premium_bedding', 'sofa'], 120.00 FROM rooms WHERE name = 'Deluxe Suite'
UNION ALL
SELECT id, 'Sofa Bed', 'single', 'center', ARRAY['extra_blankets'], 60.00 FROM rooms WHERE name = 'Deluxe Suite'
UNION ALL
SELECT id, 'Single Bed', 'single', 'window', ARRAY['reading_light', 'garden_view'], 55.00 FROM rooms WHERE name = 'Garden Room'
UNION ALL
SELECT id, 'Double Bed', 'couple', 'center', ARRAY['garden_view'], 75.00 FROM rooms WHERE name = 'Garden Room'
UNION ALL
SELECT id, 'Shared Bunk 1', 'bunk', 'near_door', ARRAY['locker'], 20.00 FROM rooms WHERE name = 'Social Hub'
UNION ALL
SELECT id, 'Shared Bunk 2', 'bunk', 'center', ARRAY['locker'], 20.00 FROM rooms WHERE name = 'Social Hub';

-- Insert sample bookings for testing
INSERT INTO bookings (bed_id, start_date, end_date, guest_name)
SELECT id, CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 'John Smith' 
FROM beds WHERE label = 'Single Bed A' AND room_id = (SELECT id FROM rooms WHERE name = 'Cozy Corner')
UNION ALL
SELECT id, CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '6 days', 'Sarah Johnson'
FROM beds WHERE label = 'Queen Bed' AND room_id = (SELECT id FROM rooms WHERE name = 'Sunset View')
UNION ALL
SELECT id, CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '4 days', 'Mike Chen'
FROM beds WHERE label = 'Top Bunk A' AND room_id = (SELECT id FROM rooms WHERE name = 'Budget Bunk Room')
UNION ALL
SELECT id, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'Emma Wilson'
FROM beds WHERE label = 'King Bed' AND room_id = (SELECT id FROM rooms WHERE name = 'Deluxe Suite');
