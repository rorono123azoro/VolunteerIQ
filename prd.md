PRD.md — VolunteerIQ
Data-Driven Volunteer Coordination for Social Impact
Google Solution Challenge 2026 — Build with AI

0. HOW TO USE THIS FILE (READ FIRST)
This document is the single source of truth for building VolunteerIQ.
Read every section before writing any code. Do not skip sections.
Build features in the exact order defined in Section 11 (Build Order).
Every screen, database collection, API route, and workflow is fully specified.
When in doubt, refer back to this file — do not make assumptions.

1. PROJECT IDENTITY
Product Name   : VolunteerIQ
Tagline        : Match. Coordinate. Impact.
Type           : Full-stack web application (SPA)
Hackathon      : Google Solution Challenge 2026 — Build with AI
SDG Alignment  : SDG 17 (Partnerships) · SDG 10 (Reduced Inequalities)
Version        : 1.0 MVP

2. TECH STACK (NON-NEGOTIABLE)
Use exactly these technologies. Do not substitute any of them.
Frontend
Framework      : React.js 18 + Vite
Language       : JavaScript (JSX) — no TypeScript in MVP
Styling        : Plain CSS + CSS Variables (no Tailwind, no MUI, no styled-components)
Routing        : React Router v6
State          : React Context API + useState/useEffect (no Redux)
Charts         : Recharts (npm install recharts)
Maps           : Google Maps JavaScript API (@react-google-maps/api)
HTTP Client    : fetch() native — no axios
Backend
Framework      : FastAPI (Python 3.11)
Deployment     : Google Cloud Run (containerized via Dockerfile)
Language       : Python 3.11
AI SDK         : google-generativeai (pip install google-generativeai)
Firebase Admin : firebase-admin (pip install firebase-admin)
Math           : numpy (for cosine similarity)
Firebase (ALL data lives here)
Authentication : Firebase Auth — Google Sign-In only
Database 1     : Cloud Firestore — all persistent data
Database 2     : Firebase Realtime Database — live event presence only
Storage        : Firebase Storage — logos and exports
Hosting        : Firebase Hosting — serves the React SPA
Functions      : Firebase Cloud Functions (Node.js 18) — background triggers
Notifications  : Firebase Cloud Messaging (FCM) — push alerts
Google APIs
AI Model 1     : gemini-2.0-flash — text generation (impact reports, skill suggestions)
AI Model 2     : text-embedding-004 — vector embeddings (skill matching)
Maps           : Google Maps JavaScript API + Geocoding API
Project Files Required
/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── .env.local
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── main.py
│   ├── routers/
│   │   ├── match.py
│   │   ├── reports.py
│   │   └── notify.py
│   ├── services/
│   │   ├── gemini.py
│   │   └── firestore.py
│   ├── Dockerfile
│   └── requirements.txt
├── functions/
│   ├── index.js
│   └── package.json
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
└── .firebaserc

