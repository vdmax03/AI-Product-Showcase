import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationMode, StylePreset, Gender, ShotType, ProfileStyle, GeneratedImage } from '../types';
import { LOOKBOOK_VARIATION_FOCUS, BROLL_VARIATION_FOCUS, PROFILE_PICTURE_VARIATION_FOCUS } from '../constants';


let ai: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

const getAI = (apiKey?: string): GoogleGenAI => {
  const key = apiKey || localStorage.getItem('gemini_api_key') || process.env.API_KEY;

  if (!key) {
    throw new Error("API key is required. Please enter your Gemini API key.");
  }

  if (!ai || currentApiKey !== key) {
    ai = new GoogleGenAI({ apiKey: key });
    currentApiKey = key;
  }

  return ai;
};

const fileToGenerativePart = (file: File) => {
  return new Promise<{ mimeType: string; data: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('Failed to read file as base64 string.'));
      }
      const base64String = reader.result.split(',')[1];
      resolve({
        mimeType: file.type,
        data: base64String,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};



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
): Promise<{ src: string; prompt: string }[]> => {
  // Always require API key for real generation
  if (!apiKey && !localStorage.getItem('gemini_api_key') && !process.env.API_KEY) {
    throw new Error("API key is required. Please enter your Gemini API key to generate images.");
  }

  const aiInstance = getAI(apiKey);

  const productPart = await fileToGenerativePart(productImage);
  const modelPart = mode === GenerationMode.Lookbook && modelImage ? await fileToGenerativePart(modelImage) : null;

  let isApiKeyInvalid = false;

  const generateSingleImage = async (variation: number): Promise<{ src: string; prompt: string } | null> => {
    const parts: any[] = [];
    let promptText = '';

    if (mode === GenerationMode.Lookbook && modelPart) {
      // FIRST IMAGE: Model (face and body)
      parts.push({ inlineData: modelPart });
      // SECOND IMAGE: Product (clothing only)
      parts.push({ inlineData: productPart });
      
      let facePreservationText = '';
      if (faceConsistency) {
        facePreservationText = `
FACE PRESERVATION - MANDATORY:
- Use ONLY the person from IMAGE 1 (model) - IGNORE any person in IMAGE 2
- The final person must be IDENTICAL to the person in IMAGE 1
- Copy the exact face, facial features, bone structure, and identity from IMAGE 1
- Maintain the same skin tone, texture, and facial proportions from IMAGE 1
- Keep the same hair color, style, and texture from IMAGE 1
- Preserve all unique facial characteristics from IMAGE 1
- DO NOT use the face from IMAGE 2 even if there is a person there`;
      }

      // Use style preset if provided, otherwise use theme and lighting
      const settingDescription = stylePreset ? stylePreset.prompt : `"${theme}" environment with "${lighting}" lighting`;
      
      promptText = `Create a professional photoshoot by combining these two images:

IMAGE 1 (Model): Use the person's face, facial features, and identity - IGNORE any person in IMAGE 2
IMAGE 2 (Product): Use ONLY the product/object design - IGNORE the person in this image

CRITICAL REQUIREMENTS:
- The person in the final image must be EXACTLY the same person from IMAGE 1 (model)
- MUST preserve the EXACT SAME FACE, facial features, bone structure, and identity from IMAGE 1
- IGNORE the person in IMAGE 2 (product) completely - do NOT use their face
- Use ONLY the product/object from IMAGE 2 (keep exact colors, design, and features)
- Setting: ${settingDescription}
- Create a new pose and background
- The final person must look identical to the person in IMAGE 1, not IMAGE 2
- PRESERVE the original person's appearance, facial structure, and identity

${faceConsistency ? facePreservationText : ''}

REMEMBER: Even if IMAGE 2 has a person, IGNORE them. Use only the product/object from IMAGE 2 and the person from IMAGE 1.

This is variation ${variation}/${count}.`;
    } else {
      parts.push({ inlineData: productPart });
      // Use style preset if provided, otherwise use theme and lighting
      const settingDescription = stylePreset ? stylePreset.prompt : `"${theme}" environment with "${lighting}" lighting`;
      
      promptText = `Act as a professional product photographer. Create a stunning, high-resolution B-roll shot of the product in the image. It is crucial that the product itself remains identical to the one in the uploaded image. Do not change its color, design, logos, or any details. Your job is to showcase this exact product in a new, creative photographic setting. The setting is ${settingDescription}. Emphasize a cinematic feel with dynamic composition and a shallow depth of field to make the product stand out. The final image must look like a professional advertisement. This is variation ${variation}/${count}.`;
    }
    parts.push({ text: promptText });

    try {
      const aiInstance = getAI(apiKey);
      const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return {
            src: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
            prompt: promptText.substring(0, 200), // Keep prompt short for display
          };
        }
      }
      return null;
    } catch (error: any) {
      const message = String(error?.message || error);
      if (message.includes('API key not valid') || message.includes('API_KEY_INVALID') || message.includes('INVALID_ARGUMENT')) {
        isApiKeyInvalid = true;
      }
      console.error(`Error generating image ${variation}:`, error);
      return null; // continue gracefully
    }
  };

  const generationPromises = Array.from({ length: Math.max(1, Math.min(12, count)) }, (_, i) => generateSingleImage(i + 1));

  const results = await Promise.all(generationPromises);

  // Filter out any null results from failed generations
  const filtered = results.filter((result): result is { src: string; prompt: string } => result !== null);

  // If API key is invalid or nothing came back, throw error instead of using mock
  if (isApiKeyInvalid) {
    throw new Error("Invalid API key. Please check your Gemini API key and try again.");
  }

  if (filtered.length === 0) {
    throw new Error("No images were generated. Please try again with different settings or check your API key.");
  }

  return filtered;
};

