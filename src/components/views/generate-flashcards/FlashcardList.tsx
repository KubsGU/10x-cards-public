import type { FlashcardViewModel } from "@/view-models/flashcard";
import { FlashcardItem } from "@/components/views/generate-flashcards/FlashcardItem";

interface FlashcardListProps {
  flashcards: FlashcardViewModel[];
  onRate: (id: FlashcardViewModel["id"], rating: "like" | "dislike") => void;
}

export function FlashcardList({ flashcards, onRate }: FlashcardListProps) {
  return (
    <div className="space-y-4">
      {flashcards.map((flashcard) => (
        <div
          key={flashcard.id}
          className="transition-opacity duration-200 ease-in-out"
          style={{
            opacity: flashcard.uiState === "loading" ? 0.7 : 1,
          }}
        >
          <FlashcardItem flashcard={flashcard} onRate={onRate} />
        </div>
      ))}
    </div>
  );
}
