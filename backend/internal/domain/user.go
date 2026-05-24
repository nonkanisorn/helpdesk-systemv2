package domain

import "time"

type Userold struct {
	UserID       int     `db:"id" json:"id"`
	UserName     string  `db:"username" json:"username"`
	Password     string  `db:"password_hash" json:"password"`
	FirstName    *string `db:"first_name" json:"first_name"`
	LastName     *string `db:"last_name" json:"last_name"`
	Email        string  `db:"email" json:"email"`
	Phone        string  `db:"phone" json:"phone"`
	RoleID       int     `db:"role_id" json:"role_id"`
	DepartmentID int     `db:"department_id" json:"department_id"`
	AvatarPath   *string `db:"avatar_path" json:"avatar_path"`
	IsActive     int     `db:"is_active" json:"is_active"`
}
type User struct {
	ID           int      `db:"id" json:"id"`
	PasswordHash string   `db:"password_hash" json:"password"`
	FirstName    *string  `db:"first_name" json:"first_name"`
	LastName     *string  `db:"last_name" json:"last_name"`
	Email        string   `db:"email" json:"email"`
	Phone        string   `db:"phone" json:"phone"`
	RoleID       int      `db:"role_id" json:"role_id"`
	RoleName     string   `db:"role_name" json:"role_name"`
	DepartmentID int      `db:"department_id" json:"department_id"`
	Status       string   `db:"status" json:"status"`
	Permissions  []string `json:"permissions"`
}
type UserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
type UserTechnicianRolesResponseold struct {
	UserID       int    `db:"id" json:"id"`
	UserName     string `db:"username" json:"username"`
	Password     string `db:"password_hash" json:"password"`
	FirstName    string `db:"first_name" json:"first_name"`
	LastName     string `db:"last_name" json:"last_name"`
	Email        string `db:"email" json:"email"`
	Phone        string `db:"phone" json:"phone"`
	RoleID       int    `db:"role_id" json:"role_id"`
	DepartmentID int    `db:"department_id" json:"department_id"`
	AvatarPath   []byte `db:"avatar_path" json:"avatar_path"`
	IsActive     int    `db:"is_active" json:"is_active"`
}
type UserTechnicianRolesResponse struct {
	ID           int    `db:"id" json:"id"`
	PasswordHash string `db:"password_hash" json:"password"`
	FirstName    string `db:"first_name" json:"first_name"`
	LastName     string `db:"last_name" json:"last_name"`
	Email        string `db:"email" json:"email"`
	Phone        string `db:"phone" json:"phone"`
	RoleID       int    `db:"role_id" json:"role_id"`
	DepartmentID int    `db:"department_id" json:"department_id"`
	Status       string `db:"status" json:"status"`
}

//	type UserResponse struct {
//		UserID       int     `db:"id" json:"user_id"`
//		UserName     string  `db:"username" json:"username"`
//		Password     string  `db:"password_hash" json:"password"`
//		FirstName    *string `db:"first_namename" json:"first_name"`
//		LastName     *string `db:"last_name" json:"last_name"`
//		Email        *string `db:"email" json:"email"`
//		Phone        *string `db:"phone" json:"phone"`
//		RoleID       int     `db:"role_id" json:"role_id"`
//		DepartmentID int     `db:"department_id" json:"dep_id"`
//		AvatarPath   *string `db:"avatar_path" json:"avatar_path"`
//		IsActive     *int    `db:"is_active" json:"is_active"`
//	}
type UserResponse struct {
	ID                int     `db:"id" json:"user_id"`
	PasswordHash      string  `db:"password_hash" json:"password"`
	FirstName         *string `db:"first_name" json:"first_name"`
	LastName          *string `db:"last_name" json:"last_name"`
	Email             *string `db:"email" json:"email"`
	Phone             *string `db:"phone" json:"phone"`
	RoleID            int     `db:"role_id" json:"role_id"`
	DepartmentID      int     `db:"department_id" json:"dep_id"`
	DepartmentIDAlias int     `db:"department_id" json:"department_id"`
	Status            *string `db:"status" json:"status"`
}

type UserUpdateRequest struct {
	Password     string `json:"password"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Email        string `json:"email"`
	Phone        string `json:"phone"`
	RoleID       int    `json:"role_id"`
	DepartmentID int    `json:"department_id"`
	DepID        int    `json:"dep_id"`
	Status       string `json:"status"`
	IsActive     *int   `json:"is_active"`
}
type Usertestold struct {
	ID       *int    `db:"id" json:"id"`
	Email    *string `db:"email" json:"email"`
	Password *string `db:"password_hash" json:"password"`
	Status   *int    `db:"status" json:"status"`
	Token    *string `db:"token_hash" json:"token"`
	UserID   *int    `db:"users_id" json:"users_id"`
}

// type Usertest struct {
// 	ID           *int    `db:"id" json:"id"`
// 	Email        *string `db:"email" json:"email"`
// 	PasswordHash *string `db:"password_hash" json:"password"`
// 	Status       *string `db:"status" json:"status"`
// 	TokenHash    *string `db:"token_hash" json:"token"`
// 	UserID       *int    `db:"user_id" json:"users_id"`
// }

type Usertest struct {
	ID           int        `db:"id" json:"id"`
	PasswordHash *string    `db:"password_hash" json:"password"`
	FirstName    *string    `db:"first_name" json:"first_name"`
	LastName     *string    `db:"last_name" json:"last_name"`
	Email        *string    `db:"email" json:"email"`
	Phone        *string    `db:"phone" json:"phone"`
	RoleID       *int       `db:"role_id" json:"role_id"`
	DepartmentID *int       `db:"department_id" json:"department_id"`
	Status       *string    `db:"status" json:"status"`
	TokenHash    *string    `db:"token_hash" json:"token"`
	UserID       *int       `db:"user_id" json:"user_id"`
	CreatedAt    *time.Time `db:"created_at" json:"created_at"`
}
