import { cn } from "@/lib/utils";

interface CharacterCountIndicatorProps {
  count: number;
  min: number;
  max: number;
}

export function CharacterCountIndicator({ count, min, max }: CharacterCountIndicatorProps) {
  const isUnderMin = count < min;
  const isOverMax = count > max;
  const isValid = !isUnderMin && !isOverMax;

  return (
    <p
      className={cn(
        "text-sm",
        isValid && "text-muted-foreground",
        isUnderMin && "text-yellow-500 dark:text-yellow-400",
        isOverMax && "text-red-500 dark:text-red-400"
      )}
    >
      {count.toLocaleString()} znaków
      {isUnderMin && ` (minimum ${min.toLocaleString()})`}
      {isOverMax && ` (maksimum ${max.toLocaleString()})`}
      {isValid && ` (${min.toLocaleString()}-${max.toLocaleString()})`}
    </p>
  );
}
