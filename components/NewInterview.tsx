import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mic, FileAudio, Play, X, Loader2, StopCircle, RefreshCw, Clock } from 'lucide-react';
import { analyzeInterview } from '../services/geminiService';
import { AIAnalysisResult, Candidate, InterviewStatus } from '../types';

interface NewInterviewProps {
  onAnalysisComplete: (candidate: Candidate) => void;
  onCancel: () => void;
}

const NewInterview: React.FC<NewInterviewProps> = ({ onAnalysisComplete, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up URL on unmount
  useEffect(() => {
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [audioURL]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Create a File object from the Blob to match existing service signature
        const recordedFile = new File([audioBlob], `interview-recording-${Date.now()}.webm`, { type: 'audio/webm' });
        setFile(recordedFile);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);

      // Start Timer
      setRecordingTime(0);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Tidak dapat mengakses mikrofon. Pastikan izin telah diberikan.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    setFile(null);
    setAudioURL(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError("Ukuran file terlalu besar. Harap gunakan file di bawah 25MB untuk demo ini.");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !position) {
      setError("Mohon isi semua kolom dan berikan file wawancara.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result: AIAnalysisResult = await analyzeInterview(file, position, name);

      const newCandidate: Candidate = {
        id: Date.now().toString(),
        name,
        position,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        date: new Date().toISOString(),
        status: InterviewStatus.Analyzed,
        analysis: result,
        mediaUrl: audioURL || URL.createObjectURL(file), 
        fileName: file.name
      };

      onAnalysisComplete(newCandidate);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal menganalisis wawancara. Silakan coba lagi.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Analisis Wawancara Baru</h2>
        <p className="text-gray-500 mt-2">Unggah rekaman atau rekam langsung untuk mendapatkan wawasan instan menggunakan Gemini 2.5.</p>
      </header>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Kandidat</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Budi Santoso"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Posisi yang Dilamar</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="cth. Manajer Penjualan"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Input Method Tabs */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Sumber Wawancara</label>
            <div className="flex space-x-4 bg-gray-50 p-1 rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => { setActiveTab('upload'); resetRecording(); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'upload' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Upload size={16} />
                <span>Unggah File</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('record'); setFile(null); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'record' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Mic size={16} />
                <span>Rekam Langsung</span>
              </button>
            </div>

            {/* Upload Area */}
            {activeTab === 'upload' && (
              <div className="animate-fade-in">
                {!file ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="audio/*,video/*"
                    />
                    <div className="flex flex-col items-center space-y-3">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                        <Upload size={24} />
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900">Klik untuk unggah atau seret file ke sini</p>
                        <p className="text-sm text-gray-500">MP3, WAV, MP4, M4A (Maks 25MB)</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                        {file.type.startsWith('video') ? <Play size={20} /> : <FileAudio size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setFile(null)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Recording Area */}
            {activeTab === 'record' && (
              <div className="animate-fade-in border border-gray-200 rounded-xl p-8 bg-gray-50 flex flex-col items-center justify-center space-y-6">
                {!file ? (
                  <>
                     <div className="relative">
                       {/* Pulsing Effect when recording */}
                       {isRecording && (
                         <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                       )}
                       <div className={`relative h-24 w-24 rounded-full flex items-center justify-center transition-colors ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                          <Mic size={40} />
                       </div>
                     </div>
                     
                     <div className="text-center space-y-2">
                        <div className={`text-3xl font-mono font-bold ${isRecording ? 'text-red-500' : 'text-gray-700'}`}>
                          {formatTime(recordingTime)}
                        </div>
                        <p className="text-sm text-gray-500">
                          {isRecording ? "Sedang merekam..." : "Siap merekam wawancara"}
                        </p>
                     </div>

                     <div className="flex space-x-4">
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <Mic size={18} />
                            <span>Mulai Merekam</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                          >
                            <StopCircle size={18} />
                            <span>Berhenti Merekam</span>
                          </button>
                        )}
                     </div>
                  </>
                ) : (
                  <div className="w-full">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-green-700">
                           <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                           <span className="text-sm font-medium">Rekaman Selesai</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                           <Clock size={14} className="mr-1" />
                           {formatTime(recordingTime)}
                        </div>
                     </div>
                     
                     <audio src={audioURL!} controls className="w-full mb-6" />
                     
                     <button
                        type="button"
                        onClick={resetRecording}
                        className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-white transition-colors flex items-center justify-center space-x-2"
                      >
                        <RefreshCw size={16} />
                        <span>Rekam Ulang</span>
                      </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm flex items-center space-x-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isAnalyzing}
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isAnalyzing || !file}
              className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/30 flex items-center space-x-2
                ${(isAnalyzing || !file) ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all'}
              `}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memproses (Gemini AI)...</span>
                </>
              ) : (
                <>
                  <span>Mulai Analisis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInterview;