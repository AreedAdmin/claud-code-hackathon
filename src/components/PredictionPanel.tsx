import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, TrendingUp, Shield } from "lucide-react";
import { SimulationData, PredictionResult } from "@/types/simulation";

interface PredictionPanelProps {
  predictionResult: PredictionResult | null;
  simulationData: SimulationData | null;
}

const PredictionPanel = ({ predictionResult, simulationData }: PredictionPanelProps) => {
  if (!predictionResult || !simulationData) {
    return (
      <Card className="p-4 bg-card border-border h-fit">
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No prediction data available
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Run a simulation to see results
          </p>
        </div>
      </Card>
    );
  }

  const riskLabels = ["LOW", "MODERATE", "HIGH", "CRITICAL"];
  const riskColors = ["success", "primary", "warning", "destructive"];

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Prediction Summary
        </h3>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Risk Level</span>
              <Badge 
                variant="outline" 
                className={`bg-${riskColors[predictionResult.true_risk_level]}/10 border-${riskColors[predictionResult.true_risk_level]}/30`}
              >
                {riskLabels[predictionResult.true_risk_level]}
              </Badge>
            </div>
            <Progress 
              value={(predictionResult.true_risk_level + 1) * 25} 
              className={`bg-${riskColors[predictionResult.true_risk_level]}/20`}
            />
          </div>

          {predictionResult.human_override && (
            <Badge variant="outline" className="w-full justify-center bg-warning/10 text-warning border-warning/30">
              Human Override Detected
            </Badge>
          )}
        </div>
      </Card>

      {/* Top Contributors */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Top Risk Contributors
        </h3>

        <div className="space-y-3">
          {predictionResult.top_contributors.map((contributor, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-muted-foreground">
                  {contributor.feature}
                </span>
                <span className="text-xs font-bold text-primary">
                  {(contributor.impact * 100).toFixed(0)}%
                </span>
              </div>
              <Progress 
                value={contributor.impact * 100} 
                className="h-1.5 bg-muted"
              />
              <span className="text-xs text-muted-foreground/60">
                Value: {typeof contributor.value === 'number' 
                  ? contributor.value.toFixed(2) 
                  : contributor.value.toString()}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Parameters */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-sm font-semibold text-primary mb-3">
          Parameter Readings
        </h3>

        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {Object.entries(simulationData).map(([key, value]) => {
              const isHighRisk = 
                (key === "core_temp_c" && typeof value === 'number' && value > 320) ||
                (key === "coolant_pressure_bar" && typeof value === 'number' && value > 180) ||
                (key === "cyber_attack_score" && typeof value === 'number' && value > 7) ||
                (key === "seismic_activity_index" && typeof value === 'number' && value > 7);

              return (
                <div 
                  key={key} 
                  className={`flex justify-between items-center py-1.5 px-2 rounded text-xs ${
                    isHighRisk ? "bg-destructive/10" : ""
                  }`}
                >
                  <span className="text-muted-foreground font-mono">{key}</span>
                  <span className={`font-semibold ${isHighRisk ? "text-destructive" : "text-foreground"}`}>
                    {typeof value === 'boolean' 
                      ? (value ? "Yes" : "No")
                      : typeof value === 'number'
                      ? value.toFixed(2)
                      : value}
                  </span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default PredictionPanel;
