from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import random
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Load enhanced models
try:
    models = {
        'position': joblib.load("models/position_enhanced_model.pkl"),
        'podium': joblib.load("models/podium_enhanced_model.pkl"),
        'winner': joblib.load("models/winner_enhanced_model.pkl") if os.path.exists("models/winner_enhanced_model.pkl") else None,
        'points': joblib.load("models/points_enhanced_model.pkl")
    }
    label_encoders = joblib.load("models/enhanced_label_encoders.pkl")
    scaler = joblib.load("models/feature_scaler.pkl")
    feature_names = joblib.load("models/feature_names.pkl")
    print("✅ Enhanced models loaded successfully")
except FileNotFoundError as e:
    print(f"⚠️ Enhanced models not found: {e}")
    print("Please run train_enhanced_model.py first")
    models = None

# Updated F1 2025 data with correct driver lineups
current_teams = {
    "Red Bull Racing": {
        "drivers": ["Max Verstappen", "Yuki Tsunoda"],
        "car": "RB21",
        "principal": "Christian Horner",
        "engine": "Honda RBPT",
        "founded": 2005,
        "championships": 6,
        "base": "Milton Keynes, UK",
        "color": "#0600EF",
        "secondaryColor": "#DC143C"
    },
    "McLaren": {
        "drivers": ["Lando Norris", "Oscar Piastri"],
        "car": "MCL39",
        "principal": "Andrea Stella",
        "engine": "Mercedes",
        "founded": 1963,
        "championships": 8,
        "base": "Woking, UK",
        "color": "#FF8700",
        "secondaryColor": "#000000"
    },
    "Ferrari": {
        "drivers": ["Charles Leclerc", "Lewis Hamilton"],
        "car": "SF-25",
        "principal": "Frédéric Vasseur",
        "engine": "Ferrari",
        "founded": 1929,
        "championships": 16,
        "base": "Maranello, Italy",
        "color": "#DC0000",
        "secondaryColor": "#FFF200"
    },
    "Mercedes": {
        "drivers": ["George Russell", "Kimi Antonelli"],
        "car": "W16",
        "principal": "Toto Wolff",
        "engine": "Mercedes",
        "founded": 1954,
        "championships": 8,
        "base": "Brackley, UK",
        "color": "#00D2BE",
        "secondaryColor": "#000000"
    },
    "Aston Martin": {
        "drivers": ["Fernando Alonso", "Lance Stroll"],
        "car": "AMR25",
        "principal": "Mike Krack",
        "engine": "Mercedes",
        "founded": 2021,
        "championships": 0,
        "base": "Silverstone, UK",
        "color": "#006F62",
        "secondaryColor": "#CEDC00"
    },
    "Alpine": {
        "drivers": ["Pierre Gasly", "Jack Doohan"],
        "car": "A525",
        "principal": "Oliver Oakes",
        "engine": "Renault",
        "founded": 2021,
        "championships": 0,
        "base": "Enstone, UK",
        "color": "#0090FF",
        "secondaryColor": "#FF87BC"
    },
    "Williams": {
        "drivers": ["Alex Albon", "Carlos Sainz"],
        "car": "FW47",
        "principal": "James Vowles",
        "engine": "Mercedes",
        "founded": 1977,
        "championships": 9,
        "base": "Grove, UK",
        "color": "#005AFF",
        "secondaryColor": "#FFFFFF"
    },
    "RB": {
        "drivers": ["Liam Lawson", "Isack Hadjar"],
        "car": "VCARB 01",
        "principal": "Laurent Mekies",
        "engine": "Honda RBPT",
        "founded": 2020,
        "championships": 0,
        "base": "Faenza, Italy",
        "color": "#6692FF",
        "secondaryColor": "#C8102E"
    },
    "Kick Sauber": {
        "drivers": ["Nico Hülkenberg", "Gabriel Bortoleto"],
        "car": "C45",
        "principal": "Alessandro Alunni Bravi",
        "engine": "Ferrari",
        "founded": 1993,
        "championships": 0,
        "base": "Hinwil, Switzerland",
        "color": "#52E252",
        "secondaryColor": "#000000"
    },
    "Haas": {
        "drivers": ["Esteban Ocon", "Oliver Bearman"],
        "car": "VF-25",
        "principal": "Ayao Komatsu",
        "engine": "Ferrari",
        "founded": 2016,
        "championships": 0,
        "base": "Kannapolis, USA",
        "color": "#FFFFFF",
        "secondaryColor": "#787878"
    }
}

