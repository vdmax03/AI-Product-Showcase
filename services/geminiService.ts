import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationMode } from '../types';

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

const generateMockImages = async (prompt: string): Promise<{ src: string, prompt: string }[]> => {
    await new Promise(res => setTimeout(res, 1000 + Math.random() * 1000));
    const images = Array.from({ length: 6 }, (_, i) => {
        const randomId = Math.floor(Math.random() * 1000) + i;
        return {
            src: `https://picsum.photos/512/768?random=${randomId}`,
            prompt: prompt.length > 150 ? `${prompt.substring(0, 147)}...` : prompt,
        };
    });
    return images;
}


export const generateShowcaseImages = async (
  mode: GenerationMode,
  theme: string,
  lighting: string,
  productImage: File,
  modelImage?: File | null,
  apiKey?: string
): Promise<{ src: string; prompt: string }[]> => {
  try {
    const aiInstance = getAI(apiKey);
  } catch (error) {
    // If no API key, use mock functionality
    const mockPrompt = `This is a mock response for ${mode} with theme ${theme} and lighting ${lighting}.`;
    return generateMockImages(mockPrompt);
  }

  const productPart = await fileToGenerativePart(productImage);
  const modelPart = mode === GenerationMode.Lookbook && modelImage ? await fileToGenerativePart(modelImage) : null;

  const generateSingleImage = async (variation: number): Promise<{ src: string; prompt: string } | null> => {
    const parts: any[] = [];
    let promptText = '';

    if (mode === GenerationMode.Lookbook && modelPart) {
      parts.push({ inlineData: modelPart });
      parts.push({ inlineData: productPart });
      promptText = `You are a professional fashion photoshoot editor. Your task is to place the person from the first input image into a new setting, wearing the clothes from the second input image. It is absolutely critical that you DO NOT change the model's face, facial features, or identity in any way. The face in the output image must be identical to the face in the first input image. Equally important, the product from the second image (the clothing/accessory) must remain completely unchanged. Do not alter its color, shape, texture, or any specific details. Your only task is to style it on the model within a new scene. The new scene should be a "${theme}" photoshoot with "${lighting}". Pose the model naturally and dynamically. This is variation ${variation}/6.`;
    } else {
      parts.push({ inlineData: productPart });
      promptText = `Act as a professional product photographer. Create a stunning, high-resolution B-roll shot of the product in the image. It is crucial that the product itself remains identical to the one in the uploaded image. Do not change its color, design, logos, or any details. Your job is to showcase this exact product in a new, creative photographic setting. The setting is "${theme}" with a "${lighting}" lighting style. Emphasize a cinematic feel with dynamic composition and a shallow depth of field to make the product stand out. The final image must look like a professional advertisement. This is variation ${variation}/6.`;
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
    } catch (error) {
      console.error(`Error generating image ${variation}:`, error);
      // Don't throw, just return null so Promise.all doesn't fail completely
      return null;
    }
  };

  const generationPromises = Array.from({ length: 6 }, (_, i) => generateSingleImage(i + 1));

  const results = await Promise.all(generationPromises);

  // Filter out any null results from failed generations
  return results.filter((result): result is { src: string; prompt: string } => result !== null);
};

export const generateVideoFromImage = async (
  prompt: string,
  imageSrc: string, // This will be a data URL
  apiKey?: string
): Promise<string> => {
  try {
    const aiInstance = getAI(apiKey);
  } catch (error) {
    // Mock functionality for video
    console.log("Mocking video generation...");
    await new Promise(res => setTimeout(res, 3000));
    // Return a sample video URL for testing
    return 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4';
  }

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

  } catch (error) {
    console.error('Error generating video:', error);
    throw error; // Re-throw the error to be caught by the UI
  }
};
