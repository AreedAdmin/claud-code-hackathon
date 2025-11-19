import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Shuffle } from "lucide-react";
import ManualInputForm from "./ManualInputForm";
import RandomScenarioGenerator from "./RandomScenarioGenerator";
import { SimulationData } from "@/types/simulation";

interface InputPanelProps {
  onRunSimulation: (data: SimulationData) => void;
  isSimulating: boolean;
}

const InputPanel = ({ onRunSimulation, isSimulating }: InputPanelProps) => {
  const [activeTab, setActiveTab] = useState<"manual" | "random">("manual");
  const [formData, setFormData] = useState<SimulationData | null>(null);

  const handleSubmit = (data: SimulationData) => {
    setFormData(data);
    onRunSimulation(data);
  };

  return (
    <Card className="p-4 bg-card border-border h-fit sticky top-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-primary mb-2">Simulation Controls</h2>
        <p className="text-xs text-muted-foreground">
          Configure parameters or generate random scenarios
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "manual" | "random")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="manual" className="text-xs">Manual Input</TabsTrigger>
          <TabsTrigger value="random" className="text-xs">Random Gen</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <ManualInputForm onSubmit={handleSubmit} isSimulating={isSimulating} />
        </TabsContent>

        <TabsContent value="random" className="space-y-4">
          <RandomScenarioGenerator onSubmit={handleSubmit} isSimulating={isSimulating} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default InputPanel;
