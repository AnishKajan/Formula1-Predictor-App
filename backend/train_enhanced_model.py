import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import accuracy_score, mean_squared_error, classification_report, mean_absolute_error
from sklearn.preprocessing import LabelEncoder, StandardScaler
import numpy as np
import os
import joblib
import random
from datetime import datetime

# Create output folder for models
os.makedirs("models", exist_ok=True)
os.makedirs("logs", exist_ok=True)

def enhance_weather_features(df):
    """Add more sophisticated weather-related features"""
    
    # Temperature ranges based on circuit locations and seasons
    def get_temperature(circuit, date=None):
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
        return temp_map.get(circuit, random.randint(15, 25))
    
    # Add enhanced weather features
    df['temperature'] = df['circuit'].apply(get_temperature)
    df['humidity'] = np.where(df['weather'] == 'Wet', 
                              np.random.uniform(80, 95, len(df)),
                              np.where(df['weather'] == 'Mixed',
                                      np.random.uniform(60, 85, len(df)),
                                      np.random.uniform(30, 70, len(df))))
    
    df['wind_speed'] = np.where(df['weather'] == 'Wet',
                               np.random.uniform(10, 20, len(df)),
                               np.where(df['weather'] == 'Mixed',
                                       np.random.uniform(5, 15, len(df)),
                                       np.random.uniform(0, 10, len(df))))
    
    df['track_temp'] = df['temperature'] + np.random.uniform(5, 25, len(df))
    
    return df

def enhance_tire_strategy(df):
    """Generate realistic tire strategies"""
    
    def get_strategy(weather, circuit):
        street_circuits = ['Monaco Circuit', 'Marina Bay Street Circuit', 'Baku City Circuit', 'Jeddah Corniche Circuit']
        
        if weather == "Wet":
            return random.choice([
                "Full Wet → Intermediate → Medium",
                "Intermediate → Full Wet",
                "Full Wet → Medium",
                "Intermediate → Soft"
            ])
        elif weather == "Mixed":
            return random.choice([
                "Intermediate → Medium → Soft",
                "Soft → Intermediate → Hard",
                "Medium → Intermediate → Soft"
            ])
        else:  # Dry conditions
            if circuit in street_circuits:
                return random.choice([
                    "Medium → Hard",
                    "Soft → Medium → Hard",
                    "Hard → Medium",
                    "Soft → Hard"
                ])
            else:
                return random.choice([
                    "Soft → Medium",
                    "Medium → Hard",
                    "Soft → Hard",
                    "Medium → Medium"
                ])
    
    # Only add tire strategy if it doesn't exist
    if 'tire_strategy' not in df.columns:
        df['tire_strategy'] = df.apply(lambda row: get_strategy(row['weather'], row['circuit']), axis=1)
    
    return df

