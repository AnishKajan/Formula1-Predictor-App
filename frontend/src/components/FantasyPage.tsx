import React, { useState, useEffect } from 'react';
import { Users, CloudRain, Sun, CloudDrizzle } from 'lucide-react';
import { Circuit, PredictionResult } from '../types';

// API URL constant
const API_URL = process.env.REACT_APP_API_URL || '';

interface FantasyEntry {
  driver: string;
  constructor: string;
  car: string;
}

interface FantasyPageProps {
  circuits: Circuit[];
}

const FantasyPage: React.FC<FantasyPageProps> = ({ circuits }) => {
  const [fantasyDrivers, setFantasyDrivers] = useState<FantasyEntry[]>([]);
  const [selectedCircuit, setSelectedCircuit] = useState<string>('');
  const [selectedWeather, setSelectedWeather] = useState<string>('Dry');
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize fantasy drivers with 20 default entries
  useEffect(() => {
    if (fantasyDrivers.length === 0) {
      const defaultDrivers = Array(20).fill(null).map(() => ({
        driver: '',
        constructor: '',
        car: ''
      }));
      setFantasyDrivers(defaultDrivers);
    }
  }, [fantasyDrivers.length]);

  // Initialize circuit selection
  useEffect(() => {
    if (circuits.length > 0 && !selectedCircuit) {
      setSelectedCircuit(circuits[0].name);
    }
  }, [circuits, selectedCircuit]);

  // Fantasy driver options (historical and current)
  const allFantasyDrivers = [
    // Current drivers
    'Max Verstappen', 'Lewis Hamilton', 'Charles Leclerc', 'Lando Norris',
    'George Russell', 'Fernando Alonso', 'Oscar Piastri', 'Carlos Sainz',
    'Pierre Gasly', 'Alex Albon', 'Lance Stroll', 'Yuki Tsunoda',
    'Nico Hülkenberg', 'Esteban Ocon', 'Kimi Antonelli', 'Oliver Bearman',
    'Jack Doohan', 'Gabriel Bortoleto', 'Isack Hadjar', 'Liam Lawson',
    
    // Legendary drivers
    'Michael Schumacher', 'Ayrton Senna', 'Alain Prost', 'Sebastian Vettel',
    'Kimi Räikkönen', 'Jenson Button', 'Niki Lauda', 'Jackie Stewart',
    'Jim Clark', 'Juan Manuel Fangio', 'Stirling Moss', 'Mika Häkkinen',
    'Nelson Piquet', 'Nigel Mansell', 'Graham Hill', 'Emerson Fittipaldi',
    'Mario Andretti', 'Alberto Ascari', 'Jack Brabham', 'Damon Hill',
    'James Hunt', 'Ronnie Peterson', 'Gilles Villeneuve', 'Jacques Villeneuve',
    'Rubens Barrichello', 'Felipe Massa', 'Ralf Schumacher', 'David Coulthard',
    'Eddie Irvine', 'Heinz-Harald Frentzen', 'Jarno Trulli', 'Jean Alesi',
    'Gerhard Berger', 'Riccardo Patrese', 'Michele Alboreto', 'Thierry Boutsen'
  ];

  const allFantasyConstructors = [
    // Current teams (2020-2025)
    'Red Bull Racing', 'Ferrari', 'Mercedes', 'McLaren', 'Aston Martin',
    'Alpine', 'Williams', 'RB', 'Haas', 'Kick Sauber',
    
    // Recent teams (2015-2024)
    'AlphaTauri', 'Toro Rosso', 'Racing Point', 'Force India', 'Sauber',
    
    // Mid-2000s to 2010s teams (only teams with cars in our dataset)
    'Renault', 'BMW Sauber', 'Toyota', 'Brawn GP', 'BAR', 'Jaguar', 'Jordan', 'Minardi'
  ];

  // Team-specific car models (2005-2025)
  const getCarModelsForTeam = (constructor: string): string[] => {
    const teamCarMap: Record<string, string[]> = {
      // Current teams
      'Red Bull Racing': ['RB21', 'RB20', 'RB19', 'RB18', 'RB16B', 'RB15', 'RB14', 'RB13', 'RB12', 'RB11', 'RB10', 'RB9', 'RB8', 'RB7', 'RB6', 'RB5', 'RB4', 'RB3', 'RB2', 'RB1'],
      'Ferrari': ['SF-25', 'SF-24', 'SF-23', 'F1-75', 'SF21', 'SF1000', 'SF90', 'SF71H', 'SF70H', 'SF16-H', 'SF15-T', 'F14 T', 'F138', 'F2012', 'F150', 'F10', 'F60', 'F2008', 'F2007', 'F248', 'F2005'],
      'Mercedes': ['W16', 'W15', 'W14', 'W13', 'W12', 'W11', 'W10', 'W09', 'W08', 'W07', 'W06', 'W05', 'W04', 'W03', 'W02', 'W01', 'MGP W01'],
      'McLaren': ['MCL39', 'MCL38', 'MCL60', 'MCL35M', 'MCL35', 'MCL34', 'MCL33', 'MCL32', 'MP4-31', 'MP4-30', 'MP4-29', 'MP4-28', 'MP4-27', 'MP4-26', 'MP4-25', 'MP4-24', 'MP4-23', 'MP4-22', 'MP4-21', 'MP4-20'],
      'Williams': ['FW47', 'FW46', 'FW45', 'FW44', 'FW43B', 'FW43', 'FW42', 'FW41', 'FW40', 'FW38', 'FW37', 'FW36', 'FW35', 'FW34', 'FW33', 'FW32', 'FW31', 'FW30', 'FW29', 'FW28', 'FW27'],
      'Aston Martin': ['AMR25', 'AMR24', 'AMR23', 'AMR22', 'AMR21'],
      'Alpine': ['A525', 'A524', 'A523', 'A522', 'A521'],
      'RB': ['VCARB 01', 'AT05', 'AT04', 'AT03', 'AT02', 'AT01'],
      'Haas': ['VF-25', 'VF-24', 'VF-23', 'VF-22', 'VF-21', 'VF-20', 'VF-19', 'VF-18', 'VF-17', 'VF-16'],
      'Kick Sauber': ['C45', 'C44', 'C43', 'C42', 'C41', 'C40', 'C39', 'C38', 'C37', 'C36', 'C35', 'C34', 'C33', 'C32', 'C31', 'C30', 'C29', 'C28', 'C27', 'C26', 'C25', 'C24'],
      
      // Historical teams
      'AlphaTauri': ['AT05', 'AT04', 'AT03', 'AT02', 'AT01'],
      'Toro Rosso': ['STR14', 'STR13', 'STR12', 'STR11', 'STR10', 'STR9', 'STR8', 'STR7', 'STR6', 'STR5', 'STR4', 'STR3', 'STR2', 'STR1'],
      'Racing Point': ['RP20', 'RP19'],
      'Force India': ['VJM11', 'VJM10', 'VJM09', 'VJM08', 'VJM07', 'VJM06', 'VJM05', 'VJM04', 'VJM03', 'VJM02', 'VJM01'],
      'Renault': ['R.S.20', 'R.S.19', 'R.S.18', 'R.S.17', 'R.S.16', 'R30', 'R29', 'R28', 'R27', 'R26', 'R25'],
      'Lotus F1': ['E23', 'E22', 'E21', 'E20'],
      'BMW Sauber': ['F1.09', 'F1.08', 'F1.07', 'F1.06'],
      'Toyota': ['TF109', 'TF108', 'TF107', 'TF106', 'TF105'],
      'Brawn GP': ['BGP 001'],
      'BAR': ['007', '006', '005'],
      'Jaguar': ['R5', 'R4', 'R3', 'R2', 'R1'],
      'Jordan': ['EJ15', 'EJ14', 'EJ13', 'EJ12', 'EJ11', 'EJ10'],
      'Minardi': ['PS05', 'PS04B', 'PS04', 'PS03', 'PS02', 'PS01'],
      'Sauber': ['C24', 'C23', 'C22', 'C21', 'C20', 'C19', 'C18', 'C17', 'C16', 'C15', 'C14', 'C13', 'C12', 'C11', 'C10', 'C9', 'C8', 'C7', 'C6', 'C5']
    };
    
    return teamCarMap[constructor] || [];
  };

  const updateFantasyDriver = (index: number, field: string, value: string) => {
    const updated = [...fantasyDrivers];
    updated[index] = { ...updated[index], [field]: value };
    setFantasyDrivers(updated);
  };

  const addFantasyDriver = () => {
    setFantasyDrivers([...fantasyDrivers, {
      driver: '',
      constructor: '',
      car: ''
    }]);
  };

  const removeFantasyDriver = (index: number) => {
    if (fantasyDrivers.length > 1) {
      const updated = fantasyDrivers.filter((_, i) => i !== index);
      setFantasyDrivers(updated);
    }
  };

  const calculateRealisticWinProbability = (driver: string, constructor: string, gridPosition: number, weather: string) => {
    // Base win probability based on constructor competitiveness (2025 season)
    const constructorBaseProbability: Record<string, number> = {
      'McLaren': 25, 'Ferrari': 22, 'Red Bull Racing': 20, 'Mercedes': 18,
      'Aston Martin': 8, 'Alpine': 4, 'Williams': 2, 'Haas': 1,
      'RB': 1.5, 'Kick Sauber': 0.5,
      // Historical teams
      'Lotus': 15, 'Brabham': 12, 'Tyrrell': 8, 'Cooper': 10,
      'BRM': 6, 'Matra': 9, 'Benetton': 14, 'Jordan': 5
    };

    // Driver skill multipliers (includes historical scaling)
    const driverMultipliers: Record<string, number> = {
      // Current drivers
      'Max Verstappen': 1.4, 'Lewis Hamilton': 1.3, 'Charles Leclerc': 1.25,
      'Lando Norris': 1.2, 'George Russell': 1.15, 'Fernando Alonso': 1.2,
      'Oscar Piastri': 1.1, 'Carlos Sainz': 1.1,
      
      // Legends (adjusted for cross-era comparison)
      'Ayrton Senna': 1.45, 'Michael Schumacher': 1.4, 'Alain Prost': 1.35,
      'Juan Manuel Fangio': 1.4, 'Jim Clark': 1.35, 'Jackie Stewart': 1.3,
      'Niki Lauda': 1.25, 'Mika Häkkinen': 1.2, 'Sebastian Vettel': 1.2,
      'Kimi Räikkönen': 1.1, 'Nigel Mansell': 1.15, 'Nelson Piquet': 1.2,
      
      // 2005-2020 Era drivers
      'Jenson Button': 1.05, 'Felipe Massa': 1.0, 'Mark Webber': 1.05,
      'Daniel Ricciardo': 1.1, 'Valtteri Bottas': 1.05, 'Nico Rosberg': 1.1,
      'Romain Grosjean': 0.95, 'Pastor Maldonado': 0.8, 'Kamui Kobayashi': 0.9,
      'Jean-Eric Vergne': 0.95, 'Nico Hülkenberg': 0.95, 'Sergio Pérez': 1.0
    };

    const baseProbability = constructorBaseProbability[constructor] || 5;
    const driverMultiplier = driverMultipliers[driver] || 1;
    
    // Grid position penalty
    const gridPenalty = Math.max(0, 1 - (gridPosition - 1) * 0.08);
    
    // Weather adjustments
    let weatherMultiplier = 1;
    if (weather === 'Wet') {
      const wetWeatherExperts = ['Lewis Hamilton', 'Max Verstappen', 'Fernando Alonso', 'Ayrton Senna'];
      weatherMultiplier = wetWeatherExperts.includes(driver) ? 1.3 : 0.9;
    }
    
    const finalProbability = baseProbability * driverMultiplier * gridPenalty * weatherMultiplier;
    return Math.min(40, Math.max(0.1, finalProbability));
  };

  const getPointsForPosition = (position: number): number => {
    const pointsSystem: Record<number, number> = {
      1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
      6: 8, 7: 6, 8: 4, 9: 2, 10: 1
    };
    return pointsSystem[position] || 0;
  };

  const predictFantasyRace = async () => {
    setLoading(true);
    try {
      // Filter out empty entries and prepare for prediction
      const validEntries = fantasyDrivers
        .filter(entry => entry.driver && entry.constructor)
        .map((entry, index) => ({
          driver: entry.driver,
          constructor: entry.constructor,
          grid: index + 1
        }));

      if (validEntries.length === 0) {
        alert('Please add at least one driver to predict the race!');
        setLoading(false);
        return;
      }

      // Use the selected circuit and weather for all drivers
      const requestData = {
        circuit: selectedCircuit,
        weather: selectedWeather,
        entries: validEntries
      };

      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      
      // Apply fantasy-specific enhancements
      if (data.success && data.predictions) {
        const enhancedPredictions = data.predictions.map((pred: any) => {
          const fantasyWinProb = calculateRealisticWinProbability(
            pred.driver, 
            pred.constructor, 
            pred.grid, 
            selectedWeather
          );
          
          return {
            ...pred,
            win_probability: parseFloat(fantasyWinProb.toFixed(2))
          };
        });
        
        // Normalize and sort
        const totalProb = enhancedPredictions.reduce((sum: number, pred: any) => sum + pred.win_probability, 0);
        const normalizationFactor = totalProb > 0 ? 100 / totalProb : 1;
        
        enhancedPredictions.forEach((pred: any) => {
          pred.win_probability = parseFloat((pred.win_probability * normalizationFactor).toFixed(2));
        });
        
        enhancedPredictions.sort((a: any, b: any) => b.win_probability - a.win_probability);
        enhancedPredictions.forEach((pred: any, index: number) => {
          pred.predicted_position = index + 1;
          pred.podium_chance = index < 3;
          pred.points_earned = getPointsForPosition(index + 1);
        });
        
        data.predictions = enhancedPredictions;
      }
      
      setPredictions(data);
    } catch (error) {
      console.error('Error making fantasy prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'Wet': return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'Mixed': return <CloudDrizzle className="w-5 h-5 text-gray-500" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-500 font-bold';
    if (position === 2) return 'text-gray-400 font-bold';
    if (position === 3) return 'text-orange-600 font-bold';
    if (position <= 10) return 'text-green-600';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Fantasy Grid Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Fantasy Driver Selection */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-300">Fantasy Lineup</h3>
              <div className="flex space-x-2">
                <button
                  onClick={addFantasyDriver}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                >
                  Add Driver
                </button>
                <span className="px-3 py-1 bg-purple-700/50 rounded-lg text-sm">
                  {fantasyDrivers.length} drivers
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {fantasyDrivers.map((entry, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-3 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 font-medium">P{index + 1}</span>
                    {fantasyDrivers.length > 1 && (
                      <button
                        onClick={() => removeFantasyDriver(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <select
                      value={entry.driver}
                      onChange={(e) => updateFantasyDriver(index, 'driver', e.target.value)}
                      className="w-full bg-gray-600 border border-purple-500/30 rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select Driver</option>
                      {allFantasyDrivers.map(driver => (
                        <option key={driver} value={driver}>{driver}</option>
                      ))}
                    </select>
                    
                    <select
                      value={entry.constructor}
                      onChange={(e) => updateFantasyDriver(index, 'constructor', e.target.value)}
                      className="w-full bg-gray-600 border border-purple-500/30 rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select Team</option>
                      {allFantasyConstructors.map(constructor => (
                        <option key={constructor} value={constructor}>{constructor}</option>
                      ))}
                    </select>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={entry.car}
                        onChange={(e) => updateFantasyDriver(index, 'car', e.target.value)}
                        className="w-full bg-gray-600 border border-purple-500/30 rounded px-2 py-1 text-sm"
                      >
                        <option value="">Car Model</option>
                        {entry.constructor && getCarModelsForTeam(entry.constructor).map(car => (
                          <option key={car} value={car}>{car}</option>
                        ))}
                        {!entry.constructor && <option disabled>Select team first</option>}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fantasy Info */}
            <div className="mt-4 p-3 bg-purple-700/20 rounded-lg border border-purple-500/30">
              <div className="text-xs text-purple-200 mb-2">Fantasy Mode Features:</div>
              <div className="grid grid-cols-1 gap-1 text-xs text-purple-300">
                <div>🏆 Mix drivers from any F1 era</div>
                <div>🏎️ Choose any team and car combination (2005-2025)</div>
                <div>🌍 All drivers race on the same circuit and weather</div>
                <div>📊 Advanced AI predictions for fantasy matchups</div>
              </div>
            </div>
          </div>

          {/* Fantasy Race Setup */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold mb-4 flex items-center text-purple-300">
              <Users className="w-5 h-5 mr-2" />
              Fantasy Race Setup
            </h2>
            
            <div className="space-y-4">
              {/* Circuit Selection */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Circuit</label>
                <select
                  value={selectedCircuit}
                  onChange={(e) => setSelectedCircuit(e.target.value)}
                  className="w-full bg-gray-700 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {circuits.map((circuit) => (
                    <option key={circuit.name} value={circuit.name}>
                      {circuit.name} ({circuit.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* Weather Selection */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Weather</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Dry', 'Mixed', 'Wet'].map((weather) => (
                    <button
                      key={weather}
                      onClick={() => setSelectedWeather(weather)}
                      className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border transition-all ${
                        selectedWeather === weather
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-gray-700 border-purple-500/30 text-purple-200 hover:bg-gray-600'
                      }`}
                    >
                      {getWeatherIcon(weather)}
                      <span className="text-sm">{weather}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-purple-700/20 rounded-lg border border-purple-500/30">
                <h4 className="text-purple-300 font-medium mb-2">Dream Scenario Builder</h4>
                <p className="text-sm text-purple-200 mb-3">
                  Create the ultimate "what if" racing scenario by combining drivers, teams, and cars from across F1 history!
                </p>
                <div className="text-xs text-purple-300 space-y-1">
                  <div>• Put Senna in a modern Red Bull RB21</div>
                  <div>• See Hamilton vs Schumacher in identical cars</div>
                  <div>• Race the legendary MP4/4 at Monaco</div>
                  <div>• Mix current and classic drivers</div>
                </div>
              </div>

              <button
                onClick={predictFantasyRace}
                disabled={loading || fantasyDrivers.filter(d => d.driver && d.constructor).length === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors font-medium"
              >
                {loading ? 'Predicting Fantasy Race...' : 'Predict Fantasy Race'}
              </button>

              {/* Fantasy Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-500/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {fantasyDrivers.filter(d => d.driver).length}
                  </div>
                  <div className="text-sm text-purple-300">Drivers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {new Set(fantasyDrivers.filter(d => d.constructor).map(d => d.constructor)).size}
                  </div>
                  <div className="text-sm text-purple-300">Teams</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedCircuit ? 1 : 0}
                  </div>
                  <div className="text-sm text-purple-300">Circuit</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fantasy Results */}
        <div>
          {predictions && predictions.success ? (
            <div className="space-y-6">
              {/* Race Info */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <h2 className="text-xl font-bold mb-4 text-purple-300">Fantasy Race Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{predictions.race_info.circuit.split(' ')[0]}</div>
                    <div className="text-sm text-purple-200">Circuit</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {getWeatherIcon(predictions.race_info.weather)}
                      <span className="text-xl font-bold text-purple-300">{predictions.race_info.weather}</span>
                    </div>
                    <div className="text-sm text-purple-200">Weather</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{Math.round(predictions.race_info.temperature)}°C</div>
                    <div className="text-sm text-purple-200">Air Temp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{Math.round(predictions.race_info.track_temp)}°C</div>
                    <div className="text-sm text-purple-200">Track Temp</div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-lg font-bold mb-4 text-purple-300">Fantasy Race Results</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-500/30">
                        <th className="text-left py-3 px-2 text-purple-300">Pos</th>
                        <th className="text-left py-3 px-2 text-purple-300">Driver</th>
                        <th className="text-left py-3 px-2 text-purple-300">Team</th>
                        <th className="text-left py-3 px-2 text-purple-300">Grid</th>
                        <th className="text-left py-3 px-2 text-purple-300">Win %</th>
                        <th className="text-left py-3 px-2 text-purple-300">Podium</th>
                        <th className="text-left py-3 px-2 text-purple-300">Points</th>
                        <th className="text-left py-3 px-2 text-purple-300">Strategy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.predictions.map((pred, index) => {
                        const position = pred.predicted_position;
                        const isDNF = position > 20;
                        
                        return (
                          <tr key={index} className="border-b border-purple-500/20 hover:bg-purple-700/20">
                            <td className={`py-3 px-2 text-xl font-bold flex items-center ${getPositionColor(position)}`}>
                              {isDNF ? (
                                <span className="text-red-500">DNF</span>
                              ) : (
                                <>
                                  {position}
                                  {position === 1 && <span className="ml-2 text-yellow-400">🥇</span>}
                                  {position === 2 && <span className="ml-2 text-gray-300">🥈</span>}
                                  {position === 3 && <span className="ml-2 text-orange-400">🥉</span>}
                                </>
                              )}
                            </td>
                            <td className="py-3 px-2 font-medium text-purple-100">{pred.driver}</td>
                            <td className="py-3 px-2 text-sm text-purple-200">{pred.constructor}</td>
                            <td className="py-3 px-2 text-purple-100">
                              {pred.grid === 21 ? (
                                <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">PL</span>
                              ) : (
                                pred.grid
                              )}
                            </td>
                            <td className="py-3 px-2">
                              <span className={`font-medium ${
                                isDNF ? 'text-gray-500' : 
                                pred.win_probability > 50 ? 'text-green-400' : 
                                pred.win_probability > 20 ? 'text-yellow-400' : 'text-purple-300'
                              }`}>
                                {isDNF ? '0%' : `${pred.win_probability}%`}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                isDNF ? 'bg-red-600 text-white' :
                                (pred.podium_chance || position <= 3) ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                              }`}>
                                {isDNF ? 'No' : (pred.podium_chance || position <= 3) ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded text-sm font-medium ${
                                isDNF ? 'bg-red-600 text-white' :
                                (pred.points_earned || getPointsForPosition(position)) > 0 ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                              }`}>
                                {isDNF ? '0' : (pred.points_earned || getPointsForPosition(position))}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-xs text-purple-200">
                              {isDNF ? 'N/A' : pred.tire_strategy}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-purple-500/30 text-center">
              <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-purple-300 mb-2">Ready for Fantasy Racing?</h3>
              <p className="text-purple-200 mb-4">Build your dream lineup and see how they perform!</p>
              <div className="text-sm text-purple-300 space-y-1">
                <p>💡 Pro Tips:</p>
                <p>• Mix legendary drivers with modern cars</p>
                <p>• Try different weather conditions</p>
                <p>• Experiment with historical team combinations</p>
                <p>• See how classics perform on modern circuits</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FantasyPage;