export const generateProfilePictures = async (
  userImage: File,
  gender: Gender,
  shotType: ShotType,
  style: ProfileStyle,
  apiKey?: string,
  count: number = 20
): Promise<{ src: string; prompt: string }[]> => {
  // Always require API key for real generation
  if (!apiKey && !localStorage.getItem('gemini_api_key') && !process.env.API_KEY) {
    throw new Error("API key is required. Please enter your Gemini API key to generate profile pictures.");
  }

  const aiInstance = getAI(apiKey);

  const userImagePart = await fileToGenerativePart(userImage);
  let isApiKeyInvalid = false;

  const generateSingleProfilePicture = async (variation: number): Promise<{ src: string; prompt: string } | null> => {
    const parts: any[] = [];
    
    // Build the prompt based on user selections - simplified for faster generation
    let promptText = `Create a professional profile picture of the person in the image. Keep their face and identity exactly the same. Style: ${style}, Shot: ${shotType}, Gender: ${gender}. ${PROFILE_PICTURE_VARIATION_FOCUS[variation % PROFILE_PICTURE_VARIATION_FOCUS.length]}. High quality, well-lit, perfect for social media.`;

    parts.push({ inlineData: userImagePart });
    parts.push({ text: promptText });

    try {
      const aiInstance = getAI(apiKey);
      const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return {
            src: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
            prompt: promptText.substring(0, 200), // Keep prompt short for display
          };
        }
      }
      return null;
    } catch (error: any) {
      const message = String(error?.message || error);
      if (message.includes('API key not valid') || message.includes('API_KEY_INVALID') || message.includes('INVALID_ARGUMENT')) {
        isApiKeyInvalid = true;
      }
      console.error(`Error generating profile picture ${variation}:`, error);
      return null; // continue gracefully
    }
  };

  // Generate images in optimized batches for 20 images
  const batchSize = 4;
  const totalImages = Math.max(1, Math.min(20, count));
  const results: ({ src: string; prompt: string } | null)[] = [];

  for (let i = 0; i < totalImages; i += batchSize) {
    const batchPromises = Array.from({ length: Math.min(batchSize, totalImages - i) }, (_, j) => 
      generateSingleProfilePicture(i + j + 1)
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < totalImages) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  // Filter out any null results from failed generations
  const filtered = results.filter((result): result is { src: string; prompt: string } => result !== null);

  // If API key is invalid or nothing came back, throw error instead of using mock
  if (isApiKeyInvalid) {
    throw new Error("Invalid API key. Please check your Gemini API key and try again.");
  }

  if (filtered.length === 0) {
    throw new Error("No profile pictures were generated. Please try again with different settings or check your API key.");
  }

  return filtered;
};

