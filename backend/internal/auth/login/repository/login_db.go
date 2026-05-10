package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type UserRow struct {
	UserID       int     `db:"id"`
	UserName     string  `db:"username"`
	Password     string  `db:"password_hash"`
	FirstName    string  `db:"first_name"`
	LastName     string  `db:"last_name"`
	Email        *string `db:"email"`
	Phone        *string `db:"phone"`
	RoleID       int     `db:"role_id"`
	DepartmentID int     `db:"department_id"`
	AvatarPath   *string `db:"avatar_path"`
	IsActive     int     `db:"is_active"`
}

type loginRepositoryDB struct {
	db *sqlx.DB
}

func NewLoginRepository(db *sqlx.DB) LoginRepository {
	return loginRepositoryDB{db: db}
}

func (u *UserRow) ToDomain() domain.User {
	user := domain.User{
		UserID:       u.UserID,
		UserName:     u.UserName,
		Password:     u.Password,
		FirstName:    &u.FirstName,
		LastName:     &u.LastName,
		RoleID:       u.RoleID,
		DepartmentID: u.DepartmentID,
		IsActive:     u.IsActive,
	}
	if u.Email != nil {
		user.Email = *u.Email
	}
	if u.Phone != nil {
		user.Phone = *u.Phone
	}
	if u.AvatarPath != nil {
		user.AvatarPath = u.AvatarPath
	}
	return user
}

func (l loginRepositoryDB) GetByUsername(username string) (*domain.User, error) {
	row := UserRow{}
	query := "select id, username, password_hash, first_name, last_name, email, phone, role_id, department_id, is_active from users where username = ?  "
	// if err := l.db.(&userdb, query, username); err != nil {
	err := l.db.Get(&row, query, username)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	user := row.ToDomain()
	// fmt.Println(user)
	return &user, nil
}
