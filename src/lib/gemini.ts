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

export async function generateFullArticle(summary: string, languageCode: string): Promise<string> {
  const langMap: Record<string, string> = {
    'en': 'English',
    'hi': 'Hindi',
    'fr': 'French',
    'es': 'Spanish'
  };
  const targetLanguage = langMap[languageCode] || languageCode;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: `You are a professional journalist. Write a detailed, comprehensive, full-length news article (around 4-5 paragraphs) in ${targetLanguage} based on the following short summary or title: "${summary}". Do not include any title, only the article body text. Use professional formatting, line breaks, and clear sentence structure.`
          }
        ]
      }
    });
    return response.text || summary;
  } catch (error) {
    console.error("Full article generation error", error);
    return summary;
  }
}

export async function translateText(text: string, targetLanguageCode: string): Promise<string> {
  // Map code to full language name to help LLM
  const langMap: Record<string, string> = {
    'en': 'English',
    'hi': 'Hindi',
    'fr': 'French',
    'es': 'Spanish'
  };
  const targetLanguage = langMap[targetLanguageCode] || targetLanguageCode;
  
  if (targetLanguageCode === 'en') return text; // already english or fallback to english

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: `Translate the following markdown text into ${targetLanguage}. Return ONLY the translated markdown text, without any additional explanations, introductions, or formatting outside of the markdown itself:\n\n${text}`
          }
        ]
      }
    });
    return response.text || text;
  } catch (error) {
    console.error("Translation error", error);
    return text;
  }
}