circuits_2025 = [
    {"name": "Bahrain International Circuit", "country": "Bahrain", "round": 1, "date": "2025-03-16"},
    {"name": "Jeddah Corniche Circuit", "country": "Saudi Arabia", "round": 2, "date": "2025-03-23"},
    {"name": "Albert Park Circuit", "country": "Australia", "round": 3, "date": "2025-04-06"},
    {"name": "Suzuka Circuit", "country": "Japan", "round": 4, "date": "2025-04-13"},
    {"name": "Shanghai International Circuit", "country": "China", "round": 5, "date": "2025-04-20"},
    {"name": "Miami International Autodrome", "country": "USA", "round": 6, "date": "2025-05-04"},
    {"name": "Imola", "country": "Italy", "round": 7, "date": "2025-05-18"},
    {"name": "Monaco Circuit", "country": "Monaco", "round": 8, "date": "2025-05-25"},
    {"name": "Circuit de Barcelona-Catalunya", "country": "Spain", "round": 9, "date": "2025-06-01"},
    {"name": "Circuit Gilles Villeneuve", "country": "Canada", "round": 10, "date": "2025-06-15"},
    {"name": "Red Bull Ring", "country": "Austria", "round": 11, "date": "2025-06-29"},
    {"name": "Silverstone Circuit", "country": "United Kingdom", "round": 12, "date": "2025-07-06"},
    {"name": "Hungaroring", "country": "Hungary", "round": 13, "date": "2025-07-20"},
    {"name": "Circuit de Spa-Francorchamps", "country": "Belgium", "round": 14, "date": "2025-07-27"},
    {"name": "Circuit Zandvoort", "country": "Netherlands", "round": 15, "date": "2025-08-31"},
    {"name": "Monza Circuit", "country": "Italy", "round": 16, "date": "2025-09-07"},
    {"name": "Baku City Circuit", "country": "Azerbaijan", "round": 17, "date": "2025-09-21"},
    {"name": "Marina Bay Street Circuit", "country": "Singapore", "round": 18, "date": "2025-10-05"},
    {"name": "Circuit of the Americas", "country": "USA", "round": 19, "date": "2025-10-19"},
    {"name": "Autódromo Hermanos Rodríguez", "country": "Mexico", "round": 20, "date": "2025-10-26"},
    {"name": "Interlagos", "country": "Brazil", "round": 21, "date": "2025-11-09"},
    {"name": "Las Vegas Strip Circuit", "country": "USA", "round": 22, "date": "2025-11-22"},
    {"name": "Losail International Circuit", "country": "Qatar", "round": 23, "date": "2025-11-30"},
    {"name": "Yas Marina Circuit", "country": "UAE", "round": 24, "date": "2025-12-07"}
]

def get_weather_features(circuit_name, weather):
    """Generate realistic weather-related features based on circuit location and season"""
    temp_map = {
        'Bahrain International Circuit': random.randint(25, 35),
        'Jeddah Corniche Circuit': random.randint(28, 38),
        'Albert Park Circuit': random.randint(18, 28),
        'Suzuka Circuit': random.randint(15, 25),
        'Shanghai International Circuit': random.randint(12, 22),
        'Miami International Autodrome': random.randint(26, 35),
        'Imola': random.randint(16, 26),
        'Monaco Circuit': random.randint(18, 28),
        'Circuit de Barcelona-Catalunya': random.randint(16, 26),
        'Circuit Gilles Villeneuve': random.randint(12, 22),
        'Red Bull Ring': random.randint(14, 24),
        'Silverstone Circuit': random.randint(12, 22),
        'Hungaroring': random.randint(18, 30),
        'Circuit de Spa-Francorchamps': random.randint(10, 20),
        'Circuit Zandvoort': random.randint(12, 22),
        'Monza Circuit': random.randint(16, 26),
        'Marina Bay Street Circuit': random.randint(26, 32),
        'Baku City Circuit': random.randint(20, 30),
        'Circuit of the Americas': random.randint(18, 28),
        'Autódromo Hermanos Rodríguez': random.randint(16, 24),
        'Interlagos': random.randint(18, 28),
        'Las Vegas Strip Circuit': random.randint(10, 25),
        'Losail International Circuit': random.randint(22, 32),
        'Yas Marina Circuit': random.randint(24, 32)
    }
    
    temperature = temp_map.get(circuit_name, 20)
    
    if weather == "Wet":
        humidity = random.uniform(80, 95)
        wind_speed = random.uniform(10, 20)
    elif weather == "Mixed":
        humidity = random.uniform(60, 85)
        wind_speed = random.uniform(5, 15)
    else:
        humidity = random.uniform(30, 70)
        wind_speed = random.uniform(0, 10)
    
    track_temp = temperature + random.uniform(5, 25)
    
    return temperature, humidity, wind_speed, track_temp

