export enum InterviewStatus {
  Analyzed = 'Analyzed',
  Pending = 'Pending',
  Rejected = 'Rejected',
  Hired = 'Hired'
}

export interface QuestionAnalysis {
  question: string;
  answerSummary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  keySkills: string[];
}

export interface PersonalityTraits {
  dominant: number;
  analytical: number;
  supportive: number;
  expressive: number;
  leadershipPotential: number; // 0-10
  problemSolving: number; // 0-10
  emotionalControl: number; // 0-10
}

export interface AIAnalysisResult {
  summary: string;
  questions: QuestionAnalysis[];
  personality: PersonalityTraits;
  redFlags: string[];
  matchScore: number; // 0-100
  recommendation: 'YES' | 'NO' | 'MAYBE';
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  email: string;
  date: string; // ISO string
  status: InterviewStatus;
  analysis?: AIAnalysisResult;
  mediaUrl?: string; // Blob URL for preview
  fileName?: string;
}

export type ViewState = 'dashboard' | 'new-interview' | 'candidate-detail';