package service

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

//	type UserResponseWithRoleName struct {
//		UserID       int     `db:"id" json:"user_id"`
//		UserName     string  `db:"username" json:"id"`
//		FirstName    *string `db:"firename" json:"first_name"`
//		LastName     *string `db:"lastname" json:"last_name"`
//		Email        *string `db:"email" json:"email"`
//		Phone        *string `db:"phone" json:"phone"`
//		RoleID       int     `db:"role_id" json:"role_id"`
//		RoleName     string  `db:"role_name" json:"role_name"`
//		DepartmentID int     `db:"department_id" json:"dep_id"`
//		IsActive     *int    `db:"is_active" json:"is_active"`
//	}
type UserResponseWithRoleName struct {
	ID                int      `db:"id" json:"user_id"`
	FirstName         *string  `db:"first_name" json:"first_name"`
	LastName          *string  `db:"last_name" json:"last_name"`
	Email             *string  `db:"email" json:"email"`
	Phone             *string  `db:"phone" json:"phone"`
	RoleID            int      `db:"role_id" json:"role_id"`
	RoleName          string   `db:"role_name" json:"role_name"`
	DepartmentID      int      `db:"department_id" json:"dep_id"`
	DepartmentIDAlias int      `db:"department_id" json:"department_id"`
	DepartmentName    *string  `db:"department_name" json:"department_name"`
	Status            *string  `db:"status" json:"status"`
	Permissions       []string `json:"permissions"`
}

type UserService interface {
	GetAllUsers() ([]domain.UserResponse, error)
	GetUserByID(int) (*domain.UserResponse, error)
	UpdateUserByID(int, domain.UserUpdateRequest) error
	UpdateUserStatusByID(int, string) error
	DeleteUsersByID(int) error
}

type UserQueryService interface {
	GetUserWithRolesName() ([]UserResponseWithRoleName, error)
	GetCurrentUser(userID int) (*UserResponseWithRoleName, error)
	GetUserByRolesID(int) ([]domain.UserResponse, error)
}
