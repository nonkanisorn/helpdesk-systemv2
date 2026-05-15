package service

type StatusResponse struct {
	ID   int64  `db:"id" json:"status_id"`
	Name string `db:"name" json:"status_name"`
}
type StatusService interface {
	CreateStatus(string) (*StatusResponse, error)
	GetStatusAll() ([]StatusResponse, error)
	GetStatusByID(int) (*StatusResponse, error)
	DeleteStatusByID(int) error
}
