import joblib
import numpy as np

# Load models and encoders
reg = joblib.load("models/position_model.pkl")
clf_win = joblib.load("models/winner_model.pkl")
clf_pod = joblib.load("models/podium_model.pkl")
label_encoders = joblib.load("models/label_encoders.pkl")

# --- Input section (you can later replace this with user input or a UI) ---
grid = int(input("Enter grid position (e.g. 1): "))
constructor_name = input("Enter constructor name (e.g. Red Bull): ")
circuit_name = input("Enter circuit name (e.g. Bahrain International Circuit): ")

# Encode inputs using label encoders
try:
    constructor_encoded = label_encoders['constructor'].transform([constructor_name])[0]
    circuit_encoded = label_encoders['circuit'].transform([circuit_name])[0]
except ValueError as e:
    print("\n❌ Error: Constructor or circuit name not recognized.")
    print("Make sure it matches exactly one from the training data.")
    exit()

# Prepare input for prediction
X_input = np.array([[grid, constructor_encoded, circuit_encoded]])

# --- Make Predictions ---
position_pred = reg.predict(X_input)[0]
podium_pred = clf_pod.predict(X_input)[0]
win_prob = clf_win.predict_proba(X_input)

print("\n--- Prediction Results ---")
print(f"🏁 Predicted Finish Position: {round(position_pred)}")
print(f"🥉 Podium Prediction: {'YES' if podium_pred == 1 else 'NO'}")

# Display top 3 predicted winners with confidence
print("\n🏆 Most Likely Winners:")
classes = label_encoders['driver'].inverse_transform(np.argsort(win_prob[0])[::-1][:3])
probs = np.sort(win_prob[0])[::-1][:3]
top_n = min(3, len(classes))
for i in range(top_n):
    print(f"{classes[i]} — {round(probs[i]*100, 1)}%")

import pandas as pd
from datetime import datetime
import os

log_data = {
    'timestamp': [datetime.now().isoformat()],
    'grid': [grid],
    'constructor': [constructor_name],
    'circuit': [circuit_name],
    'predicted_position': [round(position_pred)],
    'predicted_podium': ['YES' if podium_pred == 1 else 'NO'],
    'top_winner_1': [classes[0] if len(classes) > 0 else 'N/A'],
    'top_winner_1_prob': [round(probs[0]*100, 1) if len(probs) > 0 else 0]
}

# Optional: include runner-up if exists
if len(classes) > 1:
    log_data['top_winner_2'] = [classes[1]]
    log_data['top_winner_2_prob'] = [round(probs[1]*100, 1)]
else:
    log_data['top_winner_2'] = ['N/A']
    log_data['top_winner_2_prob'] = [0]

df_log = pd.DataFrame(log_data)

os.makedirs("logs", exist_ok=True)
log_file = "logs/prediction_log.csv"

# Append to file or create if it doesn’t exist
if os.path.exists(log_file):
    df_log.to_csv(log_file, mode='a', header=False, index=False)
else:
    df_log.to_csv(log_file, index=False)

print("\n🗂️ Prediction saved to logs/prediction_log.csv")

#TO SAVE DATA IN EXCEL: open -a "Microsoft Excel" logs/prediction_log.csv