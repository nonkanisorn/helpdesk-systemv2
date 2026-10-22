package service_test

import (
	"errors"
	"testing"

	"github.com/nonkanisorn/helpdesk-system/internal/auth/register/service"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type mockRegisterRepo struct {
	userByEmail        *domain.Usertest
	findUserByEmailErr error
	verifyUser         *domain.Usertest
	verifyUserErr      error
	savedToken         string
	savedUserID        *int
	invalidatedUserID  *int
}

func (m *mockRegisterRepo) Create(user *domain.User) error { return nil }
func (m *mockRegisterRepo) CreateTest(user *domain.Usertest) (*int, error) {
	id := 1
	return &id, nil
}
func (m *mockRegisterRepo) SetPassword(user *domain.Usertest) error { return nil }
func (m *mockRegisterRepo) CheckToken(token string) (*domain.Usertest, error) {
	return nil, nil
}
func (m *mockRegisterRepo) SaveToken(userID *int, token string) error {
	m.savedUserID = userID
	m.savedToken = token
	return nil
}
func (m *mockRegisterRepo) FindUserIDByEmail(email string) (*int, error) {
	if m.userByEmail != nil {
		id := m.userByEmail.ID
		return &id, nil
	}
	return nil, nil
}
func (m *mockRegisterRepo) FindUserByEmail(email string) (*domain.Usertest, error) {
	if m.findUserByEmailErr != nil {
		return nil, m.findUserByEmailErr
	}
	return m.userByEmail, nil
}
func (m *mockRegisterRepo) VerifyTokenWithUser(token string) (*domain.Usertest, error) {
	if m.verifyUserErr != nil {
		return nil, m.verifyUserErr
	}
	return m.verifyUser, nil
}
func (m *mockRegisterRepo) InvalidateTokensByUserID(userID int) error {
	m.invalidatedUserID = &userID
	return nil
}
func (m *mockRegisterRepo) MarkTokenUsed(token string) error { return nil }

type mockGomailService struct {
	lastRegisterEmail string
	lastResetEmail    string
	registerToken     string
	resetToken        string
}

func (m *mockGomailService) SendEmailRegister(to string) (*string, error) {
	m.lastRegisterEmail = to
	tok := m.registerToken
	if tok == "" {
		tok = "invite-raw-token"
	}
	return &tok, nil
}

func (m *mockGomailService) SendEmailResetPassword(to string) (*string, error) {
	m.lastResetEmail = to
	tok := m.resetToken
	if tok == "" {
		tok = "reset-raw-token"
	}
	return &tok, nil
}

func TestRequestPasswordReset_PendingUser_SendsRegisterInvite(t *testing.T) {
	statusPending := "pending"
	userEmail := "newuser@example.com"
	repo := &mockRegisterRepo{
		userByEmail: &domain.Usertest{
			ID:           101,
			Email:        &userEmail,
			Status:       &statusPending,
			PasswordHash: nil,
		},
	}
	mailMock := &mockGomailService{registerToken: "raw-invite-token"}
	svc := service.NewRegisterService(repo, mailMock)

	err := svc.RequestPasswordReset(userEmail)
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}

	if mailMock.lastRegisterEmail != userEmail {
		t.Errorf("expected SendEmailRegister to be called with %s, got %s", userEmail, mailMock.lastRegisterEmail)
	}
	if mailMock.lastResetEmail != "" {
		t.Errorf("expected SendEmailResetPassword NOT to be called, but got %s", mailMock.lastResetEmail)
	}
	if repo.invalidatedUserID == nil || *repo.invalidatedUserID != 101 {
		t.Errorf("expected InvalidateTokensByUserID to be called for user 101")
	}
	if repo.savedUserID == nil || *repo.savedUserID != 101 {
		t.Errorf("expected SaveToken for user 101")
	}
	if repo.savedToken == "" {
		t.Errorf("expected savedToken to not be empty")
	}
}

