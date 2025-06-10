-- Migration: Initial Schema Creation
-- Description: Creates the core tables (flashcards, generations) with indexes and RLS policies
-- Author: AI Assistant
-- Date: 2024-03-20

-- Note: The users table is managed by Supabase Auth, so we don't create it here

-- Create generations table first (because flashcards references it)
create table generations (
    id serial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    model varchar(50) not null,
    generation_count integer not null,
    source_text_hash varchar(64) not null,
    source_text_length integer not null,
    created_at timestamptz not null default current_timestamp
);

-- Create flashcards table (with foreign key to generations)
create table flashcards (
    id serial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    front_text varchar(200) not null,
    back_text varchar(500) not null,
    rating varchar(7) null check (rating in ('like', 'dislike')),
    source varchar(10) not null check (source in ('auto', 'hybrid', 'manual')),
    generation_id integer references generations(id) on delete set null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);

-- Create indexes for better query performance
create index idx_flashcards_user_id on flashcards(user_id);
create index idx_generations_user_id on generations(user_id);
create index idx_flashcards_generation_id on flashcards(generation_id);

-- Create trigger for updating updated_at on flashcards
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

create trigger update_flashcards_updated_at
    before update on flashcards
    for each row
    execute function update_updated_at_column();

-- Enable Row Level Security
alter table generations enable row level security;
alter table flashcards enable row level security;

-- RLS Policies for generations

-- Policy for selecting generations (authenticated users)
create policy "Users can view their own generations"
    on generations
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy for inserting generations (authenticated users)
create policy "Users can create their own generations"
    on generations
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy for updating generations (authenticated users)
create policy "Users can update their own generations"
    on generations
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy for deleting generations (authenticated users)
create policy "Users can delete their own generations"
    on generations
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- RLS Policies for flashcards

-- Policy for selecting flashcards (authenticated users)
create policy "Users can view their own flashcards"
    on flashcards
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy for inserting flashcards (authenticated users)
create policy "Users can create their own flashcards"
    on flashcards
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy for updating flashcards (authenticated users)
create policy "Users can update their own flashcards"
    on flashcards
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy for deleting flashcards (authenticated users)
create policy "Users can delete their own flashcards"
    on flashcards
    for delete
    to authenticated
    using (auth.uid() = user_id); 