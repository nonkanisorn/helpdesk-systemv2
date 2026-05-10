package service

import (
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	"github.com/nonkanisorn/helpdesk-system/internal/user/repository"
)

type userQueryService struct {
	userQeryRepo repository.UserQueryRepository
}

func NewUserQueryService(userQueryRepo repository.UserQueryRepository) UserQueryService {
	return userQueryService{userQeryRepo: userQueryRepo}
}

func (u userQueryService) GetUserWithRolesName() ([]UserResponseWithRoleName, error) {
	users, err := u.userQeryRepo.GetUserWithRolesName()
	if err != nil {
		return nil, err
	}
	userDTO := []UserResponseWithRoleName{}
	for _, v := range users {
		userAppend := UserResponseWithRoleName{
			UserID:       v.UserID,
			UserName:     v.UserName,
			FirstName:    v.FirstName,
			LastName:     v.LastName,
			Email:        v.Email,
			Phone:        v.Phone,
			RoleID:       v.RoleID,
			RoleName:     v.RoleName,
			DepartmentID: v.DepartmentID,
			IsActive:     v.IsActive,
		}
		userDTO = append(userDTO, userAppend)
	}
	return userDTO, nil
}

func (u userQueryService) GetCurrentUser(id int) (*UserResponseWithRoleName, error) {
	user, err := u.userQeryRepo.GetCurrentUser(id)
	if err != nil {
		return nil, err
	}
	userRes := UserResponseWithRoleName{
		UserID:    user.UserID,
		UserName:  user.UserName,
		FirstName: user.FirstName,
		LastName:  user.LastName, Email: user.Email,
		Phone:        user.Phone,
		RoleID:       user.RoleID,
		RoleName:     user.RoleName,
		DepartmentID: user.DepartmentID,
		IsActive:     user.IsActive,
	}

	return &userRes, nil
}

func (u userQueryService) GetUserByRolesID(id int) ([]domain.UserResponse, error) {
	userRoleTech, err := u.userQeryRepo.GetUserByRolesID(id)
	if err != nil {
		return nil, err
	}
	userRes := []domain.UserResponse{}
	for _, v := range userRoleTech {
		userRole := domain.UserResponse{
			UserID:       v.UserID,
			UserName:     v.UserName,
			FirstName:    &v.FirstName,
			LastName:     &v.LastName,
			Email:        &v.Email,
			Phone:        &v.Phone,
			RoleID:       v.RoleID,
			DepartmentID: v.DepartmentID,
			IsActive:     &v.IsActive,
		}
		userRes = append(userRes, userRole)
	}

	return userRes, nil
}
