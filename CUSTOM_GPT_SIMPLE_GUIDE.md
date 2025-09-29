# Multi Vdmax Studio - Custom GPT Simple Guide

## 🎯 Overview
Panduan sederhana untuk mengimplementasikan 12 fitur Multi Vdmax Studio di Custom GPT Anda.

## 🔑 Setup
1. Dapatkan Google Gemini API Key
2. Setup Custom GPT dengan akses ke Gemini API
3. Implementasikan fungsi generateImage dan generateText

## 📋 12 Fitur Lengkap

### 1. **LOOKBOOK - Fashion Photoshoot**
**Fungsi**: Generate foto fashion dengan model dan produk pakaian

**Input**:
- Model image (wajah dan tubuh)
- Product image (pakaian)
- Style: Studio Kreatif, Editorial Fashion, Street Style, Luxury Brand, Casual Chic, Bohemian, Minimalist, Vintage
- Count: 1-12 gambar

**Prompt**:
```
Generate professional fashion photoshoot images combining a model with clothing products. Style: {style}, Theme: {theme}, Lighting: {lighting}. Requirements: High-quality professional photography, model wearing clothing naturally, consistent face features, professional studio lighting, fashion editorial quality, various poses and angles, clean commercial-ready images.
```

---

### 2. **B-ROLL - Product Showcase**
**Fungsi**: Generate video showcase untuk produk

**Input**:
- Product image
- Style: Product Focus, Lifestyle, Technical, Artistic, Commercial, Editorial
- Count: 1-12 gambar

**Prompt**:
```
Generate professional product showcase images for B-roll content. Style: {style}, Theme: {theme}, Lighting: {lighting}. Requirements: Professional product photography, multiple angles and perspectives, clean commercial-ready images, high-quality lighting, product-focused composition, various shot types (close-up, wide, detail).
```

---

### 3. **PROFILE PICTURE - Professional Headshots**
**Fungsi**: Generate foto profil profesional

**Input**:
- User image (wajah)
- Gender: Male/Female
- Shot Type: Headshot/UpperBody/FullBody
- Style: Studio Professional, Creative Artistic, Casual Friendly, Executive Corporate, Creative Portrait, Lifestyle Natural, Fashion Editorial, Mixed Styles
- Count: 1-20 gambar

**Prompt**:
```
Generate professional profile pictures for {gender} with {shot_type} composition. Style: {style}. Requirements: Professional headshot quality, consistent face features, clean commercial-ready images, professional lighting, various poses and expressions, high-resolution output, suitable for LinkedIn, professional websites, social media.
```

---

### 4. **VIRTUAL TRY-ON - Clothing Simulation**
**Fungsi**: Upload foto dan pakaian untuk melihat hasilnya

**Input**:
- Model image
- Clothing image
- Count: 1-12 gambar

**Prompt**:
```
Generate virtual try-on images showing how the clothing looks when worn by the model. Requirements: Realistic clothing simulation, natural fit and drape, consistent face features, professional fashion photography quality, various poses and angles, high-quality lighting, commercial-ready images. Show the clothing naturally fitted on the model, maintain realistic proportions, ensure clothing looks natural and well-fitted.
```

---

### 5. **PRODUCT BACKGROUNDS - Professional Backgrounds**
**Fungsi**: Generate latar belakang profesional untuk produk

**Input**:
- Product image
- Background Style: Studio Clean, Natural Wood, Marble Luxury, Concrete Modern, Fabric Texture, Gradient Smooth, Outdoor Natural, Minimalist
- Count: 1-12 gambar

**Prompt**:
```
Generate professional product images with {background_style} background. Requirements: Professional product photography, high-quality background, clean commercial-ready images, proper lighting and shadows, product-focused composition, various angles and perspectives.
```

---

### 6. **SKINCARE APPLICATOR - Beauty Product Visualization**
**Fungsi**: Visualisasikan model menggunakan produk skincare

**Input**:
- Model image
- Product image (skincare)
- Application Style: Serum Application, Cream Application, Mask Application, Eye Care, Sun Protection, Night Routine
- Count: 1-12 gambar

**Prompt**:
```
Generate images showing model applying skincare products naturally. Application Style: {style}. Requirements: Natural skincare application, professional beauty photography, consistent face features, soft natural lighting, clean commercial-ready images, various application poses, high-quality beauty photography.
```

---

### 7. **HOUSEHOLD PRODUCTS - Home Product Scenes**
**Fungsi**: Tampilkan model menggunakan produk rumah tangga

**Input**:
- Model image
- Product image (household)
- Use Scenario: Kitchen Use, Living Room, Bathroom, Cleaning, Organization, Maintenance
- Count: 1-12 gambar

