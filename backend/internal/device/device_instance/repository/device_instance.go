package repository

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type DeviceInstanceRepository interface {
	GetAll() ([]domain.DeviceInstance, error)
	Create(deviceID int, depID *int, serialNumber string) error
	UpdateDeviceInstanceByID(instanceID int, depID *int, serialNumber string) error
	DeleteDeviceInstanceByID(instanceID int) error
}
type DeviceInstanceQueryRepository interface {
	CheckSerialNumber(string) (int, error)
	GetDeviceInstanceByDeviceID(deviceID int) ([]domain.DeviceInstance, error)
	GetHistoryRepairDeviceInstanceByDeviceInstanceID(deviceInstanceID int) ([]domain.HistoryRepairDeviceInstance, error)
}
