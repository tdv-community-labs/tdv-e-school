import { NextRequest, NextResponse } from "next/server";
import { TutorQuerySchema } from "@/lib/validations/school";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, subjectId } = TutorQuerySchema.parse(body);

    // AI EdTech Chain-of-Thought Tutor Response Generator
    let answer = "";
    const lower = prompt.toLowerCase();

    if (lower.includes("kəsr") || lower.includes("riyaziyyat") || lower.includes("törəmə")) {
      answer = `Salam! Riyaziyyat sualınıza cavab olaraq:\n\n1. **Qayda:** Törəmə funksiyanın ani dəyişmə sürətini göstərir: $f'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}$.\n2. **Tətbiq:** Böhran nöqtələrini tapmaq üçün $f'(x) = 0$ tənliyini həll edirik.\n3. **Məsləhət:** Əgər $x_0$ nöqtəsində törəmə işarəsini müsbətdən mənfiyə dəyişirsə, bu nöqtə maksimum nöqtəsidir!`;
    } else if (lower.includes("fizika") || lower.includes("nyuton") || lower.includes("enerji")) {
      answer = `Salam! Fizika qanunları üzrə:\n\n1. **Nyutonun II Qanunu:** Cismə təsir edən əvəzləyici qüvvə onun kütləsi ilə təcilinin hasilinə bərabərdir: $\\vec{F} = m\\vec{a}$.\n2. **Enerjinin Saxlanması:** Qapalı sistemdə mexaniki enerji sabit qalır: $E_k + E_p = \\text{const}$.\n3. **Sualınızla bağlı:** Əlavə sualınız olarsa düstur və addım-addım həll təqdim edə bilərəm!`;
    } else if (lower.includes("kimya") || lower.includes("mendeleyev") || lower.includes("reaksiya")) {
      answer = `Salam! Kimya fənni üzrə cavab:\n\n1. **Dövri Qanun:** Elementlərin xassələri onların atom nüvələrinin yükündən dövri asılıdır.\n2. **Reaksiya Tənliyi:** Kütlənin saxlanması qanununa görə reaksiyaya daxil olan maddələrin kütləsi alınan maddələrin kütləsinə bərabərdir.\n3. Reaksiya əmsallarını bərabərləşdirmək istədiyiniz reaksiyanı yazın, dərhal kömək edim!`;
    } else {
      answer = `Salam! Mən TDV E-School AI Təhsil Bələdçisiyəm. \n\nSualınız qəbul edildi: "${prompt}".\n\n📌 **Tövsiyə:** Dərs konspektlərinizə və BSQ/KSQ imtahan arxivinə baxaraq bu mövzu üzrə 5 test sualı həll edin və 100 XP qazanın!`;
    }

    return NextResponse.json({
      success: true,
      data: {
        reply: answer,
        timestamp: new Date().toISOString(),
        subject: subjectId || "ümumi",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
