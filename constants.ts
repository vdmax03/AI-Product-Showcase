import { StylePreset } from './types';

export const PHOTOSHOOT_THEMES = [
  'Editorial Fashion Campaign',
  'Lifestyle Lookbook Story',
  'Streetwear Drop',
  'Luxury Brand Launch',
  'Resort Vacation Collection',
  'Festival Capsule Collection',
  'Athleisure Performance Series',
  'Romantic Vintage Story',
  'Futuristic Cyber Showcase',
  'Art Gallery Presentation',
];

export const LIGHTING_STYLES = [
  'Soft Diffused Daylight',
  'Golden Hour Sunbeams',
  'Moody Dramatic Shadows',
  'Color Gel Studio Lights',
  'Cinematic Rim Lighting',
  'Neon Backlit Glow',
  'High Key Flash',
  'Low Key Spotlight',
  'Natural Window Light',
  'Overcast Ambient Haze',
];

export const LOOKBOOK_STYLE_PRESETS: StylePreset[] = [
  { id: 'studio-professional', name: 'Studio Professional', prompt: 'Professional photography studio with clean white background, soft even lighting, and minimal props. Perfect for showcasing clothing details and maintaining face consistency.', description: 'Clean professional studio setting for accurate results.' },
  { id: 'urban-street-style', name: 'Urban Street Style', prompt: 'Urban street setting with concrete walls, graffiti art, and dynamic city atmosphere. Perfect for streetwear and casual fashion photography.', description: 'Urban street vibes with city backdrop.' },
  { id: 'outdoor-lifestyle', name: 'Outdoor Lifestyle', prompt: 'Natural outdoor setting with trees, parks, or city streets. Natural lighting and lifestyle photography approach for casual and active wear.', description: 'Outdoor lifestyle photography setting.' },
  { id: 'minimalist-artsy', name: 'Minimalist & Artsy', prompt: 'Minimalist artistic setting with clean lines, geometric shapes, and creative lighting. Focus on artistic composition and unique angles.', description: 'Minimalist artistic photography style.' },
  { id: 'elegant-luxury', name: 'Elegant & Luxury', prompt: 'Luxury setting with marble surfaces, gold accents, and sophisticated lighting. Perfect for high-end fashion and formal wear.', description: 'Elegant luxury photography setting.' },
  { id: 'beach-paradise', name: 'Beach Paradise', prompt: 'Tropical beach setting with white sand, palm trees, and crystal clear water. Perfect for summer and resort wear photography.', description: 'Tropical beach paradise setting.' },
  { id: 'cozy-cafe', name: 'Cozy Cafe', prompt: 'Warm cafe interior with wooden furniture, soft lighting, and cozy atmosphere. Perfect for casual and lifestyle fashion photography.', description: 'Cozy cafe setting for lifestyle shots.' },
  { id: 'interior-scandi', name: 'Interior Skandinavia', prompt: 'Bright Scandinavian living room with natural wood, indoor plants, and large windows flooding the space with daylight.', description: 'Bright airy apartment with Scandinavian decor.' },
  { id: 'rooftop-night', name: 'Rooftop Bar', prompt: 'Urban rooftop lounge at night with city skyline bokeh, string lights, and wet pavement reflections for cinematic energy.', description: 'Nighttime city rooftop with moody lighting.' },
  { id: 'tokyo-street', name: 'Jalanan Tokyo', prompt: 'Neon-lit Tokyo street after rain, glowing signage, wet asphalt reflections, and atmospheric steam for a vibrant night scene.', description: 'Electric downtown street with neon glow.' },
  { id: 'lux-apartment', name: 'Apartemen Mewah', prompt: 'Sophisticated penthouse interior with designer furniture, large glass windows, and polished marble finishes.', description: 'High-end apartment setting with luxury details.' },
  { id: 'tropical-beach', name: 'Pantai Tropis', prompt: 'Sun-drenched tropical beach boardwalk with palm trees, soft sand, and bright blue ocean backdrop.', description: 'Warm coastal vibe with palm trees and sun.' },
  { id: 'autumn-park', name: 'Taman Musim Gugur', prompt: 'Outdoor park filled with golden autumn foliage, scattered leaves, and warm soft sunlight filtering through trees.', description: 'Golden fall park with layered leaves.' },
  { id: 'heritage-architecture', name: 'Gedung Tua', prompt: 'Historic architecture with textured walls, arched windows, and vintage props for timeless storytelling.', description: 'Classic heritage building exterior/interior.' },
  { id: 'aesthetic-cafe', name: 'Kafe Estetik', prompt: 'Minimal cafe interior with terrazzo counters, latte art, soft daylight, and curated lifestyle props.', description: 'Chic coffee shop mood with lifestyle props.' },
  { id: 'flower-garden', name: 'Taman Bunga', prompt: 'Lush botanical garden with blooming flowers, soft petals in foreground, and dreamy natural light.', description: 'Romantic floral garden environment.' },
  { id: 'studio-minimal', name: 'Studio Minimalis', prompt: 'Editorial studio with seamless backdrop, sculptural props, and controlled lighting for a clean modern look.', description: 'High-fashion studio with minimal set design.' },
  { id: 'misty-forest', name: 'Hutan Berkabut', prompt: 'Moody forest clearing with soft fog, diffused light beams, and lush greenery for cinematic atmosphere.', description: 'Foggy woodland scene with depth.' },
  { id: 'runway-glam', name: 'Runway Fashion', prompt: 'High-fashion runway with spotlighting, glossy floor reflections, and audience bokeh for catwalk energy.', description: 'Bold runway moment with dramatic lights.' },
  { id: 'urban-night', name: 'Gaya Urban (Malam)', prompt: 'Moody city streets at night with reflective wet ground, neon signage, and cinematic rim light around the subject.', description: 'Urban night walk vibes with neon highlights.' },
  { id: 'classic-library', name: 'Perpustakaan Klasik', prompt: 'Vintage library with wooden shelves, warm sconces, and book stacks providing intellectual charm.', description: 'Classic library interior with warm ambience.' },
  { id: 'scenic-studio', name: 'Studio Geometris', prompt: 'Contemporary studio with geometric plinths, arches, and soft-edge shadows for editorial portraits.', description: 'Architectural studio set for people shots.' },
  { id: 'face-focused-studio', name: 'Studio Fokus Wajah', prompt: 'Professional portrait studio with soft, even lighting that highlights facial features without harsh shadows. Clean, minimal background that draws attention to the subject.', description: 'Optimized for face preservation and clarity.' },
  { id: 'natural-daylight', name: 'Cahaya Alami', prompt: 'Soft natural daylight setting with diffused lighting that enhances facial features naturally. Outdoor or near-window environment with gentle shadows.', description: 'Natural lighting perfect for face preservation.' },
  { id: 'high-fashion-face', name: 'Fashion Wajah Premium', prompt: 'High-end fashion photography setup with professional lighting that emphasizes facial structure and features. Clean, sophisticated background.', description: 'Premium fashion setting for face-focused shots.' },
  { id: 'product-accurate-studio', name: 'Studio Produk Akurat', prompt: 'Professional studio setting with clean, neutral background that allows the exact product details to be clearly visible. Even lighting that preserves all product colors and textures.', description: 'Optimized for accurate product representation.' },
  { id: 'minimal-product-focus', name: 'Fokus Produk Minimalis', prompt: 'Minimalist setting with simple background that draws attention to the product. Clean lighting that shows every detail of the clothing without distractions.', description: 'Clean setting for product accuracy.' },
  { id: 'simple-studio', name: 'Studio Sederhana', prompt: 'Simple studio background with clean lighting. Focus on the model and clothing without distractions.', description: 'Simple studio for accurate results.' },
  { id: 'neutral-background', name: 'Background Netral', prompt: 'Neutral colored background with even lighting. Perfect for showcasing the model and clothing clearly.', description: 'Neutral background for clear results.' },
  { id: 'creative-studio', name: 'Studio Kreatif', prompt: 'Creative studio setup with dynamic lighting and interesting backgrounds. Focus on artistic composition and unique angles.', description: 'Creative studio for unique results.' },
  { id: 'fashion-editorial', name: 'Editorial Fashion', prompt: 'High-fashion editorial style with dramatic lighting, interesting poses, and creative backgrounds. Professional fashion photography approach.', description: 'Editorial style for fashion-forward results.' },
  { id: 'lifestyle-casual', name: 'Lifestyle Casual', prompt: 'Casual lifestyle setting with natural poses and everyday environments. Relaxed, approachable fashion photography style.', description: 'Casual lifestyle for natural results.' },
];

