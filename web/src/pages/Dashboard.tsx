import { DailyBriefing } from "@/components/dashboard/DailyBriefing";
import { MetricsRow } from "@/components/dashboard/MetricsRow";
import { PipelineKanban } from "@/components/dashboard/PipelineKanban";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { MiEspacio } from "@/components/dashboard/MiEspacio";

export function Dashboard() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-6">
      <DailyBriefing />

      {/* Main expansivo + rail de alertas (split 75/25 en desktop) */}
      <div className="grid gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-9">
          <MetricsRow />
          <PipelineKanban />
          <MiEspacio />
        </div>
        <div className="xl:col-span-3">
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
}
