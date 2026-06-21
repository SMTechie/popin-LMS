# POPIN LMS

POPIN LMS is a single-school, enterprise learning and school-operations platform. It provides separate Admin, Teacher, and Parent portals backed by a NestJS API, PostgreSQL, Prisma, Redis-backed workflows, and a React/Vite frontend.

The platform combines academics, admissions, family access, inventory, procurement, uniform sales, communications, identity integrations, and deterministic assessment marking in one deployment.

## Technology stack

| Layer | Technology |
| --- | --- |
| Web | React 18, TypeScript, Vite, Tailwind CSS, React Router, Recharts |
| API | NestJS 10, TypeScript, JWT/Passport, Swagger |
| Database | PostgreSQL 16, Prisma ORM |
| Jobs and queues | Redis, BullMQ-compatible infrastructure, persistent processing records |
| Security | API-enforced RBAC, JWT, OAuth 2.0/OIDC with PKCE, AES-256-GCM credential encryption |
| Runtime | Node.js 20, Docker |

## Portals and features

### Admin Portal

Administrators run the school through the following modules:

- Dashboard, analytics, notifications, audit history, and operational boards.
- Admissions form builder, public applications, workflow cards, and application tracking.
- Automatic admissions conversion: accepted applications create student profiles, student numbers, guardian links, portal access, and grade/class placement.
- Student Management:
  - Create and edit students.
  - CSV bulk import and export.
  - Archive students.
  - Transfer classes and promote grades with placement history.
  - Manage grades, classes, subjects, student numbers, emergency information, and admissions history.
  - Link parents and guardians with granular permissions.
  - Create teacher accounts. Teachers cannot self-register.
- Supply Chain and requisitions:
  - Teacher requests, approval workflow, purchase orders, delivery, spend dashboards, and procurement reporting.
- Enterprise Inventory:
  - Items, variants, locations, bins, stock balances, receipts, issues, transfers, reservations, adjustments, counts, reorder rules, alerts, audit history, and valuation reports.
- Uniform Store management:
  - Storefront and management modes.
  - Products, categories, images, variants, prices, VAT, suppliers, availability, featured products, and collection/return details.
  - Restocking, removals, reservations, damaged stock, transfers, stock history, sales history, imports, exports, and low-stock controls.
- Tickets, appointments, payment endpoints, email routing, notifications, workflow automation, and public-form integrations.
- Enterprise Administration Centre:
  - School profile, users, roles, authentication, branding, admissions, academic policies, portals, timetables, attendance, assessments, finance, integrations, security, backups, audit, and developer settings.
  - Setting changes are persisted and audited with old/new values.
- Microsoft 365, Google Workspace, and Apple integration administration.

### Teacher Portal

The Teacher Portal is a daily classroom workbench. Teachers only see classes assigned by an administrator.

- Today's classes, timetable, outstanding attendance, parent questions, announcements, recent work, and requisition status.
- Assigned classes, learner lists, subjects, schedules, and class resources.
- Homework and assignments with due dates, instructions, attachments, parent visibility, status, and archiving workflows.
- Lesson plans, curriculum outcomes, linked homework, resources, and assessments.
- Attendance registers, late arrivals, notes, parent notification flags, drafts, and submission.
- Assessments, parent communication, class announcements, and supply requisitions.
- Teacher profile, timetable, qualifications/document architecture, and notification preferences.

#### POPIN Teacher Assistant

Teacher Assistant is a self-hosted, deterministic assessment engine. It is not a chatbot and does not depend on OpenAI, Gemini, or Claude.

Version 1 includes:

- Assessment creation with subject, class, grade, total marks, due date, and assessment type.
- Manual memorandum builder with question numbers, answers, alternatives, marks, tolerance, units, and question types.
- Supported deterministic question types:
  - Numerical and calculation questions.
  - Multiple choice.
  - True/false.
  - Fill in the blank.
  - Matching with shuffled-order support.
  - Exact and alternative answers.
