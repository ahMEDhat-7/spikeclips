# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email: ahmed.medhat.saad77@gmail.com
3. Include: description, steps to reproduce, potential impact
4. Expect initial response within 48 hours

## Security Measures

### Authentication
- JWT tokens with bcrypt password hashing
- Token expiration and refresh mechanism
- Rate limiting on auth endpoints (5 req/min)

### API Security
- Global rate limiting (30 req/min per IP)
- CORS configured per environment
- Input validation via class-validator
- SQL injection prevention via Prisma ORM

### Infrastructure
- SSH key-only authentication (port 2222)
- Fail2Ban (5 failed attempts → 1hr ban)
- UFW firewall (ports 22, 80, 443 only)
- Unattended security updates
- Docker: `no-new-privileges:true` on all services
- Systemd: `ProtectSystem=strict`, `PrivateTmp=yes`

### Data Protection
- Environment variables for secrets (never committed)
- Signed URLs for clip downloads (MinIO)
- HTTPS via Let's Encrypt / Certbot
- Security headers (CSP, HSTS, X-Frame-Options)

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes |
| Older   | No |

## Dependencies

- Dependencies are audited via `pnpm audit`
- Prisma client generated from schema (no raw SQL)
- yt-dlp and FFmpeg called via `execFile` (not shell injection)