3. DESIGN SYSTEM (IMPLEMENT EXACTLY AS SPECIFIED)
3.1 Philosophy
The UI must feel minimalistic and classic simultaneously.
Minimalistic = no decorations, generous whitespace, one thing per screen area.
Classic = standard nav patterns, card-based layout, familiar form conventions.
No gradients. No shadows heavier than 0 1px 3px rgba(0,0,0,0.08).
No animations except subtle 150ms transitions on hover/focus.
No illustration libraries. No icon packs beyond a single SVG set.
3.2 CSS Variables — Define in /src/styles/variables.css
css:root {
  --color-primary:       #1B2A4A;
  --color-accent:        #2D6A4F;
  --color-bg:            #FFFFFF;
  --color-surface:       #F7F7F5;
  --color-surface-alt:   #F0F0EE;
  --color-border:        #E2E2DF;
  --color-border-strong: #C8C8C4;
  --color-text:          #1A1A1A;
  --color-text-muted:    #5A5A5A;
  --color-text-subtle:   #8A8A8A;
  --color-danger:        #C0392B;
  --color-warning:       #C87941;
  --color-success:       #2D6A4F;
  --color-info:          #1B5E8A;
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --radius-sm: 4px;  --radius-md: 6px;  --radius-lg: 10px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.07);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.09);
}
3.3 Typography — global.css
css*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-sans); font-size: 14px; color: var(--color-text); background: var(--color-bg); line-height: 1.6; -webkit-font-smoothing: antialiased; }
h1 { font-size: 26px; font-weight: 700; color: var(--color-primary); }
h2 { font-size: 20px; font-weight: 600; color: var(--color-primary); }
h3 { font-size: 16px; font-weight: 600; color: var(--color-text); }
h4 { font-size: 14px; font-weight: 600; color: var(--color-text); }
p  { font-size: 14px; color: var(--color-text-muted); line-height: 1.7; }
.label { font-size: 12px; font-weight: 500; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em; }
3.4 Components to Build in /src/components/
Button.jsx
Variants: primary | secondary | ghost | danger
Sizes: sm (32px) | md (38px) | lg (44px)
primary   → bg: var(--color-primary), color: white
secondary → bg: white, color: var(--color-primary), border: 1px solid var(--color-primary)
ghost     → bg: transparent, color: var(--color-text-muted), border: 1px solid var(--color-border)
danger    → bg: var(--color-danger), color: white
Hover: opacity 0.88, transition 150ms. Disabled: opacity 0.45, cursor not-allowed.
Card.jsx
bg: var(--color-bg), border: 1px solid var(--color-border)
border-radius: var(--radius-lg), padding: var(--space-6)
box-shadow: var(--shadow-sm)
Prop: hoverable → adds subtle lift on hover
Badge.jsx
Variants: default | success | warning | danger | info
font-size 11px, font-weight 600, padding 2px 8px, border-radius var(--radius-sm)
default → bg #F0F0EE, color var(--color-text-muted)
success → bg #E8F5EE, color #1E6640
warning → bg #FDF2E6, color #A05C1A
danger  → bg #FCECEA, color #9B2C1E
info    → bg #E6EEF5, color #1B4A6B
Input.jsx
height 38px, border 1px solid var(--color-border), border-radius var(--radius-md)
padding 0 var(--space-3), background var(--color-surface), font-size 14px
Focus: border-color var(--color-primary), outline 2px solid rgba(27,42,74,0.12)
Error: border-color var(--color-danger)
Always pair with a label element above. Never use placeholder as the only label.
MatchScoreBadge.jsx
Props: score (number 0–100)
Display: "{score}% match"
80–100 → success (green) | 60–79 → info (blue) | 40–59 → warning (amber) | 0–39 → default (gray)
Position: absolute top-right corner on opportunity cards
Sidebar.jsx
width 240px, position fixed left 0 top 0, height 100vh
background var(--color-primary), padding-top var(--space-8)
Nav item: font-size 14px, color rgba(255,255,255,0.75)
Active: color white, bg rgba(255,255,255,0.12), border-radius var(--radius-md)
Hover: bg rgba(255,255,255,0.07)
Bottom: user avatar + displayName + logout
StatCard.jsx
Props: label, value, unit
bg var(--color-surface), border 1px solid var(--color-border)
border-radius var(--radius-lg), padding var(--space-5) var(--space-6)
value: 28px, font-weight 700, color var(--color-primary)
label: .label class
Used in 4-column grid on dashboards
SkillTag.jsx
Props: skill (string), matched (bool)
matched=true  → border 1px solid #2D6A4F, bg #E8F5EE, color #1E6640
matched=false → border 1px solid var(--color-border), bg var(--color-surface), color muted
font-size 12px, padding 3px 10px, border-radius 20px
PageLayout.jsx
Renders Sidebar on left.
Main content area: margin-left 240px, padding var(--space-8), max-width 1200px

