import pandas as pd
import requests
import os
import random

def simulate_weather(circuit_name):
    if any(word in circuit_name.lower() for word in ["spa", "suzuka", "interlagos", "silverstone"]):
        return "Wet"
    elif any(word in circuit_name.lower() for word in ["monaco", "nürburgring", "istanbul"]):
        return "Mixed"
    else:
        return "Dry"

def simulate_tire_strategy(weather):
    if weather == "Wet":
        return "Intermediate → Wet"
    elif weather == "Mixed":
        return random.choice(["Soft → Medium", "Medium → Hard"])
    else:
        return random.choice(["Soft → Medium", "Medium → Hard", "Soft → Hard"])

def simulate_fastest_lap():
    minutes = 1
    seconds = random.randint(25, 40)
    milliseconds = random.randint(0, 999)
    return f"{minutes}:{seconds:02d}.{milliseconds:03d}"

def simulate_gap(position):
    if position == 1:
        return "+0.000s"
    elif position <= 10:
        return f"+{round(position * random.uniform(1.0, 3.0), 3)}s"
    else:
        return "DNF" if random.random() < 0.1 else f"+{round(position * random.uniform(2.5, 6.5), 3)}s"

def get_multiple_seasons_results(start=1950, end=2024):
    all_races = []
    for year in range(start, end + 1):
        print(f"📥 Fetching {year}...")
        url = f"http://ergast.com/api/f1/{year}/results.json?limit=1000"
        response = requests.get(url)
        races = response.json()['MRData']['RaceTable']['Races']
        all_races.extend(races)
    return all_races

def races_to_dataframe(races):
    data = []

    for race in races:
        weather = simulate_weather(race['Circuit']['circuitName'])
        tire_strategy = simulate_tire_strategy(weather)
        fastest_lap_time = simulate_fastest_lap()

        for result in race['Results']:
            position = int(result['position'])
            row = {
                'season': race['season'],
                'round': race['round'],
                'race_name': race['raceName'],
                'circuit': race['Circuit']['circuitName'],
                'date': race['date'],
                'driver': f"{result['Driver']['givenName']} {result['Driver']['familyName']}",
                'constructor': result['Constructor']['name'],
                'grid': int(result['grid']),
                'position': position,
                'points': float(result['points']),
                'status': result['status'],
                'weather': weather,
                'tire_strategy': tire_strategy,
                'gap_to_leader': simulate_gap(position),
                'fastest_lap_time': fastest_lap_time
            }
            data.append(row)

    return pd.DataFrame(data)

def add_rookie_driver(df):
    rookies = [
        # Kimi Antonelli - consistent midfield/top-10 finishes
        ("Kimi Antonelli", "Mercedes", 5, 6, 8.0, "Dry", "2025-03-02", 1),   # Bahrain
        ("Kimi Antonelli", "Mercedes", 6, 5, 10.0, "Dry", "2025-03-09", 2),  # Jeddah
        ("Kimi Antonelli", "Mercedes", 4, 4, 12.0, "Mixed", "2025-03-23", 3),# Australia
        ("Kimi Antonelli", "Mercedes", 3, 5, 10.0, "Dry", "2025-04-07", 4),  # Japan
        ("Kimi Antonelli", "Mercedes", 2, 6, 8.0, "Wet", "2025-04-21", 5),   # China

        # Oliver Bearman - strong Ferrari debut
        ("Oliver Bearman", "Haas F1 team", 8, 7, 6.0, "Dry", "2025-03-02", 1),
        ("Oliver Bearman", "Haas F1 team", 7, 6, 8.0, "Dry", "2025-03-09", 2),
        ("Oliver Bearman", "Haas F1 team", 6, 8, 4.0, "Dry", "2025-03-23", 3),
        ("Oliver Bearman", "Haas F1 team", 6, 7, 6.0, "Mixed", "2025-04-07", 4),
        ("Oliver Bearman", "Haas F1 team", 5, 6, 8.0, "Wet", "2025-04-21", 5),

        # Gabriel Bortoleto - backmarker performance
        ("Gabriel Bortoleto", "Sauber", 13, 11, 0.0, "Dry", "2025-03-02", 1),
        ("Gabriel Bortoleto", "Sauber", 14, 13, 0.0, "Dry", "2025-03-09", 2),
        ("Gabriel Bortoleto", "Sauber", 15, 14, 0.0, "Dry", "2025-03-23", 3),
        ("Gabriel Bortoleto", "Sauber", 12, 12, 0.0, "Mixed", "2025-04-07", 4),
        ("Gabriel Bortoleto", "Sauber", 13, 11, 0.0, "Wet", "2025-04-21", 5),

        # Jack Doohan - occasional points
        ("Jack Doohan", "Alpine", 10, 9, 2.0, "Dry", "2025-03-02", 1),
        ("Jack Doohan", "Alpine", 9, 10, 1.0, "Dry", "2025-03-09", 2),
        ("Jack Doohan", "Alpine", 8, 9, 2.0, "Dry", "2025-03-23", 3),
        ("Jack Doohan", "Alpine", 7, 8, 4.0, "Mixed", "2025-04-07", 4),
        ("Jack Doohan", "Alpine", 6, 10, 1.0, "Wet", "2025-04-21", 5),

        # Isack Hadjar - struggling RB rookie
        ("Isack Hadjar", "RB", 12, 12, 0.0, "Dry", "2025-03-02", 1),
        ("Isack Hadjar", "RB", 13, 14, 0.0, "Dry", "2025-03-09", 2),
        ("Isack Hadjar", "RB", 14, 13, 0.0, "Dry", "2025-03-23", 3),
        ("Isack Hadjar", "RB", 13, 12, 0.0, "Mixed", "2025-04-07", 4),
        ("Isack Hadjar", "RB", 12, 15, 0.0, "Wet", "2025-04-21", 5),

        # Liam Lawson - outperforming teammate
        ("Liam Lawson", "Red Bull", 11, 10, 1.0, "Dry", "2025-03-02", 1),
        ("Liam Lawson", "Red Bull", 10, 9, 2.0, "Dry", "2025-03-09", 2),
        ("Liam Lawson", "RB", 9, 11, 0.0, "Dry", "2025-03-23", 3),
        ("Liam Lawson", "RB", 8, 10, 1.0, "Mixed", "2025-04-07", 4),
        ("Liam Lawson", "RB", 7, 9, 2.0, "Wet", "2025-04-21", 5),
    ]

    rookie_rows = []
    for name, team, grid, pos, pts, weather, date, rnd in rookies:
        rookie_rows.append({
            'season': 2025,
            'round': rnd,
            'race_name': 'Simulated ' + team + ' GP',
            'circuit': 'Bahrain International Circuit',
            'date': date,
            'driver': name,
            'constructor': team,
            'grid': grid,
            'position': pos,
            'points': pts,
            'status': 'Finished',
            'weather': weather,
            'tire_strategy': simulate_tire_strategy(weather),
            'gap_to_leader': simulate_gap(pos),
            'fastest_lap_time': simulate_fastest_lap()
        })

    return pd.concat([df, pd.DataFrame(rookie_rows)], ignore_index=True)

if __name__ == "__main__":
    races = get_multiple_seasons_results(1950, 2024)
    df = races_to_dataframe(races)
    df = add_rookie_driver(df)

    print(df[df['season'] == 2025])
    os.makedirs("data", exist_ok=True)
    df.to_csv("data/f1_multi_year_results.csv", index=False)
    print("\n✅ Data saved to data/f1_multi_year_results.csv")
