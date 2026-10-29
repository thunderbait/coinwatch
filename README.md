# coinwatch

A personal budgeting app: log what you spend, see it by category against monthly budgets, and (coming next) keep track of upcoming expenses so none are forgotten.

Built with Next.js 16, Supabase (database and email sign-in) and Tailwind. Amounts are in euros.

## Run it locally

You need Node 22 and Docker.

```bash
npm install
npx supabase start -x studio,imgproxy,edge-runtime,logflare,vector,realtime,storage-api,postgres-meta,supavisor
cp .env.example .env.local   # then paste the local URL and publishable key that `supabase start` printed
npm run dev
```

Sign in at http://localhost:3000 with the address in `ALLOWED_EMAIL`. Local sign-in emails land in Mailpit at http://127.0.0.1:54324.

## Database

Migrations live in `supabase/migrations`. Every table has row level security so each user only sees their own rows, and new users get a starter set of categories.

## Only one person can sign in

The login form only sends a link to `ALLOWED_EMAIL`. For the hosted project, also turn off new sign-ups in Supabase (Authentication > Sign In / Providers) once your account exists.
