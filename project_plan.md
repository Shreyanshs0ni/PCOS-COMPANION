# PCOS Companion: Comprehensive Project Plan

Based on `requirement.md` and `design.md`, here is the complete end-to-end building plan for the application.

## 1. Product Vision & Architecture
- **Goal:** A mobile-first AI health companion for women with PCOS, offering non-medical, supportive wellness advice based on daily logging.
- **Tech Stack:** Next.js (App Router), Tailwind CSS (styling), Clerk (Auth), Supabase PostgreSQL (Database/Backend), OpenAI API (AI logic).
- **Architecture Flow:** Client (Next.js) -> Next.js API Routes (Secure) -> OpenAI & Supabase.

## 2. Database Schema (Supabase)
1. **profiles**: `id` (Clerk User ID), `name`, `age`, `weight`, `pcos` (boolean), `created_at`.
2. **logs**: `id`, `user_id` (FOREIGN KEY), `sleep`, `water`, `exercise`, `created_at` (Date). (Unique constraint on `user_id + created_at` to ensure 1 log per day).
3. **symptoms**: `id`, `user_id`, `type`, `severity` (1-5), `created_at`.
4. **cycles**: `id`, `user_id`, `start_date`, `end_date`.

## 3. Implementation Phases

### ✅ Phase 1: Foundation Setup (Completed)
- [x] Initialized Next.js project.
- [x] Configured environment and installed dependencies (`@clerk/nextjs`, `@supabase/supabase-js`, `openai`, `lucide-react`, `date-fns`).
- [x] Set up base global layout with a `max-w-md` mobile container constraint to enforce the mobile-first directive.

### ✅ Phase 2: Auth and Schema Construction (Completed)
- [x] Integrated Clerk middleware.
- [x] Created `sign-in` and `sign-up` pages routing.
- [x] Drafted the `supabase/schema.sql` to initialize the database tables with Row Level Security (RLS) policies.
- [x] Implemented the Onboarding UI page to collect missing user data immediately post-signup.

### ✅ Phase 3: UI and Core Feature Logic (Completed)
- [x] Built global `BottomNav` tab bar (Dashboard, Log, Cycle).
- [x] Implemented the **Dashboard** UI (stat grid, stylized AI Insight card).
- [x] Implemented the **Log** UI (daily sleep, water, exercise, and symptoms logging forms).
- [x] Implemented the **Cycle** UI (ovulation prediction aesthetic card, date range forms).

### ⏳ Phase 4: API & Backend Integration (Pending)
- [ ] Implement Server Actions or API Routes to `INSERT`/`UPDATE` logs and symptoms to Supabase.
- [ ] Securely integrate the OpenAI API in `app/api/ai/route.js`.
- [ ] Connect the front-end fetch to populate real user tracking data into the Dashboard.
- [ ] **AI Prompt Constructing:** Fetch current log + historical logs, format it into the system prompt ("Act as a friendly coach..."), and limit to 10 requests per day per user.

### ⏳ Phase 5: Testing & Polish (Pending)
- [ ] Form validation (e.g., stopping users submitting incomplete forms or duplicate daily logs).
- [ ] Implement empty/loading states across screens.
- [ ] Perform a full UI/UX walkthrough entirely simulated on mobile mode.

---
**Status Note:** As established, Phase 1 through Phase 3 UI development is largely completed! The scaffold is already live on your machine visually. The next major hurdle is integrating the backend API routes and Supabase insertions in Phase 4.
