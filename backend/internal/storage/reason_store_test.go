package storage

import (
	"os"
	"testing"
)

func TestSaveAndGetUserRejectionReason(t *testing.T) {
	// Setup temporary test file
	tmpFile := "storage/ticket_reasons_test.json"
	_ = os.Remove(tmpFile)
	defer os.Remove(tmpFile)

	ticketID := 9999
	userID := 42
	userName := "สมชาย ใจดี"
	reason := "หน้าจอยังมีเส้นกระพริบอยู่ครับ"

	err := SaveUserRejectionReason(ticketID, &userID, userName, reason)
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}

	result := GetTicketReason(ticketID)
	if result == nil {
		t.Fatalf("expected reason for ticket %d, got nil", ticketID)
	}

	if result.UserRejectionReason != reason {
		t.Errorf("expected reason '%s', got '%s'", reason, result.UserRejectionReason)
	}

	if result.UserName != userName {
		t.Errorf("expected userName '%s', got '%s'", userName, result.UserName)
	}

	if result.UserID == nil || *result.UserID != userID {
		t.Errorf("expected userID %d, got %v", userID, result.UserID)
	}

	if result.UserRejectedAt == "" {
		t.Errorf("expected UserRejectedAt to be populated")
	}

	// Clean up key
	mu.Lock()
	store := readAllReasons()
	delete(store, "9999")
	_ = writeAllReasons(store)
	mu.Unlock()
}
