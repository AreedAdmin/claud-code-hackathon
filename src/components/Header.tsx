import { Activity, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="h-8 w-8 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 blur-md bg-primary/30 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                Core Clarity
              </h1>
              <p className="text-sm text-muted-foreground">
                Advanced Risk Assessment & Simulation Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-2">
              <Zap className="h-3 w-3" />
              ML Model: Online
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 gap-2">
              <Activity className="h-3 w-3 animate-pulse" />
              Simulation: Active
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
