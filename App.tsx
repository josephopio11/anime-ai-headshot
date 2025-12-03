import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultView from './components/ResultView';
import Button from './components/Button';
import { UploadedImage, AppState } from './types';
import { generateAnimePortrait } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (image: UploadedImage) => {
    setUploadedImage(image);
    setAppState(AppState.PREVIEW);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;

    setAppState(AppState.GENERATING);
    setError(null);

    try {
      const generated = await generateAnimePortrait(
        uploadedImage.base64Data,
        uploadedImage.mimeType
      );

      if (generated) {
        setGeneratedImageUrl(generated);
        setAppState(AppState.SUCCESS);
      } else {
        throw new Error("No image data returned from API");
      }
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong while generating the anime portrait. Please try again.");
      setAppState(AppState.PREVIEW);
    }
  };

  const resetApp = () => {
    setUploadedImage(null);
    setGeneratedImageUrl(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-slate-100 flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 w-full max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        {appState === AppState.IDLE && (
          <div className="text-center space-y-8 animate-fade-in w-full max-w-4xl">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Turn your selfie into <br />
                <span className="anime-gradient-text">Anime Art</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Upload a casual photo and let our AI sketch you into a character from your favorite show.
              </p>
            </div>
            
            <div className="mt-12">
              <ImageUploader onImageSelect={handleImageSelect} />
            </div>
            
            {/* Sample Grid */}
            <div className="pt-12 grid grid-cols-3 gap-4 opacity-50 max-w-lg mx-auto grayscale hover:grayscale-0 transition-all duration-500">
               <div className="aspect-square rounded-lg bg-slate-800 overflow-hidden">
                   <img src="https://picsum.photos/200/200?random=1" className="w-full h-full object-cover" alt="sample 1" />
               </div>
               <div className="aspect-square rounded-lg bg-slate-800 overflow-hidden">
                   <img src="https://picsum.photos/200/200?random=2" className="w-full h-full object-cover" alt="sample 2" />
               </div>
               <div className="aspect-square rounded-lg bg-slate-800 overflow-hidden">
                   <img src="https://picsum.photos/200/200?random=3" className="w-full h-full object-cover" alt="sample 3" />
               </div>
            </div>
          </div>
        )}

        {/* PREVIEW SECTION */}
        {appState === AppState.PREVIEW && uploadedImage && (
          <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
             <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Ready to transform?</h3>
                <p className="text-slate-400">Review your photo before we begin the magic.</p>
             </div>

             <div className="relative aspect-[3/4] md:aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800">
                <img 
                  src={uploadedImage.previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
             </div>

             {error && (
               <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-center text-sm">
                 {error}
               </div>
             )}

             <div className="flex gap-4 justify-center">
                <Button variant="secondary" onClick={resetApp}>
                   Cancel
                </Button>
                <Button onClick={handleGenerate} className="min-w-[150px]">
                   Generate Anime Art
                </Button>
             </div>
          </div>
        )}

        {/* LOADING STATE */}
        {appState === AppState.GENERATING && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-pulse">
            <div className="relative w-32 h-32">
               <div className="absolute inset-0 border-4 border-violet-500/30 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-transparent border-t-violet-500 rounded-full animate-spin"></div>
               <div className="absolute inset-4 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-3xl">✨</span>
               </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                Sketching your portrait...
              </h3>
              <p className="text-slate-400">Applying anime filters and shading</p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {appState === AppState.SUCCESS && uploadedImage && generatedImageUrl && (
          <ResultView 
            original={uploadedImage} 
            generatedUrl={generatedImageUrl} 
            onReset={resetApp} 
          />
        )}
      </main>

      <footer className="w-full py-6 text-center text-slate-600 text-sm">
        <p>Powered by Google Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
};

export default App;