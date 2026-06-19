"use client";
import { PipelineKanban } from "@/presentation/components/dashboard/PipelineKanban";

export default function PipelinePage() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <PipelineKanban />
    </div>
  );
}
