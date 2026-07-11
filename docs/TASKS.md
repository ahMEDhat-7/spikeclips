# SpikeClip Task Breakdown

> Ordered by dependency, starting from Phase 0 (Validation). Nothing in Part II builds until Phase 4 is a "go."

---

## Phase 0: Define the Wedge

**Goal:** Establish the one-page value prop, proof metric, and non-goals.

### Task 0.1: Write Value Proposition

**Description:** Write the one-sentence value prop and supporting positioning statement.

**Acceptance criteria:**
- [ ] One-sentence value prop written: "shows you which moments people actually rewatched, so you clip the right ones — not the ones an AI guesses"
- [ ] Supporting 2-3 sentence positioning statement
- [ ] Differentiator vs AI-guessing tools clearly articulated

**Verification:**
- [ ] Read the value prop to someone unfamiliar with the project — they can explain it back

**Dependencies:** None

**Files likely touched:**
- `docs/value-proposition.md` (new)

**Estimated scope:** Small (1 file)

---

### Task 0.2: Name Competitors and Differentiation

**Description:** Document 3 competitors and explain why heatmap-based beats AI-guessed.

**Acceptance criteria:**
- [ ] 3 competitors identified (e.g., OpusClip, Vexub, one more)
- [ ] Each competitor's approach documented
- [ ] Clear explanation of why heatmap data > AI prediction

**Verification:**
- [ ] Differentiation is defensible and factual

**Dependencies:** None

**Files likely touched:**
- `docs/competitive-analysis.md` (new)

**Estimated scope:** Small (1 file)

---

### Task 0.3: Pick Proof Metric

**Description:** Choose the single metric that would prove the wedge works.

**Acceptance criteria:**
- [ ] One metric defined (e.g., "heatmap-selected clips get X% more views than self-selected")
- [ ] Threshold for success defined
- [ ] How to measure it documented

**Verification:**
- [ ] Metric is specific, measurable, and actionable

**Dependencies:** None

**Files likely touched:**
- `docs/proof-metric.md` (new)

**Estimated scope:** Small (1 file)

---

### Task 0.4: Deprioritize Stage 2 in Writing

**Description:** Explicitly document that Stage 2 (captions/editing) is deferred until Stage 1 has demand.

**Acceptance criteria:**
- [ ] Stage 2 non-goals written
- [ ] Conditions for starting Stage 2 defined
- [ ] Added to PRD or standalone doc

**Verification:**
- [ ] Clear "not building yet" statement exists

**Dependencies:** None

**Files likely touched:**
- `docs/PRD.md` (edit)

**Estimated scope:** XS (1 file edit)

---

### Checkpoint: Phase 0 Complete
- [ ] Value prop written
- [ ] Competitors analyzed
- [ ] Proof metric chosen
- [ ] Stage 2 deferred in writing
- [ ] Review with stakeholders before proceeding

---

## Phase 1: ICP Definition & Discovery Prep

**Goal:** Define the target persona, source candidates, draft outreach, and build interview questions.

### Task 1.1: Define Persona Document

**Description:** Create a detailed persona doc for the ideal customer.

**Acceptance criteria:**
- [ ] Persona defined: solo YouTubers, 20K–200K subs, visually-driven niche
- [ ] Explicit exclusions listed: faceless/meme/high-volume-low-craft
- [ ] Current workflow documented (how they pick moments today)
- [ ] Pain points articulated

**Verification:**
- [ ] Persona is specific enough to identify real candidates

**Dependencies:** Phase 0 complete

**Files likely touched:**
- `docs/persona.md` (new)

**Estimated scope:** Small (1 file)

---

### Task 1.2: Source 30-50 Reachable Candidates

**Description:** Build a list of potential interview candidates matching the persona.

**Acceptance criteria:**
- [ ] 30-50 candidates identified
- [ ] Each has channel name, subscriber count, niche, contact info
- [ ] Candidates are reachable (email, Twitter, Discord, etc.)

**Verification:**
- [ ] List is importable into outreach tool

**Dependencies:** Task 1.1

**Files likely touched:**
- `docs/candidates.csv` (new)

**Estimated scope:** Medium (1 file + research)

---

### Task 1.3: Draft Non-Salesy Outreach

**Description:** Write outreach messages that don't sound like sales pitches.

**Acceptance criteria:**
- [ ] 3 outreach templates (email, Twitter DM, Discord)
- [ ] Tone is peer-to-peer, not vendor-to-customer
- [ ] Asks for conversation, not sale

**Verification:**
- [ ] Read templates — do they sound like a fellow creator, not a marketer?

**Dependencies:** Task 1.1

**Files likely touched:**
- `docs/outreach-templates.md` (new)

**Estimated scope:** Small (1 file)

---

### Task 1.4: Build Interview Question Bank

**Description:** Create 15-20 interview questions covering current workflow, pain points, trust in data, and aesthetic preferences.

**Acceptance criteria:**
- [ ] 15-20 questions written
- [ ] Covers: current moment-picking process, time spent, past bad picks, trust in watch-data vs. instinct, what "cheap" tools have put them off
- [ ] Includes aesthetic/design preference questions

**Verification:**
- [ ] Questions are open-ended, not leading

**Dependencies:** Task 1.1

