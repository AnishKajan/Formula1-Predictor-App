// api/predict.js - Race prediction API endpoint
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { circuit, weather, entries } = req.body;

    if (!circuit || !weather || !entries || entries.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields: circuit, weather, and entries' 
      });
    }

    // Generate weather-related features
    const { temperature, humidity, windSpeed, trackTemp } = getWeatherFeatures(circuit, weather);

    // Process each entry and generate predictions
    const predictions = [];
    const winProbabilities = [];

    for (const entry of entries) {
      const { driver, constructor, grid } = entry;
      
      // Calculate realistic win probability
      const winProb = calculateRealisticWinProbability(driver, constructor, grid, weather);
      winProbabilities.push(winProb);

      // Generate personalized tire strategy
      const tireStrategy = getPersonalizedTireStrategy(driver, constructor, grid, weather, circuit);

      predictions.push({
        driver,
        constructor,
        grid,
        win_probability: winProb,
        tire_strategy: tireStrategy,
        predicted_position: 0, // Will be set after sorting
        podium_chance: false,   // Will be set based on final position
        points_earned: 0        // Will be calculated based on final position
      });
    }

    // Normalize win probabilities to sum to ~100%
    const totalWinProb = winProbabilities.reduce((sum, prob) => sum + prob, 0);
    if (totalWinProb > 0) {
      const normalizationFactor = 100.0 / totalWinProb;
      predictions.forEach((pred, index) => {
        pred.win_probability = Math.round(winProbabilities[index] * normalizationFactor * 100) / 100;
      });
    }

    // Sort by win probability (descending) and assign positions
    predictions.sort((a, b) => b.win_probability - a.win_probability);
    
    predictions.forEach((pred, index) => {
      const position = index + 1;
      pred.predicted_position = position;
      pred.podium_chance = position <= 3;
      pred.points_earned = getPointsForPosition(position);
    });

    const response = {
      success: true,
      predictions,
      race_info: {
        circuit,
        weather,
        temperature,
        track_temp: trackTemp,
        humidity,
        wind_speed: windSpeed
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ 
      error: 'Failed to generate race prediction',
      message: error.message 
    });
  }
}

// Helper functions
function getWeatherFeatures(circuitName, weather) {
  const tempMap = {
    'Albert Park Grand Prix Circuit': [18, 28],
    'Suzuka International Racing Course': [15, 25],
    'Shanghai International Circuit': [12, 22],
    'Bahrain International Circuit': [25, 35],
    'Jeddah Corniche Circuit': [28, 38],
    'Miami International Autodrome': [26, 35],
    'Autodromo Enzo e Dino Ferrari': [16, 26],
    'Circuit de Monaco': [18, 28],
    'Circuit Gilles Villeneuve': [12, 22],
    'Circuit de Barcelona-Catalunya': [16, 26],
    'Red Bull Ring': [14, 24],
    'Silverstone Circuit': [12, 22],
    'Hungaroring': [18, 30],
    'Circuit de Spa-Francorchamps': [10, 20],
    'Circuit Park Zandvoort': [12, 22],
    'Autodromo Nazionale di Monza': [16, 26],
    'Baku City Circuit': [20, 30],
    'Marina Bay Street Circuit': [26, 32],
    'Circuit of the Americas': [18, 28],
    'Autodromo Hermanos Rodriguez': [16, 24],
    'Autodromo Jose Carlos Pace': [18, 28],
    'Las Vegas Strip Circuit': [10, 25],
    'Losail International Circuit': [22, 32],
    'Yas Marina Circuit': [24, 32]
  };

  const [minTemp, maxTemp] = tempMap[circuitName] || [20, 30];
  const temperature = Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp;

  let humidity, windSpeed;
  if (weather === 'Wet') {
    humidity = 80 + Math.random() * 15;
    windSpeed = 10 + Math.random() * 10;
  } else if (weather === 'Mixed') {
    humidity = 60 + Math.random() * 25;
    windSpeed = 5 + Math.random() * 15;
  } else {
    humidity = 30 + Math.random() * 40;
    windSpeed = Math.random() * 10;
  }

  const trackTemp = temperature + Math.random() * 20 + 5;

  return {
    temperature,
    humidity,
    windSpeed,
    trackTemp
  };
}

