# 🔌 F1 Race Predictor API Documentation

## Base URL
```
http://localhost:5061
```

## Authentication
Currently, no authentication is required for API endpoints.

---

## 📋 Endpoints Overview

| Endpoint | Method | Description | Response Type |
|----------|--------|-------------|---------------|
| `/api/teams` | GET | Current F1 teams data | JSON |
| `/api/circuits` | GET | 2025 race calendar | JSON |
| `/api/predict` | POST | Race outcome predictions | JSON |
| `/api/fantasy-team` | POST | Fantasy team analysis | JSON |
| `/api/driver-stats` | GET | Historical driver statistics | JSON |
| `/api/constructor-standings` | GET | Championship standings | JSON |

---

## 🏎️ Teams Endpoint

### `GET /api/teams`

Returns current Formula 1 teams for the 2025 season.

#### Response Example
```json
{
  "Red Bull Racing": {
    "drivers": ["Max Verstappen", "Checo Pérez"],
    "car": "RB21",
    "principal": "Christian Horner",
    "engine": "Honda RBPT",
    "founded": 2005,
    "championships": 6,
    "base": "Milton Keynes, UK",
    "color": "#0600EF"
  },
  "Ferrari": {
    "drivers": ["Charles Leclerc", "Lewis Hamilton"],
    "car": "SF-25",
    "principal": "Frédéric Vasseur",
    "engine": "Ferrari",
    "founded": 1929,
    "championships": 16,
    "base": "Maranello, Italy",
    "color": "#DC0000"
  }
}
```

#### Team Object Schema
```typescript
interface Team {
  drivers: string[];      // Array of driver names
  car: string;           // Car model designation
  principal: string;     // Team principal name
  engine: string;        // Engine supplier
  founded: number;       // Year team was founded
  championships: number; // Constructor championships won
  base: string;         // Team headquarters location
  color: string;        // Team color (hex code)
}
```

---

## 🏁 Circuits Endpoint

### `GET /api/circuits`

Returns the complete 2025 Formula 1 race calendar.

#### Response Example
```json
[
  {
    "name": "Bahrain International Circuit",
    "country": "Bahrain",
    "round": 1,
    "date": "2025-03-16"
  },
  {
    "name": "Jeddah Corniche Circuit",
    "country": "Saudi Arabia",
    "round": 2,
    "date": "2025-03-23"
  }
]
```

#### Circuit Object Schema
```typescript
interface Circuit {
  name: string;      // Official circuit name
  country: string;   // Host country
  round: number;     // Race number in season
  date: string;      // Race date (YYYY-MM-DD)
}
```

---

## 🔮 Prediction Endpoint

### `POST /api/predict`

Generates race outcome predictions using enhanced ML models.

#### Request Body
```json
{
  "circuit": "Monaco Circuit",
  "weather": "Dry",
  "entries": [
    {
      "driver": "Max Verstappen",
      "constructor": "Red Bull Racing",
      "grid": 1
    },
    {
      "driver": "Charles Leclerc",
      "constructor": "Ferrari",
      "grid": 2
    }
  ]
}
```

#### Request Schema
```typescript
interface PredictionRequest {
  circuit: string;    // Circuit name from circuits endpoint
  weather: "Dry" | "Wet" | "Mixed";
  entries: Array<{
    driver: string;      // Driver name
    constructor: string; // Team name
    grid: number;       // Starting grid position (1-20)
  }>;
}
```

#### Response Example
```json
{
  "success": true,
  "predictions": [
    {
      "driver": "Max Verstappen",
      "constructor": "Red Bull Racing",
      "grid": 1,
      "predicted_position": 1,
      "podium_chance": 1,
      "points_chance": 1,
      "win_probability": 68.5,
      "tire_strategy": "Soft → Medium"
    }
  ],
  "race_info": {
    "circuit": "Monaco Circuit",
    "weather": "Dry",
    "temperature": 24,
    "track_temp": 42.3
  }
}
```

#### Response Schema
```typescript
interface PredictionResponse {
  success: boolean;
  predictions: Array<{
    driver: string;
    constructor: string;
    grid: number;
    predicted_position: number;    // Predicted finish position
    podium_chance: 0 | 1;         // Binary podium prediction
    points_chance: 0 | 1;         // Binary points prediction
    win_probability: number;       // Win probability percentage
    tire_strategy: string;         // Predicted tire strategy
  }>;
  race_info: {
    circuit: string;
    weather: string;
    temperature: number;           // Ambient temperature (°C)
    track_temp: number;           // Track surface temperature (°C)
  };
}
```