**Files likely touched:**
- `docs/interview-questions.md` (new)

**Estimated scope:** Small (1 file)

---

### Checkpoint: Phase 1 Complete
- [ ] Persona documented
- [ ] 30-50 candidates sourced
- [ ] Outreach templates ready
- [ ] Interview questions prepared
- [ ] Review before sending outreach

---

## Phase 2: Discovery Interviews & Signal Synthesis

**Goal:** Run 10-15 conversations, synthesize findings, and make a go/no-go recommendation.

### Task 2.1: Send Outreach to Candidates

**Description:** Send initial outreach to 30-50 candidates.

**Acceptance criteria:**
- [ ] Outreach sent to full list
- [ ] Responses tracked in spreadsheet

**Verification:**
- [ ] Response rate > 20% (6-10 responses)

**Dependencies:** Phase 1 complete

**Files likely touched:**
- Tracking spreadsheet (external)

**Estimated scope:** Medium (process, not code)

---

### Task 2.2: Conduct 10-15 Interviews

**Description:** Run discovery conversations with respondents.

**Acceptance criteria:**
- [ ] 10-15 interviews completed
- [ ] Each interview logged with verbatim quotes
- [ ] Strong/weak/no-signal tagged per interview

**Verification:**
- [ ] Enough data to identify patterns

**Dependencies:** Task 2.1

**Files likely touched:**
- `docs/interview-notes/` (new directory)

**Estimated scope:** Large (1-2 weeks, mostly waiting on replies)

---

### Task 2.3: Synthesize Findings

**Description:** Analyze interview data and produce a synthesis doc.

**Acceptance criteria:**
- [ ] Top 3 pains identified
- [ ] Differentiator resonance assessed (do they care about heatmap data?)
- [ ] Aesthetic cues noted
- [ ] Go/no-go recommendation made

**Verification:**
- [ ] Synthesis is data-backed, not anecdotal

**Dependencies:** Task 2.2

**Files likely touched:**
- `docs/synthesis.md` (new)

**Estimated scope:** Small (1 file)

---

### Checkpoint: Phase 2 Complete
- [ ] 10-15 interviews conducted
- [ ] Findings synthesized
- [ ] Top 3 pains documented
- [ ] Go/no-go recommendation ready
- [ ] Review with stakeholders before Phase 3

---

## Phase 3: Concierge MVP (Manual, No UI)

**Goal:** Run the algorithm by hand for 5-10 creators, deliver clips, collect performance data.

### Task 3.1: Recruit 5-10 Strong-Signal Participants

**Description:** Select participants from Phase 2 who showed strong interest and fit the persona.

**Acceptance criteria:**
- [ ] 5-10 participants confirmed
- [ ] Each has provided a video URL
- [ ] Agreement to post clips and track performance

**Verification:**
- [ ] Participants are committed (not just interested)

**Dependencies:** Phase 2 complete

**Files likely touched:**
- `docs/participants.md` (new)

**Estimated scope:** Small (process)

---

### Task 3.2: Run Videos Through Algorithm by Hand

**Description:** Use the Python prototype (`spike_merger.py`) to process each participant's video.

**Acceptance criteria:**
- [ ] All participant videos processed
- [ ] Heatmap extracted for each
- [ ] Scenes merged using canonical algorithm
- [ ] Reasoning behind each pick documented

**Verification:**
- [ ] Algorithm output makes sense for each video

**Dependencies:** Task 3.1

**Files likely touched:**
- Processing logs (external)

**Estimated scope:** Medium (manual process)

---

### Task 3.3: Cut and Reformat with FFmpeg

**Description:** Use FFmpeg to trim and reformat clips to vertical 9:16.

**Acceptance criteria:**
- [ ] Clips trimmed to exact scene boundaries
- [ ] Reformatted to 1080×1920 vertical
- [ ] No black bars, no artifacts

**Verification:**
- [ ] Clips look good on mobile preview

**Dependencies:** Task 3.2

**Files likely touched:**
- Output video files (external)

**Estimated scope:** Medium (manual process)

---

### Task 3.4: Hand-Deliver Clips with Reasoning

**Description:** Send clips to participants with explanation of why each moment was picked.

**Acceptance criteria:**
- [ ] Clips delivered to all participants
- [ ] Each delivery includes heatmap visualization + reasoning
- [ ] Participants asked to post and track performance

**Verification:**
- [ ] Participants received and understood the clips

**Dependencies:** Task 3.3

**Files likely touched:**
- Delivery emails/messages (external)

**Estimated scope:** Small (process)

---

### Task 3.5: Collect Structured Feedback

**Description:** Gather qualitative and quantitative feedback from participants.

**Acceptance criteria:**
- [ ] Feedback form sent to all participants
- [ ] Responses collected: clip quality, posting performance, willingness to pay
- [ ] Your own time-per-video tracked

**Verification:**
- [ ] Enough data to assess value

**Dependencies:** Task 3.4 (after clips are posted)

**Files likely touched:**
- `docs/concierge-feedback.md` (new)

**Estimated scope:** Small (process)

---

### Checkpoint: Phase 3 Complete
- [ ] 5-10 creators processed
- [ ] Clips delivered and posted
- [ ] Performance data collected
- [ ] Qualitative feedback gathered
- [ ] Time-per-video tracked
- [ ] Ready for Go/No-Go decision

