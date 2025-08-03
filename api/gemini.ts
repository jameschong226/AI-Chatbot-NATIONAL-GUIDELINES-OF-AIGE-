import { GoogleGenAI, Content } from "@google/genai";

// Set Vercel Edge runtime for streaming capabilities
export const config = {
  runtime: 'edge',
};

const API_KEY = process.env.API_KEY;
const modelName = 'gemini-2.0-flash';
const cachedContent = 'cachedContents/cexfv0crh3l5duqpsycdw49kyjsnjws1tam1m9rp';
const SYSTEM_INSTRUCTION = 'You are a helpful and friendly AIGC Expert. Your role is to provide clear, concise, and accurate information about AI-generated content (AIGC), large language models, diffusion models, and related technologies, based on the provided document. You are an expert in explaining complex topics in a simple way. When answering, rely primarily on the information in the cached document.';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API_KEY environment variable not set on server." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { contents } = (await req.json()) as { contents: Content[] };

    if (!contents) {
        return new Response(JSON.stringify({ error: "Missing 'contents' in request body." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const systemMessage: Content = {
      role: 'user',
      parts: [{ text: SYSTEM_INSTRUCTION }],
    };

    const finalContents = [systemMessage, ...contents];

    const geminiStream = await ai.models.generateContentStream({
      model: modelName,
      contents: finalContents,
      config: {
        cachedContent,
      },
    });

    // Create a ReadableStream to pipe the Gemini response to the client
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of geminiStream) {
          const chunkText = chunk.text;
          if (chunkText) {
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });

  } catch (error: any) {
    console.error('Error in Vercel function:', error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
