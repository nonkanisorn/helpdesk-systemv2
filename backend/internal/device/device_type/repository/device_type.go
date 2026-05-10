package repository

type DeviceType struct {
	DeviceTypeID   int64  `db:"devicetype_id"`
	DeviceTypeName string `db:"devicetype_name"`
}
type DeviceTypeRepository interface {
	GetAll() ([]DeviceType, error)
}
