package repository

type Role struct {
	RoleID   int    `db:"id"`
	RoleName string `db:"name"`
}
type RoleRepository interface {
	GetAll() ([]Role, error)
	GetByID(int) (*Role, error)
	Create(string) error
	UpdateByID(int, string) error
	DeleteByID(int) error
}
