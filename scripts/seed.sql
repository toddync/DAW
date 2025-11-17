-- Script de Carga de Dados (Seed) Final para o Projeto Albergue
-- Versão: 2.0
-- Data: 2025-11-16

-- ========== DADOS DE CONFIGURAÇÃO ==========

-- Inserir características de quartos
INSERT INTO caracteristicas_quarto (nome, codigo, tipo_valor, categoria, descricao, icone) VALUES
('Banheiro Privativo', 'BANHEIRO_PRIV', 'booleano', 'comodidade', 'Quarto com banheiro privativo', 'bath'),
('Ar Condicionado', 'AR_CONDICIONADO', 'booleano', 'comodidade', 'Quarto com ar condicionado', 'snowflake'),
('Acessibilidade', 'ACESSIBILIDADE', 'booleano', 'acessibilidade', 'Quarto adaptado para PCD', 'wheelchair'),
('Vista para o Mar', 'VISTA_MAR', 'booleano', 'vista', 'Quarto com vista para o mar', 'binoculars'),
('Varanda', 'VARANDA', 'booleano', 'comodidade', 'Quarto com varanda privativa', 'door-open'),
('Frigobar', 'FRIGOBAR', 'booleano', 'comodidade', 'Quarto com frigobar', 'snowflake'),
('TV Tela Plana', 'TV_TELA_PLANA', 'booleano', 'entretenimento', 'Quarto com TV de tela plana', 'tv'),
('Wi-Fi Grátis', 'WIFI_GRATIS', 'booleano', 'conectividade', 'Acesso gratuito à internet', 'wifi'),
('Cofre Eletrônico', 'COFRE_ELETRONICO', 'booleano', 'seguranca', 'Cofre eletrônico no quarto', 'lock'),
('Room Service', 'ROOM_SERVICE', 'booleano', 'servico', 'Serviço de quarto disponível', 'bell'),
('Aquecimento', 'AQUECIMENTO', 'booleano', 'comodidade', 'Aquecimento central no quarto', 'fire'),
('Mesa de Trabalho', 'MESA_TRABALHO', 'booleano', 'comodidade', 'Mesa de trabalho ou escrivaninha', 'briefcase'),
('Armário Individual', 'ARMARIO_INDIVIDUAL', 'booleano', 'seguranca', 'Armário individual com chave', 'lock'),
('Quarto Feminino', 'QUARTO_FEMININO', 'booleano', 'seguranca', 'Quarto exclusivo para o gênero feminino', 'female');


-- Inserir características de vagas
INSERT INTO caracteristicas_vaga (nome, codigo, tipo_valor, categoria, descricao, icone) VALUES
('Incidência Solar Manhã', 'SOL_MANHA', 'booleano', 'posicionamento', 'Vaga com incidência solar pela manhã', 'sun'),
('Luz de Leitura', 'LUZ_LEITURA', 'booleano', 'conforto', 'Luz de leitura individual', 'lightbulb'),
('Tomada Próxima', 'TOMADA_PROXIMA', 'booleano', 'conveniencia', 'Ponto de tomada próximo à cama', 'plug');

-- Inserir políticas de cancelamento
INSERT INTO politicas_cancelamento (nome, dias_antecedencia, multa_percentual, descricao, data_inicio) VALUES
('Política Flexível', 7, 0, 'Cancelamento gratuito até 7 dias antes', CURRENT_DATE),
('Política Moderada', 3, 50, 'Multa de 50% para cancelamento em até 3 dias', CURRENT_DATE),
('Política Restritiva', 1, 100, 'Multa de 100% para cancelamento em até 1 dia', CURRENT_DATE);

-- Inserir facilidades
INSERT INTO facilidades (nome, descricao, icone) VALUES
('Restaurante', 'Restaurante anexo com buffet incluso', 'utensils'),
('Piscina', 'Piscina adulto e infantil', 'swimming-pool'),
('Academia', 'Academia completa 24h', 'dumbbell'),
('Business Center', 'Área de trabalho com computadores', 'laptop'),
('Lavanderia', 'Serviço de lavanderia self-service', 'tshirt'),
('Estacionamento', 'Estacionamento gratuito', 'parking'),
('Recepção 24h', 'Recepção aberta 24 horas', 'clock'),
('Bar', 'Bar com drinks especiais', 'cocktail');

-- ========== DADOS DE EXEMPLO ==========

