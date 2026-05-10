package repository

type Role struct {
	RoleID   int    `db:"role_id"`
	RoleName string `db:"role_name"`
}
type RoleRepository interface {
	GetAll() ([]Role, error)
	GetByID(int) (*Role, error)
	Create(string) error
	DeleteByID(int) error
}
