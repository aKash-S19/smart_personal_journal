# Smart Journal Frontend

This is the React frontend for your Spring Boot Smart Journal project. It talks to the backend endpoints in `JournalController`:

- `GET /api/journal` loads all journal entries.
- `POST /api/journal` saves a new entry and lets the backend call Groq AI for mood detection.
- `PUT /api/journal/{id}` updates an entry and rechecks the mood.
- `DELETE /api/journal/{id}` removes an entry.

## How to Run

Open two terminals.

Terminal 1, start Spring Boot from the project root:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell you can use:

```powershell
.\mvnw.cmd spring-boot:run
```

Terminal 2, start React:

```bash
cd frontend
npm install
npm run dev
```

React will open at:

```text
http://127.0.0.1:5173
```

## Step-by-Step: How the Code Works

### 1. `index.html`

React needs one empty HTML element where it can place your app:

```html
<div id="root"></div>
```

### 2. `src/main.jsx`

This file starts React and renders your main `App` component inside `#root`.

```jsx
createRoot(document.getElementById('root')).render(<App />);
```

### 3. `src/api/journalApi.js`

This file keeps all backend calls in one place. The app does not write `fetch(...)` everywhere.

```js
export function getEntries() {
  return request('/journal');
}
```

The default backend URL is:

```text
http://localhost:8080/api
```

If you ever change the backend port, create `frontend/.env`:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. `src/App.jsx`

This is the main screen. It uses React state for:

- `entries`: all saved journal entries from the backend.
- `form`: the title and content typed by the user.
- `editingId`: tells React whether we are creating or editing.
- `isLoading` and `isSaving`: show loading states.
- `error` and `success`: show user messages.

When the app first loads, this code runs:

```jsx
useEffect(() => {
  loadEntries();
}, []);
```

That asks Spring Boot for saved journal entries.

### 5. Saving an Entry

When you click Save Entry, `handleSubmit` sends only this data:

```js
{
  title: form.title,
  content: form.content
}
```

Your Java backend then adds:

- `createdAt`
- `mood`

The frontend displays the saved result returned by the backend.

### 6. Styling

`src/styles.css` contains all CSS. It uses normal class names such as:

- `.topbar`
- `.editor-panel`
- `.entries-panel`
- `.entry-row`
- `.mood`

This is intentionally plain CSS so you can understand every line without needing Tailwind or a UI library.

## Safer Groq API Key Setup

Your Groq key should not stay directly inside `application.properties`. A safer version is:

```properties
groq.api.key=${GROQ_API_KEY}
```

Then set `GROQ_API_KEY` as an environment variable on your machine before running Spring Boot.
