import type { APIRoute } from "astro";
import { z } from "zod";
import { supabaseClient } from "../../../../db/supabase.client";
import * as flashcardsService from "../../../../lib/services/flashcardsService";

const rateFlashcardSchema = z.object({
  rating: z.enum(["like", "dislike"]),
});

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const id = parseInt(params.id || "", 10);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const body = await request.json();
    const command = rateFlashcardSchema.parse(body);

    const supabase = supabaseClient;
    const session = await supabase.auth.getSession();
    if (!session.data.session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const flashcard = await flashcardsService.rateFlashcard(supabase, id, command, session.data.session.user.id);

    return new Response(JSON.stringify(flashcard), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), { status: 400 });
    }
    console.error("Error rating flashcard:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