def get_personalized_tire_strategy(driver, constructor, grid_position, weather, circuit_name):
    """
    Generate personalized tire strategy based on driver personality, 
    team strategy, grid position, weather, and circuit characteristics
    """
    
    # Driver personality profiles based on real F1 characteristics
    driver_profiles = {
        # Aggressive risk-takers
        'Max Verstappen': {'aggression': 0.9, 'risk_tolerance': 0.85, 'adaptability': 0.9},
        'Charles Leclerc': {'aggression': 0.85, 'risk_tolerance': 0.8, 'adaptability': 0.8},
        'Lando Norris': {'aggression': 0.75, 'risk_tolerance': 0.7, 'adaptability': 0.85},
        'Pierre Gasly': {'aggression': 0.8, 'risk_tolerance': 0.75, 'adaptability': 0.8},
        
        # Strategic and calculated
        'Lewis Hamilton': {'aggression': 0.7, 'risk_tolerance': 0.6, 'adaptability': 0.95},
        'Fernando Alonso': {'aggression': 0.75, 'risk_tolerance': 0.8, 'adaptability': 0.95},
        'George Russell': {'aggression': 0.6, 'risk_tolerance': 0.5, 'adaptability': 0.8},
        'Oscar Piastri': {'aggression': 0.65, 'risk_tolerance': 0.6, 'adaptability': 0.8},
        
        # Conservative but opportunistic
        'Carlos Sainz': {'aggression': 0.7, 'risk_tolerance': 0.65, 'adaptability': 0.75},
        'Alex Albon': {'aggression': 0.6, 'risk_tolerance': 0.55, 'adaptability': 0.7},
        'Nico Hülkenberg': {'aggression': 0.65, 'risk_tolerance': 0.6, 'adaptability': 0.8},
        'Esteban Ocon': {'aggression': 0.6, 'risk_tolerance': 0.55, 'adaptability': 0.7},
        
        # Inexperienced but eager
        'Kimi Antonelli': {'aggression': 0.8, 'risk_tolerance': 0.9, 'adaptability': 0.6},
        'Oliver Bearman': {'aggression': 0.75, 'risk_tolerance': 0.8, 'adaptability': 0.65},
        'Jack Doohan': {'aggression': 0.7, 'risk_tolerance': 0.75, 'adaptability': 0.6},
        'Gabriel Bortoleto': {'aggression': 0.7, 'risk_tolerance': 0.8, 'adaptability': 0.6},
        'Isack Hadjar': {'aggression': 0.75, 'risk_tolerance': 0.8, 'adaptability': 0.6},
        'Liam Lawson': {'aggression': 0.8, 'risk_tolerance': 0.75, 'adaptability': 0.65},
        
        # Steady and consistent
        'Lance Stroll': {'aggression': 0.5, 'risk_tolerance': 0.4, 'adaptability': 0.6},
        'Yuki Tsunoda': {'aggression': 0.7, 'risk_tolerance': 0.7, 'adaptability': 0.65},
    }
    
    # Team strategy philosophies based on real F1 team approaches
    team_strategies = {
        'Red Bull Racing': {'aggression': 0.85, 'risk_tolerance': 0.8, 'innovation': 0.9},
        'Ferrari': {'aggression': 0.8, 'risk_tolerance': 0.75, 'innovation': 0.7},  # Sometimes strategic errors
        'McLaren': {'aggression': 0.7, 'risk_tolerance': 0.65, 'innovation': 0.85},
        'Mercedes': {'aggression': 0.6, 'risk_tolerance': 0.5, 'innovation': 0.8},  # Very calculated
        'Aston Martin': {'aggression': 0.7, 'risk_tolerance': 0.6, 'innovation': 0.8},
        'Alpine': {'aggression': 0.75, 'risk_tolerance': 0.7, 'innovation': 0.7},
        'Williams': {'aggression': 0.6, 'risk_tolerance': 0.8, 'innovation': 0.6},  # Risk due to position
        'Haas': {'aggression': 0.65, 'risk_tolerance': 0.75, 'innovation': 0.5},
        'RB': {'aggression': 0.75, 'risk_tolerance': 0.7, 'innovation': 0.75},  # Sister team influence
        'Kick Sauber': {'aggression': 0.7, 'risk_tolerance': 0.8, 'innovation': 0.6},
    }
    
    # Circuit characteristics affecting strategy
    circuit_strategy_factors = {
        # Overtaking difficulty affects strategy aggression
        'Monaco Circuit': {'overtaking_difficulty': 0.95, 'tire_wear': 0.3, 'strategy_importance': 0.9},
        'Hungaroring': {'overtaking_difficulty': 0.85, 'tire_wear': 0.4, 'strategy_importance': 0.85},
        'Marina Bay Street Circuit': {'overtaking_difficulty': 0.8, 'tire_wear': 0.5, 'strategy_importance': 0.8},
        
        # High tire wear circuits
        'Circuit de Spa-Francorchamps': {'overtaking_difficulty': 0.3, 'tire_wear': 0.8, 'strategy_importance': 0.7},
        'Silverstone Circuit': {'overtaking_difficulty': 0.4, 'tire_wear': 0.75, 'strategy_importance': 0.7},
        'Circuit de Barcelona-Catalunya': {'overtaking_difficulty': 0.7, 'tire_wear': 0.6, 'strategy_importance': 0.8},
        
        # Power circuits with DRS effectiveness
        'Monza Circuit': {'overtaking_difficulty': 0.2, 'tire_wear': 0.4, 'strategy_importance': 0.5},
        'Baku City Circuit': {'overtaking_difficulty': 0.3, 'tire_wear': 0.5, 'strategy_importance': 0.6},
        
        # Balanced circuits
        'Circuit Gilles Villeneuve': {'overtaking_difficulty': 0.5, 'tire_wear': 0.6, 'strategy_importance': 0.6},
        'Circuit of the Americas': {'overtaking_difficulty': 0.4, 'tire_wear': 0.7, 'strategy_importance': 0.65},
    }
    
    # Get driver and team characteristics
    driver_profile = driver_profiles.get(driver, {'aggression': 0.6, 'risk_tolerance': 0.6, 'adaptability': 0.6})
    team_strategy = team_strategies.get(constructor, {'aggression': 0.6, 'risk_tolerance': 0.6, 'innovation': 0.6})
    circuit_factors = circuit_strategy_factors.get(circuit_name, {'overtaking_difficulty': 0.5, 'tire_wear': 0.6, 'strategy_importance': 0.6})
    
    # Calculate combined strategy factors
    combined_aggression = (driver_profile['aggression'] + team_strategy['aggression']) / 2
    combined_risk = (driver_profile['risk_tolerance'] + team_strategy['risk_tolerance']) / 2
    
    # Grid position influence on strategy
    if grid_position <= 3:
        # Front runners - more conservative, protect position
        strategy_aggression = combined_aggression * 0.7
        alternative_strategy_chance = 0.1
    elif grid_position <= 6:
        # Good starting position - balanced approach
        strategy_aggression = combined_aggression * 0.85
        alternative_strategy_chance = 0.2
    elif grid_position <= 10:
        # Midfield - slightly more aggressive
        strategy_aggression = combined_aggression * 1.0
        alternative_strategy_chance = 0.35
    else:
        # Back of grid - high risk, high reward
        strategy_aggression = combined_aggression * 1.3
        alternative_strategy_chance = 0.5
    
    # Adjust for circuit characteristics
    if circuit_factors['overtaking_difficulty'] > 0.8:
        # Hard to overtake - more aggressive strategy needed
        strategy_aggression *= 1.2
        alternative_strategy_chance += 0.15
    
    # Weather-based strategy selection
    if weather == "Wet":
        wet_strategies = {
            'conservative': [
                "Full Wet → Intermediate → Medium",
                "Intermediate → Medium",
                "Full Wet → Intermediate"
            ],
            'aggressive': [
                "Intermediate → Soft (risky dry gamble)",
                "Full Wet → Medium (early switch)",
                "Intermediate → Full Wet → Soft"
            ],
            'alternative': [
                "Start on Intermediates (if others on Full Wet)",
                "Full Wet → Hard (long stint strategy)",
                "Intermediate → Hard → Soft"
            ]
        }
        
        # Hamilton and Alonso are wet weather masters - more aggressive in wet
        if driver in ['Lewis Hamilton', 'Fernando Alonso', 'Max Verstappen']:
            strategy_aggression *= 1.2
        
        if random.random() < alternative_strategy_chance:
            return random.choice(wet_strategies['alternative'])
        elif strategy_aggression > 0.7:
            return random.choice(wet_strategies['aggressive'])
        else:
            return random.choice(wet_strategies['conservative'])
    
    elif weather == "Mixed":
        mixed_strategies = {
            'conservative': [
                "Intermediate → Medium → Hard",
                "Intermediate → Hard",
                "Medium → Hard (if track dries quickly)"
            ],
            'aggressive': [
                "Intermediate → Soft → Medium",
                "Soft → Intermediate → Soft (double switch)",
                "Medium → Soft (aggressive dry switch)"
            ],
            'alternative': [
                "Hard → Intermediate (reverse strategy)",
                "Intermediate → Soft → Hard",
                "Start on Mediums (dry gamble)"
            ]
        }
        
        if random.random() < alternative_strategy_chance:
            return random.choice(mixed_strategies['alternative'])
        elif strategy_aggression > 0.7:
            return random.choice(mixed_strategies['aggressive'])
        else:
            return random.choice(mixed_strategies['conservative'])
    
    else:  # Dry weather
        # High tire wear circuits favor different strategies
        if circuit_factors['tire_wear'] > 0.7:
            # High degradation circuits
            high_deg_strategies = {
                'conservative': [
                    "Medium → Hard",
                    "Hard → Medium",
                    "Medium → Medium"
                ],
                'aggressive': [
                    "Soft → Medium → Hard",
                    "Soft → Hard",
                    "Medium → Soft (undercut attempt)"
                ],
                'alternative': [
                    "Hard → Soft (reverse strategy)",
                    "Soft → Medium → Medium",
                    "Medium → Hard → Soft"
                ]
            }
            strategies = high_deg_strategies
        else:
            # Normal/low degradation circuits
            normal_strategies = {
                'conservative': [
                    "Medium → Hard",
                    "Soft → Medium",
                    "Hard → Medium"
                ],
                'aggressive': [
                    "Soft → Soft (double stint on softs)",
                    "Soft → Hard (long second stint)",
                    "Medium → Soft (late attack)"
                ],
                'alternative': [
                    "Hard → Soft (opposite to field)",
                    "Soft → Medium → Soft",
                    "Medium → Medium"
                ]
            }
            strategies = normal_strategies
        
        # Mercedes historically conservative, Red Bull more aggressive
        if constructor == 'Mercedes':
            strategy_aggression *= 0.8
        elif constructor == 'Red Bull Racing':
            strategy_aggression *= 1.1
        elif constructor == 'Ferrari':
            # Ferrari sometimes makes questionable strategy calls
            if random.random() < 0.15:
                return "Hard → Hard (Ferrari master plan 🤔)"
        
        # Special driver considerations
        if driver == 'Max Verstappen' and grid_position > 5:
            # Verstappen often goes aggressive when starting behind
            strategy_aggression *= 1.3
        elif driver == 'Lewis Hamilton' and circuit_factors['strategy_importance'] > 0.8:
            # Hamilton excels at strategy-critical circuits
            strategy_aggression *= 1.1
        
        if random.random() < alternative_strategy_chance:
            return random.choice(strategies['alternative'])
        elif strategy_aggression > 0.75:
            return random.choice(strategies['aggressive'])
        else:
            return random.choice(strategies['conservative'])

