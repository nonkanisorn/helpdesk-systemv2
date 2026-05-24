package repository

type PermissionRow struct {
	ID          int     `db:"id"`
	Name        string  `db:"name"`
	Description *string `db:"description"`
}

type RolePermissionRow struct {
	RoleID       int `db:"role_id"`
	PermissionID int `db:"permission_id"`
}

type PermissionRepository interface {
	GetAllPermissions() ([]PermissionRow, error)
	GetPermissionsByRoleID(roleID int) ([]PermissionRow, error)
	GetPermissionsByUserID(userID int) ([]PermissionRow, error)
	RoleHasPermission(roleID int, permissionName string) (bool, error)
	SetRolePermissions(roleID int, permissionIDs []int) error
	GetPermissionIDsByNames(permissionNames []string) ([]int, error)
}
