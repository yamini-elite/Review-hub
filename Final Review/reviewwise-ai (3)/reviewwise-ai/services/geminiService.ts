
import { GoogleGenAI } from "@google/genai";
import { Review, UserProfile } from "../types";

const apiKey = process.env.API_KEY || '';
console.log("Gemini Service initialized. API Key present:", !!apiKey, "Length:", apiKey.length);
const ai = new GoogleGenAI({ apiKey });

export const getGeminiChatResponse = async (
  userMessage: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  reviews: Review[],
  profile: UserProfile
) => {
  // Format reviews into a context string
  const reviewsContext = reviews.length > 0
    ? reviews.map(r => `[${r.category}] ${r.title} (${r.rating}/5 stars): "${r.content}" by ${r.author} on ${r.date}`).join('\n\n')
    : "No reviews have been uploaded yet.";

  const userProfileContext = `
    User Profile:
    - Name: ${profile.name}
    - Interested Categories: ${profile.interests.join(', ')}
    - Recent Searches: ${profile.searchHistory.join(', ')}
    - Preference: Minimum ${profile.preferredRatingMin} star reviews.
  `;

  const systemInstruction = `
    You are 'Review Hub', a personalized review assistant for ${profile.name}. 
    Your goal is to provide recommendations based ON THE PROVIDED REVIEWS and THE USER'S PROFILE.
    
    CRITICAL RULES:
    1. Prioritize reviews that match the user's interests (${profile.interests.join(', ')}).
    2. If a user asks for a recommendation, explain WHY it fits their profile (e.g., "Since you like Electronics and searched for 'battery'...").
    3. Use Markdown (bold, lists) for readability.
    4. If no specific reviews match, suggest the closest alternative from the bank.
    
    USER DATA:
    ${userProfileContext}

    AVAILABLE REVIEWS:
    ${reviewsContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: `System Context: ${systemInstruction}` }] },
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `An error occurred while reaching the AI assistant. Details: ${(error as Error).message || error}`;
  }
};
