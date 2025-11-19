import { createClient } from '@/lib/supabase-server';

async function debugRoom() {
    const supabase = await createClient();
    const id = '2ea80805-e760-4c5c-b22e-d36bea9ccdf8';

    console.log(`Checking room with ID: ${id}`);

    const { data: quarto, error } = await supabase
        .from('quartos')
        .select(`
      *,
      caracteristicas: quarto_caracteristicas (
        caracteristica: caracteristicas_quarto (
          nome,
          codigo,
          categoria,
          icone
        )
      )
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching room:', error);
    } else {
        console.log('Room data:', JSON.stringify(quarto, null, 2));
    }
}

debugRoom();
