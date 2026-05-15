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

//	func (r registerRepositoryDB) Create(user *domain.User) error {
//		query := "insert into users (username, password_hash, first_name, last_name, email, phone, role_id, department_id, avatar_path, is_active) values(?,?,?,?,?,?,?,?,?,?)"
//		_, err := r.db.Exec(query, user.UserName, user.Password, user.FirstName, user.LastName, user.Email, user.Phone, user.RoleID, user.DepartmentID, user.AvatarPath, user.IsActive)
//		if err != nil {
//			return err
//		}
//		return nil
//	}
func (r registerRepositoryDB) Create(user *domain.User) error {
	query := `
		INSERT INTO users (
			password_hash,
			first_name,
			last_name,
			email,
			phone,
			role_id,
			department_id,
			status
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`

	_, err := r.db.Exec(
		query,
		user.PasswordHash,
		user.FirstName,
		user.LastName,
		user.Email,
		user.Phone,
		user.RoleID,
		user.DepartmentID,
		user.Status,
	)
	if err != nil {
		return err
	}

	return nil
}

func (r registerRepositoryDB) CreateTest(users *domain.Usertest) (*int, error) {
	query := "insert into users (email,status,first_name,last_name,phone,role_id,department_id,created_at) values(?,?,?,?,?,?,?,NOW())"
	result, err := r.db.Exec(query, users.Email, "pending", users.FirstName, users.LastName, users.Phone, users.RoleID, users.DepartmentID)
	if err != nil {
		return nil, err
	}
	lastID, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	id := int(lastID)
	return &id, nil
}

func (r registerRepositoryDB) SetPassword(users *domain.Usertest) error {
	query := "update users set password_hash = ? , status = ? where id = ?  "
	_, err := r.db.Exec(query, users.PasswordHash, "active", users.UserID)
	if err != nil {
		return err
	}
	return nil
}

func (r registerRepositoryDB) CheckToken(token string) (*domain.Usertest, error) {
	var user domain.Usertest
	query := "select user_id from user_invitation_tokens where token_hash = ? "
	err := r.db.Get(&user, query, token)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r registerRepositoryDB) SaveToken(userID *int, token string) error {
	query := "insert into user_invitation_tokens (user_id,token_hash) values(?,?)"
	_, err := r.db.Exec(query, userID, token)
	if err != nil {
		return err
	}
	return nil
}
