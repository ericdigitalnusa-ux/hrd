import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NewInterview from './components/NewInterview';
import CandidateDetail from './components/CandidateDetail';
import { ViewState, Candidate } from './types';
import { MOCK_CANDIDATES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // Load from local storage on mount (optional enhancement for persistence)
  useEffect(() => {
    const saved = localStorage.getItem('talent_insight_candidates');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Merge mock data with saved data roughly for demo stability
            if (parsed.length > 0) setCandidates(parsed);
        } catch (e) {
            console.error("Failed to load candidates", e);
        }
    }
  }, []);

  // Save to local storage whenever candidates change
  useEffect(() => {
    localStorage.setItem('talent_insight_candidates', JSON.stringify(candidates));
  }, [candidates]);

  const handleAnalysisComplete = (newCandidate: Candidate) => {
    setCandidates(prev => [newCandidate, ...prev]);
    setSelectedCandidateId(newCandidate.id);
    setCurrentView('candidate-detail');
  };

  const handleSelectCandidate = (id: string) => {
    setSelectedCandidateId(id);
    setCurrentView('candidate-detail');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard candidates={candidates} onSelectCandidate={handleSelectCandidate} />;
      case 'new-interview':
        return <NewInterview onAnalysisComplete={handleAnalysisComplete} onCancel={() => setCurrentView('dashboard')} />;
      case 'candidate-detail':
        const candidate = candidates.find(c => c.id === selectedCandidateId);
        if (!candidate) return <div className="p-8">Candidate not found</div>;
        return <CandidateDetail candidate={candidate} onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard candidates={candidates} onSelectCandidate={handleSelectCandidate} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 overflow-y-auto p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;