- Numerical support for tolerance, negative values, fractions, percentages, currencies, scientific notation, precision, and required units.
- Subject plug-in architecture with numerical and objective plug-ins. Current subject coverage includes Mathematics, Mathematical Literacy, Accounting, Physical Sciences calculations, EMS, CAT, IT, and general objective assessments.
- Phone-image, scan, PDF, and text upload metadata with a maximum of 100 scripts per batch.
- Editable OCR text before marking.
- Student-number/name detection constrained to the assessment's assigned classes. Ambiguous matches are flagged and never guessed.
- Explainable marking showing expected answer, detected answer, applied rule, confidence, and suggested score.
- OCR and marking confidence, exception flags, teacher overrides, review timestamps, and complete audit history.
- One-click approval and controlled publishing. Marks are never published without teacher approval.
- Published results appear in the linked parent's portal when the guardian has report permission.
- Class average, highest, lowest, median, pass rate, per-question success, failed-question, and override analytics.
- Persistent OCR/marking jobs with retry and stale-lock recovery after restarts.

Editable or pasted extracted text works without an external service. Image/PDF OCR is routed to a self-hosted service configured with `OCR_SERVICE_URL`. The service should accept JSON containing files and enhancement operations, then return:

```json
{
  "text": "Student Number: POP-7001\n1. 15\n2. 27.5",
  "confidence": 0.96
}
```

If OCR is unavailable or uncertain, the script enters `NEEDS_REVIEW` instead of inventing an answer.

### Parent Portal

- Parents may self-register with email or use a configured Microsoft, Google, or Apple provider.
- Registration alone grants no learner access.
- Access requires an active, verified student-guardian link created by admissions or an administrator.
- One parent can be linked to multiple children through the child switcher.
- Every learner-facing API request follows:

```text
authenticated parent user
→ active verified guardian links
→ selected linked learner
→ required guardian permission
→ permitted records only
```

- Guardian relationship types include Mother, Father, Guardian, Grandparent, Sponsor, Emergency contact, and Pickup authorised person.
- Per-link permissions cover fees, payments, reports, homework, announcements, teacher messaging, pickup authority, applications, appointments, hostel access, placement applications, hostel billing, concerns, and movement history.
- Child-scoped views include homework, attendance, published assessments, announcements, applications, fees, and appointments.
- Orders and support tickets are restricted to the authenticated parent's own account.
- Appointment creation verifies both the child link and the teacher's assignment to that child's class.

### Hostel Management

Hostel Management is part of POPIN LMS and reuses the existing learner, guardian, admissions, finance, discipline, notification, audit, and role architecture. Learners are never recreated for boarding use.

- Live dashboard for capacity, occupied and available beds, applications, waiting lists, arrivals/departures, incidents, maintenance, meals, and outstanding fees.
- Building, block, room, and individual bed setup with operational policies and room fees.
- Applications, approvals, waiting lists, reservations, allocations, check-ins, check-outs, and room transfers.
- Resident registers, morning/evening roll calls, meal registers, incidents, maintenance, visitor logs, and occupancy analytics.
- Child-linked hostel charges with payment state, due dates, outstanding balances, and an external finance-invoice bridge.
- Notices targeting all residents, a building, or one learner, with channel metadata ready for in-app, email, SMS, and WhatsApp providers.
- Hostel Admin, Hostel Warden, House Parent, and Finance Admin roles with purpose-specific permissions.
- Permitted guardians can apply, view placement and room details, see notices and billing, submit concerns, and view enabled movement history.
- Every parent hostel endpoint verifies the authenticated guardian link, selected learner, and specific hostel permission on the backend.

### Uniform Store storefront

Parents and students can browse active products, view prices, sizes, colours, and stock state, add items to a cart, checkout, and view their own order history. Admin-only product and stock actions are never exposed as storefront operations.

## Account model and authorization

