import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

/**
 * Send a message to ChatGPT with chat history
 * @param {string} userMessage - The new user message
 * @param {Array} chatHistory - Previous chat history [{role: 'user'|'assistant'|'system', content: string}]
 * @param {string} systemTraining - Optional system prompt
 * @returns {Promise<{ reply: string, updatedHistory: Array }>}
 */
export async function chatWithAgent(
    userMessage,
    chatHistory = [],
    systemTraining = "You are a helpful assistant."
) {
    // Add new user message to history
    const messages = [
        { role: "system", content: systemTraining },
        ...chatHistory,
        { role: "user", content: userMessage },
    ];

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
    });

    const reply = response.choices[0].message.content;

    const updatedHistory = [
        ...messages,
        { role: "assistant", content: reply },
    ];

    return { reply, updatedHistory };
}
