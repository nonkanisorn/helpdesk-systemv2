package repository

import "github.com/jmoiron/sqlx"

type permissionRepositoryDB struct {
	db *sqlx.DB
}

func NewPermissionRepository(db *sqlx.DB) PermissionRepository {
	return permissionRepositoryDB{db: db}
}

func (p permissionRepositoryDB) GetAllPermissions() ([]PermissionRow, error) {
	permissions := []PermissionRow{}
	query := `
		SELECT
			id,
			name,
			description
		FROM permissions
		ORDER BY name
	`

	err := p.db.Select(&permissions, query)
	if err != nil {
		return nil, err
	}

	return permissions, nil
}

func (p permissionRepositoryDB) GetPermissionsByRoleID(roleID int) ([]PermissionRow, error) {
	permissions := []PermissionRow{}
	query := `
		SELECT
			p.id,
			p.name,
			p.description
		FROM role_permissions rp
		JOIN roles r
			ON r.id = rp.role_id
			AND r.deleted_at IS NULL
		JOIN permissions p
			ON p.id = rp.permission_id
		WHERE rp.role_id = ?
		ORDER BY p.name
	`

	err := p.db.Select(&permissions, query, roleID)
	if err != nil {
		return nil, err
	}

	return permissions, nil
}

func (p permissionRepositoryDB) GetPermissionsByUserID(userID int) ([]PermissionRow, error) {
	permissions := []PermissionRow{}
	query := `
		SELECT
			p.id,
			p.name,
			p.description
		FROM users u
		JOIN roles r
			ON r.id = u.role_id
			AND r.deleted_at IS NULL
		JOIN role_permissions rp
			ON rp.role_id = u.role_id
		JOIN permissions p
			ON p.id = rp.permission_id
		WHERE u.id = ?
			AND u.status = 'active'
		ORDER BY p.name
	`

	err := p.db.Select(&permissions, query, userID)
	if err != nil {
		return nil, err
	}

	return permissions, nil
}

func (p permissionRepositoryDB) RoleHasPermission(roleID int, permissionName string) (bool, error) {
	var count int
	query := `
		SELECT COUNT(1)
		FROM role_permissions rp
		JOIN roles r
			ON r.id = rp.role_id
			AND r.deleted_at IS NULL
		JOIN permissions p
			ON p.id = rp.permission_id
		WHERE rp.role_id = ?
			AND p.name = ?
	`

	err := p.db.Get(&count, query, roleID, permissionName)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (p permissionRepositoryDB) SetRolePermissions(roleID int, permissionIDs []int) error {
	tx, err := p.db.Beginx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.Exec("DELETE FROM role_permissions WHERE role_id = ?", roleID); err != nil {
		return err
	}

	for _, permissionID := range permissionIDs {
		if _, err := tx.Exec(
			"INSERT INTO role_permissions (role_id, permission_id, created_at) VALUES (?, ?, NOW())",
			roleID,
			permissionID,
		); err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (p permissionRepositoryDB) GetPermissionIDsByNames(permissionNames []string) ([]int, error) {
	if len(permissionNames) == 0 {
		return []int{}, nil
	}

	query, args, err := sqlx.In(
		"SELECT id FROM permissions WHERE name IN (?) ORDER BY name",
		permissionNames,
	)
	if err != nil {
		return nil, err
	}
	query = p.db.Rebind(query)

	permissionIDs := []int{}
	if err := p.db.Select(&permissionIDs, query, args...); err != nil {
		return nil, err
	}

	return permissionIDs, nil
}
