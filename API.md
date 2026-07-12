# API Reference

All endpoints prefixed with `/api`. Swagger docs available at `/api/docs`.

## Health

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/api/health` | Public | Global | Health check (status, timestamp, uptime) |

## Auth

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/api/auth/register` | Public | 5/min | Create account, returns JWT |
| `POST` | `/api/auth/login` | Public | 5/min | Login, returns JWT |
| `GET` | `/api/auth/me` | Bearer | Global | Get current user profile |

### Register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "free"
  }
}
```

### Login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "free"
  }
}
```

### Get Profile

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "plan": "free",
  "analysesUsed": 1,
  "analysesLimit": 3,
  "createdAt": "2026-07-12T12:00:00.000Z"
}
```

---

## Jobs

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/api/jobs` | Bearer | 5/min | Create analysis job |
| `GET` | `/api/jobs` | Bearer | Global | List user's jobs |
| `GET` | `/api/jobs/:id` | Bearer | Global | Get job by ID |
| `POST` | `/api/jobs/:id/process` | Bearer | 5/min | Run algorithm on heatmap |
| `POST` | `/api/jobs/:id/export` | Bearer | 3/min | Export clips for scenes |
| `GET` | `/api/jobs/:id/clips` | Bearer | Global | Get clips for job |

### Create Job

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "url": "https://www.youtube.com/watch?v=...",
  "videoTitle": "Video Title",
  "videoThumbnail": "https://...",
  "videoDuration": 360.5,
  "status": "pending",
  "createdAt": "2026-07-12T12:00:00.000Z"
}
```

### Get Job

**Response (200):**
```json
{
  "id": "uuid",
  "url": "https://www.youtube.com/watch?v=...",
  "videoTitle": "Video Title",
  "videoThumbnail": "https://...",
  "videoDuration": 360.5,
  "status": "completed",
  "scenes": [
    {
      "start_time": 45.2,
      "end_time": 78.4,
      "duration": 33.2,
      "peak_intensity": 0.92,
      "avg_intensity": 0.78,
      "score": 0.85,
      "confidence": "high",
      "capped": false
    }
  ],
  "heatmapData": [
    { "start_time": 0, "end_time": 5, "value": 0.3 },
    { "start_time": 5, "end_time": 10, "value": 0.7 }
  ],
  "createdAt": "2026-07-12T12:00:00.000Z"
}
```

### Process Heatmap

Runs the spike merging algorithm on the job's heatmap data.

**Response (200):** Updated job with `scenes` populated.

### Export Clips

**Request:**
```json
{
  "sceneIndices": [0, 2]
}
```

**Response (200):**
```json
{
  "jobId": "uuid",
  "clipJobIds": ["clip-uuid-1", "clip-uuid-2"]
}
```

---

## Clips

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/api/clips/job/:jobId` | Bearer | Global | List clips by job ID |
| `GET` | `/api/clips/:id/download` | Bearer | Global | Download clip (redirect to signed URL) |

### List Clips

**Response (200):**
```json
[
  {
    "id": "clip-uuid",
    "jobId": "job-uuid",
    "sceneIndex": 0,
    "startTime": 45.2,
    "endTime": 78.4,
    "peakIntensity": 0.92,
    "status": "completed",
    "fileUrl": "clips/job-uuid/scene-0.mp4",
    "fileSize": 1048576,
    "duration": 33.2,
    "createdAt": "2026-07-12T12:00:00.000Z"
  }
]
```

### Download Clip

**Response:** 302 redirect to signed URL (MinIO) or local file.

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (invalid input) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Resource not found |
| 409 | Conflict (e.g., email already registered) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

## Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Get a token via `/api/auth/login` or `/api/auth/register`.
