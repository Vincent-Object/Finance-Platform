# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Finance Platform (金融平台) — a Vue 3 SPA for tracking stock investments. All data is stored in browser `localStorage`; there is no backend, database, or external API.

### Tech stack

- Vue 3, Vue Router 4, Naive UI component library
- Vite 4 dev server (port 3000)
- Package manager: npm (lockfile: `package-lock.json`)

### Running the app

- `npm run dev` — starts the Vite dev server on `http://localhost:3000`
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

### Login

Login is client-side only (no real auth). Any username (≥3 chars) and password (≥6 chars) will succeed. Auth state is stored in `localStorage` or `sessionStorage` depending on the "记住我" checkbox.

### Key caveats

- Naive UI components are globally registered in `src/main.js`. If a new Naive UI component is used in a `.vue` file, it must also be added to the import and `app.component()` calls in `main.js`.
- The app locale is Chinese (`lang="zh"`). UI labels, validation messages, and mock data are all in Chinese.
- No linter or test framework is configured in the project.