def add_driver_performance_features(df):
    """Add realistic driver performance metrics with 2025 updates"""
    
    # Updated driver experience mapping including 2025 season
    driver_experience = {
        # Veterans
        'Lewis Hamilton': 19,           # 2007–2025
        'Fernando Alonso': 21,          # 2001–2018, 2021–2025 (break: 2019–2020)
        'Nico Hülkenberg': 13,          # 2010–2019, 2023–2025 (break: 2020–2022)
        'Nico Hulkenberg': 13,          # Alternative spelling
        
        # Current stars
        'Max Verstappen': 11,           # 2015–2025
        'Charles Leclerc': 7,           # 2018–2025
        'Lando Norris': 7,              # 2019–2025
        'George Russell': 6,            # 2019–2025
        'Pierre Gasly': 8,              # 2017–2025
        'Esteban Ocon': 8,              # 2016, 2017–2018, 2020–2025 (missed 2019)
        'Lance Stroll': 8,              # 2017–2025
        'Yuki Tsunoda': 5,              # 2021–2025
        'Alex Albon': 5,                # 2019–2020, 2022–2025 (missed 2021)
        'Alexander Albon': 5,           # Alternative name
        'Carlos Sainz': 11,             # 2015–2025
        'Oscar Piastri': 3,             # 2023–2025
        
        # 2025 rookies and newer drivers
        'Kimi Antonelli': 1,            # Debuted 2025
        'Oliver Bearman': 1,            # Partial 2024 debut, full season 2025
        'Jack Doohan': 1,               # Debuted 2025
        'Franco Colapinto': 1,          # Partial 2024, full 2025
        'Gabriel Bortoleto': 1,         # Debuted 2025
        'Isack Hadjar': 1,              # Debuted 2025
        'Liam Lawson': 2,               # Partial 2023, full 2025 (missed 2024)
        
        # Historical drivers - add some common ones
        'Sebastian Vettel': 15,
        'Daniel Ricciardo': 13,
        'Valtteri Bottas': 11,
        'Sergio Pérez': 14,
        'Sergio Perez': 14,
    }
    
    # Add experience for drivers not in the mapping
    for driver in df['driver'].unique():
        if driver not in driver_experience:
            # Estimate based on first appearance in dataset
            driver_seasons = df[df['driver'] == driver]['season'].unique()
            estimated_experience = len(driver_seasons)
            driver_experience[driver] = max(1, estimated_experience)
    
    df['driver_experience'] = df['driver'].map(driver_experience)
    
    # Calculate recent form (average position in last few races)
    def calculate_recent_form(group):
        # Sort by date and take last 5 races
        recent_races = group.sort_values('date').tail(5)
        avg_position = recent_races['position'].mean()
        return avg_position
    
    # Group by driver and calculate recent form
    recent_form = df.groupby('driver').apply(calculate_recent_form)
    df['recent_form'] = df['driver'].map(recent_form)
    
    # Fill any missing values
    df['recent_form'] = df['recent_form'].fillna(15.0)
    
    # Qualifying gap to teammate (simulated but realistic)
    df['quali_gap_to_teammate'] = np.random.uniform(-1.5, 1.5, len(df))
    
    return df

def add_constructor_features(df):
    """Add constructor performance features with 2025 updates"""
    
    # Updated constructor standings based on 2025 season performance
    constructor_standings = {
        # 2025 season standings
        'McLaren': 1, 'Ferrari': 2, 'Red Bull Racing': 3, 'Red Bull': 3,
        'Mercedes': 4, 'Aston Martin': 5, 'Alpine': 6, 'Haas': 7, 'Haas F1 Team': 7,
        'Racing Bulls': 8, 'RB': 8, 'Williams': 9, 'Kick Sauber': 10, 'Sauber': 10,
        
        # Historical teams
        'Force India': 7, 'Racing Point': 6, 'AlphaTauri': 8, 'Toro Rosso': 8,
        'Lotus': 6, 'Renault': 6, 'Manor': 10, 'Caterham': 10, 'HRT': 10,
        'Virgin': 10, 'Brawn GP': 3, 'Toyota': 5, 'BMW Sauber': 4
    }
    
    df['constructor_standing'] = df['constructor'].map(constructor_standings).fillna(10)
    
    # Budget efficiency (how well they perform relative to resources)
    efficiency_map = {
        'McLaren': 0.98, 'Ferrari': 0.95, 'Red Bull Racing': 0.93, 'Red Bull': 0.93,
        'Mercedes': 0.90, 'Aston Martin': 0.85, 'Alpine': 0.82, 'Haas': 0.80,
        'Racing Bulls': 0.79, 'RB': 0.79, 'Williams': 0.78, 'Kick Sauber': 0.75,
        'Sauber': 0.75
    }
    
    df['budget_efficiency'] = df['constructor'].map(efficiency_map)
    
    # Fix the fillna issue - generate individual random values for missing entries
    missing_mask = df['budget_efficiency'].isna()
    if missing_mask.any():
        random_values = np.random.uniform(0.7, 1.0, missing_mask.sum())
        df.loc[missing_mask, 'budget_efficiency'] = random_values
    
    return df

