import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { GenerateFlashcardsCommand } from "@/types";
import { CharacterCountIndicator } from "@/components/views/generate-flashcards/CharacterCountIndicator";

interface GenerationFormProps {
  isLoading: boolean;
  formData: GenerateFlashcardsCommand;
  setFormData: (data: GenerateFlashcardsCommand) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MIN_CHARS = 1000;
const MAX_CHARS = 10000;

export function GenerationForm({ isLoading, formData, setFormData, onSubmit }: GenerationFormProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, text: e.target.value });
  };

  const handleModeChange = (value: string) => {
    if (value && (value === "less" || value === "default" || value === "more")) {
      setFormData({ ...formData, generation_mode: value });
    }
  };

  const isValidLength = formData.text.length >= MIN_CHARS && formData.text.length <= MAX_CHARS;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="text"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tekst źródłowy
        </label>
        <Textarea
          id="text"
          value={formData.text}
          onChange={handleTextChange}
          placeholder="Wklej tutaj tekst, z którego chcesz wygenerować fiszki..."
          className="min-h-[200px] resize-y"
          disabled={isLoading}
        />
        <CharacterCountIndicator count={formData.text.length} min={MIN_CHARS} max={MAX_CHARS} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="generation_mode"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tryb generowania
        </label>
        <ToggleGroup
          type="single"
          value={formData.generation_mode}
          onValueChange={handleModeChange}
          className="justify-start"
          disabled={isLoading}
        >
          <ToggleGroupItem value="less" aria-label="Mniej fiszek">
            Mniej
          </ToggleGroupItem>
          <ToggleGroupItem value="default" aria-label="Standardowa ilość">
            Standard
          </ToggleGroupItem>
          <ToggleGroupItem value="more" aria-label="Więcej fiszek">
            Więcej
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Button type="submit" disabled={!isValidLength || isLoading} className="w-full sm:w-auto">
        {isLoading ? "Generowanie..." : "Generuj fiszki"}
      </Button>
    </form>
  );
}