def get_realistic_driver_performance(driver_name):
    """Enhanced driver performance with 2025 season realism"""
    
    # Updated driver performance data for 2025 season
    driver_data = {
        # Top Tier - Championship contenders
        'Max Verstappen': {'experience': 10, 'form': 1.5, 'quali_gap': -0.4, 'win_factor': 1.4},
        'Lewis Hamilton': {'experience': 18, 'form': 3.2, 'quali_gap': -0.1, 'win_factor': 1.3},
        'Charles Leclerc': {'experience': 7, 'form': 2.8, 'quali_gap': -0.2, 'win_factor': 1.25},
        'Lando Norris': {'experience': 6, 'form': 2.1, 'quali_gap': -0.25, 'win_factor': 1.2},
        
        # Second Tier - Regular podium contenders  
        'George Russell': {'experience': 4, 'form': 4.1, 'quali_gap': 0.0, 'win_factor': 1.15},
        'Fernando Alonso': {'experience': 23, 'form': 5.3, 'quali_gap': 0.1, 'win_factor': 1.2},
        'Oscar Piastri': {'experience': 2, 'form': 3.4, 'quali_gap': -0.1, 'win_factor': 1.1},
        'Carlos Sainz': {'experience': 10, 'form': 4.8, 'quali_gap': 0.2, 'win_factor': 1.1},
        
        # Midfield - Occasional points
        'Pierre Gasly': {'experience': 7, 'form': 7.2, 'quali_gap': 0.3, 'win_factor': 1.0},
        'Alex Albon': {'experience': 5, 'form': 8.5, 'quali_gap': 0.25, 'win_factor': 0.95},
        'Nico Hülkenberg': {'experience': 15, 'form': 9.2, 'quali_gap': 0.15, 'win_factor': 0.95},
        'Esteban Ocon': {'experience': 8, 'form': 8.7, 'quali_gap': 0.3, 'win_factor': 0.9},
        
        # Lower midfield
        'Lance Stroll': {'experience': 8, 'form': 11.8, 'quali_gap': 0.4, 'win_factor': 0.85},
        'Yuki Tsunoda': {'experience': 4, 'form': 10.1, 'quali_gap': 0.35, 'win_factor': 0.9},
        
        # Rookies and backmarkers
        'Kimi Antonelli': {'experience': 1, 'form': 12.5, 'quali_gap': 0.6, 'win_factor': 0.8},
        'Oliver Bearman': {'experience': 1, 'form': 14.2, 'quali_gap': 0.7, 'win_factor': 0.8},
        'Jack Doohan': {'experience': 1, 'form': 15.1, 'quali_gap': 0.8, 'win_factor': 0.75},
        'Gabriel Bortoleto': {'experience': 1, 'form': 16.3, 'quali_gap': 0.9, 'win_factor': 0.7},
        'Isack Hadjar': {'experience': 1, 'form': 15.8, 'quali_gap': 0.85, 'win_factor': 0.75},
        'Liam Lawson': {'experience': 2, 'form': 13.9, 'quali_gap': 0.55, 'win_factor': 0.85}
    }
    
    return driver_data.get(driver_name, {'experience': 3, 'form': 15.0, 'quali_gap': 0.8, 'win_factor': 0.7})

