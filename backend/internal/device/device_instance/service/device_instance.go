package service

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type DeviceInstanceResponse struct {
	ID           *int   `db:"id"`
	DeviceID     *int   `db:"device_id"`
	SerialNumber string `db:"serial_number"`
	DeviceNumber int    `db:"device_number"`
	DepartmentID *int   `db:"department_id"`
	Status       string `db:"status"`
}
type DeviceInstanceService interface {
	GetAllDeviceInstance() ([]DeviceInstanceResponse, error)
	Create(deviceID int, depID *int, serialNumber string) error
	UpdateDeviceInstanceByID(instanceID int, depID *int, serialNumber string, status string) error
	DeleteDeviceInstanceByID(instanceID int) error
}

type DeviceInstanceQueryService interface {
	CheckSerialNumber(string) (*domain.DeviceInstanceResponse, error)
	GetDeviceInstanceByDeviceID(deviceID int) ([]domain.DeviceInstanceResponse, error)
	GetHistoryRepairDeviceInstanceByDeviceInstanceID(deviceInstanceID int) ([]domain.HistoryRepairDeviceInstanceResponse, error)
}
