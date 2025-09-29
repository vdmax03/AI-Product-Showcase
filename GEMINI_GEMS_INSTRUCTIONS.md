# Multi Vdmax Studio - Gemini Gems Integration Guide

## 🎯 Overview
Panduan lengkap untuk mengintegrasikan Multi Vdmax Studio dengan Gemini Gems untuk akses via Custom GPT atau platform Gemini lainnya.

## 🔧 Setup Instructions

### 1. Repository Setup
```bash
# Clone repository
git clone https://github.com/vdmax03/AI-Product-Showcase.git
cd ai-product-showcase

# Install dependencies
npm install

# Set environment variables
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Run development server
npm run dev
```

### 2. API Key Configuration
```typescript
// Set your Gemini API key
const API_KEY = "your_gemini_api_key_here";

// Or use environment variable
const API_KEY = process.env.GEMINI_API_KEY;
```

## 🎨 Available Features for Gemini Gems

### **FITUR UTAMA**

#### 1. **Lookbook Generator**
```typescript
// Generate fashion photoshoot
const lookbookResult = await generateShowcaseImages(
  'Lookbook',
  'Studio Kreatif',
  'Professional Studio Lighting',
  productImage,
  modelImage,
  API_KEY,
  6, // count
  true, // face consistency
  'high' // face quality
);
```

#### 2. **B-roll Generator**
```typescript
// Generate product showcase
const brollResult = await generateShowcaseImages(
  'Broll',
  'Product Focus',
  'Studio Lighting',
  productImage,
  null, // no model needed
  API_KEY,
  4 // count
);
```

#### 3. **Profile Picture Generator**
```typescript
// Generate professional headshots
const profileResult = await generateProfilePictures(
  userImage,
  Gender.Female,
  ShotType.UpperBody,
  ProfileStyle.MixedStyles,
  API_KEY,
  10 // count
);
```

### **FITUR TAMBAHAN**

#### 4. **Virtual Try-On**
```typescript
// Generate virtual try-on
const tryOnResult = await generateVirtualTryOnImages(
  modelImage,
  clothingImage,
  'Professional Fashion Photography',
  API_KEY,
  6 // count
);
```

#### 5. **Product Backgrounds**
```typescript
// Generate product backgrounds
const backgroundResult = await generateProductBackgroundImages(
  productImage,
  'Studio Clean',
  API_KEY,
  8 // count
);
```

#### 6. **Skincare Applicator**
```typescript
// Generate skincare application
const skincareResult = await generateShowcaseImages(
  'Lookbook',
  'Skincare Application',
  'Natural Soft Lighting',
  productImage,
  modelImage,
  API_KEY,
  6,
  true,
  'high',
  { prompt: 'Model applying skincare serum', name: 'Serum Application' }
);
```

#### 7. **Household Products**
```typescript
// Generate household scenes
const householdResult = await generateHouseholdProductImages(
  productImage,
  modelImage,
  'Person actively using household product in modern kitchen',
  API_KEY,
  6 // count
);
```

#### 8. **Change Pose**
```typescript
// Generate pose variations
const poseResult = await generateShowcaseImages(
  'Lookbook',
  'Pose Variation',
  'Professional Studio Lighting',
  modelImage,
  null,
  API_KEY,
  8,
  true,
  'high',
  { prompt: 'Dynamic poses with movement', name: 'Dynamic Poses' }
);
```

#### 9. **Customize Theme**
```typescript
// Generate themed images
const themeResult = await generateShowcaseImages(
  'Lookbook',
  'Theme Customization',
  'Professional Studio Lighting',
  productImage,
  modelImage,
  API_KEY,
  6,
  true,
  'high',
  { prompt: 'Minimalist theme with simple lines', name: 'Minimalist' }
);
```

#### 10. **Motorcycle Products**
```typescript
// Generate riding scenes
const motorcycleResult = await generateShowcaseImages(
  'Lookbook',
  'Motorcycle Product Showcase',
  'Dynamic Outdoor Lighting',
  productImage,
  modelImage,
  API_KEY,
  6,
  true,
  'high',
  { prompt: 'Model riding motorcycle in urban setting', name: 'Urban Riding' }
);
```

#### 11. **Food & Beverage Products**
```typescript
// Generate dining scenes
const fnbResult = await generateShowcaseImages(
  'Lookbook',
  'Food & Beverage Showcase',
  'Natural Food Lighting',
  productImage,
  modelImage,
  API_KEY,
  6,
  true,
  'high',
  { prompt: 'Model enjoying food in elegant restaurant', name: 'Restaurant Dining' }
);
```

#### 12. **Voice Over Generator**
```typescript
// Generate voice over text
const voiceOverResult = await generateVoiceOverText(
  productImages,
  'Fashion Elegant',
  'Simple narrative template',
  'Custom instructions here',
  'medium',
  'wanita muda',
  'friendly',
  API_KEY
);
```

