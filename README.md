# POPIN LMS

Frontend prototype for a single-school learning and operations workspace.

The API workspace has been removed for now. This phase focuses on the React/Vite interface, local mock data, layout, and user flows. Backend/API work can be added back later as a new workspace.

## Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Radix Themes
- Recharts
- Framer Motion

## Run Locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

## Local Login

Authentication is local-only in this prototype.

```text
Email: admin@school.co.za
Password: Admin123!
```

Any non-empty email and password will create a temporary local session.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Project Shape

```text
apps/
  web/          React/Vite application
packages/
  shared/       Shared package placeholder
```

## Notes

- Data shown in the dashboard and modules is mocked locally.
- Branding is stored in local storage.
- API integration points can be reintroduced later once the backend direction is clear.
