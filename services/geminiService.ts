import { GoogleGenAI, Content } from "@google/genai";
import { GEMINI_MODE } from '../constants';

const modelName = 'gemini-2.0-flash';
const cachedContent = 'cachedContents/cexfv0crh3l5duqpsycdw49kyjsnjws1tam1m9rp';
const SYSTEM_INSTRUCTION = 'You are a helpful and friendly AIGC Expert. Your role is to provide clear, concise, and accurate information about AI-generated content (AIGC), large language models, diffusion models, and related technologies, based on the provided document. You are an expert in explaining complex topics in a simple way. When answering, rely primarily on the information in the cached document.';

export async function getStreamingResponse(contents: Content[]) {
  if (GEMINI_MODE === 'VERCEL') {
    // In VERCEL mode, we call our own serverless function proxy
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok || !response.body) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.error || errorMessage;
      } catch (e) {
        // Response was not JSON or other parsing error
      }
      throw new Error(errorMessage);
    }

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    // Return an async iterable that mimics the structure of the Gemini SDK stream
    return {
      async *[Symbol.asyncIterator]() {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          // Wrap the raw text in the object format expected by the App
          yield { text: value };
        }
      },
    };
  } else {
    // In PREVIEW mode, we call the Gemini API directly from the client
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set for PREVIEW mode");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const systemMessage: Content = {
      role: 'user',
      parts: [{ text: SYSTEM_INSTRUCTION }],
    };
    const finalContents = [systemMessage, ...contents];

    return ai.models.generateContentStream({
      model: modelName,
      contents: finalContents,
      config: {
        cachedContent,
      },
    });
  }
}
