# TODOs Workspace – Frontend

Next.js 15 (App Router) frontend for the TODOs Workspace assignment.
JavaScript, CSS Modules, plain `fetch` + React hooks, Jest. No UI kit, no Redux/SWR/React Query.

## Setup

```bash
npm install
cp .env.local.example .env.local   # then edit BACKEND_API_URL if needed
npm run dev                         # http://localhost:3000
```

## Environment variables

| Name | Description |
|---|---|
| `BACKEND_API_URL` | Backend base URL including `/api`, no trailing slash. Example: `https://todo-api-awz4.onrender.com/api` |

`.env.local` is ignored by git. Only `.env.local.example` is committed.

## Scripts and test results

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Jest tests (see below) |

Last run: `npm run lint`, `npm test` and `npm run build` pass. <fill in the number of tests from your `npm test` output>

Tests cover: auth guards (`requireUser`, `requireAdmin`), the proxy (Authorization header, 401, allowlist, no token in response), login and logout routes, middleware token refresh, validators and query helpers, notification link (never the API `link`), notification bell (badge, polling stops on a hidden tab), `AssignPicker`, `TodoDetailView` permissions (assignee, assigner, read-only), admin `UsersTable` (own role disabled, last admin 409), `NavLinks` (Admin link hidden from members) and the dashboard helpers and charts.

## Seed accounts and teams

Taken from the backend seed data (<fill in from your backend>).

| Role | Email | Password | Team |
|---|---|---|---|
| Admin | `<admin email>` | `<password>` | `<team>` |
| Member | `<member email>` | `<password>` | `<team>` |
| Member | `<member email>` | `<password>` | `<team>` |

Teams: `<team 1>`, `<team 2>`. New registrations are `member` with no team until an admin adds them to one.

## How authentication works (BFF)

- The browser never sees the tokens. Login and register go through Next.js Route Handlers (`/api/auth/*`) which store the access and refresh tokens in `httpOnly` cookies.
- The browser calls `/api/*`. The proxy (`src/app/api/[...path]/route.js`) reads the cookie and forwards the request to the backend with `Authorization: Bearer ...`.
- The proxy only forwards the paths and methods listed in `src/lib/proxy-allowlist.js`. `/auth/*` is blocked there.
- `src/middleware.js` refreshes the tokens 30 seconds before the access token expires (the refresh token rotates on every use). If the refresh fails, the cookies are cleared and the user goes to `/login`.
- Server Components call the backend directly through `src/lib/backend.js` (token from the cookie, timeout, `ApiError`).
- Permissions are enforced by the backend. Hidden buttons and menu items are only for convenience.

## Route map

| Route | Access | Description |
|---|---|---|
| `/` | Everyone (logged-in users go to `/todos`) | Home: hero, features, how it works |
| `/login`, `/register` | Guests | Auth forms |
| `/todos` | Logged-in | List with tabs, filters, pagination, create modal |
| `/todos/[id]` | Assigner or assignee | Details. Assignee edits, accepts, rejects. Assigner views, assigns, deletes |
| `/notifications` | Logged-in | List, unread filter, mark read, mark all read |
| `/admin` | Admin | Dashboard (bonus) |
| `/admin/teams` | Admin | Create, rename and delete teams |
| `/admin/users` | Admin | Users, roles, team membership |
| `/admin/users/[id]` | Admin (read-only) | All todos of a user |
| `/admin/todos/[id]` | Admin (read-only) | Todo details without any action |
| `/admin/categories` | Admin | Create, rename and delete categories |

## API map (path after the backend `/api`)

| Page / component | API |
|---|---|
| Login, register, logout | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `POST /auth/token/refresh` (middleware) |
| App shell | `GET /auth/me`, `GET /notifications/unread-count` |
| Todo list and create | `GET /todos`, `POST /todos`, `GET /categories`, `GET /teams/{id}/members` |
| Todo details | `GET/PATCH/DELETE /todos/{id}`, `POST /todos/{id}/assign`, `/accept`, `/reject` |
| Notifications | `GET /notifications`, `POST /notifications/{id}/read`, `POST /notifications/read-all` |
| Admin users | `GET /admin/users`, `PATCH /admin/users/{id}`, `GET /teams` |
| Dashboard | `GET /admin/dashboard/overview`, `/users`, `/teams`, `/activity` |
| Admin read-only | `GET /admin/users/{id}`, `GET /admin/users/{id}/todos`, `GET /admin/todos/{id}` |
| Admin teams | `GET /teams`, `POST /admin/teams`, `PATCH /admin/teams/{id}`, `DELETE /admin/teams/{id}`, `GET /admin/dashboard/teams` (counts) |
| Admin categories | `GET /categories`, `POST /categories`, `PATCH /categories/{id}`, `DELETE /categories/{id}` |

## Folder structure

```
src/app            routes: (auth), (app), api
src/components     ui, layout, home, auth, todos, notifications, admin
src/context        AuthContext
src/hooks          useAction, useNotifications, usePageVisibility, useDebounce
src/lib            backend, session, auth, errors, proxy allowlist, helpers
src/styles         tokens.css, animations.css
__tests__          Jest tests
```

## Decisions

- **Backend for frontend:** tokens live only in `httpOnly` cookies. No token in JS, localStorage or network responses.
- **User in context from the first render:** `(app)/layout.js` fetches `/auth/me` on the server (once per request with `React.cache`) and gives it to `AuthProvider`.
- **Guards:** `(auth)` redirects logged-in users, `(app)` redirects guests, and every admin page calls `requireAdmin()` itself because layouts do not run again on client navigation.
- **Suspense:** every data section (todo list, details, notifications, users, each dashboard panel) has its own `<Suspense>` with a skeleton.
- **Caching:** categories 5 minutes, team members 1 minute (tagged, cleared with `revalidateTag` when an admin changes a team), teams 1 hour, dashboard 30 seconds. Todos, notifications and `/auth/me` are never cached.
- **Filters and paging live in the URL** (`searchParams`), so pages can be bookmarked.
- **Notifications:** the unread count is polled every 30 seconds, paused on a hidden tab, with exponential backoff on 429/503. The link to a todo is built from `todo_id`, never from the API `link`.
- **Charts** are CSS (`conic-gradient`, bars) and SVG. No chart library.
- **Dates** are formatted in the browser (`LocalTime`) so the user always sees their own time zone.
- **Status words:** todo status (Not started / In progress / Completed) and assignment status (Awaiting response / Accepted / Rejected) use different badges and different words.
- **Team changes clear the caches:** after an admin creates, renames or deletes a team, a Server Action calls `revalidateTag` for the team list, the dashboard and the team member lists, so pickers and tables show the change at once.

## Limitations

- If two requests refresh the token at the same moment, the second one can fail because the refresh token rotates. The user is sent to `/login`.
- The refresh cookie lifetime falls back to 7 days if the token has no readable `exp`.
- The assign panel is shown to the assigner while the assignment is not accepted. The backend decides if re-assigning is really allowed and the UI shows its message.
- Notification polling is every 30 seconds, so a new notification can take up to 30 seconds to show (or less after an action in the app).
- Todo lists use offset pagination. The list can shift if todos change while a user pages through it.