export const generateVideoFromImage = async (
  prompt: string,
  imageSrc: string, // This will be a data URL
  apiKey?: string
): Promise<string> => {
  // Always require API key for real video generation
  if (!apiKey && !localStorage.getItem('gemini_api_key') && !process.env.API_KEY) {
    throw new Error("API key is required. Please enter your Gemini API key to generate videos.");
  }

  const aiInstance = getAI(apiKey);

  const base64Data = imageSrc.split(',')[1];
  const mimeType = imageSrc.match(/data:(.*);base64,/)?.[1] || 'image/png';

  try {
    const aiInstance = getAI(apiKey);
    const enhancedPrompt = `Create a video from this exact image by adding natural motion. Keep the exact same appearance, face, product, and composition - do not change anything visually. Only add subtle, appropriate motion such as: walking forward, camera pan, product rotation, or gentle movement that fits the scene. Maintain the same framing and distance. ${prompt}`;
    let operation = await aiInstance.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: enhancedPrompt,
      image: {
        imageBytes: base64Data,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
      }
    });

    // Polling for the result
    while (!operation.done) {
      console.log('Video generation in progress, checking again in 10 seconds...');
      await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds
      operation = await aiInstance.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      throw new Error('Video generation finished but no download link was found.');
    }

    // Fetch the video and create a blob URL
    const key = apiKey || localStorage.getItem('gemini_api_key') || process.env.API_KEY;
    const videoResponse = await fetch(`${downloadLink}&key=${key}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download the generated video. Status: ${videoResponse.status}`);
    }
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error: any) {
    const message = String(error?.message || error);
    console.error('Error generating video:', error);
    throw new Error(`Video generation failed: ${message}`);
  }
};

export const generateVeo3Prompt = (
  image: GeneratedImage,
  mode: GenerationMode
): string => {
  const templates = {
    lookbook: {
      hook: "Apakah kamu pernah merasa bingung memadukan outfit yang stylish?",
      masalah: "Banyak orang kesulitan mengombinasikan pakaian agar terlihat fashionable dan percaya diri.",
      isi: "Dalam video ini, kita akan melihat bagaimana style yang tepat dapat mengubah penampilan secara total. Perhatikan detail outfit, warna, dan cara memadukan aksesori yang sempurna.",
      solusi: "Dengan tips styling yang tepat, kamu juga bisa tampil percaya diri dan stylish setiap hari!"
    },
    broll: {
      hook: "Pernahkah kamu penasaran bagaimana produk berkualitas dibuat?",
      masalah: "Konsumen sering ragu memilih produk karena tidak tahu kualitas dan detail produknya.",
      isi: "Mari kita lihat lebih dekat produk ini - dari detail material, craftsmanship, hingga fungsi yang membuatnya istimewa. Setiap sudut menunjukkan kualitas premium.",
      solusi: "Dengan memahami kualitas produk, kamu bisa membuat keputusan pembelian yang tepat!"
    },
    profilepicture: {
      hook: "Pernahkah kamu merasa foto profilmu kurang menarik atau profesional?",
      masalah: "Banyak orang kesulitan mendapatkan foto profil yang sempurna - terlalu formal, kurang natural, atau tidak mencerminkan kepribadian asli.",
      isi: "Dalam video ini, kita akan melihat bagaimana foto profil yang tepat dapat meningkatkan kepercayaan diri dan kesan profesional. Perhatikan pose, ekspresi, dan styling yang membuat foto terlihat natural namun menarik.",
      solusi: "Dengan tips fotografi profil yang tepat, kamu juga bisa memiliki foto profil yang sempurna untuk semua kebutuhan!"
    }
  };

  const template = mode === GenerationMode.Lookbook ? templates.lookbook : 
                   mode === GenerationMode.Broll ? templates.broll : 
                   templates.profilepicture;

  return `PROMPT 1 (Hook + Problem - 8 detik pertama):
Based on this image, create a dynamic vertical video (9:16 aspect ratio). The camera starts with a medium shot, then slowly zooms in and pans slightly to highlight the outfit details and styling. Use cinematic lighting, smooth dynamic motion, and showcase the subject prominently. Voiceover (Indonesian): "${template.hook}" "${template.masalah}"

PROMPT 2 (Content + Solution - sisa durasi):
Continue the same scene from the previous image. Show multiple angles and perspectives - close-ups of details, different poses, and various shots. Use smooth camera movements, dynamic lighting, and showcase the complete look from different angles. End with a confident wide shot. Voiceover (Indonesian): "${template.isi}" "${template.solusi}"`;
};

