import { GoogleGenAI } from "@google/genai";

/**
 * Helper function to initialize Gemini API client.
 * API key is always read from process.env.API_KEY.
 */
const getClient = () => {
  const apiKey = "AIzaSyCqqMO6veVfYCCC5kbhoAZmMj_cMal9fmk"; // Hardcoded for GitHub Pages
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Most economical and performant model
const DEFAULT_MODEL = 'gemini-3-flash';

export const getWeddingAdvice = async (query: string, contextData?: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Disabled: API Key not found. Please ensure the key is loaded in the system.";

  const systemInstruction = `You are a world-class wedding planning expert specializing in luxury weddings in Bodrum, Turkey.
  Wedding Date: October 10, 2026. 
  Character: Proactive, polite, knowledgeable about Turkish traditions and Bodrum's geography (weather, venues, logistics).
  Responses: Short, clear, actionable, and friendly. 
  Language: ALWAYS respond in English.
  Important: If budget or cost is asked, remind them that Bodrum is a premium location but always provide budget-friendly tips.
  Current Simulation Date: January 26, 2026. Provide planning advice based on this date (e.g., "There are approximately 8.5 months until the wedding").`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Current Context: ${contextData || 'General planning stage'}. \n\n User Question: ${query}`,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.8,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "I couldn't generate advice at the moment, please try again.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Free tier limit check (429 Too Many Requests)
    if (error.message?.includes("429")) {
      return "Free tier usage limit reached (15 requests per minute). Please wait a minute and try again.";
    }
    return "Sorry, I cannot connect right now. Please check if your API key is active.";
  }
};

export const analyzeInspirationIdea = async (idea: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Not Ready.";

  const prompt = `
    Analyze the following wedding idea and evaluate it for a Bodrum wedding on Oct 10, 2026 (Today's date: Jan 26, 2026): "${idea}".
    Limit your response to these 3 points in English:
    1. Recommended vendor type.
    2. A specific challenge for Bodrum (Logistics or Weather).
    3. A budget-friendly tip.
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are an analysis expert. Your responses must be in English and professional.",
        temperature: 0.4
      }
    });
    return response.text || "Analysis cannot be performed for this idea at the moment.";
  } catch (error: any) {
    if (error.message?.includes("429")) return "Analysis limit reached. Please wait a moment.";
    return "Could not analyze idea.";
  }
};