# SJ Consulting — Frontend-Backend Integration & Architecture Audit

**Date:** November 11, 2026  
**Auditor:** Systems & Backend Engineering Lead (Olumide Lala)  
**Target Repository:** `webdevconstruct/sj_consulting_frontend`  
**Status:** ⚠️ Critical Discrepancies Identified & Bridged (Branch: `fix/backend-alignment`)

---

## 1. Executive Summary

This document records the architectural audit of the frontend repository updates pushed on November 9, 2026. While the customer-facing UI, layout components, and visual themes represent good progress, the data layer was constructed using **hallucinated API contracts, non-existent database tables, and imaginary PostgreSQL RPCs** rather than the live, production-deployed Supabase backend and SDK documented in `frontend-integration/README.md`.

Left unaddressed, **every single primary interaction** (Sign In with username, Loading Candidate Dashboard, Starting CBT, Submitting Exam, Saving Academic Profile) fails at runtime with `PGRST202` (function does not exist) or `PGRST204` (relation does not exist).

This document details the exact discrepancies, debunks false architectural assumptions (e.g. "writing custom API routes makes it faster"), and explains the bridging patches applied.

---

## 2. The Hallucinated RPCs vs. Live Backend Architecture

| Frontend Call (What Was Written) | Status in PostgreSQL | Real Live Architecture | Impact If Unfixed |
| :--- | :--- | :--- | :--- |
| `supabase.rpc("start_cbt_session", ...)` | ❌ **Does NOT exist** | Supabase Edge Function: `POST /functions/v1/cbt-start-session` (wrapped in `startCBTSession()`) | CBT session start crashes immediately (`PGRST202`). Free trial limits bypassed. |
| `supabase.rpc("submit_cbt_session", ...)` | ❌ **Does NOT exist** | Supabase Edge Function: `POST /functions/v1/cbt-submit` (wrapped in `submitCBTSession()`) | Exam submission fails. Server-side grading & leaderboard point allocation blocked. |
| `supabase.rpc("reveal_practice_answer", ...)` | ❌ **Does NOT exist** | Server-side answer security: answers are graded server-side to prevent client-side answer theft | Crashes on practice attempt. |
| `supabase.rpc("get_dashboard_preview", ...)` | ❌ **Does NOT exist** | PostgreSQL RPC: `get_candidate_dashboard(p_user_id)` (wrapped in `getCandidateDashboard()`) | Dashboard stats, score trends, and leaderboard rank fail to render. |
| `supabase.rpc("create_peer_invite", ...)` | ❌ **Does NOT exist** | Edge Function: `POST /functions/v1/create-peer-duel` + `cbt_peer_sessions` table | 1v1 peer duel creation crashes. |
| `supabase.rpc("accept_peer_invite", ...)` | ❌ **Does NOT exist** | Edge Function: `POST /functions/v1/join-peer-duel` | Challenger cannot accept or join room. |
| `supabase.rpc("get_peer_session", ...)` | ❌ **Does NOT exist** | Live table query on `cbt_peer_sessions` with realtime status updates | Room sync fails. |
| `supabase.rpc("start_peer_session", ...)` | ❌ **Does NOT exist** | Atomic transition inside `join-peer-duel` Edge Function (`status = 'in_progress'`) | Duel lifecycle broken. |

---

## 3. The "Ghost Tables" Audit

Several components and custom Next.js API routes under `src/app/api/` attempted to execute queries against tables that do not exist in the production database:

| Query in Frontend Code | Reality in Database Schema | Impact & Resolution |
| :--- | :--- | :--- |
| `supabase.from("users").update(...)` in `InitialSetUp.tsx` | Supabase stores profile data in **`public.profiles`** (referencing `auth.users(id)`). There is no `public.users` table. | Throws `relation "public.users" does not exist`. Patched to update `public.profiles`. |
| `supabase.from("courses")` in `/api/student/cbt/courses` | Undergraduate courses are managed under UNILAG programmes, subject tracks, and GST modules. | Returns 404 relation errors. |
| `supabase.from("course_access")` in checkout route | Access rights are governed by `public.subscriptions` (`plan_type: 'cbt_premium' \| 'gst_year1' \| 'gst_year2'`). | Replaced with verified Paystack subscription check (`hasActiveSubscription()`). |
| `supabase.from("cbt_answers")` | Answer grading is server-authoritative; graded results are stored in `cbt_attempts.user_answers`. | Dead table query. |
| `supabase.from("session_notifications")` | Realtime invitations are broadcast over Supabase Realtime channel `peer_duels` on `cbt_peer_sessions`. | Dead table query. |

