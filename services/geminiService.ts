import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { AIAnalysisResult } from '../types';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeInterview = async (
  file: File,
  position: string,
  candidateName: string
): Promise<AIAnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key hilang. Mohon periksa variabel environment Anda.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Determine mimeType
    const mimeType = file.type;

    const prompt = `
      Nama Kandidat: ${candidateName}
      Posisi yang Dilamar: ${position}
      
      Mohon analisis rekaman wawancara ini berdasarkan instruksi sistem yang diberikan. 
      Gunakan Bahasa Indonesia untuk semua output teks.
    `;

    // Using gemini-2.5-flash-latest for robust multimodal analysis
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        // Using a schema to ensure type safety in the return
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answerSummary: { type: Type.STRING },
                  sentiment: { type: Type.STRING, enum: ["positive", "neutral", "negative"] },
                  keySkills: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            personality: {
              type: Type.OBJECT,
              properties: {
                dominant: { type: Type.NUMBER },
                analytical: { type: Type.NUMBER },
                supportive: { type: Type.NUMBER },
                expressive: { type: Type.NUMBER },
                leadershipPotential: { type: Type.NUMBER },
                problemSolving: { type: Type.NUMBER },
                emotionalControl: { type: Type.NUMBER }
              }
            },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            matchScore: { type: Type.NUMBER },
            recommendation: { type: Type.STRING, enum: ["YES", "NO", "MAYBE"] },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Tidak ada respon dari AI");

    const result = JSON.parse(text) as AIAnalysisResult;
    return result;

  } catch (error) {
    console.error("Error analyzing interview:", error);
    throw error;
  }
};