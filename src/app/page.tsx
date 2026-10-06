"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SubjectBento } from "@/components/dashboard/SubjectBento";
import { AcademicAnalytics } from "@/components/dashboard/AcademicAnalytics";
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget";
import { ExamLauncher } from "@/components/dashboard/ExamLauncher";
import { AITutorWidget } from "@/components/dashboard/AITutorWidget";
import { XPShopModal } from "@/components/dashboard/XPShopModal";
import { Particles } from "@/components/magicui/particles";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, GraduationCap, Flame, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [xpBalance, setXpBalance] = useState(2640);
  const [streakDays, setStreakDays] = useState(14);

  // TanStack React Query Fetchers
  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await fetch("/api/subjects");
      return res.json();
    },
  });

  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      return res.json();
    },
  });

  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard");
      return res.json();
    },
  });

  const { data: examsData, isLoading: isLoadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const res = await fetch("/api/exams");
      return res.json();
    },
  });

  const handlePurchase = (cost: number) => {
    setXpBalance((prev) => Math.max(0, prev - cost));
  };

  const handleSelectSubject = (id: string) => {
    toast.info(`Fənn seçildi: ${id.toUpperCase()}`, {
      description: "Dərslər və nəzəriyyə konspektləri yüklənir...",
    });
  };

  const subjects = subjectsData?.data || [];
  const analytics = analyticsData?.data || {
    student_name: "Elmir Əliyev",
    overall_average: 91.4,
    exams_completed: 18,
    study_hours: 48.5,
    xp_balance: 2640,
    subject_breakdown: [],
  };
  const leaderboard = leaderboardData?.data || [];
  const exams = examsData?.data || [];

  return (
    <div className="relative min-h-screen bg-[#050505] text-zinc-100 flex flex-col">
      {/* Background Particles */}
      <Particles quantity={25} color="#a855f7" className="opacity-40" />

      {/* Top Navbar */}
      <Navbar
        xpBalance={xpBalance}
        streakDays={streakDays}
        onOpenShop={() => setIsShopOpen(true)}
      />

      <div className="flex flex-1 relative z-10">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Hero Banner with Glassmorphism */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-purple-950/40 via-zinc-900/60 to-indigo-950/40 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>2025-2026 Tədris İli • Ağıllı Təhsil Portalı</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Xoş gəldiniz, {analytics.student_name}! 🚀
              </h1>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                Bu gün qarşınızda 2 yeni BSQ sınağı və 15 dəqiqəlik Riyaziyyat dərsi var.
                Dərsləri tamamlayın, reytinqdə irəliləyin və XP qazanın.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => setActiveTab("exams")}
                  className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-600/30"
                >
                  Sınaqlara Başla <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsShopOpen(true)}
                  className="border-white/10 bg-white/5 hover:bg-white/10 rounded-xl"
                >
                  Mükafat Mağazası
                </Button>
              </div>
            </div>
            {/* Visual Glow */}
            <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
          </div>

          {/* Conditional Content based on activeTab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Academic Analytics Section */}
              {isLoadingAnalytics ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-28" />
                  ))}
                </div>
              ) : (
                <AcademicAnalytics analytics={analytics} />
              )}

              {/* Subject Grid Bento */}
              {isLoadingSubjects ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-44" />
                  ))}
                </div>
              ) : (
                <SubjectBento
                  subjects={subjects}
                  onSelectSubject={handleSelectSubject}
                />
              )}

              {/* Dual Widgets: Exam Launcher & Live Leaderboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoadingExams ? (
                  <Skeleton className="h-72" />
                ) : (
                  <ExamLauncher exams={exams} />
                )}

                {isLoadingLeaderboard ? (
                  <Skeleton className="h-72" />
                ) : (
                  <LeaderboardWidget entries={leaderboard} />
                )}
              </div>

              {/* Bottom Row: AI Tutor Assistant */}
              <div className="grid grid-cols-1 gap-6">
                <AITutorWidget />
              </div>
            </div>
          )}

          {activeTab === "subjects" && (
            <div className="space-y-6">
              {isLoadingSubjects ? (
                <Skeleton className="h-96" />
              ) : (
                <SubjectBento
                  subjects={subjects}
                  onSelectSubject={handleSelectSubject}
                />
              )}
            </div>
          )}

          {activeTab === "exams" && (
            <div className="space-y-6">
              {isLoadingExams ? (
                <Skeleton className="h-96" />
              ) : (
                <ExamLauncher exams={exams} />
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              {isLoadingAnalytics ? (
                <Skeleton className="h-96" />
              ) : (
                <AcademicAnalytics analytics={analytics} />
              )}
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="space-y-6">
              {isLoadingLeaderboard ? (
                <Skeleton className="h-96" />
              ) : (
                <LeaderboardWidget entries={leaderboard} />
              )}
            </div>
          )}

          {activeTab === "tutor" && (
            <div className="space-y-6">
              <AITutorWidget />
            </div>
          )}

          {activeTab === "shop" && (
            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 text-center backdrop-blur-xl">
              <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white">XP Mağazası Aktivdir</h2>
              <p className="text-sm text-zinc-400 max-w-md mx-auto mt-1 mb-6">
                Topladığınız xallarla mükafatları əldə etmək üçün pəncərəni açın.
              </p>
              <Button onClick={() => setIsShopOpen(true)}>
                Mağazanı Aç ({xpBalance} XP)
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* XP Shop Modal */}
      <XPShopModal
        open={isShopOpen}
        onOpenChange={setIsShopOpen}
        xpBalance={xpBalance}
        onPurchase={handlePurchase}
      />
    </div>
  );
}
