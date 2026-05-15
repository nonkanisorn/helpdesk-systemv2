package service

import (
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	"github.com/nonkanisorn/helpdesk-system/internal/user/repository"
)

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return userService{userRepo: userRepo}
}

func (u userService) GetAllUsers() ([]domain.UserResponse, error) {
	users, err := u.userRepo.GetAll()
	if err != nil {
		return nil, err
	}
	var usersResponse []domain.UserResponse
	for _, v := range users {
		user := domain.UserResponse{
			ID:           v.ID,
			PasswordHash: v.PasswordHash,
			FirstName:    v.FirstName,
			LastName:     v.LastName,
			Email:        v.Email,
			Phone:        v.Phone,
			RoleID:       v.RoleID,
			DepartmentID: v.DepartmentID,
			Status:       v.Status,
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
		ID:           user.ID,
		PasswordHash: user.PasswordHash,
		FirstName:    user.FirstName,
		LastName:     user.LastName,
		Email:        user.Email,
		Phone:        user.Phone,
		RoleID:       user.RoleID,
		DepartmentID: user.DepartmentID,
		Status:       user.Status,
	}
	return &userResponse, nil
}

func (u userService) DeleteUsersByID(id int) error {
	err := u.userRepo.DeleteByID(id)
	if err != nil {
		return err
	}
	return nil
}