def get_realistic_constructor_performance(constructor_name):
    """Updated constructor performance for 2025 season"""
    
    # 2025 season constructor competitiveness
    constructor_standings = {
        'McLaren': {'standing': 1, 'efficiency': 0.98, 'pace_factor': 1.0},
        'Ferrari': {'standing': 2, 'efficiency': 0.95, 'pace_factor': 0.98},
        'Red Bull Racing': {'standing': 3, 'efficiency': 0.93, 'pace_factor': 0.96},
        'Mercedes': {'standing': 4, 'efficiency': 0.90, 'pace_factor': 0.94},
        'Aston Martin': {'standing': 5, 'efficiency': 0.85, 'pace_factor': 0.88},
        'Alpine': {'standing': 6, 'efficiency': 0.82, 'pace_factor': 0.85},
        'Williams': {'standing': 9, 'efficiency': 0.78, 'pace_factor': 0.82},
        'Haas': {'standing': 7, 'efficiency': 0.80, 'pace_factor': 0.83},
        'RB': {'standing': 8, 'efficiency': 0.79, 'pace_factor': 0.84},
        'Kick Sauber': {'standing': 10, 'efficiency': 0.75, 'pace_factor': 0.80}
    }
    
    return constructor_standings.get(constructor_name, {'standing': 10, 'efficiency': 0.75, 'pace_factor': 0.80})

def calculate_realistic_win_probability(driver, constructor, grid_position, weather):
    """Calculate realistic win probability based on multiple factors"""
    
    driver_perf = get_realistic_driver_performance(driver)
    constructor_perf = get_realistic_constructor_performance(constructor)
    
    # Base probability from constructor competitiveness
    base_prob_map = {
        'McLaren': 25, 'Ferrari': 22, 'Red Bull Racing': 20, 'Mercedes': 18,
        'Aston Martin': 8, 'Alpine': 4, 'Williams': 2, 'Haas': 1,
        'RB': 1.5, 'Kick Sauber': 0.5
    }
    
    base_prob = base_prob_map.get(constructor, 1.0)
    
    # Apply driver skill factor
    driver_factor = driver_perf['win_factor']
    
    # Grid position impact (exponential decay)
    if grid_position <= 5:
        grid_factor = 1.0 - (grid_position - 1) * 0.1  # Front runners
    elif grid_position <= 10:
        grid_factor = 0.6 - (grid_position - 6) * 0.08  # Midfield
    else:
        grid_factor = 0.2 - (grid_position - 11) * 0.02  # Backmarkers
    
    grid_factor = max(0.01, grid_factor)  # Minimum chance
    
    # Weather adjustments
    weather_factor = 1.0
    if weather == "Wet":
        wet_specialists = ['Lewis Hamilton', 'Max Verstappen', 'Fernando Alonso']
        weather_factor = 1.3 if driver in wet_specialists else 0.85
    elif weather == "Mixed":
        weather_factor = 0.95  # Slightly unpredictable
    
    # Calculate final probability
    final_prob = base_prob * driver_factor * grid_factor * weather_factor
    
    # Cap realistic maximum (even best driver from pole shouldn't exceed ~35%)
    return min(35.0, max(0.1, final_prob))

def get_circuit_features(circuit_name):
    """Get circuit-specific characteristics"""
    circuit_data = {
        'Monaco Circuit': {'type': 'Street', 'drs_zones': 1, 'lap_length': 3.337},
        'Marina Bay Street Circuit': {'type': 'Street', 'drs_zones': 3, 'lap_length': 5.063},
        'Baku City Circuit': {'type': 'Street', 'drs_zones': 2, 'lap_length': 6.003},
        'Jeddah Corniche Circuit': {'type': 'Street', 'drs_zones': 3, 'lap_length': 6.174},
        'Las Vegas Strip Circuit': {'type': 'Street', 'drs_zones': 2, 'lap_length': 6.201},
        'Monza Circuit': {'type': 'Power', 'drs_zones': 2, 'lap_length': 5.793},
        'Silverstone Circuit': {'type': 'Balanced', 'drs_zones': 2, 'lap_length': 5.891},
        'Hungaroring': {'type': 'Twisty', 'drs_zones': 1, 'lap_length': 4.381},
        'Circuit de Spa-Francorchamps': {'type': 'Power', 'drs_zones': 2, 'lap_length': 7.004}
    }
    
    return circuit_data.get(circuit_name, {'type': 'Balanced', 'drs_zones': 2, 'lap_length': 5.0})

def get_points_for_position(position):
    """Get F1 points for a given position"""
    points_system = {
        1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
        6: 8, 7: 6, 8: 4, 9: 2, 10: 1
    }
    return points_system.get(position, 0)

@app.route('/api/teams', methods=['GET'])
def get_teams():
    return jsonify(current_teams)

