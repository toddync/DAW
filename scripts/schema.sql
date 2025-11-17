-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.usuarios (
  id uuid NOT NULL,
  nome character varying,
  email character varying NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'client'::text,
  cpf character varying UNIQUE,
  identidade character varying,
  passaporte character varying,
  nacionalidade character varying,
  endereco text,
  telefone character varying,
  data_cadastro timestamp with time zone NOT NULL DEFAULT now(),
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.reservas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  politica_cancelamento_id uuid NOT NULL,
  codigo_reserva character varying NOT NULL UNIQUE,
  data_checkin date NOT NULL,
  data_checkout date NOT NULL,
  data_reserva timestamp with time zone NOT NULL DEFAULT now(),
  status character varying NOT NULL DEFAULT 'pendente'::character varying,
  valor_total numeric NOT NULL CHECK (valor_total >= 0::numeric),
  termos_aceitos boolean NOT NULL DEFAULT false,
  data_aceite_termos timestamp with time zone,
  motivo_cancelamento text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reservas_pkey PRIMARY KEY (id),
  CONSTRAINT reservas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);

CREATE TABLE public.auditoria_reservas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  usuario_id uuid,
  campo_alterado character varying NOT NULL,
  valor_anterior text,
  valor_novo text,
  tipo_operacao character varying NOT NULL CHECK (tipo_operacao::text = ANY (ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying]::text[])),
  data_alteracao timestamp with time zone NOT NULL DEFAULT now(),
  ip_alteracao inet,
  user_agent text,
  CONSTRAINT auditoria_reservas_pkey PRIMARY KEY (id),
  CONSTRAINT auditoria_reservas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);
CREATE TABLE public.avaliacoes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  usuario_id uuid NOT NULL,
  nota integer NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario text,
  data_avaliacao timestamp with time zone NOT NULL DEFAULT now(),
  publica boolean NOT NULL DEFAULT true,
  resposta_gestor text,
  data_resposta timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT avaliacoes_pkey PRIMARY KEY (id),
  CONSTRAINT avaliacoes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);
CREATE TABLE public.caracteristicas_quarto (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome character varying NOT NULL UNIQUE,
  codigo character varying NOT NULL UNIQUE,
  tipo_valor character varying NOT NULL DEFAULT 'booleano'::character varying CHECK (tipo_valor::text = ANY (ARRAY['booleano'::character varying, 'texto'::character varying, 'numerico'::character varying, 'data'::character varying]::text[])),
  descricao text,
  categoria character varying NOT NULL,
  icone character varying,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT caracteristicas_quarto_pkey PRIMARY KEY (id)
);
CREATE TABLE public.caracteristicas_vaga (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome character varying NOT NULL UNIQUE,
  codigo character varying NOT NULL UNIQUE,
  tipo_valor character varying NOT NULL CHECK (tipo_valor::text = ANY (ARRAY['booleano'::character varying, 'texto'::character varying, 'numerico'::character varying, 'data'::character varying]::text[])),
  descricao text,
  categoria character varying NOT NULL,
  icone character varying,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT caracteristicas_vaga_pkey PRIMARY KEY (id)
);
CREATE TABLE public.carrinho_itens (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  vaga_id uuid NOT NULL,
  data_inicio date NOT NULL,
  data_fim date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT carrinho_itens_pkey PRIMARY KEY (id),
  CONSTRAINT carrinho_itens_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);