export const BROLL_STYLE_PRESETS: StylePreset[] = [
  { id: 'studio-minimal', name: 'Studio Minimalis', prompt: 'Clean studio set with soft gradient backdrop, subtle shadows, and floating pedestal to spotlight the product.', description: 'Minimal seamless background with gentle gradient.' },
  { id: 'rustic-wood', name: 'Meja Kayu Rustic', prompt: 'Weathered wooden tabletop with warm tones, natural light streaks, and organic props like dried leaves and twigs.', description: 'Warm wooden surface with rustic props.' },
  { id: 'metal-glass', name: 'Refleksi Logam & Kaca', prompt: 'Mirror-polished metal and glass surfaces creating crisp reflections and futuristic highlights.', description: 'Sleek reflective set with chrome and glass.' },
  { id: 'calm-water', name: 'Permukaan Air Tenang', prompt: 'Shallow water surface with gentle ripples, soft spotlighting, and floating mist for a serene effect.', description: 'Glossy water reflections with tranquil mood.' },
  { id: 'soft-gradient', name: 'Latar Gradien Halus', prompt: 'Subtle pastel gradient background with airy particles and diffused lighting for a dreamy aesthetic.', description: 'Pastel gradient backdrop with soft glow.' },
  { id: 'desert-dramatic', name: 'Gurun Pasir Dramatis', prompt: 'Textured desert sand dunes, directional light, and heat haze for adventurous storytelling.', description: 'Sunlit desert environment with strong shadows.' },
  { id: 'moss-stones', name: 'Taman Lumut & Batu', prompt: 'Lush moss, smooth river stones, and gentle mist create a fresh rainforest micro world.', description: 'Green mini-ecosystem with mossy stones.' },
  { id: 'industrial-concrete', name: 'Beton Industrial', prompt: 'Raw concrete surfaces, moody rim lighting, and minimal metal props for an industrial aesthetic.', description: 'Industrial concrete textures and hard light.' },
  { id: 'neon-stage', name: 'Panggung Neon Tokyo', prompt: 'Neon floor panels, glowing tubes, and misty atmosphere inspired by futuristic Tokyo nightlife.', description: 'Vibrant neon stage with backlit glow.' },
  { id: 'lux-silk', name: 'Sutra & Satin Mewah', prompt: 'Flowing silk and satin drapery with specular highlights and spotlight to convey luxury.', description: 'Elegant folded fabrics with soft highlights.' },
  { id: 'geometric-solid', name: 'Bentuk Geometris', prompt: 'Bold geometric blocks, layered shapes, and dramatic shadows creating strong graphic composition.', description: 'Architectural shapes supporting the hero product.' },
  { id: 'paper-art', name: 'Lipatan Kertas Artistik', prompt: 'Layered paper sculptures, folded shapes, and directional lighting for an artsy handcrafted feel.', description: 'Paper craft stage with sculpted folds.' },
  { id: 'marble-lux', name: 'Meja Marmer Mewah', prompt: 'Polished white marble tabletop with subtle veining, soft top light, and elegant gold accents.', description: 'Luxury marble surface with premium feel.' },
  { id: 'dark-texture', name: 'Latar Gelap Bertekstur', prompt: 'Deep charcoal textured backdrop with controlled pools of light and soft haze for drama.', description: 'Dark textured background with moody light.' },
  { id: 'stone-leaves', name: 'Batu Alam & Daun Segar', prompt: 'Natural slate stones with fresh green leaves, dewdrops, and directional sunlight highlights.', description: 'Fresh organic set with stones and leaves.' },
  { id: 'scandi-counter', name: 'Dapur Modern', prompt: 'Modern Scandinavian kitchen counter with matte surfaces, soft daylight, and lifestyle props.', description: 'Clean kitchen counter scene for products.' },
  { id: 'classic-library-prop', name: 'Perpustakaan Klasik', prompt: 'Mahogany desk with stacked books, warm lamp glow, and soft dust particles in the air.', description: 'Classic library desk for premium goods.' },
];

