# PostgreSQL Setup & Deploy Guide

How to go from a **fresh PostgreSQL install** to a running MilesKeeper backend.
Tested against PostgreSQL 18 on Windows; Linux/macOS notes included.

---

## 1. Install PostgreSQL

### Windows
1. Download the EDB installer: <https://www.postgresql.org/download/windows/>
2. Run it. During setup you set a **superuser (`postgres`) password** — remember it.
   This is the password MilesKeeper needs in its connection string.
3. Keep the default port **5432**.
4. Finish. The `postgresql-x64-18` Windows service starts automatically.

Verify the service is running:
```powershell
Get-Service postgresql*
```

### Linux (Debian/Ubuntu)
```bash
sudo apt install postgresql
sudo systemctl enable --now postgresql
sudo -u postgres psql      # opens a superuser shell
```

### macOS (Homebrew)
```bash
brew install postgresql@18
brew services start postgresql@18
psql postgres
```

---

## 2. Open a SQL shell

The `psql` client ships with the server. On Windows it's at
`C:\Program Files\PostgreSQL\18\bin\psql.exe` (add that folder to `PATH`, or use
**SQL Shell (psql)** from the Start menu).

```powershell
psql -U postgres -h localhost
# enter the password you set during install
```

---

## 3. Create the database (and optional app role)

Minimal — reuse the `postgres` superuser:
```sql
CREATE DATABASE mileskeeper;
```

Recommended — a least-privilege role for the app:
```sql
CREATE ROLE mileskeeper_app WITH LOGIN PASSWORD 'change-me-strong';
CREATE DATABASE mileskeeper OWNER mileskeeper_app;
```

Check it exists:
```sql
\l
```
Quit psql:
```sql
\q
```

> The app auto-creates the `cards` table and seeds 5 demo rows on first run.
> No manual schema step needed. The id column uses `gen_random_uuid()`, built into
> PostgreSQL 13+ (no extension required).

---

## 4. Point MilesKeeper at the database

Connection string format:
```
postgres://USER:PASSWORD@HOST:5432/mileskeeper?sslmode=disable
```

Set it via `DATABASE_URL` (preferred). Copy the template:
```bash
cp .env.example .env
```
Edit `.env`:
```
DATABASE_URL=postgres://mileskeeper_app:change-me-strong@localhost:5432/mileskeeper?sslmode=disable
```

`.env` is git- and claude-ignored — never commit real credentials.

> `sslmode=disable` is fine for localhost. For a remote DB use `require` or `verify-full`.

---

## 5. Build & run

```bash
# frontend
cd web && npm install && npm run build && cd ..

# backend (reads DATABASE_URL)
go build -o mileskeeper.exe .

# Windows PowerShell:
$env:DATABASE_URL="postgres://mileskeeper_app:change-me-strong@localhost:5432/mileskeeper?sslmode=disable"
./mileskeeper.exe

# Linux/macOS:
export DATABASE_URL="postgres://mileskeeper_app:change-me-strong@localhost:5432/mileskeeper?sslmode=disable"
./mileskeeper
```

Or pass the DSN directly instead of the env var:
```bash
./mileskeeper.exe --db "postgres://mileskeeper_app:change-me-strong@localhost:5432/mileskeeper?sslmode=disable"
```

Open <http://localhost:8080> — 5 demo cards should appear.

Verify the API:
```bash
curl http://localhost:8080/api/cards
```

---

## 6. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `failed SASL auth: password authentication failed for user "postgres"` | Wrong password in DSN. Use the one set at install. Reset: see below. |
| `database "mileskeeper" does not exist` | Run step 3 — `CREATE DATABASE mileskeeper;` |
| `dial tcp [::1]:5432: connectex: No connection could be made` | Server not running. Start the `postgresql-x64-18` service / `systemctl start postgresql`. |
| `pq: type "uuid" ... ` or `gen_random_uuid() does not exist` | PostgreSQL < 13. Upgrade, or `CREATE EXTENSION pgcrypto;` in the DB. |
| Table has old `TEXT` id from a previous run | `DROP TABLE cards;` then restart the app (migration rebuilds with UUID). |

### Reset the `postgres` password (Windows)
```powershell
# as admin; replace path with your version
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
ALTER USER postgres WITH PASSWORD 'new-password';
```
If you can't log in at all, edit `pg_hba.conf` (in the data dir), temporarily set the
local method to `trust`, restart the service, change the password, then revert to
`scram-sha-256` and restart again.

---

## 7. Production notes

- Run the binary behind a reverse proxy (nginx/Caddy) for TLS.
- Use a dedicated role (step 3), not the superuser.
- Enable SSL to the DB (`sslmode=require`) when DB and app are on different hosts.
- Back up: `pg_dump mileskeeper > backup.sql`; restore: `psql mileskeeper < backup.sql`.
- Keep `DATABASE_URL` in the deployment environment / secrets manager, not in the repo.
