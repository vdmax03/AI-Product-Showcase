# Multi Vdmax Studio - Custom GPT Features Guide

## 🎯 Overview
Panduan lengkap untuk mengimplementasikan semua fitur Multi Vdmax Studio di Custom GPT. Setiap fitur dapat dijadikan sebagai kemampuan terpisah dalam Custom GPT Anda.

## 🔑 Prerequisites
- Google Gemini API Key
- Custom GPT dengan akses ke Google Gemini API
- Kemampuan upload gambar
- Akses ke fungsi generateImage dari Gemini

## 📋 Daftar Lengkap 12 Fitur

### 🎨 **FITUR UTAMA (3 fitur)**

---

## 1. **LOOKBOOK - Fashion Photoshoot Generator**

### Deskripsi
Generate foto fashion profesional dengan model dan produk pakaian dalam berbagai style dan tema.

### Input yang Diperlukan
- **Model Image**: Foto model (wajah dan tubuh)
- **Product Image**: Foto produk pakaian
- **Style Preset**: Pilih salah satu dari 8 pilihan
- **Theme & Lighting**: Pilihan tema dan pencahayaan
- **Image Count**: 1, 2, 3, 6, 9, atau 12 gambar

### Style Presets
1. **Studio Kreatif** - Creative studio setting dengan artistic lighting
2. **Editorial Fashion** - High-fashion editorial style
3. **Street Style** - Urban street fashion
4. **Luxury Brand** - Premium luxury brand aesthetic
5. **Casual Chic** - Relaxed yet stylish
6. **Bohemian** - Free-spirited, eclectic style
7. **Minimalist** - Clean, simple aesthetic
8. **Vintage** - Retro, classic styling

### Prompt Template
```
Generate professional fashion photoshoot images combining a model with clothing products. 

Style: {selected_style}
Theme: {selected_theme}
Lighting: {selected_lighting}
Count: {image_count}

Requirements:
- High-quality professional photography
- Model wearing the clothing product naturally
- Consistent face features across all images
- Professional studio lighting
- Fashion editorial quality
- Various poses and angles
- Clean, commercial-ready images

Style-specific instructions:
{style_prompt}
```

### Output
- 1-12 gambar fashion profesional
- Resolusi tinggi, siap untuk komersial
- Konsistensi wajah model di semua gambar

---

## 2. **B-ROLL - Product Showcase Generator**

### Deskripsi
Generate video showcase untuk produk dengan berbagai angle dan style profesional.

### Input yang Diperlukan
- **Product Image**: Foto produk
- **Style Preset**: Pilih salah satu dari 6 pilihan
- **Theme & Lighting**: Pilihan tema dan pencahayaan
- **Image Count**: 1, 2, 3, 6, 9, atau 12 gambar

### Style Presets
1. **Product Focus** - Direct product emphasis
2. **Lifestyle** - Product in use scenarios
3. **Technical** - Detailed technical shots
4. **Artistic** - Creative, artistic angles
5. **Commercial** - Commercial advertising style
6. **Editorial** - Magazine-style photography

### Prompt Template
```
Generate professional product showcase images for B-roll content.

Style: {selected_style}
Theme: {selected_theme}
Lighting: {selected_lighting}
Count: {image_count}

Requirements:
- Professional product photography
- Multiple angles and perspectives
- Clean, commercial-ready images
- High-quality lighting
- Product-focused composition
- Various shot types (close-up, wide, detail)

Style-specific instructions:
{style_prompt}
```

### Output
- 1-12 gambar produk profesional
- Berbagai angle dan perspektif
- Siap untuk video B-roll

---

## 3. **PROFILE PICTURE - Professional Headshots Generator**

### Deskripsi
Generate foto profil profesional dengan berbagai gaya, pose, dan tema.

### Input yang Diperlukan
- **User Image**: Foto wajah user
- **Gender**: Male/Female
- **Shot Type**: Headshot/UpperBody/FullBody
- **Style**: Pilih salah satu dari 8 pilihan
- **Image Count**: 1, 2, 3, 6, 9, 12, atau 20 gambar

### Style Presets
1. **Studio Professional** - Clean, professional headshots
2. **Creative Artistic** - Artistic and creative poses
3. **Casual Friendly** - Relaxed, approachable style
4. **Executive Corporate** - Formal business style
5. **Creative Portrait** - Artistic portrait photography
6. **Lifestyle Natural** - Natural, lifestyle approach
7. **Fashion Editorial** - High-fashion editorial style
8. **Mixed Styles** - Combination of different styles

