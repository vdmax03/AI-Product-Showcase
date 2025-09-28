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
      
      promptText = `Create a fashion photoshoot by combining these two images:

IMAGE 1 (Model): Use the person's face and identity - IGNORE any person in IMAGE 2
IMAGE 2 (Product): Use ONLY the clothing design - IGNORE the person in this image

CRITICAL REQUIREMENTS:
- The person in the final image must be EXACTLY the same person from IMAGE 1 (model)
- IGNORE the person in IMAGE 2 (product) completely - do NOT use their face
- Use ONLY the clothing design from IMAGE 2 (keep exact colors and style)
- Setting: ${settingDescription}
- Create a new pose and background
- The final person must look identical to the person in IMAGE 1, not IMAGE 2

${faceConsistency ? facePreservationText : ''}

REMEMBER: Even if IMAGE 2 has a person, IGNORE them. Use only the clothing from IMAGE 2 and the person from IMAGE 1.

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
