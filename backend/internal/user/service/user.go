package service

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type UserResponseWithRoleName struct {
	UserID       int     `db:"id" json:"user_id"`
	UserName     string  `db:"username" json:"id"`
	FirstName    *string `db:"firename" json:"first_name"`
	LastName     *string `db:"lastname" json:"last_name"`
	Email        *string `db:"email" json:"email"`
	Phone        *string `db:"phone" json:"phone"`
	RoleID       int     `db:"role_id" json:"role_id"`
	RoleName     string  `db:"role_name" json:"role_name"`
	DepartmentID int     `db:"department_id" json:"dep_id"`
	IsActive     *int    `db:"is_active" json:"is_active"`
}

type UserService interface {
	GetAllUsers() ([]domain.UserResponse, error)
	GetUserByID(int) (*domain.UserResponse, error)
	DeleteUsersByID(int) error
}

type UserQueryService interface {
	GetUserWithRolesName() ([]UserResponseWithRoleName, error)
	GetCurrentUser(int) (*UserResponseWithRoleName, error)
	GetUserByRolesID(int) ([]domain.UserResponse, error)
}
