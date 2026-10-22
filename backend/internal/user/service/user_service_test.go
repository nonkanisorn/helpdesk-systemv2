package service_test

import (
	"testing"

	registerService "github.com/nonkanisorn/helpdesk-system/internal/auth/register/service"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	"github.com/nonkanisorn/helpdesk-system/internal/user/repository"
	"github.com/nonkanisorn/helpdesk-system/internal/user/service"
)

type mockUserRepo struct {
	userByID   *repository.User
	lastUpdate repository.UserUpdate
	lastID     int
}

func (m *mockUserRepo) GetAll() ([]repository.User, error) { return nil, nil }
func (m *mockUserRepo) GetByID(id int) (*repository.User, error) {
	if m.userByID != nil {
		return m.userByID, nil
	}
	return nil, nil
}
func (m *mockUserRepo) UpdateByID(id int, user repository.UserUpdate) error {
	m.lastID = id
	m.lastUpdate = user
	return nil
}
func (m *mockUserRepo) UpdateStatusByID(id int, status string) error { return nil }
func (m *mockUserRepo) DeleteByID(id int) error                     { return nil }

type mockRegisterServiceForUser struct {
	resendUserID int
	resendEmail  string
}

func (m *mockRegisterServiceForUser) CreateUser(user *domain.User) error     { return nil }
func (m *mockRegisterServiceForUser) CreateTest(user *domain.Usertest) error { return nil }
func (m *mockRegisterServiceForUser) SetPassword(user *domain.Usertest, token string) error {
	return nil
}
func (m *mockRegisterServiceForUser) RequestPasswordReset(email string) error { return nil }
func (m *mockRegisterServiceForUser) VerifyToken(rawToken string) (*registerService.TokenVerifyResponse, error) {
	return nil, nil
}
func (m *mockRegisterServiceForUser) ResendInitialPassword(userID int, email string) error {
	m.resendUserID = userID
	m.resendEmail = email
	return nil
}

func TestUpdateUserByID_PendingUser_EmailChanged_ResendsInvite(t *testing.T) {
	oldEmail := "wrong@example.com"
	pendingStatus := "pending"
	userRepo := &mockUserRepo{
		userByID: &repository.User{
			ID:           99,
			Email:        &oldEmail,
			Status:       &pendingStatus,
			PasswordHash: "",
		},
	}
	regMock := &mockRegisterServiceForUser{}
	userSvc := service.NewUserService(userRepo, regMock)

	newEmail := "correct@example.com"
	err := userSvc.UpdateUserByID(99, domain.UserUpdateRequest{
		Email:  newEmail,
		Status: "pending",
	})
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}

	if userRepo.lastUpdate.Email != newEmail {
		t.Errorf("expected repo update email to be %s, got %s", newEmail, userRepo.lastUpdate.Email)
	}
	if regMock.resendUserID != 99 {
		t.Errorf("expected ResendInitialPassword for userID 99, got %d", regMock.resendUserID)
	}
	if regMock.resendEmail != newEmail {
		t.Errorf("expected ResendInitialPassword for %s, got %s", newEmail, regMock.resendEmail)
	}
}

func TestUpdateUserByID_ActiveUser_EmailChanged_DoesNotResendInitialInvite(t *testing.T) {
	oldEmail := "active@example.com"
	activeStatus := "active"
	userRepo := &mockUserRepo{
		userByID: &repository.User{
			ID:           88,
			Email:        &oldEmail,
			Status:       &activeStatus,
			PasswordHash: "$2a$10$something",
		},
	}
	regMock := &mockRegisterServiceForUser{}
	userSvc := service.NewUserService(userRepo, regMock)

	newEmail := "newactive@example.com"
	err := userSvc.UpdateUserByID(88, domain.UserUpdateRequest{
		Email:  newEmail,
		Status: "active",
	})
	if err != nil {
		t.Fatalf("expected nil error, got %v", err)
	}

	if regMock.resendUserID != 0 {
		t.Errorf("expected ResendInitialPassword NOT to be called for active user, but was called for %d", regMock.resendUserID)
	}
}
