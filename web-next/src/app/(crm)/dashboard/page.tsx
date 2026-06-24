"use client";
import { MetricsRow } from "@/presentation/components/dashboard/MetricsRow";
import { PipelineKanban } from "@/presentation/components/dashboard/PipelineKanban";
import { MiEspacio } from "@/presentation/components/dashboard/MiEspacio";
import { AlertsPanel } from "@/presentation/components/dashboard/AlertsPanel";
import { DailyBriefingCard } from "@/presentation/components/dashboard/DailyBriefing";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-5">
      <DailyBriefingCard />
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
