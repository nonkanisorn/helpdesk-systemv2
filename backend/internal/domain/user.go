package domain

type User struct {
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
type UserRequest struct {
	UserName string `json:"username"`
	Password string `json:"password"`
}
type UserTechnicianRolesResponse struct {
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

type UserResponse struct {
	UserID       int     `db:"id" json:"user_id"`
	UserName     string  `db:"username" json:"username"`
	Password     string  `db:"password_hash" json:"password"`
	FirstName    *string `db:"first_namename" json:"first_name"`
	LastName     *string `db:"last_name" json:"last_name"`
	Email        *string `db:"email" json:"email"`
	Phone        *string `db:"phone" json:"phone"`
	RoleID       int     `db:"role_id" json:"role_id"`
	DepartmentID int     `db:"department_id" json:"dep_id"`
	AvatarPath   *string `db:"avatar_path" json:"avatar_path"`
	IsActive     *int    `db:"is_active" json:"is_active"`
}
