-- Force update of the RPC function
-- First drop it to ensure no signature conflicts
DROP FUNCTION IF EXISTS public.criar_reserva_com_vagas(uuid, uuid, jsonb, numeric, boolean);

-- Recreate the function with package support
CREATE OR REPLACE FUNCTION public.criar_reserva_com_vagas(
    p_usuario_id uuid,
    p_politica_id uuid,
    p_vagas jsonb,
    p_valor_total numeric,
    p_termos_aceitos boolean
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_reserva_id uuid;
    v_codigo_reserva text;
    v_data_checkin date;
    v_data_checkout date;
    vaga_item jsonb;
    v_vaga_id_check uuid;
    v_data_inicio_check date;
    v_data_fim_check date;
BEGIN
    -- 1. Validar se o array de vagas não está vazio
    IF jsonb_array_length(p_vagas) = 0 THEN
        RAISE EXCEPTION 'A lista de vagas não pode estar vazia.';
    END IF;

    -- 2. Calcular as datas de check-in e check-out globais para a reserva
    SELECT
        MIN((v ->> 'data_inicio')::date),
        MAX((v ->> 'data_fim')::date)
    INTO
        v_data_checkin,
        v_data_checkout
    FROM jsonb_array_elements(p_vagas) AS v;

    -- 3. Verificar a disponibilidade de CADA vaga antes de criar a reserva
    FOR vaga_item IN SELECT * FROM jsonb_array_elements(p_vagas)
    LOOP
        v_vaga_id_check := (vaga_item ->> 'vaga_id')::uuid;
        v_data_inicio_check := (vaga_item ->> 'data_inicio')::date;
        v_data_fim_check := (vaga_item ->> 'data_fim')::date;

        -- Verifica se existe alguma reserva_vaga conflitante (datas se sobrepõem)
        -- para uma reserva que não esteja cancelada.
        IF EXISTS (
            SELECT 1
            FROM public.reserva_vagas rv
            JOIN public.reservas r ON rv.reserva_id = r.id
            WHERE rv.vaga_id = v_vaga_id_check
              AND r.status NOT IN ('cancelada', 'no_show')
              AND (rv.data_entrada, rv.data_saida) OVERLAPS (v_data_inicio_check, v_data_fim_check)
        ) THEN
            RAISE EXCEPTION 'Conflito de reserva: A vaga ID % já está ocupada entre % e %.', v_vaga_id_check, v_data_inicio_check, v_data_fim_check;
        END IF;
    END LOOP;

    -- 4. Gerar um código de reserva único e legível
    v_codigo_reserva := 'URB-' || substr(encode(gen_random_bytes(6), 'hex'), 1, 8);

    -- 5. Inserir o registro principal na tabela `reservas`
    INSERT INTO public.reservas (
        usuario_id,
        politica_cancelamento_id,
        codigo_reserva,
        data_checkin,
        data_checkout,
        valor_total,
        termos_aceitos,
        data_aceite_termos,
        status
    ) VALUES (
        p_usuario_id,
        p_politica_id,
        v_codigo_reserva,
        v_data_checkin,
        v_data_checkout,
        p_valor_total,
        p_termos_aceitos,
        CASE WHEN p_termos_aceitos THEN NOW() ELSE NULL END,
        'pendente'
    ) RETURNING id INTO v_reserva_id;

    -- 6. Inserir cada vaga na tabela `reserva_vagas`
    FOR vaga_item IN SELECT * FROM jsonb_array_elements(p_vagas)
    LOOP
        INSERT INTO public.reserva_vagas (
            reserva_id,
            vaga_id,
            data_entrada,
            data_saida,
            valor_diaria,
            preco_aplicado,
            pacote_quarto_id
        ) VALUES (
            v_reserva_id,
            (vaga_item ->> 'vaga_id')::uuid,
            (vaga_item ->> 'data_inicio')::date,
            (vaga_item ->> 'data_fim')::date,
            (vaga_item ->> 'preco')::numeric,
            (vaga_item ->> 'preco')::numeric,
            (vaga_item ->> 'pacote_quarto_id')::uuid
        );
    END LOOP;

    -- 7. Retornar o ID da reserva recém-criada
    RETURN v_reserva_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Ocorreu um erro ao criar a reserva: %', SQLERRM;
        RAISE;
END;
$$;
