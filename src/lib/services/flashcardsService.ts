import type { SupabaseClient } from "src/db/supabase.client.ts";
import type { Database } from "@/db/database.types";
import type { FlashcardDTO, CreateFlashcardCommand, UpdateFlashcardCommand, RateFlashcardCommand } from "../../types";

export async function listFlashcards(
  supabase: SupabaseClient<Database>,
  userId: string,
  page = 1,
  limit = 10,
  sort = "created_at",
  rating?: "like" | "dislike"
): Promise<FlashcardDTO[]> {
  let query = supabase
    .from("flashcards")
    .select("*")
    .eq("user_id", userId)
    .order(sort, { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (rating) {
    query = query.eq("rating", rating);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as FlashcardDTO[];
}

export async function getFlashcardById(
  supabase: SupabaseClient<Database>,
  id: number,
  userId: string
): Promise<FlashcardDTO | null> {
  const { data, error } = await supabase.from("flashcards").select("*").eq("id", id).eq("user_id", userId).single();

  if (error) throw error;
  return data as FlashcardDTO;
}

export async function createFlashcard(
  supabase: SupabaseClient<Database>,
  command: CreateFlashcardCommand,
  userId: string
): Promise<FlashcardDTO> {
  const { data, error } = await supabase
    .from("flashcards")
    .insert([{ ...command, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data as FlashcardDTO;
}

export async function updateFlashcard(
  supabase: SupabaseClient<Database>,
  id: number,
  command: UpdateFlashcardCommand,
  userId: string
): Promise<FlashcardDTO> {
  const { data, error } = await supabase
    .from("flashcards")
    .update(command)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as FlashcardDTO;
}

export async function deleteFlashcard(supabase: SupabaseClient<Database>, id: number, userId: string): Promise<void> {
  const { error } = await supabase.from("flashcards").delete().eq("id", id).eq("user_id", userId);

  if (error) throw error;
}

export async function rateFlashcard(
  supabase: SupabaseClient<Database>,
  id: number,
  command: RateFlashcardCommand,
  userId: string
): Promise<FlashcardDTO> {
  const { data, error } = await supabase
    .from("flashcards")
    .update({ rating: command.rating })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as FlashcardDTO;
}

export async function getPracticeFlashcards(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<FlashcardDTO[]> {
  // For now, return a simple implementation that prioritizes:
  // 1. Unrated cards
  // 2. Liked cards
  // 3. Most recently created cards
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("user_id", userId)
    .order("rating", { ascending: true, nullsFirst: true })
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data as FlashcardDTO[];
}
