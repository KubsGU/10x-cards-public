import type { FlashcardViewModel } from "@/view-models/flashcard";
import { FlashcardList } from "@/components/views/generate-flashcards/FlashcardList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface FlashcardsPreviewProps {
  isLoading: boolean;
  error: string | null;
  flashcards: FlashcardViewModel[];
  onRate: (id: FlashcardViewModel["id"], rating: "like" | "dislike") => void;
}

export function FlashcardsPreview({ isLoading, error, flashcards, onRate }: FlashcardsPreviewProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (flashcards.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Wygenerowane fiszki</h2>
      <p className="text-sm text-muted-foreground">
        Oceń każdą fiszkę klikając przycisk &quot;Lubię&quot; lub &quot;Nie lubię&quot;. Fiszki oznaczone jako
        &quot;Lubię&quot; zostaną dodane do twojej kolekcji.
      </p>
      <FlashcardList flashcards={flashcards} onRate={onRate} />
    </div>
  );
}