export const LOOKBOOK_VARIATION_FOCUS = [
  'Full-body portrait showcasing the entire outfit in context.',
  'Dynamic walking pose captured mid-motion with energy.',
  'Seated lifestyle pose interacting naturally with the environment.',
  'Half-body close-up highlighting garment details and textures.',
  'Candid moment with the model looking away or adjusting the outfit.',
  'Editorial pose with expressive gesture and dramatic composition.',
  'Leaning against a wall with shallow depth-of-field city bokeh.',
  'Three-quarter turn showcasing silhouette and garment fit.',
];

export const BROLL_VARIATION_FOCUS = [
  'Front-facing hero shot with the product centered and powerful.',
  'Three-quarter angle emphasizing depth and dimensional highlights.',
  'Macro close-up revealing fine surface textures and key features.',
  'Flat-lay arrangement with complementary props framing the product.',
  'Low-angle perspective that makes the product feel bold and iconic.',
  'Creative motion-inspired setup with dynamic lighting or particles.',
  'Backlit silhouette with glow outlining the product shape.',
  'Reflection composition using mirrors, glass, or glossy surfaces.',
];

// Profile Picture Generation Constants
export const PROFILE_PICTURE_STYLES = [
  'Mixed Styles',
  'Professional',
  'Casual', 
  'High-Fashion',
];

export const PROFILE_PICTURE_SHOT_TYPES = [
  'Face',
  'Upper Body',
  'Full Body',
  'Random',
];

export const PROFILE_PICTURE_GENDERS = [
  'Female',
  'Male',
];

export const PROFILE_PICTURE_VARIATION_FOCUS = [
  'Professional headshot with confident expression and clean background.',
  'Casual portrait with natural lighting and relaxed pose.',
  'Creative artistic shot with unique composition and styling.',
  'Fashion-forward portrait with trendy outfit and modern styling.',
  'Classic portrait with timeless elegance and sophisticated look.',
  'Dynamic pose with movement and energy in the composition.',
  'Close-up face shot emphasizing facial features and expression.',
  'Environmental portrait incorporating interesting background elements.',
  'Studio-style portrait with controlled lighting and professional setup.',
  'Lifestyle portrait showing personality and character.',
];