---

## Phase 4: Go / No-Go Decision Gate

**Goal:** Compare data, assess willingness-to-pay, and make an explicit call.

### Task 4.1: Compare Performance Data

**Description:** Analyze heatmap-selected vs. self-selected clip performance.

**Acceptance criteria:**
- [ ] Performance metrics compiled (views, engagement, watch time)
- [ ] Comparison: heatmap clips vs. creator's usual clips
- [ ] Statistical significance noted (if possible)

**Verification:**
- [ ] Data is objective, not cherry-picked

**Dependencies:** Phase 3 complete

**Files likely touched:**
- `docs/performance-analysis.md` (new)

**Estimated scope:** Small (1 file)

---

### Task 4.2: Tally Willingness-to-Pay Signals

**Description:** Aggregate WTP signals from interviews and concierge MVP.

**Acceptance criteria:**
- [ ] Number of participants who said they'd pay documented
- [ ] Price points mentioned captured
- [ ] Any objections to paying noted

**Verification:**
- [ ] Signal is clear, not ambiguous

**Dependencies:** Phase 3 complete

**Files likely touched:**
- `docs/wtp-analysis.md` (new)

**Estimated scope:** Small (1 file)

---

### Task 4.3: Revisit Phase 0 Wedge Statement

**Description:** Compare original value prop against reality from Phase 2-3.

**Acceptance criteria:**
- [ ] Original wedge statement reviewed
- [ ] What proved true documented
- [ ] What needs adjustment noted

**Verification:**
- [ ] Wedge is still valid or has been refined

**Dependencies:** Tasks 4.1, 4.2

**Files likely touched:**
- `docs/wedge-reassessment.md` (new)

**Estimated scope:** Small (1 file)

---

### Task 4.4: Make Go/No-Go Decision

**Description:** Write a one-page decision memo with explicit call.

**Acceptance criteria:**
- [ ] GO or NO-GO decision made
- [ ] Evidence supporting the decision listed
- [ ] Next steps defined (if GO: begin Phase 5; if NO-GO: pivot or stop)

**Verification:**
- [ ] Decision is unambiguous

**Dependencies:** Tasks 4.1, 4.2, 4.3

**Files likely touched:**
- `docs/go-no-go-decision.md` (new)

**Estimated scope:** Small (1 file)

---

### Checkpoint: Phase 4 Complete — GATE
- [ ] Performance data analyzed
- [ ] Willingness-to-pay assessed
- [ ] Wedge statement validated or refined
- [ ] Go/No-Go decision made
- [ ] **STOP: Nothing in Phase 5+ starts until this is a "GO"**

---

## Phase 5: Stage 1 Build

**Goal:** Build the production-ready SpikeClip product with payments.

### 5.1 Foundation (Weeks 1–2)

---

### Task 5.1.1: Initialize Turborepo Monorepo

**Description:** Set up the monorepo structure with Turborepo, apps/, packages/, and docker/.

**Acceptance criteria:**
- [ ] `turbo.json` configured
- [ ] `apps/web/` (Next.js 16) scaffolded
- [ ] `apps/api/` (NestJS) scaffolded
- [ ] `packages/shared/` created
- [ ] `docker/` directory created
- [ ] Root `package.json` with workspaces

**Verification:**
- [ ] `turbo dev` runs both apps
- [ ] `turbo build` succeeds

**Dependencies:** Phase 4 is GO

**Files likely touched:**
- `turbo.json`
- `package.json`
- `apps/web/` (new)
- `apps/api/` (new)
- `packages/shared/` (new)

**Estimated scope:** Medium (4-5 files + scaffolding)

---

### Task 5.1.2: Set Up Next.js 16 Frontend

**Description:** Configure Next.js 16 with Tailwind CSS 4, shadcn/ui, and basic layout.

**Acceptance criteria:**
- [ ] Next.js 16 app running with App Router
- [ ] Tailwind CSS 4 configured
- [ ] shadcn/ui installed and configured
- [ ] Basic layout component with header
- [ ] Home page renders

**Verification:**
- [ ] `npm run dev` in `apps/web/` shows the app

**Dependencies:** Task 5.1.1

