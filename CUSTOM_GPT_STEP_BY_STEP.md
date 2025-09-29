# Multi Vdmax Studio - Custom GPT Step by Step Guide

## 🎯 Langkah-langkah Implementasi di Custom GPT

### Step 1: Setup Gemini API
1. Dapatkan API key dari Google AI Studio
2. Setup Custom GPT dengan akses ke Gemini API
3. Buat function untuk generate images dan text

### Step 2: Implementasi 12 Fitur

---

## 1. **LOOKBOOK - Fashion Photoshoot**

**Function Name**: `generateLookbook`

**Parameters**:
- `modelImage`: File (wajah dan tubuh)
- `productImage`: File (pakaian)
- `style`: String (Studio Kreatif, Editorial Fashion, Street Style, Luxury Brand, Casual Chic, Bohemian, Minimalist, Vintage)
- `theme`: String (Professional Studio, Outdoor Natural, Urban Street, dll)
- `lighting`: String (Professional Studio Lighting, Natural Daylight, dll)
- `count`: Number (1-12)

**Prompt Template**:
```
Generate professional fashion photoshoot images combining a model with clothing products. Style: {style}, Theme: {theme}, Lighting: {lighting}. Requirements: High-quality professional photography, model wearing clothing naturally, consistent face features, professional studio lighting, fashion editorial quality, various poses and angles, clean commercial-ready images.
```

---

## 2. **B-ROLL - Product Showcase**

**Function Name**: `generateBroll`

**Parameters**:
- `productImage`: File
- `style`: String (Product Focus, Lifestyle, Technical, Artistic, Commercial, Editorial)
- `theme`: String (Studio Clean, Outdoor Natural, dll)
- `lighting`: String (Professional Studio Lighting, Natural Daylight, dll)
- `count`: Number (1-12)

**Prompt Template**:
```
Generate professional product showcase images for B-roll content. Style: {style}, Theme: {theme}, Lighting: {lighting}. Requirements: Professional product photography, multiple angles and perspectives, clean commercial-ready images, high-quality lighting, product-focused composition, various shot types (close-up, wide, detail).
```

---

## 3. **PROFILE PICTURE - Professional Headshots**

**Function Name**: `generateProfilePicture`

**Parameters**:
- `userImage`: File (wajah)
- `gender`: String (Male, Female)
- `shotType`: String (Headshot, UpperBody, FullBody)
- `style`: String (Studio Professional, Creative Artistic, Casual Friendly, Executive Corporate, Creative Portrait, Lifestyle Natural, Fashion Editorial, Mixed Styles)
- `count`: Number (1-20)

**Prompt Template**:
```
Generate professional profile pictures for {gender} with {shotType} composition. Style: {style}. Requirements: Professional headshot quality, consistent face features, clean commercial-ready images, professional lighting, various poses and expressions, high-resolution output, suitable for LinkedIn, professional websites, social media.
```

---

## 4. **VIRTUAL TRY-ON - Clothing Simulation**

**Function Name**: `generateVirtualTryOn`

**Parameters**:
- `modelImage`: File
- `clothingImage`: File
- `count`: Number (1-12)

**Prompt Template**:
```
Generate virtual try-on images showing how the clothing looks when worn by the model. Requirements: Realistic clothing simulation, natural fit and drape, consistent face features, professional fashion photography quality, various poses and angles, high-quality lighting, commercial-ready images. Show the clothing naturally fitted on the model, maintain realistic proportions, ensure clothing looks natural and well-fitted.
```

---

## 5. **PRODUCT BACKGROUNDS - Professional Backgrounds**

**Function Name**: `generateProductBackgrounds`

**Parameters**:
- `productImage`: File
- `backgroundStyle`: String (Studio Clean, Natural Wood, Marble Luxury, Concrete Modern, Fabric Texture, Gradient Smooth, Outdoor Natural, Minimalist)
- `count`: Number (1-12)

**Prompt Template**:
```
Generate professional product images with {backgroundStyle} background. Requirements: Professional product photography, high-quality background, clean commercial-ready images, proper lighting and shadows, product-focused composition, various angles and perspectives.
```

---

## 6. **SKINCARE APPLICATOR - Beauty Product Visualization**

**Function Name**: `generateSkincareApplicator`

**Parameters**:
- `modelImage`: File
- `productImage`: File (skincare)
- `applicationStyle`: String (Serum Application, Cream Application, Mask Application, Eye Care, Sun Protection, Night Routine)
- `count`: Number (1-12)

**Prompt Template**:
```
Generate images showing model applying skincare products naturally. Application Style: {applicationStyle}. Requirements: Natural skincare application, professional beauty photography, consistent face features, soft natural lighting, clean commercial-ready images, various application poses, high-quality beauty photography.
```

---

## 7. **HOUSEHOLD PRODUCTS - Home Product Scenes**

**Function Name**: `generateHouseholdProducts`

**Parameters**:
- `modelImage`: File
- `productImage`: File (household)
- `useScenario`: String (Kitchen Use, Living Room, Bathroom, Cleaning, Organization, Maintenance)
- `count`: Number (1-12)

**Prompt Template**:
```
Generate images showing model using household products in realistic home scenarios. Scenario: {useScenario}. Requirements: Realistic home environment, natural product usage, professional lifestyle photography, consistent face features, clean commercial-ready images, various usage poses, high-quality lighting.
```

---

## 8. **CHANGE POSE - Pose Variations**

**Function Name**: `generateChangePose`

**Parameters**:
- `modelImage`: File
- `poseStyle`: String (Dynamic Poses, Professional Stance, Casual Relaxed, Fashion Editorial, Lifestyle Natural, Creative Artistic)
- `count`: Number (1-12)

