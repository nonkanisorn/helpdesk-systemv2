package repository

import (
	"strings"

	"github.com/jmoiron/sqlx"
)

type userRepositoryDB struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) UserRepository {
	return userRepositoryDB{db: db}
}

func (u userRepositoryDB) GetAll() ([]User, error) {
	var users []User
	query := `
		SELECT
			id,
			COALESCE(password_hash, '') AS password_hash,
			first_name,
			last_name,
			email,
			phone,
			COALESCE(role_id, 0) AS role_id,
			COALESCE(department_id, 0) AS department_id,
			status
		FROM users
		WHERE status IS NULL OR status <> 'deleted'
		ORDER BY id
	`
	err := u.db.Select(&users, query)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (u userRepositoryDB) GetByID(id int) (*User, error) {
	var user User
	query := `
		SELECT
			id,
			COALESCE(password_hash, '') AS password_hash,
			first_name,
			last_name,
			email,
			phone,
			COALESCE(role_id, 0) AS role_id,
			COALESCE(department_id, 0) AS department_id,
			status
		FROM users
		WHERE id = ?
	`
	err := u.db.Get(&user, query, id)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (u userRepositoryDB) UpdateByID(id int, user UserUpdate) error {
	setPassword := user.PasswordHash != nil && strings.TrimSpace(*user.PasswordHash) != ""

	query := `
		UPDATE users
		SET first_name = ?,
			last_name = ?,
			email = ?,
			phone = ?,
			role_id = ?,
			department_id = ?,
			status = ?
	`

	args := []any{
		user.FirstName,
		user.LastName,
		user.Email,
		user.Phone,
		user.RoleID,
		user.DepartmentID,
		user.Status,
	}

	if setPassword {
		query += ", password_hash = ?"
		args = append(args, *user.PasswordHash)
	}

	query += `
		WHERE id = ?
	`
	args = append(args, id)

	_, err := u.db.Exec(query, args...)
	if err != nil {
		return err
	}

	return nil
}

func (u userRepositoryDB) UpdateStatusByID(id int, status string) error {
	query := "update users set status = ? where id = ?"
	_, err := u.db.Exec(query, status, id)
	if err != nil {
		return err
	}
	return nil
}

func (u userRepositoryDB) DeleteByID(id int) error {
	query := "UPDATE users SET status = 'deleted' WHERE id = ?"
	_, err := u.db.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}
