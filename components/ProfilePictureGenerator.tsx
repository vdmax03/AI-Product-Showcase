import React, { useState, useCallback, useMemo } from 'react';
import { GeneratedImage, Gender, ShotType, ProfileStyle } from '../types';
import { generateProfilePictures } from '../services/geminiService';
import { PROFILE_PICTURE_STYLES, PROFILE_PICTURE_SHOT_TYPES, PROFILE_PICTURE_GENDERS } from '../constants';
import ImageUploader from './ImageUploader';
import ImageCard from './ImageCard';
import Modal from './Modal';

interface ProfilePictureGeneratorProps {
  apiKey: string;
  onBack: () => void;
}

const ProfilePictureGenerator: React.FC<ProfilePictureGeneratorProps> = ({ apiKey, onBack }) => {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [gender, setGender] = useState<Gender>(Gender.Female);
  const [shotType, setShotType] = useState<ShotType>(ShotType.UpperBody);
  const [style, setStyle] = useState<ProfileStyle>(ProfileStyle.MixedStyles);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const isGenerationDisabled = useMemo(() => {
    return isLoading || !userImage;
  }, [isLoading, userImage]);

  const handleGenerate = useCallback(async () => {
    if (isGenerationDisabled) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]); // Clear previous images immediately

    try {
      if (!userImage) throw new Error("User image is required.");
      const results = await generateProfilePictures(userImage, gender, shotType, style, apiKey, 20);
      if (results.length === 0) {
        throw new Error("The model did not return any images. Please try a different combination or check your API key.");
      }
      setGeneratedImages(
        results.map((img, index) => ({ ...img, id: `profile-${Date.now()}-${index}` }))
      );
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [isGenerationDisabled, userImage, gender, shotType, style, apiKey]);

  const handleGenerateMore = useCallback(async () => {
    if (!userImage || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await generateProfilePictures(userImage, gender, shotType, style, apiKey, 3);
      if (results.length === 0) {
        throw new Error("The model did not return any images. Please try a different combination or check your API key.");
      }
      const newImages = results.map((img, index) => ({ 
        ...img, 
        id: `profile-${Date.now()}-${index}` 
      }));
      setGeneratedImages(prev => [...prev, ...newImages]);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [userImage, gender, shotType, style, apiKey, isLoading]);

  const handleDownloadAll = useCallback(async () => {
    if (generatedImages.length === 0) return;

    try {
      // Create a simple download for each image
      generatedImages.forEach((img, index) => {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = `vdmax-profile-${index + 1}-${img.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } catch (error) {
      console.error('Error downloading images:', error);
      setError('Failed to download images. Please try again.');
    }
  }, [generatedImages]);

  const OptionButton: React.FC<{ 
    value: string; 
    isSelected: boolean; 
    onClick: () => void;
    label: string;
  }> = ({ value, isSelected, onClick, label }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        isSelected
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-slate-700 text-gray-200 border border-slate-600 hover:bg-slate-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Main
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">VDMAX AI Profile Generator</h1>
          <p className="text-gray-400 mt-2">Create stunning profile pictures in seconds</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel: Controls */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700 flex flex-col gap-6 h-fit">
            
            {/* Upload Section */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">1 Upload Photo</h2>
              <ImageUploader 
                id="profile-upload" 
                title="" 
                description="A clear, close-up photo of your face yields better results." 
                onImageUpload={setUserImage} 
                onImageRemove={() => setUserImage(null)} 
              />
            </div>

            {/* Generation Options */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">2 Generation Options</h2>
              
              {/* Gender Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <div className="flex gap-2">
                  {PROFILE_PICTURE_GENDERS.map((g) => (
                    <OptionButton
                      key={g}
                      value={g}
                      isSelected={gender === g}
                      onClick={() => setGender(g as Gender)}
                      label={g}
                    />
                  ))}
                </div>
              </div>

              {/* Shot Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Shot Type</label>
                <div className="flex gap-2 flex-wrap">
                  {PROFILE_PICTURE_SHOT_TYPES.map((shot) => (
                    <OptionButton
                      key={shot}
                      value={shot}
                      isSelected={shotType === shot}
                      onClick={() => setShotType(shot as ShotType)}
                      label={shot}
                    />
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                <div className="flex gap-2 flex-wrap">
                  {PROFILE_PICTURE_STYLES.map((s) => (
                    <OptionButton
                      key={s}
                      value={s}
                      isSelected={style === s}
                      onClick={() => setStyle(s as ProfileStyle)}
                      label={s}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">3 Generate Profile Pictures</h2>
              <p className="text-sm text-gray-400 mb-4">
                Click the button below to generate 20 unique studio profile pictures with your selected options.
              </p>
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
                  'Start Generation'
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Tip: If you're not satisfied, try again to get different styles.
              </p>
            </div>
          </div>

          {/* Right Panel: Gallery */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Gallery</h2>
              {generatedImages.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const text = generatedImages.map(g => g.prompt).join('\n\n');
                      navigator.clipboard.writeText(text);
                    }}
                    className="px-3 py-2 text-xs font-semibold rounded-md bg-slate-700 text-gray-200 border border-slate-600 hover:bg-slate-600"
                  >
                    Copy All Prompts
                  </button>
                  <button
                    onClick={handleDownloadAll}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-green-600 text-white hover:bg-green-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download All ({generatedImages.length})
                  </button>
                  <button
                    onClick={handleGenerateMore}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate 3 More
                  </button>
                </div>
              )}
            </div>

            {isLoading && generatedImages.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="mb-2 text-lg">✨ AI is crafting your profile pictures... ✨</p>
                <p className="text-sm">Generating 20 unique styles - this should take about 2-3 minutes</p>
              </div>
            )}

            {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg mb-4">{error}</div>}

            {!isLoading && generatedImages.length === 0 && !error && (
              <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-semibold">Your generated profile pictures will appear here.</p>
                <p className="text-sm">Upload your photo and start creating!</p>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-4">
              {generatedImages.map((img) => (
                <div key={img.id} className="aspect-square">
                  <ImageCard
                    image={img}
                    onZoom={setZoomedImage}
                    onGenerateVideo={() => {}} // Profile pictures don't need video generation
                    onDelete={(id) => setGeneratedImages(list => list.filter(g => g.id !== id))}
                    onToggleFavorite={(id) => setGeneratedImages(list => list.map(g => g.id === id ? { ...g, isFavorite: !g.isFavorite } : g))}
                  />
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

export default ProfilePictureGenerator;
