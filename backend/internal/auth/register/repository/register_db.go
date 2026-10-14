package repository

import (
	"database/sql"

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
	query := `
		UPDATE users
		SET
			password_hash = ?,
			status = CASE
				WHEN status = 'pending' THEN 'active'
				ELSE status
			END
		WHERE id = ?
	`
	_, err := r.db.Exec(query, users.PasswordHash, users.UserID)
	if err != nil {
		return err
	}
	return nil
}

func (r registerRepositoryDB) CheckToken(token string) (*domain.Usertest, error) {
	var user domain.Usertest
	query := `
		SELECT user_id
		FROM user_invitation_tokens
		WHERE token_hash = ?
			AND used_at IS NULL
			AND (expires_at IS NULL OR expires_at > NOW())
	`
	err := r.db.Get(&user, query, token)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r registerRepositoryDB) SaveToken(userID *int, token string) error {
	query := `
		INSERT INTO user_invitation_tokens (
			user_id,
			token_hash,
			expires_at,
			created_at
		)
		VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY), NOW())
	`
	_, err := r.db.Exec(query, userID, token)
	if err != nil {
		return err
	}
	return nil
}

func (r registerRepositoryDB) FindUserIDByEmail(email string) (*int, error) {
	var userID int
	query := "SELECT id FROM users WHERE email = ? LIMIT 1"

	err := r.db.Get(&userID, query, email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &userID, nil
}

func (r registerRepositoryDB) MarkTokenUsed(token string) error {
	query := "UPDATE user_invitation_tokens SET used_at = NOW() WHERE token_hash = ?"
	_, err := r.db.Exec(query, token)
	if err != nil {
		return err
	}

	return nil
}