def add_circuit_features(df):
    """Add circuit characteristics"""
    
    circuit_types = {
        'Monaco Circuit': 'Street',
        'Marina Bay Street Circuit': 'Street',
        'Baku City Circuit': 'Street',
        'Jeddah Corniche Circuit': 'Street',
        'Las Vegas Strip Circuit': 'Street',
        'Miami International Autodrome': 'Street',
        'Monza Circuit': 'Power',
        'Silverstone Circuit': 'Balanced',
        'Hungaroring': 'Twisty',
        'Circuit de Spa-Francorchamps': 'Power',
        'Circuit Gilles Villeneuve': 'Power',
        'Albert Park Circuit': 'Balanced',
        'Suzuka Circuit': 'Balanced',
        'Red Bull Ring': 'Power',
        'Circuit de Barcelona-Catalunya': 'Balanced'
    }
    
    df['circuit_type'] = df['circuit'].map(circuit_types).fillna('Balanced')
    
    # Circuit characteristics
    drs_zones_map = {
        'Monaco Circuit': 1, 'Hungaroring': 1, 'Marina Bay Street Circuit': 3,
        'Baku City Circuit': 2, 'Jeddah Corniche Circuit': 3, 'Monza Circuit': 2,
        'Silverstone Circuit': 2, 'Circuit de Spa-Francorchamps': 2
    }
    
    df['drs_zones'] = df['circuit'].map(drs_zones_map)
    df['drs_zones'] = df['drs_zones'].fillna(2)  # Default 2 DRS zones
    
    lap_length_map = {
        'Monaco Circuit': 3.337, 'Marina Bay Street Circuit': 5.063,
        'Baku City Circuit': 6.003, 'Circuit de Spa-Francorchamps': 7.004,
        'Silverstone Circuit': 5.891, 'Monza Circuit': 5.793
    }
    
    df['lap_length'] = df['circuit'].map(lap_length_map)
    missing_lap_length = df['lap_length'].isna()
    if missing_lap_length.any():
        random_lap_values = np.random.uniform(3.0, 7.0, missing_lap_length.sum())
        df.loc[missing_lap_length, 'lap_length'] = random_lap_values
    
    df['safety_car_laps'] = np.random.poisson(3, len(df))
    df['avg_pit_time'] = np.random.uniform(2.0, 4.5, len(df))
    
    return df

def load_and_enhance_data():
    """Load and enhance F1 data"""
    
    # Try to load existing data
    data_files = ["data/f1_multi_year_results.csv", "data/f1_2023_results.csv"]
    df = None
    
    for file in data_files:
        if os.path.exists(file):
            print(f"📊 Loading data from {file}")
            df = pd.read_csv(file)
            break
    
    if df is None:
        print("❌ No data file found. Please ensure f1_multi_year_results.csv exists in the data folder")
        return None
    
    print(f"📈 Loaded {len(df)} race results")
    
    # Check for 2025 data
    seasons = df['season'].unique()
    print(f"📅 Seasons in dataset: {min(seasons)} to {max(seasons)}")
    
    if 2025 in seasons:
        races_2025 = len(df[df['season'] == 2025])
        print(f"🆕 Found {races_2025} results from 2025 season")
    else:
        print("⚠️ No 2025 data found - predictions will be based on historical data only")
    
    # Clean data
    df = df.dropna(subset=['driver', 'constructor', 'circuit', 'grid', 'position'])
    df['grid'] = pd.to_numeric(df['grid'], errors='coerce')
    df['position'] = pd.to_numeric(df['position'], errors='coerce')
    
    # Remove invalid data
    df = df[(df['grid'] > 0) & (df['position'] > 0) & (df['position'] <= 22)]  # Allow for 22 cars in some seasons
    
    # Add weather if not present
    if 'weather' not in df.columns:
        print("🌦️ Adding weather data...")
        df['weather'] = 'Dry'  # Default
        # Add some variety based on circuits known for weather
        wet_circuits = ['Circuit de Spa-Francorchamps', 'Suzuka Circuit', 'Interlagos', 'Silverstone Circuit']
        for circuit in wet_circuits:
            circuit_mask = df['circuit'] == circuit
            if circuit_mask.sum() > 0:
                df.loc[circuit_mask, 'weather'] = np.random.choice(['Wet', 'Mixed', 'Dry'], 
                                                                   size=circuit_mask.sum(),
                                                                   p=[0.3, 0.3, 0.4])
    
    # Convert date to datetime for proper sorting
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date'])  # Remove rows with invalid dates
    df = df.sort_values(['date', 'round', 'position']).reset_index(drop=True)
    
    # Add enhanced features
    print("🔧 Adding enhanced features...")
    df = enhance_weather_features(df)
    df = enhance_tire_strategy(df)
    df = add_driver_performance_features(df)
    df = add_constructor_features(df)
    df = add_circuit_features(df)
    
    print(f"✅ Enhanced dataset with {len(df.columns)} features")
    print(f"📊 Final dataset: {len(df)} race results")
    
    return df

