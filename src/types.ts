// DTO and Command Model Definitions for the API

import type { Database } from "./db/database.types";

/* ---------- Users ---------- */

// Command for registering a new user
export interface RegisterUserCommand {
  email: string;
  password: string;
}

// DTO response for registered user
export interface RegisterUserResponseDTO {
  id: number;
  email: string;
  created_at: string;
}

// Command for user login
export interface LoginUserCommand {
  email: string;
  password: string;
}

// DTO response for user login
export interface LoginUserResponseDTO {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

// Command for initiating password recovery
export interface ForgotPasswordCommand {
  email: string;
}

// DTO response for password recovery
export interface ForgotPasswordResponseDTO {
  message: string;
}

// Command for changing password
export interface ChangePasswordCommand {
  oldPassword: string;
  newPassword: string;
}

// DTO response for password change
export interface ChangePasswordResponseDTO {
  message: string;
}

// DTO response for account deletion
export interface DeleteAccountResponseDTO {
  message: string;
}

/* ---------- Flashcards ---------- */

type FlashcardRow = Database["public"]["Tables"]["flashcards"]["Row"];

// Representation of a flashcard based on the database row
export interface FlashcardDTO {
  id: FlashcardRow["id"];
  user_id: FlashcardRow["user_id"];
  front_text: FlashcardRow["front_text"];
  back_text: FlashcardRow["back_text"];
  // Constrain rating to acceptable API values
  rating: "like" | "dislike" | null;
  // Source from the database expected to be one of 'auto', 'hybrid', or 'manual'
  source: "auto" | "hybrid" | "manual";
  generation_id: FlashcardRow["generation_id"];
  created_at: FlashcardRow["created_at"];
  updated_at: FlashcardRow["updated_at"];
}

// Command for creating a new flashcard (manual entry)
export interface CreateFlashcardCommand {
  front_text: string; // Max 200 characters
  back_text: string; // Max 500 characters
  source: "manual"; // Must be 'manual' for manual entries
}

// DTO response after creating a flashcard
export type CreateFlashcardResponseDTO = FlashcardDTO;

// Command for updating an existing flashcard
export interface UpdateFlashcardCommand {
  front_text: string;
  back_text: string;
}

// DTO response after updating a flashcard
export type UpdateFlashcardResponseDTO = FlashcardDTO;

// Command for rating a flashcard
export interface RateFlashcardCommand {
  rating: "like" | "dislike";
}

// DTO response after rating a flashcard
export type RateFlashcardResponseDTO = FlashcardDTO;

// DTO response after deleting a flashcard
export interface DeleteFlashcardResponseDTO {
  message: string;
}

// DTO for listing flashcards (response is an array of flashcards)
export type ListFlashcardsResponseDTO = FlashcardDTO[];

// DTO for retrieving a single flashcard by ID
export type GetFlashcardResponseDTO = FlashcardDTO;

// DTO for flashcards practice endpoint (array of flashcards sorted per spaced repetition)
export type PracticeFlashcardsResponseDTO = FlashcardDTO[];

/* ---------- Generations ---------- */

type GenerationRow = Database["public"]["Tables"]["generations"]["Row"];

// Representation of an AI generation session based on the database row
export interface GenerationDTO {
  id: GenerationRow["id"];
  user_id: GenerationRow["user_id"];
  model: GenerationRow["model"];
  generation_count: GenerationRow["generation_count"];
  created_at: GenerationRow["created_at"];
  source_text_hash: GenerationRow["source_text_hash"];
  source_text_length: GenerationRow["source_text_length"];
}

// Command for generating flashcards via AI
export interface GenerateFlashcardsCommand {
  text: string; // Input text must be between 1000 and 10000 characters
  generation_mode: "less" | "default" | "more";
}

// DTO response after generating flashcards via AI
export interface GenerateFlashcardsResponseDTO {
  generation: GenerationDTO;
  flashcards: FlashcardDTO[];
}

// DTO for listing all AI generation sessions
export type ListGenerationsResponseDTO = GenerationDTO[];

// DTO for retrieving details of a specific AI generation session
export type GetGenerationDetailsResponseDTO = GenerationDTO;
