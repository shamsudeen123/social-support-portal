# Social Support Portal

A government social support portal that allows citizens to apply for financial assistance with an AI-assisted multi-step form wizard.

## Features

- **3-Step Form Wizard** — Personal Info → Family & Financial → Situation Description
- **AI Writing Assistance** — "Help Me Write" button on Step 3 uses OpenAI GPT to draft text
- **English + Arabic (RTL)** — full bilingual support with RTL layout
- **Responsive** — mobile, tablet, and desktop
- **Dark / Light Mode** — theme toggle in the header
- **Auto-Save** — form progress is saved to LocalStorage on every step
- **Accessibility** — ARIA labels, keyboard navigation, focus management

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 |
| UI | Material UI v5 |
| Forms | React Hook Form |
| State | Redux Toolkit |
| HTTP | Axios |
| i18n | react-i18next |
| Routing | React Router v6 |

---

## Getting Started

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure the OpenAI API key

Copy `.env.example` to `.env` and fill in your key:

```bash
cp .env.example .env
```

Open `.env` and set:

```
REACT_APP_OPENAI_API_KEY=sk-...your-key-here...
```

Get a key at https://platform.openai.com/api-keys

> **Without a key:** The form works fully. The "Help Me Write" button shows a clear error message explaining the key is missing, and users can still type manually.

### 3. Start the dev server

```bash
npm start
```

Open http://localhost:3000

---

## Project Structure

```
src/
├── components/
│   ├── AI/
│   │   └── SuggestionDialog.js   # AI popup: Accept / Edit / Discard
│   ├── common/
│   │   ├── Header.js             # App bar with lang/theme toggles
│   │   └── SaveIndicator.js      # "Progress saved" toast
│   ├── FormWizard/
│   │   ├── FormWizard.js         # Wizard shell, nav buttons, form context
│   │   └── ProgressStepper.js    # Linear progress + MUI Stepper
│   └── steps/
│       ├── Step1PersonalInfo.js  # Name, ID, DOB, Gender, Address
│       ├── Step2FamilyFinancial.js # Marital, Dependents, Employment, Income, Housing
│       └── Step3SituationDesc.js # 3 AI-assisted textareas
├── i18n/
│   ├── en.json                   # English strings
│   ├── ar.json                   # Arabic strings
│   └── index.js                  # i18next config
├── pages/
│   ├── ApplicationPage.js        # Routes form vs. success
│   └── SuccessPage.js            # Reference number + confirmation
├── services/
│   └── openai.js                 # Axios call to OpenAI GPT-3.5-turbo
├── slices/
│   ├── formSlice.js              # Form data + step + submit + LocalStorage
│   └── uiSlice.js                # Theme mode + language
├── store/
│   └── index.js                  # Redux store
└── theme/
    └── index.js                  # MUI theme (light/dark + RTL)
```

---

## Architecture Notes

### State Management
Redux Toolkit holds two slices:
- `form` — all field values, current step, submission state, reference number. Every mutation persists to `localStorage` automatically.
- `ui` — theme mode and language selection.

### Form Handling
React Hook Form's `FormProvider` wraps the entire wizard so each step's `Controller` fields connect to the same form instance. On "Next", `trigger()` validates only the visible step's fields before advancing.

### AI Integration
`services/openai.js` builds a context-aware GPT-3.5-turbo prompt per field using the user's Step 2 data (employment status, income, dependents). The response appears in a modal where the user can:
1. **Use This Text** — inserts directly into the textarea
2. **Edit First** — opens an inline editor inside the modal
3. **Discard** — closes without changes

Errors (no key, timeout, API failure) are caught and shown with user-friendly messages inside the modal.

### Internationalization
`react-i18next` with JSON resource files. Switching to Arabic triggers:
- `document.dir = 'rtl'`
- MUI theme `direction: 'rtl'` (flips flex direction, margins, etc.)
- Arabic font stack (Noto Sans Arabic)

---

## Potential Improvements

- Add a PDF export of the submitted application
- Persist draft to a backend API instead of only LocalStorage
- Add file upload for supporting documents
- Add unit tests with React Testing Library
- Add CAPTCHA to prevent spam submissions
