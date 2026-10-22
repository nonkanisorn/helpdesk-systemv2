package repository

//	type User struct {
//		UserID       int     `db:"id"`
//		UserName     string  `db:"username"`
//		Password     string  `db:"password_hash"`
//		FirstName    *string `db:"first_name"`
//		LastName     *string `db:"last_name"`
//		Email        *string `db:"email"`
//		Phone        *string `db:"phone"`
//		RoleID       int     `db:"role_id"`
//		DepartmentID int     `db:"department_id"`
//		AvatarPath   *string `db:"avatar_path"`
//		IsActive     *int    `db:"is_active"`
//	}
//
//	type UserWithRolesName struct {
//		UserID       int     `db:"id"`
//		UserName     string  `db:"username"`
//		Password     string  `db:"password_hash"`
//		FirstName    *string `db:"first_name"`
//		LastName     *string `db:"last_name"`
//		Email        *string `db:"email"`
//		Phone        *string `db:"phone"`
//		RoleID       int     `db:"role_id"`
//		RoleName     string  `db:"role_name"`
//		DepartmentID int     `db:"department_id"`
//		AvatarPath   *string `db:"avatar_path"`
//		IsActive     *int    `db:"is_active"`
//	}
//
//	type UserTechinicianRolesRow struct {
//		UserID       int     `db:"id" json:"id"`
//		UserName     string  `db:"username" json:"username"`
//		Password     string  `db:"password_hash" json:"password"`
//		FirstName    string  `db:"first_name" json:"first_name"`
//		LastName     string  `db:"last_name" json:"last_name"`
//		Email        string  `db:"email" json:"email"`
//		Phone        string  `db:"phone" json:"phone"`
//		RoleID       int     `db:"role_id" json:"role_id"`
//		DepartmentID int     `db:"department_id" json:"department_id"`
//		AvatarPath   *[]byte `db:"avatar_path" json:"avatar_path"`
//		IsActive     int     `db:"is_active" json:"is_active"`
//	}
type User struct {
	ID           int     `db:"id"`
	PasswordHash string  `db:"password_hash"`
	FirstName    *string `db:"first_name"`
	LastName     *string `db:"last_name"`
	Email        *string `db:"email"`
	Phone        *string `db:"phone"`
	RoleID       int     `db:"role_id"`
	DepartmentID int     `db:"department_id"`
	Status       *string `db:"status"`
}

type UserUpdate struct {
	PasswordHash *string
	FirstName    string
	LastName     string
	Email        string
	Phone        string
	RoleID       int
	DepartmentID int
	Status       string
}

type UserWithRolesName struct {
	ID             int     `db:"id"`
	PasswordHash   string  `db:"password_hash"`
	FirstName      *string `db:"first_name"`
	LastName       *string `db:"last_name"`
	Email          *string `db:"email"`
	Phone          *string `db:"phone"`
	RoleID         int     `db:"role_id"`
	RoleName       string  `db:"role_name"`
	DepartmentID   int     `db:"department_id"`
	DepartmentName *string `db:"department_name"`
	Status         *string `db:"status"`
}

type UserTechinicianRolesRow struct {
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
type UserRepository interface {
	GetAll() ([]User, error)
	GetByID(int) (*User, error)
	UpdateByID(int, UserUpdate) error
	UpdateStatusByID(int, string) error
	DeleteByID(int) error
}

type UserQueryRepository interface {
	GetUserWithRolesName() ([]UserWithRolesName, error)
	GetCurrentUser(int) (*UserWithRolesName, error)
	GetUserByRolesID(int) ([]UserTechinicianRolesRow, error)
	GetUsersByPermission(string) ([]UserTechinicianRolesRow, error)
}
