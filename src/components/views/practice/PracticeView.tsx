import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FlashcardDTO } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PracticeView() {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  async function fetchFlashcards() {
    try {
      const response = await fetch("/api/flashcards/practice");
      if (!response.ok) throw new Error("Nie udało się pobrać fiszek");
      const data = await response.json();
      setFlashcards(data);
    } catch {
      toast.error("Nie udało się pobrać fiszek do nauki");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRate(id: number, rating: "like" | "dislike") {
    try {
      const response = await fetch(`/api/flashcards/${id}/rate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });
      if (!response.ok) throw new Error("Nie udało się ocenić fiszki");

      setDirection(rating === "like" ? "right" : "left");
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setDirection(null);
      }, 500);
    } catch {
      toast.error("Nie udało się ocenić fiszki");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Nie masz żadnych fiszek do nauki. Wróć później!</p>
      </Card>
    );
  }

  if (currentIndex >= flashcards.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Gratulacje! Przećwiczyłeś wszystkie fiszki na dziś.</p>
        <Button
          onClick={() => {
            setCurrentIndex(0);
            fetchFlashcards();
          }}
          className="mt-4"
        >
          Zacznij od nowa
        </Button>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-full max-w-lg aspect-[3/4] relative">
        <AnimatePresence>
          <motion.div
            key={currentCard.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: direction === "left" ? -200 : direction === "right" ? 200 : 0,
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Card className="w-full h-full p-6 flex flex-col">
              <div className="flex-1 flex flex-col justify-center items-center text-center gap-8">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Przód</h3>
                  <p className="text-2xl">{currentCard.front_text}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Tył</h3>
                  <p className="text-2xl">{currentCard.back_text}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="text-red-500"
          onClick={() => handleRate(currentCard.id, "dislike")}
        >
          <ThumbsDown className="h-5 w-5 mr-2" />
          Nie znam
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="text-green-500"
          onClick={() => handleRate(currentCard.id, "like")}
        >
          <ThumbsUp className="h-5 w-5 mr-2" />
          Znam
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        {currentIndex + 1} z {flashcards.length} fiszek
      </div>
    </div>
  );
}
