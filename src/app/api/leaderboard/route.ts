import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("school_leaderboard")
      .select("*")
      .order("rank", { ascending: true })
      .limit(10);

    if (error || !data || data.length === 0) {
      const defaultLeaderboard = [
        { id: 'lead-1', name: 'Ayan Məmmədova', rank: 1, avatar: '👩‍🎓', school_grade: 11, points: 2850, wins: 48, win_rate: 92.3, badge: 'Akademik Qalib' },
        { id: 'lead-2', name: 'Elmir Əliyev', rank: 2, avatar: '👨‍🎓', school_grade: 10, points: 2640, wins: 42, win_rate: 88.5, badge: 'Riyaziyyat Ustası' },
        { id: 'lead-3', name: 'Leyla Qasımova', rank: 3, avatar: '🌟', school_grade: 10, points: 2490, wins: 39, win_rate: 85.0, badge: 'Fizika Dəhası' },
        { id: 'lead-4', name: 'Rauf Nəsirov', rank: 4, avatar: '⚡', school_grade: 9, points: 2310, wins: 35, win_rate: 81.4, badge: 'Sürətli Həllçi' },
        { id: 'lead-5', name: 'Zəhra İsmayılova', rank: 5, avatar: '🎯', school_grade: 11, points: 2180, wins: 31, win_rate: 79.2, badge: 'Kimya Dahisi' },
      ];
      return NextResponse.json({ success: true, data: defaultLeaderboard, source: "default" });
    }

    return NextResponse.json({ success: true, data, source: "supabase" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
