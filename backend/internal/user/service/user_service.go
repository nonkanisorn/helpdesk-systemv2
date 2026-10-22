package service

import (
	"fmt"
	"strings"

	registerService "github.com/nonkanisorn/helpdesk-system/internal/auth/register/service"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	"github.com/nonkanisorn/helpdesk-system/internal/user/repository"
	"golang.org/x/crypto/bcrypt"
)

type userService struct {
	userRepo     repository.UserRepository
	registerServ registerService.RegisterService
}

func NewUserService(userRepo repository.UserRepository, registerServ registerService.RegisterService) UserService {
	return userService{
		userRepo:     userRepo,
		registerServ: registerServ,
	}
}

func normalizeUserStatus(status string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "", "active":
		return "active", nil
	case "inactive":
		return "inactive", nil
	case "pending":
		return "pending", nil
	default:
		return "", fmt.Errorf("invalid user status: %s", status)
	}
}

func (u userService) GetAllUsers() ([]domain.UserResponse, error) {
	users, err := u.userRepo.GetAll()
	if err != nil {
		return nil, err
	}
	var usersResponse []domain.UserResponse
	for _, v := range users {
		user := domain.UserResponse{
			ID:                v.ID,
			PasswordHash:      v.PasswordHash,
			FirstName:         v.FirstName,
			LastName:          v.LastName,
			Email:             v.Email,
			Phone:             v.Phone,
			RoleID:            v.RoleID,
			DepartmentID:      v.DepartmentID,
			DepartmentIDAlias: v.DepartmentID,
			Status:            v.Status,
		}

		usersResponse = append(usersResponse, user)
	}
	return usersResponse, nil
}

func (u userService) GetUserByID(id int) (*domain.UserResponse, error) {
	user, err := u.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	userResponse := domain.UserResponse{
		ID:                user.ID,
		PasswordHash:      user.PasswordHash,
		FirstName:         user.FirstName,
		LastName:          user.LastName,
		Email:             user.Email,
		Phone:             user.Phone,
		RoleID:            user.RoleID,
		DepartmentID:      user.DepartmentID,
		DepartmentIDAlias: user.DepartmentID,
		Status:            user.Status,
	}
	return &userResponse, nil
}

func (u userService) UpdateUserByID(id int, req domain.UserUpdateRequest) error {
	existingUser, _ := u.userRepo.GetByID(id)

	departmentID := req.DepartmentID
	if departmentID == 0 {
		departmentID = req.DepID
	}

	status := req.Status
	if status == "" {
		if req.IsActive != nil && *req.IsActive == 0 {
			status = "inactive"
		} else {
			status = "active"
		}
	}
	status, err := normalizeUserStatus(status)
	if err != nil {
		return err
	}

	var passwordHash *string
	if req.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
		if err != nil {
			return err
		}

		hashString := string(hash)
		passwordHash = &hashString
	}

	trimmedNewEmail := strings.TrimSpace(req.Email)
	err = u.userRepo.UpdateByID(id, repository.UserUpdate{
		PasswordHash: passwordHash,
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Email:        trimmedNewEmail,
		Phone:        req.Phone,
		RoleID:       req.RoleID,
		DepartmentID: departmentID,
		Status:       status,
	})
	if err != nil {
		return err
	}

	// If user was pending (waiting for initial password setup) and the email changed:
	// Invalidate previous tokens and automatically send the initial password setup link to the new email.
	if existingUser != nil && trimmedNewEmail != "" {
		isPending := (existingUser.Status != nil && *existingUser.Status == "pending") || existingUser.PasswordHash == ""
		emailChanged := existingUser.Email == nil || !strings.EqualFold(strings.TrimSpace(*existingUser.Email), trimmedNewEmail)
		if isPending && emailChanged && u.registerServ != nil {
			_ = u.registerServ.ResendInitialPassword(id, trimmedNewEmail)
		}
	}

	return nil
}

func (u userService) UpdateUserStatusByID(id int, status string) error {
	status, err := normalizeUserStatus(status)
	if err != nil {
		return err
	}

	err = u.userRepo.UpdateStatusByID(id, status)
	if err != nil {
		return err
	}
	return nil
}

func (u userService) DeleteUsersByID(id int) error {
	err := u.userRepo.DeleteByID(id)
	if err != nil {
		return err
	}
	return nil
}
