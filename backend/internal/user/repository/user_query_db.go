package repository

import "github.com/jmoiron/sqlx"

type userQueryRepository struct {
	db *sqlx.DB
}

func NewUserQueryRepository(db *sqlx.DB) UserQueryRepository {
	return userQueryRepository{db: db}
}

//	func (u userQueryRepository) GetUserWithRolesName() ([]UserWithRolesName, error) {
//		var users []UserWithRolesName
//		query := "select id, username,  first_name, last_name, email, phone, u.role_id,r.role_name , department_id, is_active from users u join roles r on u.role_id  = r.role_id"
//		err := u.db.Select(&users, query)
//		if err != nil {
//			return nil, err
//		}
//		return users, nil
//	}
func (u userQueryRepository) GetUserWithRolesName() ([]UserWithRolesName, error) {
	var users []UserWithRolesName

	query := `
		SELECT 
			u.id,
			u.first_name,
			u.last_name,
			u.email,
			u.phone,
			COALESCE(u.role_id, 0) AS role_id,
			COALESCE(r.name, '-') AS role_name,
			COALESCE(u.department_id, 0) AS department_id,
			d.name AS department_name,
			u.status
		FROM users u
		LEFT JOIN roles r
			ON u.role_id = r.id
		LEFT JOIN departments d
			ON u.department_id = d.id
		ORDER BY u.id
	`

	err := u.db.Select(&users, query)
	if err != nil {
		return nil, err
	}

	return users, nil
}

//	func (u userQueryRepository) GetCurrentUser(id int) (*UserWithRolesName, error) {
//		var user UserWithRolesName
//		query := "select id,username, role_id , first_name,last_name,is_active from users where id = ? "
//		err := u.db.Get(&user, query, id)
//		if err != nil {
//			return nil, err
//		}
//		fmt.Println("user", user)
//		return &user, nil
//	}
func (u userQueryRepository) GetCurrentUser(id int) (*UserWithRolesName, error) {
	var user UserWithRolesName

	query := `
		SELECT 
			u.id,
			u.first_name,
			u.last_name,
			u.email,
			u.phone,
			COALESCE(u.role_id, 0) AS role_id,
			COALESCE(r.name, '-') AS role_name,
			COALESCE(u.department_id, 0) AS department_id,
			d.name AS department_name,
			u.status
		FROM users u
		LEFT JOIN roles r
			ON u.role_id = r.id
		LEFT JOIN departments d
			ON u.department_id = d.id
		WHERE u.id = ?
	`

	err := u.db.Get(&user, query, id)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

//	func (u userQueryRepository) GetUserByRolesID(roleID int) ([]UserTechinicianRolesRow, error) {
//		var userRoleTech []UserTechinicianRolesRow
//		query := "select * from users where role_id = ? "
//		err := u.db.Select(&userRoleTech, query, roleID)
//		if err != nil {
//			return nil, err
//		}
//		return userRoleTech, nil
//	}
func (u userQueryRepository) GetUserByRolesID(roleID int) ([]UserTechinicianRolesRow, error) {
	var userRoleTech []UserTechinicianRolesRow

	query := `
		SELECT 
			id,
			COALESCE(first_name, '') AS first_name,
			COALESCE(last_name, '') AS last_name,
			COALESCE(email, '') AS email,
			COALESCE(phone, '') AS phone,
			role_id,
			COALESCE(department_id, 0) AS department_id,
			COALESCE(status, '') AS status
		FROM users
		WHERE role_id = ?
			AND status = 'active'
		ORDER BY first_name, last_name, id
	`

	err := u.db.Select(&userRoleTech, query, roleID)
	if err != nil {
		return nil, err
	}

	return userRoleTech, nil
}