@app.route('/api/circuits', methods=['GET'])
def get_circuits():
    return jsonify(circuits_2025)

@app.route('/api/predict', methods=['POST'])
def predict_race():
    if not models:
        return jsonify({"error": "Models not loaded. Please run train_enhanced_model.py first"}), 500
    
    try:
        data = request.json
        predictions = []
        
        # Get race conditions
        circuit = data['circuit']
        weather = data['weather']
        temp, humidity, wind, track_temp = get_weather_features(circuit, weather)
        circuit_features = get_circuit_features(circuit)
        
        # Store win probabilities for normalization
        all_win_probs = []
        
        for entry in data['entries']:
            driver = entry['driver']
            constructor = entry['constructor']
            grid = entry['grid']
            
            try:
                # Get enhanced features
                driver_features = get_realistic_driver_performance(driver)
                constructor_features = get_realistic_constructor_performance(constructor)
                
                # Encode categorical variables safely
                try:
                    driver_encoded = label_encoders['driver'].transform([driver])[0]
                except (ValueError, KeyError):
                    driver_encoded = 0
                
                try:
                    constructor_encoded = label_encoders['constructor'].transform([constructor])[0]
                except (ValueError, KeyError):
                    constructor_encoded = 0
                
                try:
                    circuit_encoded = label_encoders['circuit'].transform([circuit])[0]
                except (ValueError, KeyError):
                    circuit_encoded = 0
                
                try:
                    weather_encoded = label_encoders['weather'].transform([weather])[0]
                except (ValueError, KeyError):
                    weather_encoded = 0
                
                # Generate personalized tire strategy
                tire_strategy = get_personalized_tire_strategy(driver, constructor, grid, weather, circuit)
                
                try:
                    tire_strategy_encoded = label_encoders['tire_strategy'].transform([tire_strategy])[0]
                except (ValueError, KeyError):
                    tire_strategy_encoded = 0
                
                try:
                    circuit_type_encoded = label_encoders['circuit_type'].transform([circuit_features['type']])[0]
                except (ValueError, KeyError):
                    circuit_type_encoded = 0
                
                # Build feature vector matching the enhanced model
                features = [
                    grid,  # grid position
                    constructor_encoded,  # constructor
                    circuit_encoded,  # circuit
                    driver_encoded,  # driver
                    weather_encoded,  # weather
                    tire_strategy_encoded,  # tire strategy
                    temp,  # temperature
                    humidity,  # humidity
                    wind,  # wind speed
                    track_temp,  # track temperature
                    driver_features['experience'],  # driver experience
                    driver_features['form'],  # recent form
                    driver_features['quali_gap'],  # qualifying gap
                    constructor_features['standing'],  # constructor standing
                    constructor_features['efficiency'],  # budget efficiency
                    circuit_type_encoded,  # circuit type
                    circuit_features['drs_zones'],  # DRS zones
                    circuit_features['lap_length'],  # lap length
                    random.randint(0, 8),  # safety car laps
                    random.uniform(2.0, 4.5)  # pit time
                ]
                
                # Scale numerical features
                feature_array = np.array(features).reshape(1, -1)
                numerical_indices = [6, 7, 8, 9, 10, 11, 12, 15, 17, 19]  # indices of numerical features
                feature_array_scaled = feature_array.copy()
                
                if scaler and len(numerical_indices) > 0:
                    try:
                        feature_array_scaled[:, numerical_indices] = scaler.transform(feature_array[:, numerical_indices])
                    except:
                        pass  # Use unscaled if scaling fails
                
                # Make predictions using enhanced models
                try:
                    position_pred = models['position'].predict(feature_array_scaled)[0]
                except:
                    # Fallback position prediction based on grid and performance
                    position_pred = max(1, min(20, grid + random.randint(-3, 5)))
                
                # Calculate realistic win probability
                win_prob = calculate_realistic_win_probability(driver, constructor, grid, weather)
                all_win_probs.append(win_prob)
                
                predictions.append({
                    'driver': driver,
                    'constructor': constructor,
                    'grid': grid,
                    'predicted_position': max(1, min(20, round(position_pred))),
                    'podium_chance': False,  # Will be set based on final position
                    'points_chance': False,  # Will be set based on final position
                    'points_earned': 0,  # Will be calculated based on final position
                    'win_probability': round(win_prob, 2),
                    'tire_strategy': tire_strategy
                })
                
            except Exception as e:
                print(f"Error processing {driver}: {e}")
                # Fallback prediction with realistic values
                fallback_win_prob = calculate_realistic_win_probability(driver, constructor, grid, weather)
                all_win_probs.append(fallback_win_prob)
                
                # Generate fallback tire strategy
                fallback_tire_strategy = get_personalized_tire_strategy(driver, constructor, grid, weather, circuit)
                
                predictions.append({
                    'driver': driver,
                    'constructor': constructor,
                    'grid': grid,
                    'predicted_position': min(max(1, grid + random.randint(-3, 5)), 20),
                    'podium_chance': False,
                    'points_chance': False,
                    'points_earned': 0,
                    'win_probability': round(fallback_win_prob, 2),
                    'tire_strategy': fallback_tire_strategy
                })
        
        # Normalize win probabilities to sum to ~100%
        total_win_prob = sum(all_win_probs)
        if total_win_prob > 0:
            normalization_factor = 100.0 / total_win_prob
            for i, pred in enumerate(predictions):
                pred['win_probability'] = round(all_win_probs[i] * normalization_factor, 2)
        
        # Sort by win probability (descending) and assign positions realistically
        predictions.sort(key=lambda x: x['win_probability'], reverse=True)
        
        # Assign positions 1-20 based on win probability ranking
        for i, pred in enumerate(predictions):
            position = i + 1
            pred['predicted_position'] = position
            
            # Update podium and points based on final position
            pred['podium_chance'] = position <= 3
            pred['points_chance'] = position <= 10
            pred['points_earned'] = get_points_for_position(position)
        
        # Log prediction for analysis
        log_prediction(data, predictions, temp, track_temp)
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'race_info': {
                'circuit': circuit,
                'weather': weather,
                'temperature': temp,
                'track_temp': track_temp,
                'humidity': humidity,
                'wind_speed': wind
            }
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

