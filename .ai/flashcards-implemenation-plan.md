# API Endpoint Implementation Plan: Flashcards

Niniejszy dokument opisuje plan wdrożenia dla punktów końcowych API związanych z zarządzaniem fiszkami, z wyłączeniem generowania fiszek przez AI, które zostało opisane w osobnym dokumencie.

---

## 1. List Flashcards

### 1.1. Przegląd punktu końcowego
Endpoint służy do pobierania listy fiszek należących do uwierzytelnionego użytkownika z obsługą paginacji, sortowania i filtrowania.

### 1.2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** `/api/flashcards`
- **Parametry zapytania:**
  - `page` (number, opcjonalnie): numer strony do paginacji.
  - `limit` (number, opcjonalnie): liczba wyników na stronie.
  - `sort` (string, opcjonalnie): pole do sortowania (np. `created_at`).
  - `rating` (string, opcjonalnie): filtr oceny ("like" lub "dislike").

### 1.3. Wykorzystywane typy
- **DTO Response:** `FlashcardDTO[]`
- **Query Params DTO:** `ListFlashcardsQueryDTO` (walidacja Zod)

### 1.4. Szczegóły odpowiedzi
- **Sukces:**
  - Status: **200 OK**
  - Body: `[ { /* obiekt fiszki */ }, ... ]`
- **Kody błędów:**
  - **400 Bad Request:** Nieprawidłowe parametry zapytania.
  - **401 Unauthorized:** Brak autoryzacji.

### 1.5. Przepływ danych
1. Odbiór żądania na `/api/flashcards`.
2. Weryfikacja autentyczności żądania (Supabase Auth).
3. Walidacja parametrów zapytania (Zod).
4. Zapytanie do bazy danych o fiszki użytkownika z uwzględnieniem paginacji, sortowania i filtrowania.
5. Zwrócenie listy fiszek w formacie DTO.

### 1.6. Względy bezpieczeństwa
- Użytkownik musi być zalogowany.
- Polityka RLS w Supabase zapewnia, że użytkownik ma dostęp tylko do swoich fiszek.
- Walidacja parametrów zapytania w celu uniknięcia błędów i potencjalnych ataków.

### 1.7. Obsługa błędów
- **400 Bad Request:** Nieprawidłowe wartości `page`, `limit`, `sort`, `rating`.
- **401 Unauthorized:** Brak lub nieważny token.
- **500 Internal Server Error:** Błąd po stronie serwera/bazy danych.

### 1.8. Rozważenia dotyczące wydajności
- Obowiązkowa paginacja w celu uniknięcia przesyłania dużych ilości danych.
- Wykorzystanie indeksu na `user_id` w tabeli `flashcards`.

### 1.9. Etapy wdrożenia
1. Implementacja obsługi `GET` w `src/pages/api/flashcards/index.astro`.
2. Dodanie logiki weryfikacji autoryzacji.
3. Zastosowanie Zod do walidacji parametrów zapytania.
4. Utworzenie funkcji serwisowej w `src/lib/services` do pobierania danych z Supabase.
5. Zwrócenie odpowiedzi z kodem 200.

---

## 2. Get Flashcard by ID

### 2.1. Przegląd punktu końcowego
Endpoint służy do pobrania pojedynczej fiszki na podstawie jej ID.

### 2.2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** `/api/flashcards/[id]`
- **Parametry URL:**
  - `id` (number, wymagane): ID fiszki.

### 2.3. Wykorzystywane typy
- **DTO Response:** `FlashcardDTO`

### 2.4. Szczegóły odpowiedzi
- **Sukces:**
  - Status: **200 OK**
  - Body: `{ /* obiekt fiszki */ }`
- **Kody błędów:**
  - **401 Unauthorized:** Brak autoryzacji.
  - **404 Not Found:** Fiszka o podanym ID nie istnieje lub nie należy do użytkownika.

### 2.5. Przepływ danych
1. Odbiór żądania na `/api/flashcards/[id]`.
2. Weryfikacja autentyczności.
3. Walidacja, czy `id` jest poprawną liczbą.
4. Zapytanie do bazy o fiszkę z danym `id`. Polityka RLS zapewni, że zwrócony zostanie tylko zasób należący do użytkownika.
5. Jeśli fiszka nie zostanie znaleziona, zwrot błędu 404.
6. Zwrócenie fiszki w formacie DTO.

