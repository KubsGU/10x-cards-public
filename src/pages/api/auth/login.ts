import type { APIRoute } from "astro";
import { supabase } from "@/db/client";
import type { LoginUserCommand } from "@/types";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = (await request.json()) as LoginUserCommand;

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ message: "Zalogowano pomyślnie" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas logowania" }), { status: 500 });
  }
};
