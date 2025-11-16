// lib/types.ts

// Tipos baseados nas ENUMs do banco de dados
export type StatusReserva = 'rascunho' | 'pendente' | 'confirmada' | 'checkin' | 'checkout' | 'cancelada' | 'no_show';
export type StatusPagamento = 'pendente' | 'processando' | 'aprovado' | 'recusado' | 'estornado' | 'reembolsado';
export type MetodoPagamento = 'credito' | 'debito' | 'pix' | 'dinheiro' | 'transferencia';
export type TipoPacote = 'promocional' | 'temporada' | 'fidelidade' | 'grupo' | 'personalizado';

// Interface para a tabela 'usuarios'
export interface Usuario {
  id: string;
  nome?: string | null;
  email: string;
  role: string;
  cpf?: string | null;
  identidade?: string | null;
  passaporte?: string | null;
  nacionalidade?: string | null;
  endereco?: string | null;
  telefone?: string | null;
  data_cadastro: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// Interface para a tabela 'caracteristicas_quarto'
export interface CaracteristicaQuarto {
  id: string;
  nome: string;
  codigo: string;
  tipo_valor: 'booleano' | 'texto' | 'numerico' | 'data';
  descricao?: string | null;
  categoria: string;
  icone?: string | null;
  ativo: boolean;
}

// Interface para a tabela 'quarto_caracteristicas' (junção)
export interface QuartoCaracteristica {
  valor_booleano?: boolean | null;
  valor_texto?: string | null;
  valor_numerico?: number | null;
  caracteristica: CaracteristicaQuarto;
}

// Interface para a tabela 'vagas'
export interface Vaga {
  id: string;
  quarto_id: string;
  numero_vaga: number;
  tipo_cama: 'superior' | 'inferior' | 'solteiro';
  posicao: 'porta' | 'janela' | 'centro';
  status: 'disponivel' | 'ocupada' | 'manutencao' | 'reservada';
  observacoes?: string | null;
  // Propriedade adicionada pela API
  available?: boolean;
}

// Interface para a tabela 'quartos'
export interface Quarto {
  id: string;
  numero: string;
  tipo_quarto: '4_vagas' | '8_vagas' | '12_vagas';
  capacidade: number;
  preco_base: number;
  ativo: boolean;
  descricao?: string | null;
  images?: string[] | null;
  created_at: string;
  updated_at: string;
}

// Tipo estendido para incluir as vagas e características aninhadas, como retornado pela API
export interface QuartoComVagas extends Quarto {
  vagas: Vaga[];
  caracteristicas: QuartoCaracteristica[];
}

// Interface para a tabela 'reservas'
export interface Reserva {
  id: string;
  usuario_id: string;
  politica_cancelamento_id: string;
  codigo_reserva: string;
  data_checkin: string;
  data_checkout: string;
  data_reserva: string;
  status: StatusReserva;
  valor_total: number;
  termos_aceitos: boolean;
  data_aceite_termos?: string | null;
  motivo_cancelamento?: string | null;
}

// Interface para a tabela 'carrinho_itens'
export interface CarrinhoItem {
    id: string;
    usuario_id: string;
    vaga_id: string;
    data_inicio: string;
    data_fim: string;
    created_at: string;
    // Objeto aninhado retornado pela API
    vaga?: Vaga & { quarto?: Quarto };
}

// Interface para a tabela 'pacotes' (revisada)
export interface Pacote {
  id: string;
  nome: string;
  descricao?: string | null;
  created_at: string;
  updated_at: string;
}

// Interface para a tabela 'pacote_quartos'
export interface PacoteQuarto {
  id: string;
  pacote_id: string;
  quarto_id: string;
  data_inicio: string;
  data_fim: string;
  preco_total_pacote: number;
  fechar_quarto: boolean;
  created_at: string;
  updated_at: string;
  // Opcional: para incluir dados do pacote e do quarto ao buscar
  pacotes?: Pacote;
  quartos?: Quarto;
}