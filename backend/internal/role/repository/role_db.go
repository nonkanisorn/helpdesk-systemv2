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
	query := "select id, name from roles"
	err := r.db.Select(&roles, query)
	if err != nil {
		return nil, err
	}
	return roles, nil
}

func (r roleRepositoryDB) GetByID(id int) (*Role, error) {
	role := Role{}
	query := "select id, name from roles where id = ?"
	err := r.db.Get(&role, query, id)
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (r roleRepositoryDB) Create(roleName string) error {
	fmt.Println(roleName)
	query := "insert into roles (name) values (?)"
	_, err := r.db.Exec(query, roleName)
	if err != nil {
		return err
	}
	return nil
}

func (r roleRepositoryDB) UpdateByID(id int, roleName string) error {
	query := "update roles set name = ? where id = ?"
	_, err := r.db.Exec(query, roleName, id)
	if err != nil {
		return err
	}
	return nil
}

func (r roleRepositoryDB) DeleteByID(id int) error {
	query := "delete from roles where id = ?"
	_, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}
