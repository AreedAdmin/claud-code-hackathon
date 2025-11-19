import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shuffle } from "lucide-react";
import { SimulationData, RiskProfile } from "@/types/simulation";

interface RandomScenarioGeneratorProps {
  onSubmit: (data: SimulationData) => void;
  isSimulating: boolean;
}

const RandomScenarioGenerator = ({ onSubmit, isSimulating }: RandomScenarioGeneratorProps) => {
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("moderate");

  const generateRandomScenario = () => {
    const riskMultipliers = {
      low: { temp: 0.8, pressure: 0.85, risk: 0.7 },
      moderate: { temp: 1.0, pressure: 1.0, risk: 1.0 },
      high: { temp: 1.15, pressure: 1.15, risk: 1.3 },
      critical: { temp: 1.3, pressure: 1.3, risk: 1.6 },
    };

    const multiplier = riskMultipliers[riskProfile];

    const randomData: SimulationData = {
      reactor_age_years: Math.floor(Math.random() * 40) + 5,
      reactor_type_code: ["PWR", "BWR", "PHWR"][Math.floor(Math.random() * 3)],
      reactor_nominal_power_mw: Math.floor(Math.random() * 2000) + 500,
      load_factor_pct: Math.floor(Math.random() * 40) + 60,
      core_temp_c: Math.floor((Math.random() * 80 + 270) * multiplier.temp),
      coolant_pressure_bar: Math.floor((Math.random() * 50 + 140) * multiplier.pressure),
      neutron_flux: Math.random() * 5 + 2,
      control_rod_position_pct: Math.floor(Math.random() * 100),
      coolant_flow_rate: Math.floor(Math.random() * 10000) + 15000,
      maintenance_score: Math.random() * 10,
      days_since_maintenance: Math.floor(Math.random() * 180),
      backup_generator_health: Math.random() * 10,
      country: ["France", "USA", "Japan", "Germany", "China"][Math.floor(Math.random() * 5)],
      ambient_temp_c: Math.floor(Math.random() * 40) - 10,
      population_within_30km: Math.floor(Math.random() * 500000),
      env_risk_index: Math.random() * 10 * multiplier.risk,
      weather_severity_index: Math.random() * 10 * multiplier.risk,
      seismic_activity_index: Math.random() * 10 * multiplier.risk,
      co2_avoided_tons_per_hour: Math.floor(Math.random() * 1000),
      radiation_inside_uSv: Math.random() * 2,
      radiation_outside_uSv: Math.random() * 0.5,
      sensor_anomaly_flag: Math.random() > 0.7,
      cyber_attack_score: Math.random() * 10 * multiplier.risk,
      grid_demand_index: Math.floor(Math.random() * 100),
      market_price_eur_mwh: Math.floor(Math.random() * 100) + 30,
      staff_fatigue_index: Math.random() * 10,
      public_anxiety_index: Math.random() * 10 * multiplier.risk,
      social_media_rumour_index: Math.random() * 10 * multiplier.risk,
      regulator_scrutiny_score: Math.random() * 10,
      avalon_raw_risk_score: Math.random() * 10 * multiplier.risk,
      avalon_learned_reward_score: Math.random() * 10,
    };

    onSubmit(randomData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Risk Profile</Label>
        <RadioGroup value={riskProfile} onValueChange={(v) => setRiskProfile(v as RiskProfile)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" className="border-success data-[state=checked]:bg-success" />
            <Label htmlFor="low" className="text-xs cursor-pointer">Low Risk</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="moderate" className="border-primary data-[state=checked]:bg-primary" />
            <Label htmlFor="moderate" className="text-xs cursor-pointer">Moderate Risk</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" className="border-warning data-[state=checked]:bg-warning" />
            <Label htmlFor="high" className="text-xs cursor-pointer">High Risk</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="critical" id="critical" className="border-destructive data-[state=checked]:bg-destructive" />
            <Label htmlFor="critical" className="text-xs cursor-pointer">Critical Incident</Label>
          </div>
        </RadioGroup>
      </div>

      <Button 
        onClick={generateRandomScenario}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        disabled={isSimulating}
      >
        <Shuffle className="mr-2 h-4 w-4" />
        Generate Random Scenario
      </Button>

      <p className="text-xs text-muted-foreground">
        Random scenarios are generated based on the selected risk profile, automatically populating all 37 features.
      </p>
    </div>
  );
};

export default RandomScenarioGenerator;