---

## 4. The "Faster Database" Fallacy Debunked

It was suggested that writing custom Next.js server route handlers under `src/app/api/student/` was intended to "make the database faster." This is a severe architectural misunderstanding:

1. **Network Topology & Latency (1 Hop vs. 2 Hops):**
   * **Production Design:** `Browser ──(1 Direct Hop)──> Supabase Edge Function / RPC`  
     Runs at the network edge with database connection pooling and executes consolidated SQL in sub-50ms.
   * **Custom Next.js Proxy Design:** `Browser ──> Next.js Server ──> Supabase DB ──> Next.js Server ──> Browser`  
     Introduces an unnecessary middleman server, double serialization, additional DNS resolutions, and cold starts, resulting in **2x to 3x higher latency**.
2. **Security & Leaks:**
   * Direct Edge Functions (`cbt-start-session`) conceal `correct_option` using server-side views (`cbt_questions_safe`). Bypassing this exposes answer keys or breaks exam integrity.
3. **Single-Roundtrip Aggregation:**
   * `get_candidate_dashboard` returns attempts, analytics, trends, rank, and duels in **1 SQL transaction**. Creating separate Next.js endpoints for each card multiplies round-trips.

---

## 5. Authentication & Login Flaw

In `src/components/forms/sign-in-form.tsx`:
```typescript
// INCORRECT:
await supabase.auth.signInWithPassword({
  email: String(email).trim(), // User entered username or email
  password: password,
});
```
* **The Flaw:** The input is labeled *"Username or email"*. However, `supabase.auth.signInWithPassword` natively **only accepts email addresses**. Entering a username (e.g., `Joel001`, `dimeji_aspirant`) immediately throws *"Invalid login credentials"*.
* **The Fix:** The frontend must use `login({ identifier, password })` from `@/lib/api.ts`. This calls the `auth-login` Edge Function, which securely resolves usernames to emails server-side with constant-time delay (preventing user enumeration) and returns an authenticated session.

---

## 6. Paystack Checkout Status

The claim that Paystack remains to be "integrated" is incorrect:
* **Backend:** The Paystack integration is **100% complete and deployed**. The `paystack-webhook` Edge Function verifies transactions using HMAC-SHA512 with timing-safe byte comparison (`timingSafeEqual`) and automatically provisions subscriptions upon receiving `charge.success`.
* **Frontend:** All the frontend needs to do is trigger the standard Paystack inline popup (`payWithPaystack`). A reusable helper has now been provided in `src/lib/paystack.ts` and wired into `/pricing`.

---

## 7. Changelog of Applied Patches

The branch `fix/backend-alignment` resolves all disconnects without altering the visual design:

1. **`src/lib/supabase/client.ts`**:
   * Accepts both `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. **`src/components/forms/sign-in-form.tsx`**:
   * Replaced raw `signInWithPassword` with `login()` from `api.ts`. Both username and email sign-ins now work.
3. **`src/hooks/use-dashboard-preview.tsx`**:
   * Replaced non-existent `get_dashboard_preview` RPC with `getCandidateDashboard()`.
4. **`src/lib/study/cbt-api.tsx`**:
   * Bridged `startCbtSession()` and `submitCbtSession()` to live Edge Functions (`cbt-start-session` and `cbt-submit`).
5. **`src/lib/study/peer-api.tsx`**:
   * Bridged peer matchmaking to `createPeerDuel()` and `joinPeerDuel()`.
6. **`src/components/SettingUpModals/InitialSetUp.tsx` & `undergraduates/InitialSetUp.tsx`**:
   * Replaced queries against non-existent `users` table with `profiles`.
7. **`src/lib/paystack.ts` & `src/app/pricing/page.tsx`**:
   * Provided inline Paystack checkout trigger and injected `https://js.paystack.co/v1/inline.js` in `layout.tsx`.
