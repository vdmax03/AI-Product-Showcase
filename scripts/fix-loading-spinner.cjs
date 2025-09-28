const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '..', 'components');

const files = [
  'HouseholdProducts.tsx',
  'VirtualTryOn.tsx', 
  'ProductBackgrounds.tsx',
  'ChangePose.tsx',
  'FoodBeverageProducts.tsx',
  'CustomizeTheme.tsx',
  'MotorcycleProducts.tsx',
  'ProfilePictureGenerator.tsx',
  'SkincareApplicator.tsx'
];

files.forEach(fileName => {
  const filePath = path.join(componentsDir, fileName);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove isBatchProcessing and batchProgress references from LoadingSpinner
    content = content.replace(
      /progress={isBatchProcessing \? batchProgress : undefined}\s*showProgress={isBatchProcessing}/g,
      ''
    );
    
    // Clean up any remaining references
    content = content.replace(
      /progress={[^}]*}\s*showProgress={[^}]*}/g,
      ''
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${fileName}`);
  } else {
    console.log(`File not found: ${fileName}`);
  }
});

console.log('All files fixed!');