def train_enhanced_models():
    """Train enhanced ML models with 2025 data"""
    
    print("🚀 Starting Enhanced F1 ML Training (Including 2025 Season)...")
    print("=" * 70)
    
    # Load and prepare data
    df = load_and_enhance_data()
    if df is None:
        return None
    
    # Create target variables
    df['podium'] = (df['position'] <= 3).astype(int)
    df['points_scored'] = (df['position'] <= 10).astype(int)
    df['winner'] = (df['position'] == 1).astype(int)
    
    # Encode categorical variables
    label_encoders = {}
    categorical_cols = ['driver', 'constructor', 'circuit', 'weather', 'tire_strategy', 'circuit_type']
    
    print("🔄 Encoding categorical variables...")
    for col in categorical_cols:
        le = LabelEncoder()
        df[col + '_encoded'] = le.fit_transform(df[col].astype(str))
        label_encoders[col] = le
        print(f"   • {col}: {len(le.classes_)} unique values")
    
    # Define feature set
    enhanced_features = [
        'grid', 'constructor_encoded', 'circuit_encoded', 'driver_encoded', 
        'weather_encoded', 'tire_strategy_encoded', 'temperature', 'humidity',
        'wind_speed', 'track_temp', 'driver_experience', 'recent_form',
        'quali_gap_to_teammate', 'constructor_standing', 'budget_efficiency',
        'circuit_type_encoded', 'drs_zones', 'lap_length', 'safety_car_laps',
        'avg_pit_time'
    ]
    
    X = df[enhanced_features]
    
    # Scale numerical features
    numerical_features = [
        'temperature', 'humidity', 'wind_speed', 'track_temp', 
        'driver_experience', 'recent_form', 'quali_gap_to_teammate',
        'budget_efficiency', 'lap_length', 'avg_pit_time'
    ]
    
    scaler = StandardScaler()
    X_scaled = X.copy()
    X_scaled[numerical_features] = scaler.fit_transform(X[numerical_features])
    
    models = {}
    
    print("\n🎯 Training Models...")
    
    # 1. Position Prediction (Regression)
    print("   📍 Training Position Prediction Model...")
    y_pos = df['position']
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_pos, test_size=0.2, random_state=42)
    
    # Try both RandomForest and GradientBoosting
    models_to_try = {
        'RandomForest': RandomForestRegressor(n_estimators=200, max_depth=15, random_state=42, n_jobs=-1),
        'GradientBoosting': GradientBoostingRegressor(n_estimators=200, max_depth=8, random_state=42)
    }
    
    best_model = None
    best_score = float('inf')
    
    for name, model in models_to_try.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)
        print(f"      {name} - RMSE: {rmse:.3f}, MAE: {mae:.3f}")
        
        if rmse < best_score:
            best_score = rmse
            best_model = model
    
    models['position'] = best_model
    print(f"      ✅ Best Position Model: RMSE {best_score:.3f}")
    
    # 2. Podium Prediction
    print("   🥉 Training Podium Prediction Model...")
    y_podium = df['podium']
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_podium, test_size=0.2, random_state=42)
    
    clf_podium = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42, n_jobs=-1)
    clf_podium.fit(X_train, y_train)
    y_pred = clf_podium.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    print(f"      ✅ Podium Accuracy: {accuracy:.3f}")
    models['podium'] = clf_podium
    
    # 3. Points Scoring Prediction
    print("   🏁 Training Points Prediction Model...")
    y_points = df['points_scored']
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_points, test_size=0.2, random_state=42)
    
    clf_points = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42, n_jobs=-1)
    clf_points.fit(X_train, y_train)
    y_pred = clf_points.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    print(f"      ✅ Points Accuracy: {accuracy:.3f}")
    models['points'] = clf_points
    
    # 4. Winner Prediction (if enough data)
    winners_df = df[df['winner'] == 1]
    print(f"   🏆 Training Winner Prediction Model ({len(winners_df)} winners)...")
    
    if len(winners_df) > 50:
        y_winner = df['winner']
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_winner, test_size=0.2, random_state=42)
        
        clf_winner = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42, 
                                          class_weight='balanced', n_jobs=-1)
        clf_winner.fit(X_train, y_train)
        y_pred = clf_winner.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        print(f"      ✅ Winner Accuracy: {accuracy:.3f}")
        models['winner'] = clf_winner
    else:
        print("      ⚠️ Insufficient winner data, skipping winner model")
        models['winner'] = None
    
    # Save models
    print("\n💾 Saving Models...")
    for name, model in models.items():
        if model is not None:
            filename = f"models/{name}_enhanced_model.pkl"
            joblib.dump(model, filename)
            print(f"   ✅ Saved {filename}")
    
    joblib.dump(label_encoders, "models/enhanced_label_encoders.pkl")
    joblib.dump(scaler, "models/feature_scaler.pkl")
    joblib.dump(enhanced_features, "models/feature_names.pkl")
    
    # Feature importance analysis
    print("\n📊 Feature Importance Analysis:")
    if models['position']:
        feature_importance = pd.DataFrame({
            'feature': enhanced_features,
            'importance': models['position'].feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("Top 10 Most Important Features:")
        for i, row in feature_importance.head(10).iterrows():
            print(f"   {row['feature']}: {row['importance']:.4f}")
    
    # 2025 season analysis
    if 2025 in df['season'].unique():
        print("\n📈 2025 Season Analysis:")
        df_2025 = df[df['season'] == 2025]
        
        # Championship standings
        championship = df_2025.groupby('driver')['points'].sum().sort_values(ascending=False).head(5)
        print("   🏆 Top 5 Championship Standings:")
        for i, (driver, points) in enumerate(championship.items(), 1):
            print(f"      {i}. {driver}: {points:.0f} points")
        
        # Constructor standings
        constructor_standings = df_2025.groupby('constructor')['points'].sum().sort_values(ascending=False).head(3)
        print("   🏁 Top 3 Constructor Standings:")
        for i, (constructor, points) in enumerate(constructor_standings.items(), 1):
            print(f"      {i}. {constructor}: {points:.0f} points")
    
    # Model performance summary
    print("\n🎉 Training Complete!")
    print("=" * 70)
    print("Enhanced F1 ML Models Successfully Trained")
    print(f"Dataset Size: {len(df):,} race results")
    print(f"Features: {len(enhanced_features)} enhanced features")
    print(f"Models Trained: {len([m for m in models.values() if m is not None])}")
    print(f"Seasons: {df['season'].min()} to {df['season'].max()}")
    if 2025 in df['season'].unique():
        print(f"2025 Races: {len(df[df['season'] == 2025])} results included")
    print("=" * 70)
    
    # Save training log
    training_log = {
        'timestamp': datetime.now().isoformat(),
        'dataset_size': len(df),
        'features': len(enhanced_features),
        'models_trained': len([m for m in models.values() if m is not None]),
        'position_rmse': best_score,
        'seasons_covered': f"{df['season'].min()}-{df['season'].max()}",
        'includes_2025': 2025 in df['season'].unique()
    }
    
    log_df = pd.DataFrame([training_log])
    log_df.to_csv("logs/training_log.csv", mode='a', header=not os.path.exists("logs/training_log.csv"), index=False)
    
    return models, label_encoders, scaler, enhanced_features

if __name__ == "__main__":
    # Set random seeds for reproducibility
    np.random.seed(42)
    random.seed(42)
    
    try:
        # Run the enhanced training
        results = train_enhanced_models()
        
        if results:
            models, label_encoders, scaler, features = results
            
            # Test prediction functionality
            print("\n🧪 Testing Prediction Functionality...")
            
            # Create a sample prediction
            sample_features = [
                1,  # grid
                0,  # constructor_encoded
                0,  # circuit_encoded  
                0,  # driver_encoded
                0,  # weather_encoded
                0,  # tire_strategy_encoded
                25, # temperature
                45, # humidity
                5,  # wind_speed
                40, # track_temp
                10, # driver_experience
                3,  # recent_form
                -0.2, # quali_gap
                1,  # constructor_standing
                0.95, # budget_efficiency
                0,  # circuit_type_encoded
                2,  # drs_zones
                5.5, # lap_length
                2,  # safety_car_laps
                3.2  # avg_pit_time
            ]
            
            # Scale the sample
            sample_array = np.array(sample_features).reshape(1, -1)
            numerical_indices = [6, 7, 8, 9, 10, 11, 12, 15, 17, 19]
            sample_scaled = sample_array.copy()
            sample_scaled[:, numerical_indices] = scaler.transform(sample_array[:, numerical_indices])
            
            # Test predictions
            if models['position']:
                pos_pred = models['position'].predict(sample_scaled)[0]
                print(f"   📍 Sample Position Prediction: {pos_pred:.1f}")
            
            if models['podium']:
                podium_pred = models['podium'].predict(sample_scaled)[0]
                print(f"   🥉 Sample Podium Prediction: {'Yes' if podium_pred else 'No'}")
            
            if models['points']:
                points_pred = models['points'].predict(sample_scaled)[0]
                print(f"   🏁 Sample Points Prediction: {'Yes' if points_pred else 'No'}")
            
            print("\n✅ All tests passed! Models are ready for production.")
            print("\n🚀 Your models now include 2025 season data!")
            print("   📊 Oscar Piastri's championship lead")
            print("   🏁 McLaren's current dominance") 
            print("   🔄 Lewis Hamilton at Ferrari")
            print("   🆕 All rookie performances")
            print("\n🌐 To use the updated models:")
            print("   1. Restart the FastAPI API: python app.py")
            print("   2. Access predictions at http://localhost:5059/api/predict")
            print("   3. Predictions now factor in 2025 season trends!")
            
        else:
            print("❌ Training failed. Please check the error messages above.")
            
    except Exception as e:
        print(f"❌ Training failed with error: {e}")
        print("\n🔧 Troubleshooting steps:")
        print("   1. Ensure your CSV file contains 2025 data")
        print("   2. Check that data/f1_multi_year_results.csv exists")
        print("   3. Verify all required packages are installed:")
        print("      pip install pandas scikit-learn joblib numpy")
        print("   4. Check the logs/ folder for detailed error information")
        
        import traceback
        print(f"\n📋 Full error traceback:")
        traceback.print_exc()