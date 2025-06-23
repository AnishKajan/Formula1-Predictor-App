# 🧠 F1 Race Predictor - Machine Learning Models Documentation

This document provides comprehensive information about the machine learning models, features, and algorithms used in the F1 Race Predictor.

---

## 📊 Model Overview

The F1 Race Predictor uses an ensemble of **Random Forest** models to predict various race outcomes:

| Model | Type | Purpose | Output |
|-------|------|---------|--------|
| **Position Model** | Regression | Predict finishing position | 1-20 (race position) |
| **Podium Model** | Binary Classification | Predict podium finish | 0/1 (No/Yes) |
| **Winner Model** | Multi-class Classification | Predict race winner | Driver probabilities |
| **Points Model** | Binary Classification | Predict points scoring | 0/1 (No/Yes) |

---

## 🎯 Enhanced Features (20+ Variables)

### 1. **Basic Racing Features**
```python
basic_features = [
    'grid',           # Starting grid position (1-20)
    'driver_encoded', # Driver identifier
    'constructor_encoded', # Team identifier  
    'circuit_encoded' # Circuit identifier
]
```

### 2. **Weather & Environmental Features**
```python
weather_features = [
    'weather_encoded',  # Dry/Wet/Mixed conditions
    'temperature',      # Ambient temperature (°C)
    'humidity',         # Relative humidity (%)
    'wind_speed',       # Wind speed (km/h)
    'track_temp'        # Track surface temperature (°C)
]
```

**Weather Feature Engineering:**
```python
def enhance_weather_features(df):
    # Temperature ranges by circuit location
    temp_map = {
        'Bahrain International Circuit': random.randint(25, 35),
        'Monaco Circuit': random.randint(18, 28),
        'Silverstone Circuit': random.randint(12, 22),
        # ... more circuits
    }
    
    df['temperature'] = df['circuit'].apply(lambda x: temp_map.get(x, 20))
    df['humidity'] = np.random.uniform(30, 80, len(df))
    df['wind_speed'] = np.random.uniform(0, 15, len(df))
    df['track_temp'] = df['temperature'] + np.random.uniform(5, 25, len(df))
    
    return df
```

### 3. **Tire Strategy Features**
```python
tire_features = [
    'tire_strategy_encoded',  # Compound strategy (e.g., "Soft → Medium")
]
```

**Advanced Tire Strategy Logic:**
```python
def get_advanced_strategy(weather, temperature, track_temp, circuit):
    street_circuits = ['Monaco Circuit', 'Marina Bay Street Circuit']
    
    if weather == "Wet":
        return random.choice([
            "Full Wet → Intermediate → Medium",
            "Intermediate → Full Wet",
            "Full Wet → Medium"
        ])
    elif weather == "Mixed":
        return random.choice([