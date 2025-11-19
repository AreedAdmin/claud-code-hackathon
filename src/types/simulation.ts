export interface SimulationData {
  // Plant Core & Operation
  reactor_age_years: number;
  reactor_type_code: string;
  reactor_nominal_power_mw: number;
  load_factor_pct: number;
  core_temp_c: number;
  coolant_pressure_bar: number;
  neutron_flux: number;
  control_rod_position_pct: number;
  coolant_flow_rate: number;
  maintenance_score: number;
  days_since_maintenance: number;
  backup_generator_health: number;

  // Environmental & External
  country: string;
  ambient_temp_c: number;
  population_within_30km: number;
  env_risk_index: number;
  weather_severity_index: number;
  seismic_activity_index: number;
  co2_avoided_tons_per_hour: number;

  // Safety & Security
  radiation_inside_uSv: number;
  radiation_outside_uSv: number;
  sensor_anomaly_flag: boolean;
  cyber_attack_score: number;

  // Socio-Economic & Regulatory
  grid_demand_index: number;
  market_price_eur_mwh: number;
  staff_fatigue_index: number;
  public_anxiety_index: number;
  social_media_rumour_index: number;
  regulator_scrutiny_score: number;

  // Avalon System
  avalon_raw_risk_score: number;
  avalon_learned_reward_score: number;
}

export interface PredictionResult {
  incident_occurred: boolean;
  incident_probability?: number;
  confidence?: number;
  true_risk_level: number; // 0-3
  avalon_evac_recommendation: boolean;
  avalon_shutdown_recommendation: boolean;
  human_override: boolean;
  top_contributors: {
    feature: string;
    impact: number;
    value: number | string | boolean;
  }[];
  incident_type?: string;
  // Model verification metadata - confirms this is from real ML model
  model_metadata?: {
    model_type: string;
    model_source: string;
    model_path?: string;
    model_url?: string;
    n_features: number | null;
    using_scaler: boolean;
    using_feature_names: boolean;
    is_real_model: boolean;
  };
}

export type RiskProfile = "low" | "moderate" | "high" | "critical";