**Files likely touched:**
- `apps/web/package.json`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/tailwind.config.ts`

**Estimated scope:** Medium (3-5 files)

---

### Task 5.1.3: Set Up NestJS Backend

**Description:** Configure NestJS 11 with module structure, Prisma, and basic health check.

**Acceptance criteria:**
- [ ] NestJS app running
- [ ] Module structure: auth, jobs, clips, users
- [ ] Prisma client configured
- [ ] Health check endpoint (`GET /api/health`)
- [ ] Pino logger configured

**Verification:**
- [ ] `npm run start:dev` in `apps/api/` shows the app
- [ ] Health check returns 200

**Dependencies:** Task 5.1.1

**Files likely touched:**
- `apps/api/package.json`
- `apps/api/src/app.module.ts`
- `apps/api/src/main.ts`
- `apps/api/prisma/schema.prisma`

**Estimated scope:** Medium (3-5 files)

---

### Task 5.1.4: Port Canonical Merger Algorithm to TypeScript

**Description:** Port `spike_merger.py` to `packages/shared/algorithm/` in TypeScript.

**Acceptance criteria:**
- [ ] Algorithm ported to TypeScript
- [ ] All parameters configurable (gap tolerance, intensity delta, floor, min/max duration, etc.)
- [ ] Composite scoring implemented (peak + average + duration fit)
- [ ] Max-duration capping via sliding sub-window
- [ ] Min-duration filtering
- [ ] Non-overlap + minimum spacing on top-N

**Verification:**
- [ ] Unit tests pass with synthetic data (TC-VID-06)
- [ ] Unit tests pass with real heatmap fixtures

**Dependencies:** Task 5.1.1

**Files likely touched:**
- `packages/shared/algorithm/merge.ts`
- `packages/shared/algorithm/scoring.ts`
- `packages/shared/algorithm/types.ts`
- `packages/shared/algorithm/__tests__/merge.test.ts`

**Estimated scope:** Medium (4-5 files)

---

### Task 5.1.5: Implement yt-dlp Service

**Description:** Create a subprocess wrapper for yt-dlp in the NestJS backend.

**Acceptance criteria:**
- [ ] yt-dlp service wraps `yt-dlp -j` for metadata extraction
- [ ] Returns parsed JSON with heatmap data
- [ ] Error handling for unavailable videos
- [ ] Handles videos with no heatmap gracefully

**Verification:**
- [ ] Can extract metadata from a real YouTube URL

**Dependencies:** Task 5.1.3

**Files likely touched:**
- `apps/api/src/services/ytdlp.service.ts`
- `apps/api/src/services/ytdlp.service.spec.ts`

**Estimated scope:** Small (1-2 files)

---

### Task 5.1.6: Implement FFmpeg Service

**Description:** Create a subprocess wrapper for FFmpeg for trimming and reformatting.

**Acceptance criteria:**
- [ ] FFmpeg service wraps trim + crop to 9:16
- [ ] Uses `--force-keyframes-at-cuts` for accurate cuts
- [ ] Outputs 1080×1920 vertical format
- [ ] No black bars

**Verification:**
- [ ] Can trim a video segment and output vertical format

**Dependencies:** Task 5.1.3

**Files likely touched:**
- `apps/api/src/services/ffmpeg.service.ts`
- `apps/api/src/services/ffmpeg.service.spec.ts`

**Estimated scope:** Small (1-2 files)

---

### Task 5.1.7: Set Up PostgreSQL Schema via Prisma

**Description:** Define and migrate the database schema using Prisma.

**Acceptance criteria:**
- [ ] Users table created
- [ ] Jobs table created
- [ ] Clips table created
- [ ] Relations defined
- [ ] Migrations run successfully

**Verification:**
- [ ] `prisma db push` succeeds
- [ ] Tables exist in database

**Dependencies:** Task 5.1.3

**Files likely touched:**
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/`

**Estimated scope:** Small (1-2 files)

---

### Task 5.1.8: Set Up Redis + BullMQ

**Description:** Configure Redis connection and BullMQ queues for background jobs.

**Acceptance criteria:**
- [ ] Redis connection configured (Upstash for prod, local for dev)
- [ ] BullMQ queues: HeatmapJob, ClipJob
- [ ] Worker processes created
- [ ] Docker Compose includes Redis for local dev

**Verification:**
- [ ] Job can be enqueued and processed

**Dependencies:** Task 5.1.3

**Files likely touched:**
- `apps/api/src/workers/heatmap.worker.ts`
- `apps/api/src/workers/clip.worker.ts`
- `docker/docker-compose.yml`

**Estimated scope:** Medium (3-4 files)

---

### Task 5.1.9: Create Docker Compose for Local Dev

**Description:** Set up Docker Compose with all services for local development.

**Acceptance criteria:**
- [ ] `docker-compose.yml` includes: API, Web, Postgres, Redis
- [ ] All services start with `docker compose up`
- [ ] Volumes mounted for hot reload

**Verification:**
- [ ] Full stack runs locally via Docker

**Dependencies:** Tasks 5.1.2, 5.1.3, 5.1.7, 5.1.8

**Files likely touched:**
- `docker/docker-compose.yml`

**Estimated scope:** Small (1 file)

---

### Checkpoint: Foundation Complete
- [ ] Monorepo runs with `turbo dev`
- [ ] Frontend and backend both start
- [ ] Database schema migrated
- [ ] Redis + BullMQ operational
- [ ] Algorithm testable via API
- [ ] Review before proceeding to core features

---

### 5.2 Core Features (Weeks 3–4)

---

### Task 5.2.1: Implement Heatmap Extraction Job

**Description:** Build the API endpoint and worker for heatmap extraction.

**Acceptance criteria:**
- [ ] `POST /api/jobs` creates a job
- [ ] HeatmapJob worker extracts heatmap via yt-dlp
- [ ] Runs spike merge algorithm
- [ ] Saves scenes to job
- [ ] Job status updated to completed

**Verification:**
- [ ] Can submit a URL and get back scenes

**Dependencies:** Foundation complete

**Files likely touched:**
- `apps/api/src/modules/jobs/jobs.controller.ts`
- `apps/api/src/modules/jobs/jobs.service.ts`
- `apps/api/src/workers/heatmap.worker.ts`

