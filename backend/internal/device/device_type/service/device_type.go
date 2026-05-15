package service

type DeviceTypeResponse struct {
	ID   int64  `db:"id" json:"devicetype_id"`
	Name string `db:"name" json:"devicetype_name"`
}
type DeviceTypeService interface {
	GetAllDeviceType() ([]DeviceTypeResponse, error)
}
