import React, { useEffect, useState } from 'react';
import './style.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const pokemonsPerPage = 40;

  // Carregar Pokémon
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        const data = await response.json();
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );

        setPokemons(pokemonDetails);
      } catch (error) {
        console.error('Erro ao carregar os Pokémon:', error);
      }
    };

    fetchPokemons();
  }, []);

  // Função para abrir o modal de detalhes do Pokémon
  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  // Fechar o modal
  const closeModal = () => {
    setSelectedPokemon(null);
  };

  // Filtro de pesquisa
  const filteredPokemons = pokemons.filter(pokemon => 
    pokemon.name.toLowerCase().includes(search.toLowerCase()) || 
    pokemon.id.toString().includes(search) // Busca por ID também
  );

  // Lógica de paginação
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  
  // Paginação sobre os Pokémons filtrados
  const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

  return (
    <div>
      {/* Logo Pokémon Centralizado */}
      <img src="Pokemon.png" alt="Pokémon Logo" className="logo" />

      {/* Barra de pesquisa */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Catálogo de Pokémons */}
      <div className="pokemon-grid">
        {currentPokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="pokemon-card"
            onClick={() => openModal(pokemon)}
            style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) }}
          >
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <div className="pokemon-info">
              <strong>{pokemon.name.toUpperCase()}</strong>
              <div>Nº {pokemon.id}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Anterior
        </button>
        <span>Página {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastPokemon >= filteredPokemons.length}
          className="pagination-button"
        >
          Próxima
        </button>
      </div>

      {/* Modal de Pokémon Selecionado */}
      {selectedPokemon && (
        <div
          className="pokemon-modal active"
          style={{ backgroundColor: getTypeColor(selectedPokemon.types[0].type.name) }} // Cor do tipo no fundo do modal
        >
          <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
          <h2>{selectedPokemon.name.toUpperCase()}</h2>
          <div className="extra-info">
            <div>Nº {selectedPokemon.id}</div>
            <div>Peso: {selectedPokemon.weight / 10}kg</div>
            <div>Altura: {selectedPokemon.height / 10}m</div>
            <div>Tipo: {selectedPokemon.types.map(t => t.type.name).join(', ')}</div>
          </div>
          <button className="close-button" onClick={closeModal}>Fechar</button>
        </div>
      )}
    </div>
  );
}

const getTypeColor = (type) => {
  const colors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878'
  };
  return colors[type] || '#68A090';
};

export default App;