CREATE TABLE public.controle_ocupacao (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quarto_id uuid NOT NULL,
  data_referencia date NOT NULL,
  vagas_ocupadas integer NOT NULL DEFAULT 0 CHECK (vagas_ocupadas >= 0),
  vagas_disponiveis integer NOT NULL CHECK (vagas_disponiveis >= 0),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT controle_ocupacao_pkey PRIMARY KEY (id)
);
CREATE TABLE public.dados_pagamento_seguros (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pagamento_id uuid NOT NULL UNIQUE,
  token_secure character varying NOT NULL,
  gateway_token character varying,
  hash_dados character varying NOT NULL,
  expirado boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT dados_pagamento_seguros_pkey PRIMARY KEY (id)
);
CREATE TABLE public.facilidades (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome character varying NOT NULL,
  descricao text,
  icone character varying,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT facilidades_pkey PRIMARY KEY (id)
);
CREATE TABLE public.historico_precos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quarto_id uuid NOT NULL,
  preco numeric NOT NULL,
  data_inicio date NOT NULL,
  data_fim date,
  motivo_alteracao character varying,
  usuario_alteracao character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT historico_precos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.limites_visitas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tipo_quarto character varying NOT NULL UNIQUE,
  max_visitantes integer NOT NULL CHECK (max_visitantes >= 0),
  horario_visitas tstzrange,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT limites_visitas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pacote_caracteristicas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pacote_id uuid NOT NULL,
  caracteristica_id uuid NOT NULL,
  obrigatorio boolean NOT NULL DEFAULT false,
  valor_booleano boolean,
  valor_texto text,
  valor_numerico numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pacote_caracteristicas_pkey PRIMARY KEY (id),
  CONSTRAINT pacote_caracteristicas_caracteristica_id_fkey FOREIGN KEY (caracteristica_id) REFERENCES public.caracteristicas_quarto(id)
);
CREATE TABLE public.pacote_facilidades (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pacote_id uuid NOT NULL,
  facilidade_id uuid NOT NULL,
  incluido_gratis boolean NOT NULL DEFAULT false,
  desconto_percentual numeric NOT NULL DEFAULT 0 CHECK (desconto_percentual >= 0::numeric AND desconto_percentual <= 100::numeric),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pacote_facilidades_pkey PRIMARY KEY (id),
  CONSTRAINT pacote_facilidades_facilidade_id_fkey FOREIGN KEY (facilidade_id) REFERENCES public.facilidades(id)
);
CREATE TABLE public.pacote_quartos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pacote_id uuid NOT NULL,
  quarto_id uuid NOT NULL,
  data_inicio date NOT NULL,
  data_fim date NOT NULL,
  preco_total_pacote numeric NOT NULL,
  fechar_quarto boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pacote_quartos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pacote_regras (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pacote_id uuid NOT NULL,
  tipo_regra character varying NOT NULL CHECK (tipo_regra::text = ANY (ARRAY['quantidade_pessoas'::character varying, 'tipo_quarto'::character varying, 'data_reserva'::character varying, 'antecipacao'::character varying, 'duracao_estadia'::character varying, 'dia_semana'::character varying, 'tipo_hospede'::character varying, 'nacionalidade'::character varying]::text[])),
  operador character varying CHECK (operador::text = ANY (ARRAY['='::character varying, '!='::character varying, '>'::character varying, '<'::character varying, '>='::character varying, '<='::character varying, 'IN'::character varying, 'NOT_IN'::character varying, 'BETWEEN'::character varying]::text[])),
  valor text,
  prioridade integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pacote_regras_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pacotes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome character varying NOT NULL,
  descricao text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pacotes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pagamentos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  parcela_numero integer NOT NULL DEFAULT 1,
  valor_parcela numeric NOT NULL CHECK (valor_parcela > 0::numeric),
  metodo_pagamento character varying NOT NULL,
  status character varying NOT NULL DEFAULT 'pendente'::character varying,
  data_vencimento date,
  data_pagamento timestamp with time zone,
  gateway_pagamento character varying,
  id_transacao_gateway character varying,
  ultimos_digitos character varying,
  bandeira_cartao character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pagamentos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.politicas_cancelamento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome character varying NOT NULL,
  dias_antecedencia integer NOT NULL,
  multa_percentual numeric NOT NULL DEFAULT 0,
  descricao text,
  data_inicio date NOT NULL,
  data_fim date,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT politicas_cancelamento_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quarto_caracteristicas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quarto_id uuid NOT NULL,
  caracteristica_id uuid NOT NULL,
  valor_booleano boolean,
  valor_texto text,
  valor_numerico numeric,
  prioridade integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT quarto_caracteristicas_pkey PRIMARY KEY (id),
  CONSTRAINT quarto_caracteristicas_caracteristica_id_fkey FOREIGN KEY (caracteristica_id) REFERENCES public.caracteristicas_quarto(id)
);
CREATE TABLE public.quartos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  numero character varying NOT NULL UNIQUE,
  tipo_quarto character varying NOT NULL CHECK (tipo_quarto::text = ANY (ARRAY['4_vagas'::character varying, '8_vagas'::character varying, '12_vagas'::character varying]::text[])),
  capacidade integer NOT NULL CHECK (capacidade > 0),
  preco_base numeric NOT NULL CHECK (preco_base > 0::numeric),
  ativo boolean NOT NULL DEFAULT true,
  descricao text,
  images text[] DEFAULT '{}'::text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT quartos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reserva_estacionamento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  vaga_estacionamento_id uuid NOT NULL,
  data_entrada date NOT NULL,
  data_saida date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reserva_estacionamento_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reserva_facilidades (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  facilidade_id uuid NOT NULL,
  data_utilizacao timestamp with time zone,
  observacoes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reserva_facilidades_pkey PRIMARY KEY (id),
  CONSTRAINT reserva_facilidades_facilidade_id_fkey FOREIGN KEY (facilidade_id) REFERENCES public.facilidades(id)
);
CREATE TABLE public.reserva_pacotes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  pacote_id uuid NOT NULL,
  valor_aplicado numeric NOT NULL CHECK (valor_aplicado >= 0::numeric),
  desconto_aplicado numeric NOT NULL DEFAULT 0 CHECK (desconto_aplicado >= 0::numeric),
  detalhes_aplicacao jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reserva_pacotes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reserva_vagas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  vaga_id uuid NOT NULL,
  data_entrada date NOT NULL,
  data_saida date NOT NULL,
  valor_diaria numeric NOT NULL CHECK (valor_diaria >= 0::numeric),
  preco_aplicado numeric NOT NULL CHECK (preco_aplicado >= 0::numeric),
  observacoes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reserva_vagas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.termos_uso (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  versao character varying NOT NULL UNIQUE,
  texto text NOT NULL,
  idioma character varying NOT NULL DEFAULT 'pt-BR'::character varying,
  data_publicacao date NOT NULL DEFAULT CURRENT_DATE,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT termos_uso_pkey PRIMARY KEY (id)
);

