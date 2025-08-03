// constants.ts

/**
 * Defines the environment mode for Gemini API calls.
 * - "VERCEL": Routes requests through the Vercel serverless function proxy.
 *             Use this for production deployment to keep the API key secure.
 * - "PREVIEW": Calls the Gemini API directly from the frontend.
 *              Use this for local development (e.g., with Gemini Build).
 */
export const GEMINI_MODE: "VERCEL" | "PREVIEW" = "PREVIEW";
