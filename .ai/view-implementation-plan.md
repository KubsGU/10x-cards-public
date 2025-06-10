# API Endpoint Implementation Plan: Generate Flashcards via AI

## 1. Przegląd punktu końcowego
Endpoint służy do generowania fiszek przy użyciu zewnętrznej usługi AI. System waliduje dane wejściowe, wysyła żądanie do usługi AI oraz zapisuje szczegóły generacji, łącznie z wygenerowanymi fiszkami, w bazie danych.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** `/api/flashcards/generate`
- **Parametry:**
  - **Wymagane:**
    - `text`: ciąg znaków o długości od 1000 do 10000 znaków
    - `generation_mode`: jeden z dozwolonych typów: "less", "default", "more"
  - **Opcjonalne:** Brak
- **Request Body:**
  ```json
  {
    "text": "Input text between 1000 and 10000 characters",
    "generation_mode": "less"
  }
  ```

## 3. Wykorzystywane typy
- **Command Model:** `GenerateFlashcardsCommand`
- **DTO Response:** `GenerateFlashcardsResponseDTO`, w tym:
  - `GenerationDTO` (zawiera m.in. `id`, `model`, `generation_count`, `created_at`, `source_text_hash`, `source_text_length`)
  - `FlashcardDTO` (zawiera szczegóły fiszki, m.in. `id`, `user_id`, `front_text`, `back_text`, `rating`, `source`, `generation_id`, `created_at`, `updated_at`)

## 4. Szczegóły odpowiedzi
- **Sukces:**
  - Status: **201 Created**
  - Body:
    ```json
    {
      "generation": { "id": 1, "model": "model_name", "generation_count": 5, ... },
      "flashcards": [ { /* flashcard object */ }, ... ]
    }
    ```
- **Kody błędów:**
  - **400 Bad Request:** Błędne dane wejściowe (np. nieprawidłowa długość tekstu, niepoprawny `generation_mode`, przekroczenie limitu generacji)
  - **401 Unauthorized:** Brak autoryzacji
  - **500 Internal Server Error:** Błąd serwera lub problem z usługą AI/bazą danych

## 5. Przepływ danych
1. Odbiór żądania na endpointzie `/api/flashcards/generate`.
2. Weryfikacja autentyczności żądania przy użyciu (Supabase Auth).
3. Walidacja danych wejściowych:
   - Użycie Zod do sprawdzenia, czy `text` mieści się w zakresie 1000-10000 znaków.
   - Sprawdzenie, czy `generation_mode` odpowiada jednej z dozwolonych wartości.
4. Sprawdzenie limitu rate limiting – maksymalnie 100 flashcards na godzinę na użytkownika.
5. Wywołanie serwisu odpowiedzialnego za:
   - Komunikację z zewnętrzną usługą AI w celu wygenerowania fiszek.
   - Przetwarzanie odpowiedzi AI, w tym wyodrębnienie informacji o generacji i fiszkach.
6. Zapisanie szczegółów generacji do tabeli `generations` oraz fiszek do tabeli `flashcards` w bazie danych (Supabase).
7. Zwrócenie odpowiedzi zawierającej szczegóły generacji i listę fiszek.

## 6. Względy bezpieczeństwa
- **Autoryzacja:** Użytkownik musi być zalogowany, obsłużone przez Supabase Auth.
- **Walidacja danych:** Dane wejściowe są walidowane przy użyciu Zod, aby zapobiec wprowadzeniu nieprawidłowych danych.
- **Ochrona przed nadużyciem:** Implementacja rate limiting, ograniczającego generację do 100 fiszek na godzinę.
- **Bezpieczna komunikacja:** Wszystkie wywołania do zewnętrznej usługi AI powinny być realizowane przez bezpieczny protokół (HTTPS) z właściwą obsługą kluczy API.

## 7. Obsługa błędów
- **Błędy walidacji (400):** Nieprawidłowa długość tekstu, niepoprawny `generation_mode`, złe dane wejściowe.
- **Błąd autoryzacji (401):** Brak lub nieważny token.
- **Przekroczenie limitu (400):** Użytkownik przekroczył dozwolony limit generacji.
- **Błędy zewnętrzne (500):** Problemy z usługą AI lub zapisem do bazy danych.
- **Logowanie:** Wszystkie błędy powinny być logowane przy użyciu centralnego systemu logowania w celu przyszłej analizy.

## 8. Rozważenia dotyczące wydajności
- **Rate Limiting:** Monitorowanie liczby generowanych fiszek, aby zapobiec przeciążeniu systemu.
- **Optymalizacja bazy danych:** Użycie indeksów na krytycznych polach, aby usprawnić operacje zapisu i odczytu.
- **Asynchroniczność:** Wywołania do zewnętrznej usługi AI mogą być wykonywane asynchronicznie, aby nie blokować głównego wątku przetwarzania żądania.

## 9. Etapy wdrożenia
1. **Endpoint Implementation:** Utworzenie lub modyfikacja endpointu w `./src/pages/api/flashcards/generate`:
   - Dodanie obsługi metody POST.
   - Weryfikacja autoryzacji użytkownika (Supabase Auth) w zależności od zmiennej środowiskowej.
2. **Input Validation:** Implementacja walidacji danych wejściowych przy użyciu Zod dla `text`.
3. Dodanie mechanizmu uwierzytelniania użytkownika przy użyciu Supabase Auth.
4. **Rate Limiting:** Dodanie mechanizmu sprawdzającego, czy użytkownik nie przekroczył limitu generacji (100 fiszek/godz.).
5. **Service Layer:** Utworzenie lub aktualizacja serwisu w `./src/lib/services`, który:
   - Komunikuje się z zewnętrzną usługą AI do generowania fiszek, openRouter albo zwraca zamockowane dane, w zależności od zmiennej środowiskowej.
   - Przetwarza odpowiedź i zapisuje dane w bazie danych (tabele `generations` i `flashcards`).
   - 
6. **Error Handling:** Implementacja szczegółowej obsługi błędów oraz logowania.
7. **Dokumentacja:** Aktualizacja dokumentacji API oraz wewnętrznej dokumentacji technicznej projektu. 