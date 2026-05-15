package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type UserRowold struct {
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
type UserRow struct {
	ID           int     `db:"id"`
	PasswordHash string  `db:"password_hash"`
	FirstName    string  `db:"first_name"`
	LastName     string  `db:"last_name"`
	Email        *string `db:"email"`
	Phone        *string `db:"phone"`
	RoleID       int     `db:"role_id"`
	DepartmentID int     `db:"department_id"`
	Status       string  `db:"status"`
}
type loginRepositoryDB struct {
	db *sqlx.DB
}

func NewLoginRepository(db *sqlx.DB) LoginRepository {
	return loginRepositoryDB{db: db}
}

func (u *UserRow) ToDomain() domain.User {
	user := domain.User{
		ID:           u.ID,
		PasswordHash: u.PasswordHash,
		FirstName:    &u.FirstName,
		LastName:     &u.LastName,
		RoleID:       u.RoleID,
		DepartmentID: u.DepartmentID,
		Status:       u.Status,
	}

	if u.Email != nil {
		user.Email = *u.Email
	}

	if u.Phone != nil {
		user.Phone = *u.Phone
	}

	return user
}

//	func (l loginRepositoryDB) GetByUsername(username string) (*domain.User, error) {
//		row := UserRow{}
//		query := "select id, username, password_hash, first_name, last_name, email, phone, role_id, department_id, is_active from users where username = ?  "
//		// if err := l.db.(&userdb, query, username); err != nil {
//		err := l.db.Get(&row, query, username)
//		if err != nil {
//			fmt.Println(err)
//			return nil, err
//		}
//		user := row.ToDomain()
//		// fmt.Println(user)
//		return &user, nil
//	}
func (l loginRepositoryDB) GetByEmail(email string) (*domain.User, error) {
	row := UserRow{}

	query := `
		SELECT 
			id,
			password_hash,
			first_name,
			last_name,
			email,
			phone,
			role_id,
			department_id,
			status
		FROM users
		WHERE email = ?
	`
	fmt.Println("db", email)
	err := l.db.Get(&row, query, email)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	user := row.ToDomain()

	return &user, nil
}
