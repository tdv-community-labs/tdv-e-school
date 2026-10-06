import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("school_analytics")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({
        success: true,
        data: {
          student_id: "std-001",
          student_name: "Elmir Əliyev",
          grade: 10,
          overall_average: 91.4,
          exams_completed: 18,
          study_hours: 48.5,
          xp_balance: 2640,
          subject_breakdown: [
            { subject: "Riyaziyyat", score: 96, progress: 88, color: "#6366f1" },
            { subject: "Fizika", score: 92, progress: 82, color: "#06b6d4" },
            { subject: "Kimya", score: 88, progress: 75, color: "#10b981" },
            { subject: "Biologiya", score: 85, progress: 70, color: "#84cc16" },
            { subject: "İnformatika", score: 98, progress: 95, color: "#8b5cf6" },
          ],
        },
        source: "default",
      });
    }

    return NextResponse.json({ success: true, data, source: "supabase" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
