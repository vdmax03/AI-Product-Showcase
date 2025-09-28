const fs = require('fs');
const path = require('path');

// List of component files to fix
const componentFiles = [
  'components/HouseholdProducts.tsx',
  'components/ChangePose.tsx',
  'components/CustomizeTheme.tsx',
  'components/FoodBeverageProducts.tsx',
  'components/ProductBackgrounds.tsx',
  'components/SkincareApplicator.tsx',
  'components/ProfilePictureGenerator.tsx'
];

function fixBatchProcessing() {
  console.log('🔧 Fixing batch processing syntax errors...\n');

  componentFiles.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove broken batch processing code
    const batchProcessingRegex = /\/\/ Batch processing functionsetIsBatchProcessing\(true\);[\s\S]*?}, \[[^\]]*\]\);/g;
    if (content.match(batchProcessingRegex)) {
      content = content.replace(batchProcessingRegex, '');
      modified = true;
      console.log(`✅ Removed broken batch processing from ${filePath}`);
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

  console.log('✨ Batch processing fix completed!');
}

// Run the script
fixBatchProcessing();
