const fs = require('fs');
const path = require('path');

// List of component files to fix
const componentFiles = [
  'components/VirtualTryOn.tsx',
  'components/ProductBackgrounds.tsx',
  'components/HouseholdProducts.tsx',
  'components/ChangePose.tsx',
  'components/FoodBeverageProducts.tsx',
  'components/CustomizeTheme.tsx',
  'components/MotorcycleProducts.tsx',
  'components/ProfilePictureGenerator.tsx',
  'components/SkincareApplicator.tsx'
];

function fixSyntaxErrors() {
  console.log('🔧 Fixing syntax errors in components...\n');

  componentFiles.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix batch processing function syntax error
    const batchProcessingRegex = /\/\/ Batch processing function removed[\s\S]*?}, \[[^\]]*\]\);/g;
    if (content.match(batchProcessingRegex)) {
      content = content.replace(batchProcessingRegex, '');
      modified = true;
      console.log(`✅ Removed broken batch processing function from ${filePath}`);
    }

    // Fix template selection handler syntax error
    const templateHandlerRegex = /\/\/ Template selection handler\[\]\);/g;
    if (content.match(templateHandlerRegex)) {
      content = content.replace(templateHandlerRegex, '');
      modified = true;
      console.log(`✅ Removed broken template handler from ${filePath}`);
    }

    // Fix image enhancement handler syntax error
    const imageEnhancementRegex = /\/\/ Image enhancement handler\[\]\);/g;
    if (content.match(imageEnhancementRegex)) {
      content = content.replace(imageEnhancementRegex, '');
      modified = true;
      console.log(`✅ Removed broken image enhancement handler from ${filePath}`);
    }

    // Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`🎉 Fixed ${filePath}\n`);
    } else {
      console.log(`ℹ️  No changes needed for ${filePath}\n`);
    }
  });

  console.log('✨ Syntax error fixing completed!');
}

// Run the script
fixSyntaxErrors();
