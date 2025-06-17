import { useState } from 'react';
import Head from 'next/head';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function Home() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const search = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(
        query
      )}`
    );
    const searchData = await search.json();
    const movie = searchData.results?.[0];
    if (!movie) {
      setResult(null);
      setLoading(false);
      return;
    }
    const details = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=pt-BR`
    );
    const data = await details.json();
    setResult(data);
    setLoading(false);
  };

  const gerarFormatos = () => {
    if (!result) return ['', ''];

    const titulo = result.title;
    const ano = result.release_date?.split('-')[0] || 'Sem data';
    const generos = result.genres.map((g: any) => g.name).join(', ');
    const sinopse = result.overview;
    const classificacao = result.adult ? '+18' : '+13';

    const bloco1 = `📌: ${titulo}
📅: ${ano}
🎭: ${generos}
🎧: ${classificacao}
📝: > ${sinopse}

🎬 Clica aqui para assistir 🎬 

🍿 Aproveite e não esqueça de compartilhar com seus amigos!

🔔 Para mais lançamentos, fique de olho no canal!
_______
@conectemais
@contentconect`;

    const bloco2 = `🍿 | ${titulo}

📅 | ${ano}
🎭 | ${generos}
🔗 | Assista clicando aqui
____

Sinopse: 
${sinopse}
____
@conectemais
@contentconect`;

    return [bloco1, bloco2];
  };

  const [bloco1, bloco2] = gerarFormatos();

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Head>
        <title>Bot de Filmes TMDb</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">🎬 Bot de Filmes - TMDb</h1>
      <input
        type="text"
        className="border p-2 w-full mb-2 rounded"
        placeholder="Digite o nome do filme"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      {result && (
        <div className="space-y-6">
          <div>
            <h2 className="font-bold">Formato 1:</h2>
            <textarea className="w-full h-40 border p-2 rounded" readOnly value={bloco1} />
          </div>
          <div>
            <h2 className="font-bold">Formato 2:</h2>
            <textarea className="w-full h-40 border p-2 rounded" readOnly value={bloco2} />
          </div>
        </div>
      )}
    </div>
  );
}