import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, Loader2 } from "lucide-react";
import { SimulationData, PredictionResult } from "@/types/simulation";
import { cn } from "@/lib/utils";

interface PlantVisualizationProps {
  predictionResult: PredictionResult | null;
  simulationData: SimulationData | null;
  isSimulating: boolean;
}

const PlantVisualization = ({ predictionResult, simulationData, isSimulating }: PlantVisualizationProps) => {
  const getIncidentColor = () => {
    if (!predictionResult) return "border-muted";
    if (predictionResult.incident_occurred) return "border-destructive shadow-[0_0_30px_hsl(var(--destructive)/0.5)]";
    return "border-success shadow-[0_0_20px_hsl(var(--success)/0.3)]";
  };

  const getRiskColor = (level: number) => {
    const colors = ["success", "primary", "warning", "destructive"];
    return colors[level] || "muted";
  };

  return (
    <Card className={cn(
      "p-6 bg-card border-2 transition-all duration-500 h-[600px] relative overflow-hidden",
      getIncidentColor()
    )}>
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Reactor Core Visualization
          </h2>
          {predictionResult && (
            <Badge 
              variant={predictionResult.incident_occurred ? "destructive" : "default"}
              className={cn(
                "font-mono animate-pulse-glow",
                predictionResult.incident_occurred && "animate-alert-flash"
              )}
            >
              {predictionResult.incident_occurred ? "INCIDENT DETECTED" : "NOMINAL OPERATION"}
            </Badge>
          )}
        </div>

        {isSimulating && (
          <div className="flex flex-col items-center justify-center h-[500px] space-y-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Running simulation...</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-8 bg-primary rounded animate-data-flow"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {!isSimulating && !predictionResult && (
          <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
            <div className="relative">
              <Activity className="h-24 w-24 text-muted-foreground/20" />
              <div className="absolute inset-0 blur-xl bg-primary/10" />
            </div>
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground">Awaiting Simulation Input</p>
              <p className="text-sm text-muted-foreground/60">
                Configure parameters and run simulation to visualize plant status
              </p>
            </div>
          </div>
        )}

        {!isSimulating && predictionResult && (
          <div className="space-y-6 animate-slide-in">
            {/* Reactor Core Schematic */}
            <div className="relative h-[350px] bg-background/50 rounded-lg border border-border p-4 overflow-hidden">
              {/* Core Reactor Container */}
              <div className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 transition-all duration-700",
                predictionResult.incident_occurred 
                  ? "border-destructive bg-destructive/20 shadow-[0_0_60px_hsl(var(--destructive)/0.6)] animate-pulse-glow" 
                  : "border-primary bg-primary/10 shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
              )}>
                <div className={cn(
                  "absolute inset-4 rounded-full flex items-center justify-center font-mono text-2xl font-bold transition-colors",
                  predictionResult.incident_occurred ? "text-destructive" : "text-primary"
                )}>
                  CORE
                </div>
                
                {/* Control Rods */}
                {[0, 90, 180, 270].map((deg, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1 h-20 bg-accent origin-bottom"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${deg}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Containment Building */}
              <div className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-dashed transition-colors",
                predictionResult.incident_occurred ? "border-destructive/40" : "border-primary/40"
              )} />

              {/* Incident Indicators */}
              {predictionResult.incident_occurred && predictionResult.incident_type && (
                <>
                  <div className="absolute top-4 left-4 right-4 text-center">
                    <Badge variant="destructive" className="text-xs animate-alert-flash">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {predictionResult.incident_type}
                    </Badge>
                  </div>
                  
                  {/* Radiation Cloud Effect */}
                  {predictionResult.incident_type.includes("Radiation") && (
                    <div className="absolute inset-0 bg-destructive/10 animate-pulse rounded-lg" />
                  )}

                  {/* Heat Effect */}
                  {predictionResult.incident_type.includes("Overheat") && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-destructive/20 blur-2xl animate-pulse" />
                  )}
                </>
              )}

              {/* System Status Labels */}
              <div className="absolute bottom-4 left-4 space-y-1">
                <div className="text-xs font-mono">
                  <span className="text-muted-foreground">TEMP: </span>
                  <span className={simulationData && simulationData.core_temp_c > 320 ? "text-destructive" : "text-success"}>
                    {simulationData?.core_temp_c}°C
                  </span>
                </div>
                <div className="text-xs font-mono">
                  <span className="text-muted-foreground">PRESS: </span>
                  <span className={simulationData && simulationData.coolant_pressure_bar > 180 ? "text-warning" : "text-success"}>
                    {simulationData?.coolant_pressure_bar} bar
                  </span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4">
                <Badge variant="outline" className={`bg-${getRiskColor(predictionResult.true_risk_level)}/10`}>
                  Risk Level: {predictionResult.true_risk_level}
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className={cn(
                "p-3 border transition-colors",
                predictionResult.avalon_shutdown_recommendation ? "border-warning bg-warning/5" : "border-border"
              )}>
                <p className="text-xs text-muted-foreground mb-1">Shutdown Rec.</p>
                <p className="text-sm font-semibold">
                  {predictionResult.avalon_shutdown_recommendation ? "RECOMMENDED" : "Not Required"}
                </p>
              </Card>
              
              <Card className={cn(
                "p-3 border transition-colors",
                predictionResult.avalon_evac_recommendation ? "border-destructive bg-destructive/5" : "border-border"
              )}>
                <p className="text-xs text-muted-foreground mb-1">Evacuation</p>
                <p className="text-sm font-semibold">
                  {predictionResult.avalon_evac_recommendation ? "REQUIRED" : "Not Required"}
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PlantVisualization;
