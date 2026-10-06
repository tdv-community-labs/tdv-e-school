import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("school_subjects")
      .select("*")
      .order("id");

    if (error || !data || data.length === 0) {
      // Return canonical subjects default
      const defaultSubjects = [
        { id: 'riyaziyyat', name: 'Riyaziyyat', short_name: 'Riy', icon: 'calculator', color: 'indigo', accent_color: '#6366f1', description: 'Cəbr, Həndəsə, Riyazi analiz və Triqonometriya.', total_lessons: 41, total_exams: 18 },
        { id: 'fizika', name: 'Fizika', short_name: 'Fiz', icon: 'atom', color: 'cyan', accent_color: '#06b6d4', description: 'Mexanika, Optika və Kvant fizikası.', total_lessons: 34, total_exams: 14 },
        { id: 'kimya', name: 'Kimya', short_name: 'Kim', icon: 'flask-conical', color: 'emerald', accent_color: '#10b981', description: 'Qeyri-üzvi və üzvi kimya, dövri qanun.', total_lessons: 29, total_exams: 12 },
        { id: 'biologiya', name: 'Biologiya', short_name: 'Bio', icon: 'dna', color: 'lime', accent_color: '#84cc16', description: 'Botanika, Zoologiya, İnsan anatomiyası və Genetika.', total_lessons: 27, total_exams: 10 },
        { id: 'informatika', name: 'İnformatika', short_name: 'İnf', icon: 'cpu', color: 'violet', accent_color: '#8b5cf6', description: 'Python alqoritmləri, verilənlər bazası və şəbəkələr.', total_lessons: 22, total_exams: 8 },
        { id: 'cografiya', name: 'Coğrafiya', short_name: 'Coğ', icon: 'globe', color: 'amber', accent_color: '#f59e0b', description: 'Fiziki, iqtisadi və sosial coğrafiya.', total_lessons: 25, total_exams: 9 },
        { id: 'tarix', name: 'Tarix', short_name: 'Tar', icon: 'landmark', color: 'rose', accent_color: '#f43f5e', description: 'Azərbaycan və ümumi dünya tarixi.', total_lessons: 31, total_exams: 11 },
        { id: 'azerbaycan_dili', name: 'Azərbaycan dili', short_name: 'Az-dili', icon: 'book-open', color: 'purple', accent_color: '#a855f7', description: 'Fonetika, Morfologiya və Sintaksis.', total_lessons: 38, total_exams: 15 },
        { id: 'xarici_dil', name: 'İngilis dili', short_name: 'İng', icon: 'languages', color: 'sky', accent_color: '#0284c7', description: 'Qrammatika, oxu, lüğət və yazı qaydaları.', total_lessons: 30, total_exams: 12 },
      ];
      return NextResponse.json({ success: true, data: defaultSubjects, source: "fallback" });
    }

    return NextResponse.json({ success: true, data, source: "supabase" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
