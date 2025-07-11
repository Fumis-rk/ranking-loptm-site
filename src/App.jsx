import React, { useState, useEffect } from 'react';
import './App.css';
import { Trophy, Medal, Users, Filter } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

// Import data
import rankingData from './assets/ranking_data.json';
import categoriesData from './assets/unique_categories.json';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      setTimeout(() => {
        const filtered = rankingData.filter(player => player.categoria === selectedCategory);
        setFilteredData(filtered);
        setIsLoading(false);
      }, 300);
    } else {
      setFilteredData([]);
    }
  }, [selectedCategory]);

  const getRankPosition = (index) => {
    if (index === 0) return { icon: <Trophy className="w-6 h-6 text-yellow-500" />, color: "bg-yellow-50 border-yellow-200" };
    if (index === 1) return { icon: <Medal className="w-6 h-6 text-gray-400" />, color: "bg-gray-50 border-gray-200" };
    if (index === 2) return { icon: <Medal className="w-6 h-6 text-amber-600" />, color: "bg-amber-50 border-amber-200" };
    return { icon: <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{index + 1}</span>, color: "bg-white border-gray-200" };
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'ABSOLUTO A (FEM)': 'Absoluto A Feminino',
      'ABSOLUTO A (MAS)': 'Absoluto A Masculino',
      'LADY 30': 'Lady 30',
      'SÊNIOR 30': 'Sênior 30',
      'SUB-09 FEM': 'Sub-09 Feminino',
      'SUB-09 MAS': 'Sub-09 Masculino',
      'SUB-09 Mas': 'Sub-09 Masculino',
      'SUB-11 FEM': 'Sub-11 Feminino',
      'SUB-11 MAS': 'Sub-11 Masculino',
      'SUB-13 FEM': 'Sub-13 Feminino',
      'SUB-13 MAS': 'Sub-13 Masculino',
      'SUB-15 FEM': 'Sub-15 Feminino',
      'SUB-15 MAS': 'Sub-15 Masculino',
      'SUB-19 FEM': 'Sub-19 Feminino',
      'SUB-19 MAS': 'Sub-19 Masculino',
      'SUB-21 FEM': 'Sub-21 Feminino',
      'SUB-21 MAS': 'Sub-21 Masculino',
      'VETERANO 40 FEM': 'Veterano 40 Feminino',
      'VETERANO 40 MAS': 'Veterano 40 Masculino',
      'VETERANO 50 FEM': 'Veterano 50 Feminino',
      'VETERANO 50 MAS': 'Veterano 50 Masculino',
      'VETERANO 60 FEM': 'Veterano 60 Feminino',
      'VETERANO 60 MAS': 'Veterano 60 Masculino',
      'VETERANO 70 FEM': 'Veterano 70 Feminino',
      'VETERANO 70 MAS': 'Veterano 70 Masculino'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Ranking 2025</h1>
              <p className="text-lg text-blue-600 font-semibold">Liga Oeste Paulista de Tênis de Mesa</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Category Selection */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Selecione uma Categoria</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full h-12 text-lg">
                <SelectValue placeholder="Escolha uma categoria para visualizar o ranking" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData.map((category) => (
                  <SelectItem key={category} value={category} className="text-lg py-3">
                    {getCategoryDisplayName(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </motion.div>
          )}

          {!isLoading && selectedCategory && filteredData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Ranking - {getCategoryDisplayName(selectedCategory)}</span>
                    <Badge variant="secondary" className="ml-auto bg-white text-blue-600">
                      {filteredData.length} atletas
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2 p-4">
                    {filteredData.map((player, index) => {
                      const rankInfo = getRankPosition(index);
                      return (
                        <motion.div
                          key={`${player.nome}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${rankInfo.color}`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {rankInfo.icon}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-semibold text-gray-900 text-lg">{player.nome}</h3>
                              <p className="text-sm text-gray-600 mt-1">{player.equipe}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{player.total}</div>
                            <div className="text-sm text-gray-500">pontos</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!isLoading && selectedCategory && filteredData.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 text-lg">Nenhum atleta encontrado nesta categoria.</div>
            </motion.div>
          )}

          {!selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="bg-blue-50 rounded-lg p-8 border-2 border-blue-200">
                <Trophy className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao Ranking 2025</h2>
                <p className="text-gray-600 text-lg">
                  Selecione uma categoria acima para visualizar o ranking dos atletas da Liga Oeste Paulista de Tênis de Mesa.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Liga Oeste Paulista de Tênis de Mesa</p>
          <p className="text-gray-400">Ranking 2025 - Resultados oficiais</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