function getRealisticDriverPerformance(driverName) {
  const driverData = {
    // Top Tier - Championship contenders
    'Max Verstappen': { experience: 10, form: 1.5, qualiGap: -0.4, winFactor: 1.4 },
    'Lewis Hamilton': { experience: 18, form: 3.2, qualiGap: -0.1, winFactor: 1.3 },
    'Charles Leclerc': { experience: 7, form: 2.8, qualiGap: -0.2, winFactor: 1.25 },
    'Lando Norris': { experience: 6, form: 2.1, qualiGap: -0.25, winFactor: 1.2 },
    
    // Second Tier - Regular podium contenders  
    'George Russell': { experience: 4, form: 4.1, qualiGap: 0.0, winFactor: 1.15 },
    'Fernando Alonso': { experience: 23, form: 5.3, qualiGap: 0.1, winFactor: 1.2 },
    'Oscar Piastri': { experience: 2, form: 3.4, qualiGap: -0.1, winFactor: 1.1 },
    'Carlos Sainz Jr.': { experience: 10, form: 4.8, qualiGap: 0.2, winFactor: 1.1 },
    
    // Midfield - Occasional points
    'Pierre Gasly': { experience: 7, form: 7.2, qualiGap: 0.3, winFactor: 1.0 },
    'Alexander Albon': { experience: 5, form: 8.5, qualiGap: 0.25, winFactor: 0.95 },
    'Nico Hülkenberg': { experience: 15, form: 9.2, qualiGap: 0.15, winFactor: 0.95 },
    'Esteban Ocon': { experience: 8, form: 8.7, qualiGap: 0.3, winFactor: 0.9 },
    
    // Lower midfield
    'Lance Stroll': { experience: 8, form: 11.8, qualiGap: 0.4, winFactor: 0.85 },
    'Yuki Tsunoda': { experience: 4, form: 10.1, qualiGap: 0.35, winFactor: 0.9 },
    
    // Rookies and backmarkers
    'Andrea Kimi Antonelli': { experience: 1, form: 12.5, qualiGap: 0.6, winFactor: 0.8 },
    'Oliver Bearman': { experience: 1, form: 14.2, qualiGap: 0.7, winFactor: 0.8 },
    'Franco Colapinto': { experience: 1, form: 15.1, qualiGap: 0.8, winFactor: 0.75 },
    'Gabriel Bortoleto': { experience: 1, form: 16.3, qualiGap: 0.9, winFactor: 0.7 },
    'Isack Hadjar': { experience: 1, form: 15.8, qualiGap: 0.85, winFactor: 0.75 },
    'Liam Lawson': { experience: 2, form: 13.9, qualiGap: 0.55, winFactor: 0.85 }
  };
  
  return driverData[driverName] || { experience: 3, form: 15.0, qualiGap: 0.8, winFactor: 0.7 };
}

function getRealisticConstructorPerformance(constructorName) {
  const constructorStandings = {
    'McLaren': { standing: 1, efficiency: 0.98, paceFactor: 1.0 },
    'Ferrari': { standing: 2, efficiency: 0.95, paceFactor: 0.98 },
    'Red Bull Racing': { standing: 3, efficiency: 0.93, paceFactor: 0.96 },
    'Mercedes': { standing: 4, efficiency: 0.90, paceFactor: 0.94 },
    'Aston Martin': { standing: 5, efficiency: 0.85, paceFactor: 0.88 },
    'Alpine': { standing: 6, efficiency: 0.82, paceFactor: 0.85 },
    'Williams': { standing: 9, efficiency: 0.78, paceFactor: 0.82 },
    'Haas': { standing: 7, efficiency: 0.80, paceFactor: 0.83 },
    'RB': { standing: 8, efficiency: 0.79, paceFactor: 0.84 },
    'Kick Sauber': { standing: 10, efficiency: 0.75, paceFactor: 0.80 }
  };
  
  return constructorStandings[constructorName] || { standing: 10, efficiency: 0.75, paceFactor: 0.80 };
}