---

## 🎮 Fantasy Team Endpoint

### `POST /api/fantasy-team`

Analyzes fantasy team selections and calculates costs.

#### Request Body
```json
{
  "team": {
    "drivers": ["Max Verstappen", "Charles Leclerc", "Lando Norris"],
    "constructor": "Red Bull Racing"
  },
  "budget": 100
}
```

#### Request Schema
```typescript
interface FantasyTeamRequest {
  team: {
    drivers: string[];     // Array of selected drivers (max 5)
    constructor: string;   // Selected constructor
  };
  budget: number;         // Available budget (default: 100)
}
```

#### Response Example
```json
{
  "success": true,
  "team": {
    "drivers": ["Max Verstappen", "Charles Leclerc", "Lando Norris"],
    "constructor": "Red Bull Racing"
  },
  "total_cost": 77,
  "remaining_budget": 23,
  "fantasy_points": 156,
  "valid": true
}
```

---

## 📊 Driver Statistics Endpoint

### `GET /api/driver-stats`

Returns historical driver performance statistics.

#### Response Example
```json
{
  "Max Verstappen": {
    "wins": 61,
    "podiums": 104,
    "poles": 40,
    "championships": 4
  },
  "Lewis Hamilton": {
    "wins": 105,
    "podiums": 201,
    "poles": 104,
    "championships": 7
  }
}
```

---

## 🏆 Constructor Standings Endpoint

### `GET /api/constructor-standings`

Returns current constructor championship standings.

#### Response Example
```json
[
  {
    "position": 1,
    "team": "McLaren",
    "points": 666,
    "wins": 6
  },
  {
    "position": 2,
    "team": "Ferrari",
    "points": 652,
    "wins": 5
  }
]
```

---

## 🔧 Enhanced ML Features

### Weather Modeling
The prediction endpoint uses sophisticated weather modeling:

- **Temperature**: Realistic ranges by circuit location
- **Humidity**: Affects tire degradation and strategy
- **Wind Speed**: Impacts aerodynamic performance
- **Track Temperature**: Critical for tire compound selection

### Tire Strategy AI
Intelligent tire strategy generation based on:

- **Weather Conditions**: Wet/dry compound selection
- **Circuit Type**: Street vs traditional layouts
- **Temperature**: Compound hardness optimization
- **Race Length**: Strategy window calculations

### Driver Performance Metrics
Enhanced driver modeling includes:

- **Experience**: Years in Formula 1
- **Recent Form**: Last 5 race average
- **Qualifying Performance**: Gap to teammate
- **Circuit History**: Track-specific performance

---

## 🚨 Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": "Invalid request format",
  "details": "Missing required field: circuit"
}
```

#### 404 Not Found
```json
{
  "error": "Endpoint not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Models not loaded",
  "details": "Please run train_enhanced_model.py first"
}
```

---

## 📝 Usage Examples

### JavaScript/React
```javascript
// Get teams
const teams = await fetch('/api/teams').then(r => r.json());

// Make prediction
const prediction = await fetch('/api/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    circuit: 'Monaco Circuit',
    weather: 'Dry',
    entries: [
      { driver: 'Max Verstappen', constructor: 'Red Bull Racing', grid: 1 }
    ]
  })
}).then(r => r.json());
```

### Python
```python
import requests

# Get teams
teams = requests.get('http://localhost:5061/api/teams').json()

# Make prediction
prediction_data = {
    'circuit': 'Monaco Circuit',
    'weather': 'Dry',
    'entries': [
        {'driver': 'Max Verstappen', 'constructor': 'Red Bull Racing', 'grid': 1}
    ]
}
prediction = requests.post(
    'http://localhost:5061/api/predict',
    json=prediction_data
).json()
```

### cURL
```bash
# Get teams
curl http://localhost:5061/api/teams

# Make prediction
curl -X POST http://localhost:5061/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "circuit": "Monaco Circuit",
    "weather": "Dry",
    "entries": [
      {"driver": "Max Verstappen", "constructor": "Red Bull Racing", "grid": 1}
    ]
  }'
```

---

## 🔄 Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider implementing rate limiting to prevent abuse.

## 📈 Future Enhancements

- **Authentication**: JWT-based user authentication
- **Real-time Data**: Live timing integration
- **WebSocket Support**: Real-time race updates
- **Caching**: Redis caching for improved performance
- **Pagination**: For large dataset endpoints