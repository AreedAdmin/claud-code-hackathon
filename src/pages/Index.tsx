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
      // Call the REAL backend API - NO MOCK DATA
      const prediction = await getPrediction(data);
      setPredictionResult(prediction);

      toast({
        title: "✓ Real Model Prediction Complete",
        description: `Analysis from trained LogisticRegression model${
          prediction.model_metadata?.using_scaler && prediction.model_metadata?.using_feature_names
            ? ' (with scaler & correct feature order)'
            : ' (WARNING: missing scaler or feature names)'
        }`,
      });
    } catch (error) {
      console.error("Prediction error:", error);

      // NO FALLBACK - Show error instead
      toast({
        title: "Backend Connection Failed",
        description: `Cannot connect to ML model API. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });

      // Clear any previous results to make it clear the prediction failed
      setPredictionResult(null);
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