- Admins create teachers, students, grades, classes, subjects, assignments, and guardian relationships.
- Teachers are created by Admin or provisioned through an approved Microsoft/Google connection. They cannot use public signup.
- Public email signup always creates a Parent account.
- Parents see zero learner data until a verified guardian link exists.
- Teacher class visibility and parent child visibility are enforced in backend services, not just hidden in the frontend.
- RBAC permissions and module toggles are enforced by `PermissionGuard`.
- Guardian link, unlink, permission change, student mutation, settings mutation, SSO, marking, override, approval, and publishing actions are audited.

## Enterprise identity integrations

The integration centre supports Microsoft 365/Entra ID, Google Workspace, and Sign in with Apple.

- OAuth 2.0/OpenID Connect authorization code flow with PKCE.
- Signed, expiring OAuth state and strict callback URIs.
- Verified Google and Microsoft user-info responses.
- Apple ID-token signature, issuer, audience, and expiry validation.
- Approved school-domain and portal restrictions.
- Parent provisioning and optional admin/teacher auto-provisioning.
- Encrypted access, refresh, and ID tokens.
- External group-to-role mapping records with optional grade, class, subject, and department scope.
- Consent, health, sync logs, disconnect controls, and audit records.
- Calendar event architecture for Microsoft/Google synchronization.
- Microsoft Graph/Gmail communication configuration without storing mailbox passwords.

Provider buttons remain disabled until a school administrator supplies provider credentials and consent in **Settings → Microsoft / Google / Apple**.

## Repository layout

```text
apps/
  api/                  NestJS API, Prisma schema, migrations, seed and workers
  web/                  React/Vite single-page application
packages/
  shared/               Shared module and permission types
infra/
  docker-compose.*.yml  PostgreSQL, Redis and production stack definitions
  nginx/                Reverse-proxy configuration
```

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop or Docker Engine with Compose
- PostgreSQL 16 and Redis 7, normally started through Docker

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment files

Copy the supplied examples:

```text
apps/api/.env.example → apps/api/.env
apps/web/.env.example → apps/web/.env
```

Generate a 32-byte encryption key before configuring OAuth credentials:

```bash
openssl rand -hex 32
```

Place the result in `ENCRYPTION_KEY`. Do not rotate this key without re-encrypting stored credentials and tokens.

### 3. Start PostgreSQL and Redis

```bash
docker compose -f infra/docker-compose.redis.yml up -d
```

This exposes PostgreSQL on `5432` and Redis on `6379` using the local development credentials in the Compose file.

### 4. Generate Prisma Client, migrate, and seed

```bash
npm --workspace apps/api run prisma:generate
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
npm --workspace apps/api run prisma:seed
```

The seed accepts:

```text
SEED_ADMIN_EMAIL=admin@school.co.za
SEED_ADMIN_PASSWORD=Admin123!
```

The values above are the fresh-seed defaults. Change them immediately outside local development. The currently prepared local Docker database may use `admin` as the password if it was created through the documented development setup used in this workspace.

### 5. Start the applications

Run each workspace in a separate terminal:

```bash
npm --workspace apps/api run start:dev
npm --workspace apps/web run dev -- --host 0.0.0.0 --port 3000
```

Open:

- Web: http://localhost:3000
- API: http://localhost:4000
- Swagger: http://localhost:4000/docs
- Health: http://localhost:4000/health
- Metrics: http://localhost:4000/health/metrics

The root `npm run dev` script uses shell background syntax and is most reliable on Unix-like shells. On PowerShell, use two terminals as shown above.

## Docker

### Infrastructure only

```bash
docker compose -f infra/docker-compose.redis.yml up -d
```

### Build application images

```bash
docker build -f apps/api/Dockerfile -t popin-lms-api .
docker build -f apps/web/Dockerfile -t popin-lms-web apps/web
```

### Production Compose

```bash
docker compose -f infra/docker-compose.prod.yml up -d --build
```

Before production use, replace all Compose defaults, provide the required secrets, configure the public web/API URLs, and install TLS certificates referenced by the Nginx configuration.

## Environment variables

