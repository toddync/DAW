-- Update package dates to future dates for testing
-- This will update the package to start tomorrow and last for 3 nights

UPDATE pacote_quartos 
SET 
    data_inicio = CURRENT_DATE + INTERVAL '1 day',
    data_fim = CURRENT_DATE + INTERVAL '4 days',
    updated_at = NOW()
WHERE id = '6baa29b8-3323-4886-80be-68075740ffbe';

-- Verify the update
SELECT 
    id,
    data_inicio,
    data_fim,
    preco_total_pacote
FROM pacote_quartos
WHERE id = '6baa29b8-3323-4886-80be-68075740ffbe';
