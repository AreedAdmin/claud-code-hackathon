import { useState } from "react";
import Header from "@/components/Header";
import InputPanel from "@/components/InputPanel";
import PlantVisualization from "@/components/PlantVisualization";
import PredictionPanel from "@/components/PredictionPanel";
import { SimulationData, PredictionResult } from "@/types/simulation";
import { getPrediction } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const handleRunSimulation = async (data: SimulationData) => {
    setIsSimulating(true);
    setSimulationData(data);

    try {
      // Call the real backend API
      const prediction = await getPrediction(data);
      setPredictionResult(prediction);

      toast({
        title: "Prediction Complete",
        description: "Risk analysis has been generated successfully.",
      });
    } catch (error) {
      console.error("Prediction error:", error);

      // Fallback to mock data if backend is not available
      toast({
        title: "Backend Unavailable",
        description: "Using mock data. Please ensure the backend server is running.",
        variant: "destructive",
      });

      // Mock prediction result as fallback
      const mockPrediction: PredictionResult = {
        incident_occurred: Math.random() > 0.5,
        true_risk_level: Math.floor(Math.random() * 4),
        avalon_evac_recommendation: Math.random() > 0.7,
        avalon_shutdown_recommendation: Math.random() > 0.6,
        human_override: Math.random() > 0.8,
        top_contributors: [
          { feature: "core_temp_c", impact: 0.92, value: data.core_temp_c },
          { feature: "coolant_pressure_bar", impact: 0.87, value: data.coolant_pressure_bar },
          { feature: "maintenance_score", impact: 0.73, value: data.maintenance_score },
        ],
        incident_type: data.core_temp_c > 320 ? "Core Overheat" : "Coolant System Failure",
      };

      setPredictionResult(mockPrediction);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Panel - Input Controls */}
          <div className="lg:col-span-3">
            <InputPanel onRunSimulation={handleRunSimulation} isSimulating={isSimulating} />
          </div>

          {/* Center Panel - Plant Visualization */}
          <div className="lg:col-span-6">
            <PlantVisualization 
              predictionResult={predictionResult}
              simulationData={simulationData}
              isSimulating={isSimulating}
            />
          </div>

          {/* Right Panel - Predictions & Metrics */}
          <div className="lg:col-span-3">
            <PredictionPanel 
              predictionResult={predictionResult}
              simulationData={simulationData}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