### 2.6. Względy bezpieczeństwa
- Użytkownik musi być zalogowany.
- Polityka RLS uniemożliwia dostęp do fiszek innych użytkowników.

### 2.7. Obsługa błędów
- **400 Bad Request:** ID nie jest liczbą.
- **401 Unauthorized:** Brak lub nieważny token.
- **404 Not Found:** Fiszka nie znaleziona.
- **500 Internal Server Error:** Błąd serwera/bazy danych.

### 2.8. Rozważenia dotyczące wydajności
- Zapytanie po kluczu głównym jest bardzo wydajne.

### 2.9. Etapy wdrożenia
1. Utworzenie pliku `src/pages/api/flashcards/[id].ts`.
2. Implementacja obsługi `GET`.
3. Dodanie walidacji ID i weryfikacji autoryzacji.
4. Utworzenie funkcji serwisowej do pobrania danych z Supabase.
5. Obsługa przypadku, gdy fiszka nie została znaleziona.

---

## 3. Create Flashcard (Manual Entry)

### 3.1. Przegląd punktu końcowego
Endpoint do ręcznego tworzenia nowej fiszki.

### 3.2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** `/api/flashcards`
- **Request Body:**
  ```json
  { 
    "front_text": "Text do 200 znaków", 
    "back_text": "Text do 500 znaków", 
    "source": "manual" 
  }
  ```

### 3.3. Wykorzystywane typy
- **Command Model:** `CreateFlashcardCommand` (walidacja Zod)
- **DTO Response:** `FlashcardDTO`

### 3.4. Szczegóły odpowiedzi
- **Sukces:**
  - Status: **201 Created**
  - Body: `{ /* nowo utworzony obiekt fiszki */ }`
- **Kody błędów:**
  - **400 Bad Request:** Błędy walidacji (długość tekstu, wymagane pola).
  - **401 Unauthorized:** Brak autoryzacji.

### 3.5. Przepływ danych
1. Odbiór żądania na `/api/flashcards`.
2. Weryfikacja autentyczności.
3. Walidacja body żądania przy użyciu Zod (`front_text`, `back_text`, `source`).
4. Zapis nowej fiszki w bazie danych z `user_id` pobranym z sesji.
5. Zwrócenie nowo utworzonej fiszki.

### 3.6. Względy bezpieczeństwa
- Użytkownik musi być zalogowany.
- Polityka RLS `WITH CHECK` w Supabase zapewni, że fiszka zostanie utworzona dla właściwego użytkownika.
- Rygorystyczna walidacja danych wejściowych.

### 3.7. Obsługa błędów
- **400 Bad Request:** Błędy walidacji Zod.
- **401 Unauthorized:** Brak lub nieważny token.
- **500 Internal Server Error:** Błąd zapisu do bazy danych.

### 3.8. Rozważenia dotyczące wydajności
- Operacja zapisu do bazy danych jest standardowa i wydajna.

### 3.9. Etapy wdrożenia
1. Implementacja obsługi `POST` w `src/pages/api/flashcards/index.astro`.
2. Dodanie weryfikacji autoryzacji.
3. Zdefiniowanie schemy Zod dla walidacji body.
4. Utworzenie funkcji serwisowej do zapisu w Supabase.
5. Zwrócenie odpowiedzi z kodem 201 i nowym obiektem.

---

## 4. Update Flashcard

### 4.1. Przegląd punktu końcowego
Endpoint do aktualizacji istniejącej fiszki.

### 4.2. Szczegóły żądania
- **Metoda HTTP:** PUT
- **Struktura URL:** `/api/flashcards/[id]`
- **Request Body:**
  ```json
  { 
    "front_text": "Zaktualizowany text", 
    "back_text": "Zaktualizowany text" 
  }
  ```

### 4.3. Wykorzystywane typy
- **Command Model:** `UpdateFlashcardCommand` (walidacja Zod)
- **DTO Response:** `FlashcardDTO`

### 4.4. Szczegóły odpowiedzi
- **Sukces:**
  - Status: **200 OK**
  - Body: `{ /* zaktualizowany obiekt fiszki */ }`
