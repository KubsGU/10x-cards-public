import { useState } from "react";
import type { FlashcardDTO } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function FlashcardsList() {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<FlashcardDTO | null>(null);

  // Pobierz fiszki przy pierwszym renderowaniu
  useState(() => {
    fetchFlashcards();
  });

  async function fetchFlashcards() {
    try {
      const response = await fetch("/api/flashcards");
      if (!response.ok) throw new Error("Nie udało się pobrać fiszek");
      const data = await response.json();
      setFlashcards(data);
    } catch {
      toast.error("Nie udało się pobrać fiszek");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Nie udało się usunąć fiszki");
      setFlashcards((cards) => cards.filter((card) => card.id !== id));
      toast.success("Fiszka została usunięta");
    } catch {
      toast.error("Nie udało się usunąć fiszki");
    }
  }

  async function handleEdit(id: number, updates: Partial<FlashcardDTO>) {
    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Nie udało się zaktualizować fiszki");
      const updatedCard = await response.json();
      setFlashcards((cards) => cards.map((card) => (card.id === id ? updatedCard : card)));
      toast.success("Fiszka została zaktualizowana");
      setEditingCard(null);
    } catch {
      toast.error("Nie udało się zaktualizować fiszki");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          Nie masz jeszcze żadnych fiszek. Wygeneruj pierwsze fiszki lub dodaj je ręcznie!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {flashcards.map((flashcard) => (
        <Card key={flashcard.id} className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Przód</h3>
                <p className="text-lg">{flashcard.front_text}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Tył</h3>
                <p className="text-lg">{flashcard.back_text}</p>
              </div>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setEditingCard(flashcard)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edytuj fiszkę</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="front_text" className="text-sm font-medium">
                          Przód
                        </label>
                        <Textarea
                          defaultValue={flashcard.front_text}
                          onChange={(e) =>
                            setEditingCard((card) => (card ? { ...card, front_text: e.target.value } : null))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="back_text" className="text-sm font-medium">
                          Tył
                        </label>
                        <Textarea
                          defaultValue={flashcard.back_text}
                          onChange={(e) =>
                            setEditingCard((card) => (card ? { ...card, back_text: e.target.value } : null))
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditingCard(null)}>
                          Anuluj
                        </Button>
                        <Button
                          onClick={() =>
                            editingCard &&
                            handleEdit(editingCard.id, {
                              front_text: editingCard.front_text,
                              back_text: editingCard.back_text,
                            })
                          }
                        >
                          Zapisz
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(flashcard.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              {flashcard.rating === "like" && (
                <div className="flex items-center text-green-500">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Lubię</span>
                </div>
              )}
              {flashcard.rating === "dislike" && (
                <div className="flex items-center text-red-500">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">Nie lubię</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
