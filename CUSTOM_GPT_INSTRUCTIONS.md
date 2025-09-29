# Multi Vdmax Studio - Custom GPT & Gemini Gems Instructions

## 🎯 Overview
Multi Vdmax Studio adalah aplikasi AI yang menyediakan 12 fitur canggih untuk generasi konten visual menggunakan Google Gemini API. Aplikasi ini dapat diakses via web dan juga dapat diintegrasikan dengan Custom GPT atau Gemini Gems.

## 🌐 Web Access
- **URL**: https://github.com/vdmax03/AI-Product-Showcase.git
- **Local Development**: `npm run dev` (runs on http://localhost:5206/)
- **API Key Required**: Gemini API key untuk semua fitur

## 🤖 Custom GPT Integration

### Prerequisites
1. **Gemini API Key**: Dapatkan dari Google AI Studio
2. **Image Upload Support**: Custom GPT harus mendukung upload gambar
3. **API Access**: Akses ke Google Gemini API

### Setup Instructions
1. Clone repository: `git clone https://github.com/vdmax03/AI-Product-Showcase.git`
2. Install dependencies: `npm install`
3. Set API key: `GEMINI_API_KEY=your_api_key_here`
4. Run locally: `npm run dev`

## 📋 Complete Feature List

### 🎨 **FITUR UTAMA (3 fitur)**

#### 1. **Lookbook** - Fashion Photoshoot
- **Fungsi**: Generate foto fashion dengan model dan produk pakaian
- **Input**: 
  - Model image (wajah dan tubuh)
  - Product image (pakaian)
  - Style preset (8 pilihan)
  - Theme & lighting
- **Output**: 1-12 gambar fashion profesional
- **API Endpoint**: `generateShowcaseImages(mode: 'Lookbook', ...)`

#### 2. **B-roll** - Product Showcase
- **Fungsi**: Generate video showcase untuk produk dengan berbagai angle
- **Input**: 
  - Product image
  - Theme & lighting
  - Style preset (6 pilihan)
- **Output**: 1-12 gambar produk profesional
- **API Endpoint**: `generateShowcaseImages(mode: 'Broll', ...)`

#### 3. **Profile Picture** - Professional Headshots
- **Fungsi**: Generate foto profil profesional dengan berbagai gaya
- **Input**: 
  - User image (wajah)
  - Gender (Male/Female)
  - Shot type (Headshot/UpperBody/FullBody)
  - Style (8 pilihan)
- **Output**: 1-20 gambar profil profesional
- **API Endpoint**: `generateProfilePictures(...)`

### 🚀 **FITUR TAMBAHAN (9 fitur)**

#### 4. **Virtual Try-On** - Clothing Simulation
- **Fungsi**: Upload foto Anda dan pakaian untuk melihat bagaimana tampilannya saat dikenakan
- **Input**: 
  - Model image (foto diri)
  - Clothing image (pakaian)
- **Output**: 1-12 gambar virtual try-on
- **API Endpoint**: `generateVirtualTryOnImages(...)`

#### 5. **Product Backgrounds** - Professional Backgrounds
- **Fungsi**: Generate latar belakang profesional untuk foto produk
- **Input**: 
  - Product image
  - Background style (8 pilihan)
- **Output**: 1-12 gambar dengan background profesional
- **API Endpoint**: `generateProductBackgroundImages(...)`

#### 6. **Skincare Applicator** - Beauty Product Visualization
- **Fungsi**: Visualisasikan model yang menggunakan produk perawatan kulit
- **Input**: 
  - Model image
  - Product image (skincare)
  - Application style (6 pilihan)
- **Output**: 1-12 gambar aplikasi skincare
- **API Endpoint**: `generateShowcaseImages(mode: 'Lookbook', ...)`

#### 7. **Household Products** - Home Product Scenes
- **Fungsi**: Tampilkan model yang berinteraksi dengan produk rumah tangga
- **Input**: 
  - Model image
  - Product image (household)
  - Use scenario (6 pilihan)
- **Output**: 1-12 gambar penggunaan produk rumah tangga
- **API Endpoint**: `generateHouseholdProductImages(...)`

#### 8. **Change Pose** - Pose Variations
- **Fungsi**: Generate berbagai pose dinamis dari satu foto
- **Input**: 
  - Model image
  - Pose style (6 pilihan)
- **Output**: 1-12 gambar dengan pose berbeda
- **API Endpoint**: `generateShowcaseImages(mode: 'Lookbook', ...)`

#### 9. **Customize Theme** - Theme Application
- **Fungsi**: Ubah foto Anda menjadi berbagai tema (fantasi, cyberpunk, dll)
- **Input**: 
  - Model image
  - Product image
  - Theme style (8 pilihan)
- **Output**: 1-12 gambar dengan tema yang dipilih
- **API Endpoint**: `generateShowcaseImages(mode: 'Lookbook', ...)`

#### 10. **Motorcycle Products** - Riding Scenes
- **Fungsi**: Gabungkan foto AI Anda dengan motor untuk gambar yang keren
- **Input**: 
  - Model image
  - Product image (motorcycle)
  - Riding style (6 pilihan)
- **Output**: 1-12 gambar riding scenes
- **API Endpoint**: `generateShowcaseImages(mode: 'Lookbook', ...)`

#### 11. **Food & Beverage Products** - Dining Scenes
- **Fungsi**: Tampilkan model Anda sedang menikmati makanan atau minuman
- **Input**: 
  - Model image
  - Product image (food/beverage)
  - Dining style (6 pilihan)
- **Output**: 1-12 gambar dining scenes
- **API Endpoint**: `generateShowcaseImages(mode: 'Lookbook', ...)`

#### 12. **Voice Over Generator** - Narrative Creation
- **Fungsi**: Buat narasi voice over yang menarik dari gambar produk
- **Input**: 
  - Product images (multiple)
  - Voice over style (6 pilihan)
  - Custom prompt
  - Target audience
  - Tone (friendly/professional/casual/luxury)
- **Output**: Text narrative untuk voice over
- **API Endpoint**: `generateVoiceOverText(...)`

## 🔧 Technical Implementation

### API Service Structure
```typescript
// Main service file: services/geminiService.ts
export const generateShowcaseImages = async (
  mode: GenerationMode,
  theme: string,
  lighting: string,
  productImage: File,
  modelImage?: File | null,
  apiKey?: string,
  count: number = 6,
  faceConsistency: boolean = true,
  faceQuality: string = 'high',
  stylePreset?: { prompt: string; name: string }
): Promise<{ src: string; prompt: string }[]>
```

### Required Dependencies
```json
{
  "@google/genai": "latest",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.0.0"
}
```

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🎨 Style Presets Available

### Lookbook Styles (8 pilihan)
1. Studio Kreatif
2. Editorial Fashion
3. Street Style
4. Luxury Brand
5. Casual Chic
6. Bohemian
7. Minimalist
8. Vintage

### B-roll Styles (6 pilihan)
1. Product Focus
2. Lifestyle
3. Technical
4. Artistic
5. Commercial
6. Editorial

### Background Styles (8 pilihan)
1. Studio Clean
2. Natural Wood
3. Marble Luxury
4. Concrete Modern
5. Fabric Texture
6. Gradient Smooth
7. Outdoor Natural
8. Minimalist

## 🚀 Usage Examples

### Example 1: Generate Profile Pictures
```javascript
const result = await generateProfilePictures(
  userImage,           // File
  Gender.Female,       // Gender
  ShotType.UpperBody,  // Shot Type
  ProfileStyle.MixedStyles, // Style
  apiKey,              // API Key
  5                    // Count
);
```

### Example 2: Generate Lookbook
```javascript
const result = await generateShowcaseImages(
  'Lookbook',          // Mode
  'Studio Kreatif',    // Theme
  'Professional Studio Lighting', // Lighting
  productImage,        // Product File
  modelImage,          // Model File
  apiKey,              // API Key
  6,                   // Count
  true,                // Face Consistency
  'high',              // Face Quality
  { prompt: 'Fashion editorial style', name: 'Editorial' } // Style Preset
);
```

### Example 3: Generate Voice Over
```javascript
const result = await generateVoiceOverText(
  productImages,       // File[]
  'Fashion Elegant',   // Style Prompt
  'Simple narrative',  // Template
  'Custom instructions', // Custom Prompt
  'medium',            // Length
  'wanita muda',       // Target Audience
  'friendly',          // Tone
  apiKey               // API Key
);
```

## 📱 Mobile & Desktop Support
- **Responsive Design**: Mendukung semua ukuran layar
- **Touch Friendly**: Optimized untuk mobile devices
- **Progressive Web App**: Dapat diinstall sebagai PWA

## 🔒 Security & Privacy
- **API Key Protection**: Keys tidak disimpan di frontend
- **Image Privacy**: Gambar diproses langsung ke Gemini API
- **No Data Storage**: Tidak menyimpan gambar user

## 🎯 Best Practices

### Untuk Custom GPT Integration:
1. **Image Quality**: Gunakan gambar berkualitas tinggi (min 400x400px)
2. **Face Visibility**: Pastikan wajah model terlihat jelas
3. **Product Clarity**: Produk harus terlihat detail dan jelas
4. **API Rate Limiting**: Implementasikan delay antar request
5. **Error Handling**: Siapkan fallback untuk API errors

### Untuk Gemini Gems:
1. **Batch Processing**: Gunakan batch untuk multiple images
2. **Style Consistency**: Pilih style yang konsisten dengan brand
3. **Count Optimization**: Mulai dengan 1-2 gambar untuk testing
4. **Quality Settings**: Gunakan 'high' untuk face quality

## 📞 Support & Contact
- **Repository**: https://github.com/vdmax03/AI-Product-Showcase.git
- **Issues**: Gunakan GitHub Issues untuk bug reports
- **Documentation**: Lengkap tersedia di repository

## 🔄 Updates & Maintenance
- **Regular Updates**: Repository diupdate secara berkala
- **New Features**: Fitur baru ditambahkan berdasarkan feedback
- **Bug Fixes**: Issues diperbaiki dengan cepat
- **API Compatibility**: Selalu kompatibel dengan Gemini API terbaru

---

**Multi Vdmax Studio** - Your Complete AI Visual Content Solution 🚀