**Prompt Template**:
```
Generate various pose variations from the model image. Pose Style: {poseStyle}. Requirements: Consistent face features, natural pose variations, professional photography quality, high-quality lighting, clean commercial-ready images, various dynamic poses, maintain model's identity.
```

---

## 9. **CUSTOMIZE THEME - Theme Application**

**Function Name**: `generateCustomizeTheme`

**Parameters**:
- `modelImage`: File
- `productImage`: File (opsional)
- `themeStyle`: String (Minimalist, Vintage, Cyberpunk, Fantasy, Industrial, Nature, Luxury, Artistic)
- `count`: Number (1-12)

**Prompt Template**:
```
Transform the model image with {themeStyle} theme. Requirements: Consistent face features, theme-appropriate styling, professional photography quality, high-quality lighting, clean commercial-ready images, creative theme interpretation, maintain model's identity.
```

---

## 10. **MOTORCYCLE PRODUCTS - Riding Scenes**

**Function Name**: `generateMotorcycleProducts`

**Parameters**:
- `modelImage`: File
- `productImage`: File (motorcycle)
- `ridingStyle`: String (Urban Riding, Adventure, Sport Racing, Cruiser, Touring, Custom)
- `count`: Number (1-12)

**Prompt Template**:
```
Generate images combining model with motorcycle in {ridingStyle} scenes. Requirements: Dynamic riding scenes, professional action photography, consistent face features, high-quality lighting, clean commercial-ready images, various riding poses, realistic motorcycle interaction.
```

---

## 11. **FOOD & BEVERAGE PRODUCTS - Dining Scenes**

**Function Name**: `generateFoodBeverageProducts`

**Parameters**:
- `modelImage`: File
- `productImage`: File (food/beverage)
- `diningStyle`: String (Restaurant Dining, Casual Eating, Coffee Shop, Home Dining, Outdoor Picnic, Fine Dining)
- `count`: Number (1-12)

**Prompt Template**:
```
Generate images showing model enjoying food/beverage in {diningStyle} setting. Requirements: Appetizing food photography, natural dining expressions, professional lifestyle photography, consistent face features, high-quality lighting, clean commercial-ready images, various dining poses.
```

---

## 12. **VOICE OVER GENERATOR - Narrative Creation**

**Function Name**: `generateVoiceOver`

**Parameters**:
- `productImages`: File[] (multiple)
- `voiceOverStyle`: String (Fashion Elegant, Product Commercial, Lifestyle Story, Technical Specs, Emotional Appeal, Educational)
- `narrativeLength`: String (Short, Medium, Long)
- `targetAudience`: String (wanita muda, pria dewasa, keluarga, dll)
- `tone`: String (Friendly, Professional, Casual, Luxury)
- `customPrompt`: String (opsional)

**Prompt Template**:
```
Generate voice over narrative for product images. Style: {voiceOverStyle}, Length: {narrativeLength}, Target Audience: {targetAudience}, Tone: {tone}. Custom Instructions: {customPrompt}. Requirements: Engaging narrative, product-focused content, appropriate tone for target audience, professional voice over quality, clear compelling storytelling, commercial-ready script.
```

---

## 🔧 **Code Implementation**

### 1. Setup Gemini API
```javascript
const GEMINI_API_KEY = "your_api_key_here";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function callGeminiAPI(prompt, isImageGeneration = true) {
  const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: isImageGeneration ? 0.7 : 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: isImageGeneration ? 1024 : 2048,
      }
    })
  });
  return await response.json();
}
```

### 2. Example Function Implementation
```javascript
async function generateLookbook(modelImage, productImage, style, theme, lighting, count) {
  const prompt = `Generate professional fashion photoshoot images combining a model with clothing products. Style: ${style}, Theme: ${theme}, Lighting: ${lighting}. Requirements: High-quality professional photography, model wearing clothing naturally, consistent face features, professional studio lighting, fashion editorial quality, various poses and angles, clean commercial-ready images.`;
  
  try {
    const result = await callGeminiAPI(prompt, true);
    return {
      success: true,
      images: result.images || [],
      prompt: prompt
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

## 📋 **Custom GPT Actions Setup**

### Untuk Setiap Fitur:
1. **Action Name**: Sesuai dengan function name
2. **Description**: Deskripsi singkat fitur
3. **Parameters**: Sesuai dengan parameter yang diperlukan
4. **Implementation**: Panggil function yang sesuai
5. **Output**: Format response yang konsisten

### Example Action Setup:
```json
{
  "name": "generateLookbook",
  "description": "Generate professional fashion photoshoot images",
  "parameters": {
    "modelImage": "File",
    "productImage": "File", 
    "style": "String",
    "theme": "String",
    "lighting": "String",
    "count": "Number"
  }
}
```

## 🎯 **Tips Implementasi**

1. **Error Handling**: Selalu implementasikan try-catch
2. **Input Validation**: Validasi semua parameter input
3. **Response Format**: Gunakan format response yang konsisten
4. **User Feedback**: Berikan feedback yang jelas untuk user
5. **Performance**: Optimasi untuk response time yang cepat
6. **Testing**: Test semua fitur dengan berbagai input

## 📞 **Support**

Jika ada pertanyaan atau butuh bantuan implementasi:
- GitHub Issues: https://github.com/vdmax03/AI-Product-Showcase/issues
- Documentation: Lihat file README.md di repository

---

**Multi Vdmax Studio** - Complete AI Visual Content Solution untuk Custom GPT 🚀
