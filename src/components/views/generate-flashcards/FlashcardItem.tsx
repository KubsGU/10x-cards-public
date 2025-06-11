import type { FlashcardViewModel } from "@/view-models/flashcard";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Check, X } from "lucide-react";

interface FlashcardItemProps {
  flashcard: FlashcardViewModel;
  onRate: (id: FlashcardViewModel["id"], rating: "like" | "dislike") => void;
}

export function FlashcardItem({ flashcard, onRate }: FlashcardItemProps) {
  const isRated = flashcard.uiState === "rated";
  const isLoading = flashcard.uiState === "loading";
  const showRatingButtons = !isRated && !isLoading;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Przód</h3>
            <p className="text-lg">{flashcard.front_text}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Tył</h3>
            <p className="text-lg">{flashcard.back_text}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {showRatingButtons && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRate(flashcard.id, "dislike")}
              className="text-red-500 dark:text-red-400"
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Nie lubię
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRate(flashcard.id, "like")}
              className="text-green-500 dark:text-green-400"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Lubię
            </Button>
          </>
        )}
        {isRated && flashcard.rating === "like" && (
          <div className="flex items-center text-sm text-green-500 dark:text-green-400">
            <Check className="h-4 w-4 mr-1" />
            Dodano do kolekcji
          </div>
        )}
        {isRated && flashcard.rating === "dislike" && (
          <div className="flex items-center text-sm text-red-500 dark:text-red-400">
            <X className="h-4 w-4 mr-1" />
            Odrzucono
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