4. FIREBASE SETUP
/src/services/firebase.js
javascriptimport { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
export const auth           = getAuth(app);
export const db             = getFirestore(app);
export const rtdb           = getDatabase(app);
export const storage        = getStorage(app);
export const messaging      = getMessaging(app);
export const googleProvider = new GoogleAuthProvider();
.env.local
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
VITE_MAPS_API_KEY=
VITE_BACKEND_URL=https://your-cloud-run-url

5. DATABASE SCHEMA — CLOUD FIRESTORE
Collection: users  (Document ID = Firebase Auth UID)
uid              : string       — same as doc ID
email            : string
displayName      : string
photoURL         : string
role             : string       — ENUM: "volunteer" | "coordinator" | "admin"
organizationId   : string|null
city             : string
location         : GeoPoint     — { latitude, longitude }
skills           : string[]     — ["Teaching","First Aid","Python"]
skillEmbedding   : number[]     — 768-dim Gemini embedding
availability     : object       — { mon:["09:00-12:00"], tue:[], ... }
bio              : string       — max 300 chars
totalHours       : number
eventsAttended   : number
fcmToken         : string
onboardingDone   : boolean
createdAt        : Timestamp
updatedAt        : Timestamp
isActive         : boolean
Collection: organizations  (Document ID = auto)
orgId            : string
name             : string
description      : string       — max 500 chars
logoURL          : string
city             : string
location         : GeoPoint
website          : string
sdgFocus         : string[]     — ["10","17"]
coordinatorIds   : string[]
totalVolunteers  : number
totalHoursLogged : number
isVerified       : boolean
createdAt        : Timestamp
updatedAt        : Timestamp
Collection: opportunities  (Document ID = auto)
opportunityId       : string
orgId               : string
createdBy           : string
title               : string    — max 80 chars
description         : string    — max 1000 chars
category            : string    — ENUM: "education"|"health"|"environment"|"community"|"tech"|"other"
requiredSkills      : string[]
skillEmbedding      : number[]  — Gemini embedding
location            : GeoPoint
address             : string
city                : string
eventDate           : Timestamp
durationHours       : number
volunteersNeeded    : number
volunteersRegistered: number    — denormalized; auto-updated
status              : string    — ENUM: "open"|"full"|"completed"|"cancelled"
beneficiariesTarget : number
createdAt           : Timestamp
updatedAt           : Timestamp
Collection: applications  (Document ID = auto)
applicationId : string
opportunityId : string
volunteerId   : string
orgId         : string
matchScore    : number      — float 0.0–1.0
status        : string      — ENUM: "pending"|"accepted"|"rejected"|"withdrawn"
notes         : string
appliedAt     : Timestamp
reviewedAt    : Timestamp|null
reviewedBy    : string|null
Collection: events  (Document ID = auto)
eventId             : string
opportunityId       : string
orgId               : string
confirmedVolunteers : string[]
checkInCode         : string    — 4-digit
startTime           : Timestamp
endTime             : Timestamp
status              : string    — ENUM: "upcoming"|"active"|"completed"
hoursLogged         : object    — { [volunteerId]: number }
createdAt           : Timestamp
Collection: attendance  (Document ID = auto)
attendanceId        : string
eventId             : string
volunteerId         : string
status              : string    — ENUM: "registered"|"checked_in"|"completed"|"no_show"
checkInTime         : Timestamp|null
checkOutTime        : Timestamp|null
hoursLogged         : number    — checkOut - checkIn in hours
coordinatorVerified : boolean
createdAt           : Timestamp
Collection: impact_reports  (Document ID = auto)
reportId             : string
orgId                : string
generatedBy          : string
dateRangeStart       : Timestamp
dateRangeEnd         : Timestamp
totalVolunteers      : number
totalHours           : number
eventsCount          : number
beneficiariesReached : number
categoryBreakdown    : object   — { education:120, health:80, ... }
geminiNarrative      : string   — AI paragraph
createdAt            : Timestamp
Collection: badges  (Document ID = badge slug)
slug        : string   — e.g. "first_volunteer"
name        : string   — e.g. "First Step"
description : string
icon        : string   — emoji
condition   : string
Seed documents:
first_volunteer → "First Step"     → eventsAttended >= 1
ten_hours       → "Ten Hour Hero"  → totalHours >= 10
fifty_hours     → "Half Century"   → totalHours >= 50
team_player     → "Team Player"    → eventsAttended >= 5
Collection: user_badges  (Document ID = auto)
userBadgeId : string
userId      : string
badgeSlug   : string
earnedAt    : Timestamp
Firebase Realtime Database (NOT Firestore — ephemeral live data only)
/live_events/{eventId}/volunteers/{volunteerId}/
  status    : "checked_in" | "checked_out"
  lastSeen  : number (Unix ms)
  name      : string
  photoURL  : string
Firestore Composite Indexes — firestore.indexes.json
json{
  "indexes": [
    {
      "collectionGroup": "opportunities",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath":"city",      "order":"ASCENDING"},
        {"fieldPath":"status",    "order":"ASCENDING"},
        {"fieldPath":"eventDate", "order":"ASCENDING"}
      ]
    },
    {
      "collectionGroup": "applications",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath":"orgId",    "order":"ASCENDING"},
        {"fieldPath":"status",   "order":"ASCENDING"},
        {"fieldPath":"appliedAt","order":"DESCENDING"}
      ]
    },
    {
      "collectionGroup": "attendance",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath":"eventId",    "order":"ASCENDING"},
        {"fieldPath":"volunteerId","order":"ASCENDING"}
      ]
    }
  ]
}
Firestore Security Rules — firestore.rules
javascriptrules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuth()        { return request.auth != null; }
    function isOwner(uid)    { return request.auth.uid == uid; }
    function getRole()       { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role; }
    function isCoordinator() { return getRole() == 'coordinator'; }
    function isAdmin()       { return getRole() == 'admin'; }
    function sameOrg(orgId)  { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organizationId == orgId; }

    match /users/{userId} {
      allow read:   if isAuth();
      allow create: if isAuth() && isOwner(userId);
      allow update: if isAuth() && (isOwner(userId) || isAdmin());
    }
    match /organizations/{orgId} {
      allow read:   if isAuth();
      allow create: if isAuth() && isCoordinator();
      allow update: if isAuth() && (sameOrg(orgId) || isAdmin());
    }
    match /opportunities/{oppId} {
      allow read:   if isAuth();
      allow create: if isAuth() && isCoordinator();
      allow update: if isAuth() && (isCoordinator() || isAdmin());
    }
    match /applications/{appId} {
      allow read:   if isAuth() && (resource.data.volunteerId == request.auth.uid || isCoordinator());
      allow create: if isAuth();
      allow update: if isAuth() && (isCoordinator() || isAdmin());
    }
    match /events/{eventId} {
      allow read:  if isAuth();
      allow write: if isAuth() && (isCoordinator() || isAdmin());
    }
    match /attendance/{attId} {
      allow read:   if isAuth() && (resource.data.volunteerId == request.auth.uid || isCoordinator());
      allow create: if isAuth();
      allow update: if isAuth() && (isCoordinator() || isAdmin());
    }
    match /impact_reports/{reportId} {
      allow read:   if isAuth() && (sameOrg(resource.data.orgId) || isAdmin());
      allow create: if isAuth() && isCoordinator();
    }
    match /badges/{badgeId}     { allow read: if isAuth(); }
    match /user_badges/{ubId}   { allow read: if isAuth() && resource.data.userId == request.auth.uid; allow create: if isAdmin(); }
  }
}

