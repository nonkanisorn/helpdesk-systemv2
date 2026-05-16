package repository

type Status struct {
	ID   int64  `db:"id" json:"status_id"`
	Name string `db:"name" json:"status_name"`
}
type StatusRepository interface {
	Create(string) (*Status, error)
	GetAll() ([]Status, error)
	GetByID(int) (*Status, error)
	UpdateByID(int, string) (*Status, error)
	DeleteByID(int) error
}