// Step 1: Analyze images with Gemini 2.5 Flash
export const analyzeProductImages = async (
  productImages: File[],
  apiKey?: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('API Key is required');
  }

  if (productImages.length === 0) {
    throw new Error('At least one product image is required');
  }

  try {
    // Convert images to base64
    const imagePromises = productImages.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const imageDataUrls = await Promise.all(imagePromises);

    // Create prompt for image analysis
    const analysisPrompt = `Analyze these product images and provide a detailed description in Indonesian. Focus on:

1. Product type and category
2. Visual features and characteristics
3. Colors, materials, and design elements
4. Target audience and use cases
5. Key selling points and benefits
6. Emotional appeal and lifestyle aspects

Provide a comprehensive analysis that can be used to create compelling product marketing content.`;

    // Prepare the request for image analysis
    const requestBody = {
      contents: [{
        parts: [
          {
            text: analysisPrompt
          },
          ...imageDataUrls.map(dataUrl => ({
            inline_data: {
              mime_type: "image/jpeg",
              data: dataUrl.split(',')[1]
            }
          }))
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Image Analysis API Error:', errorData);
      throw new Error(`Image analysis failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Image Analysis API Response:', data);
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      throw new Error('No image analysis generated - empty response from API');
    }
    
    const candidate = data.candidates[0];
    console.log('First candidate:', candidate);
    
    // Check if response was truncated due to max tokens
    if (candidate.finishReason === 'MAX_TOKENS') {
      console.warn('Response truncated due to MAX_TOKENS limit');
    }
    
    if (!candidate.content) {
      console.error('No content in candidate:', candidate);
      throw new Error('Invalid response structure from API - no content');
    }
    
    // Check if content has parts array
    if (!candidate.content.parts || !Array.isArray(candidate.content.parts)) {
      console.error('No parts array in candidate content:', candidate.content);
      
      // Try to extract text from different possible structures
      if (candidate.content.text) {
        console.log('Found text directly in content:', candidate.content.text);
        return candidate.content.text.trim();
      }
      
      // Check if there's a different structure
      const contentKeys = Object.keys(candidate.content);
      console.log('Available content keys:', contentKeys);
      
      throw new Error('Invalid response structure from API - no parts array');
    }
    
    const analysis = candidate.content.parts[0]?.text;
    console.log('Analysis text:', analysis);
    
    if (!analysis) {
      console.error('No text found in parts:', candidate.content.parts);
      
      // Try to find text in different possible locations
      const alternativeText = candidate.content.parts.find(part => part.text)?.text;
      if (alternativeText) {
        console.log('Found alternative text:', alternativeText);
        return alternativeText.trim();
      }
      
      throw new Error('No analysis text found in API response');
    }

    return analysis.trim();

  } catch (error) {
    console.error('Image analysis error:', error);
    throw error;
  }
};

// Step 2: Generate voice over text with regular Gemini
export const generateVoiceOverText = async (
  productImages: File[],
  stylePrompt: string,
  template: string,
  customPrompt: string,
  length: 'short' | 'medium' | 'long',
  targetAudience: string,
  tone: 'friendly' | 'professional' | 'casual' | 'luxury',
  apiKey?: string
): Promise<{ narrative: string; imageUrl?: string }> => {
  if (!apiKey) {
    throw new Error('API Key is required');
  }

  if (productImages.length === 0) {
    throw new Error('At least one product image is required');
  }

  try {
    // Step 1: Analyze images first
    const imageAnalysis = await analyzeProductImages(productImages, apiKey);

    // Convert first image for preview
    const firstImageDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(productImages[0]);
    });

    // Determine word count based on length
    const wordCounts = {
      short: '50-100 words',
      medium: '100-200 words',
      long: '200-300 words'
    };

    // Create the prompt for voice over text generation
    const voiceOverPrompt = `Based on this product analysis, generate a compelling voice over narrative in Indonesian:

PRODUCT ANALYSIS:
${imageAnalysis}

STYLE: ${stylePrompt}

TEMPLATE STRUCTURE: ${template}

TARGET AUDIENCE: ${targetAudience}
TONE: ${tone}
LENGTH: ${wordCounts[length]}

${customPrompt ? `ADDITIONAL INSTRUCTIONS: ${customPrompt}` : ''}

REQUIREMENTS FOR VOICE OVER TEXT:
- Write in Indonesian language with natural speech patterns
- Use engaging, persuasive language suitable for voice narration
- Include product benefits and features in conversational style
- Create emotional connection with target audience through voice
- Include compelling call-to-action
- Write in a way that sounds natural when spoken aloud
- Use pauses and emphasis markers where appropriate
- Focus on the product details from the analysis
- Use conversational tone appropriate for ${tone} style
- Avoid complex sentences that are hard to pronounce
- Use words that flow well when spoken
- Keep it CONCISE and to the point (max 4-5 sentences)
- Focus on key selling points only

Generate a compelling voice over script that would work perfectly for product marketing videos, social media content, or promotional materials.`;

    // Prepare the request for text generation
    const requestBody = {
      contents: [{
        parts: [
          {
            text: voiceOverPrompt
          }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    // Retry mechanism for API calls
    let response;
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          break; // Success, exit retry loop
        }
        
        if (response.status === 503 && retryCount < maxRetries) {
          console.warn(`Service unavailable, retrying... (${retryCount + 1}/${maxRetries})`);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Wait before retry
          continue;
        }
        
        break; // Exit retry loop for other errors or max retries reached
        
      } catch (error) {
        if (retryCount < maxRetries) {
          console.warn(`Network error, retrying... (${retryCount + 1}/${maxRetries})`);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        }
        throw error; // Re-throw if max retries reached
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      
      // Handle 503 Service Unavailable with fallback
      if (response.status === 503) {
        console.warn('Service temporarily unavailable, using fallback narrative');
        
        // Generate a simple narrative based on image analysis
        const fallbackNarrative = `Mau tampil elegan dan nyaman? ${imageAnalysis.split(' ').slice(0, 10).join(' ')} adalah solusinya. Dengan desain yang stylish dan kualitas terbaik, produk ini memberikan kenyamanan maksimal untuk gaya hidup modern Anda. Segera dapatkan dan rasakan perbedaannya!`;
        
        return {
          narrative: fallbackNarrative,
          imageUrl: firstImageDataUrl
        };
      }
      
      throw new Error(`Narrative generation failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      throw new Error('No narrative generated - empty response from API');
    }
    
    const candidate = data.candidates[0];
    console.log('First candidate:', candidate);
    
    // Check if response was truncated due to max tokens
    if (candidate.finishReason === 'MAX_TOKENS') {
      console.warn('Response truncated due to MAX_TOKENS limit');
    }
    
    if (!candidate.content) {
      console.error('No content in candidate:', candidate);
      throw new Error('Invalid response structure from API - no content');
    }
    
    // Check if content has parts array
    if (!candidate.content.parts || !Array.isArray(candidate.content.parts)) {
      console.error('No parts array in candidate content:', candidate.content);
      
      // Try to extract text from different possible structures
      if (candidate.content.text) {
        console.log('Found text directly in content:', candidate.content.text);
        return {
          narrative: candidate.content.text.trim(),
          imageUrl: firstImageDataUrl
        };
      }
      
      // Check if there's a different structure
      const contentKeys = Object.keys(candidate.content);
      console.log('Available content keys:', contentKeys);
      
      // If response was truncated due to MAX_TOKENS, try to use the image analysis as fallback
      if (candidate.finishReason === 'MAX_TOKENS') {
        console.warn('Using image analysis as fallback for truncated narrative response');
        
        // Try to generate a simple narrative using the image analysis
        try {
          const simpleNarrativePrompt = `Berdasarkan analisis produk berikut, buat narasi SINGKAT yang menarik dalam bahasa Indonesia:

${imageAnalysis}

Buat narasi yang:
- Menggunakan template: ${template}
- Gaya: ${stylePrompt}
- Target audience: ${targetAudience}
- Tone: ${tone}
- Panjang: ${wordCounts[length]}

REQUIREMENTS:
- Maksimal 3-4 kalimat
- Langsung ke poin utama produk
- Gunakan bahasa yang persuasif tapi ringkas
- Sertakan call-to-action singkat
- Hindari deskripsi yang terlalu detail

Narasi harus menarik, persuasif, dan siap digunakan untuk marketing.`;

          const simpleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: simpleNarrativePrompt }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 256,
              }
            })
          });

          if (simpleResponse.ok) {
            const simpleData = await simpleResponse.json();
            if (simpleData.candidates?.[0]?.content?.parts?.[0]?.text) {
              console.log('Generated fallback narrative from image analysis');
              return {
                narrative: simpleData.candidates[0].content.parts[0].text.trim(),
                imageUrl: firstImageDataUrl
              };
            }
          }
        } catch (fallbackError) {
          console.warn('Fallback narrative generation failed:', fallbackError);
        }
        
        // Ultimate fallback - simple generic narrative
        const fallbackNarrative = `Hadirkan gaya elegan dan nyaman dengan produk berkualitas tinggi ini. Desain yang stylish dan bahan terbaik memberikan kenyamanan maksimal untuk berbagai kesempatan. Segera dapatkan sekarang dan rasakan perbedaannya!`;
        
        return {
          narrative: fallbackNarrative,
          imageUrl: firstImageDataUrl
        };
      }
      
      throw new Error('Invalid response structure from API - no parts array');
    }
    
    const narrative = candidate.content.parts[0]?.text;
    console.log('Narrative text:', narrative);
    
    if (!narrative) {
      console.error('No text found in parts:', candidate.content.parts);
      
      // Try to find text in different possible locations
      const alternativeText = candidate.content.parts.find(part => part.text)?.text;
      if (alternativeText) {
        console.log('Found alternative text:', alternativeText);
        return {
          narrative: alternativeText.trim(),
          imageUrl: firstImageDataUrl
        };
      }
      
      throw new Error('No narrative text found in API response');
    }

    return {
      narrative: narrative.trim(),
      imageUrl: firstImageDataUrl // Return first image as preview
    };

  } catch (error) {
    console.error('Narrative generation error:', error);
    throw error;
  }
};

