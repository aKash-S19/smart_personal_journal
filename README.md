# Smart Journal

You write a journal entry, hit save, and Groq AI reads it and tells you the mood. Simple.
This is AI integrated Java full stack project.

## Working

- Type a journal entry and hit save
- Backend stores it in MySQL and asks Groq what mood it is
- Frontend shows the entry with the detected mood

## Technologies Used

- **Frontend** - React + Vite.
- **Backend** - Spring Boot + JPA + MySQL.
- **AI API** - Groq API calling for AI integration.


## How to run
## You'll need

- Java 21+
- Node.js 18+
- MySQL running on `localhost:3306`

## Setup

### 1. Create the database

```sql
CREATE DATABASE smartjournal;
```

### 2. Add your keys

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Open `application.properties` and put in your MySQL password and [Groq API key](https://console.groq.com/keys).

### 3. Start the backend

```bash
./mvnw spring-boot:run
```

It'll be on `http://localhost:8080`.

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173` in your browser.