func TestRequestPasswordReset_ActiveUser_SendsResetPassword(t *testing.T) {
	statusActive := "active"
	passwordHash := "$2a$10$hashedpassword"
	userEmail := "activeuser@example.com"
	repo := &mockRegisterRepo{
		userByEmail: &domain.Usertest{
			ID:           202,
			Email:        &userEmail,
			Status:       &statusActive,
			PasswordHash: &passwordHash,
		},
	}
	mailMock := &mockGomailService{resetToken: "raw-reset-token"}
	svc := service.NewRegisterService(repo, mailMock)

	err := svc.RequestPasswordReset(userEmail)
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}

	if mailMock.lastResetEmail != userEmail {
		t.Errorf("expected SendEmailResetPassword to be called with %s, got %s", userEmail, mailMock.lastResetEmail)
	}
	if mailMock.lastRegisterEmail != "" {
		t.Errorf("expected SendEmailRegister NOT to be called, but got %s", mailMock.lastRegisterEmail)
	}
	if repo.invalidatedUserID == nil || *repo.invalidatedUserID != 202 {
		t.Errorf("expected InvalidateTokensByUserID to be called for user 202")
	}
	if repo.savedUserID == nil || *repo.savedUserID != 202 {
		t.Errorf("expected SaveToken for user 202")
	}
}

func TestVerifyToken_PendingUser(t *testing.T) {
	statusPending := "pending"
	userEmail := "pending@example.com"
	repo := &mockRegisterRepo{
		verifyUser: &domain.Usertest{
			ID:           303,
			Email:        &userEmail,
			Status:       &statusPending,
			PasswordHash: nil,
		},
	}
	svc := service.NewRegisterService(repo, &mockGomailService{})

	res, err := svc.VerifyToken("some-raw-token")
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
	if !res.Valid {
		t.Errorf("expected valid to be true")
	}
	if res.Mode != "invite" {
		t.Errorf("expected mode to be 'invite', got %s", res.Mode)
	}
	if res.Email != userEmail {
		t.Errorf("expected email to be %s, got %s", userEmail, res.Email)
	}
}

func TestVerifyToken_ActiveUser(t *testing.T) {
	statusActive := "active"
	passwordHash := "$2a$10$hashed"
	userEmail := "active@example.com"
	repo := &mockRegisterRepo{
		verifyUser: &domain.Usertest{
			ID:           404,
			Email:        &userEmail,
			Status:       &statusActive,
			PasswordHash: &passwordHash,
		},
	}
	svc := service.NewRegisterService(repo, &mockGomailService{})

	res, err := svc.VerifyToken("some-raw-token")
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
	if !res.Valid {
		t.Errorf("expected valid to be true")
	}
	if res.Mode != "reset" {
		t.Errorf("expected mode to be 'reset', got %s", res.Mode)
	}
}

func TestVerifyToken_InvalidOrExpired(t *testing.T) {
	repo := &mockRegisterRepo{
		verifyUserErr: errors.New("sql: no rows in result set"),
	}
	svc := service.NewRegisterService(repo, &mockGomailService{})

	res, err := svc.VerifyToken("expired-token")
	if err == nil {
		t.Fatalf("expected error for expired/invalid token, got nil")
	}
	if res != nil {
		t.Errorf("expected nil response, got %v", res)
	}
}

func TestResendInitialPassword(t *testing.T) {
	userEmail := "resend@example.com"
	repo := &mockRegisterRepo{}
	mailMock := &mockGomailService{registerToken: "resend-token"}
	svc := service.NewRegisterService(repo, mailMock)

	err := svc.ResendInitialPassword(505, userEmail)
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}
	if mailMock.lastRegisterEmail != userEmail {
		t.Errorf("expected SendEmailRegister with %s, got %s", userEmail, mailMock.lastRegisterEmail)
	}
	if repo.invalidatedUserID == nil || *repo.invalidatedUserID != 505 {
		t.Errorf("expected InvalidateTokensByUserID for 505")
	}
	if repo.savedUserID == nil || *repo.savedUserID != 505 {
		t.Errorf("expected SaveToken for 505")
	}
}