**Estimated scope:** Medium (3-5 files)

---

### Task 5.2.2: Implement Interactive Heatmap Chart

**Description:** Build the Recharts-based heatmap visualization component.

**Acceptance criteria:**
- [ ] Interactive engagement chart renders
- [ ] Time on X-axis, intensity (0–1) on Y-axis
- [ ] Merged scene blocks highlighted distinctly
- [ ] Click a spike to see timestamp/intensity
- [ ] Responsive on mobile

**Verification:**
- [ ] Chart renders with real data from API

**Dependencies:** Task 5.2.1

**Files likely touched:**
- `apps/web/src/components/HeatmapChart.tsx`
- `apps/web/src/components/HeatmapChart.test.tsx`

**Estimated scope:** Medium (2-3 files)

---

### Task 5.2.3: Implement Scene List + Selection UI

**Description:** Build the scene list component with selection capabilities.

**Acceptance criteria:**
- [ ] List of merged scenes with timestamps
- [ ] Each shows start/end, duration, peak intensity
- [ ] User can select/deselect scenes to process
- [ ] Shows total estimated clip count/duration

**Verification:**
- [ ] Can select scenes and see count update

**Dependencies:** Task 5.2.1

**Files likely touched:**
- `apps/web/src/components/SceneList.tsx`
- `apps/web/src/components/SceneList.test.tsx`

**Estimated scope:** Small (2 files)

---

### Task 5.2.4: Implement URL Input Form + Validation

**Description:** Build the URL input form with client and server validation.

**Acceptance criteria:**
- [ ] URL input form with validation
- [ ] Accepts all YouTube URL formats
- [ ] Rejects non-YouTube URLs with clear error
- [ ] Loading state during submission

**Verification:**
- [ ] Can submit a valid YouTube URL
- [ ] Invalid URLs show error

**Dependencies:** Task 5.2.1

**Files likely touched:**
- `apps/web/src/components/UrlInput.tsx`
- `apps/web/src/lib/validations.ts`

**Estimated scope:** Small (2 files)

---

### Task 5.2.5: Implement Job Status Polling

**Description:** Set up polling to check job status and update UI.

**Acceptance criteria:**
- [ ] Frontend polls `GET /api/jobs/:id`
- [ ] Status transitions shown: pending → processing → completed/failed
- [ ] Error messages displayed on failure

**Verification:**
- [ ] UI updates as job progresses

**Dependencies:** Task 5.2.1

**Files likely touched:**
- `apps/web/src/lib/api.ts`
- `apps/web/src/hooks/useJobStatus.ts`

**Estimated scope:** Small (2 files)

---

### Task 5.2.6: Implement Clip Processing Job

**Description:** Build the API endpoint and worker for clip processing.

**Acceptance criteria:**
- [ ] `POST /api/jobs/:id/process` triggers clip processing
- [ ] Downloads source once via yt-dlp
- [ ] FFmpeg trims + crops each selected scene
- [ ] Uploads to R2
- [ ] Updates job with clip URLs

**Verification:**
- [ ] Can process selected scenes and get downloadable clips

**Dependencies:** Task 5.2.1, Tasks 5.1.5, 5.1.6

**Files likely touched:**
- `apps/api/src/modules/jobs/jobs.controller.ts`
- `apps/api/src/modules/clips/clips.service.ts`
- `apps/api/src/workers/clip.worker.ts`

**Estimated scope:** Medium (3-5 files)

---

### Task 5.2.7: Implement R2 Storage Integration

**Description:** Set up Cloudflare R2 for storing processed clips.

**Acceptance criteria:**
- [ ] R2 client configured
- [ ] Upload function works
- [ ] Signed, expiring download URLs generated
- [ ] Auto-cleanup after 7 days configured

**Verification:**
- [ ] Can upload and retrieve a file from R2

**Dependencies:** Task 5.1.1

**Files likely touched:**
- `apps/api/src/services/storage.service.ts`

**Estimated scope:** Small (1-2 files)

---

### Task 5.2.8: Implement Download Endpoint

**Description:** Build the clip download endpoint with signed URLs.

**Acceptance criteria:**
- [ ] `GET /api/clips/:id/download` returns signed URL
- [ ] URL expires after configured time
- [ ] Returns 404 for non-existent clips

**Verification:**
- [ ] Can download a processed clip

**Dependencies:** Tasks 5.2.6, 5.2.7

**Files likely touched:**
- `apps/api/src/modules/clips/clips.controller.ts`

**Estimated scope:** Small (1-2 files)

---

### Task 5.2.9: Write Video-Type Test Cases

**Description:** Create test cases for different video types (TC-VID-01 through TC-VID-06).

**Acceptance criteria:**
- [ ] TC-VID-01: Standard video (~3:30), mid-video peaks → 2-3 clips
- [ ] TC-VID-02: Long-form tutorial (12:00+), multiple peaks → 4-5 clips
- [ ] TC-VID-03: YouTube Short (0:45), single spike → 1 clip
- [ ] TC-VID-04: New/low-view video, no heatmap → graceful fallback
- [ ] TC-VID-05: Viral video (8:30), multiple intense spikes → 3-5 clips
- [ ] TC-VID-06: Synthetic floor-override case → single merged clip

