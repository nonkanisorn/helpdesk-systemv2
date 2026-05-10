package repository

type Status struct {
	StatusID   int64  `db:"status_id" json:"statud_id"`
	StatusName string `db:"status_name" json:"status_name"`
}

type StatusRepository interface {
	Create(string) (*Status, error)
	GetAll() ([]Status, error)
	GetByID(int) (*Status, error)
	DeleteByID(int) error
}
