-- scripts/cancelar_reserva_atomic.sql

CREATE OR REPLACE FUNCTION public.cancelar_reserva_atomic(
    p_reserva_id uuid,
    p_usuario_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_status text;
    v_politica_id uuid;
    v_data_checkin date;
BEGIN
    -- 1. Verificar se a reserva existe e pertence ao usuário
    SELECT status, politica_cancelamento_id, data_checkin
    INTO v_status, v_politica_id, v_data_checkin
    FROM public.reservas
    WHERE id = p_reserva_id AND usuario_id = p_usuario_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reserva não encontrada ou não pertence ao usuário.';
    END IF;

    -- 2. Verificar se o status permite cancelamento
    IF v_status NOT IN ('pendente', 'confirmada') THEN
        RAISE EXCEPTION 'A reserva não pode ser cancelada no status atual: %', v_status;
    END IF;

    -- 3. Atualizar o status da reserva para 'cancelada'
    UPDATE public.reservas
    SET status = 'cancelada',
        updated_at = now()
    WHERE id = p_reserva_id;

    -- 4. Registrar auditoria
    INSERT INTO public.auditoria_reservas (
        reserva_id,
        usuario_id,
        campo_alterado,
        valor_anterior,
        valor_novo,
        tipo_operacao
    ) VALUES (
        p_reserva_id,
        p_usuario_id,
        'status',
        v_status,
        'cancelada',
        'UPDATE'
    );

END;
$$;
