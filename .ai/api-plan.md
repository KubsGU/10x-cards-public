# REST API Plan

## 1. Resources

- **Users**: Maps to the `users` table. Holds user credentials and metadata.
- **Flashcards**: Maps to the `flashcards` table. Contains flashcard content (front and back text), rating (like/dislike), source (auto, hybrid, manual), and timestamps.
- **Generations**: Maps to the `generations` table. Stores metadata for AI-generated flashcards including model information and the generation count.

## 2. Endpoints

### Users

- **Register User**
  - **Method:** POST
  - **URL:** `/api/users/register`
  - **Description:** Register a new user by providing email and password.
  - **Request Payload:**
    ```json
    { "email": "user@example.com", "password": "password123" }
    ```
  - **Response:**
    ```json
    { "id": 1, "email": "user@example.com", "created_at": "timestamp" }
    ```
  - **Success Codes:** 201 Created
  - **Errors:** 400 Bad Request (e.g., missing fields, duplicate email)

- **Login User**
  - **Method:** POST
  - **URL:** `/api/users/login`
  - **Description:** Authenticate a user and provide a JWT token.
  - **Request Payload:**
    ```json
    { "email": "user@example.com", "password": "password123" }
    ```
  - **Response:**
    ```json
    { "token": "JWT_TOKEN", "user": { "id": 1, "email": "user@example.com" } }
    ```
  - **Success Codes:** 200 OK
  - **Errors:** 401 Unauthorized (for invalid credentials)

- **Password Recovery**
  - **Method:** POST
  - **URL:** `/api/users/forgot-password`
  - **Description:** Initiate password recovery by sending a recovery email.
  - **Request Payload:**
    ```json
    { "email": "user@example.com" }
    ```
  - **Response:**
    ```json
    { "message": "Recovery email sent." }
    ```
  - **Success Codes:** 200 OK
  - **Errors:** 400 Bad Request

- **Change Password**
  - **Method:** PUT
  - **URL:** `/api/users/change-password`
  - **Description:** Change the password for an authenticated user.
  - **Request Payload:**
    ```json
    { "oldPassword": "old_pass", "newPassword": "new_pass" }
    ```
  - **Response:**
    ```json
    { "message": "Password changed successfully." }
    ```
  - **Success Codes:** 200 OK
  - **Errors:** 400/401 for invalid inputs or unauthorized changes

- **Delete Account**
  - **Method:** DELETE
  - **URL:** `/api/users`
  - **Description:** Delete the authenticated user's account (cascades deletion of related flashcards and generations).
  - **Response:**
    ```json
    { "message": "Account deleted successfully." }
    ```
  - **Success Codes:** 200 OK
  - **Errors:** 401 Unauthorized

### Flashcards

- **List Flashcards**
  - **Method:** GET
  - **URL:** `/api/flashcards`
  - **Description:** Retrieve a paginated list of flashcards owned by the authenticated user.
  - **Query Parameters:**
    - `page` (number)
    - `limit` (number)
    - `sort` (e.g., `created_at`)
    - Optional filter: `rating` ("like" or "dislike")
  - **Response:** Array of flashcard objects.
  - **Success Codes:** 200 OK

- **Get Flashcard by ID**
  - **Method:** GET
  - **URL:** `/api/flashcards/{id}`
  - **Description:** Retrieve a specific flashcard by its ID.
  - **Response:**
    ```json
    { "id": 1, "user_id": 1, "front_text": "...", "back_text": "...", "rating": "like", "source": "manual", "generation_id": null, "created_at": "...", "updated_at": "..." }
    ```
  - **Success Codes:** 200 OK
  - **Errors:** 404 Not Found

- **Create Flashcard (Manual Entry)**
  - **Method:** POST
  - **URL:** `/api/flashcards`
  - **Description:** Create a new manually entered flashcard.
  - **Request Payload:**
    ```json
    { "front_text": "Text up to 200 characters", "back_text": "Text up to 500 characters", "source": "manual" }
    ```
  - **Validation:** Ensure `front_text` ≤ 200 characters and `back_text` ≤ 500 characters.
  - **Response:** Newly created flashcard object.
  - **Success Codes:** 201 Created

