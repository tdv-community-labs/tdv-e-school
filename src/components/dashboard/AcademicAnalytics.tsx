"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrendingUp, Award, Clock, BookCheck } from "lucide-react";

interface AcademicAnalyticsProps {
  analytics: {
    student_name: string;
    overall_average: number;
    exams_completed: number;
    study_hours: number;
    xp_balance: number;
    subject_breakdown: Array<{
      subject: string;
      score: number;
      progress: number;
      color: string;
    }>;
  };
}

export function AcademicAnalytics({ analytics }: AcademicAnalyticsProps) {
  const trendData = [
    { month: "Sentyabr", bal: 82, hədəf: 80 },
    { month: "Oktyabr", bal: 85, hədəf: 82 },
    { month: "Noyabr", bal: 89, hədəf: 85 },
    { month: "Dekabr", bal: 94, hədəf: 88 },
    { month: "Yanvar", bal: 91, hədəf: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Ümumi Orta Bal</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {analytics.overall_average}%
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">+4.2% keçən aydan</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Tamamlanmış İmtahan</span>
            <BookCheck className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {analytics.exams_completed}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">BSQ & KSQ nəticələri</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">Öyrənmə Müddəti</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {analytics.study_hours} <span className="text-sm font-normal text-zinc-400">saat</span>
          </div>
          <p className="text-[11px] text-cyan-400 mt-1 font-medium">Bu semestr ərzində</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs">XP Qazancları</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {analytics.xp_balance}
          </div>
          <p className="text-[11px] text-amber-400 mt-1 font-medium">Liderlər yarışında aktiv</p>
        </div>
      </div>

      {/* Dual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Area Chart */}
        <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base text-white">Qiymətləndirmə Dinamikası</CardTitle>
            <CardDescription className="text-xs">
              Aylar üzrə orta summativ balın inkişaf qrafiki
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} domain={[60, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#09090b",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bal"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#balGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Bar Chart */}
        <Card className="border-white/10 bg-zinc-900/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base text-white">Fənlər üzrə Müvəffəqiyyət</CardTitle>
            <CardDescription className="text-xs">
              Əsas fənlər üzrə şagirdin 100 ballıq sistemdə orta göstəricisi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.subject_breakdown}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="subject" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#09090b",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
