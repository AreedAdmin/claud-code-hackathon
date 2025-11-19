import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Play } from "lucide-react";
import { SimulationData } from "@/types/simulation";

interface ManualInputFormProps {
  onSubmit: (data: SimulationData) => void;
  isSimulating: boolean;
}

const ManualInputForm = ({ onSubmit, isSimulating }: ManualInputFormProps) => {
  const [formData, setFormData] = useState<SimulationData>({
    reactor_age_years: 15,
    reactor_type_code: "PWR",
    reactor_nominal_power_mw: 1000,
    load_factor_pct: 85,
    core_temp_c: 290,
    coolant_pressure_bar: 155,
    neutron_flux: 3.5,
    control_rod_position_pct: 45,
    coolant_flow_rate: 18000,
    maintenance_score: 7.5,
    days_since_maintenance: 45,
    backup_generator_health: 8.0,
    country: "France",
    ambient_temp_c: 22,
    population_within_30km: 150000,
    env_risk_index: 3.2,
    weather_severity_index: 2.5,
    seismic_activity_index: 1.2,
    co2_avoided_tons_per_hour: 800,
    radiation_inside_uSv: 0.5,
    radiation_outside_uSv: 0.1,
    sensor_anomaly_flag: false,
    cyber_attack_score: 1.5,
    grid_demand_index: 75,
    market_price_eur_mwh: 65,
    staff_fatigue_index: 3.5,
    public_anxiety_index: 2.8,
    social_media_rumour_index: 2.2,
    regulator_scrutiny_score: 5.5,
    avalon_raw_risk_score: 3.5,
    avalon_learned_reward_score: 6.2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof SimulationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Accordion type="multiple" className="w-full" defaultValue={["plant"]}>
        {/* Plant Core & Operation */}
        <AccordionItem value="plant" className="border-border">
          <AccordionTrigger className="text-sm text-primary hover:text-primary/80">
            Plant Core & Operation
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Reactor Type</Label>
              <Select value={formData.reactor_type_code} onValueChange={(v) => updateField("reactor_type_code", v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PWR">PWR (Pressurized Water)</SelectItem>
                  <SelectItem value="BWR">BWR (Boiling Water)</SelectItem>
                  <SelectItem value="PHWR">PHWR (Pressurized Heavy Water)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Core Temperature (°C)</span>
                <span className="text-primary font-mono">{formData.core_temp_c}</span>
              </Label>
              <Slider
                value={[formData.core_temp_c]}
                onValueChange={(v) => updateField("core_temp_c", v[0])}
                min={250}
                max={350}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Load Factor (%)</span>
                <span className="text-primary font-mono">{formData.load_factor_pct}</span>
              </Label>
              <Slider
                value={[formData.load_factor_pct]}
                onValueChange={(v) => updateField("load_factor_pct", v[0])}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Maintenance Score (0-10)</span>
                <span className="text-primary font-mono">{formData.maintenance_score.toFixed(1)}</span>
              </Label>
              <Slider
                value={[formData.maintenance_score]}
                onValueChange={(v) => updateField("maintenance_score", v[0])}
                min={0}
                max={10}
                step={0.1}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Environmental Factors */}
        <AccordionItem value="environmental" className="border-border">
          <AccordionTrigger className="text-sm text-primary hover:text-primary/80">
            Environmental Factors
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Seismic Activity Index</span>
                <span className="text-primary font-mono">{formData.seismic_activity_index.toFixed(1)}</span>
              </Label>
              <Slider
                value={[formData.seismic_activity_index]}
                onValueChange={(v) => updateField("seismic_activity_index", v[0])}
                min={0}
                max={10}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Weather Severity</span>
                <span className="text-primary font-mono">{formData.weather_severity_index.toFixed(1)}</span>
              </Label>
              <Slider
                value={[formData.weather_severity_index]}
                onValueChange={(v) => updateField("weather_severity_index", v[0])}
                min={0}
                max={10}
                step={0.1}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Safety & Security */}
        <AccordionItem value="safety" className="border-border">
          <AccordionTrigger className="text-sm text-primary hover:text-primary/80">
            Safety & Security
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Sensor Anomaly Detected</Label>
              <Switch
                checked={formData.sensor_anomaly_flag}
                onCheckedChange={(v) => updateField("sensor_anomaly_flag", v)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Cyber Attack Score</span>
                <span className="text-primary font-mono">{formData.cyber_attack_score.toFixed(1)}</span>
              </Label>
              <Slider
                value={[formData.cyber_attack_score]}
                onValueChange={(v) => updateField("cyber_attack_score", v[0])}
                min={0}
                max={10}
                step={0.1}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
        disabled={isSimulating}
      >
        <Play className="mr-2 h-4 w-4" />
        {isSimulating ? "Simulating..." : "Run Simulation"}
      </Button>
    </form>
  );
};

export default ManualInputForm;