// Step 3: Generate audio with TTS model
export const generateVoiceOverAudio = async (
  text: string,
  apiKey?: string
): Promise<Blob> => {
  if (!apiKey) {
    throw new Error('API Key is required');
  }

  try {
    // Prepare the request for TTS generation (audio only)
    const requestBody = {
      contents: [{
        parts: [
          {
            text: text
          }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Voice over audio generation failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    // The response should contain audio data
    const audioBlob = await response.blob();
    return audioBlob;

  } catch (error) {
    console.error('Voice over audio generation error:', error);
    throw error;
  }
};

// Fallback Text-to-Speech Service using Web Speech API
export const generateVoiceOverAudioFallback = async (
  text: string,
  voice: string = 'id-ID-ArdiNeural',
  rate: number = 1.0,
  pitch: number = 1.0
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported in this browser'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0;

    // Try to set voice
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.name.includes(voice) || v.lang === 'id-ID');
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      // Note: Web Speech API doesn't return audio blob directly
      // This is a limitation - we'll need to use a different approach
      reject(new Error('Web Speech API cannot generate audio blob. Please use browser\'s built-in speech synthesis.'));
    };

    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    // Start speech synthesis
    speechSynthesis.speak(utterance);
  });
};

// Alternative: Generate voice over using external TTS service
export const generateVoiceOverWithTTS = async (
  text: string,
  apiKey?: string
): Promise<{ audioUrl: string; narrative: string }> => {
  // For now, return the text with instructions to use browser TTS
  // In production, you would integrate with a TTS service like:
  // - Google Cloud Text-to-Speech
  // - Amazon Polly
  // - Azure Cognitive Services
  // - ElevenLabs
  
  return {
    audioUrl: '', // No audio URL for now
    narrative: text
  };
};

