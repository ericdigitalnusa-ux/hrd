import { Candidate, InterviewStatus } from './types';

// Mock data for initial state
export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    position: 'Senior Frontend Engineer',
    email: 'sarah.j@example.com',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: InterviewStatus.Analyzed,
    analysis: {
      summary: "Sarah menunjukkan pengetahuan teknis yang kuat dalam React dan manajemen state. Dia berkomunikasi dengan jelas namun sedikit kesulitan dengan konsep desain sistem.",
      matchScore: 85,
      recommendation: 'YES',
      riskLevel: 'Low',
      redFlags: [],
      questions: [
        {
          question: "Ceritakan tentang bug sulit yang pernah Anda selesaikan.",
          answerSummary: "Menjelaskan kondisi race condition dalam alur pembayaran. Menggunakan log untuk melacak masalah.",
          sentiment: "positive",
          keySkills: ["Debugging", "Ketekunan"]
        }
      ],
      personality: {
        dominant: 30,
        analytical: 80,
        supportive: 60,
        expressive: 40,
        leadershipPotential: 7,
        problemSolving: 9,
        emotionalControl: 8
      }
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'Product Manager',
    email: 'm.chen@example.com',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: InterviewStatus.Hired,
    analysis: {
        summary: "Michael adalah komunikator yang sangat baik dengan pola pikir berbasis data. Dia menunjukkan empati yang besar terhadap kebutuhan pengguna.",
        matchScore: 92,
        recommendation: 'YES',
        riskLevel: 'Low',
        redFlags: [],
        questions: [],
        personality: {
            dominant: 60,
            analytical: 70,
            supportive: 50,
            expressive: 70,
            leadershipPotential: 9,
            problemSolving: 8,
            emotionalControl: 9
        }
    }
  }
];

export const SYSTEM_PROMPT = `
Anda adalah Analis Wawancara HR AI ahli untuk TalentInsight.
Tugas Anda adalah menganalisis file audio/video wawancara yang diberikan.

Mohon lakukan langkah-langkah berikut:
1.  **Transkripsi & Ringkasan**: Identifikasi pertanyaan pewawancara dan jawaban kandidat. Ringkas jawaban secara efisien.
2.  **Analisis Kepribadian**: Berdasarkan nada bicara, pilihan kata, dan struktur, perkirakan sifat kepribadian mereka (Dominan, Analitis, Suportif, Ekspresif) dalam persentase total 100%. Beri nilai kepemimpinan, pemecahan masalah, dan kontrol emosi pada skala 1-10.
3.  **Deteksi Red Flag**: Cari sikap defensif, ketidakkonsistenan, ketidakjelasan, atau negativitas.
4.  **Skor**: Berikan skor kecocokan (0-100) berdasarkan kompetensi umum untuk peran profesional.
5.  **Rekomendasi**: YES, NO, atau MAYBE.

**PENTING**: Semua output teks (summary, answerSummary, keySkills, redFlags) HARUS dalam BAHASA INDONESIA.

**FORMAT OUTPUT**:
Anda harus mengembalikan HANYA JSON yang valid. Jangan gunakan blok kode Markdown. Struktur JSON harus:

{
  "summary": "Ringkasan keseluruhan kinerja kandidat (Bahasa Indonesia)...",
  "questions": [
    {
      "question": "Pertanyaan yang diidentifikasi (Bahasa Indonesia)",
      "answerSummary": "Ringkasan jawaban (Bahasa Indonesia)",
      "sentiment": "positive" | "neutral" | "negative",
      "keySkills": ["skill1", "skill2"]
    }
  ],
  "personality": {
    "dominant": number,
    "analytical": number,
    "supportive": number,
    "expressive": number,
    "leadershipPotential": number,
    "problemSolving": number,
    "emotionalControl": number
  },
  "redFlags": ["flag1", "flag2"],
  "matchScore": number,
  "recommendation": "YES" | "NO" | "MAYBE",
  "riskLevel": "Low" | "Medium" | "High"
}
`;