# Multi Vdmax Studio 🚀

**Complete AI Visual Content Solution** - Generate professional images and content using Google Gemini API

[![GitHub](https://img.shields.io/badge/GitHub-vdmax03%2FAI--Product--Showcase-blue)](https://github.com/vdmax03/AI-Product-Showcase)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Gemini API](https://img.shields.io/badge/Gemini-API-orange.svg)](https://ai.google.dev/)

## 🎯 Overview

Multi Vdmax Studio adalah aplikasi AI canggih yang menyediakan **12 fitur lengkap** untuk generasi konten visual profesional. Aplikasi ini menggunakan Google Gemini API untuk menghasilkan gambar berkualitas tinggi dengan berbagai gaya dan tema.

## ✨ Features

### 🎨 **FITUR UTAMA (3 fitur)**

#### 1. **Lookbook** - Fashion Photoshoot
- Generate foto fashion profesional dengan model dan produk
- 8 style preset (Studio Kreatif, Editorial Fashion, Street Style, dll)
- Pilihan tema dan lighting yang beragam
- Output: 1-12 gambar berkualitas tinggi

#### 2. **B-roll** - Product Showcase  
- Generate video showcase untuk produk dengan berbagai angle
- 6 style preset (Product Focus, Lifestyle, Technical, dll)
- Professional lighting dan backgrounds
- Output: 1-12 gambar produk profesional

#### 3. **Profile Picture** - Professional Headshots
- Generate foto profil profesional dengan berbagai gaya
- 8 style preset (Studio Professional, Creative, Casual, dll)
- Pilihan shot type (Headshot, UpperBody, FullBody)
- Output: 1-20 gambar profil profesional

### 🚀 **FITUR TAMBAHAN (9 fitur)**

#### 4. **Virtual Try-On** - Clothing Simulation
- Upload foto Anda dan pakaian untuk melihat hasilnya
- Professional fashion photography style
- Realistic clothing simulation
- Output: 1-12 gambar virtual try-on

#### 5. **Product Backgrounds** - Professional Backgrounds
- Generate latar belakang profesional untuk foto produk
- 8 background style (Studio Clean, Natural Wood, Marble Luxury, dll)
- Perfect untuk e-commerce dan marketing
- Output: 1-12 gambar dengan background profesional

#### 6. **Skincare Applicator** - Beauty Product Visualization
- Visualisasikan model yang menggunakan produk perawatan kulit
- 6 application style (Serum Application, Cream Application, dll)
- Natural dan professional lighting
- Output: 1-12 gambar aplikasi skincare

#### 7. **Household Products** - Home Product Scenes
- Tampilkan model yang berinteraksi dengan produk rumah tangga
- 6 use scenario (Kitchen Use, Living Room, dll)
- Realistic home environment
- Output: 1-12 gambar penggunaan produk rumah tangga

#### 8. **Change Pose** - Pose Variations
- Generate berbagai pose dinamis dari satu foto
- 6 pose style (Dynamic Poses, Professional Stance, dll)
- Maintain face consistency
- Output: 1-12 gambar dengan pose berbeda

#### 9. **Customize Theme** - Theme Application
- Ubah foto Anda menjadi berbagai tema
- 8 theme style (Minimalist, Vintage, Cyberpunk, dll)
- Creative transformation
- Output: 1-12 gambar dengan tema yang dipilih

#### 10. **Motorcycle Products** - Riding Scenes
- Gabungkan foto AI Anda dengan motor untuk gambar yang keren
- 6 riding style (Urban Riding, Adventure, dll)
- Dynamic outdoor scenes
- Output: 1-12 gambar riding scenes

#### 11. **Food & Beverage Products** - Dining Scenes
- Tampilkan model Anda sedang menikmati makanan atau minuman
- 6 dining style (Restaurant Dining, Casual Eating, dll)
- Appetizing food photography
- Output: 1-12 gambar dining scenes

#### 12. **Voice Over Generator** - Narrative Creation
- Buat narasi voice over yang menarik dari gambar produk
- 6 voice over style (Fashion Elegant, Product Commercial, dll)
- Customizable tone dan target audience
- Output: Professional narrative text

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI API**: Google Gemini API
- **UI Components**: Custom components with gradients and animations
- **Image Processing**: Advanced face consistency and quality control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google Gemini API key
- Modern web browser

### Installation

```bash
# Clone repository
git clone https://github.com/vdmax03/AI-Product-Showcase.git
cd ai-product-showcase

# Install dependencies
npm install

# Set up environment variables
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Run development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5206/`

## 🔑 API Key Setup

1. Dapatkan API key dari [Google AI Studio](https://ai.google.dev/)
2. Set API key di environment variables:
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```
3. Atau langsung set di kode (tidak direkomendasikan untuk production)

## 📱 Usage

### Web Interface
1. Buka aplikasi di browser
2. Masukkan API key Gemini Anda
3. Pilih fitur yang diinginkan
4. Upload gambar yang diperlukan
5. Pilih style dan pengaturan
6. Klik "Generate" dan tunggu hasilnya

### Custom GPT Integration
Lihat [CUSTOM_GPT_INSTRUCTIONS.md](CUSTOM_GPT_INSTRUCTIONS.md) untuk panduan lengkap integrasi dengan Custom GPT.

### Gemini Gems Integration
Lihat [GEMINI_GEMS_INSTRUCTIONS.md](GEMINI_GEMS_INSTRUCTIONS.md) untuk panduan integrasi dengan Gemini Gems.

## 🎨 Style Presets

### Lookbook Styles
- **Studio Kreatif**: Creative studio setting dengan artistic lighting
- **Editorial Fashion**: High-fashion editorial style
- **Street Style**: Urban street fashion
- **Luxury Brand**: Premium luxury brand aesthetic
- **Casual Chic**: Relaxed yet stylish
- **Bohemian**: Free-spirited, eclectic style
- **Minimalist**: Clean, simple aesthetic
- **Vintage**: Retro, classic styling

### Background Styles
- **Studio Clean**: White studio background
- **Natural Wood**: Wooden texture background
- **Marble Luxury**: Elegant marble surface
- **Concrete Modern**: Industrial concrete texture
- **Fabric Texture**: Soft fabric background
- **Gradient Smooth**: Smooth color gradient
- **Outdoor Natural**: Natural outdoor setting
- **Minimalist**: Clean, simple background

## 🔧 Advanced Features

### Face Consistency
- Advanced face consistency algorithms
- High-quality face preservation
- Multiple face quality options

### Image Count Options
- Flexible image count (1, 2, 3, 6, 9, 12)
- Special options for Profile Pictures (up to 20)
- Optimized for different use cases

### Error Handling
- Comprehensive error handling
- User-friendly error messages
- Automatic retry mechanisms

## 📊 Performance

- **Fast Generation**: Optimized API calls
- **Responsive Design**: Mobile-friendly interface
- **Progressive Web App**: Can be installed as PWA
- **Caching**: Smart caching for better performance

## 🔒 Security & Privacy

- **API Key Protection**: Keys tidak disimpan di frontend
- **Image Privacy**: Gambar diproses langsung ke Gemini API
- **No Data Storage**: Tidak menyimpan gambar user
- **Secure Communication**: HTTPS dan secure API calls

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Support

- Fully responsive design
- Touch-optimized controls
- Mobile-first approach
- Progressive Web App ready

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 🐛 Bug Reports

Jika menemukan bug, silakan buat issue dengan:
- Deskripsi bug yang jelas
- Langkah-langkah reproduksi
- Screenshot jika diperlukan
- Informasi browser dan OS

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/vdmax03/AI-Product-Showcase/issues)
- **Documentation**: [Full documentation](https://github.com/vdmax03/AI-Product-Showcase#readme)
- **Custom GPT Guide**: [CUSTOM_GPT_INSTRUCTIONS.md](CUSTOM_GPT_INSTRUCTIONS.md)
- **Gemini Gems Guide**: [GEMINI_GEMS_INSTRUCTIONS.md](GEMINI_GEMS_INSTRUCTIONS.md)

## 🎯 Roadmap

- [ ] More style presets
- [ ] Video generation support
- [ ] Batch processing improvements
- [ ] Advanced customization options
- [ ] API rate limiting
- [ ] User authentication
- [ ] Cloud storage integration

## 🙏 Acknowledgments

- Google Gemini API team
- React community
- Tailwind CSS team
- Open source contributors

---

**Multi Vdmax Studio** - Your Complete AI Visual Content Solution 🚀

*Generate professional images and content with the power of AI*