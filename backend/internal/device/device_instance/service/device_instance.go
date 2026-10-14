package service

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type DeviceInstanceResponse struct {
	ID             *int    `db:"id" json:"id"`
	DeviceID       *int    `db:"device_id" json:"device_id"`
	SerialNumber   string  `db:"serial_number" json:"serial_number"`
	DeviceNumber   int     `db:"device_number" json:"device_number"`
	DepartmentID   *int    `db:"department_id" json:"department_id"`
	Status         string  `db:"status" json:"status"`
	DeviceName     *string `db:"device_name" json:"device_name,omitempty"`
	DeviceTypeName *string `db:"device_type_name" json:"device_type_name,omitempty"`
	DepartmentName *string `db:"department_name" json:"department_name,omitempty"`
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
