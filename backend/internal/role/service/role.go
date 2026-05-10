package service

type Role struct {
	RoleID   int    `db:"role_id" json:"role_id"`
	RoleName string `db:"role_name" json:"role_name"`
}
type RoleService interface {
	GetRole() ([]Role, error)
	GetRoleByID(int) (*Role, error)
	CreateRoles(string) error
	DeleteRolesByID(int) error
}
