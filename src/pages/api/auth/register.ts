import type { APIRoute } from "astro";
import { supabase } from "@/db/client";
import type { RegisterUserCommand } from "@/types";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = (await request.json()) as RegisterUserCommand;

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ message: "Konto zostało utworzone pomyślnie" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas rejestracji" }), { status: 500 });
  }
};
