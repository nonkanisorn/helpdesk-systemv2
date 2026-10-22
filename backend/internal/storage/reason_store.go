package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"
)

type TicketReason struct {
	TicketID             int    `json:"ticket_id"`
	TechnicianID         *int   `json:"technician_id,omitempty"`
	TechnicianName       string `json:"technician_name,omitempty"`
	TechnicianReason     string `json:"technician_reason,omitempty"`
	TechnicianReportedAt string `json:"technician_reported_at,omitempty"`
	ManagerID            *int   `json:"manager_id,omitempty"`
	ManagerName          string `json:"manager_name,omitempty"`
	ManagerReason        string `json:"manager_reason,omitempty"`
	ReassignedAt         string `json:"reassigned_at,omitempty"`
	UserID               *int   `json:"user_id,omitempty"`
	UserName             string `json:"user_name,omitempty"`
	UserRejectionReason  string `json:"user_rejection_reason,omitempty"`
	UserRejectedAt       string `json:"user_rejected_at,omitempty"`
}

var (
	mu sync.RWMutex
)

func getStoragePath() string {
	candidates := []string{
		"storage/ticket_reasons.json",
		"backend/storage/ticket_reasons.json",
		"../storage/ticket_reasons.json",
	}

	for _, p := range candidates {
		dir := filepath.Dir(p)
		if _, err := os.Stat(dir); err == nil {
			return p
		}
	}

	// Default fallback: create storage directory in current working dir
	_ = os.MkdirAll("storage", 0755)
	return "storage/ticket_reasons.json"
}

func readAllReasons() map[string]TicketReason {
	path := getStoragePath()
	data, err := os.ReadFile(path)
	if err != nil {
		return make(map[string]TicketReason)
	}

	var store map[string]TicketReason
	if err := json.Unmarshal(data, &store); err != nil {
		return make(map[string]TicketReason)
	}

	if store == nil {
		store = make(map[string]TicketReason)
	}

	return store
}

func writeAllReasons(store map[string]TicketReason) error {
	path := getStoragePath()
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	data, err := json.MarshalIndent(store, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, data, 0644)
}

func GetTicketReason(ticketID int) *TicketReason {
	mu.RLock()
	defer mu.RUnlock()

	store := readAllReasons()
	key := fmt.Sprintf("%d", ticketID)
	if reason, ok := store[key]; ok {
		return &reason
	}
	return nil
}

func SaveTechnicianReason(ticketID int, techID *int, techName string, reason string) error {
	mu.Lock()
	defer mu.Unlock()

	store := readAllReasons()
	key := fmt.Sprintf("%d", ticketID)

	existing := store[key]
	existing.TicketID = ticketID
	existing.TechnicianID = techID
	existing.TechnicianName = techName
	existing.TechnicianReason = reason
	existing.TechnicianReportedAt = time.Now().Format("2006-01-02 15:04:05")

	store[key] = existing
	return writeAllReasons(store)
}

func SaveManagerReason(ticketID int, managerID *int, managerName string, reason string) error {
	mu.Lock()
	defer mu.Unlock()

	store := readAllReasons()
	key := fmt.Sprintf("%d", ticketID)

	existing := store[key]
	existing.TicketID = ticketID
	existing.ManagerID = managerID
	existing.ManagerName = managerName
	existing.ManagerReason = reason
	existing.ReassignedAt = time.Now().Format("2006-01-02 15:04:05")

	store[key] = existing
	return writeAllReasons(store)
}

func SaveUserRejectionReason(ticketID int, userID *int, userName string, reason string) error {
	mu.Lock()
	defer mu.Unlock()

	store := readAllReasons()
	key := fmt.Sprintf("%d", ticketID)

	existing := store[key]
	existing.TicketID = ticketID
	existing.UserID = userID
	existing.UserName = userName
	existing.UserRejectionReason = reason
	existing.UserRejectedAt = time.Now().Format("2006-01-02 15:04:05")

	store[key] = existing
	return writeAllReasons(store)
}

