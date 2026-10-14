package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type roleRepositoryDB struct {
	db *sqlx.DB
}

func NewRoleRepositoryDB(db *sqlx.DB) RoleRepository {
	return roleRepositoryDB{db: db}
}

func (r roleRepositoryDB) GetAll() ([]Role, error) {
	roles := []Role{}
	query := "select id, name from roles where deleted_at is null order by id"
	err := r.db.Select(&roles, query)
	if err != nil {
		return nil, err
	}
	return roles, nil
}

func (r roleRepositoryDB) GetByID(id int) (*Role, error) {
	role := Role{}
	query := "select id, name from roles where id = ? and deleted_at is null"
	err := r.db.Get(&role, query, id)
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (r roleRepositoryDB) Create(roleName string) (int, error) {
	fmt.Println(roleName)
	query := "insert into roles (name) values (?)"
	result, err := r.db.Exec(query, roleName)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func (r roleRepositoryDB) UpdateByID(id int, roleName string) error {
	query := "update roles set name = ? where id = ? and deleted_at is null"
	_, err := r.db.Exec(query, roleName, id)
	if err != nil {
		return err
	}
	return nil
}

func (r roleRepositoryDB) DeleteByID(id int) error {
	var userCount int
	if err := r.db.Get(
		&userCount,
		"select count(1) from users where role_id = ? and status <> 'inactive'",
		id,
	); err != nil {
		return err
	}
	if userCount > 0 {
		return fmt.Errorf("%w: ไม่สามารถลบบทบาทได้ เนื่องจากยังมีผู้ใช้ที่ใช้บทบาทนี้อยู่", domain.ErrResourceInUse)
	}

	query := "update roles set deleted_at = now() where id = ? and deleted_at is null"
	_, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}
