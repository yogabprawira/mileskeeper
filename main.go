// Command mileskeeper serves the MilesKeeper REST API and the built React app.
package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"mileskeeper/internal/api"
	"mileskeeper/internal/store"
)

func main() {
	defaultDSN := os.Getenv("DATABASE_URL")
	if defaultDSN == "" {
		defaultDSN = "postgres://postgres:postgres@localhost:5432/mileskeeper?sslmode=disable"
	}
	addr := flag.String("addr", ":8080", "listen address")
	dsn := flag.String("db", defaultDSN, "PostgreSQL DSN (or set DATABASE_URL)")
	static := flag.String("static", "web/dist", "path to built React assets")
	flag.Parse()

	st, err := store.New(*dsn)
	if err != nil {
		log.Fatalf("store: %v", err)
	}
	defer st.Close()

	mux := http.NewServeMux()
	mux.Handle("/api/", api.Handler(st))
	mux.Handle("/", spaHandler(*static))

	log.Printf("MilesKeeper listening on %s (static=%s)", *addr, *static)
	if err := http.ListenAndServe(*addr, mux); err != nil {
		log.Fatal(err)
	}
}

// spaHandler serves static files, falling back to index.html for client routes.
func spaHandler(dir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		clean := filepath.Clean(strings.TrimPrefix(r.URL.Path, "/"))
		full := filepath.Join(dir, clean)
		if info, err := os.Stat(full); err == nil && !info.IsDir() {
			http.ServeFile(w, r, full)
			return
		}
		index := filepath.Join(dir, "index.html")
		if _, err := os.Stat(index); err != nil {
			http.Error(w, "frontend not built — run `npm run build` in web/", http.StatusNotFound)
			return
		}
		http.ServeFile(w, r, index)
	}
}