### Shot Types
- **Headshot**: Focus on face and shoulders
- **UpperBody**: From head to waist
- **FullBody**: Complete body shot

### Prompt Template
```
Generate professional profile pictures for {gender} with {shot_type} composition.

Style: {selected_style}
Count: {image_count}

Requirements:
- Professional headshot quality
- Consistent face features
- Clean, commercial-ready images
- Professional lighting
- Various poses and expressions
- High-resolution output
- Suitable for LinkedIn, professional websites, social media

Style-specific instructions:
{style_prompt}
```

### Output
- 1-20 gambar profil profesional
- Konsistensi wajah di semua gambar
- Siap untuk berbagai keperluan profesional

---

### 🚀 **FITUR TAMBAHAN (9 fitur)**

---

## 4. **VIRTUAL TRY-ON - Clothing Simulation**

### Deskripsi
Upload foto Anda dan pakaian untuk melihat bagaimana tampilannya saat dikenakan.

### Input yang Diperlukan
- **Model Image**: Foto diri user
- **Clothing Image**: Foto pakaian
- **Image Count**: 1, 2, 3, 6, 9, atau 12 gambar

### Prompt Template
```
Generate virtual try-on images showing how the clothing looks when worn by the model.

Model: {model_image}
Clothing: {clothing_image}
Count: {image_count}

Requirements:
- Realistic clothing simulation
- Natural fit and drape
- Consistent face features
- Professional fashion photography quality
- Various poses and angles
- High-quality lighting
- Commercial-ready images

Instructions:
- Show the clothing naturally fitted on the model
- Maintain realistic proportions
- Ensure clothing looks natural and well-fitted
- Use professional fashion photography style
```

### Output
- 1-12 gambar virtual try-on
- Simulasi pakaian yang realistis
- Kualitas fotografi fashion profesional

---

## 5. **PRODUCT BACKGROUNDS - Professional Backgrounds**

### Deskripsi
Generate latar belakang profesional untuk foto produk.

### Input yang Diperlukan
- **Product Image**: Foto produk
- **Background Style**: Pilih salah satu dari 8 pilihan
- **Image Count**: 1, 2, 3, 6, 9, atau 12 gambar

### Background Styles
1. **Studio Clean** - White studio background
2. **Natural Wood** - Wooden texture background
3. **Marble Luxury** - Elegant marble surface
4. **Concrete Modern** - Industrial concrete texture
5. **Fabric Texture** - Soft fabric background
6. **Gradient Smooth** - Smooth color gradient
7. **Outdoor Natural** - Natural outdoor setting
8. **Minimalist** - Clean, simple background

### Prompt Template
```
Generate professional product images with {background_style} background.

Product: {product_image}
Background Style: {selected_background}
Count: {image_count}

Requirements:
- Professional product photography
- High-quality background
- Clean, commercial-ready images
- Proper lighting and shadows
- Product-focused composition
- Various angles and perspectives

Background-specific instructions:
{background_prompt}
```

### Output
- 1-12 gambar produk dengan background profesional
- Berbagai style background
- Siap untuk e-commerce dan marketing

---

## 6. **SKINCARE APPLICATOR - Beauty Product Visualization**

### Deskripsi
Visualisasikan model yang menggunakan produk perawatan kulit.

### Input yang Diperlukan
- **Model Image**: Foto model
- **Product Image**: Foto produk skincare
- **Application Style**: Pilih salah satu dari 6 pilihan
- **Image Count**: 1, 2, 3, 6, 9, atau 12 gambar

### Application Styles
1. **Serum Application** - Applying serum to face
2. **Cream Application** - Applying cream to face
3. **Mask Application** - Applying face mask
4. **Eye Care** - Applying eye cream
5. **Sun Protection** - Applying sunscreen
6. **Night Routine** - Complete night skincare routine

### Prompt Template
```
Generate images showing model applying skincare products naturally.

Model: {model_image}
Product: {product_image}
Application Style: {selected_style}
Count: {image_count}

Requirements:
- Natural skincare application
- Professional beauty photography
- Consistent face features
- Soft, natural lighting
- Clean, commercial-ready images
- Various application poses
- High-quality beauty photography

Style-specific instructions:
{application_prompt}
```

### Output
- 1-12 gambar aplikasi skincare
- Kualitas fotografi beauty profesional
- Aplikasi produk yang natural

---

## 7. **HOUSEHOLD PRODUCTS - Home Product Scenes**

### Deskripsi
Tampilkan model yang berinteraksi dengan produk rumah tangga.

