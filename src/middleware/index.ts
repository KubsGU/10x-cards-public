import { defineMiddleware } from "astro:middleware";
import { supabase } from "@/db/client";

const protectedRoutes = ["/dashboard", "/flashcards", "/profile"];
const authRoutes = ["/auth"];
const resetPasswordRoute = "/auth/reset-password";
const apiRoutes = ["/api"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = new URL(context.request.url);
  const isApiRoute = apiRoutes.some((route) => pathname.startsWith(route));

  // Set up locals
  context.locals.supabase = supabase;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  context.locals.session = {
    user: session?.user
      ? {
          id: session.user.id,
          email: session.user.email || "",
        }
      : null,
  };

  // Skip auth check for non-protected routes
  if (!isApiRoute && !protectedRoutes.some((route) => pathname.startsWith(route))) {
    return await next();
  }

  // Check authentication for protected and API routes
  if (!session) {
    if (isApiRoute) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return context.redirect("/auth");
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route)) && pathname !== resetPasswordRoute) {
    return context.redirect("/dashboard");
  }

  return await next();
});
