package repository

type DeviceType struct {
	ID   int64  `db:"id"`
	Name string `db:"name"`
}
type DeviceTypeRepository interface {
	GetAll() ([]DeviceType, error)
	Create(string) error
	UpdateByID(int, string) error
	DeleteByID(int) error
}