**Verification:**
- [ ] All test cases pass

**Dependencies:** Task 5.2.1

**Files likely touched:**
- `packages/shared/algorithm/__tests__/video-types.test.ts`
- `apps/api/src/__tests__/video-types.integration.test.ts`

**Estimated scope:** Medium (2-3 files)

---

### Checkpoint: Core Features Complete
- [ ] End-to-end pipeline works: URL → heatmap → scenes → clips
- [ ] Heatmap visualization renders
- [ ] Scene selection works
- [ ] Clips process and download successfully
- [ ] All video-type test cases pass
- [ ] Review before proceeding to monetization

---

### 5.3 Monetization & Polish (Weeks 5–6)

---

### Task 5.3.1: Implement NextAuth.js Authentication

**Description:** Set up NextAuth.js with Google, GitHub, and Email providers.

**Acceptance criteria:**
- [ ] NextAuth.js configured
- [ ] Google OAuth working
- [ ] GitHub OAuth working
- [ ] Email magic link working
- [ ] Session management functional

**Verification:**
- [ ] Can sign in with all three methods

**Dependencies:** Core features complete

**Files likely touched:**
- `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- `apps/web/src/lib/auth.ts`
- `apps/api/src/modules/auth/auth.module.ts`

**Estimated scope:** Medium (3-5 files)

---

### Task 5.3.2: Implement User Dashboard

**Description:** Build the user dashboard showing job history and credit usage.

**Acceptance criteria:**
- [ ] Dashboard page with job history
- [ ] Shows analyses used vs. limit
- [ ] Shows credit balance
- [ ] Links to view job details

**Verification:**
- [ ] Can see past jobs and credit usage

**Dependencies:** Task 5.3.1

**Files likely touched:**
- `apps/web/src/app/dashboard/page.tsx`
- `apps/web/src/components/JobHistory.tsx`
- `apps/web/src/components/CreditUsage.tsx`

**Estimated scope:** Medium (3-4 files)

---

### Task 5.3.3: Implement Stripe Integration

**Description:** Set up Stripe subscriptions for Pro and Team tiers.

**Acceptance criteria:**
- [ ] Stripe customer creation on signup
- [ ] Checkout session for Pro tier ($19/mo)
- [ ] Checkout session for Team tier ($49/mo)
- [ ] Webhook handler for subscription events
- [ ] Upgrade/downgrade flow

**Verification:**
- [ ] Can subscribe to Pro tier
- [ ] Webhook processes payment events

**Dependencies:** Task 5.3.1

**Files likely touched:**
- `apps/api/src/modules/payments/payments.service.ts`
- `apps/api/src/modules/payments/payments.controller.ts`
- `apps/api/src/modules/payments/webhook.handler.ts`
- `apps/web/src/app/pricing/page.tsx`

**Estimated scope:** Large (5-8 files)

---

### Task 5.3.4: Implement Credit/Usage Tracking + Enforcement

**Description:** Track analyses per user and enforce free-tier limits.

**Acceptance criteria:**
- [ ] Analyses count incremented on each job
- [ ] Free tier limited to 3 analyses/month
- [ ] Pro/Team tiers unlimited
- [ ] Clear error when limit reached

**Verification:**
- [ ] Free user blocked after 3 analyses
- [ ] Pro user not blocked

**Dependencies:** Tasks 5.3.1, 5.3.3

**Files likely touched:**
- `apps/api/src/modules/users/users.service.ts`
- `apps/api/src/guards/credit.guard.ts`

**Estimated scope:** Small (2-3 files)

---

### Task 5.3.5: Build Landing Page with Pricing

**Description:** Create a marketing landing page with pricing section.

**Acceptance criteria:**
- [ ] Hero section with value prop
- [ ] Features section
- [ ] Pricing table (Free, Pro, Team)
- [ ] CTA buttons link to signup/pricing
- [ ] Meets NFR-8 design bar

**Verification:**
- [ ] Landing page loads and looks professional

**Dependencies:** Task 5.3.3

**Files likely touched:**
- `apps/web/src/app/page.tsx`
- `apps/web/src/components/Hero.tsx`
- `apps/web/src/components/Features.tsx`
- `apps/web/src/components/Pricing.tsx`

**Estimated scope:** Medium (3-5 files)

---

### Task 5.3.6: Implement Error Handling + Retry Logic

**Description:** Add comprehensive error handling across the application.

**Acceptance criteria:**
- [ ] Per-clip try/catch in workers
- [ ] Retry logic (3x) for failed jobs
- [ ] Dead-letter queue for permanently failed jobs
- [ ] Partial results returned on partial failure
- [ ] User-friendly error messages

**Verification:**
- [ ] Failed jobs retry automatically
- [ ] Partial results available on partial failure

**Dependencies:** Core features complete

**Files likely touched:**
- `apps/api/src/workers/heatmap.worker.ts`
- `apps/api/src/workers/clip.worker.ts`
- `apps/api/src/modules/jobs/jobs.service.ts`

**Estimated scope:** Medium (3-4 files)

---

### Task 5.3.7: Set Up Sentry Error Tracking

**Description:** Integrate Sentry for error tracking in both frontend and backend.

**Acceptance criteria:**
- [ ] Sentry configured for frontend
- [ ] Sentry configured for backend
- [ ] Source maps uploaded
- [ ] Alert rules configured

**Verification:**
- [ ] Test error appears in Sentry dashboard

**Dependencies:** Core features complete

**Files likely touched:**
- `apps/web/src/lib/sentry.ts`
- `apps/api/src/sentry.plugin.ts`

**Estimated scope:** Small (2 files)

---

### Task 5.3.8: Implement Rate Limiting

**Description:** Add rate limiting to API endpoints.

**Acceptance criteria:**
- [ ] 100 req/min for metadata endpoints
- [ ] 10 req/min for processing endpoints
- [ ] Clear error message when rate limited

**Verification:**
- [ ] Exceeding limits returns 429

**Dependencies:** Core features complete

**Files likely touched:**
- `apps/api/src/guards/rate-limit.guard.ts`
- `apps/api/src/main.ts`

**Estimated scope:** Small (2 files)

---

### Task 5.3.9: Design Pass Against NFR-8

**Description:** Review and polish all UI surfaces against the elegant-brand bar.

**Acceptance criteria:**
- [ ] Typography: one serif/sans pairing used consistently
- [ ] Color: restrained palette (2-3 core + neutrals)
- [ ] Motion: subtle and purposeful
- [ ] Copy: direct and quiet
- [ ] Output: no black bars, no artifacts

**Verification:**
- [ ] Visual review against NFR-8 checklist
- [ ] No generic/stock design elements

**Dependencies:** All other tasks in 5.3

**Files likely touched:**
- `apps/web/src/app/` (multiple)
- `apps/web/src/components/` (multiple)

**Estimated scope:** Medium (5+ files)

---

### Checkpoint: Monetization & Polish Complete
- [ ] Authentication working (Google, GitHub, Email)
- [ ] User dashboard functional
- [ ] Stripe payments working
- [ ] Credit limits enforced
- [ ] Landing page live
- [ ] Error handling comprehensive
- [ ] Sentry tracking errors
- [ ] Rate limiting active
- [ ] Design meets NFR-8 bar
- [ ] **Ready for production deployment**

---

## Phase 6: Stage 2 — Editing Layer

**Goal:** Add caption generation as a Stage 1 add-on/upsell. Only start after Stage 1 has real paying usage.

### Task 6.1: Whisper API Integration

**Description:** Integrate Whisper API for caption generation from audio.

**Acceptance criteria:**
- [ ] Whisper API called for audio transcription
- [ ] Captions returned with timestamps
- [ ] Error handling for API failures

**Verification:**
- [ ] Can generate captions from a clip

**Dependencies:** Stage 1 has paying users

**Files likely touched:**
- `apps/api/src/services/whisper.service.ts`
- `apps/api/src/workers/caption.worker.ts`

**Estimated scope:** Medium (2-3 files)

---

### Task 6.2: Caption Style Customization

**Description:** Build UI for caption style selection with curated elegant presets.

**Acceptance criteria:**
- [ ] Caption style selector in UI
- [ ] 3-5 curated elegant presets
- [ ] Font, color, position configurable
- [ ] Preview before burning

**Verification:**
- [ ] Can select style and preview captions

**Dependencies:** Task 6.1

**Files likely touched:**
- `apps/web/src/components/CaptionEditor.tsx`
- `apps/web/src/lib/caption-presets.ts`

**Estimated scope:** Medium (2-3 files)

---

### Checkpoint: Stage 2 Complete
- [ ] Caption generation works
- [ ] Style customization functional
- [ ] Presets meet elegant-brand bar
- [ ] Ready to ship as upsell

---

## Phase 7: Launch & Growth (Backlog, Traction-Gated)

**Goal:** Growth levers, not launch blockers. Only schedule after Phase 5-6 have real users.

### Task 7.1: Shareable Clip Links

**Description:** Allow sharing clips via public links.

**Acceptance criteria:**
- [ ] Each clip gets a shareable URL
- [ ] Landing page for shared clips
- [ ] Analytics on shared clip views

**Verification:**
- [ ] Can share a clip link and view it

**Dependencies:** Stage 1 with real users

**Files likely touched:**
- `apps/api/src/modules/clips/clips.controller.ts`
- `apps/web/src/app/shared/[id]/page.tsx`

**Estimated scope:** Small (2-3 files)

---

### Task 7.2: ZIP Download for Batch Clips

**Description:** Allow downloading multiple clips as a ZIP file.

**Acceptance criteria:**
- [ ] "Download All" button on job page
- [ ] ZIP file created with all clips
- [ ] Progress indicator during ZIP creation

**Verification:**
- [ ] Can download all clips as ZIP

**Dependencies:** Stage 1 with real users

**Files likely touched:**
- `apps/api/src/modules/clips/clips.controller.ts`
- `apps/api/src/services/zip.service.ts`

**Estimated scope:** Small (2 files)

---

### Task 7.3: Chrome Extension

**Description:** Build a Chrome extension that reads YouTube URLs and opens the web app.

**Acceptance criteria:**
- [ ] Extension icon appears on YouTube pages
- [ ] Clicking opens SpikeClip with URL pre-filled
- [ ] Works on watch, shorts, and embed pages

**Verification:**
- [ ] Extension installs and works

**Dependencies:** Stage 1 with real users

**Files likely touched:**
- `apps/extension/` (new directory)
- `apps/extension/manifest.json`
- `apps/extension/background.ts`
- `apps/extension/popup.tsx`

**Estimated scope:** Large (5+ files)

---

### Task 7.4: SEO Optimization

**Description:** Optimize the landing page for search engines.

**Acceptance criteria:**
- [ ] Meta tags configured
- [ ] Open Graph tags
- [ ] Structured data
- [ ] Sitemap generated

**Verification:**
- [ ] Google Search Console shows valid pages

**Dependencies:** Stage 1 with real users

**Files likely touched:**
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/sitemap.ts`