- **Kody błędów:**
  - **400 Bad Request:** Błędy walidacji.
  - **401 Unauthorized:** Brak autoryzacji.
  - **404 Not Found:** Fiszka nie znaleziona.

### 4.5. Przepływ danych
1. Odbiór żądania na `/api/flashcards/[id]`.
2. Weryfikacja autentyczności i walidacja ID.
3. Walidacja body żądania (Zod).
4. Aktualizacja fiszki w bazie danych. Polityka RLS zapewni, że użytkownik może modyfikować tylko swoje fiszki.
5. Sprawdzenie, czy operacja aktualizacji objęła jakikolwiek wiersz. Jeśli nie, zwrot 404.
6. Zwrócenie zaktualizowanej fiszki.

### 4.6. Względy bezpieczeństwa
- Użytkownik musi być zalogowany.
- Polityka RLS uniemożliwia modyfikację fiszek innych użytkowników.
- Rygorystyczna walidacja danych wejściowych.

### 4.7. Obsługa błędów
- **400 Bad Request:** Błędy walidacji Zod.
- **401 Unauthorized:** Brak lub nieważny token.
- **404 Not Found:** Fiszka nie znaleziona.
- **500 Internal Server Error:** Błąd zapisu do bazy danych.

### 4.8. Rozważenia dotyczące wydajności
- Aktualizacja po kluczu głównym jest wydajna.

### 4.9. Etapy wdrożenia
1. Implementacja obsługi `PUT` w `src/pages/api/flashcards/[id].ts`.
2. Dodanie weryfikacji autoryzacji i walidacji ID.
3. Zdefiniowanie schemy Zod dla walidacji body.
4. Utworzenie funkcji serwisowej do aktualizacji w Supabase.
5. Obsługa przypadku 404.
6. Zwrócenie odpowiedzi z kodem 200.

---

## 5. Delete Flashcard

### 5.1. Przegląd punktu końcowego
Endpoint do usuwania fiszki.

### 5.2. Szczegóły żądania
- **Metoda HTTP:** DELETE
- **Struktura URL:** `/api/flashcards/[id]`

### 5.3. Wykorzystywane typy
- **DTO Response:** `{ "message": "Flashcard deleted successfully." }`

### 5.4. Szczegóły odpowiedzi
- **Sukces:**
  - Status: **200 OK**
  - Body: `{ "message": "..." }`
- **Kody błędów:**
  - **401 Unauthorized:** Brak autoryzacji.
  - **404 Not Found:** Fiszka nie znaleziona.

### 5.5. Przepływ danych
1. Odbiór żądania na `/api/flashcards/[id]`.
2. Weryfikacja autentyczności i walidacja ID.
3. Usunięcie fiszki z bazy danych. Polityka RLS zapewni, że użytkownik może usuwać tylko swoje fiszki.
4. Sprawdzenie, czy operacja usunęła jakikolwiek wiersz. Jeśli nie, zwrot 404.
5. Zwrócenie komunikatu o sukcesie.

### 5.6. Względy bezpieczeństwa
- Użytkownik musi być zalogowany.
- Polityka RLS uniemożliwia usuwanie fiszek innych użytkowników.

### 5.7. Obsługa błędów
- **401 Unauthorized:** Brak lub nieważny token.
- **404 Not Found:** Fiszka nie znaleziona.
- **500 Internal Server Error:** Błąd operacji na bazie danych.

### 5.8. Rozważenia dotyczące wydajności
- Usuwanie po kluczu głównym jest wydajne.

### 5.9. Etapy wdrożenia
1. Implementacja obsługi `DELETE` w `src/pages/api/flashcards/[id].ts`.
2. Dodanie weryfikacji autoryzacji i walidacji ID.
3. Utworzenie funkcji serwisowej do usunięcia z Supabase.
4. Obsługa przypadku 404.
5. Zwrócenie odpowiedzi z kodem 200.

---

## 6. Rate Flashcard

### 6.1. Przegląd punktu końcowego
Endpoint do oceniania fiszki (like/dislike).

### 6.2. Szczegóły żądania
- **Metoda HTTP:** PATCH
- **Struktura URL:** `/api/flashcards/[id]/rate`
- **Request Body:**
  ```json
  { 
    "rating": "like"
  }
  ```

### 6.3. Wykorzystywane typy
- **Command Model:** `RateFlashcardCommand` (walidacja Zod)
- **DTO Response:** `FlashcardDTO`

