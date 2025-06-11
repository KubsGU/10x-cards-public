import { useState } from "react";
import type { GenerateFlashcardsCommand } from "@/types";
import type { FlashcardViewModel } from "@/view-models/flashcard";
import { mapToViewModel } from "@/view-models/flashcard";
import { GenerationForm } from "@/components/views/generate-flashcards/GenerationForm";
import { FlashcardsPreview } from "@/components/views/generate-flashcards/FlashcardsPreview";
import { toast } from "sonner";

export function GenerateFlashcardsView() {
  const [formData, setFormData] = useState<GenerateFlashcardsCommand>({
    text: "",
    generation_mode: "default",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardViewModel[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Nie udało się wygenerować fiszek. Spróbuj ponownie później.");
      }

      const data = await response.json();
      setFlashcards(data.flashcards.map(mapToViewModel));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRate = async (id: FlashcardViewModel["id"], rating: "like" | "dislike") => {
    const flashcardIndex = flashcards.findIndex((f) => f.id === id);
    if (flashcardIndex === -1) return;

    const updatedFlashcards = [...flashcards];
    updatedFlashcards[flashcardIndex] = {
      ...updatedFlashcards[flashcardIndex],
      uiState: "loading",
    };
    setFlashcards(updatedFlashcards);

    try {
      const response = await fetch(`/api/flashcards/${id}/rate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się ocenić fiszki");
      }

      const ratedFlashcard = await response.json();
      updatedFlashcards[flashcardIndex] = {
        ...ratedFlashcard,
        uiState: "rated",
      };
      setFlashcards(updatedFlashcards);

      toast.success(rating === "like" ? "Fiszka została dodana do twojej kolekcji" : "Fiszka została odrzucona");
    } catch {
      const message = "Nie udało się ocenić fiszki. Spróbuj ponownie.";
      toast.error(message);
      // Przywróć stan idle dla fiszki
      updatedFlashcards[flashcardIndex] = {
        ...updatedFlashcards[flashcardIndex],
        uiState: "idle",
      };
      setFlashcards(updatedFlashcards);
    }
  };

  return (
    <div className="space-y-8">
      <GenerationForm isLoading={isLoading} formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
      <FlashcardsPreview isLoading={isLoading} error={error} flashcards={flashcards} onRate={handleRate} />
    </div>
  );
}
