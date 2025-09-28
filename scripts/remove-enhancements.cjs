const fs = require('fs');
const path = require('path');

// List of component files to update
const componentFiles = [
  'components/ProductBackgrounds.tsx',
  'components/VirtualTryOn.tsx', 
  'components/HouseholdProducts.tsx',
  'components/ChangePose.tsx',
  'components/FoodBeverageProducts.tsx',
  'components/CustomizeTheme.tsx',
  'components/MotorcycleProducts.tsx',
  'components/ProfilePictureGenerator.tsx',
  'components/SkincareApplicator.tsx'
];

// Features to remove
const featuresToRemove = [
  'TemplateGallery',
  'BatchProcessor', 
  'AdvancedCustomizer',
  'ImageEnhancer'
];

// State variables to remove
const stateToRemove = [
  'isBatchProcessing',
  'batchProgress', 
  'selectedTemplate',
  'advancedSettings',
  'enhancementSettings'
];

// Handler functions to remove
const handlersToRemove = [
  'handleTemplateSelect',
  'handleBatchGenerate',
  'handleImageEnhance',
  'setAdvancedSettings'
];

function removeEnhancements() {
  console.log('🚀 Removing enhancement features from all components...\n');

  componentFiles.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove imports
    featuresToRemove.forEach(feature => {
      const importRegex = new RegExp(`import\\s+${feature}\\s+from\\s+['"][^'"]+['"];?\\s*\\n?`, 'g');
      if (content.match(importRegex)) {
        content = content.replace(importRegex, '');
        modified = true;
        console.log(`✅ Removed ${feature} import from ${filePath}`);
      }
    });

    // Remove state variables
    stateToRemove.forEach(state => {
      const stateRegex = new RegExp(`\\s*const\\s+\\[${state}[^\\]]*\\];?\\s*\\n?`, 'g');
      if (content.match(stateRegex)) {
        content = content.replace(stateRegex, '');
        modified = true;
        console.log(`✅ Removed ${state} state from ${filePath}`);
      }
    });

    // Remove handler functions
    handlersToRemove.forEach(handler => {
      const handlerRegex = new RegExp(`\\s*const\\s+${handler}[^}]+\\},?\\s*\\n?`, 'gs');
      if (content.match(handlerRegex)) {
        content = content.replace(handlerRegex, '');
        modified = true;
        console.log(`✅ Removed ${handler} handler from ${filePath}`);
      }
    });

    // Remove component usage in JSX
    featuresToRemove.forEach(feature => {
      const componentRegex = new RegExp(`\\s*<${feature}[^>]*>\\s*</${feature}>\\s*\\n?`, 'gs');
      const selfClosingRegex = new RegExp(`\\s*<${feature}[^>]*/>\\s*\\n?`, 'gs');
      
      if (content.match(componentRegex)) {
        content = content.replace(componentRegex, '');
        modified = true;
        console.log(`✅ Removed ${feature} component usage from ${filePath}`);
      }
      
      if (content.match(selfClosingRegex)) {
        content = content.replace(selfClosingRegex, '');
        modified = true;
        console.log(`✅ Removed ${feature} self-closing component from ${filePath}`);
      }
    });

    // Remove entire right panel sections
    const rightPanelRegex = /{\/\* Right Panel - Enhancement Tools \*\/}[\s\S]*?<\/div>\s*<\/div>/g;
    if (content.match(rightPanelRegex)) {
      content = content.replace(rightPanelRegex, '');
      modified = true;
      console.log(`✅ Removed right panel from ${filePath}`);
    }

    // Update grid layout from 3 columns to 2 columns
    content = content.replace(/grid-cols-1\s+lg:grid-cols-3/g, 'grid-cols-1 lg:grid-cols-2');
    content = content.replace(/lg:col-span-2/g, '');
    content = content.replace(/max-w-7xl/g, 'max-w-6xl');

    // Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`🎉 Updated ${filePath}\n`);
    } else {
      console.log(`ℹ️  No changes needed for ${filePath}\n`);
    }
  });

  console.log('✨ Enhancement removal completed!');
}

// Run the script
removeEnhancements();
