import React, { useState } from 'react';
import Button from './Button';
import { UploadedImage } from '../types';

interface ResultViewProps {
  original: UploadedImage;
  generatedUrl: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ original, generatedUrl, onReset }) => {
  const [activeTab, setActiveTab] = useState<'original' | 'anime' | 'split'>('split');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedUrl;
    link.download = `anime-portrait-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-8">
      
      {/* Tab Controls */}
      <div className="flex justify-center p-1 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 w-fit mx-auto mb-6">
        {(['original', 'split', 'anime'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-violet-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Image Display */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1] glass-panel rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/20 group">
        
        {/* Container for centering content */}
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 bg-slate-900/50">
          
          <div className="relative flex items-center justify-center h-full w-full max-w-5xl gap-4">
            
            {activeTab === 'original' && (
               <img 
                 src={original.previewUrl} 
                 alt="Original" 
                 className="h-full object-contain rounded-lg shadow-xl"
               />
            )}

            {activeTab === 'anime' && (
               <img 
                 src={generatedUrl} 
                 alt="Anime Version" 
                 className="h-full object-contain rounded-lg shadow-xl ring-2 ring-violet-500/50"
               />
            )}

            {activeTab === 'split' && (
              <div className="flex flex-col md:flex-row gap-4 h-full w-full justify-center items-center">
                 <div className="relative h-1/2 md:h-full w-full md:w-1/2 flex justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-800/30">
                    <img src={original.previewUrl} alt="Original" className="h-full object-contain" />
                    <span className="absolute bottom-2 left-2 bg-black/60 text-xs px-2 py-1 rounded text-white backdrop-blur-sm">Original</span>
                 </div>
                 <div className="hidden md:flex items-center text-violet-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                 </div>
                 <div className="relative h-1/2 md:h-full w-full md:w-1/2 flex justify-center overflow-hidden rounded-xl border-2 border-violet-500/30 bg-violet-900/10 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                    <img src={generatedUrl} alt="Anime" className="h-full object-contain" />
                    <span className="absolute bottom-2 right-2 bg-violet-600/80 text-xs px-2 py-1 rounded text-white backdrop-blur-sm font-bold">Anime AI</span>
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button variant="secondary" onClick={onReset} className="w-full sm:w-auto">
          Try Another Photo
        </Button>
        <Button onClick={handleDownload} className="w-full sm:w-auto min-w-[200px]">
          Download Portrait
        </Button>
      </div>
    </div>
  );
};

export default ResultView;