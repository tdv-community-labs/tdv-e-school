"use client";

import React from "react";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Cpu,
  Globe,
  Landmark,
  BookOpen,
  Languages,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const iconMap: Record<string, any> = {
  calculator: Calculator,
  atom: Atom,
  'flask-conical': FlaskConical,
  dna: Dna,
  cpu: Cpu,
  globe: Globe,
  landmark: Landmark,
  'book-open': BookOpen,
  languages: Languages,
};

interface SubjectBentoProps {
  subjects: Array<{
    id: string;
    name: string;
    short_name?: string;
    icon?: string;
    color?: string;
    accent_color?: string;
    description?: string;
    total_lessons?: number;
    total_exams?: number;
  }>;
  onSelectSubject: (id: string) => void;
}

export function SubjectBento({ subjects, onSelectSubject }: SubjectBentoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Fənlər & Dərs Proqramı</h2>
          <p className="text-xs text-zinc-400">
            6-11-ci siniflər üzrə rəsmi kurikulum dərsləri və summativ qiymətləndirmə materialları
          </p>
        </div>
        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
          {subjects.length} Fənn
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((s, index) => {
          const Icon = iconMap[s.icon || "book-open"] || BookOpen;
          const progressValue = 65 + (index * 7) % 35;

          return (
            <div
              key={s.id}
              onClick={() => onSelectSubject(s.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:scale-[1.01]"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 shadow-inner"
                  style={{ backgroundColor: `${s.accent_color || "#a855f7"}15` }}
                >
                  <Icon className="h-6 w-6" style={{ color: s.accent_color || "#a855f7" }} />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-white/5 border border-white/10 text-[10px] font-mono"
                >
                  {s.short_name || s.name}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                {s.name}
              </h3>
              <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {s.description}
              </p>

              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Mənimsəmə dərəcəsi</span>
                  <span className="font-mono font-semibold text-white">{progressValue}%</span>
                </div>
                <Progress value={progressValue} />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-zinc-500">
                <span>{s.total_lessons || 30} Dərs konspekti</span>
                <span>{s.total_exams || 12} BSQ/KSQ</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
