import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GenerationMode, GeneratedImage, StylePreset } from './types';
import { PHOTOSHOOT_THEMES, LIGHTING_STYLES, LOOKBOOK_STYLE_PRESETS, BROLL_STYLE_PRESETS } from './constants';
import { generateShowcaseImages, generateVideoFromImage, generateVeo3Prompt } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ImageCard from './components/ImageCard';
import Modal from './components/Modal';
import ApiKeyInput from './components/ApiKeyInput';
import ProfilePictureGenerator from './components/ProfilePictureGenerator';

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.Lookbook);
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

  const styleOptions = useMemo(() => (
    mode === GenerationMode.Lookbook ? LOOKBOOK_STYLE_PRESETS : BROLL_STYLE_PRESETS
  ), [mode]);

  useEffect(() => {
    if (!styleOptions.length) {
      return;
    }
    if (!styleOptions.some((option) => option.id === selectedStyleId)) {
      setSelectedStyleId(styleOptions[0].id);
    }
  }, [styleOptions, selectedStyleId]);

  const selectedStyle = useMemo<StylePreset>(() => {
    return (styleOptions.find((option) => option.id === selectedStyleId) ?? styleOptions[0]) as StylePreset;
  }, [styleOptions, selectedStyleId]);

  const isGenerationDisabled = useMemo(() => {
    if (isLoading) return true;
    if (mode === GenerationMode.Lookbook) {
      return !modelImage || !productImage;
    }
    return !productImage;
  }, [isLoading, mode, modelImage, productImage]);

  const handleGenerate = useCallback(async () => {
    if (isGenerationDisabled) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]); // Clear previous images immediately

    try {
      if (!productImage) throw new Error("Product image is required.");
      const results = await generateShowcaseImages(mode, theme, lighting, productImage, modelImage, apiKey, count);
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
  }, [isGenerationDisabled, mode, theme, lighting, productImage, modelImage]);

  const handleGeneratePrompt = useCallback((imageId: string) => {
    const imageToProcess = generatedImages.find(img => img.id === imageId);
    if (!imageToProcess) return;

    const veo3Prompt = generateVeo3Prompt(imageToProcess, mode);
    navigator.clipboard.writeText(veo3Prompt);
    alert('Veo 3 Prompt berhasil di-copy ke clipboard!\n\nPaste di Google Veo untuk generate video dengan narasi bahasa Indonesia.');
  }, [generatedImages, mode]);

  const ModeButton: React.FC<{ value: GenerationMode }> = ({ value }) => (
    <button
      onClick={() => setMode(value)}
      className={`w-full py-2.5 text-sm font-semibold rounded-md transition-colors ${
        mode === value
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
      }`}
    >
      {value}
    </button>
  );

  const SelectInput: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
  }> = ({ label, value, onChange, options }) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-slate-700 text-white p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const StyleOptionButton: React.FC<{ preset: StylePreset }> = ({ preset }) => {
    const isActive = selectedStyleId === preset.id;
    return (
      <button
        type="button"
        onClick={() => setSelectedStyleId(preset.id)}
        className={`text-left p-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive ? 'border-blue-500 bg-blue-500/10 shadow-lg' : 'border-slate-700 bg-slate-700/50 hover:border-slate-600'}`}
      >
        <p className="text-sm font-semibold text-white">{preset.name}</p>
        <p className="text-xs text-gray-300 mt-1 leading-snug">{preset.description ?? preset.prompt}</p>
      </button>
    );
  };

  // If Profile Picture mode is selected, render the ProfilePictureGenerator component
  if (mode === GenerationMode.ProfilePicture) {
    return <ProfilePictureGenerator apiKey={apiKey} onBack={() => setMode(GenerationMode.Lookbook)} />;
  }

  return (
    <>
      <div className="min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">AI Product Showcase</h1>
          <p className="text-gray-400 mt-2">Create stunning product visuals in seconds</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel: Controls */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700 flex flex-col gap-6 h-fit">
            <ApiKeyInput onApiKeyChange={setApiKey} />
            
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
                <ImageUploader id="model-upload" title="1. Upload Model" description="A clear photo of a person." onImageUpload={setModelImage} onImageRemove={() => setModelImage(null)} />
              )}
              <ImageUploader id="product-upload" title={mode === GenerationMode.Lookbook ? "2. Upload Product" : "1. Upload Product"} description="Clothing, bags, shoes, etc." onImageUpload={setProductImage} onImageRemove={() => setProductImage(null)} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-1">
                {mode === GenerationMode.Lookbook ? "3. Customize Look" : "2. Customize Look"}
              </h2>
              <p className="text-sm text-gray-400 mb-3">Pick a vibe preset, then fine-tune the theme and lighting.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Vibe Preset</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                    {styleOptions.map((preset) => (
                      <StyleOptionButton key={preset.id} preset={preset} />
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