CREATE TABLE public.vaga_caracteristicas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vaga_id uuid NOT NULL,
  caracteristica_id uuid NOT NULL,
  valor_booleano boolean,
  valor_texto text,
  valor_numerico numeric,
  valor_data date,
  prioridade integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT vaga_caracteristicas_pkey PRIMARY KEY (id),
  CONSTRAINT vaga_caracteristicas_caracteristica_id_fkey FOREIGN KEY (caracteristica_id) REFERENCES public.caracteristicas_vaga(id)
);
CREATE TABLE public.vagas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quarto_id uuid NOT NULL,
  numero_vaga integer NOT NULL,
  tipo_cama character varying NOT NULL CHECK (tipo_cama::text = ANY (ARRAY['superior'::character varying, 'inferior'::character varying, 'solteiro'::character varying]::text[])),
  posicao character varying NOT NULL CHECK (posicao::text = ANY (ARRAY['porta'::character varying, 'janela'::character varying, 'centro'::character varying]::text[])),
  status character varying NOT NULL DEFAULT 'disponivel'::character varying CHECK (status::text = ANY (ARRAY['disponivel'::character varying, 'ocupada'::character varying, 'manutencao'::character varying, 'reservada'::character varying]::text[])),
  observacoes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT vagas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.vagas_estacionamento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  numero character varying NOT NULL UNIQUE,
  tipo character varying NOT NULL CHECK (tipo::text = ANY (ARRAY['normal'::character varying, 'idoso'::character varying, 'deficiente'::character varying, 'vip'::character varying]::text[])),
  status character varying NOT NULL DEFAULT 'disponivel'::character varying CHECK (status::text = ANY (ARRAY['disponivel'::character varying, 'ocupada'::character varying, 'manutencao'::character varying, 'reservada'::character varying]::text[])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT vagas_estacionamento_pkey PRIMARY KEY (id)
);
CREATE TABLE public.visitantes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reserva_id uuid NOT NULL,
  nome character varying NOT NULL,
  documento character varying,
  data_visita date NOT NULL,
  hora_entrada time without time zone NOT NULL,
  hora_saida time without time zone,
  observacoes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT visitantes_pkey PRIMARY KEY (id)
);

