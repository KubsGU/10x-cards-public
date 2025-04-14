# Dokument wymagań produktu (PRD) - 10xCards

## 1. Przegląd produktu
10xCards to aplikacja webowa umożliwiająca szybkie tworzenie wysokiej jakości fiszek edukacyjnych. Aplikacja łączy generowanie fiszek przy użyciu sztucznej inteligencji na podstawie wprowadzonego tekstu z możliwością ręcznego tworzenia fiszek. Interfejs wzorowany jest na popularnych aplikacjach, aby zapewnić intuicyjny i minimalistyczny design, a funkcjonalności zostały zoptymalizowane pod kątem efektywnego procesu nauki metodą powtórek (spaced repetition).

## 2. Problem użytkownika
Użytkownicy chcą uczyć się za pomocą fiszek, jednak ręczne tworzenie wysokiej jakości fiszek jest czasochłonne. Brak efektywnego narzędzia do szybkiego generowania oraz oceny fiszek powoduje, że proces nauki może być mniej skuteczny i zniechęcający. 10xCards rozwiązuje ten problem poprzez automatyzację generowania fiszek przy użyciu AI oraz zapewnienie intuicyjnej ścieżki tworzenia, edycji i przeglądania fiszek.

## 3. Wymagania funkcjonalne
- Generowanie fiszek przez AI na podstawie wprowadzonego tekstu (od 1000 do 10000 znaków) z możliwością wyboru preferowanej liczby generowanych fiszek: mniej, domyślnie, więcej.
- Manualne tworzenie fiszek poprzez formularz umożliwiający wprowadzenie treści przodu (maksymalnie 200 znaków) i tyłu (maksymalnie 500 znaków).
- Przeglądanie, edycja i usuwanie zapisanych fiszek.
- System kont użytkowników umożliwiający rejestrację, logowanie, odzyskiwanie hasła, zmianę hasła oraz usunięcie konta.
- Ocena fiszek przez użytkownika za pomocą przycisków Like/Dislike, co wpływa na akceptację oraz dalszą edycję fiszek.
- Integracja fiszek z gotowym algorytmem powtórek, prezentującym fiszki w trybie nauki według ustalonych reguł.

## 4. Granice produktu
- Nie wchodzi w zakres zaawansowany algorytm powtórek (np. SuperMemo, Anki).
- Aplikacja nie obsługuje importu wielu formatów (PDF, DOCX itp.).
- Brak funkcjonalności umożliwiających współdzielenie fiszek między użytkownikami.
- Brak integracji z innymi platformami edukacyjnymi.
- Wersja mobilna nie jest obecnie rozwijana (tylko aplikacja web).
- Ograniczenie generowania fiszek do maksymalnie 100 na godzinę w celu ochrony zasobów.

## 5. Historyjki użytkowników

### US-001: Rejestracja konta
- Tytuł: Rejestracja nowego użytkownika
- Opis: Użytkownik rejestruje się, podając adres e-mail oraz hasło, aby uzyskać dostęp do aplikacji.
- Kryteria akceptacji: Formularz rejestracyjny waliduje dane, po poprawnej rejestracji użytkownik otrzymuje potwierdzenie oraz możliwość dalszego logowania.

### US-002: Logowanie do konta
- Tytuł: Logowanie użytkownika
- Opis: Użytkownik loguje się, używając swoich danych (e-mail i hasło), aby uzyskać dostęp do zapisanych fiszek i funkcjonalności aplikacji.
- Kryteria akceptacji: Formularz logowania akceptuje poprawne dane, przy błędnych danych wyświetla komunikat o błędzie, użytkownik po zalogowaniu widzi swój profil.

### US-003: Odzyskiwanie hasła
- Tytuł: Funkcjonalność odzyskiwania hasła
- Opis: Użytkownik, który zapomniał hasła, korzysta z mechanizmu odzyskiwania hasła poprzez podanie zarejestrowanego adresu e-mail.
- Kryteria akceptacji: Użytkownik otrzymuje wiadomość e-mail z instrukcjami do resetowania hasła oraz link umożliwiający ustawienie nowego hasła.

### US-004: Zmiana hasła
- Tytuł: Możliwość zmiany hasła
- Opis: Zalogowany użytkownik może zmienić swoje hasło w ustawieniach konta.
- Kryteria akceptacji: Formularz zmiany hasła sprawdza poprawność starego hasła, nowe hasło spełnia określone wymagania bezpieczeństwa oraz zmiana jest potwierdzona komunikatem sukcesu.