-- Inserir Quartos
INSERT INTO quartos (numero, tipo_quarto, capacidade, preco_base, descricao, images) VALUES
('101', '4_vagas', 4, 120.00, 'Quarto compartilhado para 4 pessoas com vista para a cidade.', ARRAY['https://images.unsplash.com/photo-1585412390088-1a753535106b?w=800&h=600&fit=crop']),
('102', '4_vagas', 4, 130.00, 'Quarto compartilhado para 4 pessoas com banheiro privativo.', ARRAY['https://images.unsplash.com/photo-1590490359854-dfba5d729939?w=800&h=600&fit=crop']),
('201', '8_vagas', 8, 400.00, 'Quarto amplo para grupos de até 8 pessoas.', ARRAY['https://images.unsplash.com/photo-1555854518-d410251401a3?w=800&h=600&fit=crop']),
('202', '8_vagas', 8, 420.00, 'Quarto compartilhado feminino para 8 pessoas.', ARRAY['https://images.unsplash.com/photo-1566647387313-9fda80664898?w=800&h=600&fit=crop']),
('301', '12_vagas', 12, 550.00, 'Dormitório grande para 12 pessoas, ideal para grandes grupos e excursões.', ARRAY['https://images.unsplash.com/photo-1544132194-3d3c5f82790b?w=800&h=600&fit=crop']);


-- Associar Características aos Quartos
-- Quarto 101
INSERT INTO quarto_caracteristicas (quarto_id, caracteristica_id, valor_booleano) VALUES
((SELECT id from quartos where numero = '101'), (SELECT id from caracteristicas_quarto where codigo = 'WIFI_GRATIS'), true),
((SELECT id from quartos where numero = '101'), (SELECT id from caracteristicas_quarto where codigo = 'AR_CONDICIONADO'), true);
-- Quarto 102
INSERT INTO quarto_caracteristicas (quarto_id, caracteristica_id, valor_booleano) VALUES
((SELECT id from quartos where numero = '102'), (SELECT id from caracteristicas_quarto where codigo = 'WIFI_GRATIS'), true),
((SELECT id from quartos where numero = '102'), (SELECT id from caracteristicas_quarto where codigo = 'BANHEIRO_PRIV'), true),
((SELECT id from quartos where numero = '102'), (SELECT id from caracteristicas_quarto where codigo = 'ARMARIO_INDIVIDUAL'), true);
-- Quarto 201
INSERT INTO quarto_caracteristicas (quarto_id, caracteristica_id, valor_booleano) VALUES
((SELECT id from quartos where numero = '201'), (SELECT id from caracteristicas_quarto where codigo = 'WIFI_GRATIS'), true),
((SELECT id from quartos where numero = '201'), (SELECT id from caracteristicas_quarto where codigo = 'ARMARIO_INDIVIDUAL'), true);
-- Quarto 202 (Feminino)
INSERT INTO quarto_caracteristicas (quarto_id, caracteristica_id, valor_booleano) VALUES
((SELECT id from quartos where numero = '202'), (SELECT id from caracteristicas_quarto where codigo = 'WIFI_GRATIS'), true),
((SELECT id from quartos where numero = '202'), (SELECT id from caracteristicas_quarto where codigo = 'ARMARIO_INDIVIDUAL'), true),
((SELECT id from quartos where numero = '202'), (SELECT id from caracteristicas_quarto where codigo = 'QUARTO_FEMININO'), true),
((SELECT id from quartos where numero = '202'), (SELECT id from caracteristicas_quarto where codigo = 'AR_CONDICIONADO'), true);
-- Quarto 301
INSERT INTO quarto_caracteristicas (quarto_id, caracteristica_id, valor_booleano) VALUES
((SELECT id from quartos where numero = '301'), (SELECT id from caracteristicas_quarto where codigo = 'WIFI_GRATIS'), true),
((SELECT id from quartos where numero = '301'), (SELECT id from caracteristicas_quarto where codigo = 'ARMARIO_INDIVIDUAL'), true);


-- Inserir Vagas
-- Vagas para o quarto 101
INSERT INTO vagas (quarto_id, numero_vaga, tipo_cama, posicao) VALUES
((SELECT id from quartos where numero = '101'), 1, 'superior', 'janela'),
((SELECT id from quartos where numero = '101'), 2, 'inferior', 'janela'),
((SELECT id from quartos where numero = '101'), 3, 'superior', 'porta'),
((SELECT id from quartos where numero = '101'), 4, 'inferior', 'porta');
-- Vagas para o quarto 102
INSERT INTO vagas (quarto_id, numero_vaga, tipo_cama, posicao) VALUES
((SELECT id from quartos where numero = '102'), 1, 'solteiro', 'janela'),
((SELECT id from quartos where numero = '102'), 2, 'solteiro', 'janela'),
((SELECT id from quartos where numero = '102'), 3, 'solteiro', 'centro'),
((SELECT id from quartos where numero = '102'), 4, 'solteiro', 'porta');
-- Vagas para o quarto 202
INSERT INTO vagas (quarto_id, numero_vaga, tipo_cama, posicao)
SELECT id, serie, 'superior', 'centro' FROM quartos, generate_series(1, 4) as serie WHERE numero = '202'
UNION ALL
SELECT id, serie, 'inferior', 'centro' FROM quartos, generate_series(5, 8) as serie WHERE numero = '202';
-- Vagas para o quarto 301
INSERT INTO vagas (quarto_id, numero_vaga, tipo_cama, posicao)
SELECT id, serie, 'superior', 'centro' FROM quartos, generate_series(1, 6) as serie WHERE numero = '301'
UNION ALL
SELECT id, serie, 'inferior', 'centro' FROM quartos, generate_series(7, 12) as serie WHERE numero = '301';