-- Add foreign key constraints that reference tables created later
ALTER TABLE public.avaliacoes
  ADD CONSTRAINT avaliacoes_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id);

ALTER TABLE public.pagamentos
  ADD CONSTRAINT pagamentos_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id);

ALTER TABLE public.reserva_estacionamento
  ADD CONSTRAINT reserva_estacionamento_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id);

ALTER TABLE public.reserva_facilidades
  ADD CONSTRAINT reserva_facilidades_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id);

ALTER TABLE public.reserva_pacotes
  ADD CONSTRAINT reserva_pacotes_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id);

ALTER TABLE public.reserva_vagas
  ADD CONSTRAINT reserva_vagas_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id);

ALTER TABLE public.visitantes
  ADD CONSTRAINT visitantes_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id);

-- Add FK from reservas to politicas_cancelamento after politicas_cancelamento is created
ALTER TABLE public.reservas
  ADD CONSTRAINT reservas_politica_cancelamento_id_fkey FOREIGN KEY (politica_cancelamento_id) REFERENCES public.politicas_cancelamento(id);

-- Add FKs that reference public.vagas after vagas is created
ALTER TABLE public.carrinho_itens
  ADD CONSTRAINT carrinho_itens_vaga_id_fkey FOREIGN KEY (vaga_id) REFERENCES public.vagas(id);

ALTER TABLE public.reserva_vagas
  ADD CONSTRAINT reserva_vagas_vaga_id_fkey FOREIGN KEY (vaga_id) REFERENCES public.vagas(id);

ALTER TABLE public.vaga_caracteristicas
  ADD CONSTRAINT vaga_caracteristicas_vaga_id_fkey FOREIGN KEY (vaga_id) REFERENCES public.vagas(id);

-- Add FKs that reference public.quartos after quartos is created
ALTER TABLE public.controle_ocupacao
  ADD CONSTRAINT controle_ocupacao_quarto_id_fkey FOREIGN KEY (quarto_id) REFERENCES public.quartos(id);

ALTER TABLE public.historico_precos
  ADD CONSTRAINT historico_precos_quarto_id_fkey FOREIGN KEY (quarto_id) REFERENCES public.quartos(id);

ALTER TABLE public.pacote_quartos
  ADD CONSTRAINT pacote_quartos_quarto_id_fkey FOREIGN KEY (quarto_id) REFERENCES public.quartos(id);

ALTER TABLE public.quarto_caracteristicas
  ADD CONSTRAINT quarto_caracteristicas_quarto_id_fkey FOREIGN KEY (quarto_id) REFERENCES public.quartos(id);

ALTER TABLE public.vagas
  ADD CONSTRAINT vagas_quarto_id_fkey FOREIGN KEY (quarto_id) REFERENCES public.quartos(id);

-- Add FKs that reference public.pacotes after pacotes is created
ALTER TABLE public.pacote_quartos
  ADD CONSTRAINT pacote_quartos_pacote_id_fkey FOREIGN KEY (pacote_id) REFERENCES public.pacotes(id);

-- Add FKs that reference public.pagamentos after pagamentos is created
ALTER TABLE public.dados_pagamento_seguros
  ADD CONSTRAINT dados_pagamento_seguros_pagamento_id_fkey FOREIGN KEY (pagamento_id) REFERENCES public.pagamentos(id);

-- Add FKs that reference public.vagas_estacionamento after vagas_estacionamento is created
ALTER TABLE public.reserva_estacionamento
  ADD CONSTRAINT reserva_estacionamento_vaga_estacionamento_id_fkey FOREIGN KEY (vaga_estacionamento_id) REFERENCES public.vagas_estacionamento(id);