import React, { useState, useEffect } from 'react';
import { Car, Home, Calendar, TrendingUp, Users, CloudRain, Sun, CloudDrizzle, MapPin, UserX, Settings } from 'lucide-react';
import './App.css';
import { Team, Circuit, Prediction, PredictionResult, DriverStats, ConstructorStanding } from './types';
import HomePage from './components/HomePage';
import CurrentSeason from './components/CurrentSeason';
import FantasyPage from './components/FantasyPage';
import LegalFooter from './components/LegalFooter';

// Dynamic API URL - use environment variable or fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5059';

// Enhanced interface for grid entries with status
interface GridEntry {
  driver: string;
  constructor: string;
  status: 'racing' | 'pit-lane' | 'not-racing';
  grid?: number; // Only for racing drivers
}

const App: React.FC = () => {
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [selectedCircuit, setSelectedCircuit] = useState<string>('');
  const [selectedWeather, setSelectedWeather] = useState<string>('Dry');
  const [gridEntries, setGridEntries] = useState<GridEntry[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [driverStats, setDriverStats] = useState<Record<string, DriverStats>>({});
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'current-season' | 'prediction' | 'fantasy'>(() => {
    // Persist active tab in sessionStorage to maintain state on refresh
    const savedTab = sessionStorage.getItem('activeTab');
    return (savedTab as 'home' | 'current-season' | 'prediction' | 'fantasy') || 'home';
  });

  // New state for grid positions with localStorage persistence
  const [gridPositions, setGridPositions] = useState<Array<{driver: string, constructor: string}>>(() => {
    try {
      const saved = localStorage.getItem('f1-predictor-grid-positions');
      return saved ? JSON.parse(saved) : Array(20).fill(null).map(() => ({driver: '', constructor: ''}));
    } catch {
      return Array(20).fill(null).map(() => ({driver: '', constructor: ''}));
    }
  });

  const [pitLaneDrivers, setPitLaneDrivers] = useState<Array<{driver: string, constructor: string}>>(() => {
    try {
      const saved = localStorage.getItem('f1-predictor-pit-lane-drivers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notRacingDrivers, setNotRacingDrivers] = useState<Array<{driver: string, constructor: string}>>(() => {
    try {
      const saved = localStorage.getItem('f1-predictor-not-racing-drivers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save active tab to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Save grid positions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('f1-predictor-grid-positions', JSON.stringify(gridPositions));
  }, [gridPositions]);

  // Save pit lane drivers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('f1-predictor-pit-lane-drivers', JSON.stringify(pitLaneDrivers));
  }, [pitLaneDrivers]);

  // Save not racing drivers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('f1-predictor-not-racing-drivers', JSON.stringify(notRacingDrivers));
  }, [notRacingDrivers]);

  // Save circuit and weather selections
  useEffect(() => {
    if (selectedCircuit) {
      localStorage.setItem('f1-predictor-selected-circuit', selectedCircuit);
    }
  }, [selectedCircuit]);

  useEffect(() => {
    localStorage.setItem('f1-predictor-selected-weather', selectedWeather);
  }, [selectedWeather]);

  // Clear data function for when user closes tab/browser
  useEffect(() => {
    // Check if this is a fresh session (not a refresh)
    const sessionId = sessionStorage.getItem('f1-predictor-session-id');
    
    if (!sessionId) {
      // New session - clear all localStorage data
      localStorage.removeItem('f1-predictor-grid-positions');
      localStorage.removeItem('f1-predictor-pit-lane-drivers');
      localStorage.removeItem('f1-predictor-not-racing-drivers');
      localStorage.removeItem('f1-predictor-selected-circuit');
      localStorage.removeItem('f1-predictor-selected-weather');
      
      // Set session ID so we know this session exists
      sessionStorage.setItem('f1-predictor-session-id', Date.now().toString());
      
      // Reset state to defaults
      setGridPositions(Array(20).fill(null).map(() => ({driver: '', constructor: ''})));
      setPitLaneDrivers([]);
      setNotRacingDrivers([]);
      setSelectedWeather('Dry');
    }

    // Load saved data if it exists (for refreshes)
    const savedCircuit = localStorage.getItem('f1-predictor-selected-circuit');
    const savedWeather = localStorage.getItem('f1-predictor-selected-weather');
    
    if (savedCircuit) setSelectedCircuit(savedCircuit);
    if (savedWeather) setSelectedWeather(savedWeather);
    
  }, []);

  useEffect(() => {
    fetchTeams();
    fetchCircuits();
    fetchDriverStats();
    fetchConstructorStandings();
  }, []);

  useEffect(() => {
    // Initialize grid positions when teams are loaded (only if no saved data)
    if (Object.keys(teams).length > 0 && !localStorage.getItem('f1-predictor-grid-positions')) {
      const newGridPositions = Array(20).fill(null).map(() => ({driver: '', constructor: ''}));
      setGridPositions(newGridPositions);
    }
  }, [teams]);

  // Function to handle tab change and scroll to top
  const handleTabChange = (tabId: 'home' | 'current-season' | 'prediction' | 'fantasy') => {
    setActiveTab(tabId);
    // Scroll to top of the page when switching tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to manually clear all prediction data
  const clearAllPredictionData = () => {
    localStorage.removeItem('f1-predictor-grid-positions');
    localStorage.removeItem('f1-predictor-pit-lane-drivers');
    localStorage.removeItem('f1-predictor-not-racing-drivers');
    localStorage.removeItem('f1-predictor-selected-circuit');
    localStorage.removeItem('f1-predictor-selected-weather');
    
    setGridPositions(Array(20).fill(null).map(() => ({driver: '', constructor: ''})));
    setPitLaneDrivers([]);
    setNotRacingDrivers([]);
    setSelectedWeather('Dry');
    setPredictions(null);
    
    // Reset circuit to first available
    if (circuits.length > 0) {
      setSelectedCircuit(circuits[0].name);
    }
  };

  const fetchTeams = async () => {
    try {
      console.log('Fetching teams from:', `${API_URL}/api/teams`);
      const response = await fetch(`${API_URL}/api/teams`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTeams(data);
      console.log('✅ Teams loaded');
    } catch (error) {
      console.error('Error fetching teams:', error);
      console.error('API_URL being used:', API_URL);
    }
  };

  const fetchCircuits = async () => {
    try {
      console.log('Fetching circuits from:', `${API_URL}/api/circuits`);
      const response = await fetch(`${API_URL}/api/circuits`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCircuits(data);
      if (data.length > 0 && !selectedCircuit) {
        setSelectedCircuit(data[0].name);
      }
    } catch (error) {
      console.error('Error fetching circuits:', error);
      console.error('API_URL being used:', API_URL);
    }
  };

  const fetchDriverStats = async () => {
    try {
      console.log('Fetching driver stats from:', `${API_URL}/api/driver-stats`);
      const response = await fetch(`${API_URL}/api/driver-stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setDriverStats(data);
    } catch (error) {
      console.error('Error fetching driver stats:', error);
      console.error('API_URL being used:', API_URL);
    }
  };

  const fetchConstructorStandings = async () => {
    try {
      console.log('Fetching constructor standings from:', `${API_URL}/api/constructor-standings`);
      const response = await fetch(`${API_URL}/api/constructor-standings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setConstructorStandings(data);
    } catch (error) {
      console.error('Error fetching constructor standings:', error);
      console.error('API_URL being used:', API_URL);
    }
  };

  // Get all available drivers
  const getAllDrivers = () => {
    const allDrivers: Array<{driver: string, constructor: string}> = [];
    Object.entries(teams).forEach(([teamName, team]) => {
      if (team.drivers) {
        team.drivers.forEach((driver: string) => {
          allDrivers.push({
            driver,
            constructor: teamName
          });
        });
      }
    });
    return allDrivers;
  };

  // Get available drivers for a specific position (excluding already selected drivers)
  const getAvailableDriversForPosition = (currentPosition: number) => {
    const allDrivers = getAllDrivers();
    const usedDrivers = new Set<string>();
    
    // Add drivers from grid positions
    gridPositions.forEach((pos, index) => {
      if (index !== currentPosition && pos.driver) {
        usedDrivers.add(pos.driver);
      }
    });
    
    // Add drivers from pit lane
    pitLaneDrivers.forEach(driver => {
      if (driver.driver) {
        usedDrivers.add(driver.driver);
      }
    });
    
    // Add drivers from not racing
    notRacingDrivers.forEach(driver => {
      if (driver.driver) {
        usedDrivers.add(driver.driver);
      }
    });
    
    return allDrivers.filter(driver => !usedDrivers.has(driver.driver));
  };

  // Update grid position driver
  const updateGridPosition = (position: number, driverData: {driver: string, constructor: string}) => {
    const newGridPositions = [...gridPositions];
    newGridPositions[position] = driverData;
    setGridPositions(newGridPositions);
  };

  // Move driver to pit lane
  const moveDriverToPitLane = (position: number) => {
    const driverData = gridPositions[position];
    if (driverData.driver) {
      setPitLaneDrivers([...pitLaneDrivers, driverData]);
      const newGridPositions = [...gridPositions];
      newGridPositions[position] = {driver: '', constructor: ''};
      setGridPositions(newGridPositions);
    }
  };

  // Move driver to not racing
  const moveDriverToNotRacing = (position: number) => {
    const driverData = gridPositions[position];
    if (driverData.driver) {
      setNotRacingDrivers([...notRacingDrivers, driverData]);
      const newGridPositions = [...gridPositions];
      newGridPositions[position] = {driver: '', constructor: ''};
      setGridPositions(newGridPositions);
    }
  };

  // Move pit lane driver back to grid
  const movePitLaneDriverToGrid = (pitIndex: number) => {
    const driverData = pitLaneDrivers[pitIndex];
    // Find first empty grid position
    const emptyPosition = gridPositions.findIndex(pos => !pos.driver);
    if (emptyPosition !== -1) {
      const newGridPositions = [...gridPositions];
      newGridPositions[emptyPosition] = driverData;
      setGridPositions(newGridPositions);
      
      const newPitLaneDrivers = [...pitLaneDrivers];
      newPitLaneDrivers.splice(pitIndex, 1);
      setPitLaneDrivers(newPitLaneDrivers);
    }
  };

  // Move not racing driver back to grid
  const moveNotRacingDriverToGrid = (notRacingIndex: number) => {
    const driverData = notRacingDrivers[notRacingIndex];
    // Find first empty grid position
    const emptyPosition = gridPositions.findIndex(pos => !pos.driver);
    if (emptyPosition !== -1) {
      const newGridPositions = [...gridPositions];
      newGridPositions[emptyPosition] = driverData;
      setGridPositions(newGridPositions);
      
      const newNotRacingDrivers = [...notRacingDrivers];
      newNotRacingDrivers.splice(notRacingIndex, 1);
      setNotRacingDrivers(newNotRacingDrivers);
    }
  };

  // Move not racing driver to pit lane
  const moveNotRacingDriverToPitLane = (notRacingIndex: number) => {
    const driverData = notRacingDrivers[notRacingIndex];
    setPitLaneDrivers([...pitLaneDrivers, driverData]);
    
    const newNotRacingDrivers = [...notRacingDrivers];
    newNotRacingDrivers.splice(notRacingIndex, 1);
    setNotRacingDrivers(newNotRacingDrivers);
  };

  // Move pit lane driver to not racing
  const movePitLaneDriverToNotRacing = (pitIndex: number) => {
    const driverData = pitLaneDrivers[pitIndex];
    setNotRacingDrivers([...notRacingDrivers, driverData]);
    
    const newPitLaneDrivers = [...pitLaneDrivers];
    newPitLaneDrivers.splice(pitIndex, 1);
    setPitLaneDrivers(newPitLaneDrivers);
  };

  // Remove driver from pit lane
  const removePitLaneDriver = (pitIndex: number) => {
    const newPitLaneDrivers = [...pitLaneDrivers];
    newPitLaneDrivers.splice(pitIndex, 1);
    setPitLaneDrivers(newPitLaneDrivers);
  };

  // Remove driver from not racing
  const removeNotRacingDriver = (notRacingIndex: number) => {
    const newNotRacingDrivers = [...notRacingDrivers];
    newNotRacingDrivers.splice(notRacingIndex, 1);
    setNotRacingDrivers(newNotRacingDrivers);
  };

  const calculateRealisticWinProbability = (driver: string, constructor: string, gridPosition: number, weather: string) => {
    // Base win probability based on constructor competitiveness (2025 season)
    const constructorBaseProbability: Record<string, number> = {
      'McLaren': 25,
      'Ferrari': 22,
      'Red Bull Racing': 20,
      'Mercedes': 18,
      'Aston Martin': 8,
      'Alpine': 4,
      'Williams': 2,
      'Haas': 1,
      'RB': 1.5,
      'Kick Sauber': 0.5
    };

    // Driver skill multipliers
    const driverMultipliers: Record<string, number> = {
      'Max Verstappen': 1.4,
      'Lewis Hamilton': 1.3,
      'Charles Leclerc': 1.25,
      'Lando Norris': 1.2,
      'George Russell': 1.15,
      'Fernando Alonso': 1.2,
      'Oscar Piastri': 1.1,
      'Carlos Sainz': 1.1,
      'Pierre Gasly': 1.0,
      'Alex Albon': 0.95,
      'Lance Stroll': 0.85,
      'Yuki Tsunoda': 0.9,
      'Nico Hülkenberg': 0.95,
      'Esteban Ocon': 0.9,
      'Kimi Antonelli': 0.8,
      'Oliver Bearman': 0.8,
      'Jack Doohan': 0.75,
      'Gabriel Bortoleto': 0.7,
      'Isack Hadjar': 0.75,
      'Liam Lawson': 0.85
    };

    const baseProbability = constructorBaseProbability[constructor] || 1;
    const driverMultiplier = driverMultipliers[driver] || 1;
    
    // Grid position penalty (starting further back reduces win chances)
    const gridPenalty = Math.max(0, 1 - (gridPosition - 1) * 0.08);
    
    // Weather adjustments (some drivers better in wet)
    let weatherMultiplier = 1;
    if (weather === 'Wet') {
      const wetWeatherExperts = ['Lewis Hamilton', 'Max Verstappen', 'Fernando Alonso'];
      weatherMultiplier = wetWeatherExperts.includes(driver) ? 1.3 : 0.9;
    }
    
    const finalProbability = baseProbability * driverMultiplier * gridPenalty * weatherMultiplier;
    
    // Cap at reasonable maximum (even the best driver from pole shouldn't exceed ~40% in a competitive field)
    return Math.min(40, Math.max(0.1, finalProbability));
  };

  const getPointsForPosition = (position: number): number => {
    const pointsSystem: Record<number, number> = {
      1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
      6: 8, 7: 6, 8: 4, 9: 2, 10: 1
    };
    return pointsSystem[position] || 0;
  };

  const predictRace = async () => {
    if (!selectedCircuit) return;
    
    setLoading(true);
    try {
      // Prepare race entries from grid positions and pit lane drivers
      const raceEntries: Array<{driver: string, constructor: string, grid: number}> = [];
      
      // Add grid drivers
      gridPositions.forEach((pos, index) => {
        if (pos.driver) {
          raceEntries.push({
            driver: pos.driver,
            constructor: pos.constructor,
            grid: index + 1
          });
        }
      });
      
      // Add pit lane drivers
      pitLaneDrivers.forEach(driver => {
        if (driver.driver) {
          raceEntries.push({
            driver: driver.driver,
            constructor: driver.constructor,
            grid: 21
          });
        }
      });

      const requestData = {
        circuit: selectedCircuit,
        weather: selectedWeather,
        entries: raceEntries
      };

      console.log('Making prediction request to:', `${API_URL}/api/predict`);
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Calculate realistic win probabilities and normalize them
      if (data.success && data.predictions) {
        const enhancedPredictions = data.predictions.map((pred: any) => {
          const realisticWinProb = calculateRealisticWinProbability(
            pred.driver, 
            pred.constructor, 
            pred.grid, 
            selectedWeather
          );
          
          return {
            ...pred,
            win_probability: parseFloat(realisticWinProb.toFixed(2))
          };
        });
        
        // Normalize win probabilities so they add up to ~100%
        const totalProb = enhancedPredictions.reduce((sum: number, pred: any) => sum + pred.win_probability, 0);
        const normalizationFactor = 100 / totalProb;
        
        enhancedPredictions.forEach((pred: any) => {
          pred.win_probability = parseFloat((pred.win_probability * normalizationFactor).toFixed(2));
        });
        
        // Sort by win probability (descending) and assign positions
        enhancedPredictions.sort((a: any, b: any) => b.win_probability - a.win_probability);
        enhancedPredictions.forEach((pred: any, index: number) => {
          pred.predicted_position = index + 1;
          pred.podium_chance = index < 3; // Only top 3 get podium
          pred.points_earned = getPointsForPosition(index + 1); // Actual points
        });
        
        data.predictions = enhancedPredictions;
      }
      
      setPredictions(data);
    } catch (error) {
      console.error('Error making prediction:', error);
      console.error('API_URL being used:', API_URL);
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

  const getTeamColor = (teamName: string) => {
    return teams[teamName]?.color || '#FFFFFF';
  };

  const renderDriverGrid = () => {
    const racingDriverCount = gridPositions.filter(pos => pos.driver).length;

    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Driver Status</h3>
          {/* Clear All Button */}
          <button
            onClick={clearAllPredictionData}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-xs rounded transition-colors"
            title="Clear all prediction data"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-4">
          {/* Grid Positions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-400">Starting Grid ({racingDriverCount}/20)</h4>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {gridPositions.map((pos, index) => {
                const availableDrivers = getAvailableDriversForPosition(index);
                
                return (
                  <div key={index} className="group">
                    <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-all">
                      {/* Position Number */}
                      <div className="w-8 text-center font-bold text-lg">
                        {index + 1}
                      </div>
                      
                      {/* Driver Selection */}
                      <div className="flex-1">
                        <select
                          value={pos.driver || ''}
                          onChange={(e) => {
                            const selectedDriver = e.target.value;
                            if (selectedDriver) {
                              const driverData = availableDrivers.find(d => d.driver === selectedDriver);
                              if (driverData) {
                                updateGridPosition(index, driverData);
                              }
                            } else {
                              updateGridPosition(index, {driver: '', constructor: ''});
                            }
                          }}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm"
                        >
                          <option value="">Select Driver</option>
                          {availableDrivers.map(driverData => (
                            <option key={driverData.driver} value={driverData.driver}>
                              {driverData.driver} ({driverData.constructor})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Team Color */}
                      {pos.constructor && (
                        <div 
                          className="w-4 h-4 rounded-full border border-white"
                          style={{ backgroundColor: getTeamColor(pos.constructor) }}
                        />
                      )}
                      
                      {/* Action Buttons */}
                      {pos.driver && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => moveDriverToPitLane(index)}
                            className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-xs rounded"
                            title="Send to Pit Lane"
                          >
                            PL
                          </button>
                          <button
                            onClick={() => moveDriverToNotRacing(index)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-xs rounded"
                            title="Driver Not Racing"
                          >
                            <UserX className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pit Lane Drivers */}
          {pitLaneDrivers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-orange-400 mb-2">Pit Lane Start ({pitLaneDrivers.length})</h4>
              <div className="space-y-2">
                {pitLaneDrivers.map((driverData, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center space-x-3 p-3 bg-orange-600/20 rounded-lg border border-orange-500">
                      <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded font-medium">PL</span>
                      
                      <div 
                        className="w-4 h-4 rounded-full border border-white"
                        style={{ backgroundColor: getTeamColor(driverData.constructor) }}
                      />
                      
                      <div className="flex-1">
                        <div className="text-sm font-medium">{driverData.driver}</div>
                        <div className="text-xs text-gray-400">{driverData.constructor}</div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => movePitLaneDriverToGrid(index)}
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 text-xs rounded"
                          title="Move to Grid"
                        >
                          Grid
                        </button>
                        <button
                          onClick={() => movePitLaneDriverToNotRacing(index)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-xs rounded"
                          title="Driver Not Racing"
                        >
                          <UserX className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not Racing Drivers */}
          {notRacingDrivers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-400 mb-2">Not Racing ({notRacingDrivers.length})</h4>
              <div className="space-y-2">
                {notRacingDrivers.map((driverData, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center space-x-3 p-3 bg-red-600/20 rounded-lg border border-red-500">
                      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded font-medium">DNE</span>
                      
                      <div 
                        className="w-4 h-4 rounded-full border border-white opacity-50"
                        style={{ backgroundColor: getTeamColor(driverData.constructor) }}
                      />
                      
                      <div className="flex-1 opacity-75">
                        <div className="text-sm font-medium">{driverData.driver}</div>
                        <div className="text-xs text-gray-400">{driverData.constructor}</div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => moveNotRacingDriverToGrid(index)}
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 text-xs rounded"
                          title="Add to Grid"
                        >
                          Race
                        </button>
                        <button
                          onClick={() => moveNotRacingDriverToPitLane(index)}
                          className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-xs rounded"
                          title="Pit Lane Start"
                        >
                          PL
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Legend */}
        <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">Legend & Tips:</div>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-1 py-0.5 bg-green-600 text-white rounded">P#</span>
                <span>Racing</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-1 py-0.5 bg-orange-600 text-white rounded">PL</span>
                <span>Pit Lane</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-1 py-0.5 bg-red-600 text-white rounded">DNE</span>
                <span>Not Racing</span>
              </div>
            </div>
            <div className="text-gray-500 mt-2">
              • Select drivers from dropdowns for each grid position • Once selected, drivers won't appear in other dropdowns • Use PL for pit lane starts, DNE for injuries/suspensions
            </div>
            <div className="text-green-400 mt-1 text-xs">
              💾 Data persists on refresh but clears when you close the tab
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRaceSetup = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-red-500" />
        Race Setup
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Circuit</label>
          <select
            value={selectedCircuit}
            onChange={(e) => setSelectedCircuit(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {circuits.map((circuit) => (
              <option key={circuit.name} value={circuit.name}>
                {circuit.name} ({circuit.country})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Weather</label>
          <div className="grid grid-cols-3 gap-2">
            {['Dry', 'Mixed', 'Wet'].map((weather) => (
              <button
                key={weather}
                onClick={() => setSelectedWeather(weather)}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border transition-all ${
                  selectedWeather === weather
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {getWeatherIcon(weather)}
                <span className="text-sm">{weather}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={predictRace}
          disabled={loading || !selectedCircuit}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors font-medium"
        >
          {loading ? 'Predicting...' : 'Predict Race'}
        </button>

        {/* Race Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {gridPositions.filter(pos => pos.driver).length}
            </div>
            <div className="text-sm text-gray-400">Racing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">
              {pitLaneDrivers.length}
            </div>
            <div className="text-sm text-gray-400">Pit Lane</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPredictTab = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Top Grid: Driver Status + Race Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Driver Status (Left Column) */}
          <div>
            {renderDriverGrid()}
          </div>

          {/* Race Setup (Right Column) */}
          <div>
            {renderRaceSetup()}
          </div>
        </div>

        {/* Bottom: Predictions (Full Width) */}
        <div>
          {predictions && predictions.success ? (
            <div className="space-y-6">
              {/* Race Info */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Race Predictions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{predictions.race_info.circuit.split(' ')[0]}</div>
                    <div className="text-sm text-gray-400">Circuit</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {getWeatherIcon(predictions.race_info.weather)}
                      <span className="text-xl font-bold">{predictions.race_info.weather}</span>
                    </div>
                    <div className="text-sm text-gray-400">Weather</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{Math.round(predictions.race_info.temperature)}°C</div>
                    <div className="text-sm text-gray-400">Air Temp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{Math.round(predictions.race_info.track_temp)}°C</div>
                    <div className="text-sm text-gray-400">Track Temp</div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold mb-4">Predicted Results</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-3 px-2">Pos</th>
                        <th className="text-left py-3 px-2">Driver</th>
                        <th className="text-left py-3 px-2">Team</th>
                        <th className="text-left py-3 px-2">Grid</th>
                        <th className="text-left py-3 px-2">Win %</th>
                        <th className="text-left py-3 px-2">Podium</th>
                        <th className="text-left py-3 px-2">Points</th>
                        <th className="text-left py-3 px-2">Strategy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.predictions.map((pred, index) => {
                        const position = pred.predicted_position;
                        const isDNF = position > 20;
                        
                        return (
                          <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30">
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
                            <td className="py-3 px-2 font-medium">{pred.driver}</td>
                            <td className="py-3 px-2 text-sm text-gray-400">{pred.constructor}</td>
                            <td className="py-3 px-2">
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
                                pred.win_probability > 20 ? 'text-yellow-400' : 'text-gray-400'
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
                                (pred.points_earned || getPointsForPosition(position)) > 0 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                              }`}>
                                {isDNF ? '0' : (pred.points_earned || getPointsForPosition(position))}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-xs text-gray-400">
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
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
              <TrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Predictions Yet</h3>
              <p className="text-gray-500">Configure your race settings and click "Predict Race" to see AI predictions</p>
              <div className="mt-4 text-sm text-gray-600">
                <p>💡 Pro Tips:</p>
                <p>• Select drivers from dropdowns for each grid position</p>
                <p>• Use PL for Pit Lane starts</p>
                <p>• Mark drivers as "Not Racing" for injuries/suspensions</p>
                <p>• Weather affects tire strategy predictions</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Brief copyright notice for Prediction tab */}
      <div className="bg-gray-900/50 border-t border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} F1 Race Predictor • Educational Use Only • 
            F1® and related marks are trademarks of Formula One Licensing B.V.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-white">
      {/* Checkered Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-red-500/20 overflow-hidden">
        {/* Checkered Flag Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #000 25%, transparent 25%),
              linear-gradient(-45deg, #000 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #000 75%),
              linear-gradient(-45deg, transparent 75%, #000 75%)
            `,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
            opacity: 0.4
          }}
        />
        
        {/* Fading overlay - changes based on active tab */}
        <div 
          className="absolute inset-0"
          style={{
            background: activeTab === 'fantasy' 
              ? 'linear-gradient(to right, rgba(147,51,234,0.8) 0%, rgba(147,51,234,0.6) 40%, rgba(147,51,234,0.4) 70%, rgba(147,51,234,0.2) 90%, rgba(147,51,234,0.1) 100%)'
              : 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0.1) 100%)'
          }}
        />

        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            {/* F1 Title with dynamic gradient */}
            <div className="flex items-center">
              <h1 className={`text-2xl font-bold bg-clip-text text-transparent ${
                activeTab === 'fantasy' 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-300'
                  : 'bg-gradient-to-r from-red-500 to-white'
              }`}>
                F1 Race Predictor
              </h1>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'current-season', icon: Calendar, label: 'Current Season' },
                { id: 'prediction', icon: TrendingUp, label: 'Prediction' },
                { id: 'fantasy', icon: Users, label: 'Fantasy' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as 'home' | 'current-season' | 'prediction' | 'fantasy')}
                  className={`px-4 py-2 rounded-md transition-all flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? tab.id === 'fantasy' 
                        ? 'bg-purple-600 text-white scale-105'
                        : 'bg-red-600 text-white scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {activeTab === 'home' && (
          <>
            <HomePage />
            <LegalFooter />
          </>
        )}
        {activeTab === 'current-season' && (
          <>
            <CurrentSeason />
            {/* Brief copyright notice for Current Season */}
            <div className="bg-gray-900/50 border-t border-gray-700 py-4">
              <div className="container mx-auto px-4 text-center">
                <p className="text-xs text-gray-500">
                  © {new Date().getFullYear()} F1 Race Predictor • Educational Use Only • 
                  F1® and related marks are trademarks of Formula One Licensing B.V.
                </p>
              </div>
            </div>
          </>
        )}
        {activeTab === 'prediction' && renderPredictTab()}
        {activeTab === 'fantasy' && (
          <>
            <FantasyPage circuits={circuits} />
            {/* Brief copyright notice for Fantasy */}
            <div className="bg-gray-900/50 border-t border-gray-700 py-4">
              <div className="container mx-auto px-4 text-center">
                <p className="text-xs text-gray-500">
                  © {new Date().getFullYear()} F1 Race Predictor • Educational Use Only • 
                  F1® and related marks are trademarks of Formula One Licensing B.V.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;