def log_prediction(request_data, predictions, temp, track_temp):
    """Log predictions for model improvement"""
    try:
        os.makedirs("logs", exist_ok=True)
        
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'circuit': request_data['circuit'],
            'weather': request_data['weather'],
            'temperature': temp,
            'track_temp': track_temp,
            'num_entries': len(request_data['entries']),
            'winner_prediction': predictions[0]['driver'] if predictions else 'N/A',
            'winner_probability': predictions[0]['win_probability'] if predictions else 0
        }
        
        log_df = pd.DataFrame([log_entry])
        log_file = "logs/prediction_log.csv"
        
        if os.path.exists(log_file):
            log_df.to_csv(log_file, mode='a', header=False, index=False)
        else:
            log_df.to_csv(log_file, index=False)
            
    except Exception as e:
        print(f"Logging error: {e}")

@app.route('/api/driver-stats', methods=['GET'])
def get_driver_stats():
    """Get comprehensive driver statistics"""
    
    driver_stats = {
    'Max Verstappen': {
        'wins': 65, 'podiums': 109, 'poles': 43, 'championships': 4,
        'debut': 2015, 'age': 27, 'country': '🇳🇱', 'image': '/images/drivers/max-verstappen.jpg'
    },
    'Lewis Hamilton': {
        'wins': 105, 'podiums': 201, 'poles': 104, 'championships': 7,
        'debut': 2007, 'age': 40, 'country': '🇬🇧', 'image': '/images/drivers/lewis-hamilton.jpg'
    },
    'Charles Leclerc': {
        'wins': 5, 'podiums': 27, 'poles': 24, 'championships': 0,
        'debut': 2018, 'age': 27, 'country': '🇲🇨', 'image': '/images/drivers/charles-leclerc.jpg'
    },
    'Lando Norris': {
        'wins': 2, 'podiums': 13, 'poles': 2, 'championships': 0,
        'debut': 2019, 'age': 25, 'country': '🇬🇧', 'image': '/images/drivers/lando-norris.jpg'
    },
    'George Russell': {
        'wins': 2, 'podiums': 13, 'poles': 3, 'championships': 0,
        'debut': 2019, 'age': 27, 'country': '🇬🇧', 'image': '/images/drivers/george-russell.jpg'
    },
    'Fernando Alonso': {
        'wins': 32, 'podiums': 98, 'poles': 22, 'championships': 2,
        'debut': 2001, 'age': 43, 'country': '🇪🇸', 'image': '/images/drivers/fernando-alonso.jpg'
    },
    'Oscar Piastri': {
        'wins': 1, 'podiums': 3, 'poles': 0, 'championships': 0,
        'debut': 2023, 'age': 23, 'country': '🇦🇺', 'image': '/images/drivers/oscar-piastri.jpg'
    },
    'Carlos Sainz': {
        'wins': 3, 'podiums': 23, 'poles': 5, 'championships': 0,
        'debut': 2015, 'age': 30, 'country': '🇪🇸', 'image': '/images/drivers/carlos-sainz.jpg'
    },
    'Pierre Gasly': {
        'wins': 1, 'podiums': 4, 'poles': 0, 'championships': 0,
        'debut': 2017, 'age': 28, 'country': '🇫🇷', 'image': '/images/drivers/pierre-gasly.jpg'
    },
    'Alex Albon': {
        'wins': 0, 'podiums': 2, 'poles': 0, 'championships': 0,
        'debut': 2019, 'age': 28, 'country': '🇹🇭', 'image': '/images/drivers/alex-albon.jpg'
    },
    'Lance Stroll': {
        'wins': 0, 'podiums': 3, 'poles': 1, 'championships': 0,
        'debut': 2017, 'age': 26, 'country': '🇨🇦', 'image': '/images/drivers/lance-stroll.jpg'
    },
    'Yuki Tsunoda': {
        'wins': 0, 'podiums': 0, 'poles': 0, 'championships': 0,
        'debut': 2021, 'age': 25, 'country': '🇯🇵', 'image': '/images/drivers/yuki-tsunoda.jpg'
    },
    'Nico Hülkenberg': {
        'wins': 0, 'podiums': 0, 'poles': 1, 'championships': 0,
        'debut': 2010, 'age': 37, 'country': '🇩🇪', 'image': '/images/drivers/nico-hulkenberg.jpg'
    },
    'Esteban Ocon': {
        'wins': 1, 'podiums': 3, 'poles': 0, 'championships': 0,
        'debut': 2016, 'age': 28, 'country': '🇫🇷', 'image': '/images/drivers/esteban-ocon.jpg'
    },
    'Kimi Antonelli': {
        'wins': 0, 'podiums': 0, 'poles': 0, 'championships': 0,
        'debut': 2025, 'age': 18, 'country': '🇮🇹', 'image': '/images/drivers/kimi-antonelli.jpg'
    },
    'Oliver Bearman': {
        'wins': 0, 'podiums': 1, 'poles': 0, 'championships': 0,
        'debut': 2024, 'age': 19, 'country': '🇬🇧', 'image': '/images/drivers/oliver-bearman.jpg'
    },
    'Jack Doohan': {
        'wins': 0, 'podiums': 0, 'poles': 0, 'championships': 0,
        'debut': 2025, 'age': 22, 'country': '🇦🇺', 'image': '/images/drivers/jack-doohan.jpg'
    },
    'Gabriel Bortoleto': {
        'wins': 0, 'podiums': 0, 'poles': 0, 'championships': 0,
        'debut': 2025, 'age': 20, 'country': '🇧🇷', 'image': '/images/drivers/gabriel-bortoleto.jpg'
    },
    'Isack Hadjar': {
        'wins': 0, 'podiums': 0, 'poles': 0, 'championships': 0,
        'debut': 2025, 'age': 20, 'country': '🇫🇷', 'image': '/images/drivers/isack-hadjar.jpg'
    },
    'Liam Lawson': {
        'wins': 0, 'podiums': 0, 'poles': 0, 'championships': 0,
        'debut': 2023, 'age': 23, 'country': '🇳🇿', 'image': '/images/drivers/liam-lawson.jpg'
    }
}

    
    return jsonify(driver_stats)

