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
			UserID:       v.UserID,
			UserName:     v.UserName,
			Password:     v.Password,
			FirstName:    v.FirstName,
			LastName:     v.LastName,
			Email:        v.Email,
			Phone:        v.Phone,
			RoleID:       v.RoleID,
			DepartmentID: v.DepartmentID,
			AvatarPath:   v.AvatarPath,
			IsActive:     v.IsActive,
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
		UserID:       user.UserID,
		UserName:     user.UserName,
		Password:     user.Password,
		FirstName:    user.FirstName,
		LastName:     user.LastName,
		Email:        user.Email,
		Phone:        user.Phone,
		RoleID:       user.RoleID,
		DepartmentID: user.DepartmentID,
		AvatarPath:   user.AvatarPath,
		IsActive:     user.IsActive,
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
