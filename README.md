# typing-hackathon

Touch-typing practice app with a Spring Boot backend and a React (Vite) frontend.

## Structure

```
typing-hackathon/
├── backend/    # Spring Boot (Java 17, Maven)
└── frontend/   # React + Vite
```

## Run

Backend:
```
cd backend
./mvnw spring-boot:run
```

Frontend:
```
cd frontend
npm install
npm run dev
```

Backend runs at `http://localhost:8080`, frontend at `http://localhost:5173` (proxies `/api` to backend).
