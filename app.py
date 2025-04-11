import streamlit as st
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime
import matplotlib.pyplot as plt
import random

# Load models
reg = joblib.load("models/position_model.pkl")
clf_win = joblib.load("models/winner_model.pkl")
clf_pod = joblib.load("models/podium_model.pkl")
label_encoders = joblib.load("models/label_encoders.pkl")

# Get known categories
known_constructors = label_encoders['constructor'].classes_
known_circuits = label_encoders['circuit'].classes_
known_drivers = label_encoders['driver'].classes_

st.set_page_config(page_title="F1 Race Predictor", layout="centered")
st.title("\U0001F3CE️ F1 Race Outcome Predictor")

mode = st.sidebar.radio("Select Mode", ["Standard Prediction", "Future Race Prediction"])

weather_map = {"Dry": 0, "Wet": 1, "Mixed": 2}

# Strategy Generator
all_strategies = [
    "Soft → Medium", "Medium → Hard", "Soft → Hard",
    "Intermediate → Wet", "Wet → Intermediate", "Wet → Soft", "Wet → Hard",
    "Hard → Soft", "Medium → Soft", "Soft → Soft"
]

constructor_logos = {
    "McLaren": "https://upload.wikimedia.org/wikipedia/en/thumb/5/55/McLaren_Racing_logo.svg/1200px-McLaren_Racing_logo.svg.png",
    "Red Bull": "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Red_Bull_Racing_logo.svg/1200px-Red_Bull_Racing_logo.svg.png",
    "Ferrari": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Scuderia_Ferrari_Logo.svg/1200px-Scuderia_Ferrari_Logo.svg.png",
    "Mercedes": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/1200px-Mercedes-Benz_Logo_2010.svg.png",
    "RB": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/VCARB_Logo.svg/1200px-VCARB_Logo.svg.png",
    "Williams": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Williams_Grand_Prix_Engineering_logo.svg/1200px-Williams_Grand_Prix_Engineering_logo.svg.png",
    "Haas": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Haas_F1_Team_logo.svg/1200px-Haas_F1_Team_logo.svg.png",
    "Kick Sauber": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fb/Kick_Sauber_Logo.svg/1200px-Kick_Sauber_Logo.svg.png",
    "Alpine": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Alpine_F1_Team_Logo.svg/1200px-Alpine_F1_Team_Logo.svg.png",
    "Aston Martin": "https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Aston_Martin_F1_Team_logo.svg/1200px-Aston_Martin_F1_Team_logo.svg.png"
}

def generate_fastest_lap():
    driver = random.choice(known_drivers)
    time = f"1:{random.randint(25, 40)}.{random.randint(0, 999):03d}"
    return driver, time

def simulate_gap(position):
    if position == 1:
        return "+0.000s"
    elif position <= 10:
        return f"+{round(position * random.uniform(0.3, 0.9), 3)}s"
    else:
        return "DNF" if random.random() < 0.1 else f"+{round(position * random.uniform(1.5, 3.5), 3)}s"

def auto_tire_strategy(weather):
    if weather == "Wet":
        return random.choice(["Intermediate → Wet", "Wet → Intermediate", "Wet → Hard"])
    elif weather == "Mixed":
        return random.choice(["Soft → Medium", "Soft → Hard", "Medium → Hard"])
    else:
        return random.choice(["Soft → Medium", "Medium → Hard", "Soft → Hard"])

if mode == "Standard Prediction":
    st.header("\U0001F4D3 Historic Grid Simulator")
    st.markdown("Choose a past race grid and simulate adding a 21st driver to it.")

    selected_driver = st.selectbox("Select Additional Driver", known_drivers, key="hist_driver")
    selected_constructor = st.selectbox("Select Constructor", known_constructors, key="hist_constructor")
    selected_grid = st.slider("Select Starting Grid Position", 1, 21, 21, key="hist_grid")

    if selected_constructor in constructor_logos:
        st.image(constructor_logos[selected_constructor], width=100)

    weather = st.selectbox("Select Weather", ["Dry", "Wet", "Mixed"], key="hist_weather")
    circuit = st.selectbox("Select Circuit", known_circuits, key="hist_circuit")

    driver_encoded = label_encoders['driver'].transform([selected_driver])[0]
    constructor_encoded = label_encoders['constructor'].transform([selected_constructor])[0]
    circuit_encoded = label_encoders['circuit'].transform([circuit])[0]
    weather_encoded = weather_map[weather]
    tire_strategy = auto_tire_strategy(weather)
    strategy_encoded = label_encoders['tire_strategy'].transform([tire_strategy])[0] if 'tire_strategy' in label_encoders else 0

    input_row = [[selected_grid, constructor_encoded, circuit_encoded, driver_encoded, weather_encoded, strategy_encoded]]
    input_df = pd.DataFrame(input_row, columns=['grid', 'constructor', 'circuit', 'driver', 'weather', 'tire_strategy'])

    position_pred = reg.predict(input_df)[0]
    podium_pred = clf_pod.predict(input_df)[0]
    win_prob = clf_win.predict_proba(input_df)[0]

    st.subheader("\U0001F4C8 Historic Simulation Result")
    st.markdown(f"\U0001F3C1 **Predicted Finish:** {round(position_pred)}")
    st.markdown(f"\U0001F3C9 **Podium:** {'YES' if podium_pred == 1 else 'NO'}")

    st.markdown("\U0001F3C6 **Win Probabilities**")
    top_indices = np.argsort(win_prob)[::-1][:3]
    top_drivers = label_encoders['driver'].inverse_transform(top_indices)
    top_probs = win_prob[top_indices]

    for i in range(len(top_drivers)):
        st.write(f"{top_drivers[i]} — {round(top_probs[i]*100, 2)}%")

