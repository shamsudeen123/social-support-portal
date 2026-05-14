# Social Support Portal

A government social support portal where citizens can apply for financial assistance through a clean, guided multi-step form. Step 3 has an "Help Me Write" button powered by OpenAI that drafts the situation description for you — useful if someone isn't sure how to articulate their need.

---

## What's inside

- 3-step form wizard: Personal Info → Family & Financial → Situation Description
- AI writing assistant on Step 3 (OpenAI GPT-4o-mini) with a review popup before anything gets inserted
- English and Arabic with full RTL layout
- Light / Dark mode toggle
- Auto-saves progress to localStorage so you don't lose your work on refresh
- Responsive on mobile, tablet, and desktop

**Stack:** React 19, TypeScript, Vite, Material UI v5, Redux Toolkit, React Hook Form, react-i18next

---

## Running the project

### 1. Install dependencies

npm install 

### 2. Set up your API keys

Copy the example env file:

```bash
cp .env.example .env
```

Then open `.env` and fill in your OpenAI key:

VITE_OPENAI_API_KEY=sk-proj-...your-key-here...
VITE_GROQ_API_KEY=gsk_...optional...

**Getting an OpenAI key:** Go to https://platform.openai.com/api-keys, create a new secret key, and paste it in. The free tier works fine for testing.

> If you skip this step entirely, the app still works. The "Help Me Write" button will show a clear error message inside the popup, and users can just type manually. Nothing else breaks.

### 3. Start the dev server

```bash
npm start
```

Opens at http://localhost:3000

### Other commands

```bash
npm run build          # production build → dist/
npm run preview        # preview the production build locally
npm test               # run the test suite once
npm run test:watch     # run tests in watch mode
npm run test:coverage  # run tests + generate coverage report
```

---

## Project structure

```
src/
├── components/
│   ├── AI/
│   │   └── SuggestionDialog.tsx   # The popup that shows the AI draft
│   ├── common/
│   │   ├── Header.tsx             # App bar with language and theme toggles
│   │   ├── SplashScreen.tsx       # Loading screen on first visit
│   │   └── SaveIndicator.tsx      # "Progress saved" toast
│   ├── FormWizard/
│   │   ├── FormWizard.tsx         # Wizard shell — handles step nav and form context
│   │   └── ProgressStepper.tsx    # The step indicators at the top
│   └── steps/
│       ├── Step1PersonalInfo.tsx       # Name, National ID, DOB, Gender, Address
│       ├── Step2FamilyFinancial.tsx    # Marital status, Dependents, Employment, Income, Housing
│       └── Step3SituationDesc.tsx      # 3 AI-assisted text areas
├── i18n/
│   ├── en.json                    # English strings
│   ├── ar.json                    # Arabic strings
│   └── index.ts                   # i18next setup
├── pages/
│   ├── ApplicationPage.tsx        # Entry point, routes to form or success
│   └── SuccessPage.tsx            # Confirmation screen with reference number
├── services/
│   ├── openai.ts                  # OpenAI API call (GPT-4o-mini)
│   └── groq.ts                    # Groq API call (Llama 3.3) — alternative provider
├── slices/
│   ├── formSlice.ts               # Form data, current step, submit state, localStorage sync
│   └── uiSlice.ts                 # Theme mode, language
├── store/
│   └── index.ts                   # Redux store setup
└── theme/
    └── index.ts                   # MUI theme config (light/dark + RTL support)
```

---

## Architecture and decisions

### State: two Redux slices

I kept state management simple with just two slices. `formSlice` owns everything related to the application — field values, which step you're on, whether submission is in progress, and the reference number you get at the end. It also automatically syncs to `localStorage` so progress survives a page refresh without any extra work.

`uiSlice` just holds the theme preference and the active language. These two are intentionally separate because UI state and form data have completely different lifecycles.

### Forms: React Hook Form across steps

React Hook Form's `FormProvider` wraps the entire wizard so all three steps share one form instance. When you hit "Next", it calls `trigger()` with only the current step's field names — so validation fires only for what's visible, not the whole form at once. This avoids the awkward situation where errors from a future step appear before the user has seen them.

### AI integration

`services/openai.ts` builds a context-aware prompt using data from Step 2 (employment status, income, number of dependents) before calling GPT-4o-mini. The idea is that the AI should know your situation before trying to describe it, rather than asking generic questions.

The response lands in `SuggestionDialog` where users have three options: **Use This** (inserts directly), **Edit First** (inline editor opens inside the modal), or **Discard**. Nothing gets inserted without the user explicitly choosing to — the AI is assistive, not automatic.

All API errors (missing key, rate limit, timeout, network failure) are caught and shown inside the modal with a human-readable message, so the user knows what happened and can still continue manually.

### Internationalization and RTL

Switching to Arabic flips the layout properly — `document.dir = 'rtl'`, MUI's theme direction, and `stylis-plugin-rtl` for the CSS. The Arabic font stack (Noto Sans Arabic) is loaded separately. English and Arabic strings live in `en.json` and `ar.json` and are referenced by key throughout the components.