// Household Products Generation Service
export const generateHouseholdProductImages = async (
  productImage: File,
  modelImage: File,
  style: string,
  apiKey?: string,
  count: number = 6
): Promise<{ src: string; prompt: string }[]> => {
  if (!apiKey) {
    throw new Error('API Key is required');
  }

  if (!productImage || !modelImage) {
    throw new Error('Both product and model images are required');
  }

  try {
    // Convert images to base64
    const productDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(productImage);
    });

    const modelDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(modelImage);
    });

    // Create specific prompt for household products
    const householdPrompt = `Generate ${count} professional product photography images showing the EXACT SAME PERSON from the uploaded model image interacting with household products.

CRITICAL REQUIREMENTS:
- MUST maintain the EXACT SAME FACE, facial features, and identity from the uploaded model image
- The person should be USING, HOLDING, or INTERACTING with the household product
- Show the actual household product being used in realistic home settings
- The person should NOT be wearing clothing with the product's pattern/design
- Focus on demonstrating the product's functionality and use cases
- Use natural home lighting and realistic home environments
- Show different angles and perspectives of the product in use
- PRESERVE the original person's appearance, facial structure, and identity

STYLE: ${style}

SCENARIOS TO INCLUDE:
- The SAME PERSON holding/using the household product
- The SAME PERSON demonstrating how to use the product
- Product being used in its intended home environment
- Close-up shots of the product being handled
- Wide shots showing the product in context

Generate realistic, professional images that showcase household products being used by the EXACT SAME PERSON from the uploaded image in natural home settings.`;

    // Prepare the request
    const requestBody = {
      contents: [{
        parts: [
          {
            text: householdPrompt
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: productDataUrl.split(',')[1]
            }
          },
          {
            inline_data: {
              mime_type: "image/jpeg", 
              data: modelDataUrl.split(',')[1]
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    // Retry mechanism for API calls
    let response;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount <= maxRetries) {
      try {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          break;
        }
        
        if (response.status === 503 && retryCount < maxRetries) {
          console.warn(`Service temporarily unavailable, retrying in ${(retryCount + 1) * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          retryCount++;
          continue;
        }
        
        const errorData = await response.json();
        throw new Error(`Generation failed: ${errorData.error?.message || 'Unknown error'}`);
      } catch (error) {
        if (retryCount < maxRetries && (error.message.includes('503') || error.message.includes('Service Unavailable'))) {
          console.warn(`Network error, retrying in ${(retryCount + 1) * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          retryCount++;
          continue;
        }
        throw error;
      }
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the generated text to extract image URLs and prompts
    const imageMatches = generatedText.match(/https:\/\/[^\s]+\.(jpg|jpeg|png|gif)/gi) || [];
    const promptMatches = generatedText.split('\n').filter(line => 
      line.trim() && !line.includes('http') && line.length > 20
    );

    // Generate multiple variations
    const results = [];
    for (let i = 0; i < count; i++) {
      const imageUrl = imageMatches[i];
      const prompt = promptMatches[i] || `Professional household product photography showing person using product in ${style.toLowerCase()} setting`;
      
      // Only add if we have a valid image URL
      if (imageUrl) {
        results.push({
          src: imageUrl,
          prompt: prompt
        });
      }
    }

    return results;

  } catch (error) {
    console.error('Household product generation error:', error);
    
    // Fallback: Return empty array if service is unavailable
    if (error.message.includes('503') || error.message.includes('Service Unavailable')) {
      console.warn('Service temporarily unavailable, returning empty results');
      return [];
    }
    
    throw error;
  }
};

// Virtual Try-On Generation Service
export const generateVirtualTryOnImages = async (
  modelImage: File,
  clothingImage: File,
  style: string,
  apiKey?: string,
  count: number = 6
): Promise<{ src: string; prompt: string }[]> => {
  if (!apiKey) {
    throw new Error('API Key is required');
  }

  if (!modelImage || !clothingImage) {
    throw new Error('Both model and clothing images are required');
  }

  try {
    // Convert images to base64
    const modelDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(modelImage);
    });

    const clothingDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(clothingImage);
    });

    // Create specific prompt for virtual try-on
    const tryOnPrompt = `Generate ${count} professional fashion photography images showing virtual try-on of clothing items.

CRITICAL REQUIREMENTS:
- MUST maintain the EXACT SAME FACE, facial features, and identity from the uploaded model image
- The person should be WEARING the clothing item from the second image
- Show the clothing item properly fitted on the person
- Use realistic lighting and professional photography style
- Show different angles and poses to showcase the clothing
- The clothing should look natural and well-fitted on the person
- Focus on the clothing item being worn, not just held
- PRESERVE the original person's appearance, facial structure, and identity

STYLE: ${style}

SCENARIOS TO INCLUDE:
- The SAME PERSON wearing the clothing item in various poses
- Different angles showing the clothing fit and style
- Professional fashion photography lighting
- Clean background to focus on the clothing
- Close-up shots showing clothing details
- Full-body shots showing the complete outfit

Generate realistic, professional images that showcase the clothing item being worn by the EXACT SAME PERSON from the uploaded model image.`;

    // Prepare the request
    const requestBody = {
      contents: [{
        parts: [
          {
            text: tryOnPrompt
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: modelDataUrl.split(',')[1]
            }
          },
          {
            inline_data: {
              mime_type: "image/jpeg", 
              data: clothingDataUrl.split(',')[1]
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    // Retry mechanism for API calls
    let response;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount <= maxRetries) {
      try {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          break;
        }
        
        if (response.status === 503 && retryCount < maxRetries) {
          console.warn(`Service temporarily unavailable, retrying in ${(retryCount + 1) * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          retryCount++;
          continue;
        }
        
        const errorData = await response.json();
        throw new Error(`Generation failed: ${errorData.error?.message || 'Unknown error'}`);
      } catch (error) {
        if (retryCount < maxRetries && (error.message.includes('503') || error.message.includes('Service Unavailable'))) {
          console.warn(`Network error, retrying in ${(retryCount + 1) * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          retryCount++;
          continue;
        }
        throw error;
      }
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the generated text to extract image URLs and prompts
    const imageMatches = generatedText.match(/https:\/\/[^\s]+\.(jpg|jpeg|png|gif)/gi) || [];
    const promptMatches = generatedText.split('\n').filter(line => 
      line.trim() && !line.includes('http') && line.length > 20
    );

    // Generate multiple variations
    const results = [];
    for (let i = 0; i < count; i++) {
      const imageUrl = imageMatches[i];
      const prompt = promptMatches[i] || `Professional virtual try-on photography showing person wearing clothing in ${style.toLowerCase()} style`;
      
      // Only add if we have a valid image URL
      if (imageUrl) {
        results.push({
          src: imageUrl,
          prompt: prompt
        });
      }
    }

    return results;

  } catch (error) {
    console.error('Virtual try-on generation error:', error);
    
    // Fallback: Return empty array if service is unavailable
    if (error.message.includes('503') || error.message.includes('Service Unavailable')) {
      console.warn('Service temporarily unavailable, returning empty results');
      return [];
    }
    
    throw error;
  }
};

// Product Backgrounds Generation Service
export const generateProductBackgroundImages = async (
  productImage: File,
  backgroundStyle: string,
  apiKey?: string,
  count: number = 6
): Promise<{ src: string; prompt: string }[]> => {
  if (!apiKey) {
    throw new Error('API Key is required');
  }

  if (!productImage) {
    throw new Error('Product image is required');
  }

  try {
    // Convert image to base64
    const productDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(productImage);
    });

    // Create specific prompt for product backgrounds
    const backgroundPrompt = `Generate ${count} professional product photography images with different background styles.

IMPORTANT REQUIREMENTS:
- Show the EXACT SAME PRODUCT from the uploaded image with the specified background style
- Use professional product photography lighting
- Show different angles and compositions of the product
- Focus on the product with the background as supporting element
- Use clean, professional photography techniques
- PRESERVE the original product's appearance, design, and features

BACKGROUND STYLE: ${backgroundStyle}

SCENARIOS TO INCLUDE:
- The SAME PRODUCT with the specified background style
- Different angles and compositions
- Professional lighting setup
- Clean, commercial photography style
- Close-up and wide shots
- Various product orientations

Generate realistic, professional product photography images that showcase the EXACT SAME PRODUCT from the uploaded image with the specified background style.`;

    // Prepare the request
    const requestBody = {
      contents: [{
        parts: [
          {
            text: backgroundPrompt
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: productDataUrl.split(',')[1]
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    // Retry mechanism for API calls
    let response;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount <= maxRetries) {
      try {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          break;
        }
        
        if (response.status === 503 && retryCount < maxRetries) {
          console.warn(`Service temporarily unavailable, retrying in ${(retryCount + 1) * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          retryCount++;
          continue;
        }
        
        const errorData = await response.json();
        throw new Error(`Generation failed: ${errorData.error?.message || 'Unknown error'}`);
      } catch (error) {
        if (retryCount < maxRetries && (error.message.includes('503') || error.message.includes('Service Unavailable'))) {
          console.warn(`Network error, retrying in ${(retryCount + 1) * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          retryCount++;
          continue;
        }
        throw error;
      }
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the generated text to extract image URLs and prompts
    const imageMatches = generatedText.match(/https:\/\/[^\s]+\.(jpg|jpeg|png|gif)/gi) || [];
    const promptMatches = generatedText.split('\n').filter(line => 
      line.trim() && !line.includes('http') && line.length > 20
    );

    // Generate multiple variations
    const results = [];
    for (let i = 0; i < count; i++) {
      const imageUrl = imageMatches[i];
      const prompt = promptMatches[i] || `Professional product photography with ${backgroundStyle.toLowerCase()} background`;
      
      // Only add if we have a valid image URL
      if (imageUrl) {
        results.push({
          src: imageUrl,
          prompt: prompt
        });
      }
    }

    return results;

  } catch (error) {
    console.error('Product background generation error:', error);
    
    // Fallback: Return empty array if service is unavailable
    if (error.message.includes('503') || error.message.includes('Service Unavailable')) {
      console.warn('Service temporarily unavailable, returning empty results');
      return [];
    }
    
    throw error;
  }
};
