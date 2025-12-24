
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateLogo = async (companyName: string, philosophy: string, variation: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // 提示词中使用英文通常对图像生成模型更稳定，但加入中文语境参考
  const prompt = `Create a professional, modern, and minimalist logo for a company named "${companyName}". 
  The company philosophy is: "${philosophy}". 
  Design requirement: High-quality vector style, clean lines, suitable for branding. 
  Variation unique seed: ${variation + Date.now()}. 
  Avoid complex text, focus on a symbolic icon and professional typography.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("生成 Logo 图像失败。");
};

export const editLogo = async (imageBase64: string, editPrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const base64Data = imageBase64.split(',')[1] || imageBase64;
  const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/png';

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        {
          text: `根据以下要求修改此 Logo: "${editPrompt}"。保持核心品牌识别度，但完美应用所要求的更改。`
        }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("编辑 Logo 图像失败。");
};