### Input yang Diperlukan
- **Model Image**: Foto model
- **Product Image**: Foto produk rumah tangga
- **Use Scenario**: Pilih salah satu dari 6 pilihan
- **Image Count**: 1, 2, 3, 6, 9, atau 12 gambar

### Use Scenarios
1. **Kitchen Use** - Using products in kitchen
2. **Living Room** - Using products in living room
3. **Bathroom** - Using products in bathroom
4. **Cleaning** - Cleaning activities
5. **Organization** - Organizing activities
6. **Maintenance** - Home maintenance tasks

### Prompt Template
```
Generate images showing model using household products in realistic home scenarios.

Model: {model_image}
Product: {product_image}
Scenario: {selected_scenario}
Count: {image_count}

Requirements:
- Realistic home environment
- Natural product usage
- Professional lifestyle photography
- Consistent face features
- Clean, commercial-ready images
- Various usage poses
- High-quality lighting

Scenario-specific instructions:
{scenario_prompt}
```

### Output
- 1-12 gambar penggunaan produk rumah tangga
- Lingkungan rumah yang realistis
- Kualitas fotografi lifestyle profesional

---

## 8. **CHANGE POSE - Pose Variations**

### Deskripsi
Generate berbagai pose dinamis dari satu foto.

### Input yang Diperlukan
- **Model Image**: Foto model
- **Pose Style**: Pilih salah satu dari 6 pilihan
- **Image Count**: 1, 2, 3, 6, 9, atau 12 gambar

### Pose Styles
1. **Dynamic Poses** - Energetic, movement-based poses
2. **Professional Stance** - Formal, professional poses
3. **Casual Relaxed** - Relaxed, natural poses
4. **Fashion Editorial** - High-fashion poses
5. **Lifestyle Natural** - Natural, everyday poses
6. **Creative Artistic** - Artistic, creative poses

### Prompt Template
```
Generate various pose variations from the model image.

Model: {model_image}
Pose Style: {selected_style}
Count: {image_count}

Requirements:
- Consistent face features
- Natural pose variations
- Professional photography quality
- High-quality lighting
- Clean, commercial-ready images
- Various dynamic poses
- Maintain model's identity

Style-specific instructions:
{pose_prompt}
```

### Output
- 1-12 gambar dengan pose berbeda
- Konsistensi wajah di semua gambar
- Posisi yang natural dan dinamis

---

## 9. **CUSTOMIZE THEME - Theme Application**

### Deskripsi
Ubah foto Anda menjadi berbagai tema (fantasi, cyberpunk, dll).

### Input yang Diperlukan
- **Model Image**: Foto model
- **Product Image**: Foto produk (opsional)
- **Theme Style**: Pilih salah satu dari 8 pilihan
- **Image Count**: 1, 2, 3, 6, 9, atau 12 gambar

### Theme Styles
1. **Minimalist** - Clean, simple aesthetic
2. **Vintage** - Retro, classic styling
3. **Cyberpunk** - Futuristic, neon aesthetic
4. **Fantasy** - Magical, fantasy elements
5. **Industrial** - Urban, industrial style
6. **Nature** - Natural, organic elements
7. **Luxury** - High-end, premium aesthetic
8. **Artistic** - Creative, artistic interpretation

### Prompt Template
```
Transform the model image with {theme_style} theme.

Model: {model_image}
Product: {product_image}
Theme: {selected_theme}
Count: {image_count}

Requirements:
- Consistent face features
- Theme-appropriate styling
- Professional photography quality
- High-quality lighting
- Clean, commercial-ready images
- Creative theme interpretation
- Maintain model's identity

Theme-specific instructions:
{theme_prompt}
```

### Output
- 1-12 gambar dengan tema yang dipilih
- Transformasi kreatif yang konsisten
- Kualitas fotografi profesional

---

## 10. **MOTORCYCLE PRODUCTS - Riding Scenes**

### Deskripsi
Gabungkan foto AI Anda dengan motor untuk gambar yang keren.

### Input yang Diperlukan
- **Model Image**: Foto model
- **Product Image**: Foto motor
- **Riding Style**: Pilih salah satu dari 6 pilihan
- **Image Count**: 1, 2, 3, 6, 9, atau 12 gambar

### Riding Styles
1. **Urban Riding** - City street riding
2. **Adventure** - Off-road adventure
3. **Sport Racing** - High-speed racing
4. **Cruiser** - Relaxed cruising
5. **Touring** - Long-distance touring
6. **Custom** - Custom motorcycle style

