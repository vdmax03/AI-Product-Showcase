const fs = require('fs');
const path = require('path');

const components = [
  'ProductBackgrounds.tsx',
  'SkincareApplicator.tsx',
  'ChangePose.tsx',
  'CustomizeTheme.tsx',
  'MotorcycleProducts.tsx',
  'FoodBeverageProducts.tsx',
  'ProfilePictureGenerator.tsx'
];

components.forEach(componentName => {
  const filePath = path.join(__dirname, '..', 'components', componentName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File ${componentName} not found, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix layout structure
  content = content.replace(
    /<main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">/g,
    '<main className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">'
  );
  
  content = content.replace(
    /<div className="bg-white\/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white\/20 flex flex-col gap-8 h-fit">/g,
    '<div className="lg:col-span-1 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-8 h-fit">'
  );
  
  content = content.replace(
    /<div className="bg-white\/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white\/20">/g,
    '<div className="lg:col-span-1 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">'
  );
  
  // Move enhancement components to right sidebar
  content = content.replace(
    /(\s*)(<div className="grid grid-cols-2 sm:grid-cols-3 gap-6">[\s\S]*?<\/div>)\s*(\s*<!-- Enhancement Components -->[\s\S]*?<\/div>\s*\)\s*)/g,
    '$1$2\n\n$1            </div>\n          </div>\n          \n          {/* Enhancement Components - Right Sidebar */}\n          {generatedImages.length > 0 && (\n            <div className="lg:col-span-1 space-y-6">\n              {/* Template Gallery */}\n              <TemplateGallery onSelectTemplate={handleTemplateSelect} />\n              \n              {/* Batch Processor */}\n              <BatchProcessor \n                onBatchGenerate={handleBatchGenerate}\n                maxCount={10}\n                disabled={isLoading || !apiKey}\n              />\n              \n              {/* Image Enhancer */}\n              <ImageEnhancer \n                imageUrl={generatedImages[0].src}\n                onEnhance={handleImageEnhance}\n                disabled={isLoading}\n              />\n              \n              {/* Advanced Customizer */}\n              <AdvancedCustomizer \n                onSettingsChange={setAdvancedSettings}\n                initialSettings={advancedSettings}\n              />\n            </div>\n          )}'
  );
  
  // Remove old enhancement components from inside the gallery
  content = content.replace(
    /\s*<!-- Enhancement Components -->[\s\S]*?<\/div>\s*\)\s*}/g,
    ''
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed layout for ${componentName}`);
});

console.log('Layout fix completed!');
