// Package api exposes the cards REST handlers.
package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"mileskeeper/internal/store"
)

// Handler builds the /api/cards router backed by st.
func Handler(st *store.Store) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/cards", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			cards, err := st.List()
			if err != nil {
				writeErr(w, http.StatusInternalServerError, err.Error())
				return
			}
			writeJSON(w, http.StatusOK, cards)
		case http.MethodPost:
			c, err := decodeCard(r)
			if err != nil {
				writeErr(w, http.StatusBadRequest, err.Error())
				return
			}
			created, err := st.Create(c)
			if err != nil {
				writeErr(w, http.StatusInternalServerError, err.Error())
				return
			}
			writeJSON(w, http.StatusCreated, created)
		default:
			writeErr(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	})

	mux.HandleFunc("/api/cards/", func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimPrefix(r.URL.Path, "/api/cards/")
		if id == "" {
			writeErr(w, http.StatusBadRequest, "missing id")
			return
		}
		switch r.Method {
		case http.MethodPut:
			c, err := decodeCard(r)
			if err != nil {
				writeErr(w, http.StatusBadRequest, err.Error())
				return
			}
			updated, err := st.Update(id, c)
			if errors.Is(err, store.ErrNotFound) {
				writeErr(w, http.StatusNotFound, "card not found")
				return
			}
			if err != nil {
				writeErr(w, http.StatusInternalServerError, err.Error())
				return
			}
			writeJSON(w, http.StatusOK, updated)
		case http.MethodDelete:
			err := st.Delete(id)
			if errors.Is(err, store.ErrNotFound) {
				writeErr(w, http.StatusNotFound, "card not found")
				return
			}
			if err != nil {
				writeErr(w, http.StatusInternalServerError, err.Error())
				return
			}
			w.WriteHeader(http.StatusNoContent)
		default:
			writeErr(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	})

	return mux
}

func decodeCard(r *http.Request) (store.Card, error) {
	var c store.Card
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		return c, errors.New("invalid JSON body")
	}
	c.Name = strings.TrimSpace(c.Name)
	c.Bank = strings.TrimSpace(c.Bank)
	if c.Name == "" {
		return c, errors.New("name is required")
	}
	if c.Bank == "" {
		return c, errors.New("bank is required")
	}
	if c.Miles < 0 {
		return c, errors.New("miles must be >= 0")
	}
	if c.Expiry == "" {
		return c, errors.New("expiry is required")
	}
	if len(c.Last4) > 4 {
		c.Last4 = c.Last4[:4]
	}
	return c, nil
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}
