import type { FlashcardDTO } from "@/types";

// Extends DTO with UI state to track user interactions
export interface FlashcardViewModel extends FlashcardDTO {
  uiState: "idle" | "loading" | "rated";
}

// Helper function to map DTO to ViewModel
export function mapToViewModel(dto: FlashcardDTO): FlashcardViewModel {
  return {
    ...dto,
    uiState: "idle",
  };
}
