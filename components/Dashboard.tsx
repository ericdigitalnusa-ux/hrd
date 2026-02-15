import React from 'react';
import { Candidate, InterviewStatus } from '../types';
import { Users, UserCheck, TrendingUp, AlertTriangle, ArrowRight, Search } from 'lucide-react';

interface DashboardProps {
  candidates: Candidate[];
  onSelectCandidate: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, onSelectCandidate }) => {
  const total = candidates.length;
  const hired = candidates.filter(c => c.status === InterviewStatus.Hired).length;
  const pending = candidates.filter(c => c.status === InterviewStatus.Pending).length;
  
  // Calculate average score of analyzed candidates
  const analyzed = candidates.filter(c => c.analysis);
  const avgScore = analyzed.length 
    ? Math.round(analyzed.reduce((acc, curr) => acc + (curr.analysis?.matchScore || 0), 0) / analyzed.length) 
    : 0;

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Analyzed': return 'Dianalisis';
      case 'Pending': return 'Tertunda';
      case 'Rejected': return 'Ditolak';
      case 'Hired': return 'Diterima';
      default: return status;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className={`text-xs mt-2 ${color.text} font-medium`}>{subtext}</p>
      </div>
      <div className={`p-3 rounded-lg ${color.bg} ${color.iconText}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Ringkasan Dasbor</h2>
        <p className="text-gray-500 mt-2">Selamat datang kembali, Manajer HR. Berikut situasi hari ini.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Kandidat" 
          value={total} 
          icon={Users} 
          color={{ bg: 'bg-blue-50', iconText: 'text-blue-600', text: 'text-blue-600' }}
          subtext="+12% dari bulan lalu"
        />
        <StatCard 
          title="Rata-rata Skor" 
          value={`${avgScore}%`} 
          icon={TrendingUp} 
          color={{ bg: 'bg-green-50', iconText: 'text-green-600', text: 'text-green-600' }}
          subtext="Kumpulan bakat berkualitas"
        />
        <StatCard 
          title="Kandidat Diterima" 
          value={hired} 
          icon={UserCheck} 
          color={{ bg: 'bg-purple-50', iconText: 'text-purple-600', text: 'text-purple-600' }}
          subtext="3 penawaran pending"
        />
        <StatCard 
          title="Menunggu Tinjauan" 
          value={pending} 
          icon={AlertTriangle} 
          color={{ bg: 'bg-orange-50', iconText: 'text-orange-600', text: 'text-orange-600' }}
          subtext="Perlu tindakan"
        />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Kandidat Terbaru</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Kandidat</th>
                <th className="px-6 py-4">Posisi</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Skor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                        <p className="text-xs text-gray-500">{candidate.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{candidate.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(candidate.date).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    {candidate.analysis ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        candidate.analysis.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                        candidate.analysis.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {candidate.analysis.matchScore}%
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${candidate.status === InterviewStatus.Hired ? 'bg-purple-100 text-purple-800' : ''}
                      ${candidate.status === InterviewStatus.Analyzed ? 'bg-blue-100 text-blue-800' : ''}
                      ${candidate.status === InterviewStatus.Pending ? 'bg-gray-100 text-gray-800' : ''}
                      ${candidate.status === InterviewStatus.Rejected ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {translateStatus(candidate.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onSelectCandidate(candidate.id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;