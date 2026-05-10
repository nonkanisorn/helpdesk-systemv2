package repository

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type DeviceInstanceRepository interface {
	GetAll() ([]domain.DeviceInstance, error)
	Create(int, int, int, string) error
	DeleteDeviceInstanceByID(int) error
}
type DeviceInstanceQueryRepository interface {
	CheckSerialNumber(string) (int, error)
	GetDeviceInstanceByDeviceID(deviceID int) ([]domain.DeviceInstance, error)
	GetHistoryRepairDeviceInstanceByDeviceInstanceID(deviceInstanceID int) ([]domain.HistoryRepairDeviceInstance, error)
}
