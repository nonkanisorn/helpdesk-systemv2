package repository

type Department struct {
	ID   int64  `db:"id"`
	Name string `db:"name"`
}
type DepartmentRepository interface {
	GetAll() ([]Department, error)
	GetByID(int) (*Department, error)
	Create(string) error
	UpdateByID(int, string) error
	DeleteByID(int) error
}