### API essentials

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection used by queues and workflows |
| `PORT` | API port, default `4000` |
| `JWT_SECRET` | JWT signing secret |
| `JWT_ISSUER` / `JWT_AUDIENCE` | JWT validation boundaries |
| `COOKIE_SECRET` | Cookie signing secret |
| `ENCRYPTION_KEY` | 32-byte hex/base64 key for AES-256-GCM protected credentials and tokens |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `TENANT_CODE` | Selects the school tenant for the deployment |
| `FORM_LINK_SECRET` | Signs public application-form links |
| `INTEGRATION_HASH_PEPPER` | Pepper used for external API-key hashing |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | API rate limits |
| `REQUEST_BODY_LIMIT` | JSON/form limit; defaults to `30mb` for scan uploads |
| `LOG_LEVEL` | API logging level |

### OAuth and portals

| Variable | Purpose |
| --- | --- |
| `OAUTH_CALLBACK_BASE_URL` | Base callback URL, e.g. `https://api.school.example/auth/oauth` |
| `WEB_URL` | Browser redirect target after provider sign-in |
| `OCR_SERVICE_URL` | Optional self-hosted OCR endpoint for Teacher Assistant |

### Communication and services

- `EMAIL_IMAP_*` and `EMAIL_SMTP_*` configure traditional mail integration.
- Microsoft Graph and Gmail provider details are stored through the encrypted integration UI.
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` enable web push.
- `PAYFAST_*` and `OZOW_*` configure payment integrations.
- `S3_*` values reserve external object-storage configuration.

### Web

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Browser-visible API base URL; defaults to `http://localhost:4000` |
| `VITE_VAPID_PUBLIC_KEY` | Browser push public key |

## Useful commands

```bash
npm run build
npm run typecheck
npm run lint
npm --workspace apps/web run typecheck
npm --workspace apps/api run build
npm --workspace apps/api run prisma:generate
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
npm --workspace apps/api run prisma:seed
```

Make targets are also available:

```bash
make dev-up
make dev-down
make migrate
make seed
```

`make dev-up` follows `infra/docker-compose.dev.yml` and currently starts PostgreSQL only. Use `infra/docker-compose.redis.yml` when the full PostgreSQL-and-Redis development stack is required.

## Principal API groups

| Prefix | Area |
| --- | --- |
| `/auth` | Email login/signup, current user, provider discovery and OAuth callbacks |
| `/students` | Students, imports, grades, classes, subjects, teachers and guardian links |
| `/hostel` | Hostel dashboard, setup, applications, allocations, attendance, meals, incidents, maintenance, visitors, billing, notices and reports |
| `/parent/children/:id/hostel` | Permission-gated child hostel details, applications and parent concerns |
| `/parent` | Child-scoped parent data and account-owned records |
| `/teacher` | Teacher workbench, classes, work items, attendance and communication |
| `/teacher-assistant` | Assessments, scripts, extraction, marking, review, approval, publishing and analytics |
| `/applications` | Admissions forms, submissions and approval conversion |
| `/store` and `/api/v1/store` | Store management, checkout, orders and catalog APIs |
| `/inventory` | Inventory master data, movements, requests, transfers, counts and reports |
| `/tickets` and `/requisitions` | Tickets, requisitions, purchase orders and delivery |
| `/identity` | Microsoft, Google and Apple configuration, role mappings and sync state |
| `/integrations` | External website/API integration management |
| `/settings` | Enterprise settings persistence |
| `/audit` | Paginated audit log |
| `/health` | Liveness and process metrics |

## Security notes

- Never commit `.env` files, provider secrets, encryption keys, JWT secrets, payment credentials, or mailbox credentials.
- OAuth tokens and provider credentials are encrypted at rest; mailbox passwords are not used for Microsoft/Google integrations.
- Public parent signup never grants student access.
- All student, guardian, teacher, store, inventory, and assessment mutations should remain permission guarded and audit logged.
- The development database credentials and seed password are intentionally unsuitable for production.
- Review dependency audit findings and upgrade intentionally before a public deployment.

## Current deployment model

The application is currently designed as one school tenant per deployment. Most operational records carry a `tenantId`, allowing future multi-school hosting, but runtime configuration and default-tenant resolution assume one selected school instance.
