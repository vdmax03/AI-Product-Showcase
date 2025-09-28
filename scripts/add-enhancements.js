const fs = require('fs');
const path = require('path');

const components = [
  'SkincareApplicator',
  'HouseholdProducts', 
  'ChangePose',
  'CustomizeTheme',
  'MotorcycleProducts',
  'FoodBeverageProducts',
  'ProfilePictureGenerator'
];

const enhancementImports = `import LoadingSpinner from './LoadingSpinner';
import BatchProcessor from './BatchProcessor';
import ImageEnhancer from './ImageEnhancer';
import TemplateGallery from './TemplateGallery';
import AdvancedCustomizer from './AdvancedCustomizer';`;

const enhancementStates = `  
  // Enhancement states
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [advancedSettings, setAdvancedSettings] = useState<any>({});
  const [enhancementSettings, setEnhancementSettings] = useState<any>({});`;

const enhancementFunctions = `
  // Batch processing function
  const handleBatchGenerate = useCallback(async (batchCount: number) => {
    if (!apiKey) {
      setError('API Key is required');
      return;
    }

    setIsBatchProcessing(true);
    setBatchProgress(0);
    setError(null);

    try {
      const batchResults: GeneratedImage[] = [];
      
      for (let i = 0; i < batchCount; i++) {
        setBatchProgress((i / batchCount) * 100);
        
        // Generate single batch - customize this based on component
        const result = await generateShowcaseImages(
          'Lookbook' as any,
          'Product Photography',
          'Professional Studio Lighting',
          productImage!,
          modelImage,
          apiKey,
          count,
          true,
          'high'
        );
        
        const convertedResults = result.map((img, index) => ({
          id: \`batch-\${i}-\${index}\`,
          src: img.src,
          prompt: img.prompt,
          isFavorite: false,
          videoSrc: undefined
        }));
        batchResults.push(...convertedResults);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setGeneratedImages(prev => [...prev, ...batchResults]);
      setBatchProgress(100);
    } catch (err: any) {
      console.error('Batch generation failed:', err);
      setError(err.message || 'Batch generation failed');
    } finally {
      setIsBatchProcessing(false);
      setBatchProgress(0);
    }
  }, [apiKey, productImage, modelImage, count]);

  // Template selection handler
  const handleTemplateSelect = useCallback((template: any) => {
    setSelectedTemplate(template);
    console.log('Template selected:', template);
  }, []);

  // Image enhancement handler
  const handleImageEnhance = useCallback(async (enhancements: any) => {
    console.log('Enhancing image with settings:', enhancements);
  }, []);`;

const loadingSpinnerReplacement = `            {isLoading && generatedImages.length === 0 && (
              <LoadingSpinner 
                size="lg" 
                text="AI is generating your content..." 
                progress={isBatchProcessing ? batchProgress : undefined}
                showProgress={isBatchProcessing}
              />
            )}`;

const enhancementComponents = `
            {/* Enhancement Components */}
            {generatedImages.length > 0 && (
              <div className="mt-8 space-y-6">
                {/* Template Gallery */}
                <TemplateGallery onSelectTemplate={handleTemplateSelect} />
                
                {/* Batch Processor */}
                <BatchProcessor 
                  onBatchGenerate={handleBatchGenerate}
                  maxCount={10}
                  disabled={isLoading || !apiKey}
                />
                
                {/* Image Enhancer */}
                {generatedImages.length > 0 && (
                  <ImageEnhancer 
                    imageUrl={generatedImages[0].src}
                    onEnhance={handleImageEnhance}
                    disabled={isLoading}
                  />
                )}
                
                {/* Advanced Customizer */}
                <AdvancedCustomizer 
                  onSettingsChange={setAdvancedSettings}
                  initialSettings={advancedSettings}
                />
              </div>
            )}`;

components.forEach(component => {
  const filePath = path.join(__dirname, '..', 'components', `${component}.tsx`);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add imports
    if (!content.includes('LoadingSpinner')) {
      content = content.replace(
        /import Modal from '\.\/Modal';/,
        `import Modal from './Modal';\n${enhancementImports}`
      );
    }
    
    // Add states
    if (!content.includes('isBatchProcessing')) {
      content = content.replace(
        /const \[count, setCount\] = useState<number>\(6\);/,
        `const [count, setCount] = useState<number>(6);${enhancementStates}`
      );
    }
    
    // Add functions
    if (!content.includes('handleBatchGenerate')) {
      content = content.replace(
        /}, \[isGenerationDisabled.*\]\);/,
        `}, [isGenerationDisabled, productImage, modelImage, apiKey, count]);${enhancementFunctions}`
      );
    }
    
    // Replace loading spinner
    content = content.replace(
      /{isLoading && generatedImages\.length === 0 && \([\s\S]*?\)}/,
      loadingSpinnerReplacement
    );
    
    // Add enhancement components
    if (!content.includes('Enhancement Components')) {
      content = content.replace(
        /(\s+)(<\/div>\s+<\/div>\s+<\/main>)/,
        `$1${enhancementComponents}\n$1$2`
      );
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Enhanced ${component}.tsx`);
  } else {
    console.log(`❌ File not found: ${component}.tsx`);
  }
});

console.log('🎉 All components enhanced!');
