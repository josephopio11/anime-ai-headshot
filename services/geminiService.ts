import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an anime-style image based on the input image.
 * @param base64Image The base64 encoded image string (raw data, no prefix).
 * @param mimeType The mime type of the image.
 * @returns The base64 data URI of the generated image or null if failed.
 */
export const generateAnimePortrait = async (
  base64Image: string,
  mimeType: string
): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: "Transform this photo into a high-quality anime style sketch portrait. Maintain the facial features, expression, and angle of the person, but render them in a clean, detailed Japanese anime art style. Use vibrant colors, cell shading, and expressive eyes typical of modern anime. The background should be simple or abstract to keep focus on the character.",
          },
        ],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating anime portrait:", error);
    throw error;
  }
};