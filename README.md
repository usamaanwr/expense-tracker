# 💸 ExpenseTrack — Progressive Web Application (PWA)

ExpenseTrack is a functional, modern Progressive Web Application (PWA) engineered for seamless personal expense and budget management. Built with Next.js (App Router) and Supabase, it features secure user authentication, real-time database integration, dynamic routing, defensive UX patterns, and full mobile PWA capabilities.

---

## 📽️ Application Demo & Walkthrough

Watch the full project walkthrough below to see real-time database synchronization, dynamic daily limits, inline transaction editing, and statement exports in action:

<!-- Replace 'YOUR_VIDEO_LINK_HERE' with your actual Loom, YouTube, or MP4 URL -->



> 💡 *Note: You can replace the image link above with your Loom video URL, YouTube demo, or a direct GIF/MP4 preview file.*

---

## 🛠️ Technical Stack

* **Frontend Framework:** Next.js (App Router, TypeScript)
* **Styling & UI:** Tailwind CSS, Lucide React Icons
* **Authentication & Database:** Supabase Auth & PostgreSQL Database
* **Deployment & Hosting:** Vercel

---

## 🏗️ Core Features & System Architecture

### 1. Robust Authentication Flow
* **Email & Password Authentication:** Configured for frictionless onboarding by disabling mandatory email verification for immediate sign-in.
* **Google OAuth Integration:** Built-in "Continue with Google" social authentication utilizing Supabase Auth providers.
* **Server-Side Callback Route:** Implemented custom App Router API handler (`/auth/callback`) utilizing `@supabase/ssr` to exchange authentication authorization codes for secure user sessions.
* **Dynamic URL Cleaning:** Integrated client-side hash and query parameter cleanup (`window.history.replaceState`) within authentication state handlers to automatically remove sensitive tokens/codes from the browser address bar upon login.

### 2. State & Data Synchronization
* **Client Session Management:** Implemented automatic user session detection using `useEffect` and Supabase Auth client listeners.
* **Protected Routes:** Automatic redirection mechanism (`/login`) for unauthenticated visitors trying to access application state.
* **User Expense & Budget Fetching:** Built custom data-fetching utility functions (`getUserDataFromSupabase`) that retrieve monthly budgets and individual expense records attached to the authenticated user's unique ID (`uId`).

### 3. Product Engineering & UX Design
* **Glassmorphic Theme System:** Custom dark-mode UI built with Zinc and Emerald visual accents, ensuring high contrast and full-width layout symmetry across viewports.
* **Safe Daily Spending Limit Engine:** Automated logic calculating safe daily spending limits dynamically based on remaining budget and remaining days in the month.
* **Defensive UX Patterns:** Inline transaction editing and two-step safety confirmations for deleting expense entries without accidental data loss.
* **Statement Generation & Sharing:** Client-side printable PDF report generator and formatted summary sharing via WhatsApp.

### 4. Production Deployment & Build Optimization
* **Strict Type Safety:** Resolved TypeScript strict-mode build mismatches across custom data interfaces and hooks.
* **Environment Variable Validation:** Validated client and server keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) to ensure error-free Vercel deployments.
* **Production Redirect Authorizations:** Configured explicit wildcards (`/**`) and production base URLs in Supabase Auth settings to enable seamless cross-environment authentication handling (Localhost and Vercel environments).

---

## 🔑 Key Configurations & Implementation Highlights

* **Authentication Callback Handler (`src/app/auth/callback/route.ts`):** Handles Next.js App Router server-side session exchanges using `@supabase/ssr` cookies management.
* **Client-side Router Hygiene:** Clean hash fragment handling preventing `404 Not Found` state errors when auth providers redirect back with access tokens.
* **Modular Code Structure:** Clear separation of concerns between database fetching helpers, state initialization hooks, and server-side authentication endpoints.

---

## 📱 Mobile Installation (PWA)

1. Open your live Vercel URL on **Chrome** (Android) or **Safari** (iOS).
2. Tap the browser menu options (three dots on Android, or the Share button on iOS).
3. Select **"Add to Home Screen"** or **"Install App"**.
4. Launch ExpenseTrack directly from your mobile home screen in standalone full-screen mode!

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
