# Safe File Deleter

A small full-stack application for safely deleting files inside a restricted directory. The Spring Boot backend validates every requested path against a configured allowed root and refuses symlinks, directories, and paths that escape the root. The React frontend provides a simple UI for submitting paths and viewing per-path results.

## Stack

Spring Boot 3.2 / Java 17 / React 18 / Vite 5

## Layout

```
.
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/example/demo/
│           │   ├── DemoApplication.java
│           │   └── controller/ApiController.java
│           └── resources/application.properties
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── App.css
```

## How to run

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API listens on `http://localhost:8080`. Files are resolved relative to `app.allowed-root` (default `./allowed_root`), which must exist before use.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` requests to the backend.

## API

### `POST /api/delete`

Deletes one or more regular files inside the allowed root.

**Request body**

```json
{
  "paths": ["notes.txt", "subdir/report.pdf"]
}
```

Paths are interpreted as relative to `app.allowed-root`.

**Response**

```json
{
  "deleted": ["notes.txt"],
  "errors": [
    { "path": "subdir/report.pdf", "error": "not found" }
  ]
}
```

Each path is processed independently; failures do not abort the batch. Possible error reasons include `empty path`, `outside allowed root`, `symlink refused`, `not found`, `not a regular file`, and I/O error messages.

## Notes

- The allowed root is configured via `app.allowed-root` in `backend/src/main/resources/application.properties`. The directory must exist; it is not created automatically.
- Only regular files are deleted. Directories, symlinks, and paths that resolve outside the allowed root are rejected.
- Path traversal is prevented by normalizing the resolved path and verifying it still starts with the allowed root.
- There is no authentication or authorization layer — do not expose this service on an untrusted network.
- The frontend has no build-time configuration; it relies on the Vite dev proxy. For production, serve the built assets behind a reverse proxy that forwards `/api` to the backend.
- No persistence layer is used; results are returned per request and not logged.