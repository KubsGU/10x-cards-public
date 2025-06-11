import type { APIRoute } from "astro";
import { z } from "zod";
import * as flashcardsService from "../../../lib/services/flashcardsService";

const listFlashcardsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.enum(["created_at", "updated_at"]).default("created_at"),
  rating: z.enum(["like", "dislike"]).optional(),
});

const createFlashcardSchema = z.object({
  front_text: z.string().max(200),
  back_text: z.string().max(500),
  source: z.literal("manual"),
});

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    const { page, limit, sort, rating } = listFlashcardsQuerySchema.parse(params);

    const { user } = locals.session;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const flashcards = await flashcardsService.listFlashcards(locals.supabase, user.id, page, limit, sort, rating);

    return new Response(JSON.stringify(flashcards), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), { status: 400 });
    }
    console.error("Error listing flashcards:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const command = createFlashcardSchema.parse(body);

    const { user } = locals.session;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const flashcard = await flashcardsService.createFlashcard(locals.supabase, command, user.id);

    return new Response(JSON.stringify(flashcard), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), { status: 400 });
    }
    console.error("Error creating flashcard:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
