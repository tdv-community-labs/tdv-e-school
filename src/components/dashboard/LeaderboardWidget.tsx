"use client";

import React from "react";
import { Trophy, Medal, Flame, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeaderboardWidgetProps {
  entries: Array<{
    id: string;
    name: string;
    rank: number;
    avatar?: string;
    school_grade: number;
    points: number;
    wins: number;
    win_rate: number;
    badge?: string;
  }>;
}

export function LeaderboardWidget({ entries }: LeaderboardWidgetProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return <span className="font-mono text-xs font-bold text-zinc-500">#{rank}</span>;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Canlı Liderlər Cədvəli</h3>
            <p className="text-[11px] text-zinc-400">Ümumrespublika bilik və PvP reytinqi</p>
          </div>
        </div>
        <Badge variant="outline" className="border-amber-500/30 text-amber-300 text-[10px]">
          Həftəlik Turnir
        </Badge>
      </div>

      <div className="space-y-2.5">
        {entries.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/5 hover:border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex w-6 items-center justify-center">
                {getRankBadge(student.rank)}
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-lg">
                {student.avatar || "🎓"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{student.name}</span>
                  {student.badge && (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-white/5">
                      {student.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                  <span>{student.school_grade}-ci sinif</span>
                  <span>•</span>
                  <span>{student.wins} qələbə</span>
                  <span>•</span>
                  <span className="text-emerald-400">{student.win_rate}% Winrate</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300">
              <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>{student.points} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