6. AUTHENTICATION FLOW
AuthContext — /src/context/AuthContext.jsx
Expose: { user, userDoc, loading, signInWithGoogle, signOut }
user    → Firebase Auth user object
userDoc → Firestore /users/{uid} document
loading → true while resolving

On signInWithGoogle():
  1. signInWithPopup(auth, googleProvider)
  2. Check if /users/{uid} exists in Firestore
  3. If NOT: create doc with role=null, onboardingDone=false
  4. Redirect to /onboarding if onboardingDone=false
  5. Redirect to /dashboard if onboardingDone=true and role=volunteer
  6. Redirect to /coordinator if onboardingDone=true and role=coordinator
Routes
/               → redirect (not auth → /login, auth → /dashboard or /coordinator)
/login          → LoginPage (public)
/onboarding     → OnboardingPage (auth, redirect away if onboardingDone=true)
/dashboard      → VolunteerDashboard (auth, role=volunteer)
/opportunities  → OpportunityFeed (auth, role=volunteer)
/opportunities/:id → OpportunityDetail (auth)
/history        → VolunteerHistory (auth, role=volunteer)
/badges         → BadgesPage (auth, role=volunteer)
/profile        → ProfilePage (auth)
/coordinator              → CoordinatorDashboard (auth, role=coordinator)
/coordinator/volunteers   → VolunteerRoster (auth, role=coordinator)
/coordinator/events       → EventManagement (auth, role=coordinator)
/coordinator/reports      → ImpactReports (auth, role=coordinator)
/coordinator/post         → PostOpportunity (auth, role=coordinator)

7. SCREENS — COMPLETE SPECIFICATION

