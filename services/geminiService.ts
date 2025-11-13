
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SANITIZATION_PROMPT = `Analyze the following email text and determine if it is a phishing attempt. Your response must be a single word: either "phishing" or "safe". Do not provide any explanation or other text.

Email Text:
"""
`;

export const analyzeEmailText = async (emailText: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${SANITIZATION_PROMPT}${emailText}"""`,
  });
  return response.text.trim().toLowerCase();
};

const DETAILED_ANALYSIS_PROMPT = `You are a cybersecurity expert. Provide a detailed, point-by-point analysis of the following email text to identify any signs of phishing. Explain your reasoning for each point. If the email appears safe, explain why. Structure your response in Markdown.

Email Text:
"""
`;

export const getDetailedAnalysis = async (emailText: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `${DETAILED_ANALYSIS_PROMPT}${emailText}"""`,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
};

const SEARCH_GROUNDING_PROMPT = `Based on Google Search results, analyze the following email content. Check the legitimacy of any mentioned companies, links, or sender domains. Summarize your findings and highlight any potential red flags.

Email Text:
"""
`;

export const checkWithGoogleSearch = async (emailText: string): Promise<{ text: string; sources: any[] }> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${SEARCH_GROUNDING_PROMPT}${emailText}"""`,
        config: {
            tools: [{googleSearch: {}}],
        },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text: response.text, sources };
};
