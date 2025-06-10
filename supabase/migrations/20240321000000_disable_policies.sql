-- Migration: Disable RLS Policies
-- Description: Drops all RLS policies for generations and flashcards tables
-- Author: AI Assistant
-- Date: 2024-03-21

alter table generations disable row level security;
alter table flashcards disable row level security;

-- Drop policies for generations table
drop policy if exists "Users can view their own generations" on generations;
drop policy if exists "Users can create their own generations" on generations;
drop policy if exists "Users can update their own generations" on generations;
drop policy if exists "Users can delete their own generations" on generations;

-- Drop policies for flashcards table
drop policy if exists "Users can view their own flashcards" on flashcards;
drop policy if exists "Users can create their own flashcards" on flashcards;
drop policy if exists "Users can update their own flashcards" on flashcards;
drop policy if exists "Users can delete their own flashcards" on flashcards; 