# MilesKeeper

Credit-card miles tracker. **Go** REST backend + **React** (Vite) frontend + **PostgreSQL** in one repo.
Implements the `MilesKeeper.dc.html` design handoff from Claude Design — pixel-matched.

Track cards, see total miles, and watch expiry status (Urgent / Watch / Safe) based on
days-until-expiry thresholds. Add / edit / delete cards; data persists in PostgreSQL.

## Layout

```
mileskeeper/
├── main.go                 # HTTP server: /api/* + static SPA serving
├── internal/
│   ├── store/store.go      # PostgreSQL store: migrate + seed + CRUD (pgx driver)
│   └── api/api.go          # REST handlers for /api/cards
└── web/                    # React + Vite frontend
    ├── src/
    │   ├── App.jsx         # dashboard layout + state
    │   ├── cards.js        # status/format logic (ported from the design)
    │   ├── api.js          # REST client
    │   └── components/     # SummaryCard, CardItem, CardModal, Hover/FocusInput
    └── dist/               # build output (served by Go)
```

## Database

> Fresh PostgreSQL install? Full step-by-step in [docs/POSTGRES_SETUP.md](docs/POSTGRES_SETUP.md).

PostgreSQL. The server auto-creates the `cards` table and seeds 5 demo rows on first run
(when the table is empty). You must create the **database** yourself first:

```sql
CREATE DATABASE mileskeeper;
```

Connection string comes from `DATABASE_URL`, else the `--db` flag, else the default
`postgres://postgres:postgres@localhost:5432/mileskeeper?sslmode=disable`.

```bash
export DATABASE_URL="postgres://USER:PASS@localhost:5432/mileskeeper?sslmode=disable"
```

## API

| Method | Path             | Body                                   | Result            |
|--------|------------------|----------------------------------------|-------------------|
| GET    | `/api/cards`     | —                                      | `200` card list   |
| POST   | `/api/cards`     | `{name,bank,miles,last4,expiry}`       | `201` created card |
| PUT    | `/api/cards/:id` | same                                   | `200` updated card |
| DELETE | `/api/cards/:id` | —                                      | `204`             |

`expiry` is `YYYY-MM-DD`. Server validates name/bank/miles/expiry; invalid → `400`.

## Run

### Production (Go serves the built React app)

```bash
cd web && npm install && npm run build && cd ..
go build -o mileskeeper.exe .
DATABASE_URL="postgres://USER:PASS@localhost:5432/mileskeeper?sslmode=disable" ./mileskeeper.exe
# http://localhost:8080
```

Flags: `--addr :8080`, `--db <DSN>`, `--static web/dist`.

### Dev (hot reload, two processes)

```bash
# terminal 1 — backend
go run .

# terminal 2 — frontend (proxies /api to :8080)
cd web && npm run dev            # http://localhost:5173
```

## Notes

- The original prototype stored cards in `localStorage`; this implementation moves
  persistence to PostgreSQL via the Go backend so data is shared across browsers/devices.
- Status thresholds live in `web/src/cards.js` (`NEAR_THRESHOLD=30`, `MID_THRESHOLD=90`)
  and the unit label (`miles`/`points`), matching the design's configurable props.
