import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Users, MapPin, Calendar, X } from 'lucide-react';
import './App.css';

// Importar os dados
import rankingData from './assets/ranking_data_with_stages.json';
import categoriesData from './assets/unique_categories.json';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      const athletes = rankingData.filter(athlete => athlete.category === selectedCategory);
      setFilteredAthletes(athletes);
    } else {
      setFilteredAthletes([]);
    }
  }, [selectedCategory]);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{index + 1}</span>;
  };

  const handleAthleteClick = (athlete) => {
    setSelectedAthlete(athlete);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAthlete(null);
  };

  const formatCategoryName = (category) => {
    return category
      .replace(/\(FEM\)/g, 'Feminino')
      .replace(/\(MAS\)/g, 'Masculino')
      .replace(/FEM/g, 'Feminino')
      .replace(/MAS/g, 'Masculino')
      .replace(/Mas/g, 'Masculino')
      .trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">Ranking 2025</h1>
              <p className="text-xl text-blue-100">Liga Oeste Paulista de Tênis de Mesa</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Category Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Selecione uma Categoria</h2>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          >
            <option value="">Escolha uma categoria...</option>
            {categoriesData.map((category) => (
              <option key={category} value={category}>
                {formatCategoryName(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Ranking Display */}
        {selectedCategory && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-semibold">
                    Ranking - {formatCategoryName(selectedCategory)}
                  </h3>
                </div>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {filteredAthletes.length} atletas
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredAthletes.map((athlete, index) => (
                <div
                  key={`${athlete.name}-${athlete.team}`}
                  className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400' : ''
                  }`}
                  onClick={() => handleAthleteClick(athlete)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {athlete.name}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{athlete.team}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {athlete.total_points}
                      </div>
                      <div className="text-sm text-gray-500">pontos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal para exibir etapas do atleta */}
      {showModal && selectedAthlete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedAthlete.name}</h3>
                  <p className="text-blue-100 text-sm mt-1">{selectedAthlete.team}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {selectedAthlete.total_points}
                  </div>
                  <div className="text-gray-600">Total de Pontos</div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-800">Etapas Pontuadas</h4>
                </div>

                {Object.keys(selectedAthlete.stages).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(selectedAthlete.stages).map(([stage, points]) => (
                      <div
                        key={stage}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="font-medium text-gray-800">{stage}</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">{points} pts</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhuma etapa pontuada ainda</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium"
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

