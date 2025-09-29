import React, { useState, useCallback, useMemo } from 'react';
import { GeneratedImage } from '../types';
import { generateShowcaseImages } from '../services/geminiService';
import ImageUploader from './ImageUploader';
import ImageCard from './ImageCard';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
interface MotorcycleProductsProps {
  apiKey: string;
  onBack: () => void;
}

const MOTORCYCLE_STYLES = [
  { id: 'urban-riding', name: 'Urban Riding', prompt: 'Model riding motorcycle in urban city setting with modern backdrop' },
  { id: 'highway-cruising', name: 'Highway Cruising', prompt: 'Model on motorcycle on open highway with scenic views' },
  { id: 'off-road-adventure', name: 'Off-Road Adventure', prompt: 'Model on motorcycle in rugged off-road terrain and nature' },
  { id: 'racing-track', name: 'Racing Track', prompt: 'Model on motorcycle at racing track with professional racing environment' },
  { id: 'coastal-ride', name: 'Coastal Ride', prompt: 'Model on motorcycle along coastal roads with ocean views' },
  { id: 'mountain-touring', name: 'Mountain Touring', prompt: 'Model on motorcycle in mountain landscapes with scenic routes' },
];

const MotorcycleProducts: React.FC<MotorcycleProductsProps> = ({ apiKey, onBack }) => {
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(MOTORCYCLE_STYLES[0].id);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [count, setCount] = useState<number>(6);  
  // Enhancement states removed

  const isGenerationDisabled = useMemo(() => {
    return isLoading || !modelImage || !productImage;
  }, [isLoading, modelImage, productImage]);

  const selectedMotorcycleStyle = useMemo(() => {
    return MOTORCYCLE_STYLES.find(style => style.id === selectedStyle) || MOTORCYCLE_STYLES[0];
  }, [selectedStyle]);

  const handleGenerate = useCallback(async () => {
    if (isGenerationDisabled) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      if (!modelImage || !productImage) throw new Error("Both model and product images are required.");
      const results = await generateShowcaseImages(
        'Lookbook' as any, 
        'Motorcycle Product Showcase', 
        'Dynamic Outdoor Lighting', 
        productImage, 
        modelImage, 
        apiKey, 
        count, 
        true, 
        'high',
        { prompt: selectedMotorcycleStyle.prompt, name: selectedMotorcycleStyle.name }
      );
      
      if (results.length === 0) {
        throw new Error("No images were generated. Please try again.");
      }
      
      setGeneratedImages(
        results.map((img, index) => ({ ...img, id: `motorcycle-${Date.now()}-${index}` }))
      );
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [isGenerationDisabled, productImage, modelImage, apiKey, count, selectedMotorcycleStyle]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 text-white p-4 sm:p-6 lg:p-8 font-sans">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Main
            </button>
          </div>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Motorcycle Products
            </h1>
            <p className="text-orange-200 mt-3 text-lg">Showcase motorcycle products with dynamic riding scenes</p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-8 h-fit">
            
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mb-3">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Upload Photos</h2>
                <p className="text-orange-200 text-sm">Upload model and motorcycle product photos</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <ImageUploader 
                    id="model-upload" 
                    title="" 
                    description="Clear photo of a person" 
                    onImageUpload={setModelImage} 
                    onImageRemove={() => setModelImage(null)} 
                    isModelUpload={true}
                  />
                </div>
                <div>
                  <ImageUploader 
                    id="product-upload" 
                    title="" 
                    description="Your motorcycle product" 
                    onImageUpload={setProductImage} 
                    onImageRemove={() => setProductImage(null)} 
                  />
                </div>
              </div>
            </div>

            {/* Motorcycle Style Selection */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full mb-3">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Choose Riding Style</h2>
                <p className="text-orange-200 text-sm">Select the type of riding scene you want</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {MOTORCYCLE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                      selectedStyle === style.id
                        ? 'border-red-500 bg-red-500/20 shadow-lg transform scale-105'
                        : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/20'
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{style.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generation Options */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-600 rounded-full mb-3">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Generation Options</h2>
                <p className="text-orange-200 text-sm">Choose how many riding scenes to generate</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="flex gap-2">
                  {[1, 2, 3, 6, 9, 12].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCount(n)}
                      className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-300 ${
                        count === n
                          ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white border-transparent shadow-lg'
                          : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerationDisabled}
              className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 ease-in-out hover:from-red-600 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:text-gray-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
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
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Riding Scenes
                </>
              )}
            </button>
          </div>

          {/* Right Panel: Gallery */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">🏍️ Riding Scenes</h2>
                <p className="text-orange-200 text-sm">Dynamic motorcycle product showcases</p>
              </div>
              {generatedImages.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      generatedImages.forEach((img, index) => {
                        const link = document.createElement('a');
                        link.href = img.src;
                        link.download = `motorcycle-scene-${index + 1}-${img.id}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      });
                    }}
                    className="px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download All
                  </button>
                </div>
              )}
            </div>

                        {isLoading && generatedImages.length === 0 && (
              <LoadingSpinner 
                size="lg" 
                text="AI is generating your content..." 
                
              />
            )}

            {error && (
              <div className="text-center text-red-300 bg-red-500/20 p-6 rounded-2xl mb-6 border border-red-500/30">
                <svg className="w-8 h-8 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {!isLoading && generatedImages.length === 0 && !error && (
              <div className="text-center text-white mt-16 flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-bold text-lg mb-2">Your riding scenes will appear here</p>
                <p className="text-orange-200">Upload your photos and start generating!</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {generatedImages.map((img) => (
                <div key={img.id} className="aspect-square group">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <ImageCard
                      image={img}
                      onZoom={setZoomedImage}
                      onGeneratePrompt={() => {}}
                      onDelete={(id) => setGeneratedImages(list => list.filter(g => g.id !== id))}
                      onToggleFavorite={(id) => setGeneratedImages(list => list.map(g => g.id === id ? { ...g, isFavorite: !g.isFavorite } : g))}
                    />
                  </div>
                </div>
              ))}
            

            </div>
          </div>
        </main>
      </div>
      <Modal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </>
  );
};

export default MotorcycleProducts;