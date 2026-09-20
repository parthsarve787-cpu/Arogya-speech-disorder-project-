// Server-side AI Conversation & Speech Assistant powered by @google/genai
// Model: gemini-3.8-flash with fallback to gemini-3.1-flash-lite / gemini-flash-latest and local pediatric engine

import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

async function callWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('TIMEOUT')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

export async function generateMitriChatResponse(
  history: ChatMessage[],
  userSpeechText: string,
  childName: string = 'Aarav'
): Promise<string> {
  const client = getGenAI();

  // If Gemini API is available and configured, attempt generation with candidate models
  if (client) {
    const systemInstruction = `
You are "Mitri (मित्री)", a warm, playful, and encouraging speech companion for young children (ages 5–12) practicing speech articulation in Hindi and English.
Guidelines:
1. Always respond in friendly, simple, and encouraging language. If the child writes in English, reply in English with gentle Hindi phoneme practice prompts (or in Hindi script if practicing Hindi words).
2. Keep replies concise (2-3 short sentences), enthusiastic, and child-safe.
3. Praise the child by name (${childName}) for practicing.
4. Encourage them with fun words to pronounce (such as "कमल / Kamal" [lotus], "पानी / Paani" [water], "तितली / Titli" [butterfly], or "पतंग / Patang" [kite]).
5. Never provide medical diagnosis or label the child with disorders.
6. Use cheerful emojis (🌟, 🌸, 🎈, 🦋, 🪷) to motivate and delight.
`;

    const contents = history.slice(-6).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    contents.push({
      role: 'user',
      parts: [{ text: userSpeechText }],
    });

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await callWithTimeout(
          client.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
              maxOutputTokens: 250,
            },
          }),
          5000
        );

        const text = response.text?.trim();
        if (text) {
          return text;
        }
      } catch (err: any) {
        // Check for 503 (UNAVAILABLE), 429 (Resource Exhausted), or TIMEOUT to gracefully fallback to next candidate
        const statusCode = err?.status || err?.code || err?.error?.code;
        const msg = err?.message || String(err);
        const isTemporary = statusCode === 503 || statusCode === 429 || msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE') || msg.includes('TIMEOUT');

        if (isTemporary) {
          // Wait briefly before trying alternate model
          await new Promise((resolve) => setTimeout(resolve, 200));
          continue;
        }

        // If other non-retryable error, stop trying models
        break;
      }
    }
  }

  // Graceful, engaging local pedagogical fallback
  const lower = userSpeechText.toLowerCase();

  if (lower.includes('नमस्ते') || lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello ${childName}! 🌸 नमस्ते! I am Mitri, your speech practice buddy. Today, what magical sound shall we practice together? Can you say "कमल (Kamal)"?`;
  }
  if (lower.includes('कमल') || lower.includes('kamal') || lower.includes('lotus')) {
    return `Wonderful job, ${childName}! 🪷 "कमल" sounds so beautiful and clear! A lotus blooms on clean water. Now, can you try saying "किताब (Kitab)"?`;
  }
  if (lower.includes('पानी') || lower.includes('paani') || lower.includes('water')) {
    return `Super effort, ${childName}! 💧 "पानी" was said with gentle, clear lips! Remember to drink water to stay energized. Ready for the next word?`;
  }
  if (lower.includes('तितली') || lower.includes('titli') || lower.includes('butterfly')) {
    return `Bravo ${childName}! 🦋 Once upon a time, a tiny purple butterfly danced across the Sound Garden! Each time you speak clearly, the butterfly learns to fly higher in the sky! 🌟`;
  }
  if (lower.includes('पतंग') || lower.includes('kite')) {
    return `Great energy! 🪁 "पतंग" was spoken high and bright like a kite flying on a breezy afternoon! Keep going!`;
  }
  if (lower.includes('story') || lower.includes('कहानी')) {
    return `Here is a special mini-story for you, ${childName}! 📖 In a sunny garden, a friendly parrot named Mithu practiced saying "तितली" every morning. Today, all the garden flowers clapped for you too! 🌸`;
  }
  if (lower.includes('practiced') || lower.includes('done') || lower.includes('completed')) {
    return `Awesome dedication, ${childName}! ⭐ Your practice makes your voice stronger every single day. A fresh new blossom just grew in your Sound Garden! 🌿`;
  }
  if (lower.includes('how') || lower.includes('pronounce') || lower.includes('help')) {
    return `Here is a fun tip, ${childName}! 🎈 Place your hand gently in front of your lips. When saying "प / Paani", feel a gentle puff of warm air! Let's try it together!`;
  }

  const fallbackReplies = [
    `Terrific practice, ${childName}! 🌟 Every word you practice helps your speech garden bloom. Let's try saying "सूरज (Suraj)" next! ☀️`,
    `Great try, ${childName}! 🎈 Your voice is sounding more confident and clear with every repetition! Can we try "पपीता (Papita)" together?`,
    `A magical blossom just opened in your Sound Garden, ${childName}! 🌼 Keep up the wonderful practice!`,
    `High five, ${childName}! ⭐ You have awesome focus today. Let's practice saying "सेब (Seb)" like a shiny sweet apple! 🍎`,
  ];

  const randomIndex = Math.floor(Math.random() * fallbackReplies.length);
  return fallbackReplies[randomIndex];
}

