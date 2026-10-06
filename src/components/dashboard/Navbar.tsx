"use client";

import React from "react";
import { Sparkles, Trophy, Bell, Search, GraduationCap, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  xpBalance: number;
  streakDays: number;
  onOpenShop: () => void;
}

export function Navbar({ xpBalance, streakDays, onOpenShop }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white sm:text-lg">TDV E-School</span>
              <Badge variant="default" className="text-[10px] uppercase font-mono tracking-wider">
                PRO 2.0
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Təhsil, İmtahan və AI Analitika Portalı
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center max-w-sm w-full mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Fənn, dərs və ya imtahan axtarın..."
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
        </div>

        {/* Gamification / User Badges */}
        <div className="flex items-center gap-3">
          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
            <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{streakDays} Gün</span>
          </div>

          {/* XP Balance Button */}
          <Button
            variant="glass"
            size="sm"
            onClick={onOpenShop}
            className="flex items-center gap-2 border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span className="font-mono font-bold">{xpBalance} XP</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-500 ring-2 ring-zinc-950" />
          </Button>

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-white/10 text-sm font-bold text-white">
            EA
          </div>
        </div>
      </div>
    </header>
  );
}
