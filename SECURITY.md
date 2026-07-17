# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Use [GitHub's private vulnerability reporting](https://github.com/ahmedhat/SpikeClip/security/advisories/new)
3. Include: description, steps to reproduce, potential impact
4. Expect initial response within 48 hours

## Security Measures

### Authentication
- Google OAuth 2.0 only (no email/password)
- JWT tokens stored as httpOnly cookies (not accessible via JavaScript)
- 15-minute token expiration
- Rate limiting on auth endpoints (10 req/min)

### Cookie Security
- `httpOnly: true` — Prevents JavaScript access
- `secure: true` in production — HTTPS only
- `sameSite: "lax"` — CSRF protection
- `path: "/"` — Cookie available on all routes

### API Security
- Global rate limiting (30 req/min per IP)
- CORS configured per environment
- Input validation via class-validator
- SQL injection prevention via Prisma ORM
- Quota enforcement on analysis creation (free tier: 3/month)

### Infrastructure
- SSH key-only authentication (port 2222)
- Fail2Ban (5 failed attempts → 1hr ban)
- UFW firewall (ports 22, 80, 443 only)
- Unattended security updates
- Docker: `no-new-privileges:true` on all services
- Systemd: `ProtectSystem=strict`, `PrivateTmp=yes`

### Data Protection
- Environment variables for secrets (never committed)
- Signed URLs for clip downloads (API streams from MinIO/local storage)
- HTTPS via Let's Encrypt / Certbot
- Security headers (CSP, HSTS, X-Frame-Options)

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |
| < 1.0   | No        |

## Dependencies

- Dependencies are audited via `pnpm audit`
- Prisma client generated from schema (no raw SQL)
- yt-dlp and FFmpeg called via `execFile` (not shell injection)
