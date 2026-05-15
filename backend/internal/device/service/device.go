package service

type DeviceResponse struct {
	ID           int64   `db:"id" json:"dev_id"`
	Name         string  `db:"name" json:"dev_name"`
	DeviceTypeID int     `db:"device_type_id" json:"dev_type"`
	Description  *string `db:"description" json:"dev_description"`
}
type DeviceService interface {
	GetAllDevices() ([]DeviceResponse, error)
	CreateDevices(string, string, int) error
	DeleteDevices(int) error
}
