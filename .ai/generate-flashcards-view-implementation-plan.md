# Plan implementacji widoku generowania fiszek

## 1. Przegląd
Celem tego widoku jest umożliwienie użytkownikom generowania fiszek edukacyjnych przy użyciu AI. Użytkownik wprowadza tekst źródłowy, wybiera tryb generacji, a system zwraca listę sugerowanych fiszek. Użytkownik może następnie ocenić każdą fiszkę (Like/Dislike), co jest równoznaczne z jej zapisaniem lub odrzuceniem. Widok ten jest kluczowym elementem propozycji wartości aplikacji, automatyzując proces tworzenia materiałów do nauki.

## 2. Routing widoku
Widok będzie dostępny pod następującą ścieżką:
- `/flashcards/generate`

Plik strony zostanie umieszczony w `src/pages/flashcards/generate.astro`.

## 3. Struktura komponentów
Hierarchia komponentów zostanie zaimplementowana z wykorzystaniem React (`.tsx`) dla części interaktywnych, osadzonych w stronie Astro. Komponenty UI będą bazować na bibliotece `shadcn/ui`.

```
- GenerateFlashcardsPage.astro
  - Layout
    - GenerateFlashcardsView.tsx (client:load)
      - GenerationForm.tsx
        - Textarea (z shadcn/ui)
        - CharacterCountIndicator.tsx
        - ToggleGroup (z shadcn/ui dla wyboru trybu)
        - Button (z shadcn/ui, "Generuj fiszki")
      - FlashcardsPreview.tsx
        - LoadingSpinner.tsx
        - ErrorMessage.tsx
        - FlashcardList.tsx
          - FlashcardItem.tsx
            - Card (z shadcn/ui)
            - Button (Like)
            - Button (Dislike)
```

## 4. Szczegóły komponentów

### `GenerateFlashcardsView.tsx`
- **Opis komponentu**: Główny komponent-kontener React, który zarządza całym stanem widoku, w tym danymi formularza, stanem ładowania, błędami oraz listą wygenerowanych fiszek.
- **Główne elementy**: `GenerationForm`, `FlashcardsPreview`.
- **Obsługiwane interakcje**: Przechwytuje zdarzenie `onSubmit` z `GenerationForm` w celu zainicjowania procesu generowania fiszek.
- **Typy**: `GenerateFlashcardsCommand`, `GenerateFlashcardsResponseDTO`, `FlashcardViewModel`.
- **Propsy**: Brak (komponent jest korzeniem widoku React).

### `GenerationForm.tsx`
- **Opis komponentu**: Formularz umożliwiający użytkownikowi wprowadzenie tekstu i wybór trybu generacji.
- **Główne elementy**: `Textarea`, `ToggleGroup` (dla `generation_mode`), `Button`, `CharacterCountIndicator`.
- **Obsługiwane interakcje**: `onSubmit` formularza, `onChange` dla pola tekstowego i przełącznika trybu.
- **Obsługiwana walidacja**: Walidacja długości wprowadzonego tekstu w czasie rzeczywistym.
- **Typy**: `GenerateFlashcardsCommand`.
- **Propsy**:
  - `isLoading: boolean`: Blokuje formularz na czas generowania.
  - `formData: GenerateFlashcardsCommand`: Stan kontrolowany z zewnątrz.
  - `setFormData: (data: GenerateFlashcardsCommand) => void`: Funkcja do aktualizacji stanu nadrzędnego.
  - `onSubmit: (e: React.FormEvent) => void`: Funkcja zwrotna wywoływana przy wysyłaniu formularza.

### `CharacterCountIndicator.tsx`
- **Opis komponentu**: Wyświetla liczbę znaków w polu tekstowym i wizualnie sygnalizuje, czy mieści się ona w wymaganym zakresie.
- **Główne elementy**: `p` lub `span`.
- **Obsługiwane interakcje**: Brak.
- **Obsługiwana walidacja**: Brak (tylko wyświetlanie).
- **Typy**: Brak.
- **Propsy**:
  - `count: number`: Aktualna liczba znaków.
  - `min: number`: Minimalna wymagana liczba znaków.
  - `max: number`: Maksymalna dozwolona liczba znaków.

