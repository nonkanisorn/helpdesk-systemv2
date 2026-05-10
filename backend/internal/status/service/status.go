package service

type StatusResponse struct {
	StatusID   int64  `db:"status_id" json:"status_id"`
	StatusName string `db:"status_name" json:"status_name"`
}
type StatusService interface {
	CreateStatus(string) (*StatusResponse, error)
	GetStatusAll() ([]StatusResponse, error)
	GetStatusByID(int) (*StatusResponse, error)
	DeleteStatusByID(int) error
}
