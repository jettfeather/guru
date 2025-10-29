import { GoogleGenAI, Type } from "@google/genai";
import { JournalEntry, Goal } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY is not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const callGemini = async (prompt: string, isJson: boolean = false) => {
    if (!API_KEY) throw new Error("API key not configured.");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: isJson ? { responseMimeType: "application/json" } : {},
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};

export const getMotivationalQuote = async (): Promise<string> => {
    try {
        const prompt = "Generate a short, uplifting motivational quote about personal growth or consistency. Max 20 words.";
        const responseText = await callGemini(prompt);
        // Clean up the response, removing quotes and asterisks
        return responseText.replace(/["*]/g, '').trim();
    } catch {
        return "The journey of a thousand miles begins with a single step.";
    }
};

export const generateWordCloudData = async (entries: JournalEntry[]): Promise<{ text: string; value: number }[]> => {
    if (entries.length === 0) return [];
    try {
        const journalText = entries.map(e => e.content).join('\n');
        const prompt = `Analyze the following journal entries and identify the 15 most frequent and meaningful keywords or short phrases. Ignore common stop words. Provide the result as a JSON array of objects, where each object has "text" (the keyword) and "value" (its frequency). \n\nEntries:\n${journalText}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            value: { type: Type.NUMBER }
                        }
                    }
                }
            }
        });
        
        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        return data as { text: string; value: number }[];
    } catch (error) {
        console.error("Error generating word cloud data:", error);
        // Return some dummy data on error
        return [{ text: "growth", value: 3 }, { text: "challenge", value: 2 }, { text: "progress", value: 5 }];
    }
};

export const getGoalSuggestions = async (category: string): Promise<string[]> => {
    try {
        const prompt = `Suggest 3 specific, actionable goal ideas for the category "${category}". Format the response as a JSON array of strings.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    }
                }
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as string[];
    } catch (error) {
        console.error("Error getting goal suggestions:", error);
        return [`Read one book about ${category}`, `Practice a ${category}-related skill for 15 mins daily`];
    }
};

export const summarizeWeeklyProgress = async (entries: JournalEntry[]): Promise<string> => {
    if (entries.length === 0) return "No journal entries from the past week to summarize.";
    try {
        const journalText = entries.map(e => `[${new Date(e.date).toDateString()}]: ${e.content}`).join('\n');
        const prompt = `Read the following journal entries from the past week and provide a short, encouraging summary of the user's progress, mood, and challenges. Speak in a supportive and motivational tone. \n\nEntries:\n${journalText}`;
        return await callGemini(prompt);
    } catch (error) {
        console.error("Error summarizing progress:", error);
        return "There was an issue summarizing your progress, but keep up the great work!";
    }
};

export const getReflectionInsights = async (goals: Goal[]): Promise<string> => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const goalDataForPrompt = goals
      .filter(g => !g.completed)
      .map(goal => {
        const recentProgress = goal.progress.filter(dateStr => new Date(dateStr) > oneMonthAgo);
        return {
          title: goal.title,
          dates_completed: recentProgress,
          goal_start_date: goal.createdAt.split('T')[0]
        };
      });
      
    if (goalDataForPrompt.every(g => g.dates_completed.length === 0) && goalDataForPrompt.length > 0) {
        return "It looks like it's been a challenging week. What's one small step you can take today to get back on track?";
    }

    if (goalDataForPrompt.length === 0) {
        return "You have no active goals to reflect on. Add a new goal to get started!";
    }

    const prompt = `You are a supportive AI coach. Below is a user's goal progress for the last month. Each goal has a title and a list of dates it was completed.

    Data: ${JSON.stringify(goalDataForPrompt, null, 2)}

    Analyze this data to find patterns. Specifically, look for days of the week that are consistently missed for any given goal. 
    For example, if a user often misses their workout on Mondays.

    Based on your analysis, generate a short, encouraging, and reflective message. The message should:
    1. Gently point out ONE pattern you noticed (e.g., "I noticed Mondays seem to be a tricky day for your workouts...").
    2. Ask an open-ended reflection question (e.g., "...Is there something about the start of the week that makes it tough?").
    3. If no clear pattern is found, ask a more general reflection prompt like "What was one obstacle that got in your way this week, and what's one thing you could try differently next time?"

    Keep the entire response under 50 words. The tone should be helpful and not judgmental.`;

    try {
        return await callGemini(prompt);
    } catch (error) {
        console.error("Error getting reflection insights:", error);
        return "Couldn't analyze your progress right now, but take a moment to reflect on what went well this week and what you'd like to improve.";
    }
};