### Prompt Template
```
Generate images combining model with motorcycle in {riding_style} scenes.

Model: {model_image}
Motorcycle: {product_image}
Riding Style: {selected_style}
Count: {image_count}

Requirements:
- Dynamic riding scenes
- Professional action photography
- Consistent face features
- High-quality lighting
- Clean, commercial-ready images
- Various riding poses
- Realistic motorcycle interaction

Style-specific instructions:
{riding_prompt}
```

### Output
- 1-12 gambar riding scenes
- Posisi riding yang dinamis
- Kualitas fotografi action profesional

---

## 11. **FOOD & BEVERAGE PRODUCTS - Dining Scenes**

### Deskripsi
Tampilkan model Anda sedang menikmati makanan atau minuman.

### Input yang Diperlukan
- **Model Image**: Foto model
- **Product Image**: Foto makanan/minuman
- **Dining Style**: Pilih salah satu dari 6 pilihan
- **Image Count**: 1, 2, 3, 6, 9, atau 12 gambar

### Dining Styles
1. **Restaurant Dining** - Elegant restaurant setting
2. **Casual Eating** - Relaxed, casual dining
3. **Coffee Shop** - Coffee shop atmosphere
4. **Home Dining** - Comfortable home setting
5. **Outdoor Picnic** - Outdoor dining experience
6. **Fine Dining** - Upscale dining experience

### Prompt Template
```
Generate images showing model enjoying food/beverage in {dining_style} setting.

Model: {model_image}
Product: {product_image}
Dining Style: {selected_style}
Count: {image_count}

Requirements:
- Appetizing food photography
- Natural dining expressions
- Professional lifestyle photography
- Consistent face features
- High-quality lighting
- Clean, commercial-ready images
- Various dining poses

Style-specific instructions:
{dining_prompt}
```

### Output
- 1-12 gambar dining scenes
- Ekspresi natural saat menikmati makanan
- Kualitas fotografi lifestyle profesional

---

## 12. **VOICE OVER GENERATOR - Narrative Creation**

### Deskripsi
Buat narasi voice over yang menarik dari gambar produk.

### Input yang Diperlukan
- **Product Images**: Multiple foto produk
- **Voice Over Style**: Pilih salah satu dari 6 pilihan
- **Custom Prompt**: Instruksi khusus (opsional)
- **Narrative Length**: Short/Medium/Long
- **Target Audience**: Demografi target
- **Tone**: Friendly/Professional/Casual/Luxury

### Voice Over Styles
1. **Fashion Elegant** - Elegant fashion narrative
2. **Product Commercial** - Commercial product description
3. **Lifestyle Story** - Lifestyle storytelling
4. **Technical Specs** - Technical product details
5. **Emotional Appeal** - Emotional connection narrative
6. **Educational** - Educational product information

### Prompt Template
```
Generate voice over narrative for product images.

Images: {product_images}
Style: {selected_style}
Length: {narrative_length}
Target Audience: {target_audience}
Tone: {tone}
Custom Instructions: {custom_prompt}

Requirements:
- Engaging narrative
- Product-focused content
- Appropriate tone for target audience
- Professional voice over quality
- Clear, compelling storytelling
- Commercial-ready script

Style-specific instructions:
{voice_over_prompt}
```

### Output
- Professional narrative text
- Script voice over yang menarik
- Konten yang sesuai dengan target audience

---

## 🔧 **Implementasi di Custom GPT**

### 1. Setup Gemini API
```javascript
// Konfigurasi API
const GEMINI_API_KEY = "your_api_key_here";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
```

### 2. Function untuk Generate Images
```javascript
async function generateImages(prompt, imageCount = 1) {
  const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
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

### 3. Function untuk Generate Text
```javascript
async function generateText(prompt) {
  const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
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
- [ ] Tambahkan validasi input

### Untuk Custom GPT:
- [ ] Setup Gemini API integration
- [ ] Buat action untuk setiap fitur
- [ ] Tambahkan parameter input
- [ ] Implementasikan output formatting
- [ ] Test semua fitur
- [ ] Buat dokumentasi user

## 🎯 **Tips Optimasi**

1. **Image Quality**: Gunakan prompt yang detail untuk kualitas tinggi
2. **Consistency**: Maintain consistent face features across images
3. **Style Matching**: Pastikan style preset sesuai dengan kebutuhan
4. **Error Handling**: Implementasikan fallback untuk API errors
5. **User Experience**: Berikan feedback yang jelas untuk user
6. **Performance**: Optimasi untuk response time yang cepat

---

**Multi Vdmax Studio** - Complete AI Visual Content Solution untuk Custom GPT 🚀
