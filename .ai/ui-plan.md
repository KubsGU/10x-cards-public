# Architektura UI dla 10xCards

## 1. Przegląd struktury UI
Architektura interfejsu użytkownika dla 10xCards została zaprojektowana z myślą o prostocie, responsywności oraz intuicyjnej nawigacji. System składa się z kilku kluczowych widoków, które pokrywają wszystkie etapy podróży użytkownika – od autentykacji, przez generowanie i zarządzanie fiszkami, aż po sesję powtórzeniową. Hierarchia widoków jest zgodna z wymaganiami API, a system nawigacji umożliwia łatwe przechodzenie między poszczególnymi ekranami. Ważnym elementem jest również stosowanie walidacji formularzy (200 znaków dla przodu, 500 znaków dla tyłu) oraz zapewnienie dostępności i bezpieczeństwa poprzez mechanizmy autoryzacji.

## 2. Lista widoków

- **Ekran autentykacji**
  - **Ścieżka widoku:** `/auth`
  - **Główny cel:** Umożliwienie użytkownikowi rejestracji, logowania oraz odzyskiwania hasła.
  - **Kluczowe informacje:** Formularze z polami na email, hasło, potwierdzenie hasła (dla rejestracji) oraz opcja odzyskania hasła.
  - **Kluczowe komponenty widoku:** Formularz autentykacji, przyciski akcji (rejestruj, zaloguj, odzyskaj hasło), linki nawigacyjne.
  - **UX, dostępność i względy bezpieczeństwa:** Minimalistyczny design, intuicyjne etykiety, walidacja pól, wsparcie dla czytników ekranu, stosowanie ARIA oraz zabezpieczenia przed atakami, np. brute force.

- **Dashboard**
  - **Ścieżka widoku:** `/dashboard`
  - **Główny cel:** Prezentacja nie wrażliwych informacji o koncie oraz nawigacja do pozostałych sekcji aplikacji.
  - **Kluczowe informacje:** Podstawowe dane konta, powitanie użytkownika, kafelki nawigacyjne do innych widoków.
  - **Kluczowe komponenty widoku:** Kafelki nawigacyjne, sekcja informacyjna, panel statusu.
  - **UX, dostępność i względy bezpieczeństwa:** Intuicyjna kompozycja, responsywny layout, przejrzystość i dostępność elementów interaktywnych.

- **Widok generowania fiszek**
  - **Ścieżka widoku:** `/flashcards/generate`
  - **Główny cel:** Umożliwienie generowania fiszek przy pomocy AI na podstawie wprowadzonego tekstu.
  - **Kluczowe informacje:** Formularz z polem tekstowym (1000-10000 znaków) oraz wyborem trybu generacji (mniej, domyślnie, więcej).
  - **Kluczowe komponenty widoku:** Formularz tekstowy, przyciski wyboru trybu generacji, przycisk wysyłania, sekcja z podglądem wygenerowanych fiszek.
  - **UX, dostępność i względy bezpieczeństwa:** Wyraźne instrukcje, dynamiczna walidacja długości tekstu, zabezpieczenia przed wysłaniem nieprawidłowych danych.

- **Widok listy fiszek**
  - **Ścieżka widoku:** `/flashcards`
  - **Główny cel:** Przeglądanie, edycja oraz usuwanie zapisanych fiszek.
  - **Kluczowe informacje:** Lista fiszek z podsumowaniem zawartości oraz informacjami o statusie (np. ocena fiszki).
  - **Kluczowe komponenty widoku:** Lista lub tabela fiszek, przyciski do edycji i usuwania, modal do edycji fiszek.
  - **UX, dostępność i względy bezpieczeństwa:** Intuicyjne przyciski, responsywny design, modal potwierdzający akcję usunięcia, jasne komunikaty walidacyjne.

