package service

type DeviceTypeResponse struct {
	DeviceTypeID   int64  `db:"devicetype_id" json:"devicetype_id"`
	DeviceTypeName string `db:"devicetype_name" json:"devicetype_name"`
}
type DeviceTypeService interface {
	GetAllDeviceType() ([]DeviceTypeResponse, error)
}
