package service

type Role struct {
	RoleID   int    `db:"id" json:"role_id"`
	RoleName string `db:"name" json:"role_name"`
}
type RoleService interface {
	GetRole() ([]Role, error)
	GetRoleByID(int) (*Role, error)
	CreateRoles(string) error
	UpdateRoleByID(int, string) error
	DeleteRolesByID(int) error
}
