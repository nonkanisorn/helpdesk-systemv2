package repository

type Device struct {
	ID                     int64   `db:"id"`
	Name                   string  `db:"name"`
	DeviceTypeID           int     `db:"device_type_id"`
	Description            *string `db:"description"`
	NumberOfInstanceDevice int     `db:"number_of_instance_device"`
}
type DeviceRepository interface {
	GetAll() ([]Device, error)
	Create(string, string, int) error
	Update(int, string, string, int) error
	Delete(int) error
	// GetByID() (Device, error)
}
