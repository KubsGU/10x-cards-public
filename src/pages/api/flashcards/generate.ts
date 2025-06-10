// Import necessary modules
import { z } from "zod";
import { generateFlashcards } from "../../../lib/services/generateFlashcardsService.js";

// Disable prerendering for API endpoint
export const prerender = false;

// Define Zod schema for request validation
const generateFlashcardsSchema = z.object({
  text: z
    .string()
    .min(1000, "Text is too short. It must be at least 1000 characters.")
    .max(10000, "Text is too long. Maximum 10000 characters."),
  generation_mode: z.enum(["less", "default", "more"]),
});

// POST handler for /api/flashcards/generate
export async function POST({ request }: { request: Request }) {
  try {
    // Parse JSON body
    const body = await request.json();
    // Validate input against schema
    const data = generateFlashcardsSchema.parse(body);

    // Authentication check: verify the Authorization header exists
    // const authHeader = request.headers.get("Authorization");
    // if (!authHeader) {
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //     status: 401,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // }

    // Simulate an authenticated user with id as string
    const user = { id: "5813c119-cdf2-4f35-9a29-07773e217cc9" };

    // Call the flashcards generation service
    const result = await generateFlashcards(data, { id: user.id });

    // Return the generated flashcards and generation details with 201 Created status
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Generic error handling
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Internal Server Error", details: "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