## 🎨 Style Presets Reference

### Lookbook Styles
- **Studio Kreatif**: Creative studio setting with artistic lighting
- **Editorial Fashion**: High-fashion editorial style
- **Street Style**: Urban street fashion
- **Luxury Brand**: Premium luxury brand aesthetic
- **Casual Chic**: Relaxed yet stylish
- **Bohemian**: Free-spirited, eclectic style
- **Minimalist**: Clean, simple aesthetic
- **Vintage**: Retro, classic styling

### B-roll Styles
- **Product Focus**: Direct product emphasis
- **Lifestyle**: Product in use scenarios
- **Technical**: Detailed technical shots
- **Artistic**: Creative, artistic angles
- **Commercial**: Commercial advertising style
- **Editorial**: Magazine-style photography

### Background Styles
- **Studio Clean**: White studio background
- **Natural Wood**: Wooden texture background
- **Marble Luxury**: Elegant marble surface
- **Concrete Modern**: Industrial concrete texture
- **Fabric Texture**: Soft fabric background
- **Gradient Smooth**: Smooth color gradient
- **Outdoor Natural**: Natural outdoor setting
- **Minimalist**: Clean, simple background

## 🔧 Advanced Configuration

### Face Consistency Settings
```typescript
// High face consistency (recommended)
faceConsistency: true,
faceQuality: 'high'

// Balanced approach
faceConsistency: true,
faceQuality: 'medium'

// Speed over accuracy
faceConsistency: false,
faceQuality: 'balanced'
```

### Image Count Options
```typescript
// Available counts for all features
const counts = [1, 2, 3, 6, 9, 12];

// Special for Profile Pictures
const profileCounts = [1, 2, 3, 6, 9, 12, 20];
```

### Error Handling
```typescript
try {
  const result = await generateShowcaseImages(...);
  if (result.length === 0) {
    throw new Error("No images generated");
  }
  return result;
} catch (error) {
  console.error('Generation failed:', error);
  // Implement fallback or retry logic
}
```

## 📱 Mobile Optimization

### Responsive Design
- All components are mobile-friendly
- Touch-optimized controls
- Adaptive layouts for different screen sizes

### Performance Tips
- Use lower image counts for mobile (1-3)
- Implement image compression
- Add loading states for better UX

## 🔒 Security Best Practices

### API Key Protection
```typescript
// Never expose API keys in frontend
const API_KEY = process.env.GEMINI_API_KEY;

// Use server-side proxy if needed
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ images, settings })
});
```

### Image Privacy
- Images are processed directly by Gemini API
- No local storage of user images
- Temporary processing only

## 🚀 Performance Optimization

### Batch Processing
```typescript
// Process multiple requests efficiently
const promises = images.map(image => 
  generateShowcaseImages(..., image, ...)
);
const results = await Promise.all(promises);
```

### Caching Strategy
```typescript
// Cache API responses for repeated requests
const cacheKey = `${mode}-${theme}-${lighting}`;
if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}
```

## 📊 Usage Analytics

### Track Generation Metrics
```typescript
const analytics = {
  feature: 'lookbook',
  count: 6,
  style: 'studio-kreatif',
  success: true,
  duration: Date.now() - startTime
};
```

## 🔄 Integration Examples

### Custom GPT Integration
```javascript
// Example for Custom GPT
function generateLookbook(modelImage, productImage, style) {
  return generateShowcaseImages(
    'Lookbook',
    style,
    'Professional Studio Lighting',
    productImage,
    modelImage,
    process.env.GEMINI_API_KEY,
    6
  );
}
```

### Webhook Integration
```javascript
// Webhook for external services
app.post('/webhook/generate', async (req, res) => {
  const { feature, images, settings } = req.body;
  
  try {
    const result = await processFeature(feature, images, settings);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 📞 Support & Troubleshooting

### Common Issues
1. **API Key Invalid**: Check your Gemini API key
2. **No Images Generated**: Verify image quality and API limits
3. **Slow Generation**: Reduce image count or check network
4. **Face Consistency Issues**: Ensure clear face visibility

### Debug Mode
```typescript
// Enable debug logging
const DEBUG = true;
if (DEBUG) {
  console.log('Generation request:', { mode, theme, count });
  console.log('API response:', result);
}
```

## 🎯 Best Practices Summary

1. **Start Small**: Begin with 1-2 images for testing
2. **Quality Images**: Use high-resolution, clear images
3. **Consistent Style**: Choose styles that match your brand
4. **Error Handling**: Always implement proper error handling
5. **Performance**: Monitor API usage and implement caching
6. **User Experience**: Provide clear feedback and loading states

---

**Multi Vdmax Studio** - Complete AI Visual Content Solution for Gemini Gems 🚀