@app.route('/api/constructor-standings', methods=['GET'])
def get_constructor_standings():
    """Get current constructor championship standings"""
    
    standings = [
        {'position': 1, 'team': 'McLaren', 'points': 666, 'wins': 6},
        {'position': 2, 'team': 'Ferrari', 'points': 652, 'wins': 5},
        {'position': 3, 'team': 'Red Bull Racing', 'points': 589, 'wins': 9},
        {'position': 4, 'team': 'Mercedes', 'points': 382, 'wins': 3},
        {'position': 5, 'team': 'Aston Martin', 'points': 94, 'wins': 0},
        {'position': 6, 'team': 'Alpine', 'points': 65, 'wins': 0},
        {'position': 7, 'team': 'Haas', 'points': 58, 'wins': 0},
        {'position': 8, 'team': 'RB', 'points': 46, 'wins': 0},
        {'position': 9, 'team': 'Williams', 'points': 17, 'wins': 0},
        {'position': 10, 'team': 'Kick Sauber', 'points': 0, 'wins': 0}
    ]
    
    return jsonify(standings)

@app.route('/api/fantasy-team', methods=['POST'])
def create_fantasy_team():
    """Enhanced fantasy team creation with ML-based scoring"""
    try:
        data = request.json
        team = data['team']
        budget = data.get('budget', 100)
        
        # Enhanced driver values based on current season performance
        driver_values = {
            'Max Verstappen': 30, 'Charles Leclerc': 25, 'Lando Norris': 22,
            'Lewis Hamilton': 24, 'George Russell': 20, 'Fernando Alonso': 18,
            'Oscar Piastri': 16, 'Carlos Sainz': 15, 'Pierre Gasly': 12,
            'Alex Albon': 10, 'Lance Stroll': 8, 'Yuki Tsunoda': 6,
            'Nico Hülkenberg': 7, 'Esteban Ocon': 9, 'Kimi Antonelli': 8,
            'Oliver Bearman': 5, 'Jack Doohan': 4, 'Gabriel Bortoleto': 3,
            'Isack Hadjar': 2, 'Liam Lawson': 4
        }
        
        # Calculate team cost
        total_cost = sum(driver_values.get(driver, 5) for driver in team['drivers'])
        total_cost += current_teams.get(team['constructor'], {}).get('championships', 0) * 2
        
        # Generate fantasy points using realistic performance
        fantasy_points = 0
        for driver in team['drivers']:
            driver_perf = get_realistic_driver_performance(driver)
            base_points = max(0, 25 - int(driver_perf['form']) + random.randint(-5, 15))
            
            # Bonus for experience and form
            experience_bonus = min(5, driver_perf['experience'] // 3)
            form_bonus = max(0, 10 - int(driver_perf['form'] // 2))
            
            fantasy_points += base_points + experience_bonus + form_bonus
        
        return jsonify({
            'success': True,
            'team': team,
            'total_cost': total_cost,
            'remaining_budget': budget - total_cost,
            'fantasy_points': fantasy_points,
            'valid': total_cost <= budget,
            'breakdown': {
                'driver_costs': {driver: driver_values.get(driver, 5) for driver in team['drivers']},
                'constructor_cost': current_teams.get(team['constructor'], {}).get('championships', 0) * 2
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    """Get information about loaded models"""
    if not models:
        return jsonify({'error': 'Models not loaded'}), 500
    
    model_info = {
        'models_loaded': list(models.keys()),
        'enhanced_features': len(feature_names) if feature_names else 0,
        'encoders_available': list(label_encoders.keys()) if label_encoders else [],
        'scaler_loaded': scaler is not None,
        'last_updated': datetime.now().isoformat()
    }
    
    return jsonify(model_info)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Comprehensive health check endpoint"""
    health_status = {
        'status': 'healthy',
        'models_loaded': models is not None,
        'enhanced_models': all(model is not None for model in models.values()) if models else False,
        'encoders_loaded': label_encoders is not None,
        'scaler_loaded': scaler is not None,
        'feature_names_loaded': feature_names is not None,
        'timestamp': datetime.now().isoformat(),
        'api_version': '2.0',
        'total_teams': len(current_teams),
        'total_circuits': len(circuits_2025),
        'total_drivers': sum(len(team['drivers']) for team in current_teams.values())
    }
    
    return jsonify(health_status)

if __name__ == '__main__':
    print("🏎️  Starting Enhanced F1 Race Predictor API...")
    print(f"🌐 API will be available at http://localhost:5059")
    print("📊 Enhanced Models status:", "✅ Loaded" if models else "❌ Not loaded")
    
    if models:
        print("🔥 Enhanced Features:")
        print("   • Personalized tire strategy based on driver/team characteristics")
        print("   • Realistic win probability calculation")
        print("   • Proper podium prediction (top 3 only)")
        print("   • Accurate points system (25, 18, 15, etc.)")
        print("   • Constructor competitiveness modeling")
        print("   • Weather and circuit-specific strategy adjustments")
        print("   • Driver personality and team philosophy factors")
        print("   • Grid position influence on strategy aggression")
    
    app.run(debug=True, port=5059, host='0.0.0.0')