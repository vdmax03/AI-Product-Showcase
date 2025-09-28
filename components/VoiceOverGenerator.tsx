import React, { useState, useCallback, useMemo } from 'react';
import { GeneratedImage } from '../types';
import { generateVoiceOverText } from '../services/geminiService';
import MultiImageUploader from './MultiImageUploader';
import ImageCard from './ImageCard';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

interface VoiceOverGeneratorProps {
  apiKey: string;
  onBack: () => void;
}

const VOICE_OVER_STYLES = [
  { 
    id: 'fashion-elegant', 
    name: 'Fashion Elegant', 
    prompt: 'Generate elegant fashion voice over narrative focusing on style, comfort, and sophistication' 
  },
  { 
    id: 'beauty-luxury', 
    name: 'Beauty Luxury', 
    prompt: 'Create luxurious beauty product voice over emphasizing premium quality and results' 
  },
  { 
    id: 'lifestyle-casual', 
    name: 'Lifestyle Casual', 
    prompt: 'Generate casual lifestyle voice over highlighting comfort and everyday usability' 
  },
  { 
    id: 'food-appetizing', 
    name: 'Food Appetizing', 
    prompt: 'Create appetizing food voice over focusing on taste, freshness, and dining experience' 
  },
  { 
    id: 'tech-innovative', 
    name: 'Tech Innovative', 
    prompt: 'Generate innovative tech product voice over emphasizing features and cutting-edge technology' 
  },
  { 
    id: 'home-cozy', 
    name: 'Home Cozy', 
    prompt: 'Create cozy home product voice over highlighting comfort, warmth, and family moments' 
  },
];


const VoiceOverGenerator: React.FC<VoiceOverGeneratorProps> = ({ apiKey, onBack }) => {
  const [productImages, setProductImages] = useState<File[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>(VOICE_OVER_STYLES[0].id);
  const [generatedNarratives, setGeneratedNarratives] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [narrativeLength, setNarrativeLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [targetAudience, setTargetAudience] = useState<string>('umum');
  const [tone, setTone] = useState<'friendly' | 'professional' | 'casual' | 'luxury'>('friendly');
  
  // Enhancement states
  const [enhancementSettings, setEnhancementSettings] = useState<any>({});

  const selectedStyleObj = useMemo(() => 
    VOICE_OVER_STYLES.find(s => s.id === selectedStyle) || VOICE_OVER_STYLES[0]
  , [selectedStyle]);


  const isGenerationDisabled = useMemo(() => {
    return isLoading || productImages.length === 0 || !apiKey;
  }, [isLoading, productImages, apiKey]);

  const handleGenerate = useCallback(async () => {
    if (isGenerationDisabled) return;

    setIsLoading(true);
    setIsAnalyzing(true);
    setIsGenerating(false);
    setError(null);

    try {
      // Step 1: Analyze images and generate text
      setIsAnalyzing(false);
      setIsGenerating(true);

      console.log('Starting narrative generation with:', {
        productImages: productImages.length,
        stylePrompt: selectedStyleObj.prompt,
        template: selectedTemplateObj.template,
        customPrompt,
        narrativeLength,
        targetAudience,
        tone,
        hasApiKey: !!apiKey
      });

      const result = await generateVoiceOverText(
        productImages,
        selectedStyleObj.prompt,
        'Simple narrative template',
        customPrompt,
        narrativeLength,
        targetAudience,
        tone,
        apiKey
      );

      console.log('Narrative generation result:', result);

      const newNarrative: GeneratedImage = {
        id: `voiceover-${Date.now()}`,
        src: result.imageUrl || '',
        prompt: result.narrative,
        isFavorite: false,
        videoSrc: undefined
      };

      setGeneratedNarratives(prev => [newNarrative, ...prev]);

    } catch (err: any) {
      console.error('Narrative generation failed:', err);
      let errorMessage = 'Narrative generation failed';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.error) {
        errorMessage = err.error;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
      setIsGenerating(false);
    }
  }, [isGenerationDisabled, productImages, selectedStyleObj, customPrompt, narrativeLength, targetAudience, tone, apiKey]);



  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const downloadNarrative = useCallback((narrative: string, index: number) => {
    const blob = new Blob([narrative], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-over-narrative-${index + 1}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);



  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">📝 Narrative Generator</h1>
              <p className="text-purple-200 text-lg">Generate compelling product narratives from your images</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <div className="inline-flex items-center px-3 py-1 bg-purple-500/20 rounded-full text-purple-200 text-sm">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                  Step 1: Image Analysis
                </div>
                <div className="inline-flex items-center px-3 py-1 bg-blue-500/20 rounded-full text-blue-200 text-sm">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                  Step 2: Narrative Generation
                </div>
              </div>
            </div>
            <button
              onClick={onBack}
              className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 hover:border-purple-400 transition-all duration-300 text-white font-medium"
            >
              ← Kembali
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Controls */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">📸 Upload Product Images</h3>
                <MultiImageUploader
                  onImageChange={(files) => setProductImages(files)}
                  multiple={true}
                  accept="image/*"
                  className="w-full"
                  maxFiles={5}
                />
                {productImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-purple-200 text-sm mb-2">
                      {productImages.length} image(s) uploaded
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {productImages.map((file, index) => (
                        <div key={index} className="bg-white/20 px-3 py-1 rounded-lg text-white text-sm">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Style Selection */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">🎨 Voice Over Style</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {VOICE_OVER_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                        selectedStyle === style.id
                          ? 'border-purple-500 bg-purple-500/20 shadow-lg'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <h4 className="text-white font-medium mb-1">{style.name}</h4>
                      <p className="text-purple-200 text-sm">{style.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>


              {/* Advanced Settings */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">⚙️ Advanced Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Narrative Length
                    </label>
                    <select
                      value={narrativeLength}
                      onChange={(e) => setNarrativeLength(e.target.value as 'short' | 'medium' | 'long')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="short">Short (50-100 words)</option>
                      <option value="medium">Medium (100-200 words)</option>
                      <option value="long">Long (200-300 words)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g., wanita muda, profesional, keluarga"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as 'friendly' | 'professional' | 'casual' | 'luxury')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="friendly">Friendly</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Custom Prompt (Optional)
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Add specific instructions for the voice over..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerationDisabled}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>
                      {isAnalyzing ? '🔍 Analyzing Images...' : 
                       isGenerating ? '📝 Generating Narrative...' : 
                       'Processing...'}
                    </span>
                  </div>
                ) : (
                  '📝 Generate Narrative'
                )}
              </button>

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Generated Narratives */}
              {generatedNarratives.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">📝 Generated Narratives</h3>
                  {generatedNarratives.map((narrative, index) => (
                    <div key={narrative.id} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-white font-medium">Narrative #{index + 1}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(narrative.prompt)}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-3 py-1 rounded-lg text-sm transition-colors"
                          >
                            📋 Copy
                          </button>
                          <button
                            onClick={() => downloadNarrative(narrative.prompt, index)}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-200 px-3 py-1 rounded-lg text-sm transition-colors"
                          >
                            💾 Download
                          </button>
                        </div>
                      </div>
                      <div className="bg-black/20 p-4 rounded-xl">
                        <p className="text-purple-100 leading-relaxed whitespace-pre-wrap">
                          {narrative.prompt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
      <Modal src={zoomedImage} onClose={() => setZoomedImage(null)} />
    </>
  );
};

export default VoiceOverGenerator;
