-- Ensure default cancellation policy exists
-- Correct schema based on scripts/schema.sql
INSERT INTO politicas_cancelamento (
    nome, 
    descricao, 
    dias_antecedencia, 
    multa_percentual, 
    data_inicio
)
SELECT 
    'Política Flexível', 
    'Cancelamento gratuito até 7 dias antes do check-in.', 
    7, 
    0, 
    CURRENT_DATE
WHERE NOT EXISTS (
    SELECT 1 FROM politicas_cancelamento WHERE nome = 'Política Flexível'
);