**Prompt**:
```
Generate images showing model using household products in realistic home scenarios. Scenario: {scenario}. Requirements: Realistic home environment, natural product usage, professional lifestyle photography, consistent face features, clean commercial-ready images, various usage poses, high-quality lighting.
```

---

### 8. **CHANGE POSE - Pose Variations**
**Fungsi**: Generate berbagai pose dari satu foto

**Input**:
- Model image
- Pose Style: Dynamic Poses, Professional Stance, Casual Relaxed, Fashion Editorial, Lifestyle Natural, Creative Artistic
- Count: 1-12 gambar

**Prompt**:
```
Generate various pose variations from the model image. Pose Style: {style}. Requirements: Consistent face features, natural pose variations, professional photography quality, high-quality lighting, clean commercial-ready images, various dynamic poses, maintain model's identity.
```

---

### 9. **CUSTOMIZE THEME - Theme Application**
**Fungsi**: Ubah foto menjadi berbagai tema

**Input**:
- Model image
- Product image (opsional)
- Theme Style: Minimalist, Vintage, Cyberpunk, Fantasy, Industrial, Nature, Luxury, Artistic
- Count: 1-12 gambar

**Prompt**:
```
Transform the model image with {theme_style} theme. Requirements: Consistent face features, theme-appropriate styling, professional photography quality, high-quality lighting, clean commercial-ready images, creative theme interpretation, maintain model's identity.
```

---

### 10. **MOTORCYCLE PRODUCTS - Riding Scenes**
**Fungsi**: Gabungkan foto dengan motor

**Input**:
- Model image
- Product image (motorcycle)
- Riding Style: Urban Riding, Adventure, Sport Racing, Cruiser, Touring, Custom
- Count: 1-12 gambar

**Prompt**:
```
Generate images combining model with motorcycle in {riding_style} scenes. Requirements: Dynamic riding scenes, professional action photography, consistent face features, high-quality lighting, clean commercial-ready images, various riding poses, realistic motorcycle interaction.
```

---

### 11. **FOOD & BEVERAGE PRODUCTS - Dining Scenes**
**Fungsi**: Tampilkan model menikmati makanan/minuman

**Input**:
- Model image
- Product image (food/beverage)
- Dining Style: Restaurant Dining, Casual Eating, Coffee Shop, Home Dining, Outdoor Picnic, Fine Dining
- Count: 1-12 gambar

**Prompt**:
```
Generate images showing model enjoying food/beverage in {dining_style} setting. Requirements: Appetizing food photography, natural dining expressions, professional lifestyle photography, consistent face features, high-quality lighting, clean commercial-ready images, various dining poses.
```

---

### 12. **VOICE OVER GENERATOR - Narrative Creation**
**Fungsi**: Buat narasi voice over dari gambar produk

**Input**:
- Product images (multiple)
- Voice Over Style: Fashion Elegant, Product Commercial, Lifestyle Story, Technical Specs, Emotional Appeal, Educational
- Narrative Length: Short/Medium/Long
- Target Audience: Demografi target
- Tone: Friendly/Professional/Casual/Luxury
- Custom Prompt: Instruksi khusus (opsional)

**Prompt**:
```
Generate voice over narrative for product images. Style: {style}, Length: {narrative_length}, Target Audience: {target_audience}, Tone: {tone}. Requirements: Engaging narrative, product-focused content, appropriate tone for target audience, professional voice over quality, clear compelling storytelling, commercial-ready script.
```

---

## 🔧 **Implementasi di Custom GPT**

### 1. Setup Gemini API
```javascript
const GEMINI_API_KEY = "your_api_key_here";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
```

### 2. Function Generate Images
```javascript
async function generateImages(prompt, imageCount = 1) {
  const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
  });
  return await response.json();
}
```

### 3. Function Generate Text
```javascript
async function generateText(prompt) {
  const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    })
  });
  return await response.json();
}
```

## 📋 **Checklist Implementasi**

### Untuk Setiap Fitur:
- [ ] Buat function dengan nama yang sesuai
- [ ] Implementasikan prompt template
- [ ] Tambahkan error handling
- [ ] Test dengan berbagai input
- [ ] Optimasi untuk kualitas output

### Untuk Custom GPT:
- [ ] Setup Gemini API integration
- [ ] Buat action untuk setiap fitur
- [ ] Tambahkan parameter input
- [ ] Implementasikan output formatting
- [ ] Test semua fitur

## 🎯 **Tips Optimasi**

1. **Image Quality**: Gunakan prompt yang detail
2. **Consistency**: Maintain consistent face features
3. **Style Matching**: Pilih style yang sesuai kebutuhan
4. **Error Handling**: Implementasikan fallback
5. **User Experience**: Berikan feedback yang jelas
6. **Performance**: Optimasi untuk response time cepat

---

**Multi Vdmax Studio** - Complete AI Visual Content Solution untuk Custom GPT 🚀
