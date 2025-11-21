-- Add package support fields to carrinho_itens table

ALTER TABLE carrinho_itens 
ADD COLUMN IF NOT EXISTS pacote_quarto_id UUID REFERENCES pacote_quartos(id),
ADD COLUMN IF NOT EXISTS preco_fixo DECIMAL(10, 2);

-- Optional: Add index for performance if querying by package
CREATE INDEX IF NOT EXISTS idx_carrinho_itens_pacote ON carrinho_itens(pacote_quarto_id);
