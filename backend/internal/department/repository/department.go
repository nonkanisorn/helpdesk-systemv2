package repository

type Department struct {
	DepartmentID   int64  `db:"dep_id"`
	DepartmentName string `db:"dep_name"`
}
type DepartmentRepository interface {
	GetAll() ([]Department, error)
	GetByID(int) (*Department, error)
	Create(string) error
	DeleteByID(int) error
}