-- Associar Características às Vagas
-- Vaga 1 do quarto 101
INSERT INTO vaga_caracteristicas (vaga_id, caracteristica_id, valor_booleano) VALUES
((SELECT id from vagas where quarto_id = (SELECT id from quartos where numero = '101') AND numero_vaga = 1), (SELECT id from caracteristicas_vaga where codigo = 'LUZ_LEITURA'), true),
((SELECT id from vagas where quarto_id = (SELECT id from quartos where numero = '101') AND numero_vaga = 1), (SELECT id from caracteristicas_vaga where codigo = 'TOMADA_PROXIMA'), true),
((SELECT id from vagas where quarto_id = (SELECT id from quartos where numero = '101') AND numero_vaga = 1), (SELECT id from caracteristicas_vaga where codigo = 'SOL_MANHA'), true);

-- Vaga 2 do quarto 101
INSERT INTO vaga_caracteristicas (vaga_id, caracteristica_id, valor_booleano) VALUES
((SELECT id from vagas where quarto_id = (SELECT id from quartos where numero = '101') AND numero_vaga = 2), (SELECT id from caracteristicas_vaga where codigo = 'LUZ_LEITURA'), true),
((SELECT id from vagas where quarto_id = (SELECT id from quartos where numero = '101') AND numero_vaga = 2), (SELECT id from caracteristicas_vaga where codigo = 'TOMADA_PROXIMA'), true);

-- Adicionar luz de leitura e tomada para todas as vagas do quarto 301
INSERT INTO vaga_caracteristicas(vaga_id, caracteristica_id, valor_booleano)
SELECT v.id, (SELECT id from caracteristicas_vaga where codigo = 'LUZ_LEITURA'), true
FROM vagas v WHERE v.quarto_id = (SELECT id from quartos where numero = '301');

INSERT INTO vaga_caracteristicas(vaga_id, caracteristica_id, valor_booleano)
SELECT v.id, (SELECT id from caracteristicas_vaga where codigo = 'TOMADA_PROXIMA'), true
FROM vagas v WHERE v.quarto_id = (SELECT id from quartos where numero = '301');


-- ========== EXEMPLOS DE INSERT COMENTADOS (REQUER ID DE USUÁRIO) ==========

-- Para usar os exemplos abaixo, primeiro crie um usuário de teste no seu projeto Supabase
-- e substitua 'COLOQUE_O_UUID_DO_USUARIO_AQUI' pelo ID do usuário gerado.


-- Exemplo de criação de uma reserva para um usuário
DO $$
DECLARE
    v_usuario_id UUID := '595e510f-3bd3-4252-bf3d-61e440bb1195';
    v_reserva_id UUID;
    v_vaga_id UUID;
    v_politica_id UUID;
