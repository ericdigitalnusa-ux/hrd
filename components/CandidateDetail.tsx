import React from 'react';
import { Candidate } from '../types';
import { 
  ArrowLeft, CheckCircle, AlertOctagon, HelpCircle, 
  Brain, MessageSquare, Target, User, PlayCircle, FileText
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface CandidateDetailProps {
  candidate: Candidate;
  onBack: () => void;
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, onBack }) => {
  const { analysis } = candidate;

  if (!analysis) return <div>Tidak ada analisis tersedia.</div>;

  // Data for Radar Chart
  const personalityData = [
    { subject: 'Dominan', A: analysis.personality.dominant, fullMark: 100 },
    { subject: 'Analitis', A: analysis.personality.analytical, fullMark: 100 },
    { subject: 'Suportif', A: analysis.personality.supportive, fullMark: 100 },
    { subject: 'Ekspresif', A: analysis.personality.expressive, fullMark: 100 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const RecommendationBadge = ({ type }: { type: string }) => {
    const styles = {
      'YES': 'bg-green-100 text-green-800 border-green-200',
      'NO': 'bg-red-100 text-red-800 border-red-200',
      'MAYBE': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    const icons = {
      'YES': <CheckCircle size={16} className="mr-1" />,
      'NO': <AlertOctagon size={16} className="mr-1" />,
      'MAYBE': <HelpCircle size={16} className="mr-1" />
    };
    // @ts-ignore
    const style = styles[type] || styles['MAYBE'];
    // @ts-ignore
    const icon = icons[type] || icons['MAYBE'];

    return (
      <span className={`flex items-center px-3 py-1 rounded-full text-xs font-bold border ${style}`}>
        {icon}
        {type}
      </span>
    );
  };

  const translateRisk = (risk: string) => {
      switch(risk) {
          case 'Low': return 'Rendah';
          case 'Medium': return 'Sedang';
          case 'High': return 'Tinggi';
          default: return risk;
      }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Kembali ke Dasbor
      </button>

      {/* Header Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {candidate.name.charAt(0)}
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
            <p className="text-gray-500">{candidate.position} • {candidate.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Skor Kecocokan</p>
            <div className={`text-3xl font-black ${analysis.matchScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
              {analysis.matchScore}%
            </div>
          </div>
          <div className="h-12 w-px bg-gray-200"></div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Keputusan</p>
            <RecommendationBadge type={analysis.recommendation} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Media & Transcripts */}
        <div className="lg:col-span-2 space-y-6">
            
          {/* Media Player */}
          <div className="bg-black rounded-xl overflow-hidden aspect-video relative group">
            {candidate.mediaUrl ? (
                <video 
                    src={candidate.mediaUrl} 
                    controls 
                    className="w-full h-full object-contain"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                    <div className="text-center">
                        <PlayCircle size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Media Tidak Tersedia</p>
                    </div>
                </div>
            )}
          </div>

          {/* AI Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4">
              <Brain className="mr-2 text-purple-600" size={20} />
              Ringkasan Eksekutif AI
            </h3>
            <p className="text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-lg border border-purple-100">
              {analysis.summary}
            </p>
          </div>

          {/* Q&A Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4">
              <MessageSquare className="mr-2 text-blue-600" size={20} />
              Pertanyaan Kunci & Wawasan
            </h3>
            <div className="space-y-4">
                {analysis.questions.map((q, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <p className="font-semibold text-gray-900 mb-1">T: {q.question}</p>
                        <p className="text-gray-600 text-sm italic mb-2">"{q.answerSummary}"</p>
                        <div className="flex flex-wrap gap-2">
                             {q.keySkills.map((skill, i) => (
                                 <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                     {skill}
                                 </span>
                             ))}
                             <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize 
                                ${q.sentiment === 'positive' ? 'bg-green-100 text-green-700' : 
                                  q.sentiment === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                sentiment {q.sentiment}
                             </span>
                        </div>
                    </div>
                ))}
                {analysis.questions.length === 0 && <p className="text-gray-400 italic">Tidak ada pertanyaan spesifik yang terdeteksi.</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Metrics */}
        <div className="space-y-6">
          
          {/* Personality Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4">
                <User className="mr-2 text-indigo-600" size={20} />
                Profil Kepribadian
            </h3>
            <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={personalityData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Kandidat"
                        dataKey="A"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                    />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            {/* Soft Skills Bars */}
            <div className="space-y-3 mt-4">
                {[
                    { label: 'Kepemimpinan', val: analysis.personality.leadershipPotential },
                    { label: 'Pemecahan Masalah', val: analysis.personality.problemSolving },
                    { label: 'Kontrol Emosi', val: analysis.personality.emotionalControl }
                ].map((skill, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-600">{skill.label}</span>
                            <span className="font-bold text-gray-900">{skill.val}/10</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                                className="bg-indigo-500 h-2 rounded-full" 
                                style={{ width: `${skill.val * 10}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Red Flags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4">
                <AlertOctagon className="mr-2 text-red-500" size={20} />
                Analisis Risiko
            </h3>
            
            <div className="mb-4">
                <span className="text-xs font-semibold text-gray-400 uppercase">Tingkat Risiko</span>
                <p className={`font-bold mt-1 ${
                    analysis.riskLevel === 'High' ? 'text-red-600' : 
                    analysis.riskLevel === 'Medium' ? 'text-orange-600' : 'text-green-600'
                }`}>{translateRisk(analysis.riskLevel)}</p>
            </div>

            {analysis.redFlags && analysis.redFlags.length > 0 ? (
                <ul className="space-y-2">
                    {analysis.redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start text-sm text-red-700 bg-red-50 p-2 rounded">
                            <AlertOctagon size={14} className="mt-1 mr-2 flex-shrink-0" />
                            {flag}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="bg-green-50 text-green-700 p-3 rounded text-sm flex items-center">
                    <CheckCircle size={16} className="mr-2" />
                    Tidak ada red flag mayor terdeteksi.
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;