SCREEN 1: LoginPage (/login)
Layout: split screen. Left 40% navy (#1B2A4A). Right 60% white.

LEFT PANEL:
  - "VolunteerIQ" wordmark (white, 32px bold) top-left padding 32px
  - Centered vertically:
      "Match. Coordinate. Impact." (white, 20px, weight 400)
      gap 40px
      Three stats stacked:
        "1B+" (28px bold white) + "Volunteers Globally" (13px white)
        "40%" (28px bold) + "Average Dropout Rate"
        "0"   (28px bold) + "Data-Driven Platforms for NGOs"

RIGHT PANEL:
  - Centered vertically and horizontally, max-width 360px
  - "Welcome back" (h2, navy)
  - "Sign in to coordinate, volunteer, and measure your impact." (p, muted)
  - Gap 32px
  - "Continue with Google" button:
      white bg, 1px border #E2E2DF, height 44px, full-width
      Google SVG logo left, text centered
      On click: signInWithGoogle()
  - "By continuing, you agree to our Terms of Service." (12px, #8A8A8A)

Behavior:
  Already authenticated → redirect /dashboard
  Loading → spinner inside button
  Error → inline red text below button

SCREEN 2: OnboardingPage (/onboarding)
Layout: centered single column, max-width 560px, padding 48px 24px

Step indicator: three dots top of form.
Filled circle = complete. Empty = pending.
Label: "Step {n} of 3 — {Step Name}"

STEP 1 — Personal Details:
  Full Name*    → text input (pre-filled from Google, editable)
  City*         → text input
  Phone*        → tel input
  Bio           → textarea, max 300 chars, rows=3
  Role selector → two large cards side by side:
    "I want to Volunteer"   → role="volunteer"
    "I represent an NGO"    → role="coordinator"
    Selected: border 2px solid var(--color-primary), bg #EEF1F6

STEP 2 — Skills (volunteer) / NGO Info (coordinator):

  If volunteer:
    Label: "What are your skills?"
    Text input with Gemini autocomplete:
      Debounce 400ms → GET /api/suggestions?q={text}
      Show 5-item dropdown
      Select → add SkillTag below input
      Press Enter → add typed text as tag
      Tag has × to remove. Max 15 skills.

  If coordinator:
    Organization Name* → text input
    Organization Type* → select: NGO | Trust | Foundation | Community Group
    Website            → url input
    SDG Focus          → checkboxes: SDG 3 | SDG 10 | SDG 11 | SDG 17
    Description*       → textarea, max 500 chars

STEP 3 — Availability (volunteer) / Confirm (coordinator):

  If volunteer:
    Weekly availability grid:
      Rows: Mon Tue Wed Thu Fri Sat Sun
      Columns: Morning (6–12) | Afternoon (12–18) | Evening (18–22)
      Click cell to toggle. Selected: navy bg, white text.
      Store as: { mon:["morning"], wed:["afternoon","evening"], ... }

  Both roles → Confirmation:
    Summary of entered info
    "Complete Setup" button (primary, full-width)
    On click:
      1. Write to /users/{uid}
      2. Set onboardingDone=true
      3. If coordinator: create /organizations doc, write orgId to user
      4. POST /api/embedding/skills → store embedding in user doc
      5. Redirect to /dashboard or /coordinator

SCREEN 3: VolunteerDashboard (/dashboard)
Layout: PageLayout (sidebar + main)

MAIN CONTENT:
  "Good morning, {displayName}" (h1)
  "Tuesday, April 28 · Delhi" (14px, muted)
  Gap 24px

  StatCard row (4 columns):
    Total Hours | Events Attended | Impact Score (totalHours×10 pts) | Badges Earned

  "Recommended for You" section:
    h2 + "Based on your skills" (muted inline right)
    5 OpportunityCard components sorted by matchScore descending
    "View All Opportunities →" text link

  "My Upcoming Events" section:
    Simple table: Event Name | Organization | Date | Status badge | Action ("Check In" if today)

VOLUNTEER SIDEBAR NAV:
  Home | Opportunities | My History | Badges | Profile

SCREEN 4: OpportunityFeed (/opportunities)
Layout: PageLayout. Inside main: left filter panel (240px) + right list (remaining width)

FILTER PANEL:
  "Filters" heading
  City input | Category checkboxes | Date range inputs | Min match % slider
  "Apply Filters" primary button | "Clear Filters" ghost button

OPPORTUNITY LIST:
  Sort dropdown: Best Match | Soonest | Most Needed
  Count: "Showing {n} opportunities"
  Vertical list of OpportunityCard
  "Load More" button at bottom

OpportunityCard:
  position: relative
  Organization name (12px, muted) + Category badge       ← top row
  Title h3 (16px)
  Description (first 120 chars + "...")
  SkillTag row: green if user has skill, gray if not. Max 4 + "+N more"
  Bottom row left:  📍 city · 📅 date · ⏱ duration
  Bottom row right: "View Details →" ghost button
  MatchScoreBadge: absolute top-right

SCREEN 5: OpportunityDetail (/opportunities/:id)
Layout: PageLayout. Main = two columns: left 65%, right 35%

LEFT COLUMN:
  Breadcrumb: Opportunities / {title}
  Org chip: logo placeholder + name + "Verified ✓"
  h1 title
  Meta: 📅 date · ⏱ {n}h · 👥 {n} spots left
  Category badge

  "About This Opportunity":
    Full description

  "Required Skills":
    SkillTag components (green=has it, gray=doesn't)
    "You match {n} of {total} skills" — green if ≥60%, amber if <60%

  "Location":
    Google Maps embed: height 240px, border-radius var(--radius-lg)
    Address text below

  "About the Organization":
    Logo + Name + Description + Website link + SDG badges

RIGHT COLUMN (sticky top:24px):
  Card:
    Match score: 32px bold success color "94% Match"
    Progress bar: width=matchScore%
    Gap 16px
    Skills checklist: ✓ green | ✗ gray + skill name per row
    Gap 16px
    Slots: "{n} of {total} remaining" + mini progress bar
    Gap 24px
    "Apply Now" primary button full-width 48px
      Applied → "Application Pending" badge
      Accepted → "You're Confirmed ✓" success color
      Full → "Fully Booked" disabled
    "Free to volunteer · No commitment fee" (12px, muted)

Apply behavior:
  1. Create /applications doc: status="pending", matchScore from computed value
  2. Increment opportunity.volunteersRegistered
  3. Toast: "Application submitted! You'll hear back soon."
  4. POST /api/notify/send to coordinator

SCREEN 6: CoordinatorDashboard (/coordinator)
Layout: PageLayout with coordinator sidebar

COORDINATOR SIDEBAR NAV:
  Overview | Volunteers | Events | Reports | Post Opportunity

MAIN CONTENT — tab bar: Overview | Volunteers | Events | Reports

TAB: Overview
  StatCards: Active Volunteers | Open Roles | Avg Attendance Rate | Events This Month

  Live Event Panel (only if active event today):
    "Live: {title}" + green pulsing dot
    Google Maps: volunteer pins for checked-in volunteers
    Table: Name | Status | Check-in Time | Action (Mark Complete)
    Data: Firebase RTDB onValue() at /live_events/{eventId}

  Recent Applications:
    Table: Volunteer Name | Opportunity | Match Score | Applied | Accept/Reject buttons

TAB: Volunteers
  Search input | City filter | Skill filter
  Table: Name+avatar | Skills (first 3) | Events | Hours | Last Active | View Profile

TAB: Events
  "Create New Event" button
  Table: Title | Date | Registered | Attended | Status | Manage button
  Manage expands: volunteer list + Send Reminder + Mark Complete buttons

TAB: Reports
  Date range picker (From / To, default current month)
  "Generate Report" primary button full-width
  On click: POST /api/report/generate → loading skeleton → render:
    4 large stat blocks: Total Hours | Volunteers | Events | Beneficiaries
    Recharts BarChart: X=category, Y=hours, bar color var(--color-primary)
    Gemini narrative in styled blockquote (left border accent color)
    "Export as PDF" button: window.print()
    "Share Report" button: copies public link

SCREEN 7: PostOpportunity (/coordinator/post)
Layout: PageLayout, centered form max-width 680px

FORM FIELDS:
  Opportunity Title*       → text input, max 80 chars + char counter
  Category*                → radio cards: Education|Health|Environment|Community|Tech|Other
  Description*             → textarea, max 1000 chars + char counter
  Required Skills*         → Gemini autocomplete skill tagger (same as onboarding)
  Event Date & Time*       → datetime-local input
  Duration (hours)*        → number input
  Volunteers Needed*       → number input
  Location*                → address text input + Google Maps Autocomplete
                             Map preview shows pin on selected location
  Beneficiaries Expected   → number input (optional)

ON SUBMIT:
  1. Validate all required fields
  2. Geocode address → GeoPoint via Google Geocoding API
  3. POST /api/match/opportunity → get skillEmbedding
  4. Write /opportunities doc with status="open"
  5. Toast: "Opportunity posted! Volunteers will start seeing it now."
  6. Redirect to /coordinator (Events tab)

SCREEN 8: ImpactReportView (print-ready layout)
Max-width 800px, centered, single column

Header row:
  Left: VolunteerIQ logo text + "Impact Report"
  Right: org name + date range

4 stat blocks (2×2 grid):
  Total Volunteer Hours | Volunteers Deployed | Events Completed | Beneficiaries Reached
  Each: number 40px navy bold, label uppercase muted below

Divider (1px border)

Gemini Narrative:
  blockquote: border-left 4px solid var(--color-accent)
  padding-left 20px, font-size 16px, line-height 1.8

Divider

Recharts BarChart:
  Title "Hours by Category"
  X=categories, Y=hours
  Bar color var(--color-primary)
  No gridlines except horizontal

Footer:
  "Generated by VolunteerIQ · Powered by Gemini + Firebase" (muted, centered)

Print CSS:
  @media print { .sidebar, button { display: none; } .main { margin-left: 0; } }

8. BACKEND API — FastAPI
All routes prefixed /api. All routes except /api/health require:
Header: Authorization: Bearer {Firebase ID token}
Backend verifies token with firebase-admin before every request.
GET /api/health
No auth.
Returns: { "status": "ok", "version": "1.0" }
POST /api/embedding/skills
Body: { "skills": ["Teaching", "First Aid"] }
1. Join skills: "Teaching, First Aid"
2. Call Gemini text-embedding-004
3. Return embedding vector
Response: { "embedding": [0.12, -0.45, ...] }   (768 floats)
POST /api/match/volunteer
Body: { "volunteerId": "uid123" }
1. Fetch volunteer from Firestore: get skillEmbedding, location, availability
2. Fetch all opportunities where status == "open"
3. For each opportunity:
   a. skill_sim     = cosine_similarity(vol.skillEmbedding, opp.skillEmbedding)
   b. distance_km   = haversine(vol.location, opp.location)
      location_score = max(0, 1 - distance_km / 50)
   c. avail_score   = 1.0 if available on event day, 0.5 if not set, 0.0 if unavailable
   d. final_score   = 0.70*skill_sim + 0.20*location_score + 0.10*avail_score
4. Sort descending. Return top 20.
Response: { "opportunities": [ { ...oppDoc, "matchScore": 0.94 }, ... ] }
POST /api/match/opportunity
Body: { "skills": ["Teaching"] }
1. Call embedding logic internally
Response: { "embedding": [...] }
Used when coordinator posts a new opportunity.
GET /api/suggestions
Query param: q (string)
1. Prompt to gemini-2.0-flash:
   "List 5 specific volunteer skill tags related to '{q}'.
    Return ONLY a JSON array of strings. No explanation, no markdown."
2. Parse JSON array from response
Response: { "suggestions": ["Skill A","Skill B","Skill C","Skill D","Skill E"] }
POST /api/report/generate
Body: { "orgId": "org123", "startDate": "2026-01-01", "endDate": "2026-04-30" }
1. Query Firestore:
   - attendance where status="completed" in org's events within date range
   - Aggregate: totalHours, uniqueVolunteers, eventsCount, beneficiariesReached
   - Group hours by category → categoryBreakdown object
2. Build Gemini prompt:
   "Write a 3-paragraph professional impact summary for an NGO coordinator.
    Data: {JSON stats}. Tone: warm, credible, specific with actual numbers.
    Format: plain paragraphs only, no bullets, no markdown."
3. Call gemini-2.0-flash
4. Write /impact_reports doc to Firestore
5. Return full report
Response: { "reportId": "...", "totalHours": 240, "geminiNarrative": "...", ... }
POST /api/notify/send
Body: { "tokens": ["tok1","tok2"], "title": "...", "body": "...", "data": {} }
1. firebase-admin messaging.send_multicast()
2. Log to /notifications in Firestore
Response: { "sent": 2, "failed": 0 }
requirements.txt
fastapi==0.111.0
uvicorn==0.29.0
firebase-admin==6.5.0
google-generativeai==0.7.2
numpy==1.26.4
python-dotenv==1.0.1
pydantic==2.7.0
Dockerfile
dockerfileFROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

9. FIREBASE CLOUD FUNCTIONS — functions/index.js
Function 1: onAttendanceComplete
Trigger: onDocumentWritten('/attendance/{attendanceId}')
When status changes to "completed":
  1. Increment /users/{volunteerId}/totalHours by hoursLogged
  2. Increment /users/{volunteerId}/eventsAttended by 1
  3. Check badge conditions. If met: create /user_badges doc.
Function 2: onVolunteersRegisteredFull
Trigger: onDocumentWritten('/opportunities/{opportunityId}')
When volunteersRegistered >= volunteersNeeded:
  Update opportunity status to "full"
Function 3: sendEventReminders (scheduled)
Schedule: every day at 08:00 AM Asia/Kolkata
1. Query events where startTime in (now+23h, now+25h) and status="upcoming"
2. For each: fetch confirmedVolunteers UIDs → fetch fcmTokens
3. firebase-admin messaging.sendMulticast() with reminder
Function 4: clearLiveEventData (scheduled)
Schedule: every day at 23:00 PM Asia/Kolkata
Delete /live_events nodes for events where endTime < now

10. GOOGLE MAPS INTEGRATION
Install
npm install @react-google-maps/api
Use Case 1: Event Location Map (OpportunityDetail)
javascriptimport { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
// center: { lat: opp.location.latitude, lng: opp.location.longitude }
// zoom: 14
// containerStyle: { width:'100%', height:'240px', borderRadius:'10px' }
// Single Marker at event location
Use Case 2: Live Coordinator Map (CoordinatorDashboard)
javascript// center: org GeoPoint. zoom: 12
// Multiple Markers — one per checked-in volunteer from RTDB listener
// Click marker → InfoWindow: name, photoURL, checkInTime, status
// Data: onValue(ref(rtdb, /live_events/{eventId}), callback)
Use Case 3: Address Autocomplete (PostOpportunity)
javascriptimport { StandaloneSearchBox } from '@react-google-maps/api';
// On place selected → extract lat/lng → store as GeoPoint
// Show map preview at zoom 15 with pin

11. BUILD ORDER — IMPLEMENT IN THIS EXACT SEQUENCE
PHASE 1 — Project Setup
  □ React + Vite project
  □ Firebase project: enable Auth, Firestore, RTDB, Storage, Hosting, Functions
  □ firebase.js with all SDK exports
  □ .env.local with all vars
  □ variables.css + global.css
  □ React Router stubs for all routes
  □ AuthContext
  □ ProtectedRoute component

PHASE 2 — Auth + Onboarding
  □ LoginPage
  □ OnboardingPage 3-step wizard
  □ Write Firestore user doc on first login
  □ Create organization doc for coordinators
  □ POST /api/embedding/skills route
  □ Call it after onboarding; store embedding

PHASE 3 — Core Components
  □ Button, Card, Badge, Input
  □ SkillTag, MatchScoreBadge
  □ StatCard
  □ Sidebar (volunteer + coordinator versions)
  □ PageLayout

PHASE 4 — Volunteer Feed + Matching
  □ POST /api/match/volunteer route
  □ GET /api/suggestions route
  □ OpportunityFeed with filters
  □ OpportunityCard
  □ OpportunityDetail (two-column)
  □ Apply Now → write /applications

PHASE 5 — Coordinator Dashboard
  □ CoordinatorDashboard with tabs
  □ Volunteer Roster tab
  □ PostOpportunity form
  □ Google Maps on detail page

PHASE 6 — Real-Time Features
  □ Check In → write to Firebase RTDB
  □ Live volunteer map (RTDB onValue listener)
  □ POST /api/notify/send route
  □ FCM push notifications
  □ Coordinator notification on new application

PHASE 7 — Impact Reports
  □ POST /api/report/generate route
  □ Reports tab with date picker
  □ ImpactReportView with Recharts bar chart
  □ Print CSS

PHASE 8 — Cloud Functions
  □ onAttendanceComplete
  □ onVolunteersRegisteredFull
  □ sendEventReminders
  □ clearLiveEventData
  □ firebase deploy --only functions

PHASE 9 — Badges + History
  □ Seed badge documents
  □ Badge logic in onAttendanceComplete
  □ BadgesPage
  □ VolunteerHistory page

PHASE 10 — Polish + Deploy
  □ Mobile responsive (360px test)
  □ Loading skeletons on all data screens
  □ Empty states on all list screens
  □ Error boundaries + toast system
  □ firebase deploy --only hosting
  □ firebase deploy --only firestore:rules
  □ firebase deploy --only firestore:indexes
  □ gcloud run deploy (backend)
  □ End-to-end test all flows

12. ERROR HANDLING
Loading state    → skeleton UI (gray animated bars). Never blank white.
Empty state      → centered icon + message + action button
API error        → toast: fixed top-right, 320px wide, auto-dismiss 4s
Auth error       → redirect /login
Form validation  → inline red text below the specific failing field
Network timeout  → retry button; do not crash
Gemini API fail  → degrade gracefully: content without AI features; log error
Firebase rules   → catch permission-denied; show "You don't have access to this."

Toast spec:
  position: fixed, top:16px, right:16px, width:320px
  padding:12px 16px, border-radius: var(--radius-md)
  border-left: 4px solid (semantic color)
  background: white, box-shadow: var(--shadow-md)
  auto-dismiss after 4000ms

13. RESPONSIVE BREAKPOINTS
css@media (max-width: 768px) {
  /* Sidebar → bottom tab bar: fixed bottom, height 56px, flex row, full-width */
  /* PageLayout → margin-left:0, padding-bottom:56px */
  /* StatCard grid → 2 columns */
  /* Opportunity detail → single column; sticky panel → bottom sheet */
  /* Login → single column; left panel → top banner */
}
@media (min-width: 769px) and (max-width: 1024px) {
  /* Sidebar → 64px wide, icons only */
  /* PageLayout → margin-left:64px */
  /* StatCard grid → 2 columns */
}
@media (min-width: 1025px) {
  /* Full layout: sidebar 240px, 4-column stat grids */
}

14. DEMO SEED DATA
Create seed.js that writes to Firestore for the demo:
Organizations:
  "Teach For India - Delhi Chapter"  (education, SDG 4, 10)
  "Green Delhi Initiative"           (environment, SDG 11, 13)
  "HealthCare Reach Foundation"      (health, SDG 3)

Opportunities (2 per org):
  1. Teaching assistant for kids          Delhi, 2026-05-15, 4h, 10 slots, Skills: Teaching, Communication
  2. Digital literacy workshop            Delhi, 2026-05-22, 3h,  8 slots, Skills: Teaching, Computer Basics
  3. Weekend tree planting drive          Delhi, 2026-05-18, 5h, 25 slots, Skills: Physical Fitness, Teamwork
  4. Waste segregation campaign           Delhi, 2026-05-25, 4h, 15 slots, Skills: Communication, Awareness
  5. Free health checkup camp helper      Delhi, 2026-05-20, 6h, 20 slots, Skills: First Aid, Healthcare
  6. Medical data entry volunteer         Delhi, 2026-05-28, 3h,  5 slots, Skills: Data Entry, Attention to Detail

Demo Volunteer:
  Name: Priya Sharma
  Skills: ["Teaching","Communication","Python","Data Entry"]
  City: Delhi, totalHours: 28, eventsAttended: 4

Demo Coordinator:
  Name: Rajiv Mehta
  Organization: Teach For India - Delhi Chapter

15. FIREBASE.JSON
json{
  "hosting": {
    "public": "frontend/dist",
    "ignore": ["firebase.json","**/.*","**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [{ "source": "**/*.@(js|css)", "headers": [{"key":"Cache-Control","value":"max-age=31536000"}] }]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": { "source": "functions", "runtime": "nodejs18" },
  "storage": { "rules": "storage.rules" }
}

16. NON-NEGOTIABLE CONSTRAINTS
1.  ALL data in Firebase (Firestore or RTDB). No other databases.
2.  Website hosted on Firebase Hosting ONLY. No Vercel, Netlify, etc.
3.  ALL AI calls use Google Gemini API ONLY. No OpenAI, Anthropic, etc.
4.  No TypeScript. Plain JavaScript + JSX only.
5.  No UI libraries (no MUI, Chakra, Ant Design). Build all components from scratch using Section 3.
6.  No Tailwind CSS. Use plain CSS + CSS Variables from Section 3.2 only.
7.  Match score algorithm in Section 8 must be implemented exactly as written.
8.  All Firestore collections in Section 5 must be implemented with all fields.
9.  Firestore security rules must be deployed. DB must not be open.
10. Build in the order defined in Section 11. Do not skip phases.

17. GLOSSARY
GeoPoint       → Firestore type: { latitude: number, longitude: number }
skillEmbedding → 768-float array from Gemini text-embedding-004
matchScore     → float 0.0–1.0: weighted similarity between volunteer and opportunity
cosine_sim     → dot(A,B) / (||A|| × ||B||) — angle between two embedding vectors
denormalized   → data stored in 2 places for read speed (e.g. totalHours in user doc)
FCM token      → device identifier for push notifications
RTDB           → Firebase Realtime Database (different service from Firestore)
Cloud Run      → Google serverless containers hosting the FastAPI backend
idToken        → short-lived JWT from Firebase Auth, sent in Authorization header
haversine      → formula: great-circle distance between two lat/lng coordinates
SPA            → Single Page Application — React app with client-side routing

End of PRD.md — VolunteerIQ v1.0
Google Solution Challenge 2026 · Firebase Hosted · Gemini Powered