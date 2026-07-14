# API Reference

All endpoints prefixed with `/api`. Swagger docs available at `/api/docs`.

## Authentication

All protected endpoints use httpOnly cookies for JWT authentication:

- `POST /api/auth/register` and `POST /api/auth/login` set the `access_token` cookie automatically
- Subsequent requests include the cookie automatically (with `credentials: "include"`)
- Swagger UI can also use Bearer token in the Authorization header

## Health

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `GET` | `/api/health` | Public | Global | Health check (status, timestamp, uptime) |

## Auth

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/api/auth/register` | Public | 5/min | Create account, sets JWT cookie |
| `POST` | `/api/auth/login` | Public | 5/min | Login, sets JWT cookie |
| `POST` | `/api/auth/logout` | Bearer | Global | Clear JWT cookie |
| `GET` | `/api/auth/me` | Bearer | Global | Get current user profile |
| `PATCH` | `/api/auth/me` | Bearer | Global | Update profile (name, email) |
| `POST` | `/api/auth/change-password` | Bearer | Global | Change password |

### Register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response (201):** Sets `access_token` httpOnly cookie
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "plan": "free",
  "analysesUsed": 0,
  "analysesLimit": 3,
  "scenesLimit": 3
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

**Response (200):** Sets `access_token` httpOnly cookie
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "plan": "free",
  "analysesUsed": 1,
  "analysesLimit": 3,
  "scenesLimit": 3
}
```

### Logout

**Response (200):** Clears `access_token` cookie
```json
{ "message": "Logged out" }
```

### Get Profile

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "plan": "free",
  "analysesUsed": 1,
  "analysesLimit": 3,
  "scenesLimit": 3,
  "createdAt": "2026-07-12T12:00:00.000Z"
}
```

### Update Profile

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200):** Updated user profile

### Change Password

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**Response (200):** `{ "message": "Password changed" }`

---

## Jobs

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/api/jobs` | Bearer | 5/min | Create analysis job (quota enforced) |
| `GET` | `/api/jobs` | Bearer | Global | List user's jobs |
| `GET` | `/api/jobs/:id` | Bearer | Global | Get job by ID |
| `POST` | `/api/jobs/:id/process` | Bearer | 5/min | Run algorithm on heatmap |
| `POST` | `/api/jobs/:id/export` | Bearer | 3/min | Export clips for scenes |
| `GET` | `/api/jobs/:id/clips` | Bearer | Global | Get clips for job |

### Create Job

Free-tier users are limited to 3 analyses/month. Returns 403 if quota exceeded.

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
  "videoViewCount": 1500000,
  "videoUploadDate": "2026-06-01",
  "videoChannelName": "Channel Name",
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
  "videoViewCount": 1500000,
  "videoUploadDate": "2026-06-01",
  "videoChannelName": "Channel Name",
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
  "scenes": [
    { "start_time": 45.2, "end_time": 78.4, "peak_intensity": 0.92 },
    { "start_time": 120.0, "end_time": 165.0, "peak_intensity": 0.85 }
  ],
  "platform": "youtube-shorts",
  "format": "mp4",
  "quality": "1080p",
  "captions": [
    {
      "text": "Check this out!",
      "font": "inter",
      "size": 48,
      "color": "#FFFFFF",
      "position": "center",
      "animation": "pop"
    }
  ],
  "music": {
    "fileKey": "user-id/track.mp3",
    "volume": 0.3,
    "originalVolume": 1.0,
    "fadeIn": 2,
    "fadeOut": 2
  },
  "templateId": "kinetic-typography",
  "templateConfig": { "textAnimation": "pop", "transitionIn": "fade" }
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
| `GET` | `/api/clips/download/:key` | Bearer | Global | Download by storage key (signed URL) |

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
    "errorMessage": null,
    "createdAt": "2026-07-12T12:00:00.000Z"
  }
]
```

### Download Clip

**Response:** 302 redirect to signed URL (MinIO) or local file.

---

## Music

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/api/music/upload` | Bearer | Global | Upload background music (max 10MB) |
| `DELETE` | `/api/music/:key` | Bearer | Global | Delete uploaded music |

### Upload Music

**Request:** `multipart/form-data` with `file` field (audio/mpeg, audio/wav, audio/ogg, audio/mp4)

**Response (201):**
```json
{
  "id": "user-id/uuid-filename.mp3",
  "name": "track.mp3",
  "url": "http://localhost:3001/api/clips/download/...",
  "size": 1048576
}
```

### Delete Music

**Response (200):**
```json
{ "deleted": true }
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (invalid input) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (quota exceeded) |
| 404 | Resource not found |
| 409 | Conflict (e.g., email already registered) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