### 6.4. Szczegóły odpowiedzi
- **Sukces:**
  - Status: **200 OK**
  - Body: `{ /* zaktualizowany obiekt fiszki */ }`
- **Kody błędów:**
  - **400 Bad Request:** Nieprawidłowa wartość `rating`.
  - **401 Unauthorized:** Brak autoryzacji.
  - **404 Not Found:** Fiszka nie znaleziona.

### 6.5. Przepływ danych
1. Odbiór żądania na `/api/flashcards/[id]/rate`.
2. Weryfikacja autentyczności i walidacja ID.
3. Walidacja body żądania (Zod), upewniając się, że `rating` to "like" lub "dislike".
4. Aktualizacja pola `rating` dla danej fiszki w bazie.
5. Sprawdzenie, czy operacja się powiodła. Jeśli nie, zwrot 404.
6. Zwrócenie zaktualizowanej fiszki.

### 6.6. Względy bezpieczeństwa
- Użytkownik musi być zalogowany.
- Polityka RLS uniemożliwia modyfikację fiszek innych użytkowników.
- Rygorystyczna walidacja wartości `rating`.

### 6.7. Obsługa błędów
- **400 Bad Request:** Błędy walidacji Zod.
- **401 Unauthorized:** Brak lub nieważny token.
- **404 Not Found:** Fiszka nie znaleziona.
- **500 Internal Server Error:** Błąd zapisu do bazy danych.

### 6.8. Rozważenia dotyczące wydajności
- Aktualizacja pojedynczego pola po kluczu głównym jest bardzo wydajna.

### 6.9. Etapy wdrożenia
1. Utworzenie pliku `src/pages/api/flashcards/[id]/rate.ts`.
2. Implementacja obsługi `PATCH`.
3. Dodanie weryfikacji autoryzacji i walidacji ID.
4. Zdefiniowanie schemy Zod dla walidacji body.
5. Utworzenie funkcji serwisowej do aktualizacji w Supabase.
6. Obsługa przypadku 404.
7. Zwrócenie odpowiedzi z kodem 200.

---

## 7. Flashcards Practice

### 7.1. Przegląd punktu końcowego
Endpoint do pobierania fiszek do sesji nauki, wykorzystujący logikę powtórek.

### 7.2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** `/api/flashcards/practice`
- **Parametry zapytania:** Opcjonalne filtry do priorytetyzacji (do zdefiniowania).

### 7.3. Wykorzystywane typy
- **DTO Response:** `FlashcardDTO[]`

### 7.4. Szczegóły odpowiedzi
- **Sukces:**
  - Status: **200 OK**
  - Body: `[ { /* obiekt fiszki */ }, ... ]`
- **Kody błędów:**
  - **401 Unauthorized:** Brak autoryzacji.

### 7.5. Przepływ danych
1. Odbiór żądania na `/api/flashcards/practice`.
2. Weryfikacja autentyczności.
3. Zastosowanie logiki algorytmu powtórek w celu wybrania odpowiednich fiszek dla użytkownika.
4. Pobranie wybranych fiszek z bazy danych.
5. Zwrócenie posortowanej listy fiszek.

### 7.6. Względy bezpieczeństwa
- Użytkownik musi być zalogowany.
- Polityka RLS zapewnia dostęp tylko do własnych fiszek.

### 7.7. Obsługa błędów
- **401 Unauthorized:** Brak lub nieważny token.
- **500 Internal Server Error:** Błąd serwera/bazy danych.

### 7.8. Rozważenia dotyczące wydajności
- Zapytanie do bazy danych może być złożone. Wymaga starannej konstrukcji i potencjalnie dodatkowych indeksów (np. na `rating`, `updated_at`).
- Logika algorytmu powtórek powinna być zoptymalizowana, aby nie spowalniać odpowiedzi.

### 7.9. Etapy wdrożenia
1. Utworzenie pliku `src/pages/api/flashcards/practice.ts`.
2. Implementacja obsługi `GET`.
3. Dodanie weryfikacji autoryzacji.
4. Utworzenie funkcji serwisowej, która implementuje logikę wyboru fiszek i pobiera je z Supabase.
5. Zwrócenie odpowiedzi z kodem 200. 