package repository

import "github.com/jmoiron/sqlx"

type userRepositoryDB struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) UserRepository {
	return userRepositoryDB{db: db}
}

func (u userRepositoryDB) GetAll() ([]User, error) {
	var users []User
	query := "select id, username, password_hash, first_name, last_name, email, phone, role_id, department_id, avatar_path, is_active from users"
	err := u.db.Select(&users, query)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (u userRepositoryDB) GetByID(id int) (*User, error) {
	var user User
	query := "select id, username, password_hash, first_name, last_name, email, phone, role_id, department_id, avatar_path, is_active from users where id = ?"
	err := u.db.Get(&user, query, id)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (u userRepositoryDB) DeleteByID(id int) error {
	query := "delete from users where id = ?"
	_, err := u.db.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}
