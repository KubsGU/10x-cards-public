import type { APIRoute } from "astro";
import { supabase } from "@/db/client";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = (await request.json()) as { email: string };

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(request.url).origin}/auth/reset-password`,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Link do resetowania hasła został wysłany na twój email",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas resetowania hasła" }), { status: 500 });
  }
};
