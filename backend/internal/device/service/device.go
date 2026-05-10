package service

type DeviceResponse struct {
	DeviceID          int64   `db:"dev_id" json:"dev_id"`
	DeviceName        string  `db:"dev_name" json:"dev_name"`
	DeviceType        int     `db:"dev_type" json:"dev_type"`
	DeviceDescription *string `json:"dev_description"`
}
type DeviceService interface {
	GetAllDevices() ([]DeviceResponse, error)
	CreateDevices(string, string, int) error
	DeleteDevices(int) error
}
