import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_squared_error, classification_report
from sklearn.preprocessing import LabelEncoder
import numpy as np
import os
import joblib

# 📁 Create output folder for models
os.makedirs("models", exist_ok=True)

# 📊 Load dataset
df = pd.read_csv("data/f1_multi_year_results.csv")

# ✅ Validate required columns
required_cols = ['driver', 'constructor', 'circuit', 'weather', 'tire_strategy', 'grid', 'position']
missing_cols = [col for col in required_cols if col not in df.columns]
if missing_cols:
    raise ValueError(f"Missing required columns in dataset: {missing_cols}")

# 🎯 Add podium column (Top 3 = podium)
df['podium'] = df['position'].apply(lambda x: 1 if x <= 3 else 0)

# 🔢 Encode categorical variables
label_encoders = {}
categorical_cols = ['driver', 'constructor', 'circuit', 'weather', 'tire_strategy']
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# 🧠 Define input features
features = ['grid', 'constructor', 'circuit', 'driver', 'weather', 'tire_strategy']
X = df[features]

# ------------------ 🏁 1. Finishing Position (Regression) ------------------ #
y_pos = df['position']
X_train_pos, X_test_pos, y_train_pos, y_test_pos = train_test_split(X, y_pos, test_size=0.2, random_state=42)

reg = RandomForestRegressor(n_estimators=100, random_state=42)
reg.fit(X_train_pos, y_train_pos)
y_pred_pos = reg.predict(X_test_pos)

print("🏁 Finishing Position Regression:")
print(f"Train shape: {X_train_pos.shape}, Test shape: {X_test_pos.shape}")
print("RMSE:", np.sqrt(mean_squared_error(y_test_pos, y_pred_pos)))
print()

# ------------------ 🏆 2. Winner Prediction (Classification) ------------------ #
df_winners = df[df['position'] == 1]
X_winner = df_winners[features]
y_winner = df_winners['driver']
X_train_win, X_test_win, y_train_win, y_test_win = train_test_split(X_winner, y_winner, test_size=0.2, random_state=42)

clf_win = RandomForestClassifier(n_estimators=100, random_state=42)
clf_win.fit(X_train_win, y_train_win)
y_pred_win = clf_win.predict(X_test_win)

print("🏆 Race Winner Classification:")
print("Accuracy:", accuracy_score(y_test_win, y_pred_win))
print()

# ------------------ 🥉 3. Podium Classification (Binary) ------------------ #
y_podium = df['podium']
X_train_pod, X_test_pod, y_train_pod, y_test_pod = train_test_split(X, y_podium, test_size=0.2, random_state=42)

clf_pod = RandomForestClassifier(n_estimators=100, random_state=42)
clf_pod.fit(X_train_pod, y_train_pod)
y_pred_pod = clf_pod.predict(X_test_pod)

print("🥉 Podium Finish Prediction:")
print("Accuracy:", accuracy_score(y_test_pod, y_pred_pod))
print(classification_report(y_test_pod, y_pred_pod))

# 💾 Save all models + encoders
joblib.dump(reg, "models/position_model.pkl")
joblib.dump(clf_win, "models/winner_model.pkl")
joblib.dump(clf_pod, "models/podium_model.pkl")
joblib.dump(label_encoders, "models/label_encoders.pkl")

print("✅ Models and encoders saved.")
