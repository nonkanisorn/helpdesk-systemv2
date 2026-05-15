package repository

type DeviceType struct {
	ID   int64  `db:"id"`
	Name string `db:"name"`
}
type DeviceTypeRepository interface {
	GetAll() ([]DeviceType, error)
}
