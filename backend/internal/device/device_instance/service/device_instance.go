package service

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type DeviceInstanceResponse struct {
	DeviceInstanceID *int   `db:"instance_id"`
	DeviceID         *int   `db:"device_id"`
	SerialNumber     string `db:"serial_number"`
	DeviceName       int    `db:"device_number"`
	DepID            *int   `db:"dep_id"`
}
type DeviceInstanceService interface {
	GetAllDeviceInstance() ([]DeviceInstanceResponse, error)
	Create(deviceID int, depID int, serialNumber string) error
	DeleteDeviceInstanceByID(instanceID int) error
}

type DeviceInstanceQueryService interface {
	CheckSerialNumber(string) (*domain.DeviceInstanceResponse, error)
	GetDeviceInstanceByDeviceID(deviceID int) ([]domain.DeviceInstanceResponse, error)
	GetHistoryRepairDeviceInstanceByDeviceInstanceID(deviceInstanceID int) ([]domain.HistoryRepairDeviceInstanceResponse, error)
}
