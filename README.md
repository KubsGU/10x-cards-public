# 10xCards

## Project Description

10xCards is a modern web application designed to streamline the creation of high-quality educational flashcards. Leveraging AI, users can effortlessly generate flashcards from their input text and also manually create, edit, and review flashcards. The application provides a seamless experience for learners using spaced repetition techniques to boost retention and understanding.

## Tech Stack

- **Frontend:**
  - Astro 5
  - React 19
  - TypeScript 5
  - Tailwind CSS 4
  - Shadcn/ui

- **Backend:**
  - Supabase for database (PostgreSQL) and authentication
  - Integration with Openrouter.ai for AI-generated flashcards

- **CI/CD & Hosting:**
  - GitHub Actions for continuous integration and delivery
  - DigitalOcean (via Docker) for deployment

## Getting Started Locally

### Prerequisites

- Node.js version specified in `.nvmrc` (22.14.0)
- A package manager like npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) (or the URL provided by your terminal).

## Available Scripts

- `npm run dev` – Starts the development server.
- `npm run build` – Builds the project for production.
- `npm run preview` – Serves the built project.
- `npm run lint` – Runs ESLint to analyze code quality.
- `npm run lint:fix` – Automatically fixes linting issues.
- `npm run format` – Formats the project files using Prettier.

## Project Scope

10xCards aims to:
- Automate the generation of flashcards using AI based on user input text,
- Enable manual creation and editing of flashcards,
- Provide tools for reviewing and rating flashcards (Like/Dislike system),
- Integrate a spaced repetition algorithm to optimize learning efficiency,
- Support user authentication and account management for a personalized experience.

## Project Status

This project is currently in its early stages (v0.0.1) and under active development. Future updates will include additional features and improvements based on user feedback and testing.

## License

This project is licensed under the MIT License.
