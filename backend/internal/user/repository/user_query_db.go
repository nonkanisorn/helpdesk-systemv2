package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

type userQueryRepository struct {
	db *sqlx.DB
}

func NewUserQueryRepository(db *sqlx.DB) UserQueryRepository {
	return userQueryRepository{db: db}
}

func (u userQueryRepository) GetUserWithRolesName() ([]UserWithRolesName, error) {
	var users []UserWithRolesName
	query := "select id, username,  first_name, last_name, email, phone, u.role_id,r.role_name , department_id, is_active from users u join roles r on u.role_id  = r.role_id"
	err := u.db.Select(&users, query)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (u userQueryRepository) GetCurrentUser(id int) (*UserWithRolesName, error) {
	var user UserWithRolesName
	query := "select id,username, role_id , first_name,last_name,is_active from users where id = ? "
	err := u.db.Get(&user, query, id)
	if err != nil {
		return nil, err
	}
	fmt.Println("user", user)
	return &user, nil
}

func (u userQueryRepository) GetUserByRolesID(roleID int) ([]UserTechinicianRolesRow, error) {
	var userRoleTech []UserTechinicianRolesRow
	query := "select * from users where role_id = ? "
	err := u.db.Select(&userRoleTech, query, roleID)
	if err != nil {
		return nil, err
	}
	return userRoleTech, nil
}