BEGIN
    -- Selecionar uma vaga e uma política de cancelamento
    SELECT id INTO v_vaga_id FROM vagas WHERE quarto_id = (SELECT id FROM quartos WHERE numero = '101') AND numero_vaga = 1 LIMIT 1;
    SELECT id INTO v_politica_id FROM politicas_cancelamento WHERE nome = 'Política Flexível' LIMIT 1;
    -- Garantir que exista um registro em `usuarios` para o id fornecido
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = v_usuario_id) THEN
        -- Se o id informado existe em auth.users, use-o para criar o usuário em public.usuarios
        IF EXISTS (SELECT 1 FROM auth.users WHERE id = v_usuario_id) THEN
            INSERT INTO usuarios (id, nome, email, data_cadastro, ativo, created_at, updated_at)
            VALUES (
                v_usuario_id,
                'Seed User',
                'seed-' || encode(gen_random_bytes(4), 'hex') || '@example.com',
                NOW(),
                true,
                NOW(),
                NOW()
            );
        ELSE
            -- Se o id informado não existe em auth.users, tente pegar o primeiro usuário do auth (se houver)
            SELECT id INTO v_usuario_id FROM auth.users LIMIT 1;
            IF v_usuario_id IS NULL THEN
                RAISE NOTICE 'Nenhum usuário encontrado em auth.users e o id fornecido não está presente em public.usuarios. Pulando criação de reserva. Crie um usuário no Supabase Auth ou ajuste v_usuario_id.';
                RETURN;
            ELSE
                -- Cria um registro em usuarios vinculado ao primeiro auth.user disponível
                INSERT INTO usuarios (id, nome, email, data_cadastro, ativo, created_at, updated_at)
                VALUES (
                    v_usuario_id,
                    'Seed User',
                    'seed-' || encode(gen_random_bytes(4), 'hex') || '@example.com',
                    NOW(),
                    true,
                    NOW(),
                    NOW()
                );
            END IF;
        END IF;
    END IF;

    -- Inserir a reserva principal (adicionando codigo_reserva obrigatório)
    INSERT INTO reservas (usuario_id, politica_cancelamento_id, codigo_reserva, data_checkin, data_checkout, valor_total, termos_aceitos, data_aceite_termos)
    VALUES (
        v_usuario_id,
        v_politica_id,
        encode(gen_random_bytes(6), 'hex'), -- gera um código de 12 caracteres
        CURRENT_DATE + 10,
        CURRENT_DATE + 15,
        250.00,
        true,
        NOW()
    )
    RETURNING id INTO v_reserva_id;

    -- Inserir a vaga na reserva
    INSERT INTO reserva_vagas (reserva_id, vaga_id, data_entrada, data_saida, valor_diaria, preco_aplicado)
    VALUES (v_reserva_id, v_vaga_id, CURRENT_DATE + 10, CURRENT_DATE + 15, 50.00, 250.00);

    -- Exemplo de avaliação para a reserva criada
    INSERT INTO avaliacoes (reserva_id, usuario_id, nota, comentario, publica)
    VALUES (v_reserva_id, v_usuario_id, 5, 'Ótima estadia, quarto limpo e organizado!', true);
END $$;


-- Inserir Termos de Uso
INSERT INTO termos_uso (versao, texto, idioma, data_publicacao, ativo) VALUES
('1.0.0', 'Bem-vindo ao Urban Hostel. Ao realizar uma reserva, você concorda com os seguintes termos:
1.  **Check-in e Check-out:** O check-in é a partir das 14:00 e o check-out até às 11:00.
2.  **Pagamento:** O pagamento total é exigido no momento da reserva para garantir sua vaga.
3.  **Cancelamento:** As políticas de cancelamento variam. Consulte a política selecionada no momento da reserva para detalhes sobre multas e prazos.
4.  **Conduta:** Espera-se que todos os hóspedes mantenham um comportamento respeitoso. O hostel se reserva o direito de remover hóspedes que causem perturbações.
5.  **Responsabilidade:** Não nos responsabilizamos por itens pessoais perdidos ou roubados. Utilize os armários individuais.
6.  **Danos:** Quaisquer danos causados à propriedade do hostel serão cobrados do hóspede responsável.
Ao continuar com a reserva, você confirma que leu, compreendeu e aceitou estes termos.', 'pt-BR', CURRENT_DATE, true);

-- Atualizar Termos de Uso com texto mais amigável e objetivo
UPDATE termos_uso
SET
    texto = 'Termos de Uso do Urban Hostel

Ao fazer uma reserva e utilizar nossos serviços, você concorda com as seguintes condições:

Sua reserva pode ser feita com até um ano de antecedência e o pagamento total é realizado no momento da reserva, exclusivamente via cartão de crédito. O check-in é a partir do meio-dia e o check-out deve ser feito até o meio-dia do dia da sua partida.

Oferecemos flexibilidade para cancelamentos: você pode cancelar sua reserva sem penalidades até três dias antes do início da estadia. Cancelamentos feitos após esse período estarão sujeitos a multas, conforme a política específica da sua reserva.

Para sua comodidade, a diária inclui acesso ao nosso restaurante, Wi-Fi de alta velocidade, churrasqueira, lounge e uma área de workstation.

Permitimos visitas, mas o número total de pessoas no quarto (hóspedes e visitantes) não pode exceder a capacidade máxima do quarto. Por favor, note que não são permitidos animais de estimação em nenhuma área do albergue.

Nosso hostel é totalmente acessível para pessoas com deficiência em todas as suas áreas. Além disso, oferecemos um seguro para cobrir danos que sejam de responsabilidade do albergue.

Após sua estadia, você terá a oportunidade de deixar uma avaliação pública, ajudando-nos a melhorar continuamente nossos serviços.

Lembramos que não nos responsabilizamos por itens pessoais perdidos ou roubados; utilize os armários individuais para guardar seus pertences. Pedimos a todos os hóspedes que mantenham uma conduta respeitosa. O Urban Hostel reserva-se o direito de remover hóspedes que causem perturbações ou desrespeitem as regras internas.

Ao prosseguir com sua reserva, você confirma que leu, compreendeu e aceitou estes termos.',
    data_publicacao = CURRENT_DATE,
    ativo = true
WHERE versao = '1.0.0';