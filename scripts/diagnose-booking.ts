
import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';

// Load environment variables
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Use service role if available, but anon is what I have usually

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log('Starting diagnosis...');

  // 1. Get a valid user
  const { data: users, error: userError } = await supabase.from('usuarios').select('id').limit(1);
  if (userError || !users || users.length === 0) {
    console.error('Error fetching user:', userError);
    return;
  }
  const usuarioId = users[0].id;
  console.log('Found User ID:', usuarioId);

  // 2. Get cancellation policy
  const { data: politica, error: politicaError } = await supabase
    .from('politicas_cancelamento')
    .select('id')
    .eq('nome', 'Política Flexível')
    .single();
  
  if (politicaError || !politica) {
    console.error('Error fetching policy:', politicaError);
    console.log('Possible cause: "Política Flexível" not found in politicas_cancelamento table.');
    return;
  }
  console.log('Found Policy ID:', politica.id);

  // 3. Get a valid package and room
  const { data: pacotes, error: pacoteError } = await supabase
    .from('pacote_quartos')
    .select('id, quarto_id, data_inicio, data_fim, preco_total_pacote')
    .gte('data_fim', new Date().toISOString())
    .limit(1);

  if (pacoteError || !pacotes || pacotes.length === 0) {
    console.error('Error fetching package:', pacoteError);
    return;
  }
  const pacote = pacotes[0];
  console.log('Found Package ID:', pacote.id);

  // 4. Get a vaga for this room
  const { data: vagas, error: vagaError } = await supabase
    .from('vagas')
    .select('id')
    .eq('quarto_id', pacote.quarto_id)
    .limit(1);

  if (vagaError || !vagas || vagas.length === 0) {
    console.error('Error fetching vaga:', vagaError);
    return;
  }
  const vagaId = vagas[0].id;
  console.log('Found Vaga ID:', vagaId);

  // 5. Prepare payload
  const payload = {
    p_usuario_id: usuarioId,
    p_politica_id: politica.id,
    p_vagas: [{
      vaga_id: vagaId,
      data_inicio: pacote.data_inicio,
      data_fim: pacote.data_fim,
      preco: 100, // Dummy price
      pacote_quarto_id: pacote.id
    }],
    p_valor_total: 100,
    p_termos_aceitos: true
  };

  console.log('Calling RPC with payload:', JSON.stringify(payload, null, 2));

  // 6. Call RPC
  const { data, error } = await supabase.rpc('criar_reserva_com_vagas', payload);

  if (error) {
    console.error('RPC Call Failed:', error);
    console.error('Error Message:', error.message);
    console.error('Error Details:', error.details);
    console.error('Error Hint:', error.hint);
  } else {
    console.log('RPC Call Successful! Reserva ID:', data);
  }
}

diagnose().catch(console.error);
