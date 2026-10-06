import { NextRequest, NextResponse } from "next/server";
import { ExamFilterSchema } from "@/lib/validations/school";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const filter = ExamFilterSchema.parse(query);

    const mockExams = [
      {
        id: "exam-math-10-bsq-1-a",
        title: "10-cu Sinif Riyaziyyat - I Yarımil BSQ-1",
        subjectId: "riyaziyyat",
        subjectName: "Riyaziyyat",
        grade: 10,
        examType: "BSQ",
        semester: 1,
        variant: "A",
        durationMinutes: 45,
        totalQuestions: 5,
        maxScore: 100,
        badgeColor: "indigo",
      },
      {
        id: "exam-phys-10-ksq-2-a",
        title: "10-cu Sinif Fizika - Elektrodinamika KSQ-2",
        subjectId: "fizika",
        subjectName: "Fizika",
        grade: 10,
        examType: "KSQ",
        semester: 1,
        variant: "A",
        durationMinutes: 30,
        totalQuestions: 4,
        maxScore: 100,
        badgeColor: "cyan",
      },
      {
        id: "exam-chem-10-bsq-1-b",
        title: "10-cu Sinif Kimya - Üzvi Kimya BSQ-1",
        subjectId: "kimya",
        subjectName: "Kimya",
        grade: 10,
        examType: "BSQ",
        semester: 1,
        variant: "B",
        durationMinutes: 45,
        totalQuestions: 5,
        maxScore: 100,
        badgeColor: "emerald",
      },
      {
        id: "exam-inf-10-ksq-1-a",
        title: "10-cu Sinif İnformatika - Python və Alqoritmlər KSQ-1",
        subjectId: "informatika",
        subjectName: "İnformatika",
        grade: 10,
        examType: "KSQ",
        semester: 1,
        variant: "A",
        durationMinutes: 35,
        totalQuestions: 5,
        maxScore: 100,
        badgeColor: "violet",
      },
    ];

    let filtered = mockExams;
    if (filter.subjectId) {
      filtered = filtered.filter((e) => e.subjectId === filter.subjectId);
    }
    if (filter.examType) {
      filtered = filtered.filter((e) => e.examType === filter.examType);
    }

    return NextResponse.json({ success: true, count: filtered.length, data: filtered });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