function calculateRealisticWinProbability(driver, constructor, gridPosition, weather) {
  const driverPerf = getRealisticDriverPerformance(driver);
  const constructorPerf = getRealisticConstructorPerformance(constructor);
  
  // Base probability from constructor competitiveness
  const baseProbMap = {
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
  
  const baseProb = baseProbMap[constructor] || 1.0;
  
  // Apply driver skill factor
  const driverFactor = driverPerf.winFactor;
  
  // Grid position impact (exponential decay)
  let gridFactor;
  if (gridPosition <= 5) {
    gridFactor = 1.0 - (gridPosition - 1) * 0.1; // Front runners
  } else if (gridPosition <= 10) {
    gridFactor = 0.6 - (gridPosition - 6) * 0.08; // Midfield
  } else {
    gridFactor = 0.2 - (gridPosition - 11) * 0.02; // Backmarkers
  }
  
  gridFactor = Math.max(0.01, gridFactor); // Minimum chance
  
  // Weather adjustments
  let weatherFactor = 1.0;
  if (weather === 'Wet') {
    const wetSpecialists = ['Lewis Hamilton', 'Max Verstappen', 'Fernando Alonso'];
    weatherFactor = wetSpecialists.includes(driver) ? 1.3 : 0.85;
  } else if (weather === 'Mixed') {
    weatherFactor = 0.95; // Slightly unpredictable
  }
  
  // Calculate final probability
  const finalProb = baseProb * driverFactor * gridFactor * weatherFactor;
  
  // Cap realistic maximum (even best driver from pole shouldn't exceed ~35%)
  return Math.min(35.0, Math.max(0.1, finalProb));
}

function getPersonalizedTireStrategy(driver, constructor, gridPosition, weather, circuitName) {
  // Driver personality profiles based on real F1 characteristics
  const driverProfiles = {
    // Aggressive risk-takers
    'Max Verstappen': { aggression: 0.9, riskTolerance: 0.85, adaptability: 0.9 },
    'Charles Leclerc': { aggression: 0.85, riskTolerance: 0.8, adaptability: 0.8 },
    'Lando Norris': { aggression: 0.75, riskTolerance: 0.7, adaptability: 0.85 },
    'Pierre Gasly': { aggression: 0.8, riskTolerance: 0.75, adaptability: 0.8 },
    
    // Strategic and calculated
    'Lewis Hamilton': { aggression: 0.7, riskTolerance: 0.6, adaptability: 0.95 },
    'Fernando Alonso': { aggression: 0.75, riskTolerance: 0.8, adaptability: 0.95 },
    'George Russell': { aggression: 0.6, riskTolerance: 0.5, adaptability: 0.8 },
    'Oscar Piastri': { aggression: 0.65, riskTolerance: 0.6, adaptability: 0.8 },
    
    // Conservative but opportunistic
    'Carlos Sainz Jr.': { aggression: 0.7, riskTolerance: 0.65, adaptability: 0.75 },
    'Alexander Albon': { aggression: 0.6, riskTolerance: 0.55, adaptability: 0.7 },
    'Nico Hülkenberg': { aggression: 0.65, riskTolerance: 0.6, adaptability: 0.8 },
    'Esteban Ocon': { aggression: 0.6, riskTolerance: 0.55, adaptability: 0.7 },
    
    // Inexperienced but eager
    'Andrea Kimi Antonelli': { aggression: 0.8, riskTolerance: 0.9, adaptability: 0.6 },
    'Oliver Bearman': { aggression: 0.75, riskTolerance: 0.8, adaptability: 0.65 },
    'Franco Colapinto': { aggression: 0.7, riskTolerance: 0.75, adaptability: 0.6 },
    'Gabriel Bortoleto': { aggression: 0.7, riskTolerance: 0.8, adaptability: 0.6 },
    'Isack Hadjar': { aggression: 0.75, riskTolerance: 0.8, adaptability: 0.6 },
    'Liam Lawson': { aggression: 0.8, riskTolerance: 0.75, adaptability: 0.65 },
    
    // Steady and consistent
    'Lance Stroll': { aggression: 0.5, riskTolerance: 0.4, adaptability: 0.6 },
    'Yuki Tsunoda': { aggression: 0.7, riskTolerance: 0.7, adaptability: 0.65 }
  };
  
  // Team strategy philosophies
  const teamStrategies = {
    'Red Bull Racing': { aggression: 0.85, riskTolerance: 0.8, innovation: 0.9 },
    'Ferrari': { aggression: 0.8, riskTolerance: 0.75, innovation: 0.7 },
    'McLaren': { aggression: 0.7, riskTolerance: 0.65, innovation: 0.85 },
    'Mercedes': { aggression: 0.6, riskTolerance: 0.5, innovation: 0.8 },
    'Aston Martin': { aggression: 0.7, riskTolerance: 0.6, innovation: 0.8 },
    'Alpine': { aggression: 0.75, riskTolerance: 0.7, innovation: 0.7 },
    'Williams': { aggression: 0.6, riskTolerance: 0.8, innovation: 0.6 },
    'Haas': { aggression: 0.65, riskTolerance: 0.75, innovation: 0.5 },
    'RB': { aggression: 0.75, riskTolerance: 0.7, innovation: 0.75 },
    'Kick Sauber': { aggression: 0.7, riskTolerance: 0.8, innovation: 0.6 }
  };
  
  // Circuit characteristics affecting strategy
  const circuitStrategyFactors = {
    'Circuit de Monaco': { overtakingDifficulty: 0.95, tireWear: 0.3, strategyImportance: 0.9 },
    'Hungaroring': { overtakingDifficulty: 0.85, tireWear: 0.4, strategyImportance: 0.85 },
    'Marina Bay Street Circuit': { overtakingDifficulty: 0.8, tireWear: 0.5, strategyImportance: 0.8 },
    'Circuit de Spa-Francorchamps': { overtakingDifficulty: 0.3, tireWear: 0.8, strategyImportance: 0.7 },
    'Silverstone Circuit': { overtakingDifficulty: 0.4, tireWear: 0.75, strategyImportance: 0.7 },
    'Circuit de Barcelona-Catalunya': { overtakingDifficulty: 0.7, tireWear: 0.6, strategyImportance: 0.8 },
    'Autodromo Nazionale di Monza': { overtakingDifficulty: 0.2, tireWear: 0.4, strategyImportance: 0.5 },
    'Baku City Circuit': { overtakingDifficulty: 0.3, tireWear: 0.5, strategyImportance: 0.6 },
    'Circuit Gilles Villeneuve': { overtakingDifficulty: 0.5, tireWear: 0.6, strategyImportance: 0.6 },
    'Circuit of the Americas': { overtakingDifficulty: 0.4, tireWear: 0.7, strategyImportance: 0.65 }
  };
  
  // Get driver and team characteristics
  const driverProfile = driverProfiles[driver] || { aggression: 0.6, riskTolerance: 0.6, adaptability: 0.6 };
  const teamStrategy = teamStrategies[constructor] || { aggression: 0.6, riskTolerance: 0.6, innovation: 0.6 };
  const circuitFactors = circuitStrategyFactors[circuitName] || { overtakingDifficulty: 0.5, tireWear: 0.6, strategyImportance: 0.6 };
  
  // Calculate combined strategy factors
  const combinedAggression = (driverProfile.aggression + teamStrategy.aggression) / 2;
  const combinedRisk = (driverProfile.riskTolerance + teamStrategy.riskTolerance) / 2;
  
  // Grid position influence on strategy
  let strategyAggression, alternativeStrategyChance;
  if (gridPosition <= 3) {
    strategyAggression = combinedAggression * 0.7;
    alternativeStrategyChance = 0.1;
  } else if (gridPosition <= 6) {
    strategyAggression = combinedAggression * 0.85;
    alternativeStrategyChance = 0.2;
  } else if (gridPosition <= 10) {
    strategyAggression = combinedAggression * 1.0;
    alternativeStrategyChance = 0.35;
  } else {
    strategyAggression = combinedAggression * 1.3;
    alternativeStrategyChance = 0.5;
  }
  
  // Adjust for circuit characteristics
  if (circuitFactors.overtakingDifficulty > 0.8) {
    strategyAggression *= 1.2;
    alternativeStrategyChance += 0.15;
  }
  
  // Weather-based strategy selection
  if (weather === 'Wet') {
    const wetStrategies = {
      conservative: [
        'Full Wet → Intermediate → Medium',
        'Intermediate → Medium',
        'Full Wet → Intermediate'
      ],
      aggressive: [
        'Intermediate → Soft (risky dry gamble)',
        'Full Wet → Medium (early switch)',
        'Intermediate → Full Wet → Soft'
      ],
      alternative: [
        'Start on Intermediates (if others on Full Wet)',
        'Full Wet → Hard (long stint strategy)',
        'Intermediate → Hard → Soft'
      ]
    };
    
    // Hamilton and Alonso are wet weather masters
    if (['Lewis Hamilton', 'Fernando Alonso', 'Max Verstappen'].includes(driver)) {
      strategyAggression *= 1.2;
    }
    
    if (Math.random() < alternativeStrategyChance) {
      return wetStrategies.alternative[Math.floor(Math.random() * wetStrategies.alternative.length)];
    } else if (strategyAggression > 0.7) {
      return wetStrategies.aggressive[Math.floor(Math.random() * wetStrategies.aggressive.length)];
    } else {
      return wetStrategies.conservative[Math.floor(Math.random() * wetStrategies.conservative.length)];
    }
  } else if (weather === 'Mixed') {
    const mixedStrategies = {
      conservative: [
        'Intermediate → Medium → Hard',
        'Intermediate → Hard',
        'Medium → Hard (if track dries quickly)'
      ],
      aggressive: [
        'Intermediate → Soft → Medium',
        'Soft → Intermediate → Soft (double switch)',
        'Medium → Soft (aggressive dry switch)'
      ],
      alternative: [
        'Hard → Intermediate (reverse strategy)',
        'Intermediate → Soft → Hard',
        'Start on Mediums (dry gamble)'
      ]
    };
    
    if (Math.random() < alternativeStrategyChance) {
      return mixedStrategies.alternative[Math.floor(Math.random() * mixedStrategies.alternative.length)];
    } else if (strategyAggression > 0.7) {
      return mixedStrategies.aggressive[Math.floor(Math.random() * mixedStrategies.aggressive.length)];
    } else {
      return mixedStrategies.conservative[Math.floor(Math.random() * mixedStrategies.conservative.length)];
    }
  } else {
    // Dry weather strategies
    const strategies = circuitFactors.tireWear > 0.7 ? {
      // High degradation circuits
      conservative: [
        'Medium → Hard',
        'Hard → Medium',
        'Medium → Medium'
      ],
      aggressive: [
        'Soft → Medium → Hard',
        'Soft → Hard',
        'Medium → Soft (undercut attempt)'
      ],
      alternative: [
        'Hard → Soft (reverse strategy)',
        'Soft → Medium → Medium',
        'Medium → Hard → Soft'
      ]
    } : {
      // Normal/low degradation circuits
      conservative: [
        'Medium → Hard',
        'Soft → Medium',
        'Hard → Medium'
      ],
      aggressive: [
        'Soft → Soft (double stint on softs)',
        'Soft → Hard (long second stint)',
        'Medium → Soft (late attack)'
      ],
      alternative: [
        'Hard → Soft (opposite to field)',
        'Soft → Medium → Soft',
        'Medium → Medium'
      ]
    };
    
    // Team-specific adjustments
    if (constructor === 'Mercedes') {
      strategyAggression *= 0.8;
    } else if (constructor === 'Red Bull Racing') {
      strategyAggression *= 1.1;
    } else if (constructor === 'Ferrari' && Math.random() < 0.15) {
      return 'Hard → Hard (Ferrari master plan 🤔)';
    }
    
    // Special driver considerations
    if (driver === 'Max Verstappen' && gridPosition > 5) {
      strategyAggression *= 1.3;
    } else if (driver === 'Lewis Hamilton' && circuitFactors.strategyImportance > 0.8) {
      strategyAggression *= 1.1;
    }
    
    if (Math.random() < alternativeStrategyChance) {
      return strategies.alternative[Math.floor(Math.random() * strategies.alternative.length)];
    } else if (strategyAggression > 0.75) {
      return strategies.aggressive[Math.floor(Math.random() * strategies.aggressive.length)];
    } else {
      return strategies.conservative[Math.floor(Math.random() * strategies.conservative.length)];
    }
  }
}

function getPointsForPosition(position) {
  const pointsSystem = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
  };
  return pointsSystem[position] || 0;
}