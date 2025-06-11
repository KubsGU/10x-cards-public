import type { APIRoute } from "astro";
import { z } from "zod";
import { supabaseClient } from "../../../db/supabase.client";
import * as flashcardsService from "../../../lib/services/flashcardsService";

const updateFlashcardSchema = z.object({
  front_text: z.string().max(200),
  back_text: z.string().max(500),
});

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const id = parseInt(params.id || "", 10);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const supabase = supabaseClient;
    const session = await supabase.auth.getSession();
    if (!session.data.session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const flashcard = await flashcardsService.getFlashcardById(supabase, id, session.data.session.user.id);

    if (!flashcard) {
      return new Response(JSON.stringify({ error: "Flashcard not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(flashcard), { status: 200 });
  } catch (error) {
    console.error("Error getting flashcard:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const id = parseInt(params.id || "", 10);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const body = await request.json();
    const command = updateFlashcardSchema.parse(body);

    const supabase = supabaseClient;
    const session = await supabase.auth.getSession();
    if (!session.data.session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const flashcard = await flashcardsService.updateFlashcard(supabase, id, command, session.data.session.user.id);

    return new Response(JSON.stringify(flashcard), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), { status: 400 });
    }
    console.error("Error updating flashcard:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const id = parseInt(params.id || "", 10);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const supabase = supabaseClient;
    const session = await supabase.auth.getSession();
    if (!session.data.session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await flashcardsService.deleteFlashcard(supabase, id, session.data.session.user.id);

    return new Response(JSON.stringify({ message: "Flashcard deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