- **Update Flashcard**
  - **Method:** PUT
  - **URL:** `/api/flashcards/{id}`
  - **Description:** Update the contents of an existing flashcard.
  - **Request Payload:**
    ```json
    { "front_text": "Updated text", "back_text": "Updated text" }
    ```
  - **Response:** Updated flashcard object.
  - **Success Codes:** 200 OK
  - **Errors:** 400 Bad Request

- **Delete Flashcard**
  - **Method:** DELETE
  - **URL:** `/api/flashcards/{id}`
  - **Description:** Delete a flashcard by its ID.
  - **Response:**
    ```json
    { "message": "Flashcard deleted successfully." }
    ```
  - **Success Codes:** 200 OK

- **Rate Flashcard**
  - **Method:** PATCH
  - **URL:** `/api/flashcards/{id}/rate`
  - **Description:** Update the rating (like/dislike) of a flashcard.
  - **Request Payload:**
    ```json
    { "rating": "like" }
    ```
  - **Validation:** Only accept values "like" or "dislike".
  - **Response:** Updated flashcard object.
  - **Success Codes:** 200 OK

- **Flashcards Practice**
  - **Method:** GET
  - **URL:** `/api/flashcards/practice`
  - **Description:** Retrieve flashcards for a study session based on spaced repetition logic.
  - **Query Parameters:** Optional filters for review priorities.
  - **Response:** Array of flashcard objects sorted by review schedule.
  - **Success Codes:** 200 OK

### AI Generation and Generations

- **Generate Flashcards via AI**
  - **Method:** POST
  - **URL:** `/api/flashcards/generate`
  - **Description:** Generate flashcards using AI; the system validates the input text and generation mode, calls an external AI service, and records the generation details.
  - **Request Payload:**
    ```json
    {
      "text": "Input text between 1000 and 10000 characters",
      "generation_mode": "less" // options: "less", "default", "more"
    }
    ```
  - **Validation:** Ensure input text length is within range and `generation_mode` is valid.
  - **Response:**
    ```json
    {
      "generation": { "id": 1, "model": "model_name", "generation_count": 5, ... },
      "flashcards": [ { /* flashcard object */ }, ... ]
    }
    ```
  - **Rate Limiting:** Maximum of 100 flashcards can be generated per hour per user.
  - **Success Codes:** 201 Created
  - **Errors:** 400 Bad Request (invalid input or exceeding rate limits)

- **List Generations**
  - **Method:** GET
  - **URL:** `/api/generations`
  - **Description:** Retrieve a list of AI generation sessions for the authenticated user.
  - **Response:** Array of generation records.
  - **Success Codes:** 200 OK

- **Get Generation Details**
  - **Method:** GET
  - **URL:** `/api/generations/{id}`
  - **Description:** Retrieve detailed information for a specific AI generation session.
  - **Response:** Generation record with associated metadata.
  - **Success Codes:** 200 OK
  - **Errors:** 404 Not Found

## 3. Authentication and Authorization

- **Mechanism:** Token-based authentication (e.g., JWT) integrated with Supabase Auth.
- **Policy:** 
  - All endpoints (except registration, login, and password recovery) require authentication.
  - Database Row Level Security (RLS) policies are enforced to ensure that users can only access and modify their own records.

## 4. Validation and Business Logic

- **Validation Rules:**
  - **Users:**
    - Email must be unique.
  - **Flashcards:**
    - `front_text` must not exceed 200 characters.
    - `back_text` must not exceed 500 characters.
    - `rating` is restricted to "like" or "dislike".
    - `source` must be one of "auto", "hybrid", or "manual".
  - **AI Generation:**
    - Input text must be between 1000 and 10000 characters.
    - Enforce rate limiting to a maximum of 100 flashcards generated per hour.

- **Business Logic Mapping:**
  - **AI Flashcard Generation:**
    - Validates input text and generation mode.
    - Calls an external AI service to generate flashcards.
    - Creates a record in the `generations` table and associates generated flashcards with this generation.
  - **Rating Flashcards:**
    - Updates the flashcard's rating, affecting its status in review sessions and potential editing paths.
  - **Flashcards Practice:**
    - Applies spaced repetition algorithms to prioritize flashcards for study based on review schedule.

- **Error Handling:**
  - Consistent error responses for invalid inputs, authentication failures, and business logic errors.
  - Early returns and guard clauses in endpoint logic to simplify error paths. 