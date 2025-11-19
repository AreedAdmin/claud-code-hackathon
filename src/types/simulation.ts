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
}

export type RiskProfile = "low" | "moderate" | "high" | "critical";