**Estimated scope:** Small (2 files)

---

### Task 7.5: Landing Page Animations

**Description:** Add subtle animations to the landing page.

**Acceptance criteria:**
- [ ] Hero section animations
- [ ] Feature reveal on scroll
- [ ] Subtle and purposeful (per NFR-8)

**Verification:**
- [ ] Animations enhance, not distract

**Dependencies:** Stage 1 with real users

**Files likely touched:**
- `apps/web/src/components/Hero.tsx`
- `apps/web/src/components/Features.tsx`

**Estimated scope:** Medium (2-3 files)

---

### Task 7.6: Product Hunt Launch Prep

**Description:** Prepare for Product Hunt launch.

**Acceptance criteria:**
- [ ] Product Hunt page created
- [ ] Screenshots and demo video
- [ ] Launch day checklist

**Verification:**
- [ ] Ready to launch on PH

**Dependencies:** All of Phase 5-6

**Files likely touched:**
- `docs/product-hunt/` (new directory)

**Estimated scope:** Small (process)

---

## Effort Summary

| Phase | Hours | Weeks (part-time) |
|-------|-------|-------------------|
| 0–4 (Validation) | — | 3–5 weeks calendar time |
| 5.1 (Foundation) | 50 | 1–2 |
| 5.2 (Core Features) | 68 | 2 |
| 5.3 (Monetization) | 62 | 2 |
| 6 (Stage 2) | 14 | 1 |
| 7 (Launch/Growth) | 34 | 1.5 |
| **Total to Stage 1 launch** | **180** | **~10–14 weeks incl. validation** |

