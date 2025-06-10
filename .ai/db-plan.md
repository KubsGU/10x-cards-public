# Schemat bazy danych PostgreSQL dla 10xCards

## 1. Tabele i kolumny

### Tabela `users`

This table is managed by Supabase Auth.

- `id` SERIAL PRIMARY KEY  
- `email` VARCHAR(255) NOT NULL UNIQUE  
- `password_hash` VARCHAR(255) NOT NULL  
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP  

### Tabela `flashcards`
- `id` SERIAL PRIMARY KEY  
- `user_id` INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE  
- `front_text` VARCHAR(200) NOT NULL  
- `back_text` VARCHAR(500) NOT NULL  
- `rating` VARCHAR(7) NULL CHECK (rating IN ('like', 'dislike'))  
- `source` VARCHAR(10) NOT NULL CHECK (source IN ('auto', 'hybrid', 'manual'))
- `generation_id` INTEGER REFERENCES generations(id) ON DELETE SET NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP  
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP  

*Trigger: Automatically set `updated_at` to current timestamp on update.*

### Tabela `generations`
- `id` SERIAL PRIMARY KEY
- `user_id` INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `model` VARCHAR(50) NOT NULL
- `generation_count` INTEGER NOT NULL
- `source_text_hash` VARCHAR(64) NOT NULL
- `source_text_length` INTEGER NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

-- RLS dla tabeli generations
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY generations_policy
  ON generations
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::integer)
  WITH CHECK (user_id = current_setting('app.current_user_id')::integer);

## 2. Relacje między tabelami
- Relacja jeden-do-wielu między tabelą `users` a tabelą `flashcards`:  
  • Jeden użytkownik (users) może mieć wiele fiszek (flashcards).  
  • Klucz obcy: `flashcards.user_id` odwołuje się do `users.id`.
- Relacja jeden-do-wielu między tabelą `users` a tabelą `generations`:  
  • Jeden użytkownik (users) może mieć wiele generacji (generations).  
  • Klucz obcy: `generations.user_id` odwołuje się do `users.id`.
- Opcjonalna relacja jeden do jeden między tabelą `generations` a tabelą `flashcards`:
  • Jedna fiszka może mieć jedną generację.
  • Klucz obcy: `flashcards.generation_id` odwołuje się do `generations.id`.

## 3. Indeksy
- Indeks na kolumnie `flashcards.user_id` w celu optymalizacji zapytań:
  ```sql
  CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
  ```
- Indeks na kolumnie `generations.user_id` w celu optymalizacji zapytań:
  ```sql
  CREATE INDEX idx_generations_user_id ON generations(user_id);
  ```
- Indeks na kolumnie `flashcards.generation_id` w celu optymalizacji zapytań:
  ```sql
  CREATE INDEX idx_flashcards_generation_id ON flashcards(generation_id);
  ```

## 4. Zasady PostgreSQL - Row Level Security (RLS)
- Dla tabeli `flashcards`:
  ```sql
  ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

  CREATE POLICY flashcards_policy
    ON flashcards
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::integer)
    WITH CHECK (user_id = current_setting('app.current_user_id')::integer);
  ```
- Opcjonalnie, dla tabeli `users`:
  ```sql
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;

  CREATE POLICY users_policy
    ON users
    FOR ALL
    USING (id = current_setting('app.current_user_id')::integer)
    WITH CHECK (id = current_setting('app.current_user_id')::integer);
  ```
