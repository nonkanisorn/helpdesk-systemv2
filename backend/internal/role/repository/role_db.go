package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

type roleRepositoryDB struct {
	db *sqlx.DB
}

func NewRoleRepositoryDB(db *sqlx.DB) RoleRepository {
	return roleRepositoryDB{db: db}
}

func (r roleRepositoryDB) GetAll() ([]Role, error) {
	roles := []Role{}
	query := "select role_id, role_name from roles"
	err := r.db.Select(&roles, query)
	if err != nil {
		return nil, err
	}
	return roles, nil
}

func (r roleRepositoryDB) GetByID(id int) (*Role, error) {
	return nil, nil
}

func (r roleRepositoryDB) Create(roleName string) error {
	fmt.Println(roleName)
	query := "insert into roles (role_name) values (?)"
	_, err := r.db.Exec(query, roleName)
	if err != nil {
		return err
	}
	return nil
}

func (r roleRepositoryDB) DeleteByID(id int) error {
	query := "delete from roles where role_id = ?"
	_, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}