At 20 hrs/week on Phase 5 alone: ~9 weeks. At 30 hrs/week: ~6 weeks.

---

## Dependency Graph

```
Phase 0 (Wedge)
    │
    ▼
Phase 1 (ICP + Prep)
    │
    ▼
Phase 2 (Interviews)
    │
    ▼
Phase 3 (Concierge MVP)
    │
    ▼
Phase 4 (Go/No-Go) ──── GATE ──── STOP if NO-GO
    │
    ▼
Phase 5.1 (Foundation)
    ├── 5.1.1 Monorepo
    ├── 5.1.2 Next.js Frontend
    ├── 5.1.3 NestJS Backend
    ├── 5.1.4 Algorithm Port
    ├── 5.1.5 yt-dlp Service ──┐
    ├── 5.1.6 FFmpeg Service ──┤
    ├── 5.1.7 Prisma Schema ───┤
    ├── 5.1.8 Redis + BullMQ ──┤
    └── 5.1.9 Docker Compose ──┘
                │
                ▼
Phase 5.2 (Core Features)
    ├── 5.2.1 Heatmap Job ────────┐
    ├── 5.2.2 Heatmap Chart ─────┤
    ├── 5.2.3 Scene List ────────┤
    ├── 5.2.4 URL Input ─────────┤
    ├── 5.2.5 Job Polling ───────┤
    ├── 5.2.6 Clip Processing ───┤
    ├── 5.2.7 R2 Storage ────────┤
    ├── 5.2.8 Download Endpoint ─┤
    └── 5.2.9 Test Cases ────────┘
                │
                ▼
Phase 5.3 (Monetization)
    ├── 5.3.1 Auth ──────────────┐
    ├── 5.3.2 Dashboard ─────────┤
    ├── 5.3.3 Stripe ────────────┤
    ├── 5.3.4 Credits ───────────┤
    ├── 5.3.5 Landing Page ──────┤
    ├── 5.3.6 Error Handling ────┤
    ├── 5.3.7 Sentry ────────────┤
    ├── 5.3.8 Rate Limiting ─────┤
    └── 5.3.9 Design Pass ───────┘
                │
                ▼
Phase 6 (Stage 2) ── After real users
                │
                ▼
Phase 7 (Growth) ── Traction-gated
```

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| YouTube changes heatmap payload / blocks yt-dlp | High | Keep yt-dlp pinned; visible fallback messaging |
| FFmpeg processing slow | Medium | Optimize presets; hardware acceleration |
| Whisper API costs high | Medium | Local faster-whisper option; limit to paid tier |
| Low conversion rate | Medium | Strong free tier, clear upgrade triggers |
| Algorithm overfit to synthetic example | Medium | Validate against real heatmap fixtures (5.2.9) |
| Persona too broad | Medium | Enforce Phase 1 exclusion criteria |
| Copyright/ToS exposure | Medium | Track as open legal question |
