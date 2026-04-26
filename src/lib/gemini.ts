import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateArticleImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          text: `A journalistic photo for a news article about: ${prompt}`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType || "image/jpeg"};base64,${base64EncodeString}`;
    }
  }
  throw new Error("No image generated");
}