### `FlashcardsPreview.tsx`
- **Opis komponentu**: Sekcja wyświetlająca wynik procesu generowania: stan ładowania, komunikat o błędzie lub listę fiszek.
- **Główne elementy**: `LoadingSpinner`, `ErrorMessage`, `FlashcardList`.
- **Obsługiwane interakcje**: Przekazuje zdarzenie oceny fiszki w górę hierarchii.
- **Obsługiwana walidacja**: Brak.
- **Typy**: `FlashcardViewModel`.
- **Propsy**:
  - `isLoading: boolean`: Wskazuje, czy trwa generowanie.
  - `error: string | null`: Przechowuje komunikat o błędzie.
  - `flashcards: FlashcardViewModel[]`: Lista fiszek do wyświetlenia.
  - `onRate: (id: FlashcardViewModel['id'], rating: 'like' | 'dislike') => void`: Funkcja do obsługi oceny.

### `FlashcardItem.tsx`
- **Opis komponentu**: Wyświetla pojedynczą fiszkę z treścią awersu i rewersu oraz przyciskami do oceny.
- **Główne elementy**: `Card`, `CardContent`, `CardFooter`, `Button` (z `shadcn/ui`).
- **Obsługiwane interakcje**: `onClick` na przyciskach "Like" i "Dislike".
- **Obsługiwana walidacja**: Brak.
- **Typy**: `FlashcardViewModel`.
- **Propsy**:
  - `flashcard: FlashcardViewModel`: Obiekt fiszki do wyświetlenia.
  - `onRate: (id: FlashcardViewModel['id'], rating: 'like' | 'dislike') => void`: Funkcja zwrotna wywoływana po kliknięciu przycisku oceny.

## 5. Typy
Do implementacji widoku, oprócz typów DTO z `src/types.ts`, potrzebny będzie niestandardowy typ `ViewModel` do zarządzania stanem UI dla każdej fiszki.

```typescript
import type { FlashcardDTO } from "@/types";

// Rozszerza DTO o stan UI, aby śledzić interakcje użytkownika
export interface FlashcardViewModel extends FlashcardDTO {
  uiState: 'idle' | 'loading' | 'rated';
}
```
- **`FlashcardViewModel`**:
  - **`id`, `front_text`, `back_text`, etc.**: Pola dziedziczone z `FlashcardDTO`.
  - **`uiState`**: Pole do śledzenia stanu interakcji z daną fiszką.
    - `idle`: Fiszka jest gotowa do oceny.
    - `loading`: Trwa wysyłanie oceny dla tej fiszki do API.
    - `rated`: Fiszka została oceniona, przyciski powinny być zablokowane.

## 6. Zarządzanie stanem
Zarządzanie stanem zostanie scentralizowane w niestandardowym hooku `useFlashcardGeneration`, który będzie używany w komponencie `GenerateFlashcardsView.tsx`. Takie podejście enkapsuluje całą logikę biznesową, zapytania API i zarządzanie stanem w jednym miejscu.

**Hook `useFlashcardGeneration` będzie zarządzał:**
- `formData`: Stan formularza (`GenerateFlashcardsCommand`).
- `generatedData`: Stan przechowujący odpowiedź z API (`GenerateFlashcardsResponseDTO`). Fiszki będą mapowane na `FlashcardViewModel[]`.
- `isLoading`: Globalny stan ładowania dla procesu generowania.
- `error`: Stan przechowujący komunikaty o błędach.

Hook udostępni funkcje do obsługi zmian w formularzu, wysyłania go oraz do oceniania poszczególnych fiszek.

## 7. Integracja API
Integracja z API będzie realizowana przez hook `useFlashcardGeneration`.

1.  **Generowanie fiszek**:
    - **Endpoint**: `POST /api/flashcards/generate`
    - **Akcja**: Wywoływana po zatwierdzeniu formularza.
    - **Typ żądania**: `GenerateFlashcardsCommand`
    - **Typ odpowiedzi**: `GenerateFlashcardsResponseDTO`
    - **Obsługa**: Odpowiedź zostanie zapisana w stanie, a `flashcards` zostaną zmapowane na `FlashcardViewModel`.

2.  **Ocenianie fiszki**:
    - **Endpoint**: `PATCH /api/flashcards/{id}/rate`
    - **Akcja**: Wywoływana po kliknięciu przycisku "Like" lub "Dislike" na komponencie `FlashcardItem`.
    - **Typ żądania**: `RateFlashcardCommand` (`{ rating: 'like' | 'dislike' }`)
    - **Typ odpowiedzi**: `FlashcardDTO`
    - **Obsługa**: Stan konkretnej fiszki w tablicy `FlashcardViewModel[]` zostanie zaktualizowany o nową ocenę i zmianę `uiState` na `rated`.

