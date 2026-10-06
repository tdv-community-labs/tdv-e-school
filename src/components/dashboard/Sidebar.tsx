"use client";

import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileSpreadsheet,
  Trophy,
  Bot,
  ShoppingBag,
  LineChart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "İdarəetmə Paneli", icon: LayoutDashboard },
    { id: "subjects", label: "Fənlər & Dərslər", icon: BookOpen },
    { id: "exams", label: "BSQ / KSQ İmtahanlar", icon: FileSpreadsheet },
    { id: "analytics", label: "Akademik Analitika", icon: LineChart },
    { id: "leaderboard", label: "Liderlər Cədvəli", icon: Trophy },
    { id: "tutor", label: "AI Təhsil Müəllimi", icon: Bot },
    { id: "shop", label: "XP Mağazası", icon: ShoppingBag },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-zinc-950/60 p-4 backdrop-blur-xl">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          Əsas Modullar
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-purple-600/15 text-purple-400 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-purple-400" : "text-zinc-400")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
          <div className="font-semibold text-white mb-1">Sinif: 10-cu Sinif (BTL)</div>
          <div className="text-[11px] text-zinc-500">I Yarımil Qiymətləndirməsi</div>
        </div>
      </div>
    </aside>
  );
}
