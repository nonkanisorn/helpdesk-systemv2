package repository

import (
	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type registerRepositoryDB struct {
	db *sqlx.DB
}

type UserRow struct {
	UserID       int     `db:"id"`
	UserName     string  `db:"username"`
	Password     string  `db:"password"`
	FirstName    *string `db:"first_name"`
	LastName     *string `db:"last_name"`
	Email        *string `db:"email"`
	Phone        *string `db:"phone"`
	Name         *string `db:"name"`
	RoleID       int     `db:"role_id"`
	DepartmentID int     `db:"department_id"`
	AvatarPath   *string `db:"avatar_path"`
	IsActive     *int    `db:"is_active"`
}

func NewRegisterRepository(db *sqlx.DB) RegisterRepository {
	return registerRepositoryDB{db: db}
}

func (r registerRepositoryDB) Create(user *domain.User) error {
	query := "insert into users (username, password_hash, first_name, last_name, email, phone, role_id, department_id, avatar_path, is_active) values(?,?,?,?,?,?,?,?,?,?)"
	_, err := r.db.Exec(query, user.UserName, user.Password, user.FirstName, user.LastName, user.Email, user.Phone, user.RoleID, user.DepartmentID, user.AvatarPath, user.IsActive)
	if err != nil {
		return err
	}
	return nil
}
