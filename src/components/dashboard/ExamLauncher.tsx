"use client";

import React, { useState } from "react";
import { FileSpreadsheet, Play, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ExamLauncherProps {
  exams: Array<{
    id: string;
    title: string;
    subjectId: string;
    subjectName: string;
    grade: number;
    examType: string;
    semester: number;
    variant: string;
    durationMinutes: number;
    totalQuestions: number;
    maxScore: number;
  }>;
}

export function ExamLauncher({ exams }: ExamLauncherProps) {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const handleStartExam = (examTitle: string) => {
    toast.success(`İmtahan başladıldı: ${examTitle}`, {
      description: "Anti-cheat və vaxt sayğacı aktivdir. Uğurlar!",
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">BSQ & KSQ Simulyatoru</h3>
            <p className="text-[11px] text-zinc-400">Rəsmi dövlət standartlarına uyğun sınaqlar</p>
          </div>
        </div>
        <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-[10px]">
          Avtomatlaşdırılmış Qiymətləndirmə
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="flex flex-col justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/5 hover:border-purple-500/30"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant={exam.examType === "BSQ" ? "default" : "secondary"}
                  className="text-[10px] uppercase font-mono"
                >
                  {exam.examType} • Variant {exam.variant}
                </Badge>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <Clock className="h-3 w-3" />
                  <span>{exam.durationMinutes} dəq</span>
                </div>
              </div>

              <h4 className="text-xs font-semibold text-white line-clamp-1">{exam.title}</h4>
              <p className="text-[11px] text-zinc-400 mt-1">
                {exam.grade}-ci sinif • {exam.totalQuestions} sual • Maks: {exam.maxScore} bal
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> LaTeX & CoT İzahlı
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStartExam(exam.title)}
                className="h-7 text-xs px-2.5 gap-1.5 border-purple-500/30 hover:bg-purple-600 hover:text-white"
              >
                <Play className="h-3 w-3 fill-current" /> Başla
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
