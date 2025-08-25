import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Users, MapPin, X } from 'lucide-react';
import { csvData } from './data.js';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ranking, setRanking] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAthlete, setSelectedAthlete] = useState(null);

  const processCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV vazio ou com formato inválido.');
    }

    const headers = lines[2].split(',').map(h => h.trim().replace(/"/g, ''));
    const rankingData = {};
    const categoriesSet = new Set();
    const stageColumns = headers.slice(5);

    for (let i = 3; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length < 5) continue;

      const [col, nome, equipe, categoria, total, ...etapas] = values;
      if (!nome || !categoria) continue;

      categoriesSet.add(categoria);
      if (!rankingData[categoria]) rankingData[categoria] = [];

      const atletaEtapas = {};
      stageColumns.forEach((stage, index) => {
        const pontos = etapas[index];
        if (pontos && pontos !== '0' && pontos !== '' && !isNaN(pontos)) {
          atletaEtapas[stage] = parseInt(pontos);
        }
      });

      rankingData[categoria].push({
        nome, equipe,
        total: parseInt(total) || 0,
        etapas: atletaEtapas
      });
    }

    Object.keys(rankingData).forEach(categoria => {
      rankingData[categoria].sort((a, b) => b.total - a.total);
    });

    return {
      rankingData,
      categories: Array.from(categoriesSet).sort()
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { rankingData, categories } = processCSV(csvData);
        setRanking(rankingData);
        setCategories(categories);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCategoryName = (category) => {
    return category
      .replace(/\(FEM\)/g, 'Feminino')
      .replace(/\(MAS\)/g, 'Masculino')
      .trim();
  };

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">#{position}</span>;
    }
  };

  const handleAthleteClick = (athlete) => {
    setSelectedAthlete(athlete);
  };

  const closeModal = () => {
    setSelectedAthlete(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">Erro: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-bold">Ranking 2025</h1>
          </div>
          <p className="text-xl opacity-90">Liga Oeste Paulista de Tênis de Mesa</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Selecione uma Categoria</h2>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
          >
            <option value="">Escolha uma categoria...</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {formatCategoryName(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Ranking Display */}
        {selectedCategory && ranking[selectedCategory] && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-semibold">
                    Ranking - {formatCategoryName(selectedCategory)}
                  </h3>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">
                    {ranking[selectedCategory].length} atletas
                  </span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {ranking[selectedCategory].map((athlete, index) => (
                <div
                  key={index}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                  }`}
                  onClick={() => handleAthleteClick(athlete)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(index + 1)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 hover:text-blue-800 text-lg">
                          {athlete.nome}
                        </h4>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{athlete.equipe}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {athlete.total}
                      </div>
                      <div className="text-sm text-gray-500">pontos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Atleta */}
      {selectedAthlete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-blue-700">{selectedAthlete.nome}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Equipe: {selectedAthlete.equipe}</p>
            <p className="text-gray-600 mb-4">Total de Pontos: <span className="font-bold text-blue-600">{selectedAthlete.total}</span></p>
            
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Pontuação por Etapa:</h4>
            {Object.keys(selectedAthlete.etapas).length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(selectedAthlete.etapas).map(([etapa, pontos]) => (
                  <li key={etapa} className="text-gray-600">
                    <span className="font-medium">{etapa}:</span> {pontos} pontos
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhuma pontuação registrada por etapa.</p>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