### US-005: Usuwanie konta
- Tytuł: Usuwanie konta użytkownika
- Opis: Użytkownik ma możliwość usunięcia swojego konta, co wiąże się z kasowaniem zapisanych danych.
- Kryteria akceptacji: Proces usunięcia konta wymaga potwierdzenia, a po jego wykonaniu użytkownik otrzymuje informację o zakończeniu operacji.

### US-101: Generowanie fiszek przez AI
- Tytuł: Automatyczne generowanie fiszek przy użyciu AI
- Opis: Użytkownik wprowadza tekst (1000-10000 znaków) i wybiera preferowaną liczbę generowanych fiszek (mniej, domyślnie, więcej). System dzieli wygenerowane fiszki na przód (maks. 200 znaków) i tył (maks. 500 znaków).
- Kryteria akceptacji: Fiszki są generowane zgodnie z limitem znaków, użytkownik ma możliwość wyboru opcji generacji, a minimum 75% fiszek uzyskuje pozytywną ocenę.

### US-102: Ocena wygenerowanych fiszek
- Tytuł: Ocena jakości fiszek
- Opis: Użytkownik ocenia fiszki generowane przez AI przy użyciu przycisków Like/Dislike, decydując o ich akceptacji lub odrzuceniu.
- Kryteria akceptacji: Oceny są rejestrowane, a fiszki z pozytywną oceną są oznaczane jako zaakceptowane; system raportuje, czy 75% wygenerowanych fiszek jest zaakceptowanych.

### US-103: Zapis wybranej fiszki
- Tytuł: Zapisywanie fiszek na koncie
- Opis: Użytkownik wybiera fiszki, które zostały zaakceptowane, i zapisuje je na swoim koncie w celu późniejszej edycji i przeglądu.
- Kryteria akceptacji: Zapisana fiszka pojawia się w profilu użytkownika, umożliwiając dalszą edycję i usunięcie.

### US-104: Edycja fiszki
- Tytuł: Edycja zawartości fiszki
- Opis: Użytkownik edytuje zapisane fiszki, modyfikując treść przodu (do 200 znaków) i tyłu (do 500 znaków).
- Kryteria akceptacji: Edycja zapisuje zmiany poprawnie i respektuje limity znaków; użytkownik otrzymuje komunikat o sukcesie po zapisaniu zmian.

### US-105: Manualne tworzenie fiszki
- Tytuł: Ręczne tworzenie fiszki
- Opis: Użytkownik ma możliwość samodzielnego stworzenia fiszki, wprowadzając treść przodu (do 200 znaków) i tyłu (do 500 znaków) w formularzu.
- Kryteria akceptacji: Formularz waliduje liczbę znaków, a fiszka jest zapisywana po poprawnym wypełnieniu pól; użytkownik otrzymuje potwierdzenie utworzenia.

### US-106: Przeglądanie i usuwanie fiszek
- Tytuł: Zarządzanie fiszkami
- Opis: Użytkownik przegląda listę zapisanych fiszek i ma możliwość ich edycji lub usunięcia.
- Kryteria akceptacji: Interfejs listy fiszek jest czytelny, funkcje edycji oraz usuwania działają zgodnie z oczekiwaniami; usunięta fiszka nie pojawia się ponownie.

### US-107: Podgląd fiszek do nauki
- Tytuł: Prezentacja fiszek zgodna z algorytmem powtórek
- Opis: Użytkownik w trybie nauki przegląda fiszki według reguł ustalonych przez algorytm powtórek, co umożliwia zoptymalizowaną naukę.
- Kryteria akceptacji: Fiszki są prezentowane według priorytetów ustalonych przez algorytm; system nie przekracza limitu 100 fiszek generowanych na godzinę.

## 6. Metryki sukcesu
- Minimum 75% fiszek generowanych przez AI musi być zaakceptowanych przez użytkowników.
- Użytkownicy powinni tworzyć przynajmniej 75% fiszek z wykorzystaniem funkcji generowania przez AI.
- System kontroluje generowanie fiszek, nie przekraczając 100 fiszek na godzinę.
- Monitorowane są również liczba zapisanych, edytowanych oraz usuniętych fiszek, co wpływa na efektywność nauki. 