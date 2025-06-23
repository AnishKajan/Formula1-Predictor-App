// Type definitions for F1 Race Predictor

export interface Team {
  drivers: string[];
  car: string;
  principal: string;
  engine: string;
  founded: number;
  championships: number;
  base: string;
  color: string;
}

export interface Circuit {
  name: string;
  country: string;
  round: number;
  date: string;
}

export interface Prediction {
  driver: string;
  constructor: string;
  grid: number;
  predicted_position: number;
  podium_chance: boolean; // CHANGED: was number, now boolean
  points_chance: boolean; // CHANGED: was number, now boolean
  points_earned: number; // ADDED: new property for actual points
  win_probability: number;
  tire_strategy: string;
}

export interface PredictionResult {
  success: boolean;
  predictions: Prediction[];
  race_info: {
    circuit: string;
    weather: string;
    temperature: number;
    track_temp: number;
    humidity: number; // ADDED: missing property
    wind_speed: number; // ADDED: missing property
  };
}

export interface DriverStats {
  wins: number;
  podiums: number;
  poles: number;
  championships: number;
  debut: number; // ADDED: missing property
  age: number; // ADDED: missing property
  country: string; // ADDED: missing property
  image: string; // ADDED: missing property
}

export interface ConstructorStanding {
  position: number;
  team: string;
  points: number;
  wins: number;
}

export type TabType = 'home' | 'current-season' | 'prediction' | 'fantasy';