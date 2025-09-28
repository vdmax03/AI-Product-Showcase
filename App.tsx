import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GenerationMode, GeneratedImage, StylePreset } from './types';
import { PHOTOSHOOT_THEMES, LIGHTING_STYLES, LOOKBOOK_STYLE_PRESETS, BROLL_STYLE_PRESETS } from './constants';
import { generateShowcaseImages, generateVideoFromImage, generateVeo3Prompt } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ImageCard from './components/ImageCard';
import Modal from './components/Modal';
import ApiKeyInput from './components/ApiKeyInput';
import ProfilePictureGenerator from './components/ProfilePictureGenerator';
import VirtualTryOn from './components/VirtualTryOn';
import ProductBackgrounds from './components/ProductBackgrounds';
import SkincareApplicator from './components/SkincareApplicator';
import HouseholdProducts from './components/HouseholdProducts';
import ChangePose from './components/ChangePose';
import CustomizeTheme from './components/CustomizeTheme';
import MotorcycleProducts from './components/MotorcycleProducts';
import FoodBeverageProducts from './components/FoodBeverageProducts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'main' | 'profile' | 'virtual-tryon' | 'product-backgrounds' | 'skincare' | 'household' | 'change-pose' | 'customize-theme' | 'motorcycle' | 'fnb' | 'lookbook' | 'broll'>('main');
  const [mode, setMode] = useState<GenerationMode | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [theme, setTheme] = useState<string>(PHOTOSHOOT_THEMES[0]);
  const [lighting, setLighting] = useState<string>(LIGHTING_STYLES[0]);
  const [selectedStyleId, setSelectedStyleId] = useState<string>(LOOKBOOK_STYLE_PRESETS[0].id);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [count, setCount] = useState<number>(6);
  const [aspect, setAspect] = useState<string>('9/16');
  const [history, setHistory] = useState<GeneratedImage[][]>([]);
  const [faceConsistency, setFaceConsistency] = useState<boolean>(true);
  const [faceQuality, setFaceQuality] = useState<string>('high');

  const styleOptions = useMemo(() => (
    mode === GenerationMode.Lookbook ? LOOKBOOK_STYLE_PRESETS : BROLL_STYLE_PRESETS
  ), [mode]);

  const selectedStyle = useMemo(() => 
    styleOptions.find(s => s.id === selectedStyleId) || styleOptions[0]
  , [styleOptions, selectedStyleId]);

  const isGenerationDisabled = useMemo(() => {
    return isLoading || !productImage || (mode === GenerationMode.Lookbook && !modelImage);
  }, [isLoading, productImage, modelImage, mode]);

  const handleGenerate = useCallback(async () => {
    if (isGenerationDisabled) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]); // Clear previous images immediately

    try {
      if (!productImage) throw new Error("Product image is required.");
      const results = await generateShowcaseImages(mode, theme, lighting, productImage, modelImage, apiKey, count, faceConsistency, faceQuality, selectedStyle);
      if (results.length === 0) {
        throw new Error("The model did not return any images. Please try a different combination or check your API key.");
      }
      setGeneratedImages(
        results.map((img, index) => ({ ...img, id: `${Date.now()}-${index}` }))
      );
      setHistory((h) => [[...results.map((img, index) => ({ ...img, id: `${Date.now()}-${index}` }))], ...h].slice(0, 10));
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [isGenerationDisabled, mode, theme, lighting, productImage, modelImage, apiKey, count, faceConsistency, faceQuality, selectedStyle]);

  const handleGeneratePrompt = useCallback(async (image: GeneratedImage) => {
    try {
      const prompt = generateVeo3Prompt(image, mode);
      await navigator.clipboard.writeText(prompt);
      alert('Prompt Veo 3 berhasil di-copy ke clipboard!');
    } catch (err) {
      console.error('Failed to copy prompt:', err);
      alert('Gagal menyalin prompt ke clipboard');
    }
  }, [mode]);

  // Render different views based on currentView
  if (currentView === 'profile') {
    return <ProfilePictureGenerator apiKey={apiKey} onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'virtual-tryon') {
    return <VirtualTryOn apiKey={apiKey} onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'product-backgrounds') {
    return <ProductBackgrounds apiKey={apiKey} onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'skincare') {
    return <SkincareApplicator apiKey={apiKey} onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'household') {
    return <HouseholdProducts apiKey={apiKey} onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'change-pose') {
    return <ChangePose apiKey={apiKey} onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'customize-theme') {
    return <CustomizeTheme apiKey={apiKey} onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'motorcycle') {
    return <MotorcycleProducts apiKey={apiKey} onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'fnb') {
    return <FoodBeverageProducts apiKey={apiKey} onBack={() => setCurrentView('main')} />;
  }

  // If Profile Picture mode is selected, render the ProfilePictureGenerator component
  if (mode === GenerationMode.ProfilePicture) {
    return <ProfilePictureGenerator apiKey={apiKey} onBack={() => setMode(GenerationMode.Lookbook)} />;
  }

  // If Lookbook or B-roll mode is selected and in lookbook/broll view, render the original interface
  if ((mode === GenerationMode.Lookbook && currentView === 'lookbook') || (mode === GenerationMode.Broll && currentView === 'broll')) {
    return (
      <OriginalInterface
        mode={mode}
        setMode={setMode}
        setCurrentView={setCurrentView}
        modelImage={modelImage}
        setModelImage={setModelImage}
        productImage={productImage}
        setProductImage={setProductImage}
        theme={theme}
        setTheme={setTheme}
        lighting={lighting}
        setLighting={setLighting}
        selectedStyleId={selectedStyleId}
        setSelectedStyleId={setSelectedStyleId}
        generatedImages={generatedImages}
        setGeneratedImages={setGeneratedImages}
        isLoading={isLoading}
        error={error}
        setError={setError}
        zoomedImage={zoomedImage}
        setZoomedImage={setZoomedImage}
        apiKey={apiKey}
        count={count}
        setCount={setCount}
        aspect={aspect}
        setAspect={setAspect}
        history={history}
        setHistory={setHistory}
        faceConsistency={faceConsistency}
        setFaceConsistency={setFaceConsistency}
        faceQuality={faceQuality}
        setFaceQuality={setFaceQuality}
        handleGenerate={handleGenerate}
        handleGeneratePrompt={handleGeneratePrompt}
        isGenerationDisabled={isGenerationDisabled}
        styleOptions={styleOptions}
        selectedStyle={selectedStyle}
        PHOTOSHOOT_THEMES={PHOTOSHOOT_THEMES}
        LIGHTING_STYLES={LIGHTING_STYLES}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6 lg:p-8 font-sans">
        <header className="text-center mb-12">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-3xl inline-block shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold">8 IN 1</span>
              </div>
              <span className="text-sm font-medium opacity-90">AI STUDIO UNTUK BISNIS & UMKM</span>
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            AI Studio
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Pilih fitur AI yang ingin Anda gunakan di bawah ini untuk menciptakan konten visual yang menakjubkan
          </p>
        </header>

        <main className="max-w-7xl mx-auto">
          {/* API Key Input */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-12">
            <ApiKeyInput onApiKeyChange={setApiKey} />
          </div>

          {/* Original Features */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">✨ Fitur Utama</h2>
              <p className="text-blue-200 text-lg">Fitur inti untuk menciptakan konten visual profesional</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Lookbook Mode */}
        <button
          onClick={() => {
            setMode(GenerationMode.Lookbook);
            setCurrentView('lookbook');
          }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 hover:border-blue-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
        >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">Lookbook</h3>
                <p className="text-blue-200 leading-relaxed">Fashion photoshoot dengan model dan produk pakaian</p>
              </button>

              {/* B-roll Mode */}
        <button
          onClick={() => {
            setMode(GenerationMode.Broll);
            setCurrentView('broll');
          }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 hover:border-green-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
        >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">B-roll</h3>
                <p className="text-green-200 leading-relaxed">Video showcase untuk produk dengan berbagai angle</p>
              </button>

              {/* Profile Picture Mode */}
              <button
                onClick={() => setCurrentView('profile')}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 hover:border-purple-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">Profile Picture</h3>
                <p className="text-purple-200 leading-relaxed">Generate foto profil profesional dengan berbagai gaya</p>
              </button>
            </div>
          </div>

          {/* 8 AI Features Grid */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">🚀 Fitur Tambahan</h2>
              <p className="text-purple-200 text-lg">Fitur khusus untuk berbagai kebutuhan bisnis dan kreativitas</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Virtual Try-On */}
            <button
              onClick={() => setCurrentView('virtual-tryon')}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 hover:border-pink-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:from-pink-400 group-hover:to-purple-400 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">Virtual Try-On</h3>
              <p className="text-pink-200 text-sm leading-relaxed">Unggah foto Anda dan pakaian untuk melihat bagaimana tampilannya saat dikenakan.</p>
                    </button>
                  
            {/* Product Backgrounds */}
                        <button
              onClick={() => setCurrentView('product-backgrounds')}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 hover:border-emerald-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:from-emerald-400 group-hover:to-teal-400 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">Product Backgrounds</h3>
              <p className="text-emerald-200 text-sm leading-relaxed">Hasilkan latar belakang profesional untuk foto produk Anda secara instan.</p>
            </button>

            {/* Skincare Applicator */}
                      <button
              onClick={() => setCurrentView('skincare')}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 hover:border-rose-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:from-rose-400 group-hover:to-pink-400 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4V2a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">Skincare Applicator</h3>
              <p className="text-rose-200 text-sm leading-relaxed">Visualisasikan model yang menggunakan produk perawatan kulit Anda.</p>
            </button>

            {/* Household Products */}
            <button
              onClick={() => setCurrentView('household')}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 hover:border-amber-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-4 group-hover:from-orange-400 group-hover:to-amber-400 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">Household Products</h3>
              <p className="text-amber-200 text-sm leading-relaxed">Tampilkan model yang berinteraksi dengan produk rumah tangga Anda.</p>
            </button>

            {/* Ubah Pose */}
            <button
              onClick={() => setCurrentView('change-pose')}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 hover:border-violet-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:from-violet-400 group-hover:to-purple-400 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">Ubah Pose</h3>
              <p className="text-violet-200 text-sm leading-relaxed">Hasilkan berbagai pose dinamis dari satu foto.</p>
            </button>

            {/* Kustomisasi Tema */}
            <button
              onClick={() => setCurrentView('customize-theme')}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 hover:border-gray-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-slate-500 to-gray-500 rounded-2xl flex items-center justify-center mb-4 group-hover:from-slate-400 group-hover:to-gray-400 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">Kustomisasi Tema</h3>
              <p className="text-gray-200 text-sm leading-relaxed">Ubah foto Anda menjadi berbagai tema, seperti fantasi atau Cyberpunk.</p>
            </button>

            {/* Produk Motor */}
            <button
              onClick={() => setCurrentView('motorcycle')}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 hover:border-orange-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:from-red-400 group-hover:to-orange-400 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">Produk Motor</h3>
              <p className="text-orange-200 text-sm leading-relaxed">Gabungkan foto AI Anda dengan motor untuk gambar yang keren.</p>
            </button>

            {/* Produk F&B */}
            <button
              onClick={() => setCurrentView('fnb')}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 hover:border-green-400 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-3xl"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">Produk F&B</h3>
              <p className="text-green-200 text-sm leading-relaxed">Tampilkan model Anda sedang menikmati makanan atau minuman.</p>
            </button>
            </div>
          </div>
        </main>
      </div>
      <Modal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </>
  );
};

// Original Lookbook and B-roll interface component
const OriginalInterface: React.FC<{
  mode: GenerationMode;
  setMode: (mode: GenerationMode) => void;
  setCurrentView: (view: 'main' | 'profile' | 'virtual-tryon' | 'product-backgrounds' | 'skincare' | 'household' | 'change-pose' | 'customize-theme' | 'motorcycle' | 'fnb' | 'lookbook' | 'broll') => void;
  modelImage: File | null;
  setModelImage: (file: File | null) => void;
  productImage: File | null;
  setProductImage: (file: File | null) => void;
  theme: string;
  setTheme: (theme: string) => void;
  lighting: string;
  setLighting: (lighting: string) => void;
  selectedStyleId: string;
  setSelectedStyleId: (id: string) => void;
  generatedImages: GeneratedImage[];
  setGeneratedImages: (images: GeneratedImage[]) => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  zoomedImage: string | null;
  setZoomedImage: (src: string | null) => void;
  apiKey: string;
  count: number;
  setCount: (count: number) => void;
  aspect: string;
  setAspect: (aspect: string) => void;
  history: GeneratedImage[][];
  setHistory: (history: GeneratedImage[][]) => void;
  faceConsistency: boolean;
  setFaceConsistency: (consistency: boolean) => void;
  faceQuality: string;
  setFaceQuality: (quality: string) => void;
  handleGenerate: () => void;
  handleGeneratePrompt: (image: GeneratedImage) => void;
  isGenerationDisabled: boolean;
  styleOptions: StylePreset[];
  selectedStyle: StylePreset;
  PHOTOSHOOT_THEMES: string[];
  LIGHTING_STYLES: string[];
}> = ({
  mode, setMode, setCurrentView, modelImage, setModelImage, productImage, setProductImage,
  theme, setTheme, lighting, setLighting, selectedStyleId, setSelectedStyleId,
  generatedImages, setGeneratedImages, isLoading, error, setError,
  zoomedImage, setZoomedImage, apiKey, count, setCount, aspect, setAspect,
  history, setHistory, faceConsistency, setFaceConsistency, faceQuality, setFaceQuality,
  handleGenerate, handleGeneratePrompt, isGenerationDisabled, styleOptions, selectedStyle,
  PHOTOSHOOT_THEMES, LIGHTING_STYLES
}) => {
  const ModeButton = ({ value }: { value: GenerationMode }) => (
    <button
      onClick={() => setMode(value)}
      className={`p-3 rounded-lg border transition-all duration-200 text-left ${
        mode === value
          ? 'border-blue-500 bg-blue-500/10 shadow-lg'
          : 'border-slate-700 bg-slate-700/50 hover:border-slate-600'
      }`}
    >
      <p className="text-sm font-semibold text-white">
        {value === GenerationMode.Lookbook ? 'Lookbook' : 
         value === GenerationMode.Broll ? 'B-roll' : 'Profile Picture'}
      </p>
    </button>
  );

  const SelectInput = ({ label, value, onChange, options }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const StyleOptionButton = ({ preset }: { preset: StylePreset }) => (
      <button
        onClick={() => setSelectedStyleId(preset.id)}
      className={`p-3 rounded-lg border transition-all duration-200 text-left ${
        selectedStyleId === preset.id
          ? 'border-blue-500 bg-blue-500/10 shadow-lg'
          : 'border-slate-700 bg-slate-700/50 hover:border-slate-600'
      }`}
    >
      <p className="text-sm font-semibold text-white mb-1">{preset.name}</p>
        <p className="text-xs text-gray-300 mt-1 leading-snug">{preset.description ?? preset.prompt}</p>
      </button>
    );

  return (
    <>
      <div className="min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setCurrentView('main')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-slate-700 text-gray-200 border border-slate-600 hover:bg-slate-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Main
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">AI Product Showcase</h1>
          <p className="text-gray-400 mt-2">Create stunning product visuals in seconds</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel: Controls */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700 flex flex-col gap-6 h-fit">
            
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Select Generation Mode</h2>
              <p className="text-sm text-gray-400 mb-3">Choose what you want to create.</p>
              <div className="grid grid-cols-3 gap-2">
                <ModeButton value={GenerationMode.Lookbook} />
                <ModeButton value={GenerationMode.Broll} />
                <ModeButton value={GenerationMode.ProfilePicture} />
              </div>
            </div>

            <div className={`grid gap-4 ${mode === GenerationMode.Lookbook ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {mode === GenerationMode.Lookbook && (
                <ImageUploader id="model-upload" title="1. Upload Model" description="A clear, high-quality photo of a person's face for best results." onImageUpload={setModelImage} onImageRemove={() => setModelImage(null)} isModelUpload={true} />
              )}
              <ImageUploader id="product-upload" title={mode === GenerationMode.Lookbook ? "2. Upload Product" : "1. Upload Product"} description="Clothing, bags, shoes, etc." onImageUpload={setProductImage} onImageRemove={() => setProductImage(null)} />
            </div>

            {mode === GenerationMode.Lookbook && modelImage && productImage && (
              <div className="p-3 bg-purple-900/20 border border-purple-600/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-purple-200 font-medium">Ready to Generate</p>
                </div>
                <p className="text-xs text-purple-300">
                  Model from "Upload Model" will wear the clothing from "Upload Product" in your chosen style.
                </p>
              </div>
            )}

            {mode === GenerationMode.Lookbook && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Face Preservation Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Face Consistency</label>
                      <p className="text-xs text-gray-400">Maintain the model's facial features and identity</p>
                    </div>
                    <button
                      onClick={() => setFaceConsistency(!faceConsistency)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        faceConsistency ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          faceConsistency ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Face Quality Priority</label>
                    <div className="flex gap-2">
                      {['high', 'medium', 'balanced'].map(quality => (
                        <button
                          key={quality}
                          onClick={() => setFaceQuality(quality)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${
                            faceQuality === quality
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600'
                          }`}
                        >
                          {quality === 'high' ? 'High Quality' : quality === 'medium' ? 'Medium' : 'Balanced'}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {faceQuality === 'high' ? 'Prioritizes facial accuracy over other elements' :
                       faceQuality === 'medium' ? 'Balances facial accuracy with overall composition quality' :
                       'Balances all aspects equally'}
                    </p>
                  </div>

                  {modelImage && faceConsistency && (
                    <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-green-200 font-medium">Face Preservation Active</p>
                      </div>
                      <p className="text-xs text-green-300 mt-1">
                        The model's facial features will be preserved in all generated images.
                      </p>
                    </div>
                  )}

                  {productImage && (
                    <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-blue-200 font-medium">Product Accuracy Mode</p>
                      </div>
                      <p className="text-xs text-blue-300 mt-1">
                        The product will remain exactly the same - only pose and background will change.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-white mb-1">
                {mode === GenerationMode.Lookbook ? "4. Customize Look" : "2. Customize Look"}
              </h2>
              <p className="text-sm text-gray-400 mb-3">Pick a vibe preset, then fine-tune the theme and lighting.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Vibe Preset</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                    {styleOptions.map((preset) => (
                      <StyleOptionButton preset={preset} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <SelectInput label="Photoshoot Theme" value={theme} onChange={(e) => setTheme(e.target.value)} options={PHOTOSHOOT_THEMES} />
                  <SelectInput label="Lighting Style" value={lighting} onChange={(e) => setLighting(e.target.value)} options={LIGHTING_STYLES} />
                </div>
                <div className="flex items-center gap-3">
                  <label className="block text-sm font-medium text-gray-300">Aspect Ratio</label>
                  <div className="flex gap-2">
                    {['1/1','4/5','3/4','9/16','16/9'].map(r => (
                      <button key={r} onClick={() => setAspect(r)} type="button" className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${aspect===r? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600'}`}>{r}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="block text-sm font-medium text-gray-300">Jumlah Gambar</label>
                  <div className="flex gap-2">
                    {[3,6,9,12].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCount(n)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${count===n? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600'}`}
                      >{n}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {mode === GenerationMode.Lookbook && (
              <div className="p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-200 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Tips for Best Results
                </h3>
                <ul className="text-xs text-blue-300 space-y-1">
                  <li>• Use high-resolution model photos (400x400+ pixels)</li>
                  <li>• Ensure the model's face is clearly visible and well-lit</li>
                  <li>• Upload clear product images with visible details</li>
                  <li>• Try "Studio Kreatif" or "Editorial Fashion" for unique results</li>
                  <li>• Enable Face Consistency for identical facial features</li>
                  <li>• Each generation creates NEW images with different poses</li>
                  <li>• Model from "Upload Model" will wear clothing from "Upload Product"</li>
                </ul>
              </div>
            )}

            <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerationDisabled}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-gray-400 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                `Create ${mode}`
              )}
            </button>
            <button
              onClick={() => { setGeneratedImages([]); setError(null); }}
              className="min-w-[140px] bg-slate-700 text-gray-200 font-semibold py-3 px-4 rounded-lg border border-slate-600 hover:bg-slate-600"
            >Reset</button>
            <button
              onClick={() => {
                // randomize style, theme, lighting
                const styles = styleOptions;
                const rStyle = styles[Math.floor(Math.random()*styles.length)];
                setSelectedStyleId(rStyle.id);
                setTheme(PHOTOSHOOT_THEMES[Math.floor(Math.random()*PHOTOSHOOT_THEMES.length)]);
                setLighting(LIGHTING_STYLES[Math.floor(Math.random()*LIGHTING_STYLES.length)]);
              }}
              className="min-w-[140px] bg-slate-700 text-gray-200 font-semibold py-3 px-4 rounded-lg border border-slate-600 hover:bg-slate-600"
            >Random</button>
            </div>
          </div>

          {/* Right Panel: Gallery */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold">Your {mode === GenerationMode.Lookbook ? 'Fashion Lookbook' : 'Product B-roll'}!</h2>
               {generatedImages.length>0 && (
                 <div className="flex gap-2">
                   <button
                     onClick={() => {
                       const text = generatedImages.map(g=>g.prompt).join('\n\n');
                       navigator.clipboard.writeText(text);
                     }}
                     className="px-3 py-2 text-xs font-semibold rounded-md bg-slate-700 text-gray-200 border border-slate-600 hover:bg-slate-600"
                   >Copy Semua Prompt</button>
                   <button
                     onClick={() => {
                       const veo3Prompts = generatedImages.map(g => generateVeo3Prompt(g, mode));
                       const text = veo3Prompts.join('\n\n' + '='.repeat(50) + '\n\n');
                       navigator.clipboard.writeText(text);
                       alert('Semua Prompt Veo 3 berhasil di-copy ke clipboard!');
                     }}
                     className="px-3 py-2 text-xs font-semibold rounded-md bg-purple-600 text-white border border-purple-500 hover:bg-purple-500"
                   >Copy All Prompt Veo 3</button>
                   <button
                     onClick={() => {
                       generatedImages.forEach(g => {
                         const link = document.createElement('a');
                         link.href = g.videoSrc || g.src;
                         link.download = `ai-showcase-${g.id}.${g.videoSrc ? 'mp4' : 'png'}`;
                         document.body.appendChild(link);
                         link.click();
                         document.body.removeChild(link);
                       });
                     }}
                     className="px-3 py-2 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-500"
                   >Download Semua</button>
                 </div>
               )}
            </div>
            {isLoading && generatedImages.length === 0 && (
                 <div className="text-center text-gray-400 mt-10">
                    <p className="mb-4 text-lg">✨ AI is crafting your visuals... ✨</p>
                    <p className="text-sm">This can take a moment, especially for high-quality generations.</p>
                 </div>
            )}
             {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}

            {!isLoading && generatedImages.length === 0 && !error && (
              <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-semibold">Your generated {mode} will appear here.</p>
                <p className="text-sm">Upload your assets and start creating!</p>
              </div>
            )}
            
            <div className={`grid ${aspect==='1/1' ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'} gap-4`}>
              {generatedImages.map((img) => (
                <div key={img.id} className={aspect==='1/1' ? 'aspect-square' : aspect==='4/5' ? 'aspect-[4/5]' : aspect==='3/4' ? 'aspect-[3/4]' : aspect==='16/9' ? 'aspect-video' : 'aspect-[9/16]'}>
                  <ImageCard
                    image={img}
                    onZoom={setZoomedImage}
                    onGeneratePrompt={handleGeneratePrompt}
                    onDelete={(id)=>setGeneratedImages(list=>list.filter(g=>g.id!==id))}
                    onToggleFavorite={(id)=>setGeneratedImages(list=>list.map(g=>g.id===id?{...g, isFavorite: !g.isFavorite}:g))}
                  />
                </div>
              ))}
            </div>

            {history.length>0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Riwayat Terakhir</h3>
                <div className="flex flex-wrap gap-2">
                  {history.map((h,idx)=> (
                    <button key={idx} onClick={()=> setGeneratedImages(h)} className="px-3 py-1.5 text-xs rounded-md bg-slate-700 text-gray-200 border border-slate-600 hover:bg-slate-600">Batch {idx+1}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Modal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </>
  );
};

export default App;