- **Panel użytkownika**
  - **Ścieżka widoku:** `/profile`
  - **Główny cel:** Zarządzanie danymi konta użytkownika, zmiana hasła oraz usuwanie konta.
  - **Kluczowe informacje:** Informacje o koncie (email, data rejestracji), opcje zmiany hasła i deaktywacji konta.
  - **Kluczowe komponenty widoku:** Formularze zmiany hasła, przyciski akcji (aktualizacja, usunięcie konta).
  - **UX, dostępność i względy bezpieczeństwa:** Bezpieczne formularze z walidacją, potwierdzenia przed trwałymi akcjami, odpowiednie komunikaty błędów.

- **Widok sesji powtórzeniowej**
  - **Ścieżka widoku:** `/flashcards/practice`
  - **Główny cel:** Prezentacja fiszek do nauki według metody powtórek (spaced repetition).
  - **Kluczowe informacje:** Fiszki do nauki, przyciski oceny (like/dislike) oraz mechanizm przechodzenia do kolejnych fiszek.
  - **Kluczowe komponenty widoku:** Komponent karty fiszki, przyciski oceny, sekcja nawigacji między fiszkami.
  - **UX, dostępność i względy bezpieczeństwa:** Prosty, skoncentrowany interfejs, duże i intuicyjne przyciski, minimalizacja elementów rozpraszających uwagę.

## 3. Mapa podróży użytkownika
1. Użytkownik rozpoczyna podróż na ekranie autentykacji, gdzie dokonuje rejestracji lub logowania.
2. Po pomyślnym logowaniu użytkownik zostaje przekierowany do dashboardu, gdzie widzi przegląd kluczowych informacji oraz opcje nawigacji.
3. Z dashboardu użytkownik wybiera widok generowania fiszek i wprowadza tekst oraz tryb generacji, po czym wysyła dane, aby otrzymać wygenerowane fiszki.
4. Następnie użytkownik przechodzi do widoku listy fiszek, gdzie może przeglądać, edytować (przez modal) lub usuwać wybrane fiszki.
5. W panelu użytkownika użytkownik zarządza swoimi danymi, zmienia hasło lub decyduje o usunięciu konta.
6. W widoku sesji powtórzeniowej użytkownik uczy się korzystając z fiszek, oceniając je przy użyciu przycisków like/dislike.
7. Wszelkie napotkane błędy są logowane w konsoli (console.log) oraz komunikowane użytkownikowi w sposób przyjazny i zrozumiały.

## 4. Układ i struktura nawigacji
- Główna nawigacja jest dostępna poprzez belkę nawigacyjną (navbar), widoczną na wszystkich ekranach po autentykacji.
- Dashboard służy jako centralny punkt nawigacyjny, z kafelkami kierującymi do widoków: generowanie fiszek, lista fiszek, panel użytkownika oraz sesja powtórzeniowa.
- W widoku listy fiszek używany jest modal do edycji/usuwania, ułatwiający zarządzanie poszczególnymi fiszkami.
- Nawigacja jest responsywna, dzięki wykorzystaniu utility classes Tailwind, co zapewnia optymalne doświadczenie zarówno na desktopie, jak i urządzeniach mobilnych.
- Opcjonalnie, zastosowane mogą być breadcrumbs dla lepszej orientacji w hierarchii stron.

## 5. Kluczowe komponenty
- **Formularze autentykacji:** Stosowane w ekranach logowania, rejestracji oraz odzyskiwania hasła, z wbudowaną walidacją i obsługą błędów.
- **Kafelki dashboardu:** Umożliwiające szybki dostęp do pozostałych widoków oraz prezentację podstawowych informacji o użytkowniku.
- **Modal do edycji fiszek:** Służący do modyfikacji i usuwania fiszek bez konieczności opuszczania widoku listy.
- **Lista fiszek:** Komponent wyświetlający fiszki z opcjami sortowania i filtrowania, zgodnie z limitami API.
- **Karta fiszki w sesji nauki:** Umożliwiająca ocenę fiszek (like/dislike) i szybką nawigację między kolejnymi fiszkami.
- **Navbar:** Globalna belka nawigacyjna, zapewniająca dostęp do głównych widoków oraz adaptację do rozmiaru ekranu.
- **Kontekst React i React Hooks:** Zarządzają stanem aplikacji, synchronizują dane z backendem oraz wspierają mechanizmy autoryzacji użytkownika. 