if mode == "Future Race Prediction":
    st.header("\U0001F52E Future Race Predictor")
    st.markdown("Simulate an upcoming race outcome by configuring the entire grid manually.")

    circuit = st.selectbox("Circuit", known_circuits, key="future_circuit")
    weather = st.selectbox("Expected Weather", ["Dry", "Wet", "Mixed"], key="future_weather")
    race_date = st.date_input("Planned Race Date", value=pd.to_datetime("2025-04-13"))

    weather_encoded = weather_map[weather]
    circuit_encoded = label_encoders['circuit'].transform([circuit])[0]

    st.markdown("### \U0001F6E0️ Manually Configure Starting Grid")
    custom_grid_data = []
    for i in range(1, 21):
        with st.expander(f"Driver Slot {i}"):
            driver = st.selectbox(f"Driver #{i}", known_drivers, key=f"driver_{i}")
            constructor = st.selectbox(f"Constructor #{i}", known_constructors, key=f"constructor_{i}")
            grid = st.slider(f"Grid Position #{i}", 1, 20, i, key=f"grid_{i}")

            if constructor in constructor_logos:
                st.image(constructor_logos[constructor], width=100)

            custom_grid_data.append({
                "driver": driver,
                "constructor": constructor,
                "grid": grid
            })

    if st.button("Predict Full Grid"):
        X_input = []
        result_display = []

        for entry in custom_grid_data:
            driver_encoded = label_encoders['driver'].transform([entry['driver']])[0]
            constructor_encoded = label_encoders['constructor'].transform([entry['constructor']])[0]
            tire_strategy = auto_tire_strategy(weather)
            strategy_encoded = label_encoders['tire_strategy'].transform([tire_strategy])[0] if 'tire_strategy' in label_encoders else 0

            row = [entry['grid'], constructor_encoded, circuit_encoded, driver_encoded, weather_encoded, strategy_encoded]
            X_input.append(row)

        X_input_df = pd.DataFrame(X_input, columns=['grid', 'constructor', 'circuit', 'driver', 'weather', 'tire_strategy'])

        position_preds = reg.predict(X_input_df)
        podium_preds = clf_pod.predict(X_input_df)
        win_probs = clf_win.predict_proba(X_input_df)

        sorted_indices = np.argsort(position_preds)
        ranked_positions = np.empty_like(sorted_indices)
        ranked_positions[sorted_indices] = np.arange(1, len(sorted_indices)+1)

        for i, entry in enumerate(custom_grid_data):
            max_prob = win_probs[i].max()
            result_display.append({
                'Grid': entry['grid'],
                'Driver': entry['driver'],
                'Constructor': entry['constructor'],
                'Predicted Finish': int(ranked_positions[i]),
                'Podium': 'YES' if podium_preds[i] == 1 else 'NO',
                'Win Probability (%)': round(max_prob * 100, 2)
            })

        results_df = pd.DataFrame(result_display).sort_values(by='Predicted Finish')
        st.subheader("\U0001F4CA Full Grid Race Predictions")
        st.dataframe(results_df)

# --- Feature Importance ---
st.subheader("\U0001F4CA Feature Importance (Finishing Position Model)")
importance = reg.feature_importances_
features = ['Grid', 'Constructor', 'Circuit', 'Driver', 'Weather', 'Tire Strategy']

fig, ax = plt.subplots()
ax.barh(features, importance)
ax.set_xlabel("Importance")
ax.set_title("Which features impact the finish position?")
st.pyplot(fig)

#To run SteamlitUI -> streamlit run app.py
