import type { APIRoute } from "astro";
import { supabaseClient } from "../../../db/supabase.client";
import * as flashcardsService from "../../../lib/services/flashcardsService";

export const GET: APIRoute = async () => {
  try {
    const supabase = supabaseClient;
    const session = await supabase.auth.getSession();
    if (!session.data.session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const flashcards = await flashcardsService.getPracticeFlashcards(supabase, session.data.session.user.id);

    return new Response(JSON.stringify(flashcards), { status: 200 });
  } catch (error) {
    console.error("Error getting practice flashcards:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