## 8. Interakcje użytkownika
- **Wpisywanie tekstu**: Licznik znaków (`CharacterCountIndicator`) aktualizuje się na bieżąco.
- **Wybór trybu generacji**: Stan formularza (`formData`) jest aktualizowany.
- **Kliknięcie "Generuj fiszki"**:
  - Formularz zostaje zablokowany.
  - W sekcji podglądu pojawia się wskaźnik ładowania.
  - Po pomyślnej odpowiedzi, wskaźnik ładowania jest zastępowany listą fiszek.
  - W przypadku błędu, pojawia się komunikat o błędzie.
- **Kliknięcie "Like" / "Dislike"**:
  - Przyciski na danej fiszce są blokowane, a jej `uiState` zmienia się na `loading`.
  - Po pomyślnej odpowiedzi, `uiState` zmienia się na `rated`, a przyciski zostają trwale zablokowane lub zastąpione wskaźnikiem oceny.
  - W przypadku błędu, `uiState` wraca do `idle`, a użytkownik otrzymuje powiadomienie (np. toast).

## 9. Warunki i walidacja
- **Warunek**: Długość tekstu w polu `textarea` musi mieścić się w zakresie 1000-10000 znaków.
- **Komponent**: Walidacja odbywa się w `GenerationForm.tsx`.
- **Wpływ na interfejs**:
  - Przycisk "Generuj fiszki" jest nieaktywny (`disabled`), jeśli warunek nie jest spełniony.
  - Komponent `CharacterCountIndicator` zmienia kolor (np. na czerwony), aby poinformować użytkownika o nieprawidłowej liczbie znaków.

## 10. Obsługa błędów
- **Błędy walidacji (400 Bad Request)**: Komunikat o błędzie z API zostanie wyświetlony w komponencie `ErrorMessage` pod formularzem.
- **Błędy serwera (500 Internal Server Error)**: Wyświetlony zostanie ogólny komunikat o błędzie, zachęcający do spróbowania ponownie później. Szczegóły błędu zostaną zalogowane w konsoli deweloperskiej.
- **Błędy sieciowe**: Aplikacja obsłuży błędy połączenia (np. przez `try...catch` wokół `fetch`) i wyświetli stosowny komunikat.
- **Błędy przy ocenianiu fiszki**: Błąd zostanie obsłużony za pomocą powiadomienia typu "toast" (np. z biblioteki `sonner`), aby nie przerywać pracy z całym widokiem. Stan UI błędnej fiszki zostanie przywrócony do `idle`.

## 11. Kroki implementacji
1.  Utworzenie pliku strony `src/pages/flashcards/generate.astro` i osadzenie w nim komponentu-kontenera `GenerateFlashcardsView.tsx` z dyrektywą `client:load`.
2.  Stworzenie struktury plików dla komponentów React w `src/components/views/generate-flashcards/`.
3.  Zdefiniowanie typu `FlashcardViewModel` w dedykowanym pliku (np. `src/view-models/flashcard.ts`).
4.  Implementacja szkieletu komponentu `GenerateFlashcardsView.tsx`.
5.  Implementacja niestandardowego hooka `useFlashcardGeneration` z logiką zarządzania stanem (bez zapytań API na początku).
6.  Implementacja komponentu `GenerationForm.tsx` wraz z `CharacterCountIndicator` i podłączenie go do hooka.
7.  Implementacja komponentu `FlashcardsPreview.tsx` i jego komponentów podrzędnych (`FlashcardList`, `FlashcardItem`) na podstawie statycznych danych.
8.  Integracja zapytania `POST /api/flashcards/generate` w hooku `useFlashcardGeneration` i obsługa stanów ładowania oraz błędów.
9.  Integracja zapytania `PATCH /api/flashcards/{id}/rate` w hooku, w tym aktualizacja `uiState` dla poszczególnych fiszek.
10. Dopracowanie stylów za pomocą Tailwind CSS i komponentów `shadcn/ui`.
11. Implementacja szczegółowej obsługi błędów, w tym powiadomień toast dla operacji oceniania.
12. Finalne testy manualne wszystkich ścieżek użytkownika i przypadków